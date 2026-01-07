/**
 * Manages raster tile caching (Geoportail layers)
 * @migrated from: ol/cache/CacheMap.js
 */
import EventManager from "../utils/EventManager";
import { ICacheStorage } from "../abstracts/ICacheStorage";
import LayerGroup from "ol/layer/Group";
import { CacheProgress, RasterCacheConfig, RasterCacheOptions } from "./types";
import ExtentManager from "./ExtentManager";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default class RasterCacheManager {
    private storage;
    private layerGroup;
    private options;
    private _eventManager;
    private readonly CACHE_PREFIX;
    private readonly ORDER_KEY;
    private readonly LAYER_NAME;
    private extentManager;
    private silentErrors;
    private currentCacheId?;
    private currentErrors;
    private extentLayer;
    constructor(storage: ICacheStorage, layerGroup: LayerGroup, options?: RasterCacheOptions);
    /**
     * Not implemented:
  
  
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
    getCachePath(): string;
    /**
     * Get the default layer name for Geoportail
     * @returns The default Geoportail layer name
     */
    getDefaultLayerName(): string;
    /**
     * Reorders cache layers in the layer group based on stored order
     * Maintains visual consistency when layers are manipulated
     */
    private reorderCacheLayers;
    /**
     * Saves the current cache layer order to storage
     */
    private saveCacheOrder;
    /**
     * Not implemented
     * Because does jQuery manipulation
     * Might just have a 'getInfo' method that returns the info as a string
     * (see CacheMap.js line 140)
     */
    showInfo(): void;
    /**
     * Gets the ExtentManager instance for managing cache extents
     * @returns ExtentManager instance
     */
    getExtentManager(): ExtentManager;
    /**
     * Gets the EventManager instance for listening to cache events
     * @returns EventManager instance
     */
    getEventManager(): EventManager;
    /**
     * Gets the vector layer used for extent visualization
     * @returns VectorLayer instance
     */
    getExtentLayer(): VectorLayer<VectorSource>;
    /**
     * Creates a new raster cache with the given configuration
     * @param config - Cache configuration
     * @returns Cache ID
     */
    createCache(config: RasterCacheConfig): Promise<string>;
    /**
     * Deletes a cache and all its associated data
     * @param id - Cache ID to delete
     */
    deleteCache(id: string): Promise<void>;
    /**
     * Loads a cache as a layer in the layer group
     * @param id - Cache ID to load
     */
    loadCache(id: string): Promise<void>;
    /**
     * Starts downloading tiles for a cache
     * @param id - Cache ID to start downloading
     * @returns Promise that resolves when download starts (currently not implemented)
     *
     * @todo Implement actual download logic with TileCache integration
     */
    startDownload(id: string): Promise<void>;
    /**
     * Pauses an ongoing cache download
     * @param id - Cache ID to pause
     * @returns Promise that resolves when download is paused (currently not implemented)
     *
     * @todo Implement pause logic with TileCache integration
     */
    pauseDownload(id: string): Promise<void>;
    /**
     * Cancels an ongoing cache download
     * @param id - Cache ID to cancel
     * @returns Promise that resolves when download is cancelled (currently not implemented)
     *
     * @todo Implement cancel logic with TileCache integration
     */
    cancelDownload(id: string): Promise<void>;
    /**
     * Gets the download progress for a cache
     * @param id - Cache ID
     * @returns Progress information
     */
    getDownloadProgress(id: string): Promise<CacheProgress>;
    /**
     * Adds a cache as a layer to the layer group
     * @param id - Cache ID
     * @param layerGroup - Target layer group
     * @returns Promise that resolves when layer is added (currently not implemented)
     *
     * @todo Create and configure TileLayer from cached tiles with TileCache integration
     */
    addCacheLayer(id: string, _layerGroup: LayerGroup): Promise<void>;
    /**
     * Removes a cache layer from the layer group
     * @param id - Cache ID
     */
    removeCacheLayer(id: string): Promise<void>;
}
//# sourceMappingURL=RasterCacheManager.d.ts.map