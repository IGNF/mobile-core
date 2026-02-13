/**
 * CollabVectorSource - OpenLayers source for collaborative vector layers
 * @migrated from ol/source/CollabVector.js of the CordovApp module
 */
import { ProjectionUtils } from '../utils/ProjectionUtils';
import { COLLAB_VECTOR_DEFAULT_VALUES, DEFAULT_VECTOR_PROJECTION_CODE } from './DefaultSourceValues';
import VectorSource from 'ol/source/Vector';
import { tile, bbox } from 'ol/loadingstrategy';
import { createXYZ } from 'ol/tilegrid';
import { Collection, Feature } from 'ol';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';
import proj4 from 'proj4';
import { getCenter } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { SOURCE_ERROR_CODES } from './ErrorCodes';
import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();
export default class CollabVectorSource extends VectorSource {
    constructor(options) {
        const projectionUtils = new ProjectionUtils();
        projectionUtils.initProjections();
        const superOptions = CollabVectorSource._computeVectorSourceOptions(options);
        super(superOptions);
        this._isLoading = false;
        this._writeUpdateCounter = 0;
        this._tileLoading = 0;
        this._projectionCode = DEFAULT_VECTOR_PROJECTION_CODE;
        this.localProperties = {};
        /** Features that should persist across source reloads (e.g., currently edited features) */
        this.preservedFeatures = new Collection();
        /** Features tracked for differential synchronization */
        this.differentialFeatures = new Collection();
        /** Features that have been inserted locally and need to be synced */
        this.insertedFeatures = new Collection();
        /** Features that have been deleted locally and need to be synced */
        this.deletedFeatures = new Collection();
        /** Features that have been updated locally and need to be synced */
        this.updatedFeatures = new Collection();
        this._options = options || {};
        this._cache = options.cache;
        this.localProperties = superOptions.properties || {};
        this._initCollabVectorSource();
    }
    static _computeVectorSourceOptions(options) {
        const opts = options || {};
        if (opts.client === undefined) {
            throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_CLIENT_DEFINED);
        }
        if (opts.table === undefined) {
            throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_TABLE_DEFINED);
        }
        const table = opts.table;
        let strategy = opts.strategy || bbox;
        const properties = {
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
            const tileGrid = createXYZ({
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
    _initCollabVectorSource() {
        const table = this._options.table || {};
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
        }
        else if (table.columns?.gcms_detruit) {
            this.localProperties.featureFilter = { gcms_detruit: false };
        }
        this.preservedFeatures = this._options.preserved ?? new Collection();
        this.localProperties.preservedFeatures = this.preservedFeatures;
        this.on('addfeature', (event) => {
            if (event?.feature) {
                this.onAddFeature(event.feature);
            }
        });
        this.on('removefeature', (event) => {
            if (event?.feature) {
                this.onDeleteFeature(event.feature);
            }
        });
        this.loadChanges();
        this.setLoader(this.loaderFn.bind(this));
    }
    getTable() {
        return this.table;
    }
    onAddFeature(feature) {
        const geometry = feature.getGeometry();
        if (geometry) {
            geometry.on('change', () => {
                const updates = feature.updates || {};
                updates.geometry = true;
                feature.updates = updates;
                feature.dispatchEvent({
                    type: 'propertychange',
                    target: feature
                });
            });
        }
        feature.on('propertychange', this.onUpdateFeature.bind(this, feature));
        if (this._isLoading)
            return;
        feature.state = 'INSERT';
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
    onDeleteFeature(feature) {
        if (this._isLoading)
            return;
        const featureState = feature.state;
        if (featureState === 'INSERT') {
            this.removeFeatureFromCollection(this.insertedFeatures, feature);
        }
        else {
            if (featureState === 'UPDATE') {
                this.removeFeatureFromCollection(this.updatedFeatures, feature);
            }
            this.deletedFeatures.push(feature);
        }
        feature.state = 'DELETE';
        this.writeChanges();
    }
    removeFeatureFromCollection(collection, feature) {
        const features = collection.getArray();
        const index = features.indexOf(feature);
        if (index > -1) {
            collection.removeAt(index);
        }
    }
    writeChanges(force = false) {
        if (!force) {
            this._writeUpdateCounter++;
            setTimeout(() => {
                this.writeChanges(true);
            }, 100);
            return;
        }
        this._writeUpdateCounter--;
        if (this._writeUpdateCounter > 0)
            return;
        this._writeUpdateCounter = 0;
        const actions = this.getSaveActions(true);
        const editionCacheFile = this.localProperties.editionCacheFile;
        if (!editionCacheFile)
            return;
        if (this._cache) {
            this._saveEditionCache(editionCacheFile, actions).catch(error => {
                console.error('ERROR: writeChanges on layer', error);
            });
        }
        else {
            try {
                localStorage.setItem(editionCacheFile, JSON.stringify(actions));
            }
            catch (error) {
                console.error('ERROR: writeChanges fallback to localStorage', error);
            }
        }
    }
    getSaveActions(includeGeometry = true) {
        const formatWKT = this.localProperties.formatWKT;
        return {
            insert: this.insertedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, includeGeometry)),
            update: this.updatedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, includeGeometry)),
            delete: this.deletedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, false))
        };
    }
    serializeFeature(feature, formatWKT, includeGeometry) {
        const properties = feature.getProperties();
        const serialized = {
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
    loadChanges() {
        const editionCacheFile = this.localProperties.editionCacheFile;
        if (!editionCacheFile)
            return;
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
        }
        else {
            try {
                const cached = localStorage.getItem(editionCacheFile);
                if (cached) {
                    const actions = JSON.parse(cached);
                    this._restoreActions(actions);
                }
            }
            catch (error) {
                console.error('ERROR: loadChanges fallback to localStorage', error);
            }
        }
    }
    _restoreActions(actions) {
        const formatWKT = this.localProperties.formatWKT;
        if (actions.insert && Array.isArray(actions.insert)) {
            actions.insert.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = 'INSERT';
                    this.insertedFeatures.push(feature);
                }
            });
        }
        if (actions.update && Array.isArray(actions.update)) {
            actions.update.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = 'UPDATE';
                    this.updatedFeatures.push(feature);
                }
            });
        }
        if (actions.delete && Array.isArray(actions.delete)) {
            actions.delete.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = 'DELETE';
                    this.deletedFeatures.push(feature);
                }
            });
        }
    }
    deserializeFeature(serialized, formatWKT) {
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
        }
        catch (error) {
            console.error('ERROR: deserializeFeature', error);
            return null;
        }
    }
    onUpdateFeature(feature) {
        if (this._isLoading)
            return;
        const featureState = feature.state;
        if (featureState === 'INSERT')
            return;
        if (featureState !== 'UPDATE') {
            feature.state = 'UPDATE';
            this.updatedFeatures.push(feature);
        }
        this.writeChanges();
    }
    async _saveEditionCache(cacheKey, actions) {
        if (!this._cache)
            return;
        const metadata = {
            id: `edition:${cacheKey}`,
            name: `Edition Cache: ${this.table.name}`,
            type: 'vector',
            created: new Date(),
            modified: new Date(),
            size: JSON.stringify(actions).length,
            extra: {
                actions
            }
        };
        await this._cache.saveMetadata(metadata.id, metadata);
    }
    async _loadEditionCache(cacheKey) {
        if (!this._cache)
            return null;
        try {
            const metadata = await this._cache.getMetadata(`edition:${cacheKey}`);
            if (metadata && metadata.extra?.actions) {
                return metadata.extra.actions;
            }
            return null;
        }
        catch (error) {
            console.error('ERROR: _loadEditionCache', error);
            return null;
        }
    }
    setLoading(isLoading) {
        this._isLoading = isLoading;
    }
    reload() {
        this._isLoading = true;
        this.clear(true);
        this._isLoading = false;
        this.dispatchEvent({ type: 'reload', maxreload: this.localProperties.maxReload });
        this.refresh();
    }
    loaderFn(extent, resolution, projection, success, failure) {
        void this._loadFeatures(extent, resolution, projection, success, failure);
    }
    async _loadFeatures(extent, resolution, projection, success, failure) {
        this._projectionCode = typeof projection === 'string'
            ? projection
            : (projection?.getCode?.() || DEFAULT_VECTOR_PROJECTION_CODE);
        if (!proj4.defs(this.localProperties.srsName)) {
            this.dispatchEvent({ type: 'loadend', status: 'error', error: SOURCE_ERROR_CODES.COLLAB_UNKNOWN_PROJECTION });
            if (failure)
                failure();
            return;
        }
        if (this.localProperties.maxReload &&
            this.localProperties.tiled &&
            this._tileLoading === 1 &&
            this.getFeatures().length > this.localProperties.maxReload) {
            this.reload();
        }
        this.dispatchEvent({ type: 'loadstart', remains: ++this._tileLoading });
        try {
            let payload = [];
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
            const finalFeatures = [];
            loadedFeatures.forEach((feature) => {
                const keptFeature = this._findFeature(feature);
                if (keptFeature) {
                    finalFeatures.push(keptFeature);
                }
            });
            const idProperty = this._getIdPropertyName();
            this.insertedFeatures.getArray().forEach((feature) => {
                if (feature.state !== 'INSERT')
                    return;
                if (this._containsFeature(finalFeatures, feature, idProperty))
                    return;
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
            this.dispatchEvent({ type: 'loadend', remains: --this._tileLoading });
            if (loadedCount >= (this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES)) {
                this.dispatchEvent({ type: 'overload' });
            }
            if (success)
                success(finalFeatures);
        }
        catch (error) {
            this._isLoading = false;
            this.dispatchEvent({
                type: 'loadend',
                error: error?.message || String(error),
                status: 'error',
                remains: Math.max(0, --this._tileLoading)
            });
            if (failure)
                failure();
        }
    }
    async _loadFromOnline(extent) {
        const parameters = this.getWFSParams(extent, this._projectionCode);
        if (!this.table?.wfs) {
            throw new Error('Table WFS URL is missing');
        }
        const response = await this._options.client.doRequest(this.table.wfs, 'get', null, parameters);
        return response.data;
    }
    async _loadFromOfflineCache(extent, resolution) {
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
            }
            catch {
                // Try next key
            }
        }
        return [];
    }
    async _saveFeaturesToOfflineCache(extent, resolution, features) {
        if (!this._cache || typeof this._cache.saveFeatures !== 'function') {
            return;
        }
        const keys = this._getOfflineCacheKeys(extent, resolution);
        if (!keys.length)
            return;
        try {
            await this._cache.saveFeatures(keys[0], features);
        }
        catch {
            // Offline cache is best effort
        }
    }
    _getOfflineCacheKeys(extent, resolution) {
        const baseKey = `${this.table.database}:${this.table.name}`;
        const tileGrid = this.localProperties.tileGrid;
        if (!tileGrid) {
            return [baseKey];
        }
        const tileCoord = tileGrid.getTileCoordForCoordAndResolution(getCenter(extent), resolution);
        return [`${baseKey}:${tileCoord.join('-')}`, baseKey];
    }
    getWFSParams(extent, projectionCode) {
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
    _countPayloadFeatures(payload) {
        if (Array.isArray(payload)) {
            return payload.length;
        }
        if (!payload || typeof payload !== 'object') {
            return 0;
        }
        const objectPayload = payload;
        if (objectPayload.type === 'FeatureCollection' && Array.isArray(objectPayload.features)) {
            return objectPayload.features.length;
        }
        if (Array.isArray(objectPayload.features))
            return objectPayload.features.length;
        if (Array.isArray(objectPayload.data))
            return objectPayload.data.length;
        if (Array.isArray(objectPayload.rows))
            return objectPayload.rows.length;
        if (Array.isArray(objectPayload.items))
            return objectPayload.items.length;
        return 0;
    }
    _readFeatures(data, projectionCode) {
        if (!data) {
            return [];
        }
        if (Array.isArray(data) && data.every((item) => item instanceof Feature)) {
            return data;
        }
        let payload = data;
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            }
            catch {
                return [];
            }
        }
        if (this._isGeoJSONPayload(payload)) {
            return new GeoJSON().readFeatures(payload, {
                dataProjection: this.localProperties.srsName,
                featureProjection: projectionCode,
            });
        }
        const items = this._extractItemsFromPayload(payload);
        if (!items.length) {
            return [];
        }
        const features = [];
        const geometryName = this._getGeometryColumnName();
        for (const item of items) {
            const geometryValue = item[geometryName] ?? item.geometry;
            if (!geometryValue)
                continue;
            const feature = this.createFeatureFromGeom(geometryValue, projectionCode);
            if (!feature)
                continue;
            const properties = { ...item };
            delete properties[geometryName];
            delete properties.geometry;
            feature.setProperties(properties, true);
            features.push(feature);
        }
        return features;
    }
    createFeatureFromGeom(geom, projectionCode) {
        if (!geom) {
            return null;
        }
        if (typeof geom === 'object' && geom !== null && 'type' in geom) {
            try {
                const geometry = new GeoJSON().readGeometry(geom, {
                    dataProjection: this.localProperties.srsName,
                    featureProjection: projectionCode
                });
                return new Feature({ geometry });
            }
            catch {
                return null;
            }
        }
        if (typeof geom === 'string') {
            const formatWKT = this.localProperties.formatWKT;
            const cleanedWKT = geom.replace(/([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+)/g, '$1 $3');
            try {
                return formatWKT.readFeature(cleanedWKT, {
                    dataProjection: this.localProperties.srsName,
                    featureProjection: projectionCode
                });
            }
            catch {
                return null;
            }
        }
        return null;
    }
    _isGeoJSONPayload(payload) {
        if (!payload || typeof payload !== 'object') {
            return false;
        }
        const objectPayload = payload;
        return objectPayload.type === 'FeatureCollection' || objectPayload.type === 'Feature';
    }
    _extractItemsFromPayload(payload) {
        if (Array.isArray(payload)) {
            return payload;
        }
        if (!payload || typeof payload !== 'object') {
            return [];
        }
        const objectPayload = payload;
        if (Array.isArray(objectPayload.data)) {
            return objectPayload.data;
        }
        if (Array.isArray(objectPayload.rows)) {
            return objectPayload.rows;
        }
        if (Array.isArray(objectPayload.items)) {
            return objectPayload.items;
        }
        if (Array.isArray(objectPayload.features)) {
            return objectPayload.features;
        }
        return [];
    }
    _findFeature(feature) {
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
    _featureExistsInSource(feature, idProperty, featureIdValue) {
        if (featureIdValue !== undefined && featureIdValue !== null) {
            return this.getFeatures().some((existing) => this._featureIdentifiersMatch(this._getFeatureIdentifier(existing, idProperty), featureIdValue));
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
    _findFeatureInCollection(collection, idProperty, featureIdValue) {
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
    _containsFeature(features, candidate, idProperty) {
        const candidateId = this._getFeatureIdentifier(candidate, idProperty);
        if (candidateId !== undefined && candidateId !== null) {
            return features.some((feature) => this._featureIdentifiersMatch(this._getFeatureIdentifier(feature, idProperty), candidateId));
        }
        return features.includes(candidate);
    }
    _getFeatureIdentifier(feature, idProperty) {
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
    _featureIdentifiersMatch(left, right) {
        if (left === undefined || left === null || right === undefined || right === null) {
            return false;
        }
        return String(left) === String(right);
    }
    _getIdPropertyName() {
        const tableAny = this.table;
        return tableAny.idName || tableAny.id_name || 'id';
    }
    _getGeometryColumnName() {
        const tableAny = this.table;
        return tableAny.geometryName || tableAny.geometry_name || 'geometry';
    }
    _getTableCRS() {
        const geometryName = this._getGeometryColumnName();
        const column = this.table?.columns?.[geometryName];
        return column?.crs || COLLAB_VECTOR_DEFAULT_VALUES.SRS_NAME;
    }
}
//# sourceMappingURL=CollabVectorSource.js.map