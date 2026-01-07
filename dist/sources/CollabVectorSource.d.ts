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
import VectorSource from 'ol/source/Vector';
import { Collection, Feature } from 'ol';
import { CollabVectorSourceOptions } from './types';
import { Table } from '../collaborative/types';
export default class CollabVectorSource extends VectorSource {
    private _options;
    private _eventManager;
    private _isLoading;
    private _writeUpdateCounter;
    private _cache?;
    table: Table;
    localProperties: Record<string, any>;
    /** Features that should persist across source reloads (e.g., currently edited features) */
    preservedFeatures: Collection<Feature>;
    /** Features tracked for differential synchronization */
    differentialFeatures: Collection<Feature>;
    /** Features that have been inserted locally and need to be synced */
    insertedFeatures: Collection<Feature>;
    /** Features that have been deleted locally and need to be synced */
    deletedFeatures: Collection<Feature>;
    /** Features that have been updated locally and need to be synced */
    updatedFeatures: Collection<Feature>;
    /**
     * Creates a new CollabVectorSource
     *
     * @param options - Configuration options for the collaborative vector source
     * @throws {Error} If client or table are not defined in options
     */
    constructor(options: CollabVectorSourceOptions);
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
    private static _computeVectorSourceOptions;
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
    private _initCollabVectorSource;
    getTable(): Table;
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
    onAddFeature(feature: Feature): void;
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
    onDeleteFeature(feature: Feature): void;
    /**
     * Helper method to remove a feature from a collection
     *
     * @param collection - The collection to remove from
     * @param feature - The feature to remove
     * @private
     */
    private removeFeatureFromCollection;
    /**
     * Writes local changes to cache file
     *
     * This method debounces multiple rapid changes to prevent excessive file writes.
     * It collects all pending changes (inserts, updates, deletes) and persists them
     * to the edition cache file.
     *
     * @param force - If true, writes immediately; if false, debounces the write
     */
    writeChanges(force?: boolean): void;
    /**
     * Collects all pending save actions (inserts, updates, deletes)
     *
     * @param includeGeometry - Whether to include geometry data in the actions
     * @returns Object containing arrays of features to insert, update, and delete
     */
    getSaveActions(includeGeometry?: boolean): any;
    /**
     * Serializes a feature to a plain object for storage
     *
     * @param feature - The feature to serialize
     * @param formatWKT - WKT formatter for geometry
     * @param includeGeometry - Whether to include geometry
     * @returns Serialized feature object
     * @private
     */
    private serializeFeature;
    /**
     * Loads cached local changes from previous sessions
     *
     * Reads the edition cache file (stored in editionCacheFile property) and
     * restores any pending local edits that haven't been synchronized yet.
     * This allows offline work to persist across app restarts.
     */
    loadChanges(): void;
    /**
     * Restores cached actions (inserts, updates, deletes) to their respective collections
     *
     * @param actions - Object containing insert, update, and delete arrays
     * @private
     */
    private _restoreActions;
    /**
     * Deserializes a feature from a plain object
     *
     * @param serialized - The serialized feature object
     * @param formatWKT - WKT formatter for geometry
     * @returns Deserialized Feature or null if invalid
     * @private
     */
    private deserializeFeature;
    /**
     * Handles feature update events
     *
     * Called when a feature's properties are changed. Tracks the feature
     * for differential synchronization.
     *
     * @param feature - The feature being updated
     * @private
     */
    private onUpdateFeature;
    /**
     * Saves edition cache to storage using ICacheStorage metadata operations
     *
     * @param cacheKey - The cache key (editionCacheFile)
     * @param actions - The pending actions to save
     * @private
     */
    private _saveEditionCache;
    /**
     * Loads edition cache from storage using ICacheStorage metadata operations
     *
     * @param cacheKey - The cache key (editionCacheFile)
     * @returns The cached actions or null if not found
     * @private
     */
    private _loadEditionCache;
    /**
     * Sets the loading state
     *
     * @param isLoading - Whether the source is currently loading features
     */
    setLoading(isLoading: boolean): void;
    /**
     * Custom loader function for fetching features
     *
     * Invoked by OpenLayers when features need to be loaded.
     *
     * @todo Implement feature loading from collaborative API or cache
     */
    loaderFn(): void;
}
//# sourceMappingURL=CollabVectorSource.d.ts.map