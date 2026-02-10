/**
 * OpenLayers source for WFS (Web Feature Service) layers
 * @migrated from: ol/source/WFS.js of the CordovApp module
 */
import { Collection } from 'ol';
import VectorSource from 'ol/source/Vector';
import { bbox, tile } from 'ol/loadingstrategy';
import { createXYZ } from 'ol/tilegrid';
import GeoJSON from 'ol/format/GeoJSON';
import WFS from 'ol/format/WFS';
import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();
import { WFS_DEFAULT_VALUES } from './DefaultSourceValues';
import { transformExtent } from 'ol/proj';
import GML3 from 'ol/format/GML3';
import GML2 from 'ol/format/GML2';
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
export default class WFSSource extends VectorSource {
    constructor(options, cache) {
        const superOptions = WFSSource._computeWFSSourceOptions(options, cache);
        super(superOptions);
        this.localProperties = {};
        this.requestProperties = {};
        this._tileLoading = 0;
        this._done = false;
        this.localProperties = superOptions.computedLocalProperties;
        this._initWFSSource(options);
    }
    /**
     * Compute VectorSource options from WFS options
     */
    static _computeWFSSourceOptions(options, cache) {
        const opts = options || {};
        const computedLocalProperties = {
            tiled: false,
            layerExtraParams: []
        };
        let strategy = opts.strategy;
        if (!strategy && opts.tileZoom) {
            const tileZoom = opts.tileZoom ?? opts.minZoom ?? WFS_DEFAULT_VALUES.MIN_ZOOM_INCREASE;
            const tileGrid = createXYZ({
                tileSize: opts.tileSize || WFS_DEFAULT_VALUES.TILE_SIZE,
                minZoom: tileZoom,
                maxZoom: tileZoom,
            });
            strategy = tile(tileGrid);
            computedLocalProperties.tileGrid = tileGrid;
            computedLocalProperties.table = opts.table;
            computedLocalProperties.tiled = true;
            computedLocalProperties.maxReload = opts.maxReload;
        }
        else if (!strategy) {
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
    _initWFSSource(options) {
        const opts = options || {};
        const geoservice = opts.geoservice || {};
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
        this.setAuthentication(opts.username, opts.password);
        this._configureLoader();
    }
    _configureLoader() {
        this.setLoader((extent, resolution, projection, success, failure) => {
            void this._loaderFn(extent, resolution, projection, success, failure);
        });
    }
    async _loaderFn(extent0, resolution, projection, success, failure) {
        if (this._done && this.get('once')) {
            if (success)
                success([]);
            return;
        }
        this._done = true;
        const projectionCode = this._projectionToCode(projection);
        const requestCrs = String(this.get('projection') || WFS_DEFAULT_VALUES.SRS_NAME);
        const requestExtent = transformExtent(extent0, projectionCode, requestCrs);
        const tileCoord = this.localProperties.tileGrid
            ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(extent0, resolution)
            : null;
        this.dispatchEvent({ type: 'loadstart', remains: ++this._tileLoading });
        try {
            let payload;
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
            this.dispatchEvent({ type: 'loadend', remains: --this._tileLoading });
            if (success)
                success(features);
        }
        catch (error) {
            const status = error?.name === 'AbortError' ? 'abort' : 'error';
            this._handleWFSLoadError(status, error);
            if (failure)
                failure();
        }
    }
    async _loadFromCache(requestExtent, resolution, tileCoord) {
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
        }
        catch (cacheError) {
            if (cacheError === 'obsolete') {
                try {
                    return await this.localProperties.loadCache({
                        ...cacheParameters,
                        obsolete: true,
                    });
                }
                catch {
                    return undefined;
                }
            }
            return undefined;
        }
    }
    async _loadFromService(requestExtent, requestCrs) {
        const geoservice = this._buildCurrentGeoservice();
        const layerExtraParams = (this.localProperties.layerExtraParams || []);
        const preferGeoJSON = this._isGeoJSONFormat();
        const hasFilters = this._hasFilterParams(geoservice, layerExtraParams, this.localProperties.featureFilter);
        let activeTypeNames = String(this.get('typename') || '');
        let attempt = await this._tryLoadWithTypeNames(activeTypeNames, geoservice, layerExtraParams, requestExtent, requestCrs, preferGeoJSON, hasFilters);
        if (!attempt.payload && attempt.error) {
            const unknownTypeName = this._extractUnknownFeatureTypeName(attempt.error.message);
            if (unknownTypeName) {
                const fallbackTypeNames = await this._resolveUnknownTypeNames(geoservice, unknownTypeName);
                if (fallbackTypeNames && fallbackTypeNames !== activeTypeNames) {
                    console.warn(`[WFSSource] Resolved unknown feature type "${unknownTypeName}" to "${fallbackTypeNames}".`);
                    activeTypeNames = fallbackTypeNames;
                    attempt = await this._tryLoadWithTypeNames(activeTypeNames, geoservice, layerExtraParams, requestExtent, requestCrs, preferGeoJSON, hasFilters);
                }
            }
        }
        if (!attempt.payload) {
            throw attempt.error || new Error('WFS request failed');
        }
        return attempt.payload;
    }
    async _tryLoadWithTypeNames(typeNames, geoservice, layerExtraParams, requestExtent, requestCrs, preferGeoJSON, hasFilters) {
        const variants = this._getWfsRequestVariants(preferGeoJSON, hasFilters);
        const seenUrls = new Set();
        let lastError;
        for (const variant of variants) {
            const url = this._buildWfsGetFeatureUrl(geoservice, typeNames, layerExtraParams, requestCrs, requestExtent, variant);
            const urlString = url.toString();
            if (seenUrls.has(urlString)) {
                continue;
            }
            seenUrls.add(urlString);
            try {
                const payload = await this._fetchWfsPayload(urlString);
                return { payload };
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
            }
        }
        return {
            error: lastError || new Error('WFS request failed')
        };
    }
    async _fetchWfsPayload(url) {
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
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    _getAuthHeaders() {
        const headers = {
            'cache-control': 'no-cache'
        };
        const { username, password } = this.requestProperties;
        if (username && password) {
            headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
        }
        return headers;
    }
    /**
     * Read WFS response and return features to add
     */
    _readWFSResponse(response, requestCrs, projectionCode) {
        const loadedFeatures = this._parseFeaturesFromPayload(response, requestCrs, projectionCode);
        if (!loadedFeatures.length) {
            return [];
        }
        const featuresToAdd = [];
        const idProperty = typeof this.get('id') === 'string' && this.get('id')
            ? String(this.get('id'))
            : undefined;
        const existingFeatures = this.getFeatures();
        const existingIds = new Set();
        if (idProperty) {
            for (const existingFeature of existingFeatures) {
                const existingId = existingFeature.get(idProperty);
                if (existingId !== undefined && existingId !== null) {
                    existingIds.add(String(existingId));
                }
            }
        }
        const existingFeatureIds = new Set();
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
            if (geomExtent[0] >= 360 || geomExtent[0] <= -360 ||
                geomExtent[2] >= 360 || geomExtent[2] <= -360) {
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
    _parseFeaturesFromPayload(payload, requestCrs, projectionCode) {
        const preferGeoJSON = this._isGeoJSONFormat();
        if (payload === undefined || payload === null) {
            return [];
        }
        if (typeof payload === 'object' && payload !== null && !(payload instanceof Document)) {
            if (preferGeoJSON || this._looksLikeGeoJSONPayload(payload)) {
                return new GeoJSON().readFeatures(payload, {
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
            }
            catch {
                // Keep parsing with WFS XML parser below
            }
        }
        let data = new WFS({ gmlFormat: new GML3() }).readFeatures(trimmedPayload, {
            dataProjection: requestCrs,
            featureProjection: projectionCode,
        });
        if (data.length && (!data[0]?.getGeometry() || !data[0]?.getGeometry()?.getExtent())) {
            data = new WFS({ gmlFormat: new GML2() }).readFeatures(trimmedPayload, {
                dataProjection: requestCrs,
                featureProjection: projectionCode,
            });
        }
        return data;
    }
    _buildCurrentGeoservice() {
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
    _buildWfsGetFeatureUrl(geoservice, typeNames, layerExtraParams, requestCrs, requestExtent, options) {
        const originalUrl = new URL(geoservice.url);
        const finalUrl = new URL(`${originalUrl.origin}${originalUrl.pathname}`);
        const preservedParams = new Map();
        const addPreservedParam = (key, value) => {
            const lowerKey = key.toLowerCase();
            if (WFS_REQUEST_KEYS.has(lowerKey))
                return;
            if (lowerKey === 'outputformat')
                return;
            if (!options.includeFilters && WFS_FILTER_KEYS.has(lowerKey))
                return;
            const existing = preservedParams.get(lowerKey);
            if (existing) {
                existing.values.push(value);
            }
            else {
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
    _serializeFeatureFilter() {
        const filter = this.localProperties.featureFilter;
        if (typeof filter === 'string') {
            const trimmedFilter = filter.trim();
            if (!trimmedFilter)
                return undefined;
            return { key: 'cql_filter', value: trimmedFilter };
        }
        if (!filter || typeof filter !== 'object') {
            return undefined;
        }
        const clauses = [];
        for (const [key, value] of Object.entries(filter)) {
            if (value === undefined) {
                continue;
            }
            if (value === null) {
                clauses.push(`${key} IS NULL`);
            }
            else {
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
    _toCqlLiteral(value) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return String(value);
        }
        if (typeof value === 'boolean') {
            return value ? 'TRUE' : 'FALSE';
        }
        const escaped = String(value).replace(/'/g, "''");
        return `'${escaped}'`;
    }
    _getWfsRequestVariants(preferGeoJSON, hasFilter) {
        const variants = [];
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
        }
        else {
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
    _hasFilterParams(geoservice, layerExtraParams, featureFilter) {
        let hasFilterInUrl = false;
        new URL(geoservice.url).searchParams.forEach((_value, key) => {
            if (WFS_FILTER_KEYS.has(String(key).toLowerCase())) {
                hasFilterInUrl = true;
            }
        });
        const hasFilterInLayerParams = layerExtraParams.some(([key]) => WFS_FILTER_KEYS.has(key.toLowerCase()));
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
    _projectionToCode(projection) {
        if (typeof projection === 'string') {
            return projection;
        }
        if (projection && typeof projection.getCode === 'function') {
            return projection.getCode();
        }
        return 'EPSG:3857';
    }
    _isGeoJSONFormat() {
        return String(this.get('format') || '').toLowerCase().includes('json');
    }
    _isLikelyJsonPayload(payload) {
        const trimmed = payload.trim();
        return trimmed.startsWith('{') || trimmed.startsWith('[');
    }
    _looksLikeGeoJSONPayload(payload) {
        if (!payload || typeof payload !== 'object') {
            return false;
        }
        const asRecord = payload;
        return (asRecord.type === 'FeatureCollection' ||
            asRecord.type === 'Feature' ||
            Array.isArray(asRecord.features));
    }
    _getWfsExceptionMessage(payload) {
        const trimmedPayload = payload.trim();
        if (!trimmedPayload.startsWith('<')) {
            return undefined;
        }
        try {
            const xml = new DOMParser().parseFromString(trimmedPayload, 'application/xml');
            if (xml.querySelector('parsererror')) {
                return undefined;
            }
            const exceptionText = xml.getElementsByTagNameNS('*', 'ExceptionText')[0] ||
                xml.getElementsByTagNameNS('*', 'ServiceException')[0] ||
                xml.getElementsByTagNameNS('*', 'Exception')[0];
            const message = exceptionText?.textContent?.trim();
            return message || undefined;
        }
        catch {
            return undefined;
        }
    }
    _parseLayerSpec(rawLayerName) {
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
        const extraParams = [];
        new URLSearchParams(queryPart).forEach((value, key) => {
            extraParams.push([key, value]);
        });
        return {
            typeNames: typeNames.trim(),
            extraParams,
        };
    }
    _resolveInitialTypeNames(geoservice, parsedTypeNames) {
        const typeNamesFromUrl = this._getTypeNamesFromGeoserviceUrl(geoservice)?.trim();
        if (!parsedTypeNames) {
            return typeNamesFromUrl || geoservice.layers || '';
        }
        if (!parsedTypeNames.includes(':') && typeNamesFromUrl?.includes(':')) {
            return typeNamesFromUrl;
        }
        return parsedTypeNames;
    }
    _getTypeNamesFromGeoserviceUrl(geoservice) {
        const url = new URL(geoservice.url);
        return (this._getQueryParamCaseInsensitive(url.searchParams, 'typeNames') ||
            this._getQueryParamCaseInsensitive(url.searchParams, 'typeName') ||
            undefined);
    }
    _getQueryParamCaseInsensitive(searchParams, key) {
        const lowerTarget = key.toLowerCase();
        let foundValue = null;
        searchParams.forEach((paramValue, paramKey) => {
            if (foundValue !== null)
                return;
            if (String(paramKey).toLowerCase() === lowerTarget) {
                foundValue = paramValue;
            }
        });
        return foundValue;
    }
    _extractUnknownFeatureTypeName(message) {
        const match = message.match(/Feature type\s*:?\s*([^\s]+)\s+unknown/i);
        return match?.[1];
    }
    async _resolveUnknownTypeNames(geoservice, requestedTypeName) {
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
        }
        catch {
            return undefined;
        }
    }
    _buildWfsGetCapabilitiesUrl(geoservice) {
        const originalUrl = new URL(geoservice.url);
        const finalUrl = new URL(`${originalUrl.origin}${originalUrl.pathname}`);
        originalUrl.searchParams.forEach((value, key) => {
            const lowerKey = String(key).toLowerCase();
            if (WFS_REQUEST_KEYS.has(lowerKey))
                return;
            if (WFS_FILTER_KEYS.has(lowerKey))
                return;
            if (lowerKey === 'outputformat')
                return;
            finalUrl.searchParams.append(key, value);
        });
        finalUrl.searchParams.set('service', 'WFS');
        finalUrl.searchParams.set('version', geoservice.version || '2.0.0');
        finalUrl.searchParams.set('request', 'GetCapabilities');
        return finalUrl;
    }
    _parseWfsFeatureTypeNamesFromCapabilities(payload) {
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
    _selectFallbackTypeNames(requestedTypeName, candidates) {
        if (requestedTypeName.includes(',')) {
            return undefined;
        }
        const exactMatch = candidates.find((candidate) => candidate === requestedTypeName);
        if (exactMatch) {
            return exactMatch;
        }
        if (requestedTypeName.includes(':')) {
            const localName = requestedTypeName.split(':').pop();
            if (!localName)
                return undefined;
            const namespacedCandidate = candidates.find((candidate) => candidate.endsWith(`:${localName}`));
            return namespacedCandidate;
        }
        const prefixedCandidates = candidates.filter((candidate) => candidate.startsWith(`${requestedTypeName}:`) || candidate.endsWith(`:${requestedTypeName}`));
        if (prefixedCandidates.length === 0) {
            return undefined;
        }
        if (prefixedCandidates.length === 1) {
            return prefixedCandidates[0];
        }
        const preferred = prefixedCandidates.find((candidate) => candidate.toLowerCase().endsWith(':epci'));
        return preferred || prefixedCandidates[0];
    }
    setAuthentication(username, password) {
        if (!username || !password) {
            delete this.requestProperties.username;
            delete this.requestProperties.password;
            return;
        }
        this.requestProperties.username = username;
        this.requestProperties.password = password;
    }
    getCachePath() {
        return String(this.get('cache') || '');
    }
    /**
     * Load features from cache (or service as fallback)
     */
    async loadFromCache(extent0, resolution, projection) {
        await this._loaderFn(extent0, resolution, projection);
    }
    /**
     * Handle WFS load error
     */
    _handleWFSLoadError(status, error) {
        const remains = Math.max(0, --this._tileLoading);
        if (status !== 'abort') {
            this.dispatchEvent({ type: 'loadend', error, status, remains });
        }
        else {
            this.dispatchEvent({ type: 'loadend', remains });
        }
    }
    /**
     * Get the file cache name
     */
    getFileCacheName() {
        if (this.get('once')) {
            return `${this.get('cache')}.cache`;
        }
        return '';
    }
}
//# sourceMappingURL=WFSSource.js.map