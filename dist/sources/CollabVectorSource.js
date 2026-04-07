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
import { DocumentManager, isCollaborativeDocumentDraft } from '../collaborative/DocumentManager';
import { SOURCE_ERROR_CODES } from './ErrorCodes';
import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();
const FEATURE_TRANSACTION_STATES = {
    insert: 'Insert',
    update: 'Update',
    delete: 'Delete',
};
function isFeatureState(featureState, expectedState) {
    if (featureState === expectedState) {
        return true;
    }
    switch (expectedState) {
        case FEATURE_TRANSACTION_STATES.insert:
            return featureState === 'INSERT';
        case FEATURE_TRANSACTION_STATES.update:
            return featureState === 'UPDATE';
        case FEATURE_TRANSACTION_STATES.delete:
            return featureState === 'DELETE';
        default:
            return false;
    }
}
function uniqueStrings(values) {
    const result = [];
    for (const value of values) {
        if (!value || result.includes(value)) {
            continue;
        }
        result.push(value);
    }
    return result;
}
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
        const cacheNamespace = CollabVectorSource._getCacheNamespace(opts);
        const legacyEditionCacheFile = pathUtils.sanitizeFileName(`${table.database}-${table.name}-editions.txt`);
        const editionCacheFile = cacheNamespace
            ? pathUtils.sanitizeFileName(`${cacheNamespace}-editions.txt`)
            : legacyEditionCacheFile;
        const properties = {
            online: opts.online ?? true,
            useCacheWhenOnline: opts.useCacheWhenOnline === true,
            cacheNamespace,
            cacheUrl: opts.cacheUrl,
            editionCacheFile,
            legacyEditionCacheFile: editionCacheFile !== legacyEditionCacheFile ? legacyEditionCacheFile : undefined,
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
    static _getCacheNamespace(options) {
        const rawNamespace = options.cacheNamespace?.trim();
        if (!rawNamespace) {
            return undefined;
        }
        return pathUtils.sanitizeFileName(rawNamespace);
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
        feature.state = FEATURE_TRANSACTION_STATES.insert;
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
        if (isFeatureState(featureState, FEATURE_TRANSACTION_STATES.insert)) {
            this.removeFeatureFromCollection(this.insertedFeatures, feature);
        }
        else {
            if (isFeatureState(featureState, FEATURE_TRANSACTION_STATES.update)) {
                this.removeFeatureFromCollection(this.updatedFeatures, feature);
            }
            this.deletedFeatures.push(feature);
        }
        feature.state = FEATURE_TRANSACTION_STATES.delete;
        this.writeChanges();
    }
    getPendingChangesCount() {
        return (this.insertedFeatures.getLength() +
            this.updatedFeatures.getLength() +
            this.deletedFeatures.getLength());
    }
    resetChanges() {
        this.insertedFeatures.clear();
        this.deletedFeatures.clear();
        this.updatedFeatures.clear();
        this.preservedFeatures.clear();
        this.reload();
        this.writeChanges(true);
        this._dispatchEditChange();
    }
    async submitChanges() {
        this.dispatchEvent({ type: 'savestart' });
        try {
            const actions = await this._resolveTransactionDocumentActions(this._getTransactionActions());
            if (!actions.length) {
                this.dispatchEvent({ type: 'saveend' });
                return null;
            }
            const client = this._options.client;
            if (typeof client?.addTransaction !== 'function') {
                const error = new Error('Collaborative client does not support addTransaction');
                this.dispatchEvent({ type: 'saveend', status: 'error', error });
                throw error;
            }
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
                });
                throw transaction;
            }
            this.resetChanges();
            this.dispatchEvent({ type: 'saveend', transaction });
            return transaction;
        }
        catch (error) {
            this.dispatchEvent({ type: 'saveend', status: 'error', error });
            throw error;
        }
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
        this._dispatchEditChange();
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
        const editionCacheKeys = uniqueStrings([
            editionCacheFile,
            this.localProperties.legacyEditionCacheFile,
        ]);
        if (this._cache) {
            this._loadEditionCacheFromCandidates(editionCacheKeys)
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
                let cached = null;
                for (const cacheKey of editionCacheKeys) {
                    cached = localStorage.getItem(cacheKey);
                    if (cached) {
                        break;
                    }
                }
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
                    feature.state = FEATURE_TRANSACTION_STATES.insert;
                    this.insertedFeatures.push(feature);
                }
            });
        }
        if (actions.update && Array.isArray(actions.update)) {
            actions.update.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = FEATURE_TRANSACTION_STATES.update;
                    this.updatedFeatures.push(feature);
                }
            });
        }
        if (actions.delete && Array.isArray(actions.delete)) {
            actions.delete.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = FEATURE_TRANSACTION_STATES.delete;
                    this.deletedFeatures.push(feature);
                }
            });
        }
        this._dispatchEditChange();
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
    onUpdateFeature(feature, event) {
        if (this._isLoading)
            return;
        const featureState = feature.state;
        const updatedKey = event?.key;
        if (isFeatureState(featureState, FEATURE_TRANSACTION_STATES.insert))
            return;
        if (updatedKey && updatedKey !== 'geometry') {
            const updates = (feature.updates || {});
            updates[updatedKey] = true;
            feature.updates = updates;
        }
        if (!isFeatureState(featureState, FEATURE_TRANSACTION_STATES.update)) {
            feature.state = FEATURE_TRANSACTION_STATES.update;
            this.updatedFeatures.push(feature);
        }
        this.writeChanges();
    }
    _dispatchEditChange() {
        this.dispatchEvent({
            type: 'editchange',
            pendingChangesCount: this.getPendingChangesCount(),
        });
    }
    _getTransactionActions() {
        return [
            ...this._buildTransactionActions(this.insertedFeatures, FEATURE_TRANSACTION_STATES.insert, true),
            ...this._buildTransactionActions(this.deletedFeatures, FEATURE_TRANSACTION_STATES.delete, false),
            ...this._buildTransactionActions(this.updatedFeatures, FEATURE_TRANSACTION_STATES.update, false),
        ];
    }
    _getDocumentColumnNames() {
        return Object.entries(this.table.columns)
            .filter(([, column]) => typeof column.type === 'string' && column.type.toLowerCase() === 'document')
            .map(([columnName]) => columnName);
    }
    async _resolveTransactionDocumentActions(actions) {
        const documentColumnNames = this._getDocumentColumnNames();
        if (!documentColumnNames.length) {
            return actions;
        }
        const documentManager = new DocumentManager(this._options.client);
        const uploadedDocumentIds = new Map();
        return Promise.all(actions.map(async (action) => {
            const actionData = action.data;
            if (!actionData || typeof actionData !== 'object') {
                return action;
            }
            const nextData = { ...actionData };
            for (const columnName of documentColumnNames) {
                const value = nextData[columnName];
                if (!isCollaborativeDocumentDraft(value)) {
                    continue;
                }
                if (value.file) {
                    const cacheKey = JSON.stringify(value.file);
                    let documentId = uploadedDocumentIds.get(cacheKey);
                    if (!documentId) {
                        documentId = await documentManager.addCollaborativeDocument(value.file);
                        uploadedDocumentIds.set(cacheKey, documentId);
                    }
                    nextData[columnName] = documentId;
                    continue;
                }
                nextData[columnName] = await documentManager.resolveCollaborativeDocumentValue(value);
            }
            return {
                ...action,
                data: nextData,
            };
        }));
    }
    _buildTransactionActions(collection, state, full) {
        return collection.getArray()
            .filter((feature) => isFeatureState(feature.state, state))
            .map((feature) => ({
            data: this._serializeTransactionFeature(feature, full),
            state,
            table: this.table.id,
        }));
    }
    _serializeTransactionFeature(feature, full) {
        const properties = feature.getProperties();
        const data = {};
        const geometryName = this._getGeometryColumnName();
        const idName = this._getIdPropertyName();
        const updates = (feature.updates || {});
        if (full) {
            for (const key in properties) {
                if (key !== geometryName && key !== 'geometry') {
                    data[key] = properties[key];
                }
            }
        }
        else {
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
            const formatWKT = this.localProperties.formatWKT;
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
    async _loadEditionCacheFromCandidates(cacheKeys) {
        for (const cacheKey of cacheKeys) {
            const actions = await this._loadEditionCache(cacheKey);
            if (actions) {
                return actions;
            }
        }
        return null;
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
            const canReadCache = Boolean(this.localProperties.cacheUrl || this.localProperties.cacheNamespace);
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
                if (!isFeatureState(feature.state, FEATURE_TRANSACTION_STATES.insert))
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
        const keys = this._getOfflineCacheKeys(extent, resolution, true);
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
    getCacheNamespace() {
        return this.localProperties.cacheNamespace || this._getLegacyCacheNamespace();
    }
    getOfflineCacheKeys(extent, resolution) {
        return this._getOfflineCacheKeys(extent, resolution);
    }
    _getOfflineCacheKeys(extent, resolution, includeLegacyFallback = false) {
        const legacyBaseKey = this._getLegacyCacheNamespace();
        const baseKeys = uniqueStrings([
            this.localProperties.cacheNamespace || legacyBaseKey,
            includeLegacyFallback ? legacyBaseKey : undefined,
        ]);
        const tileGrid = this.localProperties.tileGrid;
        if (!tileGrid) {
            return baseKeys;
        }
        const tileCoord = tileGrid.getTileCoordForCoordAndResolution(getCenter(extent), resolution);
        return uniqueStrings(baseKeys.flatMap((baseKey) => [`${baseKey}:${tileCoord.join('-')}`, baseKey]));
    }
    _getLegacyCacheNamespace() {
        return `${this.table.database}:${this.table.name}`;
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
        return this.table?.idName || 'id';
    }
    _getGeometryColumnName() {
        return this.table?.geometryName || 'geometry';
    }
    _getTableCRS() {
        const geometryName = this._getGeometryColumnName();
        const column = this.table?.columns?.[geometryName];
        return column?.crs || COLLAB_VECTOR_DEFAULT_VALUES.SRS_NAME;
    }
}
//# sourceMappingURL=CollabVectorSource.js.map