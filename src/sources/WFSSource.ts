/**
 * OpenLayers source for WFS (Web Feature Service) layers
 * @migrated from: ol/source/WFS.js of the CordovApp module
 */

import { Collection, Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import { bbox, tile } from 'ol/loadingstrategy';
import { TileGrid, createXYZ } from 'ol/tilegrid';
import GeoJSON from 'ol/format/GeoJSON';
import WFS from 'ol/format/WFS';

import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();

import { WFSSourceOptions } from './types';
import { DEFAULT_VECTOR_PROJECTION_CODE, WFS_DEFAULT_VALUES } from './DefaultSourceValues';
import { Projection, transformExtent } from 'ol/proj';
import GML3 from 'ol/format/GML3';
import GML2 from 'ol/format/GML2';
import { Geoservice, Table } from '../collaborative/types';

const WFS_REQUEST_KEYS = new Set([
  'service',
  'request',
  'version',
  'typenames',
  'typename',
  'srsname',
  'bbox',
  'count',
  'maxfeatures'
]);

const WFS_FILTER_KEYS = new Set(['cql_filter', 'filter']);

interface ParsedLayerSpec {
  typeNames: string;
  extraParams: Array<[string, string]>;
}

interface WfsUrlOptions {
  includeOutputFormat: boolean;
  includeFilters: boolean;
  includeBbox: boolean;
}

interface WfsRequestVariant extends WfsUrlOptions {
  name: string;
}

interface WfsTryResult {
  payload?: string;
  error?: Error;
}

export default class WFSSource extends VectorSource {
  public localProperties: Record<string, any> = {};
  public requestProperties: Record<string, any> = {};

  private _tileLoading = 0;
  private _done = false;

  constructor(options: WFSSourceOptions, cache?: any) {
    const superOptions = WFSSource._computeWFSSourceOptions(options, cache);
    super(superOptions);

    this.localProperties = superOptions.computedLocalProperties;
    this._initWFSSource(options);
  }

  /**
   * Compute VectorSource options from WFS options
   */
  private static _computeWFSSourceOptions(options: WFSSourceOptions, cache?: any): any {
    const opts = options || ({} as WFSSourceOptions);
    const computedLocalProperties: Record<string, any> = {
      tiled: false,
      layerExtraParams: []
    };

    let strategy = opts.strategy;

    if (!strategy && opts.tileZoom) {
      const tileZoom = opts.tileZoom ?? opts.minZoom ?? WFS_DEFAULT_VALUES.MIN_ZOOM_INCREASE;
      const tileGrid: TileGrid = createXYZ({
        tileSize: opts.tileSize || WFS_DEFAULT_VALUES.TILE_SIZE,
        minZoom: tileZoom,
        maxZoom: tileZoom,
      });
      strategy = tile(tileGrid);

      computedLocalProperties.tileGrid = tileGrid;
      computedLocalProperties.table = opts.table as Table;
      computedLocalProperties.tiled = true;
      computedLocalProperties.maxReload = opts.maxReload;
    } else if (!strategy) {
      strategy = bbox;
    }

    if (cache && cache.loadCache) {
      computedLocalProperties.loadCache = cache.loadCache;
    }
    if (cache && cache.saveCache) {
      computedLocalProperties.saveCache = cache.saveCache;
    }

    return {
      computedLocalProperties,
      strategy,
      features: new Collection(),
      attributions: opts.attribution,
      useSpatialIndex: true,
      wrapX: opts.wrapX
    };
  }

  /**
   * Completes WFS-specific initialization after VectorSource setup
   */
  private _initWFSSource(options: WFSSourceOptions): void {
    const opts = options || ({} as WFSSourceOptions);
    const geoservice = opts.geoservice || ({} as Geoservice);

    this.localProperties.proxy = opts.proxy;
    this.localProperties.featureFilter = opts.filter;

    const parsedLayerSpec = this._parseLayerSpec(geoservice.layers || '');
    const resolvedTypeNames = this._resolveInitialTypeNames(geoservice, parsedLayerSpec.typeNames);
    this.localProperties.layerExtraParams = parsedLayerSpec.extraParams;

    const geoserviceUrl = geoservice.url || '';

    this.set('url', geoserviceUrl);
    this.set('cache', `${pathUtils.getEscapedDomainFromURL(geoserviceUrl)}/${geoservice.layers || ''}`);
    this.set('once', opts.once);
    this.set('typename', resolvedTypeNames || geoservice.layers || '');
    this.set('version', geoservice.version || '2.0.0');
    this.set('projection', opts.srs || WFS_DEFAULT_VALUES.SRS_NAME);
    this.set('id', geoservice.input_mask?.id ?? -1);
    this.set('maxFeatures', opts.maxFeatures);
    this.set('format', geoservice.format || 'GeoJSON');

    this.setAuthentication(opts.username, opts.password, opts.accessToken, opts.tokenType);
    this._configureLoader();
  }

  private _configureLoader(): void {
    this.setLoader((extent, resolution, projection, success, failure) => {
      void this._loaderFn(extent, resolution, projection as Projection | string, success, failure);
    });
  }

  private async _loaderFn(
    extent0: number[],
    resolution: number,
    projection: Projection | string,
    success?: (features: Feature[]) => void,
    failure?: () => void
  ): Promise<void> {
    if (this._done && this.get('once')) {
      if (success) success([]);
      return;
    }

    this._done = true;

    const projectionCode = this._projectionToCode(projection);
    const requestCrs = String(this.get('projection') || WFS_DEFAULT_VALUES.SRS_NAME);
    const requestExtent = transformExtent(extent0, projectionCode, requestCrs);
    const tileCoord = this.localProperties.tileGrid
      ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(extent0, resolution)
      : null;

    this.dispatchEvent({ type: 'loadstart', remains: ++this._tileLoading } as any);

    try {
      let payload: unknown | undefined;

      if (this.localProperties.loadCache) {
        payload = await this._loadFromCache(requestExtent, resolution, tileCoord);
      }

      if (payload === undefined) {
        payload = await this._loadFromService(requestExtent, requestCrs);
        if (this.localProperties.saveCache) {
          await Promise.resolve(this.localProperties.saveCache(payload, requestExtent, resolution, tileCoord));
        }
      }

      const features = this._readWFSResponse(payload, requestCrs, projectionCode);
      if (features.length) {
        this.addFeatures(features);
      }

      this.dispatchEvent({ type: 'loadend', remains: --this._tileLoading } as any);
      if (success) success(features);
    } catch (error: any) {
      const status = error?.name === 'AbortError' ? 'abort' : 'error';
      this._handleWFSLoadError(status, error);
      if (failure) failure();
    }
  }

  private async _loadFromCache(
    requestExtent: number[],
    resolution: number,
    tileCoord: number[] | null
  ): Promise<unknown | undefined> {
    if (!this.localProperties.loadCache) {
      return undefined;
    }

    const cacheParameters = {
      tileCoord,
      extent: requestExtent,
      resolution,
    };

    try {
      return await this.localProperties.loadCache(cacheParameters);
    } catch (cacheError: any) {
      if (cacheError === 'obsolete') {
        try {
          return await this.localProperties.loadCache({
            ...cacheParameters,
            obsolete: true,
          });
        } catch {
          return undefined;
        }
      }
      return undefined;
    }
  }

  private async _loadFromService(requestExtent: number[], requestCrs: string): Promise<string> {
    const geoservice = this._buildCurrentGeoservice();
    const layerExtraParams = (this.localProperties.layerExtraParams || []) as Array<[string, string]>;
    const preferGeoJSON = this._isGeoJSONFormat();
    const hasFilters = this._hasFilterParams(geoservice, layerExtraParams, this.localProperties.featureFilter);

    let activeTypeNames = String(this.get('typename') || '');

    let attempt = await this._tryLoadWithTypeNames(
      activeTypeNames,
      geoservice,
      layerExtraParams,
      requestExtent,
      requestCrs,
      preferGeoJSON,
      hasFilters
    );

    if (!attempt.payload && attempt.error) {
      const unknownTypeName = this._extractUnknownFeatureTypeName(attempt.error.message);
      if (unknownTypeName) {
        const fallbackTypeNames = await this._resolveUnknownTypeNames(geoservice, unknownTypeName);
        if (fallbackTypeNames && fallbackTypeNames !== activeTypeNames) {
          console.warn(
            `[WFSSource] Resolved unknown feature type "${unknownTypeName}" to "${fallbackTypeNames}".`
          );
          activeTypeNames = fallbackTypeNames;
          attempt = await this._tryLoadWithTypeNames(
            activeTypeNames,
            geoservice,
            layerExtraParams,
            requestExtent,
            requestCrs,
            preferGeoJSON,
            hasFilters
          );
        }
      }
    }

    if (!attempt.payload) {
      throw attempt.error || new Error('WFS request failed');
    }

    return attempt.payload;
  }

  private async _tryLoadWithTypeNames(
    typeNames: string,
    geoservice: Geoservice,
    layerExtraParams: Array<[string, string]>,
    requestExtent: number[],
    requestCrs: string,
    preferGeoJSON: boolean,
    hasFilters: boolean
  ): Promise<WfsTryResult> {
    const variants = this._getWfsRequestVariants(preferGeoJSON, hasFilters);
    const seenUrls = new Set<string>();
    let lastError: Error | undefined;

    for (const variant of variants) {
      const url = this._buildWfsGetFeatureUrl(
        geoservice,
        typeNames,
        layerExtraParams,
        requestCrs,
        requestExtent,
        variant
      );

      const urlString = url.toString();
      if (seenUrls.has(urlString)) {
        continue;
      }
      seenUrls.add(urlString);

      try {
        const payload = await this._fetchWfsPayload(urlString);
        return { payload };
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    return {
      error: lastError || new Error('WFS request failed')
    };
  }

  private async _fetchWfsPayload(url: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3 * 60 * 1000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this._getAuthHeaders(),
        cache: 'no-cache',
        signal: controller.signal
      });

      const payload = await response.text();
      const exceptionMessage = this._getWfsExceptionMessage(payload);

      if (!response.ok) {
        throw new Error(`WFS ${response.status}: ${exceptionMessage || response.statusText}`);
      }

      if (exceptionMessage) {
        throw new Error(`WFS Exception: ${exceptionMessage}`);
      }

      return payload;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private _getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'cache-control': 'no-cache'
    };

    const { authorization, username, password } = this.requestProperties;

    if (authorization) {
      headers.Authorization = String(authorization);
    } else if (username && password) {
      headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    }

    return headers;
  }

  /**
   * Read WFS response and return features to add
   */
  private _readWFSResponse(response: unknown, requestCrs: string, projectionCode: string): Feature[] {
    const loadedFeatures = this._parseFeaturesFromPayload(response, requestCrs, projectionCode);
    if (!loadedFeatures.length) {
      return [];
    }

    const featuresToAdd: Feature[] = [];

    const idProperty = typeof this.get('id') === 'string' && this.get('id')
      ? String(this.get('id'))
      : undefined;

    const existingFeatures = this.getFeatures();
    const existingIds = new Set<string>();

    if (idProperty) {
      for (const existingFeature of existingFeatures) {
        const existingId = existingFeature.get(idProperty);
        if (existingId !== undefined && existingId !== null) {
          existingIds.add(String(existingId));
        }
      }
    }

    const existingFeatureIds = new Set<string>();
    for (const existingFeature of existingFeatures) {
      const featureId = existingFeature.getId();
      if (featureId !== undefined && featureId !== null) {
        existingFeatureIds.add(String(featureId));
      }
    }

    for (const feature of loadedFeatures) {
      const geometry = feature.getGeometry();
      if (!geometry) {
        continue;
      }

      const geomExtent = geometry.getExtent();
      if (
        geomExtent[0] >= 360 || geomExtent[0] <= -360 ||
        geomExtent[2] >= 360 || geomExtent[2] <= -360
      ) {
        continue;
      }

      if (idProperty) {
        const localId = feature.get(idProperty);
        if (localId !== undefined && localId !== null) {
          const stringId = String(localId);
          if (existingIds.has(stringId)) {
            continue;
          }
          existingIds.add(stringId);
        }
      }

      const featureId = feature.getId();
      if (featureId !== undefined && featureId !== null) {
        const stringFeatureId = String(featureId);
        if (existingFeatureIds.has(stringFeatureId)) {
          continue;
        }
        existingFeatureIds.add(stringFeatureId);
      }

      featuresToAdd.push(feature);
    }

    return featuresToAdd;
  }

  private _parseFeaturesFromPayload(
    payload: unknown,
    requestCrs: string,
    projectionCode: string
  ): Feature[] {
    const preferGeoJSON = this._isGeoJSONFormat();

    if (payload === undefined || payload === null) {
      return [];
    }

    if (typeof payload === 'object' && payload !== null && !(payload instanceof Document)) {
      if (preferGeoJSON || this._looksLikeGeoJSONPayload(payload)) {
        return new GeoJSON().readFeatures(payload as object, {
          dataProjection: requestCrs,
          featureProjection: projectionCode,
        });
      }
    }

    const rawPayload = typeof payload === 'string' ? payload : String(payload);
    const trimmedPayload = rawPayload.trim();

    if (!trimmedPayload) {
      return [];
    }

    const exceptionMessage = this._getWfsExceptionMessage(trimmedPayload);
    if (exceptionMessage) {
      throw new Error(`WFS Exception: ${exceptionMessage}`);
    }

    if (this._isLikelyJsonPayload(trimmedPayload)) {
      try {
        const parsedJSON = JSON.parse(trimmedPayload);
        return new GeoJSON().readFeatures(parsedJSON, {
          dataProjection: requestCrs,
          featureProjection: projectionCode,
        });
      } catch {
        // Keep parsing with WFS XML parser below
      }
    }

    let data = new WFS({ gmlFormat: new GML3() }).readFeatures(trimmedPayload, {
      dataProjection: requestCrs,
      featureProjection: projectionCode,
    }) as Feature[];

    if (data.length && (!data[0]?.getGeometry() || !data[0]?.getGeometry()?.getExtent())) {
      data = new WFS({ gmlFormat: new GML2() }).readFeatures(trimmedPayload, {
        dataProjection: requestCrs,
        featureProjection: projectionCode,
      }) as Feature[];
    }

    return data;
  }

  private _buildCurrentGeoservice(): Geoservice {
    return {
      id: 0,
      title: '',
      url: String(this.get('url') || ''),
      type: 'WFS',
      layers: String(this.get('typename') || ''),
      version: String(this.get('version') || '2.0.0'),
      format: String(this.get('format') || '')
    };
  }

  private _buildWfsGetFeatureUrl(
    geoservice: Geoservice,
    typeNames: string,
    layerExtraParams: Array<[string, string]>,
    requestCrs: string,
    requestExtent: number[],
    options: WfsUrlOptions
  ): URL {
    const originalUrl = new URL(geoservice.url);
    const finalUrl = new URL(`${originalUrl.origin}${originalUrl.pathname}`);
    const preservedParams = new Map<string, { key: string; values: string[] }>();

    const addPreservedParam = (key: string, value: string): void => {
      const lowerKey = key.toLowerCase();

      if (WFS_REQUEST_KEYS.has(lowerKey)) return;
      if (lowerKey === 'outputformat') return;
      if (!options.includeFilters && WFS_FILTER_KEYS.has(lowerKey)) return;

      const existing = preservedParams.get(lowerKey);
      if (existing) {
        existing.values.push(value);
      } else {
        preservedParams.set(lowerKey, { key, values: [value] });
      }
    };

    originalUrl.searchParams.forEach((value, key) => {
      addPreservedParam(key, value);
    });

    for (const [key, value] of layerExtraParams) {
      addPreservedParam(key, value);
    }

    if (options.includeFilters) {
      const serializedFilter = this._serializeFeatureFilter();
      if (serializedFilter && !preservedParams.has(serializedFilter.key.toLowerCase())) {
        preservedParams.set(serializedFilter.key.toLowerCase(), {
          key: serializedFilter.key,
          values: [serializedFilter.value]
        });
      }
    }

    for (const { key, values } of preservedParams.values()) {
      for (const value of values) {
        finalUrl.searchParams.append(key, value);
      }
    }

    finalUrl.searchParams.set('service', 'WFS');
    finalUrl.searchParams.set('version', geoservice.version || '2.0.0');
    finalUrl.searchParams.set('request', 'GetFeature');
    finalUrl.searchParams.set('typeNames', typeNames);
    finalUrl.searchParams.set('srsName', requestCrs);

    if (options.includeBbox) {
      finalUrl.searchParams.set('bbox', `${requestExtent.join(',')},${requestCrs}`);
    }

    const maxFeatures = Number(this.get('maxFeatures'));
    if (Number.isFinite(maxFeatures) && maxFeatures > 0) {
      finalUrl.searchParams.set('count', String(maxFeatures));
      finalUrl.searchParams.set('maxFeatures', String(maxFeatures));
    }

    if (this._isGeoJSONFormat() && options.includeOutputFormat) {
      finalUrl.searchParams.set('outputFormat', 'application/json');
    }

    return finalUrl;
  }

  private _serializeFeatureFilter(): { key: string; value: string } | undefined {
    const filter = this.localProperties.featureFilter;

    if (typeof filter === 'string') {
      const trimmedFilter = filter.trim();
      if (!trimmedFilter) return undefined;
      return { key: 'cql_filter', value: trimmedFilter };
    }

    if (!filter || typeof filter !== 'object') {
      return undefined;
    }

    const clauses: string[] = [];
    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined) {
        continue;
      }
      if (value === null) {
        clauses.push(`${key} IS NULL`);
      } else {
        clauses.push(`${key}=${this._toCqlLiteral(value)}`);
      }
    }

    if (!clauses.length) {
      return undefined;
    }

    return {
      key: 'cql_filter',
      value: clauses.join(' AND ')
    };
  }

  private _toCqlLiteral(value: unknown): string {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }

    const escaped = String(value).replace(/'/g, "''");
    return `'${escaped}'`;
  }

  private _getWfsRequestVariants(preferGeoJSON: boolean, hasFilter: boolean): WfsRequestVariant[] {
    const variants: WfsRequestVariant[] = [];

    if (hasFilter) {
      variants.push({
        name: 'filter-no-bbox',
        includeOutputFormat: preferGeoJSON,
        includeFilters: true,
        includeBbox: false,
      });

      if (preferGeoJSON) {
        variants.push({
          name: 'filter-no-bbox-no-output-format',
          includeOutputFormat: false,
          includeFilters: true,
          includeBbox: false,
        });
      }

      variants.push({
        name: 'no-filter-with-bbox',
        includeOutputFormat: preferGeoJSON,
        includeFilters: false,
        includeBbox: true,
      });

      if (preferGeoJSON) {
        variants.push({
          name: 'no-filter-with-bbox-no-output-format',
          includeOutputFormat: false,
          includeFilters: false,
          includeBbox: true,
        });
      }

      variants.push({
        name: 'no-filter-no-bbox',
        includeOutputFormat: preferGeoJSON,
        includeFilters: false,
        includeBbox: false,
      });

      if (preferGeoJSON) {
        variants.push({
          name: 'no-output-format-no-filter',
          includeOutputFormat: false,
          includeFilters: false,
          includeBbox: false,
        });
      }
    } else {
      variants.push({
        name: 'default',
        includeOutputFormat: preferGeoJSON,
        includeFilters: true,
        includeBbox: true,
      });

      if (preferGeoJSON) {
        variants.push({
          name: 'no-output-format',
          includeOutputFormat: false,
          includeFilters: true,
          includeBbox: true,
        });
      }
    }

    return variants;
  }

  private _hasFilterParams(
    geoservice: Geoservice,
    layerExtraParams: Array<[string, string]>,
    featureFilter: unknown
  ): boolean {
    let hasFilterInUrl = false;
    new URL(geoservice.url).searchParams.forEach((_value, key) => {
      if (WFS_FILTER_KEYS.has(String(key).toLowerCase())) {
        hasFilterInUrl = true;
      }
    });

    const hasFilterInLayerParams = layerExtraParams.some(([key]) =>
      WFS_FILTER_KEYS.has(key.toLowerCase())
    );

    if (hasFilterInUrl || hasFilterInLayerParams) {
      return true;
    }

    if (typeof featureFilter === 'string') {
      return featureFilter.trim().length > 0;
    }

    if (featureFilter && typeof featureFilter === 'object') {
      return Object.keys(featureFilter).length > 0;
    }

    return false;
  }

  private _projectionToCode(projection: Projection | string): string {
    if (typeof projection === 'string') {
      return projection;
    }

    if (projection && typeof projection.getCode === 'function') {
      return projection.getCode();
    }

    return DEFAULT_VECTOR_PROJECTION_CODE;
  }

  private _isGeoJSONFormat(): boolean {
    return String(this.get('format') || '').toLowerCase().includes('json');
  }

  private _isLikelyJsonPayload(payload: string): boolean {
    const trimmed = payload.trim();
    return trimmed.startsWith('{') || trimmed.startsWith('[');
  }

  private _looksLikeGeoJSONPayload(payload: unknown): boolean {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const asRecord = payload as Record<string, unknown>;
    return (
      asRecord.type === 'FeatureCollection' ||
      asRecord.type === 'Feature' ||
      Array.isArray(asRecord.features)
    );
  }

  private _getWfsExceptionMessage(payload: string): string | undefined {
    const trimmedPayload = payload.trim();
    if (!trimmedPayload.startsWith('<')) {
      return undefined;
    }

    try {
      const xml = new DOMParser().parseFromString(trimmedPayload, 'application/xml');
      if (xml.querySelector('parsererror')) {
        return undefined;
      }

      const exceptionText =
        xml.getElementsByTagNameNS('*', 'ExceptionText')[0] ||
        xml.getElementsByTagNameNS('*', 'ServiceException')[0] ||
        xml.getElementsByTagNameNS('*', 'Exception')[0];

      const message = exceptionText?.textContent?.trim();
      return message || undefined;
    } catch {
      return undefined;
    }
  }

  private _parseLayerSpec(rawLayerName: string): ParsedLayerSpec {
    const trimmed = rawLayerName.trim();
    if (!trimmed) {
      return { typeNames: '', extraParams: [] };
    }

    let typeNames = trimmed;
    let queryPart = '';

    if (typeNames.includes('?')) {
      const [namePart, ...queryParts] = typeNames.split('?');
      typeNames = namePart;
      queryPart = queryParts.join('?');
    }

    if (typeNames.includes('&')) {
      const [namePart, ...queryParts] = typeNames.split('&');
      typeNames = namePart;
      queryPart = [queryPart, queryParts.join('&')].filter(Boolean).join('&');
    }

    const extraParams: Array<[string, string]> = [];
    new URLSearchParams(queryPart).forEach((value, key) => {
      extraParams.push([key, value]);
    });

    return {
      typeNames: typeNames.trim(),
      extraParams,
    };
  }

  private _resolveInitialTypeNames(geoservice: Geoservice, parsedTypeNames: string): string {
    const typeNamesFromUrl = this._getTypeNamesFromGeoserviceUrl(geoservice)?.trim();

    if (!parsedTypeNames) {
      return typeNamesFromUrl || geoservice.layers || '';
    }

    if (!parsedTypeNames.includes(':') && typeNamesFromUrl?.includes(':')) {
      return typeNamesFromUrl;
    }

    return parsedTypeNames;
  }

  private _getTypeNamesFromGeoserviceUrl(geoservice: Geoservice): string | undefined {
    const url = new URL(geoservice.url);

    return (
      this._getQueryParamCaseInsensitive(url.searchParams, 'typeNames') ||
      this._getQueryParamCaseInsensitive(url.searchParams, 'typeName') ||
      undefined
    );
  }

  private _getQueryParamCaseInsensitive(searchParams: URLSearchParams, key: string): string | null {
    const lowerTarget = key.toLowerCase();

    let foundValue: string | null = null;

    searchParams.forEach((paramValue, paramKey) => {
      if (foundValue !== null) return;
      if (String(paramKey).toLowerCase() === lowerTarget) {
        foundValue = paramValue;
      }
    });

    return foundValue;
  }

  private _extractUnknownFeatureTypeName(message: string): string | undefined {
    const match = message.match(/Feature type\s*:?\s*([^\s]+)\s+unknown/i);
    return match?.[1];
  }

  private async _resolveUnknownTypeNames(
    geoservice: Geoservice,
    requestedTypeName: string
  ): Promise<string | undefined> {
    try {
      const capabilitiesUrl = this._buildWfsGetCapabilitiesUrl(geoservice);
      const response = await fetch(capabilitiesUrl.toString(), {
        headers: this._getAuthHeaders(),
      });

      if (!response.ok) {
        return undefined;
      }

      const payload = await response.text();
      const candidates = this._parseWfsFeatureTypeNamesFromCapabilities(payload);
      return this._selectFallbackTypeNames(requestedTypeName, candidates);
    } catch {
      return undefined;
    }
  }

  private _buildWfsGetCapabilitiesUrl(geoservice: Geoservice): URL {
    const originalUrl = new URL(geoservice.url);
    const finalUrl = new URL(`${originalUrl.origin}${originalUrl.pathname}`);

    originalUrl.searchParams.forEach((value, key) => {
      const lowerKey = String(key).toLowerCase();
      if (WFS_REQUEST_KEYS.has(lowerKey)) return;
      if (WFS_FILTER_KEYS.has(lowerKey)) return;
      if (lowerKey === 'outputformat') return;
      finalUrl.searchParams.append(key, value);
    });

    finalUrl.searchParams.set('service', 'WFS');
    finalUrl.searchParams.set('version', geoservice.version || '2.0.0');
    finalUrl.searchParams.set('request', 'GetCapabilities');

    return finalUrl;
  }

  private _parseWfsFeatureTypeNamesFromCapabilities(payload: string): string[] {
    const trimmed = payload.trim();
    if (!trimmed.startsWith('<')) {
      return [];
    }

    const xml = new DOMParser().parseFromString(trimmed, 'application/xml');
    if (xml.querySelector('parsererror')) {
      return [];
    }

    const featureTypes = Array.from(xml.getElementsByTagNameNS('*', 'FeatureType'));
    const names = featureTypes
      .map((featureType) => featureType.getElementsByTagNameNS('*', 'Name')[0]?.textContent?.trim() || '')
      .filter((name) => name.length > 0);

    return Array.from(new Set(names));
  }

  private _selectFallbackTypeNames(requestedTypeName: string, candidates: string[]): string | undefined {
    if (requestedTypeName.includes(',')) {
      return undefined;
    }

    const exactMatch = candidates.find((candidate) => candidate === requestedTypeName);
    if (exactMatch) {
      return exactMatch;
    }

    if (requestedTypeName.includes(':')) {
      const localName = requestedTypeName.split(':').pop();
      if (!localName) return undefined;
      const namespacedCandidate = candidates.find((candidate) => candidate.endsWith(`:${localName}`));
      return namespacedCandidate;
    }

    const prefixedCandidates = candidates.filter((candidate) =>
      candidate.startsWith(`${requestedTypeName}:`) || candidate.endsWith(`:${requestedTypeName}`)
    );

    if (prefixedCandidates.length === 0) {
      return undefined;
    }

    if (prefixedCandidates.length === 1) {
      return prefixedCandidates[0];
    }

    const preferred = prefixedCandidates.find((candidate) => candidate.toLowerCase().endsWith(':epci'));
    return preferred || prefixedCandidates[0];
  }

  public setAuthentication(username?: string, password?: string, accessToken?: string, tokenType: string = 'Bearer'): void {
    const trimmedAccessToken = accessToken?.trim();
    if (trimmedAccessToken) {
      const normalizedTokenType = tokenType?.trim() || 'Bearer';
      this.requestProperties.authorization = `${normalizedTokenType} ${trimmedAccessToken}`;
      delete this.requestProperties.username;
      delete this.requestProperties.password;
      return;
    }

    delete this.requestProperties.authorization;

    if (!username || !password) {
      delete this.requestProperties.username;
      delete this.requestProperties.password;
      return;
    }

    this.requestProperties.username = username;
    this.requestProperties.password = password;
  }

  public getCachePath(): string {
    return String(this.get('cache') || '');
  }

  /**
   * Load features from cache (or service as fallback)
   */
  public async loadFromCache(extent0: number[], resolution: number, projection: Projection): Promise<void> {
    await this._loaderFn(extent0, resolution, projection);
  }

  /**
   * Handle WFS load error
   */
  private _handleWFSLoadError(status: string, error: any): void {
    const remains = Math.max(0, --this._tileLoading);

    if (status !== 'abort') {
      this.dispatchEvent({ type: 'loadend', error, status, remains } as any);
    } else {
      this.dispatchEvent({ type: 'loadend', remains } as any);
    }
  }

  /**
   * Get the file cache name
   */
  public getFileCacheName(): string {
    if (this.get('once')) {
      return `${this.get('cache')}.cache`;
    }
    return '';
  }
}
