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
import { createXYZ, TileGrid } from 'ol/tilegrid';
import { Collection, Feature } from 'ol';
import WKT from 'ol/format/WKT';

import proj4 from 'proj4';

import { CollabVectorSourceOptions } from './types';
import { Table } from '../collaborative/types';
import { SOURCE_ERROR_CODES } from './ErrorCodes';

import PathUtils from '../utils/PathUtils';
const pathUtils = new PathUtils();

// Initialize ProjectionUtils instance
import EventManager from '../utils/EventManager';

export default class CollabVectorSource extends VectorSource {

  private _projectionUtils: ProjectionUtils;
  private _options: CollabVectorSourceOptions;
  private _eventManager: EventManager;

  public table: Table;
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

  /**
   * Creates a new CollabVectorSource
   * 
   * @param options - Configuration options for the collaborative vector source
   * @throws {Error} If client or table are not defined in options
   */
  constructor(options: CollabVectorSourceOptions) {
    // Step 1: Initialize utilities before calling super()
    // These are needed to compute VectorSource options
    const projectionUtils = new ProjectionUtils();
    projectionUtils.initProjections();

    // Step 2: Compute VectorSource configuration
    // This validates required options and determines loading strategy (tile vs bbox)
    const superOptions = CollabVectorSource._computeVectorSourceOptions(options);

    // Step 3: Initialize parent VectorSource with computed options
    super(superOptions);

    // Step 4: Store instance properties
    this._projectionUtils = projectionUtils;
    this._options = options || {};
    this._eventManager = new EventManager();
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
  private static _computeVectorSourceOptions(options: CollabVectorSourceOptions): any {
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
      const tileGrid: TileGrid = createXYZ({
        tileSize: opts.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE,
        minZoom: opts.tileZoom,
        maxZoom: opts.tileZoom,
      });
      strategy = tile(tileGrid);
    }

    // Extended properties beyond standard VectorSource options
    const properties: Record<string, any> = {
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
  private _initCollabVectorSource(): void {
    const table = this._options.table || {};
    this.table = table;

    // Derive document endpoint from WFS URL (e.g., for attachments)
    table.docURI = table.wfs.replace(/\/gcms\/.*/, "/document/");

    // Apply defaults for max features and tile size
    this._options.maxFeatures = this._options.maxFeatures || COLLAB_VECTOR_DEFAULT_VALUES.MAX_FEATURES;
    this._options.tileSize = this._options.tileSize || COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE

    // Validate that the spatial reference system is known to proj4
    const srsName: string | undefined = table.columns[table.geometryName]?.crs ?? COLLAB_VECTOR_DEFAULT_VALUES.SRS_NAME;

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
    this.localProperties.preservedFeatures = this._options.preserved ?? new Collection<Feature>();

    // Wire up event handlers for feature lifecycle tracking
    this._eventManager.on('addfeature', this.onAddFeature.bind(this));
    this._eventManager.on('removefeature', this.onDeleteFeature.bind(this));
    // Note: Feature property changes are handled via 'propertychange' event on the
    // feature itself to avoid style changes triggering update tracking

    // Load any cached local edits from disk
    this.loadChanges()

    // TODO: Determine if custom loader is needed when no cache URL is provided
    if (!this.localProperties.cacheUrl) {
      // this.setLoader(this.loaderFn_);
    }

  }

  public getTable(): Table {
    return this.table;
  }

  /**
   * Handles feature addition events
   * 
   * Called when a new feature is added to the source.
   * 
   * @param feature - The feature being added
   * @todo Implement differential tracking logic
   * @todo Consider making this method private if not used externally
   */
  public onAddFeature(feature: Feature): void {
    console.log('onAddFeature_', feature);
    /**
     * Old code:
     * 
     * var f = e.feature;
  var self = this;
  f.getGeometry().on('change', (e) => {
    f.getUpdates().geometry = true;
    f.dispatchEvent({type: "propertychange", target: f});
  });
  f.on("propertychange", this.onUpdateFeature_.bind(this));
  if (this.isloading_) return;
  f.setState(ol_Feature.State.INSERT);
  // Add attributes according to table
  var atts = this.getTable().columns;
  var gname= this.getTable().geometry_name;
  for (var i in atts) if (i!=gname) {
    if (!f.get(i)) f.set(i,null);
  }
  this.insert_.push(e.feature);

  // Save change 
  this.writeChanges();
     */
  }

  /**
   * Handles feature deletion events
   * 
   * Called when a feature is removed from the source.
   * 
   * @param feature - The feature being deleted
   * @todo Implement differential tracking logic
   * @todo Consider making this method private if not used externally
   */
  public onDeleteFeature(feature: Feature): void {
    console.log('onDeleteFeature_', feature);

    /**
     * Old code:
     * 
     * if (this.isloading_) return;
  
  function removeFeature(features, f) {
    for (var i=0, l=features.length; i<l; i++) {
      if (features[i] === f) {
        features = features.splice(i, 1);
        return;
      }
    }
  }

  switch (e.feature.getState()) {
    case ol_Feature.State.INSERT:
      removeFeature (this.insert_, e.feature);
      break;
    case ol_Feature.State.UPDATE:
      removeFeature (this.update_, e.feature);
      // falls through
    default:
      this.delete_.push(e.feature);
      break;
  }
  e.feature.setState(ol_Feature.State.DELETE);

  // Save change 
  this.writeChanges();
     */
  }

  public writeChanges(): void {
    console.log('writeChanges');
    /**
     * Old code:
     * 
     *  // Write in cache
  if (!this._writeUpdate) this._writeUpdate = 0;
  // Prevent many update at once
  if (!force) {
    this._writeUpdate++;
    setTimeout(() => { this.writeChanges(true); });
    return;
  } else {
    this._writeUpdate--;
    if (this._writeUpdate > 0) return;
  }
  this._writeUpdate = 0;

  var actions = this.getSaveActions(true);

  if (!this.editionCacheFile) return;
  var self = this;
  CordovFile.getDirectory(
    editionCacheDir, 
    function() {
        CordovApp.File.write(
          self.editionCacheFile, 
          JSON.stringify(actions),
          () => {},
          () => { console.log('ERROR: writeChanges on layer...'); }
    )},
    () => { console.log('ERROR: writeChanges on layer...'); },
    true
  );
     */
  }

  /**
   * Loads cached local changes from previous sessions
   * 
   * Reads the edition cache file (stored in editionCacheFile property) and
   * restores any pending local edits that haven't been synchronized yet.
   * This allows offline work to persist across app restarts.
   * 
   * @todo Implement file reading and change restoration logic
   * @todo Consider making this method private if not used externally
   */
  public loadChanges(): void {
    console.log('loadChanges');
  }

  /**
   * Custom loader function for fetching features
   * 
   * @todo Implement feature loading from collaborative API or cache
   * @todo Consider making this method private if not used externally
   */
  public loaderFn(): void {
    console.log('loaderFn');
  }


}