/**
 * OpenLayers source for WFS (Web Feature Service) layers
 * @migrated from: ol/source/WFS.js of the CordovApp module
 */

import { Collection } from "ol";
import VectorSource from "ol/source/Vector";
import { bbox, tile } from "ol/loadingstrategy";
import { TileGrid, createXYZ } from "ol/tilegrid";

import PathUtils from "../utils/PathUtils";
const pathUtils = new PathUtils();

import { WFSSourceOptions } from "./types";
import { WFS_DEFAULT_VALUES } from "./DefaultSourceValues";
import { SOURCE_ERROR_CODES } from "./ErrorCodes";
import { Projection, transformExtent } from "ol/proj";


export default class WFSSource extends VectorSource {
  public localProperties: Record<string, any> = {};
  public requestProperties: Record<string, any> = {};

  constructor(options: WFSSourceOptions) {
    const superOptions = WFSSource._computeWFSSourceOptions(options, {});
    super(superOptions);

    this.localProperties = superOptions.computedLocalProperties;

    this._initWFSSource(options);
  }

  /**
   * TODO: add and implement the cache attribute *IF NEEDED* (see ol/source/WFS.js)
   * @param options 
   * @param cache 
   * @returns 
   */
  private static _computeWFSSourceOptions(options: WFSSourceOptions, cache: any): any {
    options = options || {};
    const computedLocalProperties: any = {};

    let strategy = options.strategy;
    let tiled = false;

    if (!strategy && options.tileZoom) {
      const tileZoom = options.tileZoom || (options.minZoom ?? + WFS_DEFAULT_VALUES.MIN_ZOOM_INCREASE);
      tiled = true;
      const tileGrid: TileGrid = createXYZ({
        tileSize: options.tileSize || WFS_DEFAULT_VALUES.TILE_SIZE,
        minZoom: tileZoom,
        maxZoom: tileZoom,
      });
      strategy = tile(tileGrid);

      computedLocalProperties.tileGrid = tileGrid;
    }
    else {
      strategy = bbox;
    }

    if (computedLocalProperties.tileGrid) computedLocalProperties.maxReload = options.maxReload

    if (cache && cache.loadCache) {
      computedLocalProperties.loadCache = cache.loadCache;
    }
    if (cache && cache.saveCache) {
      computedLocalProperties.saveCache = cache.saveCache;
    }

    return {
      // loader: this.loaderFn_, // ???
      computedLocalProperties,
      strategy,
      features: new Collection(),
      attributions: options.attribution,
      useSpatialIndex: true, // force to true for loading strategy tile
      wrapX: options.wrapX
    };
  }

  /**
   * Completes WFS-specific initialization after VectorSource setup
   * 
   * This method handles:
   * - Proxy configuration
   * - Authentication
   * - Feature filtering
   * - Request properties
   * 
   * @param options 
   * @private
   */
  private _initWFSSource(options: WFSSourceOptions) {
    options = options || {};

    // Proxy to load features
    this.localProperties.proxy = options.proxy;

    // Authentification
    this.localProperties.username = options.username;
    this.localProperties.password = options.password;

    this.localProperties.featureFilter = options.filter;

    // Request properties
    this.requestProperties.url = options.geoservice.url;
    const cacheDir = pathUtils.getEscapedDomainFromURL(options.geoservice.url);
    this.requestProperties.cacheDir = cacheDir + '/' + options.geoservice.layers;
    this.requestProperties.once = options.once;
    this.requestProperties.typename = options.geoservice.layers;
    this.requestProperties.version = options.geoservice.version;
    this.requestProperties.projection = options.srs || WFS_DEFAULT_VALUES.SRS_NAME;
    this.requestProperties.id = options.geoservice.inputMask?.id ?? -1;
    this.requestProperties.maxFeatures = options.maxFeatures;
    this.requestProperties.format = options.geoservice.format;

    this.setAuthentication(options.username ?? '', options.password ?? '');

  }

  public setAuthentication(username: string, password: string) {
    if (!username || !password || username === '' || password === '') {
      throw new Error(SOURCE_ERROR_CODES.WFS_NO_USERNAME_OR_PASSWORD);
    }
    this.requestProperties.username = username;
    this.requestProperties.password = password;
  }

  public getCachePath(): string {
    return "";
  }

  /**
   * Load features from cache
   * 
   * This method handles:
   * - Loading cache locally
   * - Loading cache from server if local cache fetch failed
   * - Loading cache with obsolete flag if local cache fetch failed and the error is 'obsolete'
   * - Handling error if local cache fetch failed and the error is not 'obsolete'
   * 
   * @param extent0: extent in projection
   * @param resolution: resolution
   * @param projection: projection
   */
  public async loadFromCache(extent0: number[], resolution: number, projection: Projection): Promise<void> {
    if (this.localProperties.loadCache) { // condition necessary?

      const extent = transformExtent(extent0, projection, this.requestProperties.projection);

      // define cache load parameters
      const cacheParameters = {
        tileCord: this.localProperties.tileGrid ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(extent0, resolution) : null,
        extent: extent,
        resolution: resolution,
      };
      // First request: load cache locally
      this.localProperties.loadCache(cacheParameters).then((response: any) => {
        this._readWFSResponse(response, projection);
      })
        // If local cache fetch failed, try to load cache from server
        .catch((cacheError: any) => {
          console.error('ERROR: loadFromCache on layer', cacheError);

          // define request parameters
          const parameters = {
            service: 'WFS',
            request: 'GetFeature',
            outputFormat: this.requestProperties.format,
            typeName: this.requestProperties.typename,
            bbox: this.requestProperties.once ? undefined : extent.join(','),
            maxFeatures: this.requestProperties.maxFeatures,
            filter: this.requestProperties.featureFilter,
            srsname: WFS_DEFAULT_VALUES.SRS_NAME,
            version: this.requestProperties.version,
          };

          const tcoord = this.localProperties.tileGrid ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(extent0, resolution) : null;

          // fetch features from WFS //
          const abortController = new AbortController();
          const timeoutId = setTimeout(() => abortController.abort(), 3 * 60 * 1000);

          const headers: Record<string, string> = {
            "cache-control": "no-cache",
            "Content-Type": "text/xml" // not sure about that
          };

          // Authentication
          if (this.requestProperties.username && this.requestProperties.password) {
            headers["Authorization"] = `Basic ${btoa(this.requestProperties.username + ':' + this.requestProperties.password)}`;
          }

          fetch(this.requestProperties.url.replace(/\?$/, ''), {
            method: 'GET',
            headers: headers,
            cache: 'no-cache',
            body: JSON.stringify(parameters),
            signal: abortController.signal
          }).then((response: Response) => {
            clearTimeout(timeoutId);
            response.json().then(async (data: any) => {
              // if fetched from server, save to cache
              await this.saveToCache(data, extent, resolution, tcoord);
            });
          })
            // server cache fetch failed
            .catch((error: any) => {
              clearTimeout(timeoutId);
              console.error('ERROR: loadFromCache on layer', error);

              // if failed and the error is 'obsolete', try to get cache with obsolete flag
              if (cacheError === 'obsolete') {
                const obseleteCacheParameters = {
                  obsolote: true,
                  tileCord: tcoord,
                  extent: extent,
                  resolution: resolution,
                }
                this.localProperties.loadCache(obseleteCacheParameters).then((response: any) => {
                  this._readWFSResponse(response, projection);
                }).catch(() => {
                  console.error('ERROR: loadFromCache on layer', cacheError);
                  this._handleWFSLoadError(error);
                });
              }
              // else, the fetch failed but the error is not 'obsolete'
              else {
                console.error('ERROR: loadFromCache on layer', error);
                this._handleWFSLoadError(error);
              }

            });
        });
    }
  }

  private _readWFSResponse(response: any, projection: Projection) {
    // to implement
  }

  private _handleWFSLoadError(error: any) {

  }

  public async saveToCache(response: any, extent: number[], resolution: number, tcoord: number[]): Promise<void> {
    // to implement
  }
}