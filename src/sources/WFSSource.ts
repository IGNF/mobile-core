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
    this.requestProperties.typename = options.geoservice.layers;
    this.requestProperties.version = options.geoservice.version;
    this.requestProperties.projection = options.srs || WFS_DEFAULT_VALUES.SRS_NAME;
    this.requestProperties.id = options.geoservice.inputMask?.id ?? -1;
    this.requestProperties.maxFeatures = options.maxFeatures;
    this.requestProperties.format = options.geoservice.format;

  }

  public setAuthentication(username: string, password: string) {
    this.requestProperties.username = username;
    this.requestProperties.password = password;
  }

  public getCachePath(): string {
    return "";
  }

  public async loadFromCache(): Promise<void> {

  }

  public async saveToCache(): Promise<void> {

  }
}