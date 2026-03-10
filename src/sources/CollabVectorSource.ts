/**
 * CollabVectorSource - OpenLayers source for collaborative vector layers
 * @migrated from ol/source/CollabVector.js of the CordovApp module
 */

import { ProjectionUtils } from '../utils/ProjectionUtils';

import { COLLAB_VECTOR_DEFAULT_VALUES, DEFAULT_VECTOR_PROJECTION_CODE } from './DefaultSourceValues';

import VectorSource from 'ol/source/Vector';
import { tile, bbox } from 'ol/loadingstrategy';
import { createXYZ, TileGrid } from 'ol/tilegrid';
import { Collection, Feature } from 'ol';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';

import proj4 from 'proj4';
import { getCenter } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { Geometry } from 'ol/geom';

import { CollabVectorSourceOptions } from './types';
import { Table } from '../collaborative/types';
import { SOURCE_ERROR_CODES } from './ErrorCodes';

import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();

export default class CollabVectorSource extends VectorSource {

  private _options: CollabVectorSourceOptions;
  private _isLoading = false;
  private _writeUpdateCounter = 0;
  private _cache?: any; // ICacheStorage - avoiding circular dependency
  private _tileLoading = 0;
  private _projectionCode = DEFAULT_VECTOR_PROJECTION_CODE;

  public table!: Table;
  public localProperties: Record<string, any> = {};

  /** Features that should persist across source reloads (e.g., currently edited features) */
  public preservedFeatures: Collection<Feature> = new Collection<Feature>();

  /** Features tracked for differential synchronization */
  public differentialFeatures: Collection<Feature> = new Collection<Feature>();

  /** Features that have been inserted locally and need to be synced */
  public insertedFeatures: Collection<Feature> = new Collection<Feature>();

  /** Features that have been deleted locally and need to be synced */
  public deletedFeatures: Collection<Feature> = new Collection<Feature>();

  /** Features that have been updated locally and need to be synced */
  public updatedFeatures: Collection<Feature> = new Collection<Feature>();

  constructor(options: CollabVectorSourceOptions) {
    const projectionUtils = new ProjectionUtils();
    projectionUtils.initProjections();

    const superOptions = CollabVectorSource._computeVectorSourceOptions(options);
    super(superOptions);

    this._options = options || ({} as CollabVectorSourceOptions);
    this._cache = options.cache;
    this.localProperties = superOptions.properties || {};

    this._initCollabVectorSource();
  }

  private static _computeVectorSourceOptions(options: CollabVectorSourceOptions): any {
    const opts = options || ({} as CollabVectorSourceOptions);

    if (opts.client === undefined) {
      throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_CLIENT_DEFINED);
    }

    if (opts.table === undefined) {
      throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_TABLE_DEFINED);
    }

    const table = opts.table;
    let strategy = opts.strategy || bbox;

    const properties: Record<string, any> = {
      online: opts.online ?? true,
      useCacheWhenOnline: opts.useCacheWhenOnline === true,
      cacheUrl: opts.cacheUrl,
      editionCacheFile: pathUtils.sanitizeFileName(`${table.database}-${table.name}-editions.txt`),
      formatWKT: new WKT(),
      tiled: false,
      tileGrid: undefined,
      maxReload: undefined,
    };

    if (opts.tileZoom) {
      const tileGrid: TileGrid = createXYZ({
        tileSize: opts.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE,
        minZoom: opts.tileZoom,
        maxZoom: opts.tileZoom,
      });
      strategy = tile(tileGrid);

      properties.tiled = true;
      properties.tileGrid = tileGrid;
      properties.maxReload = opts.maxReload;
    }

    return {
      strategy,
      properties,
      features: new Collection(),
      attributions: opts.attribution,
      logo: opts.logo,
      useSpatialIndex: true,
      wrapX: opts.wrapX,
    };
  }

  private _initCollabVectorSource(): void {
    const table = this._options.table || ({} as Table);
    this.table = table;

    if (table.wfs) {
      table.docURI = table.wfs.replace(/\/gcms\/.*/, '/document/');
    }

    this._options.maxFeatures = this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES;
    this._options.tileSize = this._options.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE;

    this.localProperties.srsName = this._getTableCRS();

    if (!proj4.defs(this.localProperties.srsName)) {
      console.error(SOURCE_ERROR_CODES.COLLAB_UNKNOWN_PROJECTION, this.localProperties.srsName);
    }

    this.localProperties.featureFilter = this._options.filter ?? {};

    if (table.columns?.detruit) {
      this.localProperties.featureFilter = { detruit: false };
    } else if (table.columns?.gcms_detruit) {
      this.localProperties.featureFilter = { gcms_detruit: false };
    }

    this.preservedFeatures = this._options.preserved ?? new Collection<Feature>();
    this.localProperties.preservedFeatures = this.preservedFeatures;

    this.on('addfeature', (event: any) => {
      if (event?.feature) {
        this.onAddFeature(event.feature as Feature);
      }
    });

    this.on('removefeature', (event: any) => {
      if (event?.feature) {
        this.onDeleteFeature(event.feature as Feature);
      }
    });

    this.loadChanges();
    this.setLoader(this.loaderFn.bind(this));
  }

  public getTable(): Table {
    return this.table;
  }

  public onAddFeature(feature: Feature): void {
    const geometry = feature.getGeometry();
    if (geometry) {
      geometry.on('change', () => {
        const updates = (feature as any).updates || {};
        updates.geometry = true;
        (feature as any).updates = updates;

        feature.dispatchEvent({
          type: 'propertychange',
          target: feature
        } as any);
      });
    }

    feature.on('propertychange', this.onUpdateFeature.bind(this, feature));

    if (this._isLoading) return;

    (feature as any).state = 'INSERT';

    const columns = this.table?.columns || {};
    const geometryName = this._getGeometryColumnName();

    for (const columnName in columns) {
      if (columnName !== geometryName && feature.get(columnName) === undefined) {
        feature.set(columnName, null, true);
      }
    }

    this.insertedFeatures.push(feature);
    this.writeChanges();
  }

  public onDeleteFeature(feature: Feature): void {
    if (this._isLoading) return;

    const featureState = (feature as any).state;

    if (featureState === 'INSERT') {
      this.removeFeatureFromCollection(this.insertedFeatures, feature);
    } else {
      if (featureState === 'UPDATE') {
        this.removeFeatureFromCollection(this.updatedFeatures, feature);
      }
      this.deletedFeatures.push(feature);
    }

    (feature as any).state = 'DELETE';
    this.writeChanges();
  }

  public getPendingChangesCount(): number {
    return (
      this.insertedFeatures.getLength() +
      this.updatedFeatures.getLength() +
      this.deletedFeatures.getLength()
    );
  }

  public resetChanges(): void {
    this.insertedFeatures.clear();
    this.deletedFeatures.clear();
    this.updatedFeatures.clear();
    this.preservedFeatures.clear();
    this.reload();
    this.writeChanges(true);
    this._dispatchEditChange();
  }

  public async submitChanges(): Promise<unknown> {
    const actions = this._getTransactionActions();

    this.dispatchEvent({ type: 'savestart' } as any);

    if (!actions.length) {
      this.dispatchEvent({ type: 'saveend' } as any);
      return null;
    }

    const client = this._options.client as any;
    if (typeof client?.addTransaction !== 'function') {
      const error = new Error('Collaborative client does not support addTransaction');
      this.dispatchEvent({ type: 'saveend', status: 'error', error } as any);
      throw error;
    }

    try {
      const response = await client.addTransaction(this.table.databaseId, {
        actions,
        comment: `source vecteur: ${this.table.database}":"${this.table.name}`,
      });
      const transaction = response?.data;

      if (transaction?.status === 'conflicting') {
        this.dispatchEvent({
          type: 'saveend',
          status: 'error',
          error: transaction,
        } as any);
        throw transaction;
      }

      this.resetChanges();
      this.dispatchEvent({ type: 'saveend', transaction } as any);
      return transaction;
    } catch (error) {
      this.dispatchEvent({ type: 'saveend', status: 'error', error } as any);
      throw error;
    }
  }

  private removeFeatureFromCollection(collection: Collection<Feature>, feature: Feature): void {
    const features = collection.getArray();
    const index = features.indexOf(feature);
    if (index > -1) {
      collection.removeAt(index);
    }
  }

  public writeChanges(force = false): void {
    if (!force) {
      this._writeUpdateCounter++;
      setTimeout(() => {
        this.writeChanges(true);
      }, 100);
      return;
    }

    this._writeUpdateCounter--;
    if (this._writeUpdateCounter > 0) return;
    this._writeUpdateCounter = 0;

    const actions = this.getSaveActions(true);
    const editionCacheFile = this.localProperties.editionCacheFile;
    if (!editionCacheFile) return;

    if (this._cache) {
      this._saveEditionCache(editionCacheFile, actions).catch(error => {
        console.error('ERROR: writeChanges on layer', error);
      });
    } else {
      try {
        localStorage.setItem(editionCacheFile, JSON.stringify(actions));
      } catch (error) {
        console.error('ERROR: writeChanges fallback to localStorage', error);
      }
    }

    this._dispatchEditChange();
  }

  public getSaveActions(includeGeometry = true): any {
    const formatWKT = this.localProperties.formatWKT;

    return {
      insert: this.insertedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, includeGeometry)),
      update: this.updatedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, includeGeometry)),
      delete: this.deletedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, false))
    };
  }

  private serializeFeature(feature: Feature, formatWKT: WKT, includeGeometry: boolean): any {
    const properties = feature.getProperties();
    const serialized: any = {
      id: feature.getId(),
      properties: {}
    };

    const geometryName = this._getGeometryColumnName();
    for (const key in properties) {
      if (key !== geometryName && key !== 'geometry') {
        serialized.properties[key] = properties[key];
      }
    }

    if (includeGeometry) {
      const geometry = feature.getGeometry();
      if (geometry && formatWKT) {
        serialized.geometry = formatWKT.writeGeometry(geometry);
      }
    }

    return serialized;
  }

  public loadChanges(): void {
    const editionCacheFile = this.localProperties.editionCacheFile;
    if (!editionCacheFile) return;

    if (this._cache) {
      this._loadEditionCache(editionCacheFile)
        .then(actions => {
          if (actions) {
            this._restoreActions(actions);
          }
        })
        .catch(error => {
          console.error('ERROR: loadChanges on layer', error);
        });
    } else {
      try {
        const cached = localStorage.getItem(editionCacheFile);
        if (cached) {
          const actions = JSON.parse(cached);
          this._restoreActions(actions);
        }
      } catch (error) {
        console.error('ERROR: loadChanges fallback to localStorage', error);
      }
    }
  }

  private _restoreActions(actions: any): void {
    const formatWKT = this.localProperties.formatWKT;

    if (actions.insert && Array.isArray(actions.insert)) {
      actions.insert.forEach((serialized: any) => {
        const feature = this.deserializeFeature(serialized, formatWKT);
        if (feature) {
          (feature as any).state = 'INSERT';
          this.insertedFeatures.push(feature);
        }
      });
    }

    if (actions.update && Array.isArray(actions.update)) {
      actions.update.forEach((serialized: any) => {
        const feature = this.deserializeFeature(serialized, formatWKT);
        if (feature) {
          (feature as any).state = 'UPDATE';
          this.updatedFeatures.push(feature);
        }
      });
    }

    if (actions.delete && Array.isArray(actions.delete)) {
      actions.delete.forEach((serialized: any) => {
        const feature = this.deserializeFeature(serialized, formatWKT);
        if (feature) {
          (feature as any).state = 'DELETE';
          this.deletedFeatures.push(feature);
        }
      });
    }

    this._dispatchEditChange();
  }

  private deserializeFeature(serialized: any, formatWKT: WKT): Feature | null {
    try {
      const feature = new Feature();

      if (serialized.id !== undefined && serialized.id !== null) {
        feature.setId(serialized.id);
      }

      if (serialized.properties) {
        feature.setProperties(serialized.properties);
      }

      if (serialized.geometry && formatWKT) {
        const geometry = formatWKT.readGeometry(serialized.geometry);
        feature.setGeometry(geometry);
      }

      return feature;
    } catch (error) {
      console.error('ERROR: deserializeFeature', error);
      return null;
    }
  }

  private onUpdateFeature(feature: Feature): void {
    if (this._isLoading) return;

    const featureState = (feature as any).state;

    if (featureState === 'INSERT') return;

    if (featureState !== 'UPDATE') {
      (feature as any).state = 'UPDATE';
      this.updatedFeatures.push(feature);
    }

    this.writeChanges();
  }

  private _dispatchEditChange(): void {
    this.dispatchEvent({
      type: 'editchange',
      pendingChangesCount: this.getPendingChangesCount(),
    } as any);
  }

  private _getTransactionActions(): Array<Record<string, unknown>> {
    return [
      ...this._buildTransactionActions(this.insertedFeatures, 'INSERT', true),
      ...this._buildTransactionActions(this.deletedFeatures, 'DELETE', false),
      ...this._buildTransactionActions(this.updatedFeatures, 'UPDATE', false),
    ];
  }

  private _buildTransactionActions(
    collection: Collection<Feature>,
    state: 'INSERT' | 'UPDATE' | 'DELETE',
    full: boolean
  ): Array<Record<string, unknown>> {
    return collection.getArray()
      .filter((feature) => (feature as any).state === state)
      .map((feature) => ({
        data: this._serializeTransactionFeature(feature, full),
        state,
        table: this.table.id,
      }));
  }

  private _serializeTransactionFeature(
    feature: Feature,
    full: boolean
  ): Record<string, unknown> {
    const properties = feature.getProperties();
    const data: Record<string, unknown> = {};
    const geometryName = this._getGeometryColumnName();
    const idName = this._getIdPropertyName();
    const updates = ((feature as any).updates || {}) as Record<string, boolean>;

    if (full) {
      for (const key in properties) {
        if (key !== geometryName && key !== 'geometry') {
          data[key] = properties[key];
        }
      }
    } else {
      const featureId = this._getFeatureIdentifier(feature, idName);
      if (featureId !== undefined && featureId !== null) {
        data[idName] = featureId;
      }

      for (const key in properties) {
        if (key === geometryName || key === 'geometry') {
          continue;
        }

        if (updates[key] || key === 'gcms_fingerprint') {
          data[key] = properties[key];
        }
      }
    }

    if (full || updates.geometry) {
      const geometry = feature.getGeometry();
      const formatWKT = this.localProperties.formatWKT as WKT | undefined;
      if (geometry && formatWKT) {
        const geometryClone = geometry.clone();
        if (this._projectionCode && this.localProperties.srsName) {
          geometryClone.transform(this._projectionCode, this.localProperties.srsName);
        }
        data[geometryName] = formatWKT.writeGeometry(geometryClone);
      }
    }

    return data;
  }

  private async _saveEditionCache(cacheKey: string, actions: any): Promise<void> {
    if (!this._cache) return;

    const metadata = {
      id: `edition:${cacheKey}`,
      name: `Edition Cache: ${this.table.name}`,
      type: 'vector' as const,
      created: new Date(),
      modified: new Date(),
      size: JSON.stringify(actions).length,
      extra: {
        actions
      }
    };

    await this._cache.saveMetadata(metadata.id, metadata);
  }

  private async _loadEditionCache(cacheKey: string): Promise<any | null> {
    if (!this._cache) return null;

    try {
      const metadata = await this._cache.getMetadata(`edition:${cacheKey}`);
      if (metadata && metadata.extra?.actions) {
        return metadata.extra.actions;
      }
      return null;
    } catch (error) {
      console.error('ERROR: _loadEditionCache', error);
      return null;
    }
  }

  public setLoading(isLoading: boolean): void {
    this._isLoading = isLoading;
  }

  public reload(): void {
    this._isLoading = true;
    this.clear(true);
    this._isLoading = false;
    this.dispatchEvent({ type: 'reload', maxreload: this.localProperties.maxReload } as any);
    this.refresh();
  }

  public loaderFn(
    extent: number[],
    resolution: number,
    projection: any,
    success?: (features: Feature[]) => void,
    failure?: () => void
  ): void {
    void this._loadFeatures(extent, resolution, projection, success, failure);
  }

  private async _loadFeatures(
    extent: number[],
    resolution: number,
    projection: any,
    success?: (features: Feature[]) => void,
    failure?: () => void
  ): Promise<void> {
    this._projectionCode = typeof projection === 'string'
      ? projection
      : (projection?.getCode?.() || DEFAULT_VECTOR_PROJECTION_CODE);

    if (!proj4.defs(this.localProperties.srsName)) {
      this.dispatchEvent({ type: 'loadend', status: 'error', error: SOURCE_ERROR_CODES.COLLAB_UNKNOWN_PROJECTION } as any);
      if (failure) failure();
      return;
    }

    if (
      this.localProperties.maxReload &&
      this.localProperties.tiled &&
      this._tileLoading === 1 &&
      this.getFeatures().length > this.localProperties.maxReload
    ) {
      this.reload();
    }

    this.dispatchEvent({ type: 'loadstart', remains: ++this._tileLoading } as any);

    try {
      let payload: unknown = [];
      const isOnline = this.localProperties.online !== false;
      const canReadCache = Boolean(this.localProperties.cacheUrl);
      const useCacheWhenOnline = this.localProperties.useCacheWhenOnline === true;

      if (canReadCache && (!isOnline || useCacheWhenOnline)) {
        payload = await this._loadFromOfflineCache(extent, resolution);
      }

      if (this._countPayloadFeatures(payload) === 0 && isOnline) {
        payload = await this._loadFromOnline(extent);
      }

      const loadedCount = this._countPayloadFeatures(payload);
      const loadedFeatures = this._readFeatures(payload, this._projectionCode);

      const finalFeatures: Feature[] = [];
      loadedFeatures.forEach((feature) => {
        const keptFeature = this._findFeature(feature);
        if (keptFeature) {
          finalFeatures.push(keptFeature);
        }
      });

      const idProperty = this._getIdPropertyName();
      this.insertedFeatures.getArray().forEach((feature) => {
        if ((feature as any).state !== 'INSERT') return;
        if (this._containsFeature(finalFeatures, feature, idProperty)) return;
        finalFeatures.push(feature);
      });

      this._isLoading = true;
      if (!this.localProperties.tiled) {
        this.clear(true);
      }
      if (finalFeatures.length) {
        this.addFeatures(finalFeatures);
      }
      this._isLoading = false;

      if (isOnline) {
        await this._saveFeaturesToOfflineCache(extent, resolution, finalFeatures);
      }

      this.dispatchEvent({ type: 'loadend', remains: --this._tileLoading } as any);
      if (loadedCount >= (this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES)) {
        this.dispatchEvent({ type: 'overload' } as any);
      }

      if (success) success(finalFeatures);
    } catch (error: any) {
      this._isLoading = false;
      this.dispatchEvent({
        type: 'loadend',
        error: error?.message || String(error),
        status: 'error',
        remains: Math.max(0, --this._tileLoading)
      } as any);
      if (failure) failure();
    }
  }

  private async _loadFromOnline(extent: number[]): Promise<unknown> {
    const parameters = this.getWFSParams(extent, this._projectionCode);

    if (!this.table?.wfs) {
      throw new Error('Table WFS URL is missing');
    }

    const response = await (this._options.client as any).doRequest(this.table.wfs, 'get', null, parameters);
    return response.data;
  }

  private async _loadFromOfflineCache(extent: number[], resolution: number): Promise<unknown> {
    if (!this._cache || typeof this._cache.loadFeatures !== 'function') {
      return [];
    }

    const keys = this._getOfflineCacheKeys(extent, resolution);

    for (const key of keys) {
      try {
        const cachedFeatures = await this._cache.loadFeatures(key);
        if (Array.isArray(cachedFeatures) && cachedFeatures.length) {
          return cachedFeatures;
        }
      } catch {
        // Try next key
      }
    }

    return [];
  }

  private async _saveFeaturesToOfflineCache(extent: number[], resolution: number, features: Feature[]): Promise<void> {
    if (!this._cache || typeof this._cache.saveFeatures !== 'function') {
      return;
    }

    const keys = this._getOfflineCacheKeys(extent, resolution);
    if (!keys.length) return;

    try {
      await this._cache.saveFeatures(keys[0], features);
    } catch {
      // Offline cache is best effort
    }
  }

  private _getOfflineCacheKeys(extent: number[], resolution: number): string[] {
    const baseKey = `${this.table.database}:${this.table.name}`;
    const tileGrid: TileGrid | undefined = this.localProperties.tileGrid;

    if (!tileGrid) {
      return [baseKey];
    }

    const tileCoord = tileGrid.getTileCoordForCoordAndResolution(getCenter(extent as any), resolution);
    return [`${baseKey}:${tileCoord.join('-')}`, baseKey];
  }

  public getWFSParams(extent: number[], projectionCode: string): Record<string, unknown> {
    const bboxExtent = transformExtent(extent, projectionCode, this.localProperties.srsName);

    const outputFormat = this._options.outputFormat || 'JSON';

    return {
      service: 'WFS',
      request: 'GetFeature',
      outputFormat,
      typeName: this.table.name,
      bbox: bboxExtent.join(','),
      filter: JSON.stringify(this.localProperties.featureFilter || {}),
      maxFeatures: this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES,
      version: '1.1.0'
    };
  }

  private _countPayloadFeatures(payload: unknown): number {
    if (Array.isArray(payload)) {
      return payload.length;
    }

    if (!payload || typeof payload !== 'object') {
      return 0;
    }

    const objectPayload = payload as Record<string, unknown>;

    if (objectPayload.type === 'FeatureCollection' && Array.isArray(objectPayload.features)) {
      return objectPayload.features.length;
    }

    if (Array.isArray(objectPayload.features)) return objectPayload.features.length;
    if (Array.isArray(objectPayload.data)) return objectPayload.data.length;
    if (Array.isArray(objectPayload.rows)) return objectPayload.rows.length;
    if (Array.isArray(objectPayload.items)) return objectPayload.items.length;

    return 0;
  }

  private _readFeatures(data: unknown, projectionCode: string): Feature[] {
    if (!data) {
      return [];
    }

    if (Array.isArray(data) && data.every((item) => item instanceof Feature)) {
      return data as Feature[];
    }

    let payload: unknown = data;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        return [];
      }
    }

    if (this._isGeoJSONPayload(payload)) {
      return new GeoJSON().readFeatures(payload as object, {
        dataProjection: this.localProperties.srsName,
        featureProjection: projectionCode,
      });
    }

    const items = this._extractItemsFromPayload(payload);
    if (!items.length) {
      return [];
    }

    const features: Feature[] = [];
    const geometryName = this._getGeometryColumnName();

    for (const item of items) {
      const geometryValue = item[geometryName] ?? item.geometry;
      if (!geometryValue) continue;

      const feature = this.createFeatureFromGeom(geometryValue, projectionCode);
      if (!feature) continue;

      const properties = { ...item };
      delete properties[geometryName];
      delete properties.geometry;
      feature.setProperties(properties, true);

      features.push(feature);
    }

    return features;
  }

  public createFeatureFromGeom(geom: unknown, projectionCode: string): Feature<Geometry> | null {
    if (!geom) {
      return null;
    }

    if (typeof geom === 'object' && geom !== null && 'type' in (geom as any)) {
      try {
        const geometry = new GeoJSON().readGeometry(geom as object, {
          dataProjection: this.localProperties.srsName,
          featureProjection: projectionCode
        });
        return new Feature({ geometry }) as Feature<Geometry>;
      } catch {
        return null;
      }
    }

    if (typeof geom === 'string') {
      const formatWKT = this.localProperties.formatWKT as WKT;
      const cleanedWKT = geom.replace(/([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+)/g, '$1 $3');

      try {
        return formatWKT.readFeature(cleanedWKT, {
          dataProjection: this.localProperties.srsName,
          featureProjection: projectionCode
        }) as Feature<Geometry>;
      } catch {
        return null;
      }
    }

    return null;
  }

  private _isGeoJSONPayload(payload: unknown): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const objectPayload = payload as Record<string, unknown>;
    return objectPayload.type === 'FeatureCollection' || objectPayload.type === 'Feature';
  }

  private _extractItemsFromPayload(payload: unknown): Array<Record<string, any>> {
    if (Array.isArray(payload)) {
      return payload as Array<Record<string, any>>;
    }

    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const objectPayload = payload as Record<string, unknown>;

    if (Array.isArray(objectPayload.data)) {
      return objectPayload.data as Array<Record<string, any>>;
    }

    if (Array.isArray(objectPayload.rows)) {
      return objectPayload.rows as Array<Record<string, any>>;
    }

    if (Array.isArray(objectPayload.items)) {
      return objectPayload.items as Array<Record<string, any>>;
    }

    if (Array.isArray(objectPayload.features)) {
      return objectPayload.features as Array<Record<string, any>>;
    }

    return [];
  }

  private _findFeature(feature: Feature): Feature | null {
    const idProperty = this._getIdPropertyName();
    const featureIdValue = this._getFeatureIdentifier(feature, idProperty);

    if (this.localProperties.tiled && this._featureExistsInSource(feature, idProperty, featureIdValue)) {
      return null;
    }

    if (this._findFeatureInCollection(this.deletedFeatures, idProperty, featureIdValue)) {
      return null;
    }

    const updatedFeature = this._findFeatureInCollection(this.updatedFeatures, idProperty, featureIdValue);
    if (updatedFeature) {
      return updatedFeature;
    }

    const differentialFeature = this._findFeatureInCollection(this.differentialFeatures, idProperty, featureIdValue);
    if (differentialFeature) {
      if (differentialFeature.get('detruit') || differentialFeature.get('gcms_detruit')) {
        return null;
      }
      return differentialFeature;
    }

    const preservedFeature = this._findFeatureInCollection(this.preservedFeatures, idProperty, featureIdValue);
    if (preservedFeature) {
      return preservedFeature;
    }

    return feature;
  }

  private _featureExistsInSource(feature: Feature, idProperty: string, featureIdValue: unknown): boolean {
    if (featureIdValue !== undefined && featureIdValue !== null) {
      return this.getFeatures().some((existing) =>
        this._featureIdentifiersMatch(this._getFeatureIdentifier(existing, idProperty), featureIdValue)
      );
    }

    const geometry = feature.getGeometry();
    if (!geometry) {
      return false;
    }

    const extent = geometry.getExtent();
    const nearbyFeatures = this.getFeaturesInExtent([
      extent[0] - 0.1,
      extent[1] - 0.1,
      extent[2] + 0.1,
      extent[3] + 0.1
    ]);

    return nearbyFeatures.length > 0;
  }

  private _findFeatureInCollection(
    collection: Collection<Feature>,
    idProperty: string,
    featureIdValue: unknown
  ): Feature | null {
    const features = collection.getArray();

    if (featureIdValue === undefined || featureIdValue === null) {
      return null;
    }

    for (const feature of features) {
      const idValue = this._getFeatureIdentifier(feature, idProperty);
      if (this._featureIdentifiersMatch(idValue, featureIdValue)) {
        return feature;
      }
    }

    return null;
  }

  private _containsFeature(features: Feature[], candidate: Feature, idProperty: string): boolean {
    const candidateId = this._getFeatureIdentifier(candidate, idProperty);

    if (candidateId !== undefined && candidateId !== null) {
      return features.some((feature) =>
        this._featureIdentifiersMatch(this._getFeatureIdentifier(feature, idProperty), candidateId)
      );
    }

    return features.includes(candidate);
  }

  private _getFeatureIdentifier(feature: Feature, idProperty: string): unknown {
    const propertyId = feature.get(idProperty);
    if (propertyId !== undefined && propertyId !== null) {
      return propertyId;
    }

    const featureId = feature.getId();
    if (featureId !== undefined && featureId !== null) {
      return featureId;
    }

    return undefined;
  }

  private _featureIdentifiersMatch(left: unknown, right: unknown): boolean {
    if (left === undefined || left === null || right === undefined || right === null) {
      return false;
    }

    return String(left) === String(right);
  }

  private _getIdPropertyName(): string {
    return this.table?.idName || 'id';
  }

  private _getGeometryColumnName(): string {
    return this.table?.geometryName || 'geometry';
  }

  private _getTableCRS(): string {
    const geometryName = this._getGeometryColumnName();
    const column = this.table?.columns?.[geometryName] as any;
    return column?.crs || COLLAB_VECTOR_DEFAULT_VALUES.SRS_NAME;
  }

}
