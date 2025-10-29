/**
 * OpenLayers source for WFS (Web Feature Service) layers
 * @migrated from: ol/source/WFS.js of the CordovApp module
 */

import { Collection, Feature } from "ol";
import VectorSource from "ol/source/Vector";
import { bbox, tile } from "ol/loadingstrategy";
import { TileGrid, createXYZ } from "ol/tilegrid";
import GeoJSON from "ol/format/GeoJSON";
import WFS from "ol/format/WFS";

import PathUtils from "../utils/PathUtils";
const pathUtils = new PathUtils();

import { WFSSourceOptions } from "./types";
import { WFS_DEFAULT_VALUES } from "./DefaultSourceValues";
import { SOURCE_ERROR_CODES } from "./ErrorCodes";
import { Projection, transformExtent } from "ol/proj";
import GML3 from "ol/format/GML3";
import GML2 from "ol/format/GML2";
import { Table } from "../collaborative/types";


export default class WFSSource extends VectorSource {
  public localProperties: Record<string, any> = {};
  public requestProperties: Record<string, any> = {};
  private _tileLoading: number = 0;

  constructor(options: WFSSourceOptions, cache?: any) {
    const superOptions = WFSSource._computeWFSSourceOptions(options, cache);
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
      computedLocalProperties.table = options.table as Table;
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
    this.set("url", options.geoservice.url);
    this.set("cache", pathUtils.getEscapedDomainFromURL(options.geoservice.url) + '/' + options.geoservice.layers);
    this.set("once", options.once);
    this.set("typename", options.geoservice.layers);
    this.set("version", options.geoservice.version);
    this.set("projection", options.srs || WFS_DEFAULT_VALUES.SRS_NAME);
    this.set("id", options.geoservice.input_mask?.id ?? -1);
    this.set("maxFeatures", options.maxFeatures);
    this.set("format", options.geoservice.format);
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

      const extent = transformExtent(extent0, projection, this.get("projection"));

      // define cache load parameters
      const cacheParameters = {
        tileCord: this.localProperties.tileGrid ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(extent0, resolution) : null,
        extent: extent,
        resolution: resolution,
      };

      this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading } as any);

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
            outputFormat: this.get("format"),
            typeName: this.get("typename"),
            bbox: this.get("once") ? undefined : extent.join(','),
            maxFeatures: this.get("maxFeatures"),
            filter: this.get("featureFilter"),
            srsname: WFS_DEFAULT_VALUES.SRS_NAME,
            version: this.get("version"),
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

          fetch(this.get("url").replace(/\?$/, ''), {
            method: 'GET',
            headers: headers,
            cache: 'no-cache',
            body: JSON.stringify(parameters),
            signal: abortController.signal
          }).then((response: Response) => {
            clearTimeout(timeoutId);
            response.json().then(async (data: any) => {
              // if fetched from server, save to cache
              // await this.saveToCache(data, extent, resolution, tcoord);
              await this.localProperties.saveCache(data, extent, resolution, tcoord);
            });
          })
            // server cache fetch failed
            .catch((error: any) => {
              clearTimeout(timeoutId);
              console.error('ERROR: loadFromCache on layer', error);

              // TODO: make sure this is the correct way to handle the status
              const status = error.name === 'AbortError' ? 'abort' : 'error';

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
                  this._handleWFSLoadError(status, error);
                });
              }
              // else, the fetch failed but the error is not 'obsolete'
              else {
                console.error('ERROR: loadFromCache on layer', error);
                this._handleWFSLoadError(status, error);
              }

            });
        });
    }
  }

  /**
   * Read WFS response and add features to the source
   * 
   * @param response: response from WFS
   * @param projection: projection
   */
  private _readWFSResponse(response: any, projection: Projection) {
    let data: Feature[] = [];
    if (this.get("format") === 'GeoJSON') {
      data = new GeoJSON().readFeatures(response);
    }
    else {
      const format = new WFS({ gmlFormat: new GML3() });
      data = format.readFeatures(response);

      // If no data found, try to load GML2 instead
      if (data.length && (!data[0]?.getGeometry() || !data[0]?.getGeometry()?.getExtent())) { // .getFirstCoordinate doesn't seem to exist anymore on Geometry
        const format = new WFS({ gmlFormat: new GML2() });
        data = format.readFeatures(response);
      }
    }

    const features: Feature[] = [];
    const hasFeatures = this.getFeatures().length > 0; // from VectorSource.getFeatures()

    for (const feature of data) {
      const geometry = feature.getGeometry();
      if (!geometry) continue;

      const extent = geometry.getExtent();
      // Skip invalid coordinates (longitude >= 360 or <= -360)
      if (extent[0] >= 360 || extent[0] <= -360 || extent[2] >= 360 || extent[2] <= -360) {
        continue;
      }

      // Transform from WFS_DEFAULT_VALUES.SRS_NAME to target projection
      geometry.transform(WFS_DEFAULT_VALUES.SRS_NAME, projection);

      // Add feature if: no existing features OR no 'id' property OR feature doesn't exist yet
      if (!hasFeatures || !this.get('id') || !this.hasFeature(feature)) {
        features.push(feature);
      }
    }

    this.addFeatures(features);

    // Dispatch loadend event with remaining tiles count
    this.dispatchEvent({ type: 'loadend', remains: --this._tileLoading } as any);

  }

  /**
   * Handle WFS load error
   * 
   * @param status: status of the load
   * @param error: error object
   */
  private _handleWFSLoadError(status: string, error: any) {
    if (status !== 'abort') {
      this.dispatchEvent({ type: "loadend", error: error, status: status, remains: --this._tileLoading } as any);
    } else {
      this.dispatchEvent({ type: "loadend", remains: --this._tileLoading } as any);
    }
  }

  /**
   * Get the file cache name
   * 
   * @returns the file cache name
   */
  public getFileCacheName() {
    if (this.get('once')) {
      return this.get('cache') + '.cache';
    }
    else return '';
  }

}