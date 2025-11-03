/**
 * Manages raster tile caching (Geoportail layers)
 * @migrated from: ol/cache/CacheMap.js
 */

import EventManager from "../utils/EventManager";
import { ICacheStorage } from "../abstracts/ICacheStorage";
import LayerGroup from "ol/layer/Group";
import { CacheMetadata, CacheProgress, RasterCacheConfig, RasterCacheOptions } from "./types";
import ExtentManager from "./ExtentManager";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export default class RasterCacheManager {
  private _eventManager: EventManager;
  private readonly CACHE_PREFIX = 'raster:cache:';
  private readonly ORDER_KEY = 'raster:cache:order';
  // Default Geoportail layer name for raster maps
  private readonly LAYER_NAME = 'GEOGRAPHICALGRIDSYSTEMS.MAPS'; // Reserved for future use

  private extentManager: ExtentManager;
  private silentErrors: boolean;
  private currentCacheId?: string;
  private currentErrors: Set<string>;
  private extentLayer: VectorLayer<VectorSource>;

  constructor(
    private storage: ICacheStorage,
    private layerGroup: LayerGroup,
    private options: RasterCacheOptions = {}
  ) {
    this._eventManager = new EventManager();
    this.extentManager = new ExtentManager(storage);
    this.silentErrors = options.silentErrors ?? false;
    this.currentErrors = new Set();

    // Create vector layer for extent visualization
    this.extentLayer = new VectorLayer({
      source: new VectorSource(),
      properties: {
        name: 'Emprises',
        displayInLayerSwitcher: false
      }
    });
    this.layerGroup.getLayers().push(this.extentLayer);

    // Sort cache layers when layer order changes
    this.layerGroup.getLayers().on('remove', () => {
      // Use setTimeout to ensure layer removal is complete
      setTimeout(() => {
        this.reorderCacheLayers().catch(err => {
          if (!this.silentErrors) {
            this._eventManager.emit('cache:error', {
              type: 'reorder',
              message: 'Failed to reorder cache layers',
              error: err
            });
          }
        });
      }, 0);
    });
  }

  /**
   * Non implémenté:


  (function(){
    var pattern;
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var image = new Image();
    image.onload = function() {
      pattern = ctx.createPattern(image,"repeat");
    };
    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAGFBMVEUAAACPjwCmpgCbmwCCggD+/gCXlwD//wDWAMTYAAAAB3RSTlOAsr64rP62hR4cWgAAADpJREFUCNetzTEOACAIA8ACYv//YwVJxF0mLm0AJAUxtjeCPq6IkvKwNYM9c/ko1AdLTLxNtEyZbFcWKysC1htDphIAAAAASUVORK5CYII='

    vector.on('postcompose', function (e) {
      e.context.save();
        e.context.fillStyle = pattern;
        e.context.globalAlpha = .3 * layerGroup.getOpacity();
        e.context.scale(e.frameState.pixelRatio,e.frameState.pixelRatio);
        e.context.beginPath();
        layerGroup.getLayers().forEach(function(l) {
          if (l.getVisible()) {
            var cache = getCacheMapById(l.get('name').replace('cache_',''));
            if (cache && cache.minZoom-2 > map.getView().getZoom()) {
              for (var k=0, extent; extent=cache.extents[k]; k++) {
                var p0 = map.getPixelFromCoordinate([extent[0], extent[1]]);
                var p1 = map.getPixelFromCoordinate([extent[2], extent[3]]);
                e.context.rect(p0[0],p0[1],p1[0]-p0[0],p1[1]-p0[1]);
              }
            }
          }
        });
        e.context.fill();
      e.context.restore();
    });
  })();
   */

  /**
   * Gets the cache storage path (used for organizing cache data)
   * @returns Path string for cache directory
   * @todo Will be used when tile caching is fully implemented
   */
  public getCachePath(): string {
    const root = this.options.cacheRoot || '';
    const dirName = this.options.dirName || 'geoportail';
    return `${root}${dirName}/`;
  }
  
  /**
   * Get the default layer name for Geoportail
   * @returns The default Geoportail layer name
   */
  public getDefaultLayerName(): string {
    return this.LAYER_NAME;
  }

  /**
   * Reorders cache layers in the layer group based on stored order
   * Maintains visual consistency when layers are manipulated
   */
  private async reorderCacheLayers(): Promise<void> {
    const layers = this.layerGroup.getLayers().getArray();
    const metadata = await this.storage.getMetadata(this.ORDER_KEY);

    if (!metadata || !metadata.extra?.order) {
      return;
    }

    const order = metadata.extra.order as string[];

    // Sort layers based on stored order (lower index = rendered first/bottom)
    const sortedLayers = [...layers].sort((a, b) => {
      const nameA = a.get('name') as string;
      const nameB = b.get('name') as string;

      const indexA = order.findIndex(id => nameA === `cache_${id}`);
      const indexB = order.findIndex(id => nameB === `cache_${id}`);

      return indexA - indexB;
    });

    // Update layer order if changed
    if (JSON.stringify(layers) !== JSON.stringify(sortedLayers)) {
      this.layerGroup.getLayers().clear();
      sortedLayers.forEach(layer => this.layerGroup.getLayers().push(layer));
    }
  }

  /**
   * Saves the current cache layer order to storage
   */
  private async saveCacheOrder(): Promise<void> {
    const cacheMetadataList = await this.storage.listMetadata(this.CACHE_PREFIX);
    const order = cacheMetadataList.map((meta: CacheMetadata) => meta.id.replace(this.CACHE_PREFIX, ''));

    await this.storage.saveMetadata(this.ORDER_KEY, {
      id: this.ORDER_KEY,
      name: 'Cache Order',
      type: 'raster',
      created: new Date(),
      modified: new Date(),
      size: 0,
      extra: { order }
    });
  }

  /**
   * Not implemented
   * Because does jQuery manipulation
   * Might just have a 'getInfo' method that returns the info as a string
   * (see CacheMap.js line 140)
   */
  public showInfo() {
    // not implemented
    /**
    CordovaApp code:
    
    var extent = map.getView().calculateExtent(map.getSize());
    var layerName = currentMap.layer||"GEOGRAPHICALGRIDSYSTEMS.MAPS";
    var layercache = new ol_layer_Geoportail(layerName, { hidpi: false, key: apiKey }, { gppKey: apiKey, authentication: authentication });
    var cache = new ol_cache_Tile (layercache, { authentication: authentication });

    cache.estimateSize (function(s){
      if (s.length<0) {
        loadPage.addClass('noTile');
      } else {
        loadPage.removeClass('noTile');
        $(".tileCount .size", loadPage).text(s.size);
        $(".tileCount .length", loadPage).text(s.length);
        // Hours
        if (s.time>60000*60) {
          var mn = Math.round(s.time/60000);
          var h = Math.floor(mn/60);
          mn -= h*60;
          $(".tileCount .time", loadPage).text(h+" h "+mn);
        }
        // minutes
        else {
          $(".tileCount .time", loadPage).text(Math.round(s.time/60000) || '< 1');
        }
      }
    }, currentMap.minZoom, currentMap.maxZoom, extent);
     */
  }

  /**
   * Gets the ExtentManager instance for managing cache extents
   * @returns ExtentManager instance
   */
  public getExtentManager(): ExtentManager {
    return this.extentManager;
  }

  /**
   * Gets the EventManager instance for listening to cache events
   * @returns EventManager instance
   */
  public getEventManager(): EventManager {
    return this._eventManager;
  }

  /**
   * Gets the vector layer used for extent visualization
   * @returns VectorLayer instance
   */
  public getExtentLayer(): VectorLayer<VectorSource> {
    return this.extentLayer;
  }

  /**
   * Creates a new raster cache with the given configuration
   * @param config - Cache configuration
   * @returns Cache ID
   */
  async createCache(config: RasterCacheConfig): Promise<string> {
    const metadata = {

    } as CacheMetadata;

    await this.storage.saveMetadata(metadata.id, metadata);
    await this.saveCacheOrder();

    // this._eventManager.emit('cache:created', { id: config.id, config });

    return config.id;
  }

  /**
   * Deletes a cache and all its associated data
   * @param id - Cache ID to delete
   */
  async deleteCache(id: string): Promise<void> {
    const cacheKey = this.CACHE_PREFIX + id;
    const metadata = await this.storage.getMetadata(cacheKey);

    if (!metadata) {
      throw new Error(`Cache ${id} not found`);
    }

    // Delete all tiles associated with this cache
    const tileKeys = await this.storage.listTiles(cacheKey);
    await Promise.all(tileKeys.map(key => this.storage.deleteTile(key)));

    // Delete metadata
    await this.storage.deleteMetadata(cacheKey);

    // Remove from layer group if loaded
    await this.removeCacheLayer(id);

    // Update order
    await this.saveCacheOrder();

    // this._eventManager.emit('cache:deleted', { id });
  }

  /**
   * Loads a cache as a layer in the layer group
   * @param id - Cache ID to load
   */
  async loadCache(id: string): Promise<void> {
    const cacheKey = this.CACHE_PREFIX + id;
    const metadata = await this.storage.getMetadata(cacheKey);

    if (!metadata) {
      throw new Error(`Cache ${id} not found`);
    }

    await this.addCacheLayer(id, this.layerGroup);

    // this._eventManager.emit('cache:loaded', { id, metadata });
  }

  /**
   * Starts downloading tiles for a cache
   * @param id - Cache ID to start downloading
   * @returns Promise that resolves when download starts (currently not implemented)
   * 
   * @todo Implement actual download logic with TileCache integration
   */
  async startDownload(id: string): Promise<void> {
    this.currentCacheId = id;
    this.currentErrors.clear();

    console.warn(`startDownload(${id}): Not yet implemented - requires TileCache integration`);
    this._eventManager.emit('cache:download:start', { id, status: 'not_implemented' });

    // When implemented, this should:
    // 1. Get cache metadata and configuration
    // 2. Initialize TileCache for the layer
    // 3. Calculate tile grid for extent and zoom range
    // 4. Download tiles progressively
    // 5. Emit progress events
    // 6. Handle errors and cancellation
  }

  /**
   * Pauses an ongoing cache download
   * @param id - Cache ID to pause
   * @returns Promise that resolves when download is paused (currently not implemented)
   * 
   * @todo Implement pause logic with TileCache integration
   */
  async pauseDownload(id: string): Promise<void> {
    if (this.currentCacheId !== id) {
      console.warn(`pauseDownload(${id}): No active download for this cache`);
      return;
    }

    console.warn(`pauseDownload(${id}): Not yet implemented - requires TileCache integration`);
    this._eventManager.emit('cache:download:pause', { id, status: 'not_implemented' });
  }

  /**
   * Cancels an ongoing cache download
   * @param id - Cache ID to cancel
   * @returns Promise that resolves when download is cancelled (currently not implemented)
   * 
   * @todo Implement cancel logic with TileCache integration
   */
  async cancelDownload(id: string): Promise<void> {
    if (this.currentCacheId !== id) {
      console.warn(`cancelDownload(${id}): No active download for this cache`);
      return;
    }

    this.currentCacheId = undefined;
    this.currentErrors.clear();

    console.warn(`cancelDownload(${id}): Not yet implemented - requires TileCache integration`);
    this._eventManager.emit('cache:download:cancel', { id, status: 'not_implemented' });
  }

  /**
   * Gets the download progress for a cache
   * @param id - Cache ID
   * @returns Progress information
   */
  async getDownloadProgress(id: string): Promise<CacheProgress> {
    const cacheKey = this.CACHE_PREFIX + id;
    const metadata = await this.storage.getMetadata(cacheKey);

    if (!metadata) {
      throw new Error(`Cache ${id} not found`);
    }

    // TODO: Calculate actual progress from stored tiles
    return {
      id,
      type: 'raster',
      total: metadata.extra?.totalTiles || 0,
      current: metadata.tileCount || 0,
      percent: metadata.extra?.totalTiles
        ? ((metadata.tileCount || 0) / metadata.extra.totalTiles) * 100
        : 0,
      status: metadata.extra?.downloadStatus || 'complete',
      bytesDownloaded: metadata.size,
      bytesTotal: metadata.extra?.estimatedSize || 0
    };
  }

  /**
   * Adds a cache as a layer to the layer group
   * @param id - Cache ID
   * @param layerGroup - Target layer group
   * @returns Promise that resolves when layer is added (currently not implemented)
   * 
   * @todo Create and configure TileLayer from cached tiles with TileCache integration
   */
  async addCacheLayer(id: string, _layerGroup: LayerGroup): Promise<void> {
    console.warn(`addCacheLayer(${id}): Not yet implemented - requires TileCache integration`);
    this._eventManager.emit('cache:layer:add', { id, status: 'not_implemented' });

    // When implemented, this should:
    // 1. Load cache metadata
    // 2. Create a custom TileSource that reads from ICacheStorage
    // 3. Create a TileLayer with the custom source
    // 4. Configure layer extent and zoom levels
    // 5. Add layer to the provided layerGroup
  }

  /**
   * Removes a cache layer from the layer group
   * @param id - Cache ID
   */
  async removeCacheLayer(id: string): Promise<void> {
    const layers = this.layerGroup.getLayers().getArray();
    const cacheLayer = layers.find(layer => layer.get('name') === `cache_${id}`);

    if (cacheLayer) {
      this.layerGroup.getLayers().remove(cacheLayer);
      // this._eventManager.emit('cache:layer:remove', { id });
    }
  }
}