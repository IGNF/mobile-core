/**
 * CollabVectorSource - OpenLayers source for collaborative vector layers
 *
 * This class extends OpenLayers VectorSource to provide collaborative editing capabilities
 * with support for offline caching, differential updates, and feature preservation.
 *
 * Key features:
 * - Tile-based or bbox loading strategies
 * - Offline cache support with local edition tracking
 * - Differential feature management (inserts, updates, deletes)
 * - Feature preservation during reloads
 * - Integration with collaborative client API
 *
 * @extends VectorSource
 * @migrated from ol/source/CollabVector.js of the CordovApp module
 */
import { ProjectionUtils } from '../utils/ProjectionUtils';
import { COLLAB_VECTOR_DEFAULT_VALUES } from "./DefaultSourceValues";
import VectorSource from 'ol/source/Vector';
import { tile, bbox } from 'ol/loadingstrategy';
import { createXYZ } from 'ol/tilegrid';
import { Collection, Feature } from 'ol';
import WKT from 'ol/format/WKT';
import proj4 from 'proj4';
import { SOURCE_ERROR_CODES } from './ErrorCodes';
import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();
// Initialize ProjectionUtils instance
import EventManager from '../utils/EventManager';
export default class CollabVectorSource extends VectorSource {
    /**
     * Creates a new CollabVectorSource
     *
     * @param options - Configuration options for the collaborative vector source
     * @throws {Error} If client or table are not defined in options
     */
    constructor(options) {
        // Step 1: Initialize utilities before calling super()
        // These are needed to compute VectorSource options
        const projectionUtils = new ProjectionUtils();
        projectionUtils.initProjections();
        // Step 2: Compute VectorSource configuration
        // This validates required options and determines loading strategy (tile vs bbox)
        const superOptions = CollabVectorSource._computeVectorSourceOptions(options);
        // Step 3: Initialize parent VectorSource with computed options
        super(superOptions);
        this._isLoading = false;
        this._writeUpdateCounter = 0;
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
        // Step 4: Store instance properties
        this._options = options || {};
        this._eventManager = new EventManager();
        this._cache = options.cache;
        this.localProperties = superOptions.properties || {};
        // Step 5: Complete collaborative-specific initialization
        // Sets up event handlers, preserved features, and loads cached edits
        this._initCollabVectorSource();
    }
    /**
     * Computes and validates VectorSource configuration options
     *
     * This static method is called before super() to prepare the configuration
     *
     * @param options - User-provided collaborative vector source options
     * @returns Configuration object for VectorSource constructor
     * @throws {Error} If client or table are not defined
     * @private
     */
    static _computeVectorSourceOptions(options) {
        const opts = options || {};
        // Validate required options
        if (opts.client === undefined) {
            throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_CLIENT_DEFINED);
        }
        if (opts.table === undefined) {
            throw new Error(SOURCE_ERROR_CODES.COLLAB_NO_TABLE_DEFINED);
        }
        const table = opts.table;
        // Determine loading strategy: tile-based or bbox-based
        let strategy = opts.strategy || bbox;
        if (opts.tileZoom) {
            // Tile-based strategy: loads features in fixed zoom tiles
            const tileGrid = createXYZ({
                tileSize: opts.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE,
                minZoom: opts.tileZoom,
                maxZoom: opts.tileZoom,
            });
            strategy = tile(tileGrid);
        }
        // Extended properties beyond standard VectorSource options
        const properties = {
            online: opts.online ?? true,
            cacheUrl: opts.cacheUrl,
            editionCacheFile: pathUtils.sanitizeFileName(table.database + '-' + table.name + '-editions.txt'),
            formatWKT: new WKT(), // WKT format handler for geometry serialization
        };
        if (opts.tileZoom) {
            properties.maxReload = opts.maxReload;
        }
        return {
            strategy: strategy,
            properties: properties,
            features: new Collection(),
            attributions: opts.attribution,
            logo: opts.logo,
            useSpatialIndex: true, // Spatial index is required for tile loading strategy
            wrapX: opts.wrapX,
        };
    }
    /**
     * Completes collaborative-specific initialization after VectorSource setup
     *
     * This method handles:
     * - Document URI configuration for the collaborative API
     * - Projection validation
     * - Feature filtering setup (to exclude deleted/destroyed features)
     * - Event handler registration for feature lifecycle
     * - Loading cached local edits from previous sessions
     *
     * @private
     */
    _initCollabVectorSource() {
        const table = this._options.table || {};
        this.table = table;
        // Derive document endpoint from WFS URL (e.g., for attachments)
        table.docURI = table.wfs.replace(/\/gcms\/.*/, "/document/");
        // Apply defaults for max features and tile size
        this._options.maxFeatures = this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES;
        this._options.tileSize = this._options.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE;
        // Validate that the spatial reference system is known to proj4
        const srsName = table.columns[table.geometryName]?.crs ?? COLLAB_VECTOR_DEFAULT_VALUES.SRS_NAME;
        if (!proj4.defs(srsName)) {
            console.error(SOURCE_ERROR_CODES.COLLAB_UNKNOWN_PROJECTION, srsName);
        }
        // Configure filter to exclude logically deleted features from the layer
        this.localProperties.featureFilter = this._options.filter ?? {};
        if (table.columns.detruit) {
            this.localProperties.featureFilter = { detruit: false };
        }
        else if (table.columns.gcms_detruit) {
            this.localProperties.featureFilter = { gcms_detruit: false };
        }
        // Initialize collection of features to preserve during source refreshes
        this.localProperties.preservedFeatures = this._options.preserved ?? new Collection();
        // Wire up event handlers for feature lifecycle tracking
        this._eventManager.on('addfeature', this.onAddFeature.bind(this));
        this._eventManager.on('removefeature', this.onDeleteFeature.bind(this));
        // Note: Feature property changes are handled via 'propertychange' event on the
        // feature itself to avoid style changes triggering update tracking
        // Load any cached local edits from disk
        this.loadChanges();
        // TODO: Determine if custom loader is needed when no cache URL is provided
        if (!this.localProperties.cacheUrl) {
            // this.setLoader(this.loaderFn_);
        }
    }
    getTable() {
        return this.table;
    }
    /**
     * Handles feature addition events
     *
     * Called when a new feature is added to the source. This method:
     * - Sets up geometry change listeners
     * - Sets up property change listeners for tracking updates
     * - Marks the feature for insertion if not currently loading
     * - Ensures all table columns have default null values
     * - Saves changes to cache
     *
     * @param feature - The feature being added
     */
    onAddFeature(feature) {
        // Set up geometry change listener to track geometric modifications
        const geometry = feature.getGeometry();
        if (geometry) {
            geometry.on('change', () => {
                // Mark that geometry was updated
                const updates = feature.updates || {};
                updates.geometry = true;
                feature.updates = updates;
                // Dispatch property change event
                feature.dispatchEvent({
                    type: 'propertychange',
                    target: feature
                });
            });
        }
        // Set up property change listener for attribute updates
        feature.on('propertychange', this.onUpdateFeature.bind(this, feature));
        // Don't track changes while loading from server/cache
        if (this._isLoading)
            return;
        // Mark feature as newly inserted
        feature.state = 'INSERT';
        // Initialize all table columns with null if not present
        const columns = this.table?.columns || {};
        const geometryName = this.table?.geometryName || 'geometry';
        for (const columnName in columns) {
            if (columnName !== geometryName) {
                if (feature.get(columnName) === undefined) {
                    feature.set(columnName, null, true); // true = silent (no event)
                }
            }
        }
        // Add to inserted features collection
        this.insertedFeatures.push(feature);
        // Persist changes to cache
        this.writeChanges();
    }
    /**
     * Handles feature deletion events
     *
     * Called when a feature is removed from the source. This method:
     * - Manages feature state transitions (INSERT -> removed, UPDATE -> DELETE)
     * - Removes from insert/update collections if applicable
     * - Adds to delete collection if feature existed on server
     * - Saves changes to cache
     *
     * @param feature - The feature being deleted
     */
    onDeleteFeature(feature) {
        // Don't track changes while loading from server/cache
        if (this._isLoading)
            return;
        const featureState = feature.state;
        // State transitions: INSERT->removed, UPDATE->DELETE, or default->DELETE
        if (featureState === 'INSERT') {
            // Feature was only inserted locally, just remove it from inserts
            this.removeFeatureFromCollection(this.insertedFeatures, feature);
        }
        else {
            // Feature exists on server or was updated
            if (featureState === 'UPDATE') {
                // Remove from updates first
                this.removeFeatureFromCollection(this.updatedFeatures, feature);
            }
            // Track deletion for server synchronization
            this.deletedFeatures.push(feature);
        }
        // Mark feature as deleted
        feature.state = 'DELETE';
        // Persist changes to cache
        this.writeChanges();
    }
    /**
     * Helper method to remove a feature from a collection
     *
     * @param collection - The collection to remove from
     * @param feature - The feature to remove
     * @private
     */
    removeFeatureFromCollection(collection, feature) {
        const features = collection.getArray();
        const index = features.indexOf(feature);
        if (index > -1) {
            collection.removeAt(index);
        }
    }
    /**
     * Writes local changes to cache file
     *
     * This method debounces multiple rapid changes to prevent excessive file writes.
     * It collects all pending changes (inserts, updates, deletes) and persists them
     * to the edition cache file.
     *
     * @param force - If true, writes immediately; if false, debounces the write
     */
    writeChanges(force = false) {
        // Debounce rapid changes: increment counter and schedule write after 100ms
        if (!force) {
            this._writeUpdateCounter++;
            setTimeout(() => {
                this.writeChanges(true);
            }, 100); // 100ms debounce
            return;
        }
        // Decrement counter; only write if no more pending updates (counter reaches 0)
        this._writeUpdateCounter--;
        if (this._writeUpdateCounter > 0)
            return;
        this._writeUpdateCounter = 0;
        // Get all pending changes to save
        const actions = this.getSaveActions(true);
        // Check if we have a cache file configured
        const editionCacheFile = this.localProperties.editionCacheFile;
        if (!editionCacheFile)
            return;
        // Save to cache storage if available
        if (this._cache) {
            this._saveEditionCache(editionCacheFile, actions).catch(error => {
                console.error('ERROR: writeChanges on layer', error);
            });
        }
        else {
            // Fallback to localStorage if no cache storage provided
            try {
                localStorage.setItem(editionCacheFile, JSON.stringify(actions));
            }
            catch (error) {
                console.error('ERROR: writeChanges fallback to localStorage', error);
            }
        }
    }
    /**
     * Collects all pending save actions (inserts, updates, deletes)
     *
     * @param includeGeometry - Whether to include geometry data in the actions
     * @returns Object containing arrays of features to insert, update, and delete
     */
    getSaveActions(includeGeometry = true) {
        const formatWKT = this.localProperties.formatWKT;
        return {
            insert: this.insertedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, includeGeometry)),
            update: this.updatedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, includeGeometry)),
            delete: this.deletedFeatures.getArray().map(f => this.serializeFeature(f, formatWKT, false))
        };
    }
    /**
     * Serializes a feature to a plain object for storage
     *
     * @param feature - The feature to serialize
     * @param formatWKT - WKT formatter for geometry
     * @param includeGeometry - Whether to include geometry
     * @returns Serialized feature object
     * @private
     */
    serializeFeature(feature, formatWKT, includeGeometry) {
        const properties = feature.getProperties();
        const serialized = {
            id: feature.getId(),
            properties: {}
        };
        // Copy all non-geometry properties
        const geometryName = this.table?.geometryName || 'geometry';
        for (const key in properties) {
            if (key !== geometryName && key !== 'geometry') {
                serialized.properties[key] = properties[key];
            }
        }
        // Include geometry if requested
        if (includeGeometry) {
            const geometry = feature.getGeometry();
            if (geometry && formatWKT) {
                serialized.geometry = formatWKT.writeGeometry(geometry);
            }
        }
        return serialized;
    }
    /**
     * Loads cached local changes from previous sessions
     *
     * Reads the edition cache file (stored in editionCacheFile property) and
     * restores any pending local edits that haven't been synchronized yet.
     * This allows offline work to persist across app restarts.
     */
    loadChanges() {
        const editionCacheFile = this.localProperties.editionCacheFile;
        if (!editionCacheFile)
            return;
        // Load from cache storage if available
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
            // Fallback to localStorage if no cache storage provided
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
    /**
     * Restores cached actions (inserts, updates, deletes) to their respective collections
     *
     * @param actions - Object containing insert, update, and delete arrays
     * @private
     */
    _restoreActions(actions) {
        const formatWKT = this.localProperties.formatWKT;
        // Restore inserted features
        if (actions.insert && Array.isArray(actions.insert)) {
            actions.insert.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = 'INSERT';
                    this.insertedFeatures.push(feature);
                }
            });
        }
        // Restore updated features
        if (actions.update && Array.isArray(actions.update)) {
            actions.update.forEach((serialized) => {
                const feature = this.deserializeFeature(serialized, formatWKT);
                if (feature) {
                    feature.state = 'UPDATE';
                    this.updatedFeatures.push(feature);
                }
            });
        }
        // Restore deleted features
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
    /**
     * Deserializes a feature from a plain object
     *
     * @param serialized - The serialized feature object
     * @param formatWKT - WKT formatter for geometry
     * @returns Deserialized Feature or null if invalid
     * @private
     */
    deserializeFeature(serialized, formatWKT) {
        try {
            const feature = new Feature();
            if (serialized.id) {
                feature.setId(serialized.id);
            }
            // Restore properties
            if (serialized.properties) {
                feature.setProperties(serialized.properties);
            }
            // Restore geometry
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
    /**
     * Handles feature update events
     *
     * Called when a feature's properties are changed. Tracks the feature
     * for differential synchronization.
     *
     * @param feature - The feature being updated
     * @private
     */
    onUpdateFeature(feature) {
        // Don't track changes while loading from server/cache
        if (this._isLoading)
            return;
        const featureState = feature.state;
        // If feature is newly inserted, don't add to updates (already in inserts)
        if (featureState === 'INSERT')
            return;
        // If not already tracked as updated, add it
        if (featureState !== 'UPDATE') {
            feature.state = 'UPDATE';
            this.updatedFeatures.push(feature);
        }
        // Persist changes to cache
        this.writeChanges();
    }
    /**
     * Saves edition cache to storage using ICacheStorage metadata operations
     *
     * @param cacheKey - The cache key (editionCacheFile)
     * @param actions - The pending actions to save
     * @private
     */
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
                actions: actions
            }
        };
        await this._cache.saveMetadata(metadata.id, metadata);
    }
    /**
     * Loads edition cache from storage using ICacheStorage metadata operations
     *
     * @param cacheKey - The cache key (editionCacheFile)
     * @returns The cached actions or null if not found
     * @private
     */
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
    /**
     * Sets the loading state
     *
     * @param isLoading - Whether the source is currently loading features
     */
    setLoading(isLoading) {
        this._isLoading = isLoading;
    }
    /**
     * Custom loader function for fetching features
     *
     * Invoked by OpenLayers when features need to be loaded.
     *
     * @todo Implement feature loading from collaborative API or cache
     */
    loaderFn() {
        console.log('loaderFn');
        // TODO: Implement loader that:
        // 1. Fetches features from collaborative API or cache
        // 2. Sets _isLoading to true during load
        // 3. Adds features to source
        // 4. Sets _isLoading to false when complete
    }
}
//# sourceMappingURL=CollabVectorSource.js.map