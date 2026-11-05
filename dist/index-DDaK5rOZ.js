import { Fill as xe, Style as ee, Stroke as re, Circle as dt, Icon as yn, RegularShape as Kt, Text as Ft } from "ol/style";
import ke from "ol/style/Circle";
import va from "ol/style/Text";
import { createEmpty as xi, extend as Ca, getCenter as pi } from "ol/extent";
import Qt from "ol/layer/Vector";
import er from "ol/source/Vector";
import wa from "ol/layer/Group";
import { createXYZ as En } from "ol/tilegrid";
import Q from "proj4";
import { register as _a } from "ol/proj/proj4.js";
import { bbox as mi, tile as gi } from "ol/loadingstrategy";
import { Collection as Ge, Feature as ft, View as yi } from "ol";
import Xt from "ol/format/WKT";
import St from "ol/format/GeoJSON";
import { transformExtent as Ei, transform as Aa } from "ol/proj";
import { asArray as jn } from "ol/color";
import vi from "ol-ext/style/FillPattern";
import ba from "ol-ext/style/FontSymbol";
import { LineString as Fa, MultiLineString as $n, SimpleGeometry as Sa } from "ol/geom";
import Ba from "ol-ext/style/geoportailStyle";
import Wn from "ol/format/WFS";
import Da from "ol/format/GML3";
import Ra from "ol/format/GML2";
import Ci from "ol/Feature";
import { click as Oa } from "ol/events/condition";
import Ta from "ol/interaction/Draw";
import Gn from "ol/interaction/Modify";
import Pa from "ol/interaction/Select";
import La from "ol/interaction/Translate";
import ka from "ol/Object";
import { unByKey as Ia } from "ol/Observable";
import { getUid as Lt } from "ol/util";
class tr {
  constructor() {
    this.listeners = {};
  }
  on(e, t) {
    this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t);
  }
  once(e, t) {
    const r = (n) => {
      t(n), this.off(e, r);
    };
    this.on(e, r);
  }
  off(e, t) {
    const r = this.listeners[e];
    r && (this.listeners[e] = r.filter((n) => n !== t), this.listeners[e].length === 0 && delete this.listeners[e]);
  }
  emit(e, t) {
    const r = this.listeners[e];
    r && r.forEach((n) => n(t));
  }
}
var Ye = /* @__PURE__ */ ((s) => (s.Draft = "draft", s.Cluster = "cluster", s.Submit = "submit", s.Pending = "pending", s.Pending_Qualification = "pending0", s.Pending_Entry = "pending1", s.Pending_Validation = "pending2", s.Valid = "valid", s.Valid_Already_Treated = "valid0", s.Reject = "reject", s.Reject_Irrelevant = "reject0", s))(Ye || {}), wi = /* @__PURE__ */ ((s) => (s.Valid = "valid", s.Valid_Already_Treated = "valid0", s.Reject = "reject", s.Reject_Irrelevant = "reject0", s))(wi || {});
const Te = 8, Ie = new xe({ color: [255, 255, 255, 0.8] }), ct = {
  cluster: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [255, 255, 255], width: 3 }),
      fill: Ie
    }),
    text: new va({
      font: "bold 12px Sans-serif",
      textAlign: "center",
      textBaseline: "middle",
      offsetY: 1,
      fill: new xe({ color: [255, 255, 255] })
    })
  }),
  pending: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [255, 128, 0], width: 3 }),
      fill: Ie
    })
  }),
  submit: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [51, 102, 153], width: 3 }),
      fill: Ie
    })
  }),
  valid: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [0, 192, 0], width: 3 }),
      fill: Ie
    })
  }),
  reject: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [255, 0, 0], width: 3 }),
      fill: Ie
    })
  }),
  draft: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [120, 128, 137], width: 3 }),
      fill: Ie
    })
  }),
  pending0: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [255, 128, 0], width: 3 }),
      fill: Ie
    })
  }),
  pending1: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [204, 102, 0], width: 3 }),
      fill: Ie
    })
  }),
  pending2: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [255, 170, 77], width: 3 }),
      fill: Ie
    })
  }),
  valid0: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [0, 140, 0], width: 3 }),
      fill: Ie
    })
  }),
  reject0: new ee({
    image: new ke({
      radius: Te,
      stroke: new re({ color: [180, 0, 0], width: 3 }),
      fill: Ie
    })
  })
};
class Na {
  constructor(e) {
    this.storage = e, this.EXTENT_PREFIX = "extent:";
  }
  /**
   * Adds or replaces a named extent area
   * @param name - Name of the extent area (generated if not provided)
   * @param extents - Single extent or array of extents
   * @returns The name used to store the extents
   */
  async addExtent(e, t) {
    const r = Array.isArray(t) ? t : [t];
    (!e || e.trim() === "") && (e = `Sans titre ${(await this.getNames()).length}`);
    const n = this.EXTENT_PREFIX + e;
    return await this.storage.saveMetadata(n, {
      id: n,
      name: e,
      type: "vector",
      created: /* @__PURE__ */ new Date(),
      modified: /* @__PURE__ */ new Date(),
      size: 0,
      extra: {
        extents: r
      }
    }), e;
  }
  /**
   * Appends a single extent to an existing named area
   * @param name - Name of the extent area
   * @param extent - Extent to append
   */
  async appendExtent(e, t) {
    const r = await this.get(e), n = r.length > 0 ? [...r, t] : [t];
    await this.addExtent(e, n);
  }
  /**
   * Retrieves the extent array for a given name
   * Returns empty array if not found
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async get(e) {
    var n;
    const t = this.EXTENT_PREFIX + e, r = await this.storage.getMetadata(t);
    return !r || !((n = r.extra) != null && n.extents) ? [] : r.extra.extents;
  }
  /**
   * Retrieves a single extent for a given name (alias for get)
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async getExtent(e) {
    return this.get(e);
  }
  /**
   * Returns all stored extent names
   * @returns Array of extent area names
   */
  async getNames() {
    return (await this.storage.listMetadata(this.EXTENT_PREFIX)).filter((t) => t.id.startsWith(this.EXTENT_PREFIX)).map((t) => t.id.substring(this.EXTENT_PREFIX.length));
  }
  /**
   * Returns key-value pairs of extent names
   * @returns Object mapping names to themselves
   */
  async getExtentNames() {
    const e = await this.getNames(), t = {};
    for (const r of e)
      t[r] = r;
    return t;
  }
  /**
   * Removes a named extent area
   * @param name - Name of the extent area to remove
   */
  async deleteExtent(e) {
    const t = this.EXTENT_PREFIX + e;
    await this.storage.deleteMetadata(t);
  }
  /**
   * Retrieves a single extent that encompasses all extents for the given name(s)
   * Unions multiple extent boxes into one bounding box that contains all of them
   * @param names - Single name or array of names
   * @returns Combined extent
   */
  async getAllInOneExtent(e) {
    const t = xi(), r = Array.isArray(e) ? await this.getAllExtents(e) : await this.get(e);
    for (const n of r)
      Ca(t, n);
    return t;
  }
  /**
   * Retrieves all extents for multiple names as a flat array
   * @param names - Array of extent area names
   * @returns Flattened array of all extents
   */
  async getAllExtents(e) {
    if (!Array.isArray(e))
      throw new Error("names parameter must be an array");
    return (await Promise.all(
      e.map((r) => this.get(r))
    )).flat();
  }
}
class Eu {
  constructor(e, t, r = {}) {
    this.storage = e, this.layerGroup = t, this.options = r, this.CACHE_PREFIX = "raster:cache:", this.ORDER_KEY = "raster:cache:order", this.LAYER_NAME = "GEOGRAPHICALGRIDSYSTEMS.MAPS", this._eventManager = new tr(), this.extentManager = new Na(e), this.silentErrors = r.silentErrors ?? !1, this.currentErrors = /* @__PURE__ */ new Set(), this.extentLayer = new Qt({
      source: new er(),
      properties: {
        name: "Emprises",
        displayInLayerSwitcher: !1
      }
    }), this.layerGroup.getLayers().push(this.extentLayer), this.layerGroup.getLayers().on("remove", () => {
      setTimeout(() => {
        this.reorderCacheLayers().catch((n) => {
          this.silentErrors || this._eventManager.emit("cache:error", {
            type: "reorder",
            message: "Failed to reorder cache layers",
            error: n
          });
        });
      }, 0);
    });
  }
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
  getCachePath() {
    const e = this.options.cacheRoot || "", t = this.options.dirName || "geoportail";
    return `${e}${t}/`;
  }
  /**
   * Get the default layer name for Geoportail
   * @returns The default Geoportail layer name
   */
  getDefaultLayerName() {
    return this.LAYER_NAME;
  }
  /**
   * Reorders cache layers in the layer group based on stored order
   * Maintains visual consistency when layers are manipulated
   */
  async reorderCacheLayers() {
    var i;
    const e = this.layerGroup.getLayers().getArray(), t = await this.storage.getMetadata(this.ORDER_KEY);
    if (!t || !((i = t.extra) != null && i.order))
      return;
    const r = t.extra.order, n = [...e].sort((a, o) => {
      const l = a.get("name"), c = o.get("name"), u = r.findIndex((f) => l === `cache_${f}`), h = r.findIndex((f) => c === `cache_${f}`);
      return u - h;
    });
    JSON.stringify(e) !== JSON.stringify(n) && (this.layerGroup.getLayers().clear(), n.forEach((a) => this.layerGroup.getLayers().push(a)));
  }
  /**
   * Saves the current cache layer order to storage
   */
  async saveCacheOrder() {
    const t = (await this.storage.listMetadata(this.CACHE_PREFIX)).map((r) => r.id.replace(this.CACHE_PREFIX, ""));
    await this.storage.saveMetadata(this.ORDER_KEY, {
      id: this.ORDER_KEY,
      name: "Cache Order",
      type: "raster",
      created: /* @__PURE__ */ new Date(),
      modified: /* @__PURE__ */ new Date(),
      size: 0,
      extra: { order: t }
    });
  }
  /**
   * Not implemented
   * Because does jQuery manipulation
   * Might just have a 'getInfo' method that returns the info as a string
   * (see CacheMap.js line 140)
   */
  showInfo() {
  }
  /**
   * Gets the ExtentManager instance for managing cache extents
   * @returns ExtentManager instance
   */
  getExtentManager() {
    return this.extentManager;
  }
  /**
   * Gets the EventManager instance for listening to cache events
   * @returns EventManager instance
   */
  getEventManager() {
    return this._eventManager;
  }
  /**
   * Gets the vector layer used for extent visualization
   * @returns VectorLayer instance
   */
  getExtentLayer() {
    return this.extentLayer;
  }
  /**
   * Creates a new raster cache with the given configuration
   * @param config - Cache configuration
   * @returns Cache ID
   */
  async createCache(e) {
    const t = {};
    return await this.storage.saveMetadata(t.id, t), await this.saveCacheOrder(), e.id;
  }
  /**
   * Deletes a cache and all its associated data
   * @param id - Cache ID to delete
   */
  async deleteCache(e) {
    const t = this.CACHE_PREFIX + e;
    if (!await this.storage.getMetadata(t))
      throw new Error(`Cache ${e} not found`);
    const n = await this.storage.listTiles(t);
    await Promise.all(n.map((i) => this.storage.deleteTile(i))), await this.storage.deleteMetadata(t), await this.removeCacheLayer(e), await this.saveCacheOrder();
  }
  /**
   * Loads a cache as a layer in the layer group
   * @param id - Cache ID to load
   */
  async loadCache(e) {
    const t = this.CACHE_PREFIX + e;
    if (!await this.storage.getMetadata(t))
      throw new Error(`Cache ${e} not found`);
    await this.addCacheLayer(e, this.layerGroup);
  }
  /**
   * Starts downloading tiles for a cache
   * @param id - Cache ID to start downloading
   * @returns Promise that resolves when download starts (currently not implemented)
   * 
   * @todo Implement actual download logic with TileCache integration
   */
  async startDownload(e) {
    this.currentCacheId = e, this.currentErrors.clear(), console.warn(`startDownload(${e}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:download:start", { id: e, status: "not_implemented" });
  }
  /**
   * Pauses an ongoing cache download
   * @param id - Cache ID to pause
   * @returns Promise that resolves when download is paused (currently not implemented)
   * 
   * @todo Implement pause logic with TileCache integration
   */
  async pauseDownload(e) {
    if (this.currentCacheId !== e) {
      console.warn(`pauseDownload(${e}): No active download for this cache`);
      return;
    }
    console.warn(`pauseDownload(${e}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:download:pause", { id: e, status: "not_implemented" });
  }
  /**
   * Cancels an ongoing cache download
   * @param id - Cache ID to cancel
   * @returns Promise that resolves when download is cancelled (currently not implemented)
   * 
   * @todo Implement cancel logic with TileCache integration
   */
  async cancelDownload(e) {
    if (this.currentCacheId !== e) {
      console.warn(`cancelDownload(${e}): No active download for this cache`);
      return;
    }
    this.currentCacheId = void 0, this.currentErrors.clear(), console.warn(`cancelDownload(${e}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:download:cancel", { id: e, status: "not_implemented" });
  }
  /**
   * Gets the download progress for a cache
   * @param id - Cache ID
   * @returns Progress information
   */
  async getDownloadProgress(e) {
    var n, i, a, o;
    const t = this.CACHE_PREFIX + e, r = await this.storage.getMetadata(t);
    if (!r)
      throw new Error(`Cache ${e} not found`);
    return {
      id: e,
      type: "raster",
      total: ((n = r.extra) == null ? void 0 : n.totalTiles) || 0,
      current: r.tileCount || 0,
      percent: (i = r.extra) != null && i.totalTiles ? (r.tileCount || 0) / r.extra.totalTiles * 100 : 0,
      status: ((a = r.extra) == null ? void 0 : a.downloadStatus) || "complete",
      bytesDownloaded: r.size,
      bytesTotal: ((o = r.extra) == null ? void 0 : o.estimatedSize) || 0
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
  async addCacheLayer(e, t) {
    console.warn(`addCacheLayer(${e}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:layer:add", { id: e, status: "not_implemented" });
  }
  /**
   * Removes a cache layer from the layer group
   * @param id - Cache ID
   */
  async removeCacheLayer(e) {
    const r = this.layerGroup.getLayers().getArray().find((n) => n.get("name") === `cache_${e}`);
    r && this.layerGroup.getLayers().remove(r);
  }
}
const Ua = {
  COLLAB_VECTOR_RENDER_MODE: "image"
}, Oe = {
  FILL_COLOR: "rgba(255,255,255,0.4)",
  STROKE_COLOR: "#3399CC",
  STROKE_WIDTH: 1.25,
  CIRCLE_RADIUS: 5,
  LABEL_COLOR: "#000",
  LABEL_STROKE_COLOR: "#fff",
  LABEL_SIZE: 10,
  LABEL_STROKE_WIDTH: 4
};
class qa {
  /**
   * Initialize all French projections
   * Define projections if not already defined
   */
  initProjections() {
    Q.defs("EPSG:2154") || Q.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("IGNF:LAMB93") || Q.defs("IGNF:LAMB93", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("EPSG:27572") || Q.defs("EPSG:27572", "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"), Q.defs("EPSG:2975") || Q.defs("EPSG:2975", "+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("EPSG:4467") || Q.defs("EPSG:4467", "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("EPSG:4559") || Q.defs("EPSG:4559", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("EPSG:5490") || Q.defs("EPSG:5490", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("EPSG:2972") || Q.defs("EPSG:2972", "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Q.defs("EPSG:EPSG:4471") || Q.defs("EPSG:4471", "+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), _a(Q);
  }
  registerCustomProjection(e, t) {
    Q.defs(e) || Q.defs(e, t);
  }
  /**
   * Transform coordinates from one projection to another
   * @param coords - Coordinates as [x, y] or [longitude, latitude]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed coordinates as [x, y]
   */
  transformCoordinates(e, t, r) {
    const n = Q(t, r, e);
    return [n[0], n[1]];
  }
  /**
   * Transform an extent from one projection to another
   * @param extent - Extent as [minX, minY, maxX, maxY]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed extent as [minX, minY, maxX, maxY]
   */
  transformExtent(e, t, r) {
    const [n, i, a, o] = e, l = Q(t, r, [n, i]), c = Q(t, r, [a, i]), u = Q(t, r, [n, o]), h = Q(t, r, [a, o]), f = Math.min(l[0], c[0], u[0], h[0]), p = Math.min(l[1], c[1], u[1], h[1]), m = Math.max(l[0], c[0], u[0], h[0]), E = Math.max(l[1], c[1], u[1], h[1]);
    return [f, p, m, E];
  }
  constructor() {
    this.initProjections();
  }
}
const Je = {
  TILE_SIZE: 256,
  MAX_FEATURES: 5e3,
  SRS_NAME: "IGNF:LAMB93",
  EDTION_CACHE_URL: "FILE/layer-edition-cache/"
  // check if it's ok
}, kt = {
  TILE_SIZE: 256,
  MIN_ZOOM_INCREASE: 2,
  SRS_NAME: "EPSG:4326"
}, on = "EPSG:3857", Ma = "/../../document/add";
function _i(s) {
  return !s || typeof s != "object" ? !1 : s.kind === "document";
}
function Ha(s) {
  const e = atob(s), t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r += 1)
    t[r] = e.charCodeAt(r);
  return t.buffer;
}
class za {
  constructor(e) {
    this.apiClient = e;
  }
  /**
   * Upload a document to a specified URI
   * @param uri - The URI endpoint for upload
   * @param file - The file blob to upload
   * @param filename - The name of the file
   * @param metadata - Optional metadata to attach to the upload
   * @returns The URL of the uploaded document
   */
  async uploadDocument(e, t, r, n) {
    const i = new FormData();
    if (i.append("file", t, r), n)
      for (const [o, l] of Object.entries(n))
        i.append(o, String(l));
    const a = await this.apiClient.doRequest(e, "post", i, null, "multipart/form-data");
    return a.data.url || a.data.path;
  }
  /**
   * Upload a collaborative document draft and return the stored document id.
   */
  async addCollaborativeDocument(e) {
    var a;
    const t = this.apiClient;
    if (typeof t.doRequest != "function")
      throw new Error("Collaborative client does not support document upload");
    const r = new Blob(
      [Ha(e.contentBase64)],
      { type: e.mimeType ?? "application/octet-stream" }
    ), n = await t.doRequest(
      Ma,
      "post",
      { document: r },
      null,
      "multipart/form-data"
    ), i = (a = n == null ? void 0 : n.data) == null ? void 0 : a.id;
    if (i == null || i === "")
      throw new Error("Document upload did not return a document id");
    return String(i);
  }
  /**
   * Resolve a collaborative document draft to the value expected by the
   * transaction payload: either a stored document id or null when removed.
   */
  async resolveCollaborativeDocumentValue(e) {
    return _i(e) ? e.file ? this.addCollaborativeDocument(e.file) : e.removed ? null : e.documentId : e;
  }
  /**
   * Delete a document by its ID
   * @param documentId - The ID of the document to delete
   */
  async deleteDocument(e) {
    await this.apiClient.doRequest(`${this.apiClient.getBaseUrl()}/document/${e}`, "delete");
  }
  /**
   * Get the URL of a document by its ID
   * @param documentId - The ID of the document
   * @returns The URL of the document
   * 
   * Note: The exact URL pattern depends on the API server configuration.
   * Common patterns are:
   * - ${baseUrl}/document/${documentId}
   * - ${baseUrl}/documents/${documentId}
   * - ${baseUrl}/api/v1/documents/${documentId}
   * 
   * This should be verified against the actual API documentation.
   */
  getDocumentUrl(e) {
    return `${this.apiClient.getBaseUrl()}/document/${e}`;
  }
}
var At = /* @__PURE__ */ ((s) => (s.COLLAB_NO_CLIENT_DEFINED = "Client must be defined", s.COLLAB_NO_TABLE_DEFINED = "Table must be defined", s.COLLAB_UNKNOWN_PROJECTION = "Projection inconnue", s.WFS_NO_USERNAME_OR_PASSWORD = "Username and password are required", s))(At || {});
class rr {
  /**
   * Inspired from the CordovApp.File.fileName function in CordovApp, File.js line 60
   * @param filename name of a file to sanitize
   * @returns sanitized filename
   */
  sanitizeFileName(e) {
    var t = /[/?<>\\:*|":]/g, r = /[\x00-\x1f\x80-\x9f]/g, n = /^\.+$/, i = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, a = /[. ]+$/;
    return (e || "_").replace(t, "_").replace(r, "_").replace(n, "_").replace(i, "_").replace(a, "_");
  }
  /**
   * Get the domain from a full URL
   * @param URL like https://example.com/path/file.html
   * @returns the escaped domain, like example_com
   */
  getEscapedDomainFromURL(e) {
    return e.replace(/^((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?$/, "$3").replace(/\./g, "_");
  }
}
const cr = new rr(), ge = {
  insert: "Insert",
  update: "Update",
  delete: "Delete"
}, ja = 2e3, $a = 3;
function lt(s, e) {
  if (s === e)
    return !0;
  switch (e) {
    case ge.insert:
      return s === "INSERT";
    case ge.update:
      return s === "UPDATE";
    case ge.delete:
      return s === "DELETE";
    default:
      return !1;
  }
}
function lr(s) {
  const e = [];
  for (const t of s)
    !t || e.includes(t) || e.push(t);
  return e;
}
class Zt extends er {
  constructor(e) {
    new qa().initProjections();
    const r = Zt._computeVectorSourceOptions(e);
    super(r), this._isLoading = !1, this._writeUpdateCounter = 0, this._tileLoading = 0, this._projectionCode = on, this._extentRetryGeneration = 0, this._extentRetryTimers = [], this._extentRetryAttempts = /* @__PURE__ */ new Map(), this.localProperties = {}, this.preservedFeatures = new Ge(), this.differentialFeatures = new Ge(), this.insertedFeatures = new Ge(), this.deletedFeatures = new Ge(), this.updatedFeatures = new Ge(), this._options = e || {}, this._cache = e.cache, this.localProperties = r.properties || {}, this._initCollabVectorSource();
  }
  static _computeVectorSourceOptions(e) {
    const t = e || {};
    if (t.client === void 0)
      throw new Error(At.COLLAB_NO_CLIENT_DEFINED);
    if (t.table === void 0)
      throw new Error(At.COLLAB_NO_TABLE_DEFINED);
    const r = t.table;
    let n = t.strategy || mi;
    const i = Zt._getCacheNamespace(t), a = cr.sanitizeFileName(
      `${r.database}-${r.name}-editions.txt`
    ), o = t.legacyCacheFallback !== !1, l = i ? cr.sanitizeFileName(`${i}-editions.txt`) : a, c = {
      online: t.online ?? !0,
      useCacheWhenOnline: t.useCacheWhenOnline === !0,
      cacheNamespace: i,
      cacheUrl: t.cacheUrl,
      editionCacheFile: l,
      legacyEditionCacheFile: o && l !== a ? a : void 0,
      legacyCacheFallback: o,
      formatWKT: new Xt(),
      tiled: !1,
      tileGrid: void 0,
      maxReload: void 0
    };
    if (t.tileZoom) {
      const u = En({
        tileSize: t.tileSize || Je.TILE_SIZE,
        minZoom: t.tileZoom,
        maxZoom: t.tileZoom
      });
      n = gi(u), c.tiled = !0, c.tileGrid = u, c.maxReload = t.maxReload;
    }
    return {
      strategy: n,
      properties: c,
      features: new Ge(),
      attributions: t.attribution,
      logo: t.logo,
      useSpatialIndex: !0,
      wrapX: t.wrapX
    };
  }
  static _getCacheNamespace(e) {
    var r;
    const t = (r = e.cacheNamespace) == null ? void 0 : r.trim();
    if (t)
      return cr.sanitizeFileName(t);
  }
  _initCollabVectorSource() {
    var t, r;
    const e = this._options.table || {};
    this.table = e, e.wfs && (e.docURI = e.wfs.replace(/\/gcms\/.*/, "/document/")), this._options.maxFeatures = this._options.maxFeatures || Je.MAX_FEATURES, this._options.tileSize = this._options.tileSize || Je.TILE_SIZE, this.localProperties.srsName = this._getTableCRS(), Q.defs(this.localProperties.srsName) || console.error(At.COLLAB_UNKNOWN_PROJECTION, this.localProperties.srsName), this.localProperties.featureFilter = this._options.filter ?? {}, (t = e.columns) != null && t.detruit ? this.localProperties.featureFilter = { detruit: !1 } : (r = e.columns) != null && r.gcms_detruit && (this.localProperties.featureFilter = { gcms_detruit: !1 }), this.preservedFeatures = this._options.preserved ?? new Ge(), this.localProperties.preservedFeatures = this.preservedFeatures, this.on("addfeature", (n) => {
      n != null && n.feature && this.onAddFeature(n.feature);
    }), this.on("removefeature", (n) => {
      n != null && n.feature && this.onDeleteFeature(n.feature);
    }), this.loadChanges(), this.setLoader(this.loaderFn.bind(this));
  }
  getTable() {
    return this.table;
  }
  onAddFeature(e) {
    var i;
    const t = e.getGeometry();
    if (t && t.on("change", () => {
      const a = e.updates || {};
      a.geometry = !0, e.updates = a, e.dispatchEvent({
        type: "propertychange",
        target: e
      });
    }), e.on("propertychange", this.onUpdateFeature.bind(this, e)), this._isLoading) return;
    e.state = ge.insert;
    const r = ((i = this.table) == null ? void 0 : i.columns) || {}, n = this._getGeometryColumnName();
    for (const a in r)
      a !== n && e.get(a) === void 0 && e.set(a, null, !0);
    this.insertedFeatures.push(e), this.writeChanges();
  }
  onDeleteFeature(e) {
    if (this._isLoading) return;
    const t = e.state;
    lt(t, ge.insert) ? this.removeFeatureFromCollection(this.insertedFeatures, e) : (lt(t, ge.update) && this.removeFeatureFromCollection(this.updatedFeatures, e), this.deletedFeatures.push(e)), e.state = ge.delete, this.writeChanges();
  }
  getPendingChangesCount() {
    return this.insertedFeatures.getLength() + this.updatedFeatures.getLength() + this.deletedFeatures.getLength();
  }
  resetChanges() {
    this.insertedFeatures.clear(), this.deletedFeatures.clear(), this.updatedFeatures.clear(), this.preservedFeatures.clear(), this.reload(), this.writeChanges(!0), this._dispatchEditChange();
  }
  async submitChanges() {
    this.dispatchEvent({ type: "savestart" });
    try {
      const e = await this._resolveTransactionDocumentActions(this._getTransactionActions());
      if (!e.length)
        return this.dispatchEvent({ type: "saveend" }), null;
      const t = this._options.client;
      if (typeof (t == null ? void 0 : t.addTransaction) != "function") {
        const i = new Error("Collaborative client does not support addTransaction");
        throw this.dispatchEvent({ type: "saveend", status: "error", error: i }), i;
      }
      const r = await t.addTransaction(this.table.databaseId, {
        actions: e,
        comment: `source vecteur: ${this.table.database}":"${this.table.name}`
      }), n = r == null ? void 0 : r.data;
      if ((n == null ? void 0 : n.status) === "conflicting")
        throw this.dispatchEvent({
          type: "saveend",
          status: "error",
          error: n
        }), n;
      return this.resetChanges(), this.dispatchEvent({ type: "saveend", transaction: n }), n;
    } catch (e) {
      throw this.dispatchEvent({ type: "saveend", status: "error", error: e }), e;
    }
  }
  removeFeatureFromCollection(e, t) {
    const n = e.getArray().indexOf(t);
    n > -1 && e.removeAt(n);
  }
  writeChanges(e = !1) {
    if (!e) {
      this._writeUpdateCounter++, setTimeout(() => {
        this.writeChanges(!0);
      }, 100);
      return;
    }
    if (this._writeUpdateCounter--, this._writeUpdateCounter > 0) return;
    this._writeUpdateCounter = 0;
    const t = this.getSaveActions(!0), r = this.localProperties.editionCacheFile;
    if (r) {
      if (this._cache)
        this._saveEditionCache(r, t).catch((n) => {
          console.error("ERROR: writeChanges on layer", n);
        });
      else
        try {
          localStorage.setItem(r, JSON.stringify(t));
        } catch (n) {
          console.error("ERROR: writeChanges fallback to localStorage", n);
        }
      this._dispatchEditChange();
    }
  }
  getSaveActions(e = !0) {
    const t = this.localProperties.formatWKT;
    return {
      insert: this.insertedFeatures.getArray().map((r) => this.serializeFeature(r, t, e)),
      update: this.updatedFeatures.getArray().map((r) => this.serializeFeature(r, t, e)),
      delete: this.deletedFeatures.getArray().map((r) => this.serializeFeature(r, t, !1))
    };
  }
  serializeFeature(e, t, r) {
    const n = e.getProperties(), i = {
      id: e.getId(),
      properties: {}
    }, a = this._getGeometryColumnName();
    for (const o in n)
      o !== a && o !== "geometry" && (i.properties[o] = n[o]);
    if (r) {
      const o = e.getGeometry();
      o && t && (i.geometry = t.writeGeometry(o));
    }
    return i;
  }
  loadChanges() {
    const e = this.localProperties.editionCacheFile;
    if (!e) return;
    const t = lr([
      e,
      this.localProperties.legacyEditionCacheFile
    ]);
    if (this._cache)
      this._loadEditionCacheFromCandidates(t).then((r) => {
        r && this._restoreActions(r);
      }).catch((r) => {
        console.error("ERROR: loadChanges on layer", r);
      });
    else
      try {
        let r = null;
        for (const n of t)
          if (r = localStorage.getItem(n), r)
            break;
        if (r) {
          const n = JSON.parse(r);
          this._restoreActions(n);
        }
      } catch (r) {
        console.error("ERROR: loadChanges fallback to localStorage", r);
      }
  }
  _restoreActions(e) {
    const t = this.localProperties.formatWKT;
    e.insert && Array.isArray(e.insert) && e.insert.forEach((r) => {
      const n = this.deserializeFeature(r, t);
      n && (n.state = ge.insert, this.insertedFeatures.push(n));
    }), e.update && Array.isArray(e.update) && e.update.forEach((r) => {
      const n = this.deserializeFeature(r, t);
      n && (n.state = ge.update, this.updatedFeatures.push(n));
    }), e.delete && Array.isArray(e.delete) && e.delete.forEach((r) => {
      const n = this.deserializeFeature(r, t);
      n && (n.state = ge.delete, this.deletedFeatures.push(n));
    }), this._dispatchEditChange();
  }
  deserializeFeature(e, t) {
    try {
      const r = new ft();
      if (e.id !== void 0 && e.id !== null && r.setId(e.id), e.properties && r.setProperties(e.properties), e.geometry && t) {
        const n = t.readGeometry(e.geometry);
        r.setGeometry(n);
      }
      return r;
    } catch (r) {
      return console.error("ERROR: deserializeFeature", r), null;
    }
  }
  onUpdateFeature(e, t) {
    if (this._isLoading) return;
    const r = e.state, n = t == null ? void 0 : t.key;
    if (!lt(r, ge.insert)) {
      if (n && n !== "geometry") {
        const i = e.updates || {};
        i[n] = !0, e.updates = i;
      }
      lt(r, ge.update) || (e.state = ge.update, this.updatedFeatures.push(e)), this.writeChanges();
    }
  }
  _dispatchEditChange() {
    this.dispatchEvent({
      type: "editchange",
      pendingChangesCount: this.getPendingChangesCount()
    });
  }
  _getTransactionActions() {
    return [
      ...this._buildTransactionActions(this.insertedFeatures, ge.insert, !0),
      ...this._buildTransactionActions(this.deletedFeatures, ge.delete, !1),
      ...this._buildTransactionActions(this.updatedFeatures, ge.update, !1)
    ];
  }
  _getDocumentColumnNames() {
    return Object.entries(this.table.columns).filter(([, e]) => typeof e.type == "string" && e.type.toLowerCase() === "document").map(([e]) => e);
  }
  async _resolveTransactionDocumentActions(e) {
    const t = this._getDocumentColumnNames();
    if (!t.length)
      return e;
    const r = new za(this._options.client), n = /* @__PURE__ */ new Map();
    return Promise.all(e.map(async (i) => {
      const a = i.data;
      if (!a || typeof a != "object")
        return i;
      const o = { ...a };
      for (const l of t) {
        const c = o[l];
        if (_i(c)) {
          if (c.file) {
            const u = JSON.stringify(c.file);
            let h = n.get(u);
            h || (h = await r.addCollaborativeDocument(c.file), n.set(u, h)), o[l] = h;
            continue;
          }
          o[l] = await r.resolveCollaborativeDocumentValue(c);
        }
      }
      return {
        ...i,
        data: o
      };
    }));
  }
  _buildTransactionActions(e, t, r) {
    return e.getArray().filter((n) => lt(n.state, t)).map((n) => ({
      data: this._serializeTransactionFeature(n, r),
      state: t,
      table: this.table.id
    }));
  }
  _serializeTransactionFeature(e, t) {
    const r = e.getProperties(), n = {}, i = this._getGeometryColumnName(), a = this._getIdPropertyName(), o = e.updates || {};
    if (t)
      for (const l in r)
        l !== i && l !== "geometry" && (n[l] = r[l]);
    else {
      const l = this._getFeatureIdentifier(e, a);
      l != null && (n[a] = l);
      for (const c in r)
        c === i || c === "geometry" || (o[c] || c === "gcms_fingerprint") && (n[c] = r[c]);
    }
    if (t || o.geometry) {
      const l = e.getGeometry(), c = this.localProperties.formatWKT;
      if (l && c) {
        const u = l.clone();
        this._projectionCode && this.localProperties.srsName && u.transform(this._projectionCode, this.localProperties.srsName), n[i] = c.writeGeometry(u);
      }
    }
    return n;
  }
  async _saveEditionCache(e, t) {
    if (!this._cache) return;
    const r = {
      id: `edition:${e}`,
      name: `Edition Cache: ${this.table.name}`,
      type: "vector",
      created: /* @__PURE__ */ new Date(),
      modified: /* @__PURE__ */ new Date(),
      size: JSON.stringify(t).length,
      extra: {
        actions: t
      }
    };
    await this._cache.saveMetadata(r.id, r);
  }
  async _loadEditionCache(e) {
    var t;
    if (!this._cache) return null;
    try {
      const r = await this._cache.getMetadata(`edition:${e}`);
      return r && ((t = r.extra) != null && t.actions) ? r.extra.actions : null;
    } catch (r) {
      return console.error("ERROR: _loadEditionCache", r), null;
    }
  }
  async _loadEditionCacheFromCandidates(e) {
    for (const t of e) {
      const r = await this._loadEditionCache(t);
      if (r)
        return r;
    }
    return null;
  }
  setLoading(e) {
    this._isLoading = e;
  }
  reload() {
    this._isLoading = !0, this.clear(!0), this._isLoading = !1, this.dispatchEvent({ type: "reload", maxreload: this.localProperties.maxReload }), this.refresh();
  }
  refresh() {
    this._invalidateExtentRetries(), super.refresh();
  }
  loaderFn(e, t, r, n, i) {
    this._loadFeatures(e, t, r, n, i);
  }
  async _loadFeatures(e, t, r, n, i) {
    var o;
    const a = this._extentRetryGeneration;
    if (this._projectionCode = typeof r == "string" ? r : ((o = r == null ? void 0 : r.getCode) == null ? void 0 : o.call(r)) || on, !Q.defs(this.localProperties.srsName)) {
      this.dispatchEvent({ type: "loadend", status: "error", error: At.COLLAB_UNKNOWN_PROJECTION }), i && i();
      return;
    }
    this.localProperties.maxReload && this.localProperties.tiled && this._tileLoading === 1 && this.getFeatures().length > this.localProperties.maxReload && this.reload(), this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading });
    try {
      let l = [];
      const c = this.localProperties.online !== !1, u = !!(this.localProperties.cacheUrl || this.localProperties.cacheNamespace), h = this.localProperties.useCacheWhenOnline === !0;
      u && (!c || h) && (l = await this._loadFromOfflineCache(e, t)), this._countPayloadFeatures(l) === 0 && c && (l = await this._loadFromOnline(e));
      const f = this._countPayloadFeatures(l), p = this._readFeatures(l, this._projectionCode), m = [];
      p.forEach((y) => {
        const C = this._findFeature(y);
        C && m.push(C);
      });
      const E = this._getIdPropertyName();
      this.insertedFeatures.getArray().forEach((y) => {
        lt(y.state, ge.insert) && (this._containsFeature(m, y, E) || m.push(y));
      }), this._isLoading = !0, this.localProperties.tiled || this.clear(!0), m.length && this.addFeatures(m), this._isLoading = !1, c && await this._saveFeaturesToOfflineCache(e, t, m), this.dispatchEvent({ type: "loadend", remains: --this._tileLoading }), f >= (this._options.maxFeatures || Je.MAX_FEATURES) && this.dispatchEvent({ type: "overload" }), a === this._extentRetryGeneration && this._extentRetryAttempts.delete(e.join(",")), n && n(m);
    } catch (l) {
      this._isLoading = !1, this.dispatchEvent({
        type: "loadend",
        error: (l == null ? void 0 : l.message) || String(l),
        status: "error",
        remains: Math.max(0, --this._tileLoading)
      }), this._failExtentLoad(e, a, i, l);
    }
  }
  /**
   * OpenLayers marks the extent loaded as soon as the loader starts, and does not undo that when `failure` runs.
   * A failed tile is loaded again up to three times. After that, the extent stays marked loaded until a refresh.
   */
  _failExtentLoad(e, t, r, n) {
    if (r && r(), t !== this._extentRetryGeneration || n instanceof Error && n.message === "Table WFS URL is missing") return;
    const i = e.join(","), a = this._extentRetryAttempts.get(i) ?? 0;
    if (a >= $a) return;
    this._extentRetryAttempts.set(i, a + 1);
    const o = setTimeout(() => {
      this._extentRetryTimers = this._extentRetryTimers.filter((l) => l !== o), t === this._extentRetryGeneration && (this.removeLoadedExtent(e), this.changed());
    }, ja * 2 ** a);
    this._extentRetryTimers.push(o);
  }
  _invalidateExtentRetries() {
    this._extentRetryGeneration += 1, this._extentRetryAttempts.clear();
    for (const e of this._extentRetryTimers)
      clearTimeout(e);
    this._extentRetryTimers = [];
  }
  async _loadFromOnline(e) {
    var n;
    const t = this.getWFSParams(e, this._projectionCode);
    if (!((n = this.table) != null && n.wfs))
      throw new Error("Table WFS URL is missing");
    return (await this._options.client.doRequest(this.table.wfs, "get", null, t)).data;
  }
  async _loadFromOfflineCache(e, t) {
    if (!this._cache || typeof this._cache.loadFeatures != "function")
      return [];
    const r = this._getOfflineCacheKeys(e, t, !0);
    for (const n of r)
      try {
        const i = await this._cache.loadFeatures(n);
        if (Array.isArray(i) && i.length)
          return i;
      } catch {
      }
    return [];
  }
  async _saveFeaturesToOfflineCache(e, t, r) {
    if (!this._cache || typeof this._cache.saveFeatures != "function")
      return;
    const n = this._getOfflineCacheKeys(e, t);
    if (n.length)
      try {
        await this._cache.saveFeatures(n[0], r);
      } catch {
      }
  }
  getCacheNamespace() {
    return this.localProperties.cacheNamespace || this._getLegacyCacheNamespace();
  }
  getOfflineCacheKeys(e, t) {
    return this._getOfflineCacheKeys(e, t);
  }
  _getOfflineCacheKeys(e, t, r = !1) {
    const n = this._getLegacyCacheNamespace(), i = this.localProperties.legacyCacheFallback !== !1, a = lr([
      this.localProperties.cacheNamespace || n,
      r && i ? n : void 0
    ]), o = this.localProperties.tileGrid;
    if (!o)
      return a;
    const l = o.getTileCoordForCoordAndResolution(pi(e), t);
    return lr(
      a.flatMap((c) => [`${c}:${l.join("-")}`, c])
    );
  }
  _getLegacyCacheNamespace() {
    return `${this.table.database}:${this.table.name}`;
  }
  getWFSParams(e, t) {
    const r = Ei(e, t, this.localProperties.srsName);
    return {
      service: "WFS",
      request: "GetFeature",
      outputFormat: this._options.outputFormat || "JSON",
      typeName: this.table.name,
      bbox: r.join(","),
      filter: JSON.stringify(this.localProperties.featureFilter || {}),
      maxFeatures: this._options.maxFeatures || Je.MAX_FEATURES,
      version: "1.1.0"
    };
  }
  _countPayloadFeatures(e) {
    if (Array.isArray(e))
      return e.length;
    if (!e || typeof e != "object")
      return 0;
    const t = e;
    return t.type === "FeatureCollection" && Array.isArray(t.features) || Array.isArray(t.features) ? t.features.length : Array.isArray(t.data) ? t.data.length : Array.isArray(t.rows) ? t.rows.length : Array.isArray(t.items) ? t.items.length : 0;
  }
  _readFeatures(e, t) {
    if (!e)
      return [];
    if (Array.isArray(e) && e.every((o) => o instanceof ft))
      return e;
    let r = e;
    if (typeof r == "string")
      try {
        r = JSON.parse(r);
      } catch {
        return [];
      }
    if (this._isGeoJSONPayload(r))
      return new St().readFeatures(r, {
        dataProjection: this.localProperties.srsName,
        featureProjection: t
      });
    const n = this._extractItemsFromPayload(r);
    if (!n.length)
      return [];
    const i = [], a = this._getGeometryColumnName();
    for (const o of n) {
      const l = o[a] ?? o.geometry;
      if (!l) continue;
      const c = this.createFeatureFromGeom(l, t);
      if (!c) continue;
      const u = { ...o };
      delete u[a], delete u.geometry, c.setProperties(u, !0), i.push(c);
    }
    return i;
  }
  createFeatureFromGeom(e, t) {
    if (!e)
      return null;
    if (typeof e == "object" && e !== null && "type" in e)
      try {
        const r = new St().readGeometry(e, {
          dataProjection: this.localProperties.srsName,
          featureProjection: t
        });
        return r ? new ft({ geometry: r }) : null;
      } catch {
        return null;
      }
    if (typeof e == "string") {
      const r = this.localProperties.formatWKT, n = e.replace(/([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+)/g, "$1 $3");
      try {
        return r.readFeature(n, {
          dataProjection: this.localProperties.srsName,
          featureProjection: t
        });
      } catch {
        return null;
      }
    }
    return null;
  }
  _isGeoJSONPayload(e) {
    if (!e || typeof e != "object")
      return !1;
    const t = e;
    return t.type === "FeatureCollection" || t.type === "Feature";
  }
  _extractItemsFromPayload(e) {
    if (Array.isArray(e))
      return e;
    if (!e || typeof e != "object")
      return [];
    const t = e;
    return Array.isArray(t.data) ? t.data : Array.isArray(t.rows) ? t.rows : Array.isArray(t.items) ? t.items : Array.isArray(t.features) ? t.features : [];
  }
  _findFeature(e) {
    const t = this._getIdPropertyName(), r = this._getFeatureIdentifier(e, t);
    if (this.localProperties.tiled && this._featureExistsInSource(e, t, r) || this._findFeatureInCollection(this.deletedFeatures, t, r))
      return null;
    const n = this._findFeatureInCollection(this.updatedFeatures, t, r);
    if (n)
      return n;
    const i = this._findFeatureInCollection(this.differentialFeatures, t, r);
    if (i)
      return i.get("detruit") || i.get("gcms_detruit") ? null : i;
    const a = this._findFeatureInCollection(this.preservedFeatures, t, r);
    return a || e;
  }
  _featureExistsInSource(e, t, r) {
    if (r != null)
      return this.getFeatures().some(
        (o) => this._featureIdentifiersMatch(this._getFeatureIdentifier(o, t), r)
      );
    const n = e.getGeometry();
    if (!n)
      return !1;
    const i = n.getExtent();
    return this.getFeaturesInExtent([
      i[0] - 0.1,
      i[1] - 0.1,
      i[2] + 0.1,
      i[3] + 0.1
    ]).length > 0;
  }
  _findFeatureInCollection(e, t, r) {
    const n = e.getArray();
    if (r == null)
      return null;
    for (const i of n) {
      const a = this._getFeatureIdentifier(i, t);
      if (this._featureIdentifiersMatch(a, r))
        return i;
    }
    return null;
  }
  _containsFeature(e, t, r) {
    const n = this._getFeatureIdentifier(t, r);
    return n != null ? e.some(
      (i) => this._featureIdentifiersMatch(this._getFeatureIdentifier(i, r), n)
    ) : e.includes(t);
  }
  _getFeatureIdentifier(e, t) {
    const r = e.get(t);
    if (r != null)
      return r;
    const n = e.getId();
    if (n != null)
      return n;
  }
  _featureIdentifiersMatch(e, t) {
    return e == null || t === void 0 || t === null ? !1 : String(e) === String(t);
  }
  _getIdPropertyName() {
    var e;
    return ((e = this.table) == null ? void 0 : e.idName) || "id";
  }
  _getGeometryColumnName() {
    var e;
    return ((e = this.table) == null ? void 0 : e.geometryName) || "geometry";
  }
  _getTableCRS() {
    var r, n;
    const e = this._getGeometryColumnName(), t = (n = (r = this.table) == null ? void 0 : r.columns) == null ? void 0 : n[e];
    return (t == null ? void 0 : t.crs) || Je.SRS_NAME;
  }
}
class Wa {
  constructor(e) {
    this.styler = e;
  }
  zombie() {
    function e(t, r) {
      return t.get("detruit") ? [255, 0, 0, r] : [0, 0, 255, r];
    }
    return (t) => {
      const r = {
        strokeColor: e(t, 1),
        strokeWidth: 2,
        fillColor: e(t, 0.5)
      }, n = new ee({
        text: this.styler.text(r),
        fill: this.styler.fill(r),
        stroke: this.styler.stroke(r)
      });
      return this.styler.setImage(n, r, t), [n];
    };
  }
  detruit() {
    return (e) => {
      if (!e.get("detruit")) return [];
      const t = {
        strokeWidth: 2,
        strokeColor: [255, 0, 0, 0.5]
      }, r = new ee({
        text: this.styler.text(t),
        fill: this.styler.fill(t),
        stroke: this.styler.stroke(t)
      });
      return this.styler.setImage(r, t, e), [r];
    };
  }
  vivant() {
    return (e) => {
      if (e.get("detruit")) return [];
      const t = {
        strokeWidth: 2,
        strokeColor: [0, 0, 255, 0.5]
      }, r = new ee({
        text: this.styler.text(t),
        fill: this.styler.fill(t),
        stroke: this.styler.stroke(t)
      });
      return this.styler.setImage(r, t, e), [r];
    };
  }
  combine(e) {
    const t = Array.isArray(e) ? e : [e];
    return (r, n) => {
      const i = [];
      for (const a of t) {
        const o = a(r, n), l = Array.isArray(o) ? o : [o];
        i.push(...l);
      }
      return i;
    };
  }
  troncon_de_route(e) {
    return e = e || {}, Ba("BDTOPO_V3:troncon_de_route", { sens: e.sens || !0 });
  }
  sens(e) {
    e || (e = {
      attribute: "sens_de_circulation",
      glyph: "›",
      // '>',
      size: "20px",
      direct: "Sens direct",
      inverse: "Sens inverse"
    });
    const t = (n) => n == e.direct || n == e.inverse ? e.glyph : "", r = (n, i) => {
      if (n != e.direct && n != e.inverse) return 0;
      let a = i.getCoordinates(), o = 0, l = 0, c = 0, u = i.getLength();
      for (var h = 0; h < a.length - 1 && (o = a[h + 1][0] - a[h][0], l = a[h + 1][1] - a[h][1], c += Math.sqrt(o * o + l * l), !(c >= u / 2)); h++)
        ;
      return n == e.direct ? -Math.atan2(l, o) : Math.PI - Math.atan2(l, o);
    };
    return (n) => {
      const i = n.get(e.attribute), a = {
        label: t(i),
        fontWeight: "bold",
        fontSize: e.size,
        labelRotation: r(i, n.getGeometry())
        // we have to cast to LineString | MultiLineString because getGeometry() can return undefined
      };
      return [
        new ee({
          text: this.styler.text(a)
        })
      ];
    };
  }
  toponyme(e) {
    return e || (e = {
      attribute: "nom",
      size: "12px"
    }), e.minResolution || (e.minResolution = 0), e.maxResolution || (e.maxResolution = 2), (t, r) => {
      if (r > e.maxResolution || r < e.minResolution) return [];
      const n = {
        label: t.get(e.attribute),
        fontWeight: e.weight,
        fontSize: e.size
      };
      return [new ee({
        text: this.styler.text(n)
      })];
    };
  }
  batiment(e) {
    e || (e = {});
    const t = (r, n) => {
      switch (r.get("nature")) {
        case "Industriel, agricole ou commercial":
          return [51, 102, 153, n];
        case "Remarquable":
          return [0, 192, 0, n];
        default:
          switch (r.get("fonction")) {
            case "Indifférenciée":
              return [128, 128, 128, n];
            case "Sportive":
              return [51, 153, 102, n];
            case "Religieuse":
              return [153, 102, 51, n];
            default:
              return [153, 51, 51, n];
          }
      }
    };
    return (r) => {
      if (r.get("detruit")) return [];
      const n = {
        strokeColor: t(r, 1),
        fillColor: t(r, 0.5)
      };
      return /en service/i.test(r.get("etat_de_l_objet")) || (n.strokeLineDash = [10, 5], n.fillColor = [0, 0, 0, 0]), e.symbol && (n.label = this.getSymbol(r), n.fontFamily = "Fontawesome", n.fontColor = e.color || "magenta"), n.label ? [
        new ee({
          text: this.styler.text(n),
          stroke: this.styler.stroke(n),
          fill: this.styler.fill(n)
        })
      ] : [
        new ee({
          stroke: this.styler.stroke(n),
          fill: this.styler.fill(n)
        })
      ];
    };
  }
  getSymbol(e) {
    switch (e.get("fonction")) {
      case "Commerciale":
        return "";
      case "Sportive":
        return "";
      case "Mairie":
        return "";
      case "Gare":
        return "";
      case "Industrielle":
        return "";
      default:
        return null;
    }
  }
}
function Ga(s, e) {
  const t = e.split(".");
  let r = s;
  for (const n of t) {
    if (!r || typeof r != "object")
      return;
    r = r[n];
  }
  return r;
}
function qe(s, e) {
  if (Array.isArray(s) && Array.isArray(e)) {
    if (s.length !== e.length) return !1;
    for (let t = 0; t < s.length; t++)
      if (!qe(s[t], e[t]))
        return !1;
    return !0;
  }
  return s === e;
}
function Ka(s, e, t, r) {
  switch (s) {
    case "$eq":
      return qe(e, t);
    case "$ne":
      return !qe(e, t);
    case "$gt":
      return Number(e) > Number(t);
    case "$gte":
      return Number(e) >= Number(t);
    case "$lt":
      return Number(e) < Number(t);
    case "$lte":
      return Number(e) <= Number(t);
    case "$in":
      return Array.isArray(t) ? Array.isArray(e) ? e.some(
        (n) => t.some((i) => qe(n, i))
      ) : t.some((n) => qe(e, n)) : !1;
    case "$nin":
      return Array.isArray(t) ? Array.isArray(e) ? e.every(
        (n) => !t.some((i) => qe(n, i))
      ) : !t.some((n) => qe(e, n)) : !1;
    case "$exists":
      return t ? e !== void 0 : e === void 0;
    case "$regex": {
      if (typeof e != "string") return !1;
      const n = typeof r.$options == "string" ? r.$options : "";
      return (t instanceof RegExp ? t : new RegExp(String(t), n)).test(e);
    }
    case "$options":
      return !0;
    default:
      return !1;
  }
}
function Xa(s, e) {
  const t = e && typeof e == "object" ? e : null;
  if (!t)
    return qe(s, e);
  const r = Object.keys(t).filter((n) => n.startsWith("$"));
  if (r.length === 0)
    return qe(s, e);
  for (const n of r)
    if (!Ka(
      n,
      s,
      t[n],
      t
    ))
      return !1;
  return !0;
}
function bt(s, e) {
  for (const [t, r] of Object.entries(s)) {
    if (t === "$and") {
      if (!Array.isArray(r) || !r.every((i) => !i || typeof i != "object" ? !1 : bt(i, e)))
        return !1;
      continue;
    }
    if (t === "$or") {
      if (!Array.isArray(r) || !r.some((i) => !i || typeof i != "object" ? !1 : bt(i, e)))
        return !1;
      continue;
    }
    if (t === "$nor") {
      if (!Array.isArray(r) || r.some((i) => !i || typeof i != "object" ? !1 : bt(i, e)))
        return !1;
      continue;
    }
    if (t === "$not") {
      if (!r || typeof r != "object" || bt(r, e))
        return !1;
      continue;
    }
    const n = Ga(e, t);
    if (!Xa(n, r))
      return !1;
  }
  return !0;
}
function Za(s) {
  let e = s;
  if (typeof e == "string")
    try {
      e = JSON.parse(e);
    } catch {
      return;
    }
  if (!e || typeof e != "object")
    return;
  const t = e;
  return {
    matches: (r) => bt(t, r)
  };
}
function Va(s) {
  var t;
  if ((t = s.mongo) != null && t.matches)
    return;
  const e = Za(s.condition);
  e && (s.mongo = e);
}
function Ya(s) {
  if (!s || typeof s != "object")
    return "image/png";
  const e = s, t = e["content-type"] ?? e["Content-Type"];
  return typeof t == "string" && t.length > 0 ? t : "image/png";
}
function Ja(s) {
  if (s instanceof ArrayBuffer)
    return s;
  if (ArrayBuffer.isView(s))
    return s.buffer.slice(
      s.byteOffset,
      s.byteOffset + s.byteLength
    );
  if (typeof s == "string" && s.length > 0)
    try {
      const e = atob(s), t = new Uint8Array(e.length);
      for (let r = 0; r < e.length; r += 1)
        t[r] = e.charCodeAt(r);
      return t.buffer;
    } catch {
      return null;
    }
  return null;
}
function Qa(s) {
  if (!s || typeof s != "object")
    return null;
  const e = s;
  if (e.data instanceof Blob)
    return URL.createObjectURL(e.data);
  const t = Ja(e.data);
  return t ? URL.createObjectURL(new Blob([t], {
    type: Ya(e.headers)
  })) : null;
}
function cn(s) {
  return typeof s == "string" && s.length > 0 && s !== "undefined";
}
function ln(s, e) {
  if (s) {
    cn(s.externalGraphic) && typeof s.uri == "string" && s.uri.length > 0 && (e[s.externalGraphic] = s.uri);
    for (const t of s.children ?? [])
      ln(t, e);
  }
}
const ur = {};
class vn {
  constructor(e) {
    this._symbolCache = {}, this._cacheLoading = [], this._userManager = e, this.presets = new Wa(this), this.defaultStyleFn = this.getFeatureStyleFn();
  }
  /**
   * Format properties with feature context
   * @param format The format configuration
   * @param _feature The feature to format properties for (unused for now)
   * @returns Formatted property value
   */
  formatProperties(e, t) {
    if (!e || !e.replace || !t) return e;
    const r = e.replace(/.*\$\{([^}]*)\}.*/, "$1");
    return r === e ? e : this.formatProperties(e.replace("${" + r + "}", t.get(r)), t);
  }
  /**
   * Static factory method to get a style function for a collaborative layer
   * Creates a CollabStyler instance and returns its style function
   * 
   * @param table The table configuration
   * @param cacheUrl The cache URL for resources
   * @param sourceOptions Additional source options (can include userManager for symbol loading)
   * @returns Style function compatible with OpenLayers StyleLike
   */
  static getFeatureStyleFunction(e, t, r) {
    const n = r == null ? void 0 : r.userManager;
    return new vn(n).getFeatureStyleFn(e, t, r);
  }
  /**
   * Format feature style by processing all style properties
   * @param fstyle The feature style configuration
   * @param feature The feature to style
   * @returns Formatted feature style object
   */
  formatFeatureStyle(e, t) {
    if (!e) return {};
    const r = {};
    for (const n in e)
      r[n] = this.formatProperties(e[n], t);
    return r;
  }
  /**
   * Get stroke LineDash style from featureType.style
   * @param fstyle The feature style configuration
   * @returns Line dash array or undefined
   */
  strokeLineDash(e) {
    var t = Number(e.strokeWidth) || 2;
    switch (e.strokeDashstyle) {
      case "dot":
        return [1, 2 * t];
      case "dash":
        return [2 * t, 2 * t];
      case "dashdot":
        return [2 * t, 4 * t, 1, 4 * t];
      case "longdash":
        return [4 * t, 2 * t];
      case "longdashdot":
        return [4 * t, 4 * t, 1, 4 * t];
      default:
        return;
    }
  }
  /**
   * Create a Stroke style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Stroke object or undefined
   */
  stroke(e) {
    if (e.strokeOpacity === 0) return;
    const t = this.strokeLineDash(e), r = new re({
      color: e.strokeColor || "#00f",
      width: Number(e.strokeWidth) || 1,
      lineDash: t,
      lineCap: e.strokeLinecap || "round"
    });
    if (e.strokeOpacity !== void 0 && e.strokeOpacity < 1) {
      const n = jn(r.getColor());
      n.length && (n[4] = e.strokeOpacity, r.setColor(n));
    }
    return r;
  }
  /**
   * Create a Fill style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Fill or FillPattern object or undefined
   */
  fill(e) {
    if (e.fillOpacity === 0) return;
    let t = new xe({
      color: e.fillColor || "rgba(255,255,255,0.5)"
    });
    if (e.fillOpacity !== void 0 && e.fillOpacity < 1) {
      const r = jn(t.getColor());
      r.length && (r[3] = Number(e.fillOpacity), t.setColor(r));
    }
    return e.fillPattern && (t = new vi({
      fill: t,
      pattern: e.fillPattern,
      color: e.patternColor,
      angle: 45
    })), t;
  }
  /**
   * Get default circle image for point features
   * @returns OpenLayers Circle style
   */
  getDefaultCircleImage() {
    return new dt({
      radius: 10,
      fill: new xe({ color: "rgba(255,0,0,.5)" }),
      stroke: new re({ color: "#fff", width: 1.5 })
    });
  }
  /**
   * Set image on a style based on feature style configuration
   * Creates point symbols from images, circles, or font icons
   * @param olStyle The OpenLayers style to modify
   * @param fstyle The feature style configuration
   * @param feature The feature being styled (unused for now)
   */
  setImage(e, t, r) {
    let n;
    const i = t.img;
    if (i)
      ur[i] || (ur[i] = new yn({ src: i })), n = ur[i];
    else if (cn(t.externalGraphic))
      n = this.getDefaultCircleImage();
    else {
      const a = Number(t.pointRadius) || 5, o = {
        cross: [4, a, 0, 0],
        square: [4, a, void 0, Math.PI / 4],
        triangle: [3, a, void 0, 0],
        star: [5, a, a / 2, 0],
        x: [4, a, 0, Math.PI / 4],
        rectangle: [4, a, void 0, Math.PI / 4]
        // added
      };
      switch (t.graphicName) {
        case "cross":
        case "star":
        case "rectangle":
        case "square":
        case "triangle":
        case "x": {
          const l = o[t.graphicName] || o.square;
          if (n = new Kt({
            points: l[0],
            radius: l[1],
            radius2: l[2],
            rotation: l[3],
            stroke: this.stroke(t),
            fill: this.fill(t)
          }), t.graphicName === "rectangle") {
            const c = n.getImage(1), u = document.createElement("canvas");
            u.width = c.width, u.height = c.height;
            const h = u.getContext("2d"), f = c.getContext("2d");
            h && f && (h.drawImage(c, 0, 0, c.width, c.height, c.width / 4, 0, c.width / 2, c.height), f.clearRect(0, 0, c.width, c.height), f.drawImage(u, 0, 0));
          }
          break;
        }
        case "lightning":
        case "church":
          n = new ba({
            glyph: this.getGlyph(t.graphicName),
            radius: a,
            rotation: Math.PI,
            stroke: this.stroke(t),
            fill: this.fill(t)
          });
          break;
        default:
          n = new dt({
            radius: a,
            stroke: this.stroke(t),
            fill: this.fill(t)
          });
          break;
      }
    }
    n && e.setImage(n);
  }
  /**
   * Create a Text style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Text object or undefined
   */
  text(e) {
    if (!e.label) return;
    const t = {
      font: (e.fontWeight || "") + " " + (e.fontSize || "12") + "px " + (e.fontFamily || "Sans-serif"),
      text: e.label || "",
      rotation: e.labelRotation || 0,
      textAlign: "left",
      textBaseline: "middle",
      offsetX: e.labelXOffset || 0,
      offsetY: -(e.labelYOffset || 0),
      stroke: new re({
        color: e.labelOutlineColor || "#fff",
        width: Number(e.labelOutlineWidth) || 2
      }),
      fill: new xe({
        color: e.fontColor || "#000"
      })
    };
    return new Ft(t);
  }
  /**
   * This function was using Cordova to load symbols from the file system.
   * Instead of calling Capacitor here (we want to separate the logic)
   * We're passing the directory list as parameter
   * 
   * To understand more about that, see the ol/style/Collaboratif.js file, line 263
   * @param entries Array of symbol cache entries with name and nativeURL
   */
  loadSymbolCache(e) {
    this._cacheLoading = [];
    for (let t = 0, r; r = e[t]; t++)
      this._symbolCache[r.name] = r.nativeURL;
  }
  /** Get ol style function as defined in featureType
   * 
   * @param featureType Feature type configuration with style rules
   * @param cache Cache configuration (unused for now)
   * @param options Additional options including directoryList for symbol cache
   * @returns A style function that takes (feature, resolution) and returns Style or Style[]
   */
  getFeatureStyleFn(e, t, r) {
    e = e || {};
    const n = new ee({
      text: new Ft({
        text: "›",
        font: "bold 25px Arial"
      })
    });
    return (i, a) => {
      var E, y, C, g;
      if (r != null && r.directoryList && this.loadSymbolCache(r.directoryList), !e.style && e.name) {
        const d = e.name;
        if (typeof this.presets[d] == "function") {
          const x = this.presets[d](e);
          if (typeof x == "function")
            return x(i);
        }
      }
      let o = e.style;
      if ((E = e.style) != null && E.children) {
        const d = i.getProperties();
        delete d.geometry;
        for (let x = 0; x < e.style.children.length; x++) {
          const A = e.style.children[x];
          if (Va(A), (y = A.mongo) != null && y.matches && A.mongo.matches(d)) {
            o = A;
            break;
          }
        }
      }
      const l = this.formatFeatureStyle(o || {}, i), c = e.symbo_attribute && (o != null && o.name) ? `${o.name}/${i.get(e.symbo_attribute.name)}` : o && cn(o.externalGraphic) ? o.externalGraphic : void 0;
      c && o && (l.radius = 5, l.img = this.getSymbolURI(
        e,
        c,
        Number(o.graphicWidth) || 16,
        Number(o.graphicHeight) || 16,
        i,
        o.uri
      ) ?? void 0);
      const u = new ee({}), h = this.text(l);
      h && u.setText(h), this.setImage(u, l, i);
      const f = this.fill(l);
      f && u.setFill(f);
      const p = this.stroke(l);
      p && u.setStroke(p);
      let m;
      if ((C = e.style) != null && C.directionField)
        try {
          m = JSON.parse(e.style.directionField);
        } catch {
          m = null, console.log("bad json direction field for style " + e.style.name);
        }
      if (a < 2 && m && typeof m == "object" && "attribute" in m && "sensDirect" in m && "sensInverse" in m) {
        const d = m.sensDirect, x = m.sensInverse, A = (F, b) => {
          if (F !== d && F !== x) return 0;
          const R = b instanceof $n ? b.getLineString(0) : b;
          if (!R) return 0;
          const w = R.getCoordinates();
          let S = 0, B = 0, D = 0;
          const N = R.getLength();
          for (let U = 0; U < w.length - 1 && (S = w[U + 1][0] - w[U][0], B = w[U + 1][1] - w[U][1], D += Math.sqrt(S * S + B * B), !(D >= N / 2)); U++)
            ;
          return F === d ? -Math.atan2(B, S) : Math.PI - Math.atan2(B, S);
        }, _ = i.get(m.attribute);
        if (_ === d || _ === x) {
          const F = i.getGeometry();
          if (F && (F instanceof Fa || F instanceof $n)) {
            const b = A(_, F);
            return (g = n.getText()) == null || g.setRotation(b), [u, n];
          }
        }
      }
      return u;
    };
  }
  /**
   * Return the urls of the symbols used for a feature type
   * @param featureType the feature type configuration
   * @returns Record mapping symbol names to their URIs
   */
  getUrls(e) {
    const t = {};
    if (ln(e.style, t), e.styles)
      for (const r of e.styles)
        ln(r, t);
    return t;
  }
  /** 
   * Get image uri and save to cache if not already done
   * 
   * Note: This method requires a properly initialized UserManager to load symbols from API.
   * If UserManager is not provided, it will return null and features will use fallback styling.
   * 
   * @param featureType Feature type configuration
   * @param name Symbol name
   * @param width Symbol width
   * @param height Symbol height
   * @param feature The feature being styled
   * @param fallbackUri Direct style URI used when the symbol is not listed in `styles`
   * @returns Symbol URI from cache, or null if not yet loaded
   */
  getSymbolURI(e, t, r, n, i, a) {
    var p, m;
    const o = t.replace(/\//g, "_") + "_" + r + "x" + n;
    if (this._symbolCache[o])
      return this._symbolCache[o];
    const c = this.getUrls(e)[t] ?? a;
    if (!c)
      return console.warn("Symbol not found in feature type styles:", t), null;
    if (this._cacheLoading.indexOf(o) !== -1) return null;
    const u = (p = this._userManager) == null ? void 0 : p.apiClient, h = (m = u == null ? void 0 : u.getDocument) == null ? void 0 : m.bind(u);
    if (typeof h != "function")
      return console.warn("UserManager not initialized - cannot load symbol from API"), null;
    const f = `${c}${c.includes("?") ? "&" : "?"}width=${r}&height=${n}`;
    return this._cacheLoading.push(o), h(f).then((E) => {
      const y = Qa(E);
      if (!y) {
        console.warn("Failed to convert symbol response to an image URL", t);
        return;
      }
      this._symbolCache[o] = y, i.changed();
    }).catch((E) => {
      console.warn("Failed to load symbol from API", E);
    }).finally(() => {
      const E = this._cacheLoading.indexOf(o);
      E !== -1 && this._cacheLoading.splice(E, 1);
    }), null;
  }
  /**
   * Get the glyph for a graphic
   * @param graphicName the name of the graphic
   * @returns the glyph for the graphic
   */
  getGlyph(e) {
    switch (e) {
      case "lightning":
        return "fa-bolt";
      case "church":
        return "fa-venus";
      default:
        return null;
    }
  }
}
class Cn extends Qt {
  constructor(e, t) {
    t = t || {};
    const r = Cn._computeCollabVectorLayerOptions(e);
    super(r), this.set("name", `${e.database}:${e.name}`), t.client = e.client, t.cacheNamespace = e.cacheNamespace, t.legacyCacheFallback = e.legacyCacheFallback, (e.cacheUrl || e.cacheNamespace) && (t.cacheUrl = e.cacheUrl, e.cacheUrl && t.online == null && (t.online = !1), this.set("cache", !0)), this.createSource(e, t, e.table);
  }
  /**
   * Computes the options for the CollabVector layer
   */
  static _computeCollabVectorLayerOptions(e) {
    return {
      database: e.database,
      name: e.name,
      url: e.url,
      renderMode: e.renderMode || Ua.COLLAB_VECTOR_RENDER_MODE
    };
  }
  /**
   * Creates the source for the CollabVector layer
   */
  createSource(e, t, r) {
    const n = {
      ...t,
      table: r,
      client: t.client || e.client
    }, i = n;
    !i.userManager && i.client && (i.userManager = {
      apiClient: i.client
    }), e.checkSourceOptions && e.checkSourceOptions(this, n, r);
    const a = new Zt(n);
    this.setSource(a), this.set("title", r.title);
    const o = new yi(), l = r.maxZoomLevel, c = r.minZoomLevel;
    if (l && l < 20 && (o.setZoom(l), this.setMinResolution(o.getResolution() ?? 0)), (c || c === 0) && (o.setZoom(Math.max(c, 4)), this.setMaxResolution((o.getResolution() ?? 0) + 1)), r.style && r.style.children) {
      for (const u of r.style.children)
        if (typeof u.condition == "string")
          try {
            u.condition = JSON.parse(u.condition);
          } catch {
          }
    }
    if (r.styles && r.styles.length) {
      let u = !1;
      r.styles.forEach((h) => {
        r.style && h.id === r.style.id && (u = !0), h.children && h.children.forEach((f) => {
          if (typeof f.condition == "string")
            try {
              f.condition = JSON.parse(f.condition);
            } catch {
            }
        });
      }), !u && r.style && r.styles.unshift(r.style);
    }
    if (!e.style) {
      const u = vn.getFeatureStyleFunction(r, e.cacheUrl ?? "", n);
      this.setStyle(u);
    }
    this.dispatchEvent({ type: "ready", source: a });
  }
  /**
   * Get the table for the CollabVector layer
   */
  getTable() {
    const e = this.getSource();
    if (this.isReady() && e) return e.table;
  }
  /**
   * Get the style for features in this layer
   */
  getFeatureStyle() {
    const e = this.getSource();
    if (this.isReady() && e) return e.table.style;
  }
  /**
   * Check if the layer is ready (has a source with a table)
   */
  isReady() {
    const e = this.getSource();
    return e !== null && e.table !== void 0;
  }
  /**
   * Set the online/offline mode for the layer
   */
  setOnline(e) {
    const t = this.getSource();
    t && (t.localProperties.online = e, typeof t.reload == "function" ? t.reload() : t.refresh());
  }
}
const Kn = new rr();
class vu {
  constructor(e, t) {
    this.storage = e, this.apiClient = t, this.CACHE_PREFIX = "vector:cache:";
  }
  getLayerCacheNamespace(e, t) {
    var n;
    const r = (n = t.cacheNamespace) == null ? void 0 : n.trim();
    return r ? Kn.sanitizeFileName(r) : Kn.sanitizeFileName(
      `vector-cache-${e.id_guichet}-${e.id}-${t.database}-${t.name}`
    );
  }
  getLayerFeatureCacheKeys(e, t) {
    var c, u;
    const n = ((c = t.cacheNamespace) == null ? void 0 : c.trim()) ? [this.getLayerCacheNamespace(e, t)] : [`${t.database}:${t.name}`], i = this.getCacheExtents(e), a = Number((u = t.table) == null ? void 0 : u.tileZoomLevel);
    if (!Number.isFinite(a) || i.length === 0)
      return n;
    const o = En({
      tileSize: Je.TILE_SIZE,
      minZoom: a,
      maxZoom: a
    }), l = /* @__PURE__ */ new Set();
    for (const h of n)
      l.add(h);
    for (const h of i) {
      const [f, p, m, E] = h, y = o.getTileCoordForCoordAndZ([f, p], a), C = o.getTileCoordForCoordAndZ([m, E], a), g = Math.min(y[1], C[1]), d = Math.max(y[1], C[1]), x = Math.min(y[2], C[2]), A = Math.max(y[2], C[2]);
      for (let _ = g; _ <= d; _++)
        for (let F = x; F <= A; F++)
          for (const b of n)
            l.add(`${b}:${[a, _, F].join("-")}`);
    }
    return Array.from(l);
  }
  /**
   * Get the cache layers for a given community
   * 
   * @migrated from getLayers function
   * 
   * @param community: Community object with id
   * @returns LayerGroup[]
   */
  async getCacheLayers(e) {
    const t = [], r = await this.storage.listMetadata(this.CACHE_PREFIX);
    for (const n of r)
      if (n.id_guichet === e.id) {
        const i = new wa({
          properties: {
            title: n.nom,
            name: n.id_guichet + "-" + n.id,
            vectorCache: n,
            baseLayer: !0
          }
        });
        for (const a of n.layers)
          if (a.table) {
            const o = new Cn(a, {
              // Source options for the collaborative vector
              cache: this.storage
            });
            i.getLayers().push(o);
          }
        if (i.getLayers().getLength()) {
          t.push(i);
          const a = new Qt({
            properties: {
              title: "extent",
              displayInLayerSwitcher: !1
            },
            source: new er()
          });
          i.getLayers().push(a);
        }
      }
    return t;
  }
  /**
   * Delete a cache
   * @migrated from removeCache function
   * 
   * @param id: Cache id
   */
  async deleteCache(e) {
    const t = this.CACHE_PREFIX + e, r = await this.storage.getMetadata(t);
    if (r) {
      if (r.layers)
        for (const n of r.layers)
          try {
            const i = this.getLayerFeatureCacheKeys(r, n);
            for (const a of i)
              await this.storage.deleteFeatures(a);
          } catch (i) {
            console.error(`Failed to delete features for layer ${n.name}:`, i);
          }
      await this.storage.deleteMetadata(t);
    }
  }
  /**
   * Add a map in cache
   * @param name 
   * @param layers 
   */
  async addCache(e, t) {
    if (!t.length) return;
    const r = (await this.apiClient.getUser()).data;
    if (!r)
      throw new Error("User not found");
    const n = r.communities.find((h) => h.active === !0);
    if (!n)
      throw new Error("Guichet not found");
    const i = await this.storage.listMetadata(this.CACHE_PREFIX), a = Math.max(0, ...i.map((h) => parseInt(h.id))), o = String(a + 1), l = t.map((h) => ({
      ...h,
      cacheNamespace: this.getLayerCacheNamespace(
        { id: o, id_guichet: n.id },
        h
      )
    })), c = /* @__PURE__ */ new Date(), u = {
      id: o,
      name: e,
      type: "vector",
      created: c,
      modified: c,
      size: 0,
      id_guichet: n.id,
      nom: e,
      layers: l,
      extent: xi(),
      projection: "EPSG:3857"
      // see if it's correct
    };
    await this.storage.saveMetadata(this.CACHE_PREFIX + u.id, u);
  }
  getCacheExtents(e) {
    return Array.isArray(e.extents) && e.extents.length > 0 ? e.extents.filter((t) => this.isValidExtent(t)) : e.extent && this.isValidExtent(e.extent) ? [e.extent] : [];
  }
  isValidExtent(e) {
    return e.every(Number.isFinite) && e[0] <= e[2] && e[1] <= e[3];
  }
}
const eo = new rr(), Xn = /* @__PURE__ */ new Set([
  "service",
  "request",
  "version",
  "typenames",
  "typename",
  "srsname",
  "bbox",
  "count",
  "maxfeatures"
]), It = /* @__PURE__ */ new Set(["cql_filter", "filter"]);
class Vt extends er {
  constructor(e, t) {
    const r = Vt._computeWFSSourceOptions(e, t);
    super(r), this.localProperties = {}, this.requestProperties = {}, this._tileLoading = 0, this._done = !1, this.localProperties = r.computedLocalProperties, this._initWFSSource(e);
  }
  /**
   * Compute VectorSource options from WFS options
   */
  static _computeWFSSourceOptions(e, t) {
    const r = e || {}, n = {
      tiled: !1,
      layerExtraParams: []
    };
    let i = r.strategy;
    if (!i && r.tileZoom) {
      const a = r.tileZoom ?? r.minZoom ?? kt.MIN_ZOOM_INCREASE, o = En({
        tileSize: r.tileSize || kt.TILE_SIZE,
        minZoom: a,
        maxZoom: a
      });
      i = gi(o), n.tileGrid = o, n.table = r.table, n.tiled = !0, n.maxReload = r.maxReload;
    } else i || (i = mi);
    return t && t.loadCache && (n.loadCache = t.loadCache), t && t.saveCache && (n.saveCache = t.saveCache), t && t.loadFeatures && t.saveFeatures && (n.featureCache = t), n.useCacheWhenOnline = r.useCacheWhenOnline !== !1, {
      computedLocalProperties: n,
      strategy: i,
      features: new Ge(),
      attributions: r.attribution,
      useSpatialIndex: !0,
      wrapX: r.wrapX
    };
  }
  /**
   * Completes WFS-specific initialization after VectorSource setup
   */
  _initWFSSource(e) {
    var o;
    const t = e || {}, r = t.geoservice || {};
    this.localProperties.proxy = t.proxy, this.localProperties.featureFilter = t.filter;
    const n = this._parseLayerSpec(r.layers || ""), i = this._resolveInitialTypeNames(r, n.typeNames);
    this.localProperties.layerExtraParams = n.extraParams;
    const a = r.url || "";
    this.set("url", a), this.set("cache", `${eo.getEscapedDomainFromURL(a)}/${r.layers || ""}`), this.set("once", t.once), this.set("typename", i || r.layers || ""), this.set("version", r.version || "2.0.0"), this.set("projection", t.srs || kt.SRS_NAME), this.set("id", ((o = r.input_mask) == null ? void 0 : o.id) ?? -1), this.set("maxFeatures", t.maxFeatures), this.set("format", r.format || "GeoJSON"), this.setAuthentication(t.username, t.password, t.accessToken, t.tokenType), this._configureLoader();
  }
  _configureLoader() {
    this.setLoader((e, t, r, n, i) => {
      this._loaderFn(e, t, r, n, i);
    });
  }
  async _loaderFn(e, t, r, n, i) {
    if (this._done && this.get("once")) {
      n && n([]);
      return;
    }
    this._done = !0;
    const a = this._projectionToCode(r), o = String(this.get("projection") || kt.SRS_NAME), l = Ei(e, a, o), c = this.localProperties.tileGrid ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(e, t) : null;
    this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading });
    try {
      let u, h = !1;
      this.localProperties.useCacheWhenOnline !== !1 && (u = await this._loadFromCache(l, t, c)), u === void 0 && (u = await this._loadFromService(l, o), h = !0, this.localProperties.saveCache && await Promise.resolve(this.localProperties.saveCache(u, l, t, c)));
      const p = this._readWFSResponse(u, o, a);
      h && await this._saveFeaturesToFeatureCache(l, t, c, p), p.length && this.addFeatures(p), this.dispatchEvent({ type: "loadend", remains: --this._tileLoading }), n && n(p);
    } catch (u) {
      const h = (u == null ? void 0 : u.name) === "AbortError" ? "abort" : "error";
      this._handleWFSLoadError(h, u), i && i();
    }
  }
  async _loadFromCache(e, t, r) {
    const n = {
      tileCoord: r,
      extent: e,
      resolution: t
    };
    if (this.localProperties.loadCache)
      try {
        const o = await this.localProperties.loadCache(n);
        if (o !== void 0)
          return o;
      } catch (o) {
        if (o === "obsolete")
          try {
            const l = await this.localProperties.loadCache({
              ...n,
              obsolete: !0
            });
            if (l !== void 0)
              return l;
          } catch {
          }
      }
    const i = this.localProperties.featureCache;
    if (!i)
      return;
    const a = this._buildFeatureCacheKey(e, t, r);
    try {
      const o = await i.loadFeatures(a);
      if (Array.isArray(o) && o.length > 0)
        return o;
    } catch {
    }
  }
  async _saveFeaturesToFeatureCache(e, t, r, n) {
    const i = this.localProperties.featureCache;
    if (!i || n.length === 0)
      return;
    const a = this._buildFeatureCacheKey(e, t, r);
    try {
      await i.saveFeatures(a, n);
    } catch {
    }
  }
  async _loadFromService(e, t) {
    const r = this._buildCurrentGeoservice(), n = this.localProperties.layerExtraParams || [], i = this._isGeoJSONFormat(), a = this._hasFilterParams(r, n, this.localProperties.featureFilter);
    let o = String(this.get("typename") || ""), l = await this._tryLoadWithTypeNames(
      o,
      r,
      n,
      e,
      t,
      i,
      a
    );
    if (!l.payload && l.error) {
      const c = this._extractUnknownFeatureTypeName(l.error.message);
      if (c) {
        const u = await this._resolveUnknownTypeNames(r, c);
        u && u !== o && (console.warn(
          `[WFSSource] Resolved unknown feature type "${c}" to "${u}".`
        ), o = u, l = await this._tryLoadWithTypeNames(
          o,
          r,
          n,
          e,
          t,
          i,
          a
        ));
      }
    }
    if (!l.payload)
      throw l.error || new Error("WFS request failed");
    return l.payload;
  }
  async _tryLoadWithTypeNames(e, t, r, n, i, a, o) {
    const l = this._getWfsRequestVariants(a, o), c = /* @__PURE__ */ new Set();
    let u;
    for (const h of l) {
      const p = this._buildWfsGetFeatureUrl(
        t,
        e,
        r,
        i,
        n,
        h
      ).toString();
      if (!c.has(p)) {
        c.add(p);
        try {
          return { payload: await this._fetchWfsPayload(p) };
        } catch (m) {
          u = m instanceof Error ? m : new Error(String(m));
        }
      }
    }
    return {
      error: u || new Error("WFS request failed")
    };
  }
  async _fetchWfsPayload(e) {
    const t = new AbortController(), r = setTimeout(() => t.abort(), 3 * 60 * 1e3);
    try {
      const n = await fetch(e, {
        method: "GET",
        headers: this._getAuthHeaders(),
        cache: "no-cache",
        signal: t.signal
      }), i = await n.text(), a = this._getWfsExceptionMessage(i);
      if (!n.ok)
        throw new Error(`WFS ${n.status}: ${a || n.statusText}`);
      if (a)
        throw new Error(`WFS Exception: ${a}`);
      return i;
    } finally {
      clearTimeout(r);
    }
  }
  _getAuthHeaders() {
    const e = {
      "cache-control": "no-cache"
    }, { authorization: t, username: r, password: n } = this.requestProperties;
    return t ? e.Authorization = String(t) : r && n && (e.Authorization = `Basic ${btoa(`${r}:${n}`)}`), e;
  }
  /**
   * Read WFS response and return features to add
   */
  _readWFSResponse(e, t, r) {
    if (this._isFeatureArray(e))
      return e;
    const n = this._parseFeaturesFromPayload(e, t, r);
    if (!n.length)
      return [];
    const i = [], a = typeof this.get("id") == "string" && this.get("id") ? String(this.get("id")) : void 0, o = this.getFeatures(), l = /* @__PURE__ */ new Set();
    if (a)
      for (const u of o) {
        const h = u.get(a);
        h != null && l.add(String(h));
      }
    const c = /* @__PURE__ */ new Set();
    for (const u of o) {
      const h = u.getId();
      h != null && c.add(String(h));
    }
    for (const u of n) {
      const h = u.getGeometry();
      if (!h)
        continue;
      const f = h.getExtent();
      if (!Number.isFinite(f[0]) || !Number.isFinite(f[1]) || !Number.isFinite(f[2]) || !Number.isFinite(f[3]))
        continue;
      if (a) {
        const m = u.get(a);
        if (m != null) {
          const E = String(m);
          if (l.has(E))
            continue;
          l.add(E);
        }
      }
      const p = u.getId();
      if (p != null) {
        const m = String(p);
        if (c.has(m))
          continue;
        c.add(m);
      }
      i.push(u);
    }
    return i;
  }
  _parseFeaturesFromPayload(e, t, r) {
    var c, u, h;
    const n = this._isGeoJSONFormat();
    if (e == null)
      return [];
    if (typeof e == "object" && e !== null && !(e instanceof Document) && (n || this._looksLikeGeoJSONPayload(e)))
      return new St().readFeatures(e, {
        dataProjection: t,
        featureProjection: r
      });
    const a = (typeof e == "string" ? e : String(e)).trim();
    if (!a)
      return [];
    const o = this._getWfsExceptionMessage(a);
    if (o)
      throw new Error(`WFS Exception: ${o}`);
    if (this._isLikelyJsonPayload(a))
      try {
        const f = JSON.parse(a);
        return new St().readFeatures(f, {
          dataProjection: t,
          featureProjection: r
        });
      } catch {
      }
    let l = new Wn({ gmlFormat: new Da() }).readFeatures(a, {
      dataProjection: t,
      featureProjection: r
    });
    return l.length && (!((c = l[0]) != null && c.getGeometry()) || !((h = (u = l[0]) == null ? void 0 : u.getGeometry()) != null && h.getExtent())) && (l = new Wn({ gmlFormat: new Ra() }).readFeatures(a, {
      dataProjection: t,
      featureProjection: r
    })), l;
  }
  _buildCurrentGeoservice() {
    return {
      id: 0,
      title: "",
      url: String(this.get("url") || ""),
      type: "WFS",
      layers: String(this.get("typename") || ""),
      version: String(this.get("version") || "2.0.0"),
      format: String(this.get("format") || "")
    };
  }
  _isFeatureArray(e) {
    return Array.isArray(e) && e.every((t) => t instanceof ft);
  }
  _buildFeatureCacheKey(e, t, r) {
    const i = String(this.get("cache") || this.get("typename") || "wfs").replace(/[^a-zA-Z0-9._-]+/g, "_");
    if (r && r.length > 0)
      return `wfs:${i}:tile:${r.join("-")}`;
    const a = e.map((l) => this._normalizeCacheNumber(l)).join("_"), o = this._normalizeCacheNumber(t);
    return `wfs:${i}:bbox:${a}:res:${o}`;
  }
  _normalizeCacheNumber(e) {
    return Number.isFinite(e) ? e.toFixed(2) : "0";
  }
  _buildWfsGetFeatureUrl(e, t, r, n, i, a) {
    const o = new URL(e.url), l = new URL(`${o.origin}${o.pathname}`), c = /* @__PURE__ */ new Map(), u = (f, p) => {
      const m = f.toLowerCase();
      if (Xn.has(m) || m === "outputformat" || !a.includeFilters && It.has(m)) return;
      const E = c.get(m);
      E ? E.values.push(p) : c.set(m, { key: f, values: [p] });
    };
    o.searchParams.forEach((f, p) => {
      u(p, f);
    });
    for (const [f, p] of r)
      u(f, p);
    if (a.includeFilters) {
      const f = this._serializeFeatureFilter();
      f && !c.has(f.key.toLowerCase()) && c.set(f.key.toLowerCase(), {
        key: f.key,
        values: [f.value]
      });
    }
    for (const { key: f, values: p } of c.values())
      for (const m of p)
        l.searchParams.append(f, m);
    l.searchParams.set("service", "WFS"), l.searchParams.set("version", e.version || "2.0.0"), l.searchParams.set("request", "GetFeature"), l.searchParams.set("typeNames", t), l.searchParams.set("srsName", n), a.includeBbox && l.searchParams.set("bbox", `${i.join(",")},${n}`);
    const h = Number(this.get("maxFeatures"));
    return Number.isFinite(h) && h > 0 && (l.searchParams.set("count", String(h)), l.searchParams.set("maxFeatures", String(h))), this._isGeoJSONFormat() && a.includeOutputFormat && l.searchParams.set("outputFormat", "application/json"), l;
  }
  _serializeFeatureFilter() {
    const e = this.localProperties.featureFilter;
    if (typeof e == "string") {
      const r = e.trim();
      return r ? { key: "cql_filter", value: r } : void 0;
    }
    if (!e || typeof e != "object")
      return;
    const t = [];
    for (const [r, n] of Object.entries(e))
      n !== void 0 && (n === null ? t.push(`${r} IS NULL`) : t.push(`${r}=${this._toCqlLiteral(n)}`));
    if (t.length)
      return {
        key: "cql_filter",
        value: t.join(" AND ")
      };
  }
  _toCqlLiteral(e) {
    return typeof e == "number" && Number.isFinite(e) ? String(e) : typeof e == "boolean" ? e ? "TRUE" : "FALSE" : `'${String(e).replace(/'/g, "''")}'`;
  }
  _getWfsRequestVariants(e, t) {
    const r = [];
    return t ? (r.push({
      name: "filter-no-bbox",
      includeOutputFormat: e,
      includeFilters: !0,
      includeBbox: !1
    }), e && r.push({
      name: "filter-no-bbox-no-output-format",
      includeOutputFormat: !1,
      includeFilters: !0,
      includeBbox: !1
    }), r.push({
      name: "no-filter-with-bbox",
      includeOutputFormat: e,
      includeFilters: !1,
      includeBbox: !0
    }), e && r.push({
      name: "no-filter-with-bbox-no-output-format",
      includeOutputFormat: !1,
      includeFilters: !1,
      includeBbox: !0
    }), r.push({
      name: "no-filter-no-bbox",
      includeOutputFormat: e,
      includeFilters: !1,
      includeBbox: !1
    }), e && r.push({
      name: "no-output-format-no-filter",
      includeOutputFormat: !1,
      includeFilters: !1,
      includeBbox: !1
    })) : (r.push({
      name: "default",
      includeOutputFormat: e,
      includeFilters: !0,
      includeBbox: !0
    }), e && r.push({
      name: "no-output-format",
      includeOutputFormat: !1,
      includeFilters: !0,
      includeBbox: !0
    })), r;
  }
  _hasFilterParams(e, t, r) {
    let n = !1;
    new URL(e.url).searchParams.forEach((a, o) => {
      It.has(String(o).toLowerCase()) && (n = !0);
    });
    const i = t.some(
      ([a]) => It.has(a.toLowerCase())
    );
    return n || i ? !0 : typeof r == "string" ? r.trim().length > 0 : r && typeof r == "object" ? Object.keys(r).length > 0 : !1;
  }
  _projectionToCode(e) {
    return typeof e == "string" ? e : e && typeof e.getCode == "function" ? e.getCode() : on;
  }
  _isGeoJSONFormat() {
    return String(this.get("format") || "").toLowerCase().includes("json");
  }
  _isLikelyJsonPayload(e) {
    const t = e.trim();
    return t.startsWith("{") || t.startsWith("[");
  }
  _looksLikeGeoJSONPayload(e) {
    if (!e || typeof e != "object")
      return !1;
    const t = e;
    return t.type === "FeatureCollection" || t.type === "Feature" || Array.isArray(t.features);
  }
  _getWfsExceptionMessage(e) {
    var r;
    const t = e.trim();
    if (t.startsWith("<"))
      try {
        const n = new DOMParser().parseFromString(t, "application/xml");
        if (n.querySelector("parsererror"))
          return;
        const i = n.getElementsByTagNameNS("*", "ExceptionText")[0] || n.getElementsByTagNameNS("*", "ServiceException")[0] || n.getElementsByTagNameNS("*", "Exception")[0];
        return ((r = i == null ? void 0 : i.textContent) == null ? void 0 : r.trim()) || void 0;
      } catch {
        return;
      }
  }
  _parseLayerSpec(e) {
    const t = e.trim();
    if (!t)
      return { typeNames: "", extraParams: [] };
    let r = t, n = "";
    if (r.includes("?")) {
      const [a, ...o] = r.split("?");
      r = a, n = o.join("?");
    }
    if (r.includes("&")) {
      const [a, ...o] = r.split("&");
      r = a, n = [n, o.join("&")].filter(Boolean).join("&");
    }
    const i = [];
    return new URLSearchParams(n).forEach((a, o) => {
      i.push([o, a]);
    }), {
      typeNames: r.trim(),
      extraParams: i
    };
  }
  _resolveInitialTypeNames(e, t) {
    var n;
    const r = (n = this._getTypeNamesFromGeoserviceUrl(e)) == null ? void 0 : n.trim();
    return t ? !t.includes(":") && (r != null && r.includes(":")) ? r : t : r || e.layers || "";
  }
  _getTypeNamesFromGeoserviceUrl(e) {
    const t = new URL(e.url);
    return this._getQueryParamCaseInsensitive(t.searchParams, "typeNames") || this._getQueryParamCaseInsensitive(t.searchParams, "typeName") || void 0;
  }
  _getQueryParamCaseInsensitive(e, t) {
    const r = t.toLowerCase();
    let n = null;
    return e.forEach((i, a) => {
      n === null && String(a).toLowerCase() === r && (n = i);
    }), n;
  }
  _extractUnknownFeatureTypeName(e) {
    const t = e.match(/Feature type\s*:?\s*([^\s]+)\s+unknown/i);
    return t == null ? void 0 : t[1];
  }
  async _resolveUnknownTypeNames(e, t) {
    try {
      const r = this._buildWfsGetCapabilitiesUrl(e), n = await fetch(r.toString(), {
        headers: this._getAuthHeaders()
      });
      if (!n.ok)
        return;
      const i = await n.text(), a = this._parseWfsFeatureTypeNamesFromCapabilities(i);
      return this._selectFallbackTypeNames(t, a);
    } catch {
      return;
    }
  }
  _buildWfsGetCapabilitiesUrl(e) {
    const t = new URL(e.url), r = new URL(`${t.origin}${t.pathname}`);
    return t.searchParams.forEach((n, i) => {
      const a = String(i).toLowerCase();
      Xn.has(a) || It.has(a) || a !== "outputformat" && r.searchParams.append(i, n);
    }), r.searchParams.set("service", "WFS"), r.searchParams.set("version", e.version || "2.0.0"), r.searchParams.set("request", "GetCapabilities"), r;
  }
  _parseWfsFeatureTypeNamesFromCapabilities(e) {
    const t = e.trim();
    if (!t.startsWith("<"))
      return [];
    const r = new DOMParser().parseFromString(t, "application/xml");
    if (r.querySelector("parsererror"))
      return [];
    const i = Array.from(r.getElementsByTagNameNS("*", "FeatureType")).map((a) => {
      var o, l;
      return ((l = (o = a.getElementsByTagNameNS("*", "Name")[0]) == null ? void 0 : o.textContent) == null ? void 0 : l.trim()) || "";
    }).filter((a) => a.length > 0);
    return Array.from(new Set(i));
  }
  _selectFallbackTypeNames(e, t) {
    if (e.includes(","))
      return;
    const r = t.find((a) => a === e);
    if (r)
      return r;
    if (e.includes(":")) {
      const a = e.split(":").pop();
      return a ? t.find((l) => l.endsWith(`:${a}`)) : void 0;
    }
    const n = t.filter(
      (a) => a.startsWith(`${e}:`) || a.endsWith(`:${e}`)
    );
    return n.length === 0 ? void 0 : n.length === 1 ? n[0] : n.find((a) => a.toLowerCase().endsWith(":epci")) || n[0];
  }
  setAuthentication(e, t, r, n = "Bearer") {
    const i = r == null ? void 0 : r.trim();
    if (i) {
      const a = (n == null ? void 0 : n.trim()) || "Bearer";
      this.requestProperties.authorization = `${a} ${i}`, delete this.requestProperties.username, delete this.requestProperties.password;
      return;
    }
    if (delete this.requestProperties.authorization, !e || !t) {
      delete this.requestProperties.username, delete this.requestProperties.password;
      return;
    }
    this.requestProperties.username = e, this.requestProperties.password = t;
  }
  getCachePath() {
    return String(this.get("cache") || "");
  }
  /**
   * Load features from cache (or service as fallback)
   */
  async loadFromCache(e, t, r) {
    await this._loaderFn(e, t, r);
  }
  /**
   * Handle WFS load error
   */
  _handleWFSLoadError(e, t) {
    const r = Math.max(0, --this._tileLoading);
    e !== "abort" ? this.dispatchEvent({ type: "loadend", error: t, status: e, remains: r }) : this.dispatchEvent({ type: "loadend", remains: r });
  }
  /**
   * Get the file cache name
   */
  getFileCacheName() {
    return this.get("once") ? `${this.get("cache")}.cache` : "";
  }
}
const Zn = "__report_transport_geometry__";
class Cu {
  constructor(e) {
    this._cluster = [], this._apiClient = e.client, this._eventManager = new tr(), this._cluster = [], this._cache = e.cache, this._communityId = e.communityId, this._loadClosed = e.loadClosed ?? !1;
  }
  /**
   *
   * @param feature - The feature to get the status style for
   * @returns The status style for the feature
   */
  getStatusStyle(e) {
    var t;
    if (e.get("status"))
      return ct[e.get("status")] || new ee({});
    if (e.get("features")) {
      const r = e.get("features").length;
      return r < 2 ? this.getStatusStyle(e.get("features")[0]) : (!this._cluster[r] && ct[Ye.Cluster] && (this._cluster[r] = ct[Ye.Cluster].clone(), (t = ct[Ye.Cluster].getImage()) == null || t.setRadius(Math.min(10, r / 2) + Te), this._cluster[r] = ct[Ye.Cluster].clone()), this._cluster[r]);
    } else
      return ct[Ye.Pending] || new ee({});
  }
  /**
   * Gets the cache key for reports based on community ID
   * @returns Cache key string
   */
  getCacheKey() {
    return `reports:${this._communityId || "default"}`;
  }
  /**
   * Builds a transport feature that keeps report.geometry as WKT text.
   * OpenLayers expects the feature geometry property to be an actual Geometry instance.
   */
  createTransportFeature(e) {
    const t = new ft();
    return t.setGeometryName(Zn), t.setProperties(e), t;
  }
  normalizeReportEntry(e) {
    if (e instanceof ft) {
      const t = e.getProperties();
      if (typeof t.geometry != "string")
        throw new TypeError('Report feature must expose a WKT string in the "geometry" property');
      return t;
    }
    if (typeof e.geometry != "string")
      throw new TypeError('Report must expose a WKT string in the "geometry" property');
    return e;
  }
  /**
   * Saves reports to cache
   * @param reports - Reports to cache
   */
  async saveToCache(e) {
    if (this._cache)
      try {
        const t = e.map((n) => this.createTransportFeature(n)), r = this.getCacheKey();
        await this._cache.saveFeatures(r, t);
      } catch (t) {
        console.error("Failed to save reports to cache:", t);
      }
  }
  /**
   * Loads reports from cache
   * @returns Cached reports or empty array
   */
  async loadFromCache() {
    if (!this._cache) return [];
    try {
      const e = this.getCacheKey();
      return (await this._cache.loadFeatures(e)).map((r) => {
        const n = { ...r.getProperties() };
        return delete n[Zn], n;
      });
    } catch (e) {
      return console.error("Failed to load reports from cache:", e), [];
    }
  }
  async loadFeatures(e, t) {
    if (e.length === 0)
      return [];
    const r = [], n = new Xt();
    return e.forEach((i) => {
      const a = this.normalizeReportEntry(i), o = n.readFeature(a.geometry, {
        dataProjection: "EPSG:4326",
        featureProjection: t
      });
      o && (o.setProperties({ report: this.createTransportFeature(a) }), r.push(o));
    }), r.length === 100 && this._eventManager.emit("overload"), r;
  }
  /**
   * Load reports from the server
   *
   * @param extent - The extent to load reports for
   * @param page - The page number to load
   * @param loadClosedReports - Whether to load closed reports (defaults to instance setting)
   * @returns The reports
   */
  async loadReports(e, t = 1, r) {
    var n;
    try {
      const i = await this._apiClient.getUser(), a = i == null ? void 0 : i.data, l = (n = (Array.isArray(a == null ? void 0 : a.communities) ? a.communities : []).find((y) => y.active === !0)) == null ? void 0 : n.id, c = r ?? this._loadClosed;
      !this._communityId && l && (this._communityId = l);
      const u = this._communityId ?? l, h = {
        box: e.join(","),
        limit: 100,
        page: t
      };
      typeof u == "number" && (h.communities = [u]);
      let f = Object.values(Ye);
      if (!c) {
        const y = Object.values(wi);
        f = f.filter((C) => !y.includes(C));
      }
      const p = await this._apiClient.getReports(h);
      let m = p.headers["content-range"].split("/"), E = m[0].split("-");
      if (p.status == 200 || p.status == 206 && E[1] === m[1]) {
        const y = p.data;
        return await this.saveToCache(y), y;
      } else if (p.status == 206) {
        t = t + 1;
        const C = (await this.loadReports(e, t, c)).concat(p.data);
        return await this.saveToCache(C), C;
      } else
        return console.warn("Failed to load reports from server, loading from cache"), await this.loadFromCache();
    } catch (i) {
      return console.error("Error loading reports:", i), await this.loadFromCache();
    }
  }
  async getReport(e) {
    throw new Error("Not implemented");
  }
}
const to = new rr();
class un extends Qt {
  constructor(e, t) {
    var l;
    e = e || {}, e.geoservice || (e.geoservice = {}), e.geoservice.input_mask || (e.geoservice.input_mask = {});
    const r = un._computeWFSLayerOptions(e);
    if (super(r), !((l = e.geoservice) != null && l.url)) {
      console.error("WFSLayer: geoservice.url is required");
      return;
    }
    this.cache = t, this.layerOptions = e, this.set("authentication", e.username), e.getCapabilities !== !1 ? this.getCapabilities(e) : this.createSource(e, this.cache);
    const n = new yi(), i = e.geoservice, a = i.maxZoom ?? i.max_zoom, o = i.minZoom ?? i.min_zoom;
    a && a < 20 && (n.setZoom(a), this.setMinResolution(n.getResolution() ?? 0)), (o || o === 0) && (n.setZoom(o), this.setMaxResolution(n.getResolution() ?? 0));
  }
  /**
   * Compute the options to pass to the super constructor of VectorLayer
   */
  static _computeWFSLayerOptions(e) {
    const t = to.getEscapedDomainFromURL(e.geoservice.url), r = e.geoservice.input_mask ? e.geoservice.input_mask.attributes : null;
    return {
      title: e.geoservice.title,
      description: e.geoservice.description,
      visible: e.visibility,
      opacity: e.opacity,
      name: `${t}:${e.geoservice.layers}`,
      style: e.style || un._createWFSStyle(r ?? {}),
      search: e.geoservice.input_mask ? e.geoservice.input_mask.searchAttribute : null,
      logo: e.logo
    };
  }
  async getCapabilities(e) {
    var l;
    const t = (l = this.layerOptions) == null ? void 0 : l.authentication, r = new URL(e.geoservice.url);
    r.searchParams.append("service", "WFS"), r.searchParams.append("request", "GetCapabilities");
    const n = {}, i = this.getAuthorizationHeader(e);
    i && (n.Authorization = i);
    const a = new AbortController(), o = setTimeout(() => a.abort(), 1e4);
    try {
      const c = await fetch(r.toString(), {
        headers: n,
        signal: a.signal
      });
      if (clearTimeout(o), !c.ok) {
        this.handleGetCapabilitiesError(
          c.status,
          new Error(`HTTP ${c.status}: ${c.statusText}`),
          c.statusText,
          e,
          t
        );
        return;
      }
      this.createSource(e, this.cache);
    } catch (c) {
      clearTimeout(o);
      const u = 0, h = c.name === "AbortError" ? "timeout" : "error";
      this.handleGetCapabilitiesError(
        u,
        c,
        h,
        e,
        t
      );
    }
  }
  getAuthorizationHeader(e) {
    var r, n;
    const t = (r = e.accessToken) == null ? void 0 : r.trim();
    if (t)
      return `${((n = e.tokenType) == null ? void 0 : n.trim()) || "Bearer"} ${t}`;
    if (e.username && e.password)
      return `Basic ${btoa(`${e.username}:${e.password}`)}`;
  }
  /**
   * Handle errors from getCapabilities request
   */
  handleGetCapabilitiesError(e, t, r, n, i) {
    var l;
    const a = !!(n.username && n.password);
    if (!!!((l = n.accessToken) != null && l.trim()) && (e === 0 && !a || e === 401 || e === 500) && typeof i == "function") {
      i(this, (c, u) => {
        c ? (n.username = c, this.set("authentication", n.username), n.password = u, this.getCapabilities(n)) : (this.createSource(n, this.cache), this.dispatchEvent({ type: "error", error: t, status: e, statusText: r }));
      });
      return;
    }
    if (this.cache)
      switch (e) {
        case 403:
        case 404:
        case 500:
        case 503:
          this.dispatchEvent({ type: "error", error: t, status: e, statusText: r });
          return;
      }
    console.warn("[WFSLayer] GetCapabilities failed, fallback to direct GetFeature loader:", t.message), this.createSource(n, this.cache), this.dispatchEvent({ type: "error", error: t, status: e, statusText: r });
  }
  createSource(e, t) {
    var n;
    const r = new Vt(e, t);
    r.localProperties.table = {
      attributes: ((n = e.geoservice.input_mask) == null ? void 0 : n.attributes) ?? {}
    }, this.setSource(r), setTimeout(() => this.dispatchEvent({ type: "ready", source: r }), 100), r.on("addfeature", (i) => {
      i.feature._layer = this;
    });
  }
  /**
   * Get the table for the WFS layer
   */
  getTable() {
    const e = this.getSource();
    if (e && e instanceof Vt) return e.localProperties.table;
  }
  /**
   * Create a WFS style function based on feature attributes
   */
  static _createWFSStyle(e) {
    const t = new xe({
      color: Oe.FILL_COLOR
    }), r = new re({
      color: Oe.STROKE_COLOR,
      width: Oe.STROKE_WIDTH
    }), n = [
      new ee({
        image: new dt({
          fill: t,
          stroke: r,
          radius: Oe.CIRCLE_RADIUS
        }),
        fill: t,
        stroke: r
      })
    ];
    if (!e || Object.keys(e).length === 0)
      return n;
    const i = {};
    for (const o in e)
      e[o].title && /^symb@/.test(e[o].title) && (i[e[o].title] = o);
    const a = (o) => i[o] || o;
    return (o) => {
      const l = o.wfsStyle;
      if (l)
        return l;
      if (!o.get(a("symb@sColor")))
        return n;
      const u = o.get(a("symb@fColor")) || Oe.FILL_COLOR, h = o.get(a("symb@fPattern"));
      let f;
      if (h) {
        const A = o.get(a("symb@pAngle")), _ = o.get(a("symb@pWidth")), F = o.get(a("symb@pSpace")), b = o.get(a("symb@pColor"));
        f = new vi({
          pattern: h,
          color: b || "transparent",
          fill: new xe({
            color: u
          }),
          size: _ || 2,
          spacing: F || 5,
          angle: A
        });
      } else
        f = new xe({ color: u });
      let p;
      const m = o.get(a("symb@label"));
      if (m) {
        const A = o.get(a("symb@lColor")) || Oe.LABEL_COLOR, _ = o.get(a("symb@lsColor")) || Oe.LABEL_STROKE_COLOR, F = o.get(a("symb@lSize")) || Oe.LABEL_SIZE;
        p = new Ft({
          text: String(m),
          stroke: new re({
            color: _,
            width: Oe.LABEL_STROKE_WIDTH
          }),
          fill: new xe({
            color: A
          }),
          overflow: !1,
          font: `${F}px sans-serif`
        });
      }
      const E = o.get(a("symb@sColor")) || Oe.STROKE_COLOR, y = o.get(a("symb@sWidth")) || Oe.STROKE_WIDTH, C = o.get(a("symb@sDash")), g = C ? C.split(",").map((A) => parseFloat(A)) : void 0, d = new re({
        color: E,
        width: y,
        lineDash: g && g.length > 1 ? g : void 0
      }), x = [
        new ee({
          image: new dt({
            fill: t,
            stroke: r,
            radius: Oe.CIRCLE_RADIUS
          }),
          text: p,
          fill: f,
          stroke: d
        })
      ];
      return o.wfsStyle = x, x;
    };
  }
}
function wn(s) {
  return s && typeof s == "object" && !Array.isArray(s) ? s : null;
}
function Be(s) {
  return typeof s == "string" && s.trim().length > 0 ? s : void 0;
}
function Et(s) {
  if (typeof s == "number" && Number.isFinite(s))
    return s;
  if (typeof s == "string" && s.trim().length > 0) {
    const e = Number(s);
    return Number.isFinite(e) ? e : void 0;
  }
}
function ht(s) {
  if (typeof s == "boolean")
    return s;
  if (typeof s == "number") {
    if (s === 1) return !0;
    if (s === 0) return !1;
  }
  if (typeof s == "string") {
    const e = s.trim().toLowerCase();
    if (e === "true" || e === "1") return !0;
    if (e === "false" || e === "0") return !1;
  }
}
function ro(s) {
  const e = {};
  if (Array.isArray(s)) {
    for (const r of s) {
      const n = Vn(r);
      n && (e[n.name] = n);
    }
    return e;
  }
  const t = wn(s);
  if (!t)
    return e;
  for (const r of Object.values(t)) {
    const n = Vn(r);
    n && (e[n.name] = n);
  }
  return e;
}
function Vn(s) {
  const e = wn(s);
  if (!e)
    return null;
  const t = Be(e.name);
  if (!t)
    return null;
  const r = Be(e.type) ?? "string", n = {
    ...e,
    name: t,
    type: r
  }, i = Be(e.title);
  i !== void 0 && (n.title = i);
  const a = ht(e.required);
  a !== void 0 && (n.required = a);
  const o = ht(e.editable);
  o !== void 0 && (n.editable = o);
  const l = ht(e.searchable);
  l !== void 0 && (n.searchable = l);
  const c = Be(e.crs);
  return c !== void 0 && (n.crs = c), "default_value" in e && !("defaultValue" in n) && (n.defaultValue = e.default_value), n;
}
function no(s) {
  const e = wn(s) ?? {}, t = Et(e.databaseId ?? e.database_id ?? e.database) ?? 0, r = Be(e.database_name ?? e.database ?? e.dbname) ?? (t > 0 ? String(t) : ""), n = {
    ...e,
    id: Et(e.id) ?? 0,
    database: r,
    databaseId: t,
    name: Be(e.name ?? e.table_name) ?? "",
    title: Be(e.title ?? e.name ?? e.table_name) ?? "",
    wfs: Be(e.wfs ?? e.wfs_url) ?? "",
    geometryName: Be(e.geometryName ?? e.geometry_name) ?? "geometry",
    columns: ro(e.columns)
  }, i = Be(e.idName ?? e.id_name);
  i !== void 0 && (n.idName = i);
  const a = Be(e.description);
  a !== void 0 && (n.description = a);
  const o = Be(e.projection);
  o !== void 0 && (n.projection = o);
  const l = Et(e.minZoomLevel ?? e.min_zoom_level);
  l !== void 0 && (n.minZoomLevel = l);
  const c = Et(e.maxZoomLevel ?? e.max_zoom_level);
  c !== void 0 && (n.maxZoomLevel = c);
  const u = ht(e.searchable);
  u !== void 0 && (n.searchable = u);
  const h = ht(e.editable);
  h !== void 0 && (n.editable = h);
  const f = ht(e.readOnly ?? e.read_only);
  f !== void 0 && (n.readOnly = f);
  const p = Et(e.tileZoomLevel ?? e.tile_zoom_level);
  p !== void 0 && (n.tileZoomLevel = p);
  const m = Be(e.docURI ?? e.doc_uri);
  return m !== void 0 && (n.docURI = m), n;
}
class wu {
  constructor(e) {
    this.apiClient = e.apiClient, this.storage = e.storage, this._eventManager = new tr();
  }
  /**
   * Event subscription methods
   */
  on(e, t) {
    this._eventManager.on(e, t);
  }
  off(e, t) {
    this._eventManager.off(e, t);
  }
  once(e, t) {
    this._eventManager.once(e, t);
  }
  emit(e, t) {
    this._eventManager.emit(e, t);
  }
  /**
   * Get a user
   * Call getCommunity for each community in the user's communities_member array
   * and return the user with the communities
   * @returns User
   */
  async getUser() {
    let t = (await this.apiClient.getUser()).data;
    t.communities_member = t.communities_member || [];
    const r = (await this.apiClient.getCommunities()).data;
    return t.communities_member.map(
      (n) => this.apiClient.getCommunity(n.community_id)
    ), t.communities = r.map((n, i) => {
      var a, o;
      return {
        ...n,
        profile: (o = (a = t.communities_member) == null ? void 0 : a[i]) == null ? void 0 : o.profile
        // profile is a key
      };
    }), t;
  }
  async checkUserInfo() {
  }
  async getCommunities() {
    return (await this.getUser()).communities;
  }
  /**
   * community = groupe = guichet
   * @returns The active community or null if not found
   */
  async getActiveCommunity() {
    return (await this.getUser()).communities.find((t) => t.active === !0) || null;
  }
  /**
   * Get the layers info for a given community
   * @param communityId - The ID of the community to get the layers info for
   * @returns CommunityLayer[]
   */
  async getLayersInfo(e) {
    if (!this.apiClient.username)
      throw new Error("Unauthorized");
    const r = (await this.apiClient.getLayers(e, { limit: 100 })).data, n = r.map((l) => this._fetchLayerData(l)), i = this._getUniqueDatabaseIds(r), a = await this._fetchDatabaseExtents(i), o = await Promise.all(n);
    return this._enrichLayers(r, o, a), r;
  }
  /**
   * Fetch geoservice or table data for a single layer
   */
  async _fetchLayerData(e) {
    const t = e;
    return t.geoservice ? this.apiClient.getGeoservice(t.geoservice.id) : t.table && t.database ? this.apiClient.getTable(t.database, t.table) : null;
  }
  /**
   * Extract unique database IDs from layers
   */
  _getUniqueDatabaseIds(e) {
    const t = /* @__PURE__ */ new Set();
    for (const r of e) {
      const n = r;
      n.table && n.database && t.add(n.database);
    }
    return Array.from(t);
  }
  /**
   * Fetch database extents for all database IDs
   */
  async _fetchDatabaseExtents(e) {
    if (e.length === 0)
      return {};
    const t = e.map(
      (i) => this.apiClient.getDatabase(i, { fields: "extent,id" })
    ), r = await Promise.all(t), n = {};
    for (const i of r)
      n[i.data.id] = i.data.extent;
    return n;
  }
  /**
   * Enrich layers with fetched geoservice/table data and database extents
   * (UserManager.js lines 276-290)
   */
  _enrichLayers(e, t, r) {
    for (let n = 0; n < e.length; n++) {
      const i = e[n], a = t[n];
      if (a) {
        if (i.geoservice)
          i.geoservice = a.data;
        else if (i.table && i.database) {
          const o = no(a.data);
          i.table = o, i.extent = r[i.database].split(",");
        }
      }
    }
  }
  /**
   * Set the active community
   * If no layers are found, get them from the API
   * @param communityId - The ID of the community to set as active
   * @returns void
   */
  async setActiveCommunity(e) {
    try {
      const t = await this.getGroupById(e);
      if (!t)
        throw new Error("Community not found");
      await this.storage.setActiveCommunity(e);
      const r = await this.storage.getParam();
      r.offline = t.offline_allowed, t.layers || (t.layers = await this.getLayersInfo(e), await this.storage.saveParam(r)), this.emit("community:change", { community: t });
    } catch (t) {
      throw this.emit("user:error", { error: t, code: "SET_COMMUNITY_FAILED" }), t;
    }
  }
  /**
  * Get the community with its ID
  * @param {number} id - The ID of the community to get
  * @returns {Community | null} - The community or null if not found
  */
  async getGroupById(e) {
    return (await this.getUser()).communities.find((r) => r.id === e) || null;
  }
  /**
   * 
   * @returns The service URL of the collaboratif API
   */
  async getServiceUrl() {
    return this.apiClient.getBaseUrl();
  }
  /**
   * Set the service URL of the collaboratif API
   * @param url - The new service URL to set
   * @returns {void} - The service URL of the collaboratif API
   */
  async setServiceUrl(e) {
    e !== await this.apiClient.getBaseUrl() && await this.apiClient.setBaseUrl(e);
  }
}
const We = {
  FEATURE2SKETCH: {
    TRANSFORM_PROJECTION: "EPSG:4326",
    SKETCH_STYLE: {
      graphicName: "circle",
      diam: 2,
      frontcolor: "#FFAA00;1",
      backcolor: "#FFAA00;0.5"
    },
    SKETCH_CONTEXT: {
      lon: 0,
      lat: 0,
      zoom: 15,
      layers: ["GEOGRAPHICALGRIDSYSTEMS.MAPS"]
    }
  },
  SKETCH2FEATURE: {
    TRANSFORM_PROJECTION: "EPSG:4326",
    TRANSFORM_PROJECTION_FALLBACK: "EPSG:3857"
  }
};
class _u {
  constructor(e, t, r = {}) {
    this._defaultParams = {
      georems: {},
      protocol: "georem",
      version: "1.0",
      territory: "fr",
      theme: "",
      themes: "",
      insee: ""
    }, this._apiClient = e, this._storage = t, this._eventManager = new tr(), this.options = r;
    const n = this._storage.loadParams("report");
    this.params = {
      ...this._defaultParams,
      ...r.defaultParams,
      ...n
    }, r.communityId && (this.params.communityId = r.communityId), r.themeId && (this.params.themeId = r.themeId);
  }
  /**
   * Event subscription methods
   */
  on(e, t) {
    this._eventManager.on(e, t);
  }
  off(e, t) {
    this._eventManager.off(e, t);
  }
  once(e, t) {
    this._eventManager.once(e, t);
  }
  emit(e, t) {
    this._eventManager.emit(e, t);
  }
  /**
   * Create a new report *locally*
   * equivalent to postGeorem of ReportForm.js
   * @param report 
   * 
   * TODO: see the difference between the local and server report creation
   */
  async createReport(e, t = !1) {
    if (!this.params || !this.params.geometry || !this.params.lon && !this.params.lat)
      throw Error("BADREM: neither geometry, lon or lat exists");
    const r = {
      comment: e.comment,
      geometry: this.params.geometry || `POINT(${this.params.lon} ${this.params.lat})`
    };
    if (e.sketch ? r.sketch = e.sketch : e.features && (r.sketch = this.feature2sketch(e.features, this.params.proj)), r.community = e.communityId > 0 ? e.communityId : "-1", e.themes) {
      let i = e.themes.split("::");
      var n = parseInt(i[0]);
      r.attributes = JSON.stringify({
        community: n,
        theme: e.theme,
        attributes: e.attributes ? JSON.parse(e.attributes) : {}
      });
    }
    try {
      const i = await this._apiClient.addReport(r), a = i.data.id, o = i.data;
      return e.photos && e.photos.length && (e.photosToSend = !0), await this.uploadAttachements(a, e), this.emit("report:created", { report: o }), t && this.emit("report:submitted", { report: o, serverId: a }), o;
    } catch (i) {
      throw this.emit("report:error", {
        error: i,
        message: i.message || "Failed to create report"
      }), i;
    }
  }
  /**
   * Submit a report to the server
   * @param _reportId 
   */
  async submitReport(e) {
    throw new Error("Not implemented");
  }
  /**
   * See if the type is correct
   * equivalent to postPhotosPending of ReportForm.js
   * @param file: File to upload
   */
  async uploadAttachements(e, t) {
    var i;
    if (!t.photos || !((i = t.photos) != null && i.length) || !t.photosToSend) return;
    const r = (/* @__PURE__ */ new Date()).getTime();
    this.params.georems || (this.params.georems = {}), this.params.georems[r] || (this.params.georems[r] = {}), this.params.georems[r].photosToSend = !1, delete this.params.georems[r].error;
    const n = t.photos;
    this.emit("attachment:uploading", { reportId: e, progress: 0 });
    try {
      const a = await Promise.all(
        n.map((l) => this._storage.getBlob(l))
        // this will be implemented on the consuming app
      ), o = {};
      a.forEach((l, c) => {
        o[`photo${c}`] = l;
      }), await this._apiClient.addAttachments(e, o), await this._storage.saveParam(this.params), this.emit("attachment:uploaded", { reportId: e, attachmentId: r });
    } catch (a) {
      this.params.georems && this.params.georems[r] && (this.params.georems[r].photosToSend = !0, this.params.georems[r].error = (a == null ? void 0 : a.message) || "Echec d'envoi des images"), await this._storage.saveParam(this.params);
      const o = a instanceof Error ? a : new Error("Echec d'envoi des images");
      throw this.emit("report:error", {
        error: o,
        message: o.message || "Echec d'envoi des images"
      }), o;
    }
  }
  /**
   * Update a report locally
   * Note: Once submitted, the report is no longer editable
   * @param _report 
   */
  async updateReport(e) {
    throw new Error("Not implemented");
  }
  /**
   * Delete a report
   * @param _reportId 
   */
  async deleteReport(e) {
    throw new Error("Not implemented");
  }
  /**
   * Get a report
   * @param _reportId 
   * @param _fromServer
   */
  async getReport(e, t = !0) {
    throw new Error("Not implemented");
  }
  /**
   * List reports
   * @param _filter 
   * @param _fromServer
   */
  async listReports(e, t = !0) {
    throw new Error("Not implemented");
  }
  /** Write feature(s) to sketch
     * @param {ol.feature|Array<ol.feature>} the feature(s) to write
     * @param {ol.proj.ProjectionLike} projection of the features (optional, defaults to WGS84)
     * @return {Object} the sketch in json format
     */
  feature2sketch(e, t) {
    var l, c, u, h;
    if (!e) return "";
    e instanceof Array || (e = [e]);
    const r = new Xt(), n = new St();
    let i;
    const a = (l = e[0]) == null ? void 0 : l.getGeometry();
    a instanceof Sa ? i = a.getFirstCoordinate() : a && (i = pi(a.getExtent())), i && t && (i = Aa(i, t, We.FEATURE2SKETCH.TRANSFORM_PROJECTION));
    const o = {
      context: {
        ...We.FEATURE2SKETCH.SKETCH_CONTEXT,
        lon: ((c = i == null ? void 0 : i[0]) == null ? void 0 : c.toFixed(7)) || We.FEATURE2SKETCH.SKETCH_CONTEXT.lon,
        lat: ((u = i == null ? void 0 : i[1]) == null ? void 0 : u.toFixed(7)) || We.FEATURE2SKETCH.SKETCH_CONTEXT.lat
      },
      objects: []
    };
    for (const f of e) {
      const p = { style: We.FEATURE2SKETCH.SKETCH_STYLE }, m = (h = f.getGeometry()) == null ? void 0 : h.clone(), E = f.getProperties();
      switch (delete E.geometry, t && (m == null || m.transform(t, We.FEATURE2SKETCH.TRANSFORM_PROJECTION)), (m == null ? void 0 : m.getLayout()) === "XYZM" && (E.geom = n.writeGeometry(m)), p.name = "", p.attributes = E, p.geometry = r.writeGeometry(m), m == null ? void 0 : m.getType()) {
        case "Point":
          p.type = "Point";
          break;
        case "LineString":
          p.type = "LineString";
          break;
        case "Polygon":
        case "MultiPolygon":
          p.type = "Polygone";
          break;
      }
      o.objects.push(p);
    }
    return JSON.stringify(o);
  }
  /** Get feature(s) from sketch
    * @param sketch the sketch in json
    * @param proj projection of the features, default `EPSG:3857`
    * @return the feature(s)
    */
  sketch2feature(e, t) {
    if (typeof e == "string")
      try {
        e = JSON.parse(e);
      } catch {
        return [];
      }
    if (!e || !Array.isArray(e.objects))
      return [];
    const r = [], n = new Xt(), i = e.objects;
    for (const a of i) {
      if (!a || typeof a.geometry != "string" || a.geometry.length === 0)
        continue;
      const o = a.attributes ? a.attributes : {};
      try {
        const l = n.readGeometry(a.geometry);
        if (!l)
          continue;
        l.transform(
          We.SKETCH2FEATURE.TRANSFORM_PROJECTION,
          t || We.SKETCH2FEATURE.TRANSFORM_PROJECTION_FALLBACK
        ), o.geometry = l, r.push(new Ci(o));
      } catch {
        continue;
      }
    }
    return r;
  }
}
function so(s) {
  return s instanceof Date && !isNaN(s.getTime());
}
class Au {
  /**
   * Validate a report
   * Return type might be something more complex with errors and such
   * @param report 
   * @returns 
   */
  static validate(e) {
    if (!e.geometry)
      return { valid: !1, error: "This field is required" };
    if (!e.comment)
      return { valid: !1, error: "This field is required" };
    if (!e.attributes)
      return { valid: !1, error: "This field is required" };
    if (e.attributes)
      for (const [t, r] of Object.entries(e.attributes)) {
        const n = e.attributes[t], i = this.validateAttribute(t, r, n);
        if (!i.valid)
          return { valid: !1, error: i.error };
      }
    return { valid: !0 };
  }
  static validateAttribute(e, t, r) {
    var n;
    return r.required && !t ? { valid: !1, error: `The field ${e} is required` } : r.type === "number" && isNaN(t) ? { valid: !1, error: `The field ${e} must be a number` } : r.type === "select" && !((n = r.options) != null && n.includes(t)) ? { valid: !1, error: `The field ${e} must be a valid option` } : r.type === "date" && !so(t) ? { valid: !1, error: `The field ${e} must be a valid date` } : { valid: !0 };
  }
}
const io = 10, Ve = () => {
};
function ao(s) {
  return s === "select" || s === "modify";
}
function oo(s, e) {
  const t = s[0] - e[0], r = s[1] - e[1];
  return t * t + r * r;
}
function co(s, e) {
  const t = s.getGeometry();
  if (!t)
    return null;
  if (typeof t.intersectsCoordinate == "function" && t.intersectsCoordinate(e))
    return e;
  const r = [Number.NaN, Number.NaN];
  return t.closestPointXY(e[0], e[1], r, Number.POSITIVE_INFINITY), Number.isFinite(r[0]) && Number.isFinite(r[1]) ? r : null;
}
class bu extends ka {
  /**
   * Creates a new SketchManager instance
   */
  constructor(e) {
    var t, r, n, i, a, o, l, c, u, h, f, p, m, E, y, C;
    if (super(), this.isActive = !1, this.currentMode = null, this.undoStack = [], this.drawInteraction = null, this.modifyStartGeometries = new globalThis.Map(), this.translateStartGeometries = new globalThis.Map(), this.boundHandlers = [], this.listenerKeys = [], !e.map)
      throw new Error("SketchManager requires a map instance");
    if (!e.source)
      throw new Error("SketchManager requires a vector source");
    this.map = e.map, this.source = e.source, this.layerFilter = e.layerFilter, this.modifyInteractionScope = e.modifyInteractionScope ?? "source", this.selectionHitTolerance = e.selectionHitTolerance ?? io, this.useSourceSelectionFallback = e.useSourceSelectionFallback ?? !0, this.enableUndo = e.enableUndo ?? !0, this.maxUndoStackSize = e.maxUndoStackSize ?? 50, this.buttons = {
      back: ((t = e.buttons) == null ? void 0 : t.back) ?? null,
      drawPoint: ((r = e.buttons) == null ? void 0 : r.drawPoint) ?? null,
      drawLine: ((n = e.buttons) == null ? void 0 : n.drawLine) ?? null,
      drawPolygon: ((i = e.buttons) == null ? void 0 : i.drawPolygon) ?? null,
      drawCircle: ((a = e.buttons) == null ? void 0 : a.drawCircle) ?? null,
      modify: ((o = e.buttons) == null ? void 0 : o.modify) ?? null,
      select: ((l = e.buttons) == null ? void 0 : l.select) ?? null,
      delete: ((c = e.buttons) == null ? void 0 : c.delete) ?? null,
      undo: ((u = e.buttons) == null ? void 0 : u.undo) ?? null
    }, this.callbacks = {
      onBack: ((h = e.callbacks) == null ? void 0 : h.onBack) ?? Ve,
      onFeatureAdded: ((f = e.callbacks) == null ? void 0 : f.onFeatureAdded) ?? Ve,
      onFeatureSelected: ((p = e.callbacks) == null ? void 0 : p.onFeatureSelected) ?? Ve,
      onFeatureModified: ((m = e.callbacks) == null ? void 0 : m.onFeatureModified) ?? Ve,
      onFeatureDeleted: ((E = e.callbacks) == null ? void 0 : E.onFeatureDeleted) ?? Ve,
      onActiveChange: ((y = e.callbacks) == null ? void 0 : y.onActiveChange) ?? Ve,
      onModeChange: ((C = e.callbacks) == null ? void 0 : C.onModeChange) ?? Ve
    }, this.initializeInteractions(), e.autoBindUI !== !1 && this.bindUIElements(), this.setActive(!1);
  }
  /**
   * Initialize all OpenLayers interactions
   */
  initializeInteractions() {
    this.selectInteraction = new Pa({
      condition: Oa,
      hitTolerance: this.selectionHitTolerance,
      layers: this.layerFilter ? this.layerFilter : void 0
    }), this.selectInteraction.setActive(!1), this.map.addInteraction(this.selectInteraction), this.modifyInteraction = this.modifyInteractionScope === "selection" ? new Gn({
      features: this.selectInteraction.getFeatures()
    }) : new Gn({
      source: this.source
    }), this.modifyInteraction.setActive(!1), this.map.addInteraction(this.modifyInteraction), this.translateInteraction = new La({
      features: this.selectInteraction.getFeatures()
    }), this.translateInteraction.setActive(!1), this.map.addInteraction(this.translateInteraction), this.setupEventListeners();
  }
  /**
   * Set up event listeners for interactions
   * Notify callbacks and emit events when features are selected, modified, or moved.
   */
  setupEventListeners() {
    this.modifyInteractionScope === "selection" ? this.listenerKeys.push(this.map.on("singleclick", (e) => {
      if (!ao(this.currentMode))
        return;
      const t = this.findFeatureFromTap(e);
      this.updateSelectedFeature(t);
    })) : this.listenerKeys.push(this.selectInteraction.on("select", () => {
      this.notifyFeatureSelected(this.getSelectedFeature());
    })), this.listenerKeys.push(this.modifyInteraction.on("modifystart", (e) => {
      e.features.forEach((t) => {
        const r = t.getGeometry();
        r && this.modifyStartGeometries.set(String(Lt(t)), r.clone());
      });
    })), this.listenerKeys.push(this.modifyInteraction.on("modifyend", (e) => {
      e.features.getArray().forEach((r) => {
        const n = String(Lt(r)), i = this.modifyStartGeometries.get(n);
        this.enableUndo && i && this.addToUndoStack({
          type: "modify",
          feature: r,
          previousGeometry: i
        }), this.modifyStartGeometries.delete(n), this.callbacks.onFeatureModified(r), this.emitEvent("featuremodified", { feature: r });
      });
    })), this.listenerKeys.push(this.translateInteraction.on("translatestart", (e) => {
      e.features.forEach((t) => {
        const r = t.getGeometry();
        r && this.translateStartGeometries.set(String(Lt(t)), r.clone());
      });
    })), this.listenerKeys.push(this.translateInteraction.on("translateend", (e) => {
      e.features.forEach((t) => {
        const r = String(Lt(t)), n = this.translateStartGeometries.get(r);
        this.enableUndo && n && this.addToUndoStack({
          type: "modify",
          feature: t,
          previousGeometry: n
        }), this.translateStartGeometries.delete(r), this.callbacks.onFeatureModified(t), this.emitEvent("featuremodified", { feature: t });
      });
    }));
  }
  /**
   * Bind UI elements to interactions
   * Can be called manually if UI is loaded dynamically
   */
  bindUIElements() {
    this.unbindUIElements(), [
      ["back", () => this.handleBack()],
      ["drawPoint", () => this.activateDraw("Point")],
      ["drawLine", () => this.activateDraw("LineString")],
      ["drawPolygon", () => this.activateDraw("Polygon")],
      ["drawCircle", () => this.activateDraw("Circle")],
      ["modify", () => this.activateModify()],
      ["select", () => this.activateSelect()],
      ["delete", () => this.deleteSelected()],
      ["undo", () => this.undo()]
    ].forEach(([t, r]) => {
      const n = this.buttons[t];
      n && this.bindElement(n, r);
    });
  }
  /**
   * Bind a single element to a handler
   */
  bindElement(e, t) {
    document.querySelectorAll(e).forEach((n) => {
      const i = () => {
        t();
      };
      n.addEventListener("click", i), this.boundHandlers.push({ element: n, listener: i });
    });
  }
  /**
   * Unbind all UI elements
   */
  unbindUIElements() {
    this.boundHandlers.forEach(({ element: e, listener: t }) => {
      e.removeEventListener("click", t);
    }), this.boundHandlers = [];
  }
  /**
   * Handle back button action
   */
  handleBack() {
    this.callbacks.onBack(), this.setActive(!1);
  }
  /**
   * Manually trigger an action programmatically
   * Useful for framework integrations (React, Vue, etc.)
   */
  triggerAction(e) {
    switch (e !== "back" && !this.isActive && this.setActive(!0), e) {
      case "back":
        this.handleBack();
        return;
      case "drawPoint":
        this.activateDraw("Point");
        return;
      case "drawLine":
        this.activateDraw("LineString");
        return;
      case "drawPolygon":
        this.activateDraw("Polygon");
        return;
      case "drawCircle":
        this.activateDraw("Circle");
        return;
      case "modify":
        this.activateModify();
        return;
      case "select":
        this.activateSelect();
        return;
      case "delete":
        this.deleteSelected();
        return;
      case "undo":
        this.undo();
        return;
      default:
        console.warn(`Unknown action: ${e}`);
        return;
    }
  }
  /**
   * Helper to activate a mode from an InteractionMode value
   */
  setMode(e) {
    switch (e) {
      case "draw-point":
        this.activateDraw("Point");
        return;
      case "draw-linestring":
        this.activateDraw("LineString");
        return;
      case "draw-polygon":
        this.activateDraw("Polygon");
        return;
      case "draw-circle":
        this.activateDraw("Circle");
        return;
      case "modify":
        this.activateModify();
        return;
      case "select":
        this.activateSelect();
        return;
    }
  }
  /**
   * Deactivate all interactions
   */
  deactivateAll() {
    this.drawInteraction && (this.drawInteraction.setActive(!1), this.map.removeInteraction(this.drawInteraction), this.drawInteraction = null), this.modifyInteraction.setActive(!1), this.selectInteraction.setActive(!1), this.selectInteraction.getFeatures().clear(), this.translateInteraction.setActive(!1), this.modifyStartGeometries.clear(), this.translateStartGeometries.clear(), this.currentMode = null, this.notifyModeChange();
  }
  /**
   * Activate draw mode with specified geometry type
   */
  activateDraw(e) {
    this.ensureActive(), this.deactivateAll(), this.drawInteraction = new Ta({
      source: this.source,
      type: e
    }), this.drawInteraction.on("drawend", (t) => {
      const r = t.feature;
      this.enableUndo && this.addToUndoStack({
        type: "add",
        feature: r
      }), this.callbacks.onFeatureAdded(r), this.emitEvent("featureadded", { feature: r }), this.emitEvent("drawend", {
        feature: r,
        valid: !0
      });
    }), this.map.addInteraction(this.drawInteraction), this.drawInteraction.setActive(!0), this.currentMode = `draw-${e.toLowerCase()}`, this.notifyModeChange();
  }
  /**
   * Activate modify mode for editing geometries
   */
  activateModify() {
    this.ensureActive(), this.deactivateAll(), this.modifyInteractionScope === "selection" && this.selectInteraction.setActive(!0), this.modifyInteraction.setActive(!0), this.currentMode = "modify", this.notifyModeChange();
  }
  /**
   * Activate select/translate mode for selecting and moving features
   */
  activateSelect() {
    this.ensureActive(), this.deactivateAll(), this.selectInteraction.setActive(!0), this.translateInteraction.setActive(!0), this.currentMode = "select", this.notifyModeChange();
  }
  /**
   * Delete currently selected feature
   */
  deleteSelected() {
    const e = this.selectInteraction.getFeatures();
    if (e.getLength() === 0)
      return;
    const t = e.item(0);
    this.enableUndo && this.addToUndoStack({
      type: "delete",
      feature: t.clone()
    }), this.source.removeFeature(t), e.clear(), this.callbacks.onFeatureDeleted(t), this.emitEvent("featuredeleted", { feature: t }), this.notifyFeatureSelected(null);
  }
  /**
   * Undo last action
   */
  undo() {
    if (!this.enableUndo || this.undoStack.length === 0)
      return;
    const e = this.undoStack.pop();
    if (e)
      switch (e.type) {
        case "add":
          this.source.removeFeature(e.feature);
          return;
        case "delete":
          this.source.addFeature(e.feature);
          return;
        case "modify":
          e.previousGeometry && e.feature.setGeometry(e.previousGeometry.clone());
          return;
      }
  }
  /**
   * Add action to undo stack
   */
  addToUndoStack(e) {
    this.undoStack.push(e), this.undoStack.length > this.maxUndoStackSize && this.undoStack.shift();
  }
  /**
   * Clear undo stack
   */
  clearUndoStack() {
    this.undoStack = [];
  }
  /**
   * Check if undo is available
   */
  canUndo() {
    return this.enableUndo && this.undoStack.length > 0;
  }
  /**
   * Set active state of sketch tools
   */
  setActive(e) {
    e || this.deactivateAll(), this.isActive !== e && (this.isActive = e, this.callbacks.onActiveChange(e), this.emitEvent("change:active", { active: e }));
  }
  /**
   * Get current active state
   */
  getActive() {
    return this.isActive;
  }
  /**
   * Get current interaction mode
   */
  getCurrentMode() {
    return this.currentMode;
  }
  /**
   * Get currently selected feature
   */
  getSelectedFeature() {
    const e = this.selectInteraction.getFeatures();
    return e.getLength() > 0 ? e.item(0) : null;
  }
  /**
   * Get all selected features
   */
  getSelectedFeatures() {
    return this.selectInteraction.getFeatures().getArray();
  }
  /**
   * Clear current selection
   */
  clearSelection() {
    this.selectInteraction.getFeatures().clear(), this.notifyFeatureSelected(null);
  }
  /**
   * Get current source features
   */
  getFeatures() {
    return this.source.getFeatures();
  }
  /**
   * Notify external app of mode change
   */
  notifyModeChange() {
    this.callbacks.onModeChange(this.currentMode), this.emitEvent("change:mode", { mode: this.currentMode });
  }
  /**
   * Notify external app of feature selection changes.
   */
  notifyFeatureSelected(e) {
    this.callbacks.onFeatureSelected(e), this.emitEvent("featureselected", { feature: e });
  }
  /**
   * Update button selectors (for dynamically loaded UI)
   */
  updateButtons(e) {
    this.unbindUIElements(), Object.assign(this.buttons, e), this.bindUIElements();
  }
  /**
   * Clean up and remove all interactions
   */
  destroy() {
    this.unbindUIElements(), this.setActive(!1), Ia(this.listenerKeys), this.listenerKeys.length = 0, this.map.removeInteraction(this.modifyInteraction), this.map.removeInteraction(this.selectInteraction), this.map.removeInteraction(this.translateInteraction), this.clearUndoStack();
  }
  ensureActive() {
    this.isActive || this.setActive(!0);
  }
  updateSelectedFeature(e) {
    const t = this.selectInteraction.getFeatures();
    t.clear(), e && t.push(e), this.notifyFeatureSelected(e);
  }
  findFeatureFromTap(e) {
    const t = this.findFeatureAtPixel(e.pixel);
    return t || (this.useSourceSelectionFallback ? this.findNearestFeature(e.coordinate) : null);
  }
  findFeatureAtPixel(e) {
    let t = null;
    return this.map.forEachFeatureAtPixel(
      e,
      (r, n) => {
        if (!(r instanceof Ci) || Array.isArray(r.get("features")))
          return;
        const i = n;
        if (!(this.layerFilter && (!i || !this.layerFilter(i))))
          return t = r, t;
      },
      { hitTolerance: this.selectionHitTolerance }
    ), t;
  }
  findNearestFeature(e) {
    const t = this.source.getClosestFeatureToCoordinate(e);
    if (!t)
      return null;
    const r = co(t, e);
    if (!r)
      return null;
    const n = this.map.getPixelFromCoordinate(e), i = this.map.getPixelFromCoordinate(r);
    return Math.sqrt(oo(
      n,
      i
    )) <= this.selectionHitTolerance ? t : null;
  }
  emitEvent(e, t) {
    this.dispatchEvent({ type: e, ...t });
  }
}
const Z = {
  STROKE_COLOR: "#00f",
  STROKE_WIDTH: 1,
  FILL_COLOR: "rgba(255, 255, 255, 0.5)",
  RADIUS: 8,
  CIRCLE_FILL_COLOR: "rgba(255,0,0,.5)",
  CIRCLE_STROKE_COLOR: "#fff",
  CIRCLE_STROKE_WIDTH: 1.5,
  ICON_SIZE: 16,
  LABEL_COLOR: "#fff",
  LABEL_SIZE: 12,
  LABEL_STROKE_COLOR: "#000",
  LABEL_STROKE_WIDTH: 2,
  REGULAR_SHAPE_RADIUS: 10,
  REGULAR_SHAPE_FILL_COLOR: "rgba(0, 0, 0, 0.5)",
  OPACITY: 1
}, lo = {
  fill: new xe({
    color: Z.FILL_COLOR
  }),
  stroke: new re({
    color: Z.STROKE_COLOR,
    width: Z.STROKE_WIDTH,
    lineCap: "round"
  }),
  circle: new dt({
    radius: Z.RADIUS,
    fill: new xe({
      color: Z.CIRCLE_FILL_COLOR
    }),
    stroke: new re({
      color: Z.CIRCLE_STROKE_COLOR,
      width: Z.CIRCLE_STROKE_WIDTH
    })
  }),
  text: new Ft({
    font: `${Z.LABEL_SIZE}px Arial`,
    textAlign: "left",
    textBaseline: "middle",
    text: "",
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scale: 1,
    stroke: new re({
      color: Z.LABEL_STROKE_COLOR,
      width: Z.LABEL_STROKE_WIDTH
    }),
    fill: new xe({
      color: Z.LABEL_COLOR
    })
  }),
  icon: new yn({
    src: "icon.png",
    size: [Z.ICON_SIZE, Z.ICON_SIZE]
  }),
  regularShape: new Kt({
    points: 3,
    radius: Z.REGULAR_SHAPE_RADIUS,
    fill: new xe({
      color: Z.REGULAR_SHAPE_FILL_COLOR
    })
  })
};
class Fu {
  constructor() {
    this.defaultStyle = lo;
  }
  /**
   * Get the default mobile core style configuration
   * 
   * @returns {MobileCoreStyle} The default MobileCoreStyle object containing fill, stroke, circle, text, icon, and regularShape components
   */
  getDefaultMobileCoreStyle() {
    return this.defaultStyle;
  }
  /**
   * Create an OpenLayers Style object from a StyleRule configuration
   * 
   * This method converts a simplified StyleRule object into a full OpenLayers Style instance.
   * It handles fill colors, strokes, images (icons, circles, squares, triangles), and text labels.
   * Opacity is automatically applied to colors when specified.
   * All unspecified properties fall back to DEFAULT_STYLE_VALUES.
   * 
   * @param {StyleRule} styleRule The style configuration object with the following optional properties
   * 
   * @returns {Style} An OpenLayers Style instance that can be applied to features or layers
   * 
   * @example
   * const style = styleManager.createStyle({
   *   fillColor: '#ff0000',
   *   strokeColor: '#000',
   *   strokeWidth: 2,
   *   opacity: 0.5
   * });
   */
  createStyle(e) {
    const t = {};
    if (e.fillColor) {
      const r = this.applyOpacity(e.fillColor, e.opacity);
      t.fill = new xe({
        color: r
      });
    }
    if (e.strokeColor || e.strokeWidth) {
      const r = e.strokeColor || Z.STROKE_COLOR, n = e.strokeWidth || Z.STROKE_WIDTH, i = this.applyOpacity(r, e.opacity);
      t.stroke = new re({
        color: i,
        width: n
      });
    }
    if (e.icon) {
      const r = e.iconSize || Z.ICON_SIZE;
      t.image = new yn({
        src: e.icon,
        scale: r / Z.ICON_SIZE
        // Scale relative to base icon size
      });
    } else if (e.symbol === "circle" || !e.icon && e.color) {
      const r = e.color || e.fillColor || Z.CIRCLE_FILL_COLOR, n = this.applyOpacity(r, e.opacity), i = e.iconSize || Z.RADIUS;
      t.image = new dt({
        radius: i,
        fill: new xe({
          color: n
        }),
        stroke: e.strokeColor ? new re({
          color: this.applyOpacity(e.strokeColor, e.opacity),
          width: e.strokeWidth || Z.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    } else if (e.symbol === "square") {
      const r = e.color || e.fillColor || Z.CIRCLE_FILL_COLOR, n = this.applyOpacity(r, e.opacity), i = e.iconSize || Z.RADIUS;
      t.image = new Kt({
        points: 4,
        radius: i,
        angle: Math.PI / 4,
        fill: new xe({
          color: n
        }),
        stroke: e.strokeColor ? new re({
          color: this.applyOpacity(e.strokeColor, e.opacity),
          width: e.strokeWidth || Z.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    } else if (e.symbol === "triangle") {
      const r = e.color || e.fillColor || Z.CIRCLE_FILL_COLOR, n = this.applyOpacity(r, e.opacity), i = e.iconSize || Z.RADIUS;
      t.image = new Kt({
        points: 3,
        radius: i,
        fill: new xe({
          color: n
        }),
        stroke: e.strokeColor ? new re({
          color: this.applyOpacity(e.strokeColor, e.opacity),
          width: e.strokeWidth || Z.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    }
    if (e.label) {
      const r = e.labelColor || Z.LABEL_COLOR, n = e.labelSize || Z.LABEL_SIZE;
      t.text = new Ft({
        text: e.label,
        font: `${n}px Arial`,
        fill: new xe({
          color: r
        }),
        stroke: new re({
          color: Z.LABEL_STROKE_COLOR,
          width: Z.LABEL_STROKE_WIDTH
        })
      });
    }
    return new ee(t);
  }
  /**
   * Apply opacity to a color string or Color array
   * 
   * Converts hex, rgb colors, or Color arrays to rgba format with the specified opacity.
   * If opacity is not specified or is 1, returns the original color unchanged.
   * 
   * @private
   * @param {string | Color} color - The color to modify (hex, rgb, rgba, or Color array)
   * @param {number} [opacity] - Opacity value from 0 (transparent) to 1 (opaque).
   *   If undefined or 1, the original color is returned
   * 
   * @returns {string} The color in rgba format with applied opacity, or the original color if opacity is not applicable
   * 
   * @example
   * applyOpacity('#ff0000', 0.5) // returns 'rgba(255, 0, 0, 0.5)'
   * applyOpacity('rgb(255, 0, 0)', 0.7) // returns 'rgba(255, 0, 0, 0.7)'
   * applyOpacity([255, 0, 0], 0.5) // returns 'rgba(255, 0, 0, 0.5)'
   * applyOpacity('#ff0000', 1) // returns '#ff0000'
   */
  applyOpacity(e, t) {
    if (t === void 0 || t === 1)
      return Array.isArray(e) ? `rgba(${e[0]}, ${e[1]}, ${e[2]}, ${e[3] || 1})` : e;
    if (Array.isArray(e))
      return `rgba(${e[0]}, ${e[1]}, ${e[2]}, ${t})`;
    if (e.startsWith("#")) {
      const r = e.replace("#", ""), n = parseInt(r.substring(0, 2), 16), i = parseInt(r.substring(2, 4), 16), a = parseInt(r.substring(4, 6), 16);
      return `rgba(${n}, ${i}, ${a}, ${t})`;
    }
    if (e.startsWith("rgb")) {
      const r = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (r)
        return `rgba(${r[1]}, ${r[2]}, ${r[3]}, ${t})`;
    }
    return e;
  }
  /**
   * Get the default OpenLayers style
   * 
   * Creates an OpenLayers Style object from the default MobileCoreStyle configuration.
   * This style is used as a fallback when no matching style rules are found.
   * 
   * @returns {Style} An OpenLayers Style instance with default fill, stroke, and image (circle) properties
   */
  getDefaultStyle() {
    return new ee({
      fill: this.defaultStyle.fill,
      stroke: this.defaultStyle.stroke,
      image: this.defaultStyle.circle
    });
  }
  /**
   * Create an OpenLayers Style from a MobileCoreStyle configuration
   * 
   * Converts a MobileCoreStyle object (which contains OpenLayers style components)
   * into a complete OpenLayers Style instance that can be applied to features or layers.
   * 
   * @param {MobileCoreStyle} mobileCoreStyle - The MobileCoreStyle configuration object
   * 
   * @returns {Style} An OpenLayers Style instance created from the provided MobileCoreStyle
   * 
   * @example 
   * const style = styleManager.createStyleFromMobileCoreStyle({
   *   fill: new Fill({ color: '#ff0000' }),
   *   stroke: new Stroke({ color: '#000000', width: 1 }),
   *   circle: new Circle({ radius: 10 }),
   *   text: new Text({ text: 'Hello' }),
   * });
   */
  createStyleFromMobileCoreStyle(e) {
    return new ee({
      fill: e.fill,
      stroke: e.stroke,
      image: e.circle,
      text: e.text
    });
  }
  /**
   * Apply a style to a feature
   * 
   * Creates a Style from the provided StyleRule and directly applies it to the given feature.
   * This is a convenience method that combines createStyle() and feature.setStyle().
   * 
   * @param {Feature<Geometry>} feature - The OpenLayers feature to style
   * @param {StyleRule} styleRule - The style configuration to apply (see createStyle for details)
   * 
   * @returns {void}
   * 
   * @example
   * const feature = new Feature({ geometry: new Point([0, 0]) });
   * styleManager.applyStyleToFeature(feature, {
   *   symbol: 'circle',
   *   color: '#ff0000',
   *   iconSize: 10
   * });
   */
  applyStyleToFeature(e, t) {
    const r = this.createStyle(t);
    e.setStyle(r);
  }
}
var se = /* @__PURE__ */ ((s) => (s.FAILED_TO_DISCONNECT = "Failed to disconnect from the API", s.LOGIN_FAILED = "Login failed", s.UNAUTHORIZED = "Unauthorized", s.CODE_VERIFIER_MISSING = "Code verifier missing", s.OAUTH_REDIRECT = "OAuth redirect", s.OAUTH_CALLBACK_FAILED = "OAuth callback failed", s.NO_AUTHORIZATION_CODE = "No authorization code", s.FAILED_TO_FETCH_USER_INFO = "Failed to fetch user info", s.NO_ACCESS_TOKEN_AFTER_EXCHANGE = "No access token after exchange", s.TOKEN_EXCHANGE_FAILED = "Token exchange failed", s.REFRESH_TOKEN_MISSING = "Refresh token missing", s.REFRESH_TOKEN_EXPIRED = "Refresh token expired", s.REFRESH_TOKEN_FAILED = "Refresh token failed", s.UNKNOWN_ERROR = "Unknown error", s.TOKEN_MISSING = "Token missing", s))(se || {});
function uo() {
  const s = new Uint8Array(32);
  return crypto.getRandomValues(s), Ai(s);
}
function Ai(s) {
  return btoa(String.fromCharCode(...s)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
async function fo(s) {
  const t = new TextEncoder().encode(s);
  return crypto.subtle.digest("SHA-256", t);
}
async function ho(s) {
  const e = await fo(s);
  return Ai(new Uint8Array(e));
}
function Yn(s) {
  return {
    id: s.id,
    email: s.email,
    firstName: s.firstName,
    lastName: s.lastName,
    username: s.username,
    avatar: s.avatar,
    description: s.description,
    communities: s.communities || [],
    communities_member: s.communities_member || []
  };
}
function bi(s, e) {
  return function() {
    return s.apply(e, arguments);
  };
}
const { toString: xo } = Object.prototype, { getPrototypeOf: Me } = Object, { iterator: Bt, toStringTag: Fi } = Symbol, He = (({ hasOwnProperty: s }) => (e, t) => s.call(e, t))(Object.prototype), Si = (s) => typeof s == "string" && (s === "__proto__" || s === "constructor" || s === "prototype"), nr = (s, e, t) => s === Object.prototype || !t && e === null, po = (s) => {
  if (!Object.isExtensible(s))
    return !1;
  const e = Object.getOwnPropertyNames(s);
  return Object.getOwnPropertySymbols && e.push(...Object.getOwnPropertySymbols(s)), e.every((t) => {
    if (Si(t))
      return !1;
    const r = Object.getOwnPropertyDescriptor(s, t);
    return !!r && r.configurable && r.writable === !0;
  });
}, _n = (s, e) => {
  let t = s;
  const r = [];
  for (; t != null; ) {
    if (r.indexOf(t) !== -1)
      return !1;
    r.push(t);
    const n = Me(t);
    if (nr(t, n, t === s))
      return !1;
    if (He(t, e))
      return !0;
    t = n;
  }
  return !1;
}, mo = (s, e) => s != null && _n(s, e) ? s[e] : void 0, go = (s) => {
  if (s == null || typeof s != "object" && typeof s != "function")
    return s;
  const e = Me(s);
  if (e === null && po(s))
    return s;
  const t = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null), n = [];
  let i = s;
  for (; i != null && n.indexOf(i) === -1; ) {
    n.push(i);
    const a = i === s ? e : Me(i);
    if (nr(i, a, i === s))
      break;
    const o = Object.getOwnPropertyNames(i);
    Object.getOwnPropertySymbols && o.push(...Object.getOwnPropertySymbols(i));
    for (const l of o)
      Si(l) || He(r, l) || (t[l] = s[l], r[l] = !0);
    i = a;
  }
  return t;
}, An = /* @__PURE__ */ ((s) => (e) => {
  const t = xo.call(e);
  return s[t] || (s[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Pe = (s) => (s = s.toLowerCase(), (e) => An(e) === s), sr = (s) => (e) => typeof e === s, { isArray: tt } = Array, rt = sr("undefined");
function pt(s) {
  return s !== null && !rt(s) && s.constructor !== null && !rt(s.constructor) && _e(s.constructor.isBuffer) && s.constructor.isBuffer(s);
}
const Bi = Pe("ArrayBuffer");
function yo(s) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(s) : e = s && s.buffer && Bi(s.buffer), e;
}
const Eo = sr("string"), _e = sr("function"), vo = sr("number"), mt = (s) => s !== null && typeof s == "object", Co = (s) => s === !0 || s === !1, zt = (s) => {
  if (!mt(s))
    return !1;
  const e = Me(s);
  return (e === null || e === Object.prototype || Me(e) === null) && // Treat own Symbol.toStringTag or Symbol.iterator members as evidence the
  // value is tagged/iterable, ignoring members reachable only through shared
  // or terminal prototype boundaries. This is exactly what
  // hasOwnInPrototypeChain(val, prop) computes here: every prototype admitted
  // above (null, Object.prototype, or a terminal null-prototype template) is
  // a boundary, so the walk never inspects anything but `val`'s own members,
  // and stops before even those when `val` is itself the boundary
  // Object.prototype. Checking that inline avoids allocating the walker's
  // `seen` list twice per call on the mergeConfig / merge hot path.
  (nr(s, e, !0) || !He(s, Fi) && !He(s, Bt));
}, wo = (s) => {
  if (!mt(s) || pt(s))
    return !1;
  try {
    return Object.keys(s).length === 0 && Object.getPrototypeOf(s) === Object.prototype;
  } catch {
    return !1;
  }
}, _o = Pe("Date"), Ao = Pe("File"), bo = (s) => !!(s && typeof s.uri < "u"), Fo = (s) => s && typeof s.getParts < "u", So = Pe("Blob"), Bo = Pe("FileList"), Do = Pe("Set"), Ro = (s) => mt(s) && _e(s.pipe);
function Oo() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Jn = Oo(), Qn = typeof Jn.FormData < "u" ? Jn.FormData : void 0, To = (s) => {
  if (!s) return !1;
  if (Qn && s instanceof Qn) return !0;
  const e = Me(s);
  if (!e || e === Object.prototype || !_e(s.append)) return !1;
  const t = An(s);
  return t === "formdata" || // detect form-data instance
  t === "object" && _e(s.toString) && s.toString() === "[object FormData]";
}, Po = Pe("URLSearchParams"), [Lo, ko, Io, No] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers"
].map(Pe), Uo = (s) => s.trim ? s.trim() : s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Dt(s, e, { allOwnKeys: t = !1 } = {}) {
  if (s === null || typeof s > "u")
    return;
  let r, n;
  if (typeof s != "object" && (s = [s]), tt(s))
    for (r = 0, n = s.length; r < n; r++)
      e.call(null, s[r], r, s);
  else {
    if (pt(s))
      return;
    const i = t ? Object.getOwnPropertyNames(s) : Object.keys(s), a = i.length;
    let o;
    for (r = 0; r < a; r++)
      o = i[r], e.call(null, s[o], o, s);
  }
}
function qo(s, e) {
  if (pt(s))
    return null;
  e = e.toLowerCase();
  const t = Object.keys(s);
  let r = t.length, n;
  for (; r-- > 0; )
    if (n = t[r], e === n.toLowerCase())
      return n;
  return null;
}
const Qe = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Di = (s) => !rt(s) && s !== Qe;
function fn(...s) {
  const { caseless: e, skipUndefined: t } = Di(this) && this || {}, r = {}, n = e ? /* @__PURE__ */ Object.create(null) : null, i = (a, o) => {
    if (o === "__proto__" || o === "constructor" || o === "prototype")
      return;
    let l = o;
    if (n && typeof o == "string") {
      const u = o.toLowerCase(), h = n[u];
      h !== void 0 && He(r, h) ? l = h : n[u] = o;
    }
    const c = He(r, l) ? r[l] : void 0;
    zt(c) && zt(a) ? r[l] = fn(c, a) : zt(a) ? r[l] = fn({}, a) : tt(a) ? r[l] = a.slice() : (!t || !rt(a)) && (r[l] = a);
  };
  for (let a = 0, o = s.length; a < o; a++) {
    const l = s[a];
    if (!l || pt(l) || (Dt(l, i), typeof l != "object" || tt(l) || !Object.getOwnPropertySymbols))
      continue;
    const c = Object.getOwnPropertySymbols(l);
    for (let u = 0; u < c.length; u++) {
      const h = c[u];
      Yo.call(l, h) && i(l[h], h);
    }
  }
  return r;
}
const Mo = (s, e, t, { allOwnKeys: r } = {}) => (Dt(
  e,
  (n, i) => {
    t && _e(n) ? Object.defineProperty(s, i, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot
      // hijack defineProperty's accessor-vs-data resolution.
      __proto__: null,
      value: bi(n, t),
      writable: !0,
      enumerable: !0,
      configurable: !0
    }) : Object.defineProperty(s, i, {
      __proto__: null,
      value: n,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  },
  { allOwnKeys: r }
), s), Ho = (s) => (s.charCodeAt(0) === 65279 && (s = s.slice(1)), s), zo = (s, e, t, r) => {
  s.prototype = Object.create(e.prototype, r), Object.defineProperty(s.prototype, "constructor", {
    __proto__: null,
    value: s,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(s, "super", {
    __proto__: null,
    value: e.prototype
  }), t && Object.assign(s.prototype, t);
}, jo = (s, e, t, r) => {
  let n, i, a;
  const o = {};
  if (e = e || {}, s == null) return e;
  do {
    for (n = Object.getOwnPropertyNames(s), i = n.length; i-- > 0; )
      a = n[i], (!r || r(a, s, e)) && !o[a] && (e[a] = s[a], o[a] = !0);
    s = t !== !1 && Me(s);
  } while (s && (!t || t(s, e)) && s !== Object.prototype);
  return e;
}, $o = (s, e, t) => {
  s = String(s), (t === void 0 || t > s.length) && (t = s.length), t -= e.length;
  const r = s.indexOf(e, t);
  return r !== -1 && r === t;
}, Wo = (s) => {
  if (!s) return null;
  if (tt(s)) return s;
  let e = s.length;
  if (!Number.isSafeInteger(e) || e < 0 || e > 4294967295) return null;
  const t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  let n = s;
  for (; n != null && t.size < e; ) {
    if (r.has(n)) return null;
    r.add(n);
    const a = Me(n);
    if (nr(n, a, n === s)) break;
    Object.getOwnPropertyNames(n).forEach((o) => {
      const l = +o;
      Number.isInteger(l) && l >= 0 && l < e && String(l) === o && He(n, o) && t.add(l);
    }), n = a;
  }
  if (t.size !== e) return null;
  const i = new Array(e);
  for (; e-- > 0; )
    i[e] = s[e];
  return i;
}, Go = /* @__PURE__ */ ((s) => (e) => s && e instanceof s)(typeof Uint8Array < "u" && Me(Uint8Array)), Ko = (s, e) => {
  const r = (s && s[Bt]).call(s);
  let n;
  for (; (n = r.next()) && !n.done; ) {
    const i = n.value;
    e.call(s, i[0], i[1]);
  }
}, Xo = (s, e) => {
  let t;
  const r = [];
  for (; (t = s.exec(e)) !== null; )
    r.push(t);
  return r;
}, Zo = Pe("HTMLFormElement"), Vo = (s) => s.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(t, r, n) {
  return r.toUpperCase() + n;
}), { propertyIsEnumerable: Yo } = Object.prototype, Jo = Pe("RegExp"), Ri = (s, e) => {
  const t = Object.getOwnPropertyDescriptors(s), r = {};
  Dt(t, (n, i) => {
    let a;
    (a = e(n, i, s)) !== !1 && (r[i] = a || n);
  }), Object.defineProperties(s, r);
}, Qo = (s) => {
  Ri(s, (e, t) => {
    if (_e(s) && ["arguments", "caller", "callee"].includes(t))
      return !1;
    const r = s[t];
    if (_e(r)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, e0 = (s, e) => {
  const t = {}, r = (n) => {
    n.forEach((i) => {
      t[i] = !0;
    });
  };
  return tt(s) ? r(s) : r(String(s).split(e)), t;
}, t0 = () => {
}, r0 = (s, e) => s != null && Number.isFinite(s = +s) ? s : e;
function n0(s) {
  return !!(s && _e(s.append) && s[Fi] === "FormData" && s[Bt]);
}
const s0 = (s) => {
  const e = /* @__PURE__ */ new WeakSet(), t = (r) => {
    if (mt(r)) {
      if (e.has(r))
        return;
      if (pt(r))
        return r;
      if (!("toJSON" in r)) {
        e.add(r);
        let n;
        if (Do(r)) {
          n = [];
          for (const i of r) {
            const a = t(i);
            !rt(a) && n.push(a);
          }
        } else
          n = tt(r) ? [] : {}, Dt(r, (i, a) => {
            const o = t(i);
            !rt(o) && (n[a] = o);
          });
        return e.delete(r), n;
      }
    }
    return r;
  };
  return t(s);
}, i0 = Pe("AsyncFunction"), a0 = (s) => s && (mt(s) || _e(s)) && _e(s.then) && _e(s.catch), Oi = ((s, e) => s ? setImmediate : e ? ((t, r) => (Qe.addEventListener(
  "message",
  ({ source: n, data: i }) => {
    n === Qe && i === t && r.length && r.shift()();
  },
  !1
), (n) => {
  r.push(n), Qe.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(typeof setImmediate == "function", _e(Qe.postMessage)), o0 = typeof queueMicrotask < "u" ? queueMicrotask.bind(Qe) : typeof process < "u" && process.nextTick || Oi, Ti = (s) => s != null && _e(s[Bt]), c0 = (s) => s != null && _n(s, Bt) && Ti(s), v = {
  isArray: tt,
  isArrayBuffer: Bi,
  isBuffer: pt,
  isFormData: To,
  isArrayBufferView: yo,
  isString: Eo,
  isNumber: vo,
  isBoolean: Co,
  isObject: mt,
  isPlainObject: zt,
  isEmptyObject: wo,
  isReadableStream: Lo,
  isRequest: ko,
  isResponse: Io,
  isHeaders: No,
  isUndefined: rt,
  isDate: _o,
  isFile: Ao,
  isReactNativeBlob: bo,
  isReactNative: Fo,
  isBlob: So,
  isRegExp: Jo,
  isFunction: _e,
  isStream: Ro,
  isURLSearchParams: Po,
  isTypedArray: Go,
  isFileList: Bo,
  forEach: Dt,
  merge: fn,
  extend: Mo,
  trim: Uo,
  stripBOM: Ho,
  inherits: zo,
  toFlatObject: jo,
  kindOf: An,
  kindOfTest: Pe,
  endsWith: $o,
  toArray: Wo,
  forEachEntry: Ko,
  matchAll: Xo,
  isHTMLForm: Zo,
  hasOwnProperty: He,
  hasOwnProp: He,
  // an alias to avoid ESLint no-prototype-builtins detection
  hasOwnInPrototypeChain: _n,
  getSafeProp: mo,
  toSafeFlatObject: go,
  reduceDescriptors: Ri,
  freezeMethods: Qo,
  toObjectSet: e0,
  toCamelCase: Vo,
  noop: t0,
  toFiniteNumber: r0,
  findKey: qo,
  global: Qe,
  isContextDefined: Di,
  isSpecCompliantForm: n0,
  toJSONObject: s0,
  isAsyncFn: i0,
  isThenable: a0,
  setImmediate: Oi,
  asap: o0,
  isIterable: Ti,
  isSafeIterable: c0
}, l0 = v.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), u0 = (s) => {
  const e = /* @__PURE__ */ Object.create(null);
  let t, r, n;
  return s && s.split(`
`).forEach(function(a) {
    n = a.indexOf(":"), t = a.substring(0, n).trim().toLowerCase(), r = a.substring(n + 1).trim();
    const o = v.hasOwnProp(e, t);
    !t || o && v.hasOwnProp(l0, t) || (t === "set-cookie" ? o ? e[t].push(r) : e[t] = [r] : e[t] = o ? e[t] + ", " + r : r);
  }), e;
};
function f0(s) {
  let e = 0, t = s.length;
  for (; e < t; ) {
    const r = s.charCodeAt(e);
    if (r !== 9 && r !== 32)
      break;
    e += 1;
  }
  for (; t > e; ) {
    const r = s.charCodeAt(t - 1);
    if (r !== 9 && r !== 32)
      break;
    t -= 1;
  }
  return e === 0 && t === s.length ? s : s.slice(e, t);
}
const h0 = new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), d0 = new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function bn(s, e) {
  return v.isArray(s) ? s.map((t) => bn(t, e)) : f0(String(s).replace(e, ""));
}
const x0 = (s) => bn(s, h0), p0 = (s) => bn(s, d0);
function Pi(s) {
  const e = /* @__PURE__ */ Object.create(null);
  return v.forEach(s.toJSON(), (t, r) => {
    e[r] = p0(t);
  }), e;
}
const es = Symbol("internals");
function vt(s) {
  return s && String(s).trim().toLowerCase();
}
function jt(s) {
  return s === !1 || s == null ? s : v.isArray(s) ? s.map(jt) : x0(String(s));
}
function m0(s) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = t.exec(s); )
    e[r[1]] = r[2];
  return e;
}
const g0 = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
function fr(s) {
  let e = 0, t = s.length;
  for (; e < t; ) {
    const r = s.charCodeAt(e);
    if (r !== 9 && r !== 32)
      break;
    e += 1;
  }
  for (; t > e; ) {
    const r = s.charCodeAt(t - 1);
    if (r !== 9 && r !== 32)
      break;
    t -= 1;
  }
  return e === 0 && t === s.length ? s : s.slice(e, t);
}
function y0(s) {
  const e = s.length - 1;
  if (e < 1 || s.charCodeAt(0) !== 34 || s.charCodeAt(e) !== 34)
    return s;
  let t = "";
  for (let r = 1; r < e; r++) {
    const n = s.charCodeAt(r);
    if (n === 34 || n === 92 && (r += 1, r >= e))
      return s;
    t += s[r];
  }
  return t;
}
function E0(s) {
  const e = /* @__PURE__ */ Object.create(null), t = String(s);
  let r = 0, n = !1, i = !1;
  function a(o) {
    const l = fr(t.slice(r, o)), c = l.indexOf("=");
    if (c < 1)
      return;
    const u = fr(l.slice(0, c));
    if (!g0.test(u))
      return;
    const h = u.toLowerCase();
    if (h === "__proto__" || h === "constructor" || h === "prototype")
      return;
    const f = fr(l.slice(c + 1));
    e[h] = y0(f);
  }
  for (let o = 0; o < t.length; o++) {
    const l = t.charCodeAt(o);
    n ? i ? i = !1 : l === 92 ? i = !0 : l === 34 && (n = !1) : l === 34 ? n = !0 : (l === 44 || l === 59) && (a(o), r = o + 1);
  }
  return a(t.length), e;
}
const v0 = (s) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(s.trim()), C0 = "__Proto__", ts = (s) => s === "__proto__" ? C0 : s;
function hr(s, e, t, r, n) {
  if (v.isFunction(r))
    return r.call(s, e, t);
  if (n && (e = t), !!v.isString(e)) {
    if (v.isString(r))
      return e.indexOf(r) !== -1;
    if (v.isRegExp(r))
      return r.test(e);
  }
}
function w0(s) {
  return s.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, r) => t.toUpperCase() + r);
}
function _0(s, e) {
  const t = v.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(s, r + t, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(n, i, a) {
        return this[r].call(this, e, n, i, a);
      },
      configurable: !0
    });
  });
}
let ue = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, r) {
    const n = this;
    function i(o, l, c) {
      const u = vt(l);
      if (!u)
        return;
      const h = v.findKey(n, u);
      (!h || n[h] === void 0 || c === !0 || c === void 0 && n[h] !== !1) && (n[ts(h || l)] = jt(o));
    }
    const a = (o, l) => v.forEach(o, (c, u) => i(c, u, l));
    if (v.isPlainObject(e) || e instanceof this.constructor)
      a(e, t);
    else if (v.isString(e) && (e = e.trim()) && !v0(e))
      a(u0(e), t);
    else if (v.isObject(e) && v.isSafeIterable(e)) {
      let o = /* @__PURE__ */ Object.create(null), l, c;
      for (const u of e) {
        if (!v.isArray(u))
          throw new TypeError("Object iterator must return a key-value pair");
        c = u[0], v.hasOwnProp(o, c) ? (l = o[c], o[c] = v.isArray(l) ? [...l, u[1]] : [l, u[1]]) : o[c] = u[1];
      }
      a(o, t);
    } else
      e != null && i(t, e, r);
    return this;
  }
  get(e, t) {
    if (e = vt(e), e) {
      const r = v.findKey(this, e);
      if (r) {
        const n = this[r];
        if (!t)
          return n;
        if (t === !0)
          return m0(n);
        if (v.isFunction(t))
          return t.call(this, n, r);
        if (v.isRegExp(t))
          return t.exec(n);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = vt(e), e) {
      const r = v.findKey(this, e);
      return !!(r && this[r] !== void 0 && (!t || hr(this, this[r], r, t)));
    }
    return !1;
  }
  delete(e, t) {
    const r = this;
    let n = !1;
    function i(a) {
      if (a = vt(a), a) {
        const o = v.findKey(r, a);
        o && (!t || hr(r, r[o], o, t)) && (delete r[o], n = !0);
      }
    }
    return v.isArray(e) ? e.forEach(i) : i(e), n;
  }
  clear(e) {
    const t = Object.keys(this);
    let r = t.length, n = !1;
    for (; r--; ) {
      const i = t[r];
      (!e || hr(this, this[i], i, e, !0)) && (delete this[i], n = !0);
    }
    return n;
  }
  normalize(e) {
    const t = this, r = /* @__PURE__ */ Object.create(null);
    return v.forEach(this, (n, i) => {
      const a = v.findKey(r, i);
      if (a) {
        t[a] = jt(n), delete t[i];
        return;
      }
      const o = ts(e ? w0(i) : String(i).trim());
      o !== i && delete t[i], t[o] = jt(n), r[o] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return v.forEach(this, (r, n) => {
      r != null && r !== !1 && (t[n] = e && v.isArray(r) ? r.join(", ") : r);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join(`
`);
  }
  getSetCookie() {
    const e = this.get("set-cookie");
    return v.isArray(e) ? e : e == null || e === !1 ? [] : [e];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static parseParameters(e) {
    return E0(e);
  }
  static concat(e, ...t) {
    const r = new this(e);
    return t.forEach((n) => r.set(n)), r;
  }
  static accessor(e) {
    const r = (this[es] = this[es] = {
      accessors: {}
    }).accessors, n = this.prototype;
    function i(a) {
      const o = vt(a);
      r[o] || (_0(n, a), r[o] = !0);
    }
    return v.isArray(e) ? e.forEach(i) : i(e), this;
  }
};
ue.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization"
]);
v.reduceDescriptors(ue.prototype, ({ value: s }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => s,
    set(r) {
      this[t] = r;
    }
  };
});
v.freezeMethods(ue);
const Yt = "[REDACTED ****]";
function A0(s) {
  if (v.hasOwnProp(s, "toJSON"))
    return !0;
  let e = Object.getPrototypeOf(s);
  for (; e && e !== Object.prototype; ) {
    if (v.hasOwnProp(e, "toJSON"))
      return !0;
    e = Object.getPrototypeOf(e);
  }
  return !1;
}
function b0(s, e) {
  const t = new Set(e.map((i) => String(i).toLowerCase())), r = [], n = (i) => {
    if (i === null || typeof i != "object" || v.isBuffer(i)) return i;
    if (r.indexOf(i) !== -1) return;
    i instanceof ue && (i = i.toJSON()), r.push(i);
    let a;
    if (v.isArray(i))
      a = [], i.forEach((o, l) => {
        const c = n(o);
        v.isUndefined(c) || (a[l] = c);
      });
    else {
      if (!v.isPlainObject(i) && A0(i))
        return r.pop(), i;
      a = /* @__PURE__ */ Object.create(null);
      for (const [o, l] of Object.entries(i)) {
        const c = t.has(o.toLowerCase()) ? Yt : n(l);
        v.isUndefined(c) || (a[o] = c);
      }
    }
    return r.pop(), a;
  };
  return n(s);
}
function rs(s) {
  try {
    return String(s);
  } catch {
    return "";
  }
}
function F0(s) {
  return s.errors.map((t) => {
    try {
      return t && t.message ? rs(t.message) : rs(t);
    } catch {
      return "";
    }
  }).filter(Boolean).join("; ") || s.name || "AggregateError";
}
const S0 = `
Caused by: `, hn = Symbol("causeStack");
function B0(s, e) {
  const t = v.hasOwnProp(s, hn) && s[hn];
  return t && e.endsWith(t) ? e.length - t.length : -1;
}
function D0(s, e) {
  try {
    const t = e && e.stack;
    if (typeof t != "string" || !t)
      return;
    const r = s.stack;
    if (typeof r != "string" || !r)
      return;
    const n = S0 + t;
    s.stack = r + n, Object.defineProperty(s, hn, { __proto__: null, value: n });
  } catch {
  }
}
let I = class Li extends Error {
  static from(e, t, r, n, i, a) {
    let o = e.message;
    !o && v.isArray(e.errors) && e.errors.length && (o = F0(e));
    const l = new Li(o, t || e.code, r, n, i);
    return Object.defineProperty(l, "cause", {
      __proto__: null,
      value: e,
      writable: !0,
      enumerable: !1,
      configurable: !0
    }), l.name = e.name, D0(l, e), e.status != null && l.status == null && (l.status = e.status), a && Object.assign(l, a), l;
  }
  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  constructor(e, t, r, n, i) {
    super(e), Object.defineProperty(this, "message", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: e,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }), this.name = "AxiosError", this.isAxiosError = !0, t && (this.code = t), r && (this.config = r), n && (this.request = n), i && (this.response = i, this.status = i.status);
  }
  toJSON() {
    const e = this.config, t = e && v.hasOwnProp(e, "redact") ? e.redact : void 0, r = v.isArray(t) && t.length > 0 ? b0(e, t) : v.toJSONObject(e);
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: r,
      code: this.code,
      status: this.status
    };
  }
};
I.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
I.ERR_BAD_OPTION = "ERR_BAD_OPTION";
I.ECONNABORTED = "ECONNABORTED";
I.ETIMEDOUT = "ETIMEDOUT";
I.ECONNREFUSED = "ECONNREFUSED";
I.ERR_NETWORK = "ERR_NETWORK";
I.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
I.ERR_DEPRECATED = "ERR_DEPRECATED";
I.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
I.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
I.ERR_CANCELED = "ERR_CANCELED";
I.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
I.ERR_INVALID_URL = "ERR_INVALID_URL";
I.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
const R0 = null, ki = 100;
function dn(s) {
  return v.isPlainObject(s) || v.isArray(s);
}
function Ii(s) {
  return v.endsWith(s, "[]") ? s.slice(0, -2) : s;
}
function dr(s, e, t) {
  return s ? s.concat(e).map(function(n, i) {
    return n = Ii(n), !t && i ? "[" + n + "]" : n;
  }).join(t ? "." : "") : e;
}
function O0(s) {
  return v.isArray(s) && !s.some(dn);
}
const T0 = v.toFlatObject(v, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function ir(s, e, t) {
  if (!v.isObject(s))
    throw new TypeError("target must be an object");
  e = e || new FormData();
  const r = (g, d) => {
    const x = v.getSafeProp(t, g);
    return v.isUndefined(x) ? d : x;
  }, n = r("metaTokens", !0), i = r("visitor") || E, a = r("dots", !1), o = r("indexes", !1), l = r("Blob") || typeof Blob < "u" && Blob, c = r("maxDepth", ki), u = l && v.isSpecCompliantForm(e), h = [];
  if (!v.isFunction(i))
    throw new TypeError("visitor must be a function");
  function f(g) {
    if (g === null) return "";
    if (v.isDate(g))
      return g.toISOString();
    if (v.isBoolean(g))
      return g.toString();
    if (!u && v.isBlob(g))
      throw new I("Blob is not supported. Use a Buffer instead.");
    if (v.isArrayBuffer(g) || v.isTypedArray(g)) {
      if (u && typeof l == "function")
        return new l([g]);
      throw new I(
        "Blob is not supported. Use a Buffer instead.",
        I.ERR_NOT_SUPPORT
      );
    }
    return g;
  }
  function p(g) {
    if (g > c)
      throw new I(
        "Object is too deeply nested (" + g + " levels). Max depth: " + c,
        I.ERR_FORM_DATA_DEPTH_EXCEEDED
      );
  }
  function m(g, d) {
    if (c === 1 / 0)
      return JSON.stringify(g);
    const x = [];
    return JSON.stringify(g, function(_, F) {
      if (!v.isObject(F))
        return F;
      for (; x.length && x[x.length - 1] !== this; )
        x.pop();
      return x.push(F), p(d + x.length - 1), F;
    });
  }
  function E(g, d, x) {
    let A = g;
    if (v.isReactNative(e) && v.isReactNativeBlob(g))
      return e.append(dr(x, d, a), f(g)), !1;
    if (g && !x && typeof g == "object") {
      if (v.endsWith(d, "{}"))
        d = n ? d : d.slice(0, -2), g = m(g, 1);
      else if (v.isArray(g) && O0(g) || (v.isFileList(g) || v.endsWith(d, "[]")) && (A = v.toArray(g)))
        return d = Ii(d), A.forEach(function(F, b) {
          !(v.isUndefined(F) || F === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? dr([d], b, a) : o === null ? d : d + "[]",
            f(F)
          );
        }), !1;
    }
    return dn(g) ? !0 : (e.append(dr(x, d, a), f(g)), !1);
  }
  const y = Object.assign(T0, {
    defaultVisitor: E,
    convertValue: f,
    isVisitable: dn
  });
  function C(g, d, x = 0) {
    if (!v.isUndefined(g)) {
      if (p(x), h.indexOf(g) !== -1)
        throw new Error("Circular reference detected in " + d.join("."));
      h.push(g), v.forEach(g, function(_, F) {
        (!(v.isUndefined(_) || _ === null) && i.call(e, _, v.isString(F) ? F.trim() : F, d, y)) === !0 && C(_, d ? d.concat(F) : [F], x + 1);
      }), h.pop();
    }
  }
  if (!v.isObject(s))
    throw new TypeError("data must be an object");
  return C(s), e;
}
function ns(s) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(s).replace(/[!'()~]|%20/g, function(r) {
    return e[r];
  });
}
function Fn(s, e) {
  this._pairs = [], s && ir(s, this, e);
}
const Ni = Fn.prototype;
Ni.append = function(e, t) {
  this._pairs.push([e, t]);
};
Ni.toString = function(e) {
  const t = e ? (r) => e.call(this, r, ns) : ns;
  return this._pairs.map(function(n) {
    return t(n[0]) + "=" + t(n[1]);
  }, "").join("&");
};
function P0(s) {
  return encodeURIComponent(s).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function Ui(s, e, t) {
  if (!e)
    return s;
  s = s || "";
  const r = v.isFunction(t) ? {
    serialize: t
  } : t, n = v.getSafeProp(r, "encode") || P0, i = v.getSafeProp(r, "serialize");
  let a;
  if (i ? a = i(e, r) : a = v.isURLSearchParams(e) ? e.toString() : new Fn(e, r).toString(n), a) {
    const o = s.indexOf("#");
    o !== -1 && (s = s.slice(0, o)), s += (s.indexOf("?") === -1 ? "?" : "&") + a;
  }
  return s;
}
const Ct = Symbol("internals");
function qi(s) {
  return s ? s.length : 0;
}
function ss(s) {
  if (s)
    for (; s.length && s[s.length - 1] === null; )
      s.pop();
}
function L0(s) {
  return typeof s == "string" && s !== "" && String(Number(s)) === s ? Number(s) : s;
}
function wt(s, e) {
  const t = s.handlers, r = qi(t);
  t !== e.handlersRef ? (e.handlersRef = t, e.handlerEntries.clear()) : r !== e.handlersLength && (r ? e.handlerEntries.forEach(function(i, a) {
    t[i.index] !== i.handler && e.handlerEntries.delete(a);
  }) : e.handlerEntries.clear()), e.handlersLength = r;
}
class is {
  constructor() {
    this.handlers = [], this[Ct] = {
      handlersRef: this.handlers,
      handlersLength: this.handlers.length,
      handlerEntries: /* @__PURE__ */ new Map(),
      iterationDepth: 0,
      nextId: 0
    };
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   * @param {Object} options The options for the interceptor, synchronous and runWhen
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, t, r) {
    const n = {
      fulfilled: e,
      rejected: t,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }, i = this[Ct];
    this.handlers == null && (this.handlers = []), wt(this, i);
    const a = i.nextId++;
    return this.handlers.push(n), i.handlerEntries.set(a, {
      handler: n,
      index: this.handlers.length - 1
    }), i.handlersLength = this.handlers.length, a;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(e) {
    const t = this[Ct];
    wt(this, t);
    const r = L0(e), n = t.handlerEntries.get(r);
    if (n) {
      if (t.handlerEntries.delete(r), this.handlers[n.index] !== n.handler)
        return;
      this.handlers[n.index] = null, t.iterationDepth || (ss(this.handlers), t.handlersLength = this.handlers.length);
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = [], wt(this, this[Ct]));
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    const t = this[Ct];
    wt(this, t), t.iterationDepth++;
    try {
      v.forEach(this.handlers, function(n) {
        n !== null && e(n);
      });
    } finally {
      --t.iterationDepth || (wt(this, t), ss(this.handlers), t.handlersLength = qi(this.handlers));
    }
  }
}
const Sn = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1,
  legacyInterceptorReqResOrdering: !0,
  advertiseZstdAcceptEncoding: !1,
  validateStatusUndefinedResolves: !0,
  encodeBasicAuthUsername: !1
}, k0 = typeof URLSearchParams < "u" ? URLSearchParams : Fn, I0 = typeof FormData < "u" ? FormData : null, N0 = typeof Blob < "u" ? Blob : null, U0 = {
  isBrowser: !0,
  classes: {
    URLSearchParams: k0,
    FormData: I0,
    Blob: N0
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Bn = typeof window < "u" && typeof document < "u", xn = typeof navigator == "object" && navigator || void 0, q0 = Bn && (!xn || ["ReactNative", "NativeScript", "NS"].indexOf(xn.product) < 0), M0 = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", H0 = Bn && window.location.href || "http://localhost", z0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Bn,
  hasStandardBrowserEnv: q0,
  hasStandardBrowserWebWorkerEnv: M0,
  navigator: xn,
  origin: H0
}, Symbol.toStringTag, { value: "Module" })), oe = {
  ...z0,
  ...U0
};
function j0(s, e) {
  return ir(s, new oe.classes.URLSearchParams(), {
    visitor: function(t, r, n, i) {
      return oe.isNode && v.isBuffer(t) ? (this.append(r, t.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...e
  });
}
const as = ki;
function Mi(s) {
  if (s > as)
    throw new I(
      "FormData field is too deeply nested (" + s + " levels). Max depth: " + as,
      I.ERR_FORM_DATA_DEPTH_EXCEEDED
    );
}
function $0(s) {
  const e = [], t = /[^.[\]]+|\[([^.[\]]*)]/g;
  let r;
  for (; (r = t.exec(s)) !== null; )
    Mi(e.length), e.push(r[0] === "[]" ? "" : r[1] || r[0]);
  return e;
}
function Hi(s) {
  const e = {}, t = Object.keys(s);
  let r;
  const n = t.length;
  let i;
  for (r = 0; r < n; r++)
    i = t[r], e[i] = s[i];
  return e;
}
function zi(s) {
  if (!v.isArray(s)) return s;
  const e = Object.keys(s);
  return e.length !== s.length || e.some((t, r) => t !== String(r)) ? Hi(s) : s;
}
function W0(s) {
  const e = [s];
  for (; e.length; ) {
    const t = e.pop();
    Object.keys(t).forEach((r) => {
      const n = t[r] = zi(t[r]);
      (v.isArray(n) || v.isPlainObject(n)) && e.push(n);
    });
  }
  return s;
}
function ji(s) {
  function e(t, r, n, i) {
    Mi(i);
    let a = t[i++];
    if (a === "__proto__") return !0;
    const o = Number.isFinite(+a), l = i >= t.length;
    return a = !a && v.isArray(n) ? n.length : a, l ? (v.hasOwnProp(n, a) ? (n[a] = zi(n[a]), n[a] = v.isArray(n[a]) ? n[a].concat(r) : [n[a], r]) : n[a] = r, !o) : ((!v.hasOwnProp(n, a) || !v.isObject(n[a])) && (n[a] = []), e(t, r, n[a], i) && v.isArray(n[a]) && (n[a] = Hi(n[a])), !o);
  }
  if (v.isFormData(s) && v.isFunction(s.entries)) {
    const t = {};
    return v.forEachEntry(s, (r, n) => {
      e($0(r), n, t, 0);
    }), W0(t);
  }
  return null;
}
const $i = Object.freeze([
  "get",
  "delete",
  "head",
  "options",
  "post",
  "put",
  "patch",
  "purge",
  "link",
  "unlink",
  "query"
]), ut = (s, e) => s != null && v.hasOwnProp(s, e) ? s[e] : void 0;
function G0(s, e, t) {
  if (v.isString(s))
    try {
      return (e || JSON.parse)(s), v.trim(s);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (t || JSON.stringify)(s);
}
const Rt = {
  transitional: Sn,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function(e, t) {
      const r = t.getContentType() || "", n = r.indexOf("application/json") > -1, i = v.isObject(e);
      if (i && v.isHTMLForm(e) && (e = new FormData(e)), v.isFormData(e))
        return n ? JSON.stringify(ji(e)) : e;
      if (v.isArrayBuffer(e) || v.isBuffer(e) || v.isStream(e) || v.isFile(e) || v.isBlob(e) || v.isReadableStream(e))
        return e;
      if (v.isArrayBufferView(e))
        return e.buffer;
      if (v.isURLSearchParams(e))
        return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
      let o;
      if (i) {
        const l = ut(this, "formSerializer");
        if (r.indexOf("application/x-www-form-urlencoded") > -1)
          return j0(e, l).toString();
        if ((o = v.isFileList(e)) || r.indexOf("multipart/form-data") > -1) {
          const c = ut(this, "env"), u = c && c.FormData;
          return ir(
            o ? { "files[]": e } : e,
            u && new u(),
            l
          );
        }
      }
      return i || n ? (t.setContentType("application/json", !1), G0(e)) : e;
    }
  ],
  transformResponse: [
    function(e) {
      const t = ut(this, "transitional") || Rt.transitional, r = t && t.forcedJSONParsing, n = ut(this, "responseType"), i = n === "json";
      if (v.isResponse(e) || v.isReadableStream(e))
        return e;
      if (e && v.isString(e) && (r && !n || i)) {
        const o = !(t && t.silentJSONParsing) && i;
        try {
          return JSON.parse(e, ut(this, "parseReviver"));
        } catch (l) {
          if (o)
            throw l.name === "SyntaxError" ? I.from(l, I.ERR_BAD_RESPONSE, this, null, ut(this, "response")) : l;
        }
      }
      return e;
    }
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: oe.classes.FormData,
    Blob: oe.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
v.forEach($i, (s) => {
  Rt.headers[s] = {};
});
function xr(s, e) {
  const t = this || Rt, r = e || t, n = ue.from(r.headers);
  let i = r.data;
  return v.forEach(s, function(o) {
    i = o.call(t, i, n.normalize(), e ? e.status : void 0);
  }), n.normalize(), i;
}
function Wi(s) {
  return !!(s && s.__CANCEL__);
}
let Ot = class extends I {
  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  constructor(e, t, r) {
    super(e ?? "canceled", I.ERR_CANCELED, t, r), this.name = "CanceledError", this.__CANCEL__ = !0;
  }
};
function Gi(s, e, t) {
  const r = t.config.validateStatus;
  !t.status || !r || r(t.status) ? s(t) : e(new I(
    "Request failed with status code " + t.status,
    t.status >= 400 && t.status < 500 ? I.ERR_BAD_REQUEST : I.ERR_BAD_RESPONSE,
    t.config,
    t.request,
    t
  ));
}
const K0 = /[\t\n\r]/g;
function Ki(s) {
  if (typeof s != "string")
    return s;
  let e = 0;
  for (; e < s.length && s.charCodeAt(e) <= 32; )
    e++;
  return s.slice(e).replace(K0, "");
}
function pr(s) {
  const e = /^([-+\w]{1,25}):(?:\/\/)?/.exec(s);
  return e && e[1].toLowerCase() || "";
}
const os = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}, Xi = oe.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(s, e, t, r, n, i, a) {
      if (typeof document > "u") return;
      const o = [`${s}=${encodeURIComponent(e)}`];
      v.isNumber(t) && o.push(`expires=${new Date(t).toUTCString()}`), v.isString(r) && o.push(`path=${r}`), v.isString(n) && o.push(`domain=${n}`), i === !0 && o.push("secure"), v.isString(a) && o.push(`SameSite=${a}`), document.cookie = o.join("; ");
    },
    read(s) {
      if (typeof document > "u") return null;
      const e = document.cookie;
      if (!e) return null;
      const t = e.split(";");
      for (let r = 0; r < t.length; r++) {
        const n = t[r].replace(/^\s+/, ""), i = n.indexOf("=");
        if (i !== -1 && n.slice(0, i) === s)
          return os(n.slice(i + 1));
      }
      return null;
    },
    async readAsync(s) {
      try {
        const e = typeof window < "u" && window.cookieStore;
        if (e && v.isFunction(e.get)) {
          const t = await e.get(s);
          return t ? os(t.value) : null;
        }
      } catch {
      }
      return this.read(s);
    },
    remove(s) {
      this.write(s, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    async readAsync() {
      return null;
    },
    remove() {
    }
  }
);
function X0(s, e) {
  s = s || 10;
  const t = new Array(s), r = new Array(s);
  let n = 0, i = 0, a;
  return e = e !== void 0 ? e : 1e3, function(l) {
    const c = Date.now(), u = r[i];
    a || (a = c), t[n] = l, r[n] = c;
    let h = i, f = 0;
    for (; h !== n; )
      f += t[h++], h = h % s;
    if (n = (n + 1) % s, n === i && (i = (i + 1) % s), c - a < e)
      return;
    const p = u && c - u;
    return p ? Math.round(f * 1e3 / p) : void 0;
  };
}
function Z0(s, e) {
  let t = 0, r = 1e3 / e, n, i;
  const a = (u, h = Date.now()) => {
    t = h, n = null, i && (clearTimeout(i), i = null), s(...u);
  };
  return [(...u) => {
    const h = Date.now(), f = h - t;
    f >= r ? a(u, h) : (n = u, i || (i = setTimeout(() => {
      i = null, a(n);
    }, r - f)));
  }, () => n && a(n), (...u) => a(u)];
}
const Jt = (s, e, t = 3) => {
  let r = 0;
  const n = X0(50, 250);
  return Z0((i) => {
    if (!i || !v.isNumber(i.loaded))
      return;
    const a = i.loaded, o = i.lengthComputable ? i.total : void 0, l = Math.max(0, o != null ? Math.min(a, o) : a), c = Math.max(0, l - r), u = n(c);
    r = Math.max(r, l);
    const h = {
      loaded: l,
      total: o,
      progress: o ? l / o : void 0,
      bytes: c,
      rate: u || void 0,
      estimated: u && o ? (o - l) / u : void 0,
      event: i,
      lengthComputable: o != null,
      [e ? "download" : "upload"]: !0
    };
    s(h);
  }, t);
}, cs = (s, e) => {
  const t = s != null;
  return [
    (r) => e[0]({
      lengthComputable: t,
      total: s,
      loaded: r
    }),
    e[1]
  ];
}, ls = (s, e = v.asap) => (...t) => e(() => s(...t)), V0 = oe.hasStandardBrowserEnv ? /* @__PURE__ */ ((s) => (e) => (e = new URL(e, document.baseURI || oe.origin), s.protocol === e.protocol && s.host === e.host && s.port === e.port))(new URL(oe.origin)) : () => !0;
function Y0(s) {
  return typeof s != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(s);
}
function J0(s, e) {
  if (!e)
    return s;
  let t = s.length;
  for (; t > 0 && s.charCodeAt(t - 1) === 47; )
    t--;
  return s.slice(0, t) + "/" + e.replace(/^\/+/, "");
}
const Q0 = /^https?:(?!\/\/)/i;
function ec(s) {
  return s && s.replace(/(^|&)([^=&]*=)?[^&]+/g, (e, t, r = "") => `${t}${r}${Yt}`);
}
function tc(s) {
  const e = s.replace(/^(https?:\/{0,2})[^/?#]*@/i, `$1${Yt}@`), t = e.indexOf("#"), n = (t === -1 ? e : e.slice(0, t)).replace(
    /([?&][^=&#]*=)[^&#]*/g,
    `$1${Yt}`
  );
  return t === -1 ? n : `${n}#${ec(e.slice(t + 1))}`;
}
function us(s, e) {
  if (typeof s == "string") {
    const t = Ki(s);
    if (Q0.test(t))
      throw new I(
        `Invalid URL ${JSON.stringify(tc(t))}: missing "//" after protocol`,
        I.ERR_INVALID_URL,
        e
      );
  }
}
function Zi(s, e, t, r) {
  us(e, r);
  let n = !Y0(e);
  return s && (n || t === !1) ? (us(s, r), J0(s, e)) : e;
}
function rc(s) {
  const e = [{ value: s }], t = /* @__PURE__ */ new WeakSet(), r = /* @__PURE__ */ new WeakSet();
  for (; e.length; ) {
    const { value: n, done: i } = e.pop();
    if (!v.isPlainObject(n) && !v.isArray(n)) continue;
    if (i) {
      t.delete(n);
      continue;
    }
    if (t.has(n))
      throw new I(
        "Circular reference detected in params",
        I.ERR_BAD_OPTION_VALUE
      );
    if (r.has(n)) continue;
    r.add(n), t.add(n), e.push({ value: n, done: !0 });
    const a = Object.keys(n);
    Object.getOwnPropertySymbols && Object.getOwnPropertyDescriptor && Object.getOwnPropertySymbols(n).forEach((o) => {
      const l = Object.getOwnPropertyDescriptor(n, o);
      l && l.enumerable && a.push(o);
    }), a.forEach((o) => {
      if (o === "__proto__" || o === "constructor" || o === "prototype") {
        const l = Object.getOwnPropertyDescriptor(n, o);
        l && v.hasOwnProp(l, "value") && e.push({ value: l.value });
      } else
        e.push({ value: n[o] });
    });
  }
}
const fs = (s) => s instanceof ue ? { ...s } : s, pn = (s) => Object.getOwnPropertySymbols && Object.getOwnPropertyDescriptor ? Object.keys(s).concat(
  Object.getOwnPropertySymbols(s).filter((e) => {
    const t = Object.getOwnPropertyDescriptor(s, e);
    return t && t.enumerable;
  })
) : Object.keys(s);
function nc(s, e) {
  const t = [], r = /* @__PURE__ */ new WeakMap(), n = {};
  function i(o, l) {
    if (!v.isPlainObject(l))
      return v.isArray(l) ? l.slice() : l;
    const c = v.isPlainObject(o) ? o : n;
    let u = r.get(l);
    if (u || (u = /* @__PURE__ */ new WeakMap(), r.set(l, u)), u.has(c)) return u.get(c);
    const h = {};
    return u.set(c, h), t.push({ base: c, source: l, result: h }), h;
  }
  const a = v.isUndefined(e) ? i(void 0, s) : i(s, e);
  for (; t.length; ) {
    const { base: o, source: l, result: c } = t.pop(), u = new Set(pn(o)), h = new Set(pn(l));
    (/* @__PURE__ */ new Set([...u, ...h])).forEach((p) => {
      if (p === "__proto__" || p === "constructor" || p === "prototype") return;
      const m = h.has(p), E = m ? l[p] : void 0, y = (!m || v.isPlainObject(E)) && u.has(p) ? o[p] : void 0;
      c[p] = m ? i(y, E) : i(void 0, y);
    });
  }
  return rc(a), a;
}
function Xe(s, e, t, r) {
  return v.isPlainObject(s) && v.isPlainObject(e) ? v.merge.call({ caseless: r }, s, e) : v.isPlainObject(e) ? v.merge({}, e) : v.isArray(e) ? e.slice() : e;
}
function Vi(s, e, t, r) {
  if (v.isUndefined(e)) {
    if (!v.isUndefined(s))
      return Xe(void 0, s, t, r);
  } else return Xe(s, e, t, r);
}
function mr(s, e) {
  if (!v.isUndefined(e))
    return Xe(void 0, e);
}
function te(s, e) {
  if (v.isUndefined(e)) {
    if (!v.isUndefined(s))
      return Xe(void 0, s);
  } else return Xe(void 0, e);
}
function sc(s, e, t) {
  const r = v.hasOwnProp(e, "transitional") ? e.transitional : void 0;
  if (!v.isUndefined(r))
    if (v.isPlainObject(r)) {
      if (v.hasOwnProp(r, t))
        return r[t];
    } else
      return;
  const n = v.hasOwnProp(s, "transitional") ? s.transitional : void 0;
  if (v.isPlainObject(n) && v.hasOwnProp(n, t))
    return n[t];
}
function mn(s, e, t, r, n) {
  if (v.hasOwnProp(n, t))
    return Xe(s, e);
  if (v.hasOwnProp(r, t))
    return Xe(void 0, s);
}
function ic(s, e, t) {
  return Vi(fs(s), fs(e), t, !0);
}
const ac = Object.freeze({
  __proto__: null,
  value: Object.prototype.hasOwnProperty,
  enumerable: !1,
  writable: !0,
  configurable: !0
}), hs = {
  url: mr,
  method: mr,
  data: mr,
  baseURL: te,
  transformRequest: te,
  transformResponse: te,
  params: nc,
  paramsSerializer: te,
  timeout: te,
  timeoutErrorMessage: te,
  withCredentials: te,
  withXSRFToken: te,
  adapter: te,
  responseType: te,
  xsrfCookieName: te,
  xsrfHeaderName: te,
  onUploadProgress: te,
  onDownloadProgress: te,
  decompress: te,
  maxContentLength: te,
  maxBodyLength: te,
  beforeRedirect: te,
  transport: te,
  httpAgent: te,
  httpsAgent: te,
  cancelToken: te,
  socketPath: te,
  allowedSocketPaths: te,
  responseEncoding: te,
  validateStatus: mn,
  headers: ic
};
function nt(s, e) {
  s = s || {}, e = e || {};
  const t = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(t, "hasOwnProperty", ac);
  const r = pn({ ...s, ...e });
  for (let n = 0, i = r.length; n < i; n++) {
    const a = r[n];
    if (a === "__proto__" || a === "constructor" || a === "prototype") continue;
    const o = v.hasOwnProp(hs, a) ? hs[a] : Vi, l = v.hasOwnProp(s, a) ? s[a] : void 0, c = v.hasOwnProp(e, a) ? e[a] : void 0, u = o === mn ? o(l, c, a, s, e) : o(l, c, a);
    v.isUndefined(u) && o !== mn || (t[a] = u);
  }
  return v.hasOwnProp(e, "validateStatus") && v.isUndefined(e.validateStatus) && sc(s, e, "validateStatusUndefinedResolves") === !1 && (v.hasOwnProp(s, "validateStatus") ? t.validateStatus = Xe(void 0, s.validateStatus) : delete t.validateStatus), t;
}
const oc = ["content-type", "content-length"];
function cc(s, e, t) {
  if (t !== "content-only") {
    s.set(e);
    return;
  }
  Object.entries(e || {}).forEach(([r, n]) => {
    oc.includes(r.toLowerCase()) && s.set(r, n);
  });
}
const ds = (s) => encodeURIComponent(s).replace(
  /%([0-9A-F]{2})/gi,
  (e, t) => String.fromCharCode(parseInt(t, 16))
), lc = (s) => Xi.read(s);
function Yi(s, e = lc) {
  const t = nt({}, s), r = (p) => v.hasOwnProp(t, p) ? t[p] : void 0, n = r("data");
  let i = r("withXSRFToken");
  const a = r("xsrfHeaderName"), o = r("xsrfCookieName");
  let l = r("headers");
  const c = r("auth"), u = r("baseURL"), h = r("allowAbsoluteUrls"), f = r("url");
  if (t.headers = l = ue.from(l), t.url = Ui(
    Zi(u, f, h, t),
    r("params"),
    r("paramsSerializer")
  ), c) {
    const p = v.getSafeProp(c, "username") || "", m = v.getSafeProp(c, "password") || "", E = r("transitional"), y = E && v.hasOwnProp(E, "encodeBasicAuthUsername") && E.encodeBasicAuthUsername === !0;
    try {
      l.set(
        "Authorization",
        // Preserve legacy username bytes unless the caller opts in to UTF-8.
        "Basic " + btoa(
          (y ? ds(p) : p) + ":" + (m ? ds(m) : "")
        )
      );
    } catch (C) {
      throw I.from(C, I.ERR_BAD_OPTION_VALUE, s);
    }
  }
  if (v.isFormData(n)) {
    const p = v.getSafeProp(n, "getHeaders");
    oe.hasStandardBrowserEnv || oe.hasStandardBrowserWebWorkerEnv || v.isReactNative(n) ? l.setContentType(void 0) : v.isFunction(p) && cc(l, p.call(n), r("formDataHeaderPolicy"));
  }
  if (oe.hasStandardBrowserEnv && (v.isFunction(i) && (i = i(t)), i === !0 || i == null && V0(t.url))) {
    const m = a && o && e(o);
    m && l.set(a, m);
  }
  return t;
}
const uc = typeof XMLHttpRequest < "u", fc = uc && function(s) {
  return new Promise(function(t, r) {
    let n;
    try {
      const b = oe.hasStandardBrowserEnv && typeof window < "u" && window.cookieStore;
      n = b && v.isFunction(b.get);
    } catch {
    }
    let i;
    const a = Yi(
      s,
      n ? (b) => (i = b, null) : void 0
    );
    let o = a.data;
    const l = ue.from(a.headers).normalize();
    let { responseType: c, onUploadProgress: u, onDownloadProgress: h } = a, f, p, m, E, y, C, g;
    function d() {
      clearTimeout(p);
      try {
        y && y();
      } catch (b) {
        setTimeout(() => {
          throw b;
        });
      }
      try {
        C && C();
      } catch (b) {
        setTimeout(() => {
          throw b;
        });
      }
      x && (E && x.removeEventListener("progress", E), x.upload && (m && x.upload.removeEventListener("progress", m), y && x.upload.removeEventListener("loadend", y))), a.cancelToken && a.cancelToken.unsubscribe(f), a.signal && a.signal.removeEventListener("abort", f);
    }
    let x = new XMLHttpRequest();
    x.open(a.method.toUpperCase(), a.url, !0), x.timeout = a.timeout;
    function A(b) {
      if (!x)
        return;
      if (x.status === 0 && (pr(Ki(a.url)) || pr(oe.origin)) !== "file" && !(x.responseURL && x.responseURL.startsWith("file:"))) {
        r(new I("Request aborted", I.ECONNABORTED, s, x)), d(), x = null;
        return;
      }
      try {
        b ? g && g(b) : C && C();
      } catch (B) {
        setTimeout(() => {
          throw B;
        });
      }
      if (!x)
        return;
      const R = ue.from(
        "getAllResponseHeaders" in x && x.getAllResponseHeaders()
      ), S = {
        data: !c || c === "text" || c === "json" ? x.responseText : x.response,
        status: x.status,
        statusText: x.statusText,
        headers: R,
        config: s,
        request: x
      };
      Gi(
        function(D) {
          t(D), d();
        },
        function(D) {
          r(D), d();
        },
        S
      ), x = null;
    }
    if ("onloadend" in x ? x.onloadend = A : x.onreadystatechange = function() {
      !x || x.readyState !== 4 || x.status === 0 && !(x.responseURL && x.responseURL.startsWith("file:")) || setTimeout(A);
    }, x.onabort = function() {
      x && (r(new I("Request aborted", I.ECONNABORTED, s, x)), d(), x = null);
    }, x.onerror = function(R) {
      const w = R && R.message ? R.message : "Network Error", S = new I(w, I.ERR_NETWORK, s, x);
      S.event = R || null, r(S), d(), x = null;
    }, x.ontimeout = function() {
      if (!x) return;
      let R = a.timeout ? "timeout of " + a.timeout + "ms exceeded" : "timeout exceeded";
      const w = a.transitional || Sn;
      a.timeoutErrorMessage && (R = a.timeoutErrorMessage), r(
        new I(
          R,
          w.clarifyTimeoutError ? I.ETIMEDOUT : I.ECONNABORTED,
          s,
          x
        )
      ), d(), x = null;
    }, o === void 0 && l.setContentType(null), v.isUndefined(a.withCredentials) || (x.withCredentials = !!a.withCredentials), c && c !== "json" && (x.responseType = a.responseType), h && ([E, C, g] = Jt(
      h,
      !0
    ), x.addEventListener("progress", E)), u && x.upload && ([m, y] = Jt(u), x.upload.addEventListener("progress", m), x.upload.addEventListener("loadend", y)), a.cancelToken || a.signal) {
      if (f = (b) => {
        if (!x)
          return;
        r(!b || b.type ? new Ot(null, s, x) : b);
        const R = x;
        d(), x = null, R.abort();
      }, a.cancelToken && a.cancelToken.subscribe(f), !x) return;
      a.signal && (a.signal.aborted ? f() : a.signal.addEventListener("abort", f));
    }
    if (!x) return;
    const _ = pr(a.url);
    if (_ && !oe.protocols.includes(_)) {
      r(
        new I(
          "Unsupported protocol " + _ + ":",
          I.ERR_BAD_REQUEST,
          s
        )
      ), d();
      return;
    }
    const F = () => {
      x && ("setRequestHeader" in x && v.forEach(
        Pi(l),
        function(R, w) {
          x.setRequestHeader(w, R);
        }
      ), x.send(o || null));
    };
    if (i) {
      const b = typeof performance < "u" && v.isFunction(performance.now) ? () => performance.now() : Date.now, R = x.timeout > 0 ? b() + Number(x.timeout) : void 0, w = () => {
        if (!x) return;
        const S = x;
        S.ontimeout(), S.abort();
      };
      if (R !== void 0) {
        const S = () => {
          const B = R - b();
          B > 0 ? p = setTimeout(S, Math.min(B, 2147483647)) : w();
        };
        S();
      }
      Xi.readAsync(i).then((S) => {
        if (x) {
          if (R !== void 0 && b() >= R) {
            w();
            return;
          }
          if (S) {
            const B = v.hasOwnProp(a, "xsrfHeaderName") && a.xsrfHeaderName;
            l.set(B, S);
          }
          F();
        }
      }).catch((S) => {
        x && (r(I.from(S, null, s, x)), d(), x = null);
      });
    } else
      F();
  });
}, hc = (s, e) => {
  if (s = s ? s.filter(Boolean) : [], !e && !s.length)
    return;
  const t = new AbortController();
  let r = !1;
  const n = function(l) {
    if (!r) {
      r = !0, a();
      const c = l instanceof Error ? l : this.reason;
      t.abort(
        c instanceof I ? c : new Ot(c instanceof Error ? c.message : c)
      );
    }
  };
  let i = e && setTimeout(() => {
    i = null, n(new I(`timeout of ${e}ms exceeded`, I.ETIMEDOUT));
  }, e);
  const a = () => {
    s && (i && clearTimeout(i), i = null, s.forEach((l) => {
      const c = v.getSafeProp(l, "unsubscribe");
      v.isFunction(c) ? c.call(l, n) : l.removeEventListener("abort", n);
    }), s = null);
  };
  s.forEach((l) => {
    if (!r) {
      if (l.aborted) {
        n.call(l);
        return;
      }
      l.addEventListener("abort", n, { once: !0 });
    }
  });
  const { signal: o } = t;
  return o.unsubscribe = () => v.asap(a), o;
}, dc = function* (s, e) {
  let t = s.byteLength;
  if (t < e) {
    yield s;
    return;
  }
  let r = 0, n;
  for (; r < t; )
    n = r + e, yield s.slice(r, n), r = n;
}, xc = async function* (s, e) {
  for await (const t of pc(s))
    yield* dc(t, e);
}, pc = async function* (s) {
  if (s[Symbol.asyncIterator]) {
    yield* s;
    return;
  }
  const e = s.getReader();
  try {
    for (; ; ) {
      const { done: t, value: r } = await e.read();
      if (t)
        break;
      yield r;
    }
  } finally {
    await e.cancel();
  }
}, xs = (s, e, t, r) => {
  const n = xc(s, e);
  let i = 0, a, o = (l) => {
    a || (a = !0, r && r(l));
  };
  return new ReadableStream(
    {
      async pull(l) {
        try {
          const { done: c, value: u } = await n.next();
          if (c) {
            o(), l.close();
            return;
          }
          let h = u.byteLength;
          if (t) {
            let f = i += h;
            t(f);
          }
          l.enqueue(new Uint8Array(u));
        } catch (c) {
          throw o(c), c;
        }
      },
      cancel(l) {
        return o(l), n.return();
      }
    },
    {
      highWaterMark: 2
    }
  );
}, Ke = `\r
`, ps = (s) => String(s).replace(/\r\n|\r|\n/g, Ke), ms = (s) => String(s).replace(
  /[\r\n"]/g,
  (e) => e === "\r" ? "%0D" : e === `
` ? "%0A" : "%22"
), _t = (s, e) => {
  let t = 0;
  for (let r = 0; r < s.length; r++) {
    const n = s.charCodeAt(r);
    e && (n === 13 || n === 10) ? (n === 13 && s.charCodeAt(r + 1) === 10 && r++, t += 2) : n < 128 ? t++ : n < 2048 ? t += 2 : n >= 55296 && n <= 56319 && s.charCodeAt(r + 1) >= 56320 && s.charCodeAt(r + 1) <= 57343 ? (t += 4, r++) : t += 3;
  }
  return t;
};
class $t extends TypeError {
  constructor(e, t) {
    super(e), this.name = "FormDataError", this.reason = t;
  }
}
function mc(s, e, t, r, n) {
  if (!v.isFunction(e))
    throw new $t("Blob is not supported", "blob");
  if (!v.isString(n) || !/^[A-Za-z0-9'()+_,./:=? -]{1,70}$/.test(n) || / $/.test(n))
    throw new $t("Invalid multipart boundary", "boundary");
  const i = "--" + n + "--" + Ke;
  let a = i.length;
  const o = [], l = (u) => {
    if (a + u > t) throw r();
  };
  l(0);
  for (const [u, h] of s) {
    const f = v.isString(h), p = f ? _t(h, !0) : h.size;
    if (!Number.isFinite(p) || p < 0)
      throw new $t("Unsupported FormData part size", "part");
    l(
      p + _t(u, !0) + (!f && h.name ? _t(h.name, !1) : 0) + (!f && h.type ? _t(h.type, !1) : 0)
    );
    let m = "--" + n + Ke + 'Content-Disposition: form-data; name="' + ms(ps(u)) + '"';
    f || (m += '; filename="' + ms(v.isString(h.name) ? h.name : "blob") + '"' + Ke + "Content-Type: " + String(h.type || "application/octet-stream").replace(/[\r\n]/g, "")), m += Ke + Ke;
    const E = _t(m, !1) + p + Ke.length;
    l(E), a += E, o.push({ header: m, value: h, isString: f });
  }
  const c = [];
  for (const u of o)
    c.push(u.header, u.isString ? ps(u.value) : u.value, Ke);
  return c.push(i), new e(c, { type: "multipart/form-data; boundary=" + n });
}
function gc(s, e, t, r, n) {
  if (!v.isFunction(e))
    throw new I("Blob is not supported", I.ERR_NOT_SUPPORT);
  if (n === void 0)
    if (v.isFunction(oe.generateString))
      n = "axios-" + oe.generateString(36, "0123456789abcdef");
    else {
      const i = v.global.crypto;
      if (!i || !v.isFunction(i.getRandomValues))
        throw new I("Random byte generation is not supported", I.ERR_NOT_SUPPORT);
      const a = new Uint8Array(18);
      i.getRandomValues(a), n = "axios-" + Array.from(a, (o) => ("0" + o.toString(16)).slice(-2)).join("");
    }
  try {
    return mc(s, e, t, r, n);
  } catch (i) {
    if (i instanceof $t) {
      const a = i.reason === "boundary" ? I.ERR_BAD_OPTION_VALUE : I.ERR_BAD_REQUEST;
      throw new I(i.message, a);
    }
    throw i;
  }
}
const gs = (s) => s >= 48 && s <= 57 || s >= 65 && s <= 70 || s >= 97 && s <= 102, Ji = (s, e, t) => e + 2 < t && gs(s.charCodeAt(e + 1)) && gs(s.charCodeAt(e + 2)), ys = (s) => s <= 57 ? s - 48 : (s & 223) - 55, yc = (s) => s >= 65 && s <= 90 || // A-Z
s >= 97 && s <= 122 || // a-z
s >= 48 && s <= 57 || // 0-9
s === 43 || // +
s === 47 || // /
s === 45 || // - (base64url)
s === 95, Ec = (s) => s === 9 || s === 10 || s === 12 || s === 13 || s === 32, vc = (s) => {
  const e = Math.floor(s / 4), t = s % 4;
  return e * 3 + (t === 2 ? 1 : t === 3 ? 2 : 0);
}, Cc = (s) => {
  const e = s.length;
  let t = 0;
  return e > 0 && s.charCodeAt(e - 1) === 61 && (t++, e > 1 && s.charCodeAt(e - 2) === 61 && t++), Math.floor((e - t) * 3 / 4);
}, wc = (s) => {
  const e = s.length;
  let t = 0, r = 0, n = !1;
  for (let i = 0; i < e; i++) {
    let a = s.charCodeAt(i);
    if (a === 37 && Ji(s, i, e) && (a = ys(s.charCodeAt(i + 1)) * 16 + ys(s.charCodeAt(i + 2)), i += 2), !Ec(a)) {
      if (a === 61) {
        r++;
        continue;
      }
      if (!yc(a) || r > 0) {
        n = !0;
        continue;
      }
      t++;
    }
  }
  return n || r > 2 || r > 0 && (t + r) % 4 !== 0 || t % 4 === 1 ? Cc(s) : vc(t);
}, _c = (s, e, t) => {
  if (!s || typeof s != "string" || !/^data:/i.test(s)) return 0;
  const r = s.indexOf(",");
  if (r < 0) return 0;
  const n = s.slice(5, r), i = s.slice(r + 1);
  if (t.test(n))
    return e(i);
  let o = 0;
  for (let l = 0, c = i.length; l < c; l++) {
    const u = i.charCodeAt(l);
    if (u === 37 && Ji(i, l, c))
      o += 1, l += 2;
    else if (u < 128)
      o += 1;
    else if (u < 2048)
      o += 2;
    else if (u >= 55296 && u <= 56319 && l + 1 < c) {
      const h = i.charCodeAt(l + 1);
      h >= 56320 && h <= 57343 ? (o += 4, l++) : o += 3;
    } else
      o += 3;
  }
  return o;
};
function Ac(s) {
  const e = typeof s == "string" ? s.indexOf("#") : -1;
  return _c(
    e === -1 ? s : s.slice(0, e),
    wc,
    /; *base64[\t\n\f\r ]*$/i
  );
}
const Dn = "1.21.0", Es = 64 * 1024, vs = {
  cache: "default",
  redirect: "follow",
  referrer: "about:client",
  referrerPolicy: "",
  mode: "cors",
  integrity: "",
  keepalive: !1,
  priority: "auto",
  window: null
}, { isFunction: Nt } = v, bc = (s) => encodeURIComponent(s).replace(
  /%([0-9A-F]{2})/gi,
  (e, t) => String.fromCharCode(parseInt(t, 16))
), Cs = (s) => {
  if (!v.isString(s))
    return s;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}, Ut = (s, ...e) => {
  try {
    return !!s(...e);
  } catch {
    return !1;
  }
}, Fc = (s) => {
  const e = s.indexOf("://");
  let t = s;
  return e !== -1 && (t = t.slice(e + 3)), t.includes("@") || t.includes(":");
}, Sc = (s) => {
  const e = v.global !== void 0 && v.global !== null ? v.global : globalThis, { ReadableStream: t, TextEncoder: r } = e;
  s = v.merge.call(
    {
      skipUndefined: !0
    },
    {
      Request: e.Request,
      Response: e.Response,
      Blob: e.Blob
    },
    s
  );
  const n = v.hasOwnProp(s, "fetch") ? s.fetch : void 0, { Request: i, Response: a, Blob: o } = s, l = n ? Nt(n) : typeof fetch == "function", c = Nt(i), u = Nt(a);
  if (!l)
    return !1;
  const h = l && Nt(t), f = l && (typeof r == "function" ? /* @__PURE__ */ ((d) => (x) => d.encode(x))(new r()) : async (d) => new Uint8Array(await new i(d).arrayBuffer())), p = c && h && Ut(() => {
    let d = !1;
    const x = new i(oe.origin, {
      body: new t(),
      method: "POST",
      get duplex() {
        return d = !0, "half";
      }
    }), A = x.headers.has("Content-Type");
    return x.body != null && x.body.cancel(), d && !A;
  }), m = u && h && Ut(() => v.isReadableStream(new a("").body)), E = Object.assign(/* @__PURE__ */ Object.create(null), vs);
  c && !Ut(() => new i(oe.origin, E)) && (delete E.cache, Ut(() => new i(oe.origin, E)) || (E.cache = vs.cache));
  const y = {
    stream: m && ((d) => d.body)
  };
  l && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((d) => {
    !y[d] && (y[d] = (x, A) => {
      let _ = x && x[d];
      if (_)
        return _.call(x);
      throw new I(
        `Response type '${d}' is not supported`,
        I.ERR_NOT_SUPPORT,
        A
      );
    });
  });
  const C = async (d) => {
    if (d == null)
      return 0;
    if (v.isBlob(d))
      return d.size;
    if (v.isArrayBufferView(d) || v.isArrayBuffer(d))
      return d.byteLength;
    if (v.isURLSearchParams(d) && (d = d + ""), v.isString(d))
      return (await f(d)).byteLength;
  }, g = async (d, x) => {
    const A = v.toFiniteNumber(d.getContentLength());
    return A ?? C(x);
  };
  return async (d) => {
    let {
      url: x,
      method: A,
      data: _,
      signal: F,
      cancelToken: b,
      timeout: R,
      onDownloadProgress: w,
      onUploadProgress: S,
      responseType: B,
      headers: D,
      withCredentials: N = "same-origin",
      fetchOptions: U,
      maxContentLength: q,
      maxBodyLength: V,
      maxRedirects: Y
    } = Yi(d);
    const K = v.isNumber(q) && q > -1, W = v.isNumber(V) && V > -1, T = (j) => v.hasOwnProp(d, j) ? d[j] : void 0;
    let L = n || fetch;
    B = B ? (B + "").toLowerCase() : "text";
    let P = hc(
      [F, b && b.toAbortSignal()],
      R
    ), O = null;
    const X = P && P.unsubscribe && (() => {
      P.unsubscribe();
    });
    let G, ae = null, H = null;
    const Ne = () => new I(
      "Request body larger than maxBodyLength limit",
      I.ERR_BAD_REQUEST,
      d,
      O
    );
    try {
      let j;
      const ye = T("auth");
      if (ye) {
        const M = v.getSafeProp(ye, "username") || "", le = v.getSafeProp(ye, "password") || "";
        j = {
          username: M,
          password: le
        };
      }
      let ce;
      if (Fc(x)) {
        if (ce = new URL(x, oe.origin), !j && (ce.username || ce.password)) {
          const M = Cs(ce.username), le = Cs(ce.password);
          j = {
            username: M,
            password: le
          };
        }
        (ce.username || ce.password) && (ce.username = "", ce.password = "", x = ce.href);
      }
      if (j && (D.delete("authorization"), D.set(
        "Authorization",
        "Basic " + btoa(bc((j.username || "") + ":" + (j.password || "")))
      )), K && ce && ce.protocol === "data:" && Ac(ce.href) > q)
        throw new I(
          "maxContentLength size of " + q + " exceeded",
          I.ERR_BAD_RESPONSE,
          d,
          O
        );
      const Ee = v.isSpecCompliantForm(_) && ue.from(T("headers")).getContentType();
      let fe;
      if (v.isString(Ee) && /^multipart\/form-data(?:\s*;|$)/i.test(Ee.trim())) {
        const M = ue.parseParameters(Ee);
        v.hasOwnProp(M, "boundary") && (fe = M.boundary);
      }
      if (v.isSpecCompliantForm(_) && A !== "get" && A !== "head" && (W || S && p || fe !== void 0) && (_ = gc(
        _,
        o,
        W ? V : 1 / 0,
        Ne,
        fe
      ), D.setContentType(fe === void 0 ? _.type : Ee), G = _.size), W && A !== "get" && A !== "head") {
        const M = await C(_);
        if (typeof M == "number" && isFinite(M) && (G = M, M > V))
          throw Ne();
      }
      const Ue = W && (v.isReadableStream(_) || v.isStream(_)), ze = (M, le, be) => xs(
        M,
        Es,
        (Fe) => {
          if (W && Fe > V)
            throw ae = Ne();
          le && le(Fe);
        },
        be
      );
      if (p && A !== "get" && A !== "head" && (S || Ue)) {
        if (G = G ?? await g(D, _), G !== 0 || Ue) {
          let M = new i(x, {
            method: "POST",
            body: _,
            duplex: "half"
          }), le;
          if (v.isFormData(_) && (le = M.headers.get("content-type")) && D.setContentType(le), M.body) {
            const [be, Fe] = S && cs(
              G,
              Jt(ls(S))
            ) || [];
            _ = ze(M.body, be, Fe);
          }
        }
      } else if (Ue && !c && h && A !== "get" && A !== "head")
        _ = ze(_);
      else if (Ue && c && !p && A !== "get" && A !== "head")
        throw new I(
          "Stream request bodies are not supported by the current fetch implementation",
          I.ERR_NOT_SUPPORT,
          d,
          O
        );
      v.isString(N) || (N = N ? "include" : "omit");
      const at = c && "credentials" in i.prototype;
      if (v.isFormData(_)) {
        const M = D.getContentType();
        M && /^multipart\/form-data/i.test(M) && !/boundary=/i.test(M) && D.delete("content-type");
      }
      D.set("User-Agent", "axios/" + Dn, !1);
      const me = U == null ? U : Object.assign(/* @__PURE__ */ Object.create(null), U);
      me && (delete me.body, delete me.headers, delete me.method, delete me.signal, delete me.duplex, delete me.credentials);
      const Ae = Object.assign(/* @__PURE__ */ Object.create(null), me, {
        signal: P,
        method: A.toUpperCase(),
        headers: Pi(D.normalize()),
        body: _,
        duplex: "half",
        credentials: at ? N : void 0
      });
      c && (v.forEach(E, (M, le) => {
        Ae[le] === void 0 && (Ae[le] = M);
      }), Ae.signal === void 0 && (Ae.signal = null), Ae.body === void 0 && (Ae.body = null)), Y === 0 && (Ae.redirect = "manual", me && (me.redirect = "manual")), O = c && new i(x, Ae);
      let Ce = await (c ? L(O, me) : L(x, Ae));
      const we = ue.from(Ce.headers);
      if (K) {
        const M = v.toFiniteNumber(we.getContentLength());
        if (M != null && M > q)
          throw new I(
            "maxContentLength size of " + q + " exceeded",
            I.ERR_BAD_RESPONSE,
            d,
            O
          );
      }
      const ve = m && (B === "stream" || B === "response");
      if (m && Ce.body && (w || K || ve && X)) {
        const M = {};
        ["status", "statusText", "headers"].forEach((je) => {
          M[je] = Ce[je];
        });
        const le = v.toFiniteNumber(we.getContentLength()), [be, Fe] = w && cs(
          le,
          Jt(ls(w), !0)
        ) || [];
        let Tt = 0;
        const Pt = (je) => {
          if (K && (Tt = je, Tt > q))
            throw H = new I(
              "maxContentLength size of " + q + " exceeded",
              I.ERR_BAD_RESPONSE,
              d,
              O
            );
          be && be(je);
        };
        Ce = new a(
          xs(Ce.body, Es, Pt, () => {
            Fe && Fe(), X && X();
          }),
          M
        );
      }
      B = B || "text";
      let he = await y[v.findKey(y, B) || "text"](
        Ce,
        d
      );
      if (K && !m && !ve) {
        let M;
        if (he != null && (typeof he.byteLength == "number" ? M = he.byteLength : typeof he.size == "number" ? M = he.size : typeof he == "string" && (M = typeof r == "function" ? new r().encode(he).byteLength : he.length)), typeof M == "number" && M > q)
          throw new I(
            "maxContentLength size of " + q + " exceeded",
            I.ERR_BAD_RESPONSE,
            d,
            O
          );
      }
      return !ve && X && X(), await new Promise((M, le) => {
        Gi(M, le, {
          data: he,
          headers: ue.from(Ce.headers),
          status: Ce.status,
          statusText: Ce.statusText,
          config: d,
          request: O
        });
      });
    } catch (j) {
      if (X && X(), P && P.aborted && P.reason instanceof I) {
        const ye = P.reason;
        throw ye.config = d, O && (ye.request = O), j !== ye && Object.defineProperty(ye, "cause", {
          __proto__: null,
          value: j,
          writable: !0,
          enumerable: !1,
          configurable: !0
        }), ye;
      }
      if (ae)
        throw O && !ae.request && (ae.request = O), ae;
      if (H)
        throw H;
      if (j instanceof I)
        throw O && !j.request && (j.request = O), j;
      if (j && j.name === "TypeError" && /Load failed|fetch/i.test(j.message)) {
        const ye = new I(
          "Network Error",
          I.ERR_NETWORK,
          d,
          O,
          j && j.response
        );
        throw Object.defineProperty(ye, "cause", {
          __proto__: null,
          value: j.cause || j,
          writable: !0,
          enumerable: !1,
          configurable: !0
        }), ye;
      }
      throw I.from(j, j && j.code, d, O, j && j.response);
    }
  };
}, Bc = /* @__PURE__ */ new Map(), Qi = (s) => {
  const e = /* @__PURE__ */ Object.create(null), t = s && v.hasOwnProp(s, "env") && s.env;
  ["fetch", "Request", "Response", "Blob"].forEach((p) => {
    t && v.hasOwnProp(t, p) && (e[p] = t[p]);
  });
  const { fetch: r, Request: n, Response: i, Blob: a } = e, o = [n, i, r, a];
  let l = o.length, c = l, u, h, f = Bc;
  for (; c--; )
    u = o[c], h = f.get(u), h === void 0 && f.set(u, h = c ? /* @__PURE__ */ new Map() : Sc(e)), f = h;
  return h;
};
Qi();
const Rn = {
  http: R0,
  xhr: fc,
  fetch: {
    get: Qi
  }
};
v.forEach(Rn, (s, e) => {
  if (s) {
    try {
      Object.defineProperty(s, "name", { __proto__: null, value: e });
    } catch {
    }
    Object.defineProperty(s, "adapterName", { __proto__: null, value: e });
  }
});
const ws = (s) => `- ${s}`, Dc = (s) => v.isFunction(s) || s === null || s === !1;
function Rc(s, e) {
  s = v.isArray(s) ? s : [s];
  const { length: t } = s;
  let r, n;
  const i = {};
  for (let a = 0; a < t; a++) {
    r = s[a];
    let o;
    if (n = r, !Dc(r) && (n = Rn[(o = String(r)).toLowerCase()], n === void 0))
      throw new I(`Unknown adapter '${o}'`);
    if (n && (v.isFunction(n) || (n = n.get(e))))
      break;
    i[o || "#" + a] = n;
  }
  if (!n) {
    const a = Object.entries(i).map(
      ([l, c]) => `adapter ${l} ` + (c === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let o = t ? a.length > 1 ? `since :
` + a.map(ws).join(`
`) : " " + ws(a[0]) : "as no adapter specified";
    throw new I(
      "There is no suitable adapter to dispatch the request " + o,
      I.ERR_NOT_SUPPORT
    );
  }
  return n;
}
const ea = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Rc,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: Rn
};
function gr(s) {
  if (s.cancelToken && s.cancelToken.throwIfRequested(), s.signal && s.signal.aborted)
    throw new Ot(null, s);
}
function _s(s) {
  return Math.max(0, Date.now() - s);
}
function yr(s) {
  const e = v.toSafeFlatObject(s);
  gr(e), e.headers = ue.from(v.getSafeProp(e, "headers")), e.data = xr.call(e, e.transformRequest), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1);
  const t = ea.getAdapter(e.adapter || Rt.adapter, e), r = Date.now();
  return t(e).then(
    function(i) {
      gr(e), i.duration = _s(r), e.response = i;
      try {
        i.data = xr.call(e, e.transformResponse, i);
      } finally {
        delete e.response;
      }
      return i.headers = ue.from(i.headers), i;
    },
    function(i) {
      if (!Wi(i) && (gr(e), i && i.response)) {
        i.response.duration = _s(r), e.response = i.response;
        try {
          i.response.data = xr.call(
            e,
            e.transformResponse,
            i.response
          );
        } finally {
          delete e.response;
        }
        i.response.headers = ue.from(i.response.headers);
      }
      return Promise.reject(i);
    }
  );
}
const ar = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((s, e) => {
  ar[s] = function(r) {
    return typeof r === s || "a" + (e < 1 ? "n " : " ") + s;
  };
});
const As = {};
ar.transitional = function(e, t, r) {
  function n(i, a) {
    return "[Axios v" + Dn + "] Transitional option '" + i + "'" + a + (r ? ". " + r : "");
  }
  return (i, a, o) => {
    if (e === !1)
      throw new I(
        n(a, " has been removed" + (t ? " in " + t : "")),
        I.ERR_DEPRECATED
      );
    return t && !As[a] && (As[a] = !0, console.warn(
      n(
        a,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(i, a, o) : !0;
  };
};
ar.spelling = function(e) {
  return (t, r) => (console.warn(`${r} is likely a misspelling of ${e}`), !0);
};
function Oc(s, e, t) {
  if (typeof s != "object" || s === null)
    throw new I("options must be an object", I.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(s);
  let n = r.length;
  for (; n-- > 0; ) {
    const i = r[n], a = Object.prototype.hasOwnProperty.call(e, i) ? e[i] : void 0;
    if (a) {
      const o = s[i], l = o === void 0 || a(o, i, s);
      if (l !== !0)
        throw new I(
          "option " + i + " must be " + l,
          I.ERR_BAD_OPTION_VALUE
        );
      continue;
    }
    if (t !== !0)
      throw new I("Unknown option " + i, I.ERR_BAD_OPTION);
  }
}
const Wt = {
  assertOptions: Oc,
  validators: ar
}, de = Wt.validators, Er = (s) => {
  if (s == null || v.isPlainObject(s) || s instanceof ue)
    return !0;
  try {
    return v.isObject(s) && v.getSafeProp(s, Symbol.toStringTag) === "AxiosHeaders" && [
      "toJSON",
      "set",
      "get",
      "has",
      "delete",
      "clear",
      "normalize",
      "concat",
      "toString",
      Symbol.iterator
    ].every((e) => v.isFunction(v.getSafeProp(s, e)));
  } catch {
    return !1;
  }
};
let et = class {
  constructor(e) {
    this.defaults = e || {}, this.interceptors = {
      request: new is(),
      response: new is()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, t) {
    try {
      return await this._request(e, t);
    } catch (r) {
      if (r instanceof Error)
        try {
          let n = {};
          Error.captureStackTrace ? Error.captureStackTrace(n) : n = new Error();
          const i = n.stack;
          let a = "";
          if (typeof i == "string") {
            const o = i.indexOf(`
`);
            a = o === -1 ? "" : i.slice(o + 1);
          }
          if (!r.stack)
            r.stack = a;
          else if (a) {
            const o = a.indexOf(`
`), l = o === -1 ? -1 : a.indexOf(`
`, o + 1), c = l === -1 ? a : a.slice(l + 1), u = String(r.stack), h = B0(r, u), f = h === -1 ? u : u.slice(0, h), p = h === -1 ? "" : u.slice(h);
            f.endsWith(c) || (r.stack = f + `
` + a + p);
          }
        } catch {
        }
      throw r;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = nt(this.defaults, t);
    const { transitional: r, paramsSerializer: n, headers: i } = t;
    r !== void 0 && Wt.assertOptions(
      r,
      {
        silentJSONParsing: de.transitional(de.boolean),
        forcedJSONParsing: de.transitional(de.boolean),
        clarifyTimeoutError: de.transitional(de.boolean),
        legacyInterceptorReqResOrdering: de.transitional(de.boolean),
        advertiseZstdAcceptEncoding: de.transitional(de.boolean),
        validateStatusUndefinedResolves: de.transitional(de.boolean),
        encodeBasicAuthUsername: de.transitional(de.boolean)
      },
      !1
    ), n != null && (v.isFunction(n) ? t.paramsSerializer = {
      serialize: n
    } : Wt.assertOptions(
      n,
      {
        encode: de.function,
        serialize: de.function
      },
      !0
    )), t.allowAbsoluteUrls !== void 0 || (v.hasOwnProp(this.defaults, "allowAbsoluteUrls") && this.defaults.allowAbsoluteUrls !== void 0 ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), Wt.assertOptions(
      t,
      {
        baseUrl: de.spelling("baseURL"),
        withXsrfToken: de.spelling("withXSRFToken")
      },
      !0
    ), t.method = (v.getSafeProp(t, "method") || v.getSafeProp(this.defaults, "method") || "get").toLowerCase();
    const a = v.getSafeProp(i, "common"), o = v.getSafeProp(i, t.method), l = i && v.merge(
      Er(a) ? a : void 0,
      Er(o) ? o : void 0
    );
    i && v.forEach($i.concat("common"), (y) => {
      Er(v.getSafeProp(i, y)) && delete i[y];
    }), t.headers = ue.concat(l, i);
    const c = [];
    let u = !0;
    this.interceptors.request.forEach(function(C) {
      if (typeof C.runWhen == "function" && C.runWhen(t) === !1)
        return;
      u = u && C.synchronous;
      const g = t.transitional || Sn;
      g && g.legacyInterceptorReqResOrdering ? c.unshift(C.fulfilled, C.rejected) : c.push(C.fulfilled, C.rejected);
    });
    const h = [];
    this.interceptors.response.forEach(function(C) {
      h.push(C.fulfilled, C.rejected);
    });
    let f, p = 0, m;
    if (!u) {
      const y = [yr.bind(this), void 0];
      for (y.unshift(...c), y.push(...h), m = y.length, f = Promise.resolve(t); p < m; )
        f = f.then(y[p++], y[p++]);
      return f;
    }
    m = c.length;
    let E = t;
    for (; p < m; ) {
      const y = c[p++], C = c[p++];
      try {
        E = y ? y(E) : E;
      } catch (g) {
        if (!C) {
          f = Promise.reject(g);
          break;
        }
        try {
          const d = C.call(this, g);
          v.isThenable(d) && (f = Promise.resolve(d).then(
            () => yr.call(this, E)
          ));
        } catch (d) {
          f = Promise.reject(d);
        }
        break;
      }
    }
    if (!f)
      try {
        f = yr.call(this, E);
      } catch (y) {
        f = Promise.reject(y);
      }
    for (p = 0, m = h.length; p < m; )
      f = f.then(h[p++], h[p++]);
    return f;
  }
  getUri(e) {
    e = nt(this.defaults, e);
    const t = Zi(e.baseURL, e.url, e.allowAbsoluteUrls, e);
    return Ui(t, e.params, e.paramsSerializer);
  }
};
v.forEach(["delete", "get", "head", "options"], function(e) {
  et.prototype[e] = async function(t, r) {
    return this.request(
      nt(r || {}, {
        method: e,
        url: t,
        data: r && v.hasOwnProp(r, "data") ? r.data : void 0
      })
    );
  };
});
v.forEach(["post", "put", "patch", "query"], function(e) {
  function t(r) {
    return async function(i, a, o) {
      return this.request(
        nt(o || {}, {
          method: e,
          headers: r ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: i,
          data: a
        })
      );
    };
  }
  et.prototype[e] = t(), e !== "query" && (et.prototype[e + "Form"] = t(!0));
});
let Tc = class ta {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(i) {
      t = i;
    });
    const r = this;
    this.promise.then((n) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0; )
        r._listeners[i](n);
      r._listeners = null;
    }), this.promise.then = (n) => {
      let i;
      const a = new Promise((o) => {
        r.subscribe(o), i = o;
      }).then(n);
      return a.cancel = function() {
        r.unsubscribe(i);
      }, a;
    }, e(function(i, a, o) {
      r.reason || (r.reason = new Ot(i, a, o), t(r.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const t = this._listeners.indexOf(e);
    t !== -1 && this._listeners.splice(t, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), t = (r) => {
      e.abort(r);
    };
    return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new ta(function(n) {
        e = n;
      }),
      cancel: e
    };
  }
};
function Pc(s) {
  return function(t) {
    return s.apply(null, t);
  };
}
function Lc(s) {
  return v.isObject(s) && s.isAxiosError === !0;
}
const Gt = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  /**
   * @deprecated Use `ContentTooLarge` instead.
   */
  PayloadTooLarge: 413,
  ContentTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  /**
   * @deprecated Use `UnprocessableContent` instead.
   */
  UnprocessableEntity: 422,
  UnprocessableContent: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerReturnsAnUnknownError: 520,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(Gt).forEach(([s, e]) => {
  Gt[e] === void 0 && (Gt[e] = s);
});
function ra(s) {
  const e = new et(s), t = bi(et.prototype.request, e);
  return v.extend(t, et.prototype, e, { allOwnKeys: !0 }), v.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(n) {
    return ra(nt(s, n));
  }, t;
}
const ie = ra(Rt);
ie.Axios = et;
ie.CanceledError = Ot;
ie.CancelToken = Tc;
ie.isCancel = Wi;
ie.VERSION = Dn;
ie.toFormData = ir;
ie.AxiosError = I;
ie.Cancel = ie.CanceledError;
ie.all = function(e) {
  return Promise.all(e);
};
ie.spread = Pc;
ie.isAxiosError = Lc;
ie.mergeConfig = nt;
ie.AxiosHeaders = ue;
ie.formToJSON = (s) => ji(v.isHTMLForm(s) ? new FormData(s) : s);
ie.getAdapter = ea.getAdapter;
ie.HttpStatusCode = Gt;
ie.default = ie;
const {
  Axios: Ru,
  AxiosError: Ou,
  CanceledError: Tu,
  isCancel: Pu,
  CancelToken: Lu,
  VERSION: ku,
  all: Iu,
  Cancel: Nu,
  isAxiosError: Uu,
  spread: qu,
  toFormData: Mu,
  AxiosHeaders: Hu,
  HttpStatusCode: zu,
  formToJSON: ju,
  getAdapter: $u,
  mergeConfig: Wu,
  create: Gu
} = ie, De = {
  // AUTH ERRORS
  BASE_URL_MISSING: "BASE_URL_MISSING",
  CLIENT_ID_MISSING: "CLIENT_ID_MISSING",
  ACCESS_TOKEN_MISSING: "ACCESS_TOKEN_MISSING",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  ERROR_REFRESHING_ACCESS_TOKEN: "ERROR_REFRESHING_ACCESS_TOKEN",
  REFRESH_TOKEN_MISSING: "REFRESH_TOKEN_MISSING",
  CLIENT_CONFIGURATION_ERROR: "CLIENT_CONFIGURATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  // USER ERRORS
  USER_ID_INVALID: "USER_ID_INVALID"
};
class Re extends Error {
  constructor(e, t, r = null) {
    super(e), this.name = "ApiError", this.code = t, this.originalError = r;
  }
}
class kc {
  /**
   * @constructor
   * @param {String} baseUrl ex: https://iam-url/auth/realms/demo/protocol/openid-connect
   * @param {String} clientId 
   * @param {String} clientSecret (optionnel, non présent si PKCE)
   */
  constructor(e, t, r = null) {
    if (!e) throw new Re("An authentication url must be provided", De.BASE_URL_MISSING);
    if (!t) throw new Re("A clientId must be provided", De.CLIENT_ID_MISSING);
    this.clientId = t, this.clientSecret = r, this.expirationDate = null, this.refreshExpirationDate = null, this.token = null, this.refreshToken = null, this.usesPKCE = r === null, this.usesExternalToken = !1, this.axiosInstance = ie.create({
      baseURL: e
    }), this.primaryInProgress = !1, this.started = !1;
  }
  /**
     * Définit un token obtenu via SSO externe
     * @param {String} accessToken - Le token d'accès
     * @param {String} refreshToken - Le refresh token (optionnel)
     * @param {Number} expiresIn - Durée de validité en secondes (optionnel, défaut: 43200 -> 12 heures)
     * @param {Number} refreshExpiresIn - Durée de validité du refresh token (optionnel)
     */
  setExternalToken(e, t = null, r = 43200, n = null) {
    if (!e) throw new Re("Access token is required", De.ACCESS_TOKEN_MISSING);
    this.token = e, this.refreshToken = t, this.usesExternalToken = !0, this.started = !0;
    const i = /* @__PURE__ */ new Date();
    if (i.setSeconds(i.getSeconds() + r), this.expirationDate = i, t && n) {
      const a = /* @__PURE__ */ new Date();
      a.setSeconds(a.getSeconds() + n), this.refreshExpirationDate = a;
    }
  }
  /**
   * Recuperation de l'url de base de l'api d authentification
   * @return {String} l url de base de l api d authentification
   */
  getBaseUrl() {
    return this.axiosInstance.defaults.baseURL;
  }
  /**
   * Renvoie true si le token n'est plus valide, false sinon
   * @returns {Boolean}
   */
  isTokenExpired() {
    return !this.expirationDate || /* @__PURE__ */ new Date() > this.expirationDate;
  }
  /**
   * Renvoie true si le refresh token n'est plus valide, false sinon
   * @returns {Boolean}
   */
  isTokenRefreshExpired() {
    return !this.refreshExpirationDate || /* @__PURE__ */ new Date() > this.refreshExpirationDate;
  }
  /**
   * Calcule et stocke les dates d'expiration du token et du refresh token
   * @param {Integer} tokenExpiresIn le nombre de secondes dans lesquelles le token va expirer
   * @param {Integer} refreshTokenExpiresIn le nombre de secondes dans lesquelles le refresh token va expirer
   */
  setExpirationDates(e, t) {
    let r = /* @__PURE__ */ new Date();
    r.setSeconds(r.getSeconds() + e), this.expirationDate = r;
    let n = /* @__PURE__ */ new Date();
    n.setSeconds(n.getSeconds() + t), this.refreshExpirationDate = n;
  }
  /**
   * Calcule et stocke toutes les informations à récupérer à la suite d'une demande de token: 
   * le token, le refresh token et les dates d'expiration
   * @param {Object} response 
   */
  processTokenResponse(e) {
    this.setExpirationDates(e.expires_in, e.refresh_expires_in), this.token = e.access_token, this.refreshToken = e.refresh_token;
  }
  /**
   * Requête de base de récupération du token
   * @param {Object} credentials ex: {"username": "moi", "password": "topsecret"}
   * @return {Promise}
   */
  async getPrimaryToken(e) {
    if (!e.username || !e.password) throw new Error("Credentials must be provided");
    this.primaryInProgress = !0;
    let t = {
      username: e.username,
      password: e.password,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: "openid",
      grant_type: "password"
    };
    const r = new URLSearchParams(t);
    return await this.axiosInstance.post("/token", r);
  }
  /**
   * Requête de rafraîchissement du token
   * Besoin d'un refreshToken renseigné et valide
   * @returns {Promise}
   */
  async getRefreshToken() {
    if (!this.refreshToken) throw new Re("No refresh token found", De.REFRESH_TOKEN_MISSING);
    try {
      let e = {
        client_id: this.clientId,
        scope: "openid",
        refresh_token: this.refreshToken,
        grant_type: "refresh_token"
      };
      this.usesPKCE || (e.client_secret = this.clientSecret);
      const t = new URLSearchParams(e);
      return await this.axiosInstance.post("/token", t);
    } catch (e) {
      throw new Re("Error refreshing access token: " + e.message ? e.message : e, De.ERROR_REFRESHING_ACCESS_TOKEN);
    }
  }
  /**
   * Récupère un token selon les 3 configurations possibles:
   * Il n'existe pas ou il a expiré avec le refresh token
   * Il a expiré mais le refresh token est encore valable
   * Il n'a pas expiré
   * @param {Object} credentials ex: {"username": "moi", "password": "topsecret"}
   * @returns {Promise} la reponse contient la valeur du token seule
   */
  async fetchToken(e) {
    if (this.started = !0, this.usesExternalToken) {
      if (this.token && !this.isTokenExpired())
        return this.token;
      if (this.isTokenExpired() && !this.isTokenRefreshExpired()) {
        let t = await this.getRefreshToken();
        if (t.status !== 200) throw new Re("Error refreshing access token", De.ERROR_REFRESHING_ACCESS_TOKEN);
        return this.processTokenResponse(t.data), this.token;
      } else
        throw new Re("Token expired and refresh token is not valid", De.REFRESH_TOKEN_EXPIRED);
    } else {
      if (!e) throw new Error("Have to set credentials first");
      if (this.primaryInProgress && await new Promise((t) => setTimeout(t, 1e3)), !this.token || this.isTokenExpired() && this.isTokenRefreshExpired())
        try {
          let t = await this.getPrimaryToken(e);
          return this.primaryInProgress = !1, this.processTokenResponse(t.data), this.token;
        } catch (t) {
          throw t.message = "Access Token Error: " + t.message ? t.message : t, t;
        }
      else if (this.isTokenExpired() && !this.isTokenRefreshExpired())
        try {
          let t = await this.getRefreshToken();
          return this.processTokenResponse(t.data), this.token;
        } catch (t) {
          throw t.message = "Error refreshing access token: " + t.message ? t.message : t, t;
        }
      else
        return this.token;
    }
  }
  /**
   * Force l'expiration du token et du refreshToken
   * @return {Promise} contient le resultat de la requete revoke
   */
  async disconnect() {
    try {
      if (this.started = !1, !this.isTokenExpired()) {
        let e = {
          client_id: this.clientId,
          token: this.token
        };
        this.clientSecret && (e.client_secret = this.clientSecret);
        const t = new URLSearchParams(e);
        await this.axiosInstance.post("/revoke", t);
      }
      this.token = null, this.refreshToken = null, this.expirationDate = null, this.refreshExpirationDate = null;
    } catch (e) {
      throw e.message = "Error revoking access token:" + e.message, e;
    }
  }
}
function na(s, e, t) {
  e || (e = new FormData());
  let r = 0;
  for (var n in s) {
    let i = n;
    t && (i = t + "[" + n + "]");
    let a = s[n];
    if (a instanceof Blob) {
      r += 1;
      let l = a.type.split("/")[1], c = "document" + r + "." + l;
      e.append(i, a, c);
    } else {
      if (!a && typeof a != "boolean")
        continue;
      a instanceof Date || typeof a == "boolean" ? e.append(i, JSON.stringify(a)) : typeof a == "object" && (typeof a.keys == "function" && a.keys() || Object.keys(a) && Object.keys(a).length) ? na(a, e, i) : typeof a == "object" ? e.append(i, JSON.stringify(a)) : e.append(i, a);
    }
  }
  return e;
}
const qt = {
  getPermissions: [
    "fields",
    "page",
    "limit",
    "sort"
  ],
  getLayers: [
    "fields",
    "page",
    "limit",
    "sort"
  ],
  getTables: [
    "fields",
    "page",
    "limit",
    "sort"
  ],
  getColumns: [
    "fields",
    "page",
    "limit",
    "sort"
  ],
  get: [
    "fields"
  ],
  getUsers: [
    "fields",
    "page",
    "limit",
    "sort",
    "username",
    "surname",
    "firstname",
    "email"
  ],
  getCommunities: [
    "fields",
    "page",
    "limit",
    "sort",
    "description",
    "name"
  ],
  getMembers: [
    "roles",
    "fields",
    "page",
    "limit"
  ],
  getDatabases: [
    "fields",
    "page",
    "limit",
    "sort",
    "name",
    "title",
    "schema"
  ],
  getVersions: [
    "fields",
    "page",
    "limit"
  ],
  getUploads: [
    "fields",
    "sort",
    "page",
    "limit",
    "status",
    "tablename",
    "format",
    "error_message",
    "date",
    "user"
  ],
  getTransactions: [
    "fields",
    "sort",
    "page",
    "limit",
    "comment",
    "started_at",
    "finished_at",
    "status",
    "user"
  ],
  getReports: [
    "author",
    "territory",
    "departements",
    "commune",
    "communities",
    "opening_date",
    "updating_date",
    "closing_date",
    "input_device",
    "comment",
    "status",
    "attributes",
    "box",
    "fields",
    "sort",
    "page",
    "limit"
  ],
  getGeoservices: [
    "fields",
    "page",
    "limit",
    "sort",
    "description",
    "title",
    "owner"
  ],
  getTableMaxNumrec: [
    "bbox"
  ]
}, bs = {
  user: [
    "description",
    "administrator"
  ],
  community: [
    "name",
    "description",
    "email",
    "attributes",
    "default_comment",
    "active",
    "all_members_can_valid",
    "shared_extractions",
    "shared_georem",
    "offline_allowed",
    "open_without_affiliation",
    "open_with_email"
  ],
  layer: [
    "opacity",
    "visibility",
    "order",
    "role",
    "snapto",
    "geoservice",
    "table"
  ],
  member: [
    "profile",
    "active",
    "role",
    "user_id"
  ],
  database: [
    "title",
    "source",
    "description",
    "licence",
    "fullDownloadAllowed",
    "extent",
    "writableTimeRange",
    "adapter",
    "dbname",
    "schema",
    "host",
    "databaseType",
    "versioning",
    "conflict",
    "port",
    "username",
    "password",
    "territory"
  ],
  table: [
    "name",
    "title",
    "description",
    "id_name",
    "geometry_name",
    "min_zoom_level",
    "max_zoom_level",
    "tile_zoom_level",
    "position",
    "table_name",
    "style",
    "styles"
  ],
  transaction: [
    "comment",
    "actions",
    "geometry"
  ],
  permission: [
    "database",
    "community",
    "table",
    "column",
    "level"
  ],
  report: [
    "community",
    "geometry",
    "comment",
    "status",
    "sketch",
    "attributes",
    "input_device",
    "device_version"
  ],
  reply: [
    "title",
    "content",
    "status"
  ],
  geoservice: [
    "title",
    "type",
    "version",
    "description",
    "url",
    "format",
    "map_extent",
    "min_zoom",
    "max_zoom",
    "input_mask",
    "box_srid",
    "owner",
    "attribution_name",
    "layers",
    "attribution_url",
    "attribution_logo_url",
    "status",
    "allowed_communities"
  ]
}, Fs = {
  community: [
    "name"
  ],
  layer: [
    "order"
  ],
  member: [
    "user_id"
  ],
  table: [
    "name",
    "title",
    "id_name",
    "geometry_name",
    "table_name"
  ],
  transaction: [
    "comment",
    "actions"
  ],
  permission: [
    "database",
    "community",
    "level"
  ],
  report: [
    "geometry"
  ],
  geoservice: [
    "title",
    "version",
    "url"
  ]
};
function ne(s, e) {
  let t = qt[e] ? qt[e] : qt[e.substring(0, 3)] ? qt[e.substring(0, 3)] : null;
  if (t) {
    for (const r in s)
      if (t.indexOf(r) == -1) throw "Invalid parameter " + r + ": must be in [" + t.concat(", ") + "]";
  }
}
function k(s) {
  if (isNaN(parseInt(s)) || parseInt(s) < 0) throw "id must be a positive number";
}
function J(s, e) {
  const t = e.replace(/add|put|patch/, "").toLowerCase();
  let r = bs[t] ? bs[t] : null, n = Fs[t] ? Fs[t] : null;
  if (r) {
    for (const i in s)
      if (r.indexOf(i) == -1 && !(s[i] instanceof Blob)) throw "Invalid field " + i + ": must be in [" + r.concat(", ") + "]";
  }
  if (e.indexOf("patch") == -1) {
    for (const i in n)
      if (Object.keys(s).indexOf(n[i]) == -1) throw "Missing mandatory field " + n[i];
  }
}
function vr(s) {
  let e = 0;
  for (var t in s)
    if (s[t] instanceof Blob && (e += 1, e > 4))
      throw "Maximum 4 documents";
}
var z = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ic(s) {
  if (s.__esModule) return s;
  var e = s.default;
  if (typeof e == "function") {
    var t = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(s).forEach(function(r) {
    var n = Object.getOwnPropertyDescriptor(s, r);
    Object.defineProperty(t, r, n.get ? n : {
      enumerable: !0,
      get: function() {
        return s[r];
      }
    });
  }), t;
}
var sa = { exports: {} };
function Nc(s) {
  throw new Error('Could not dynamically require "' + s + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Cr = { exports: {} };
const Uc = {}, qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Uc
}, Symbol.toStringTag, { value: "Module" })), Mc = /* @__PURE__ */ Ic(qc);
var Ss;
function $() {
  return Ss || (Ss = 1, function(s, e) {
    (function(t, r) {
      s.exports = r();
    })(z, function() {
      var t = t || function(r, n) {
        var i;
        if (typeof window < "u" && window.crypto && (i = window.crypto), typeof self < "u" && self.crypto && (i = self.crypto), typeof globalThis < "u" && globalThis.crypto && (i = globalThis.crypto), !i && typeof window < "u" && window.msCrypto && (i = window.msCrypto), !i && typeof z < "u" && z.crypto && (i = z.crypto), !i && typeof Nc == "function")
          try {
            i = Mc;
          } catch {
          }
        var a = function() {
          if (i) {
            if (typeof i.getRandomValues == "function")
              try {
                return i.getRandomValues(new Uint32Array(1))[0];
              } catch {
              }
            if (typeof i.randomBytes == "function")
              try {
                return i.randomBytes(4).readInt32LE();
              } catch {
              }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        }, o = Object.create || /* @__PURE__ */ function() {
          function g() {
          }
          return function(d) {
            var x;
            return g.prototype = d, x = new g(), g.prototype = null, x;
          };
        }(), l = {}, c = l.lib = {}, u = c.Base = /* @__PURE__ */ function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(g) {
              var d = o(this);
              return g && d.mixIn(g), (!d.hasOwnProperty("init") || this.init === d.init) && (d.init = function() {
                d.$super.init.apply(this, arguments);
              }), d.init.prototype = d, d.$super = this, d;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var g = this.extend();
              return g.init.apply(g, arguments), g;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(g) {
              for (var d in g)
                g.hasOwnProperty(d) && (this[d] = g[d]);
              g.hasOwnProperty("toString") && (this.toString = g.toString);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }(), h = c.WordArray = u.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(g, d) {
            g = this.words = g || [], d != n ? this.sigBytes = d : this.sigBytes = g.length * 4;
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(g) {
            return (g || p).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(g) {
            var d = this.words, x = g.words, A = this.sigBytes, _ = g.sigBytes;
            if (this.clamp(), A % 4)
              for (var F = 0; F < _; F++) {
                var b = x[F >>> 2] >>> 24 - F % 4 * 8 & 255;
                d[A + F >>> 2] |= b << 24 - (A + F) % 4 * 8;
              }
            else
              for (var R = 0; R < _; R += 4)
                d[A + R >>> 2] = x[R >>> 2];
            return this.sigBytes += _, this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var g = this.words, d = this.sigBytes;
            g[d >>> 2] &= 4294967295 << 32 - d % 4 * 8, g.length = r.ceil(d / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var g = u.clone.call(this);
            return g.words = this.words.slice(0), g;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(g) {
            for (var d = [], x = 0; x < g; x += 4)
              d.push(a());
            return new h.init(d, g);
          }
        }), f = l.enc = {}, p = f.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(g) {
            for (var d = g.words, x = g.sigBytes, A = [], _ = 0; _ < x; _++) {
              var F = d[_ >>> 2] >>> 24 - _ % 4 * 8 & 255;
              A.push((F >>> 4).toString(16)), A.push((F & 15).toString(16));
            }
            return A.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(g) {
            for (var d = g.length, x = [], A = 0; A < d; A += 2)
              x[A >>> 3] |= parseInt(g.substr(A, 2), 16) << 24 - A % 8 * 4;
            return new h.init(x, d / 2);
          }
        }, m = f.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(g) {
            for (var d = g.words, x = g.sigBytes, A = [], _ = 0; _ < x; _++) {
              var F = d[_ >>> 2] >>> 24 - _ % 4 * 8 & 255;
              A.push(String.fromCharCode(F));
            }
            return A.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(g) {
            for (var d = g.length, x = [], A = 0; A < d; A++)
              x[A >>> 2] |= (g.charCodeAt(A) & 255) << 24 - A % 4 * 8;
            return new h.init(x, d);
          }
        }, E = f.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(g) {
            try {
              return decodeURIComponent(escape(m.stringify(g)));
            } catch {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(g) {
            return m.parse(unescape(encodeURIComponent(g)));
          }
        }, y = c.BufferedBlockAlgorithm = u.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new h.init(), this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(g) {
            typeof g == "string" && (g = E.parse(g)), this._data.concat(g), this._nDataBytes += g.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(g) {
            var d, x = this._data, A = x.words, _ = x.sigBytes, F = this.blockSize, b = F * 4, R = _ / b;
            g ? R = r.ceil(R) : R = r.max((R | 0) - this._minBufferSize, 0);
            var w = R * F, S = r.min(w * 4, _);
            if (w) {
              for (var B = 0; B < w; B += F)
                this._doProcessBlock(A, B);
              d = A.splice(0, w), x.sigBytes -= S;
            }
            return new h.init(d, S);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var g = u.clone.call(this);
            return g._data = this._data.clone(), g;
          },
          _minBufferSize: 0
        });
        c.Hasher = y.extend({
          /**
           * Configuration options.
           */
          cfg: u.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(g) {
            this.cfg = this.cfg.extend(g), this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            y.reset.call(this), this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(g) {
            return this._append(g), this._process(), this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(g) {
            g && this._append(g);
            var d = this._doFinalize();
            return d;
          },
          blockSize: 16,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(g) {
            return function(d, x) {
              return new g.init(x).finalize(d);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(g) {
            return function(d, x) {
              return new C.HMAC.init(g, x).finalize(d);
            };
          }
        });
        var C = l.algo = {};
        return l;
      }(Math);
      return t;
    });
  }(Cr)), Cr.exports;
}
var wr = { exports: {} }, Bs;
function or() {
  return Bs || (Bs = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function(r) {
        var n = t, i = n.lib, a = i.Base, o = i.WordArray, l = n.x64 = {};
        l.Word = a.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function(c, u) {
            this.high = c, this.low = u;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },
          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },
          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }
        }), l.WordArray = a.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function(c, u) {
            c = this.words = c || [], u != r ? this.sigBytes = u : this.sigBytes = c.length * 8;
          },
          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function() {
            for (var c = this.words, u = c.length, h = [], f = 0; f < u; f++) {
              var p = c[f];
              h.push(p.high), h.push(p.low);
            }
            return o.create(h, this.sigBytes);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function() {
            for (var c = a.clone.call(this), u = c.words = this.words.slice(0), h = u.length, f = 0; f < h; f++)
              u[f] = u[f].clone();
            return c;
          }
        });
      }(), t;
    });
  }(wr)), wr.exports;
}
var _r = { exports: {} }, Ds;
function Hc() {
  return Ds || (Ds = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function() {
        if (typeof ArrayBuffer == "function") {
          var r = t, n = r.lib, i = n.WordArray, a = i.init, o = i.init = function(l) {
            if (l instanceof ArrayBuffer && (l = new Uint8Array(l)), (l instanceof Int8Array || typeof Uint8ClampedArray < "u" && l instanceof Uint8ClampedArray || l instanceof Int16Array || l instanceof Uint16Array || l instanceof Int32Array || l instanceof Uint32Array || l instanceof Float32Array || l instanceof Float64Array) && (l = new Uint8Array(l.buffer, l.byteOffset, l.byteLength)), l instanceof Uint8Array) {
              for (var c = l.byteLength, u = [], h = 0; h < c; h++)
                u[h >>> 2] |= l[h] << 24 - h % 4 * 8;
              a.call(this, u, c);
            } else
              a.apply(this, arguments);
          };
          o.prototype = i;
        }
      }(), t.lib.WordArray;
    });
  }(_r)), _r.exports;
}
var Ar = { exports: {} }, Rs;
function zc() {
  return Rs || (Rs = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.WordArray, a = r.enc;
        a.Utf16 = a.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function(l) {
            for (var c = l.words, u = l.sigBytes, h = [], f = 0; f < u; f += 2) {
              var p = c[f >>> 2] >>> 16 - f % 4 * 8 & 65535;
              h.push(String.fromCharCode(p));
            }
            return h.join("");
          },
          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function(l) {
            for (var c = l.length, u = [], h = 0; h < c; h++)
              u[h >>> 1] |= l.charCodeAt(h) << 16 - h % 2 * 16;
            return i.create(u, c * 2);
          }
        }, a.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function(l) {
            for (var c = l.words, u = l.sigBytes, h = [], f = 0; f < u; f += 2) {
              var p = o(c[f >>> 2] >>> 16 - f % 4 * 8 & 65535);
              h.push(String.fromCharCode(p));
            }
            return h.join("");
          },
          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function(l) {
            for (var c = l.length, u = [], h = 0; h < c; h++)
              u[h >>> 1] |= o(l.charCodeAt(h) << 16 - h % 2 * 16);
            return i.create(u, c * 2);
          }
        };
        function o(l) {
          return l << 8 & 4278255360 | l >>> 8 & 16711935;
        }
      }(), t.enc.Utf16;
    });
  }(Ar)), Ar.exports;
}
var br = { exports: {} }, Os;
function st() {
  return Os || (Os = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.WordArray, a = r.enc;
        a.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function(l) {
            var c = l.words, u = l.sigBytes, h = this._map;
            l.clamp();
            for (var f = [], p = 0; p < u; p += 3)
              for (var m = c[p >>> 2] >>> 24 - p % 4 * 8 & 255, E = c[p + 1 >>> 2] >>> 24 - (p + 1) % 4 * 8 & 255, y = c[p + 2 >>> 2] >>> 24 - (p + 2) % 4 * 8 & 255, C = m << 16 | E << 8 | y, g = 0; g < 4 && p + g * 0.75 < u; g++)
                f.push(h.charAt(C >>> 6 * (3 - g) & 63));
            var d = h.charAt(64);
            if (d)
              for (; f.length % 4; )
                f.push(d);
            return f.join("");
          },
          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function(l) {
            var c = l.length, u = this._map, h = this._reverseMap;
            if (!h) {
              h = this._reverseMap = [];
              for (var f = 0; f < u.length; f++)
                h[u.charCodeAt(f)] = f;
            }
            var p = u.charAt(64);
            if (p) {
              var m = l.indexOf(p);
              m !== -1 && (c = m);
            }
            return o(l, c, h);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function o(l, c, u) {
          for (var h = [], f = 0, p = 0; p < c; p++)
            if (p % 4) {
              var m = u[l.charCodeAt(p - 1)] << p % 4 * 2, E = u[l.charCodeAt(p)] >>> 6 - p % 4 * 2, y = m | E;
              h[f >>> 2] |= y << 24 - f % 4 * 8, f++;
            }
          return i.create(h, f);
        }
      }(), t.enc.Base64;
    });
  }(br)), br.exports;
}
var Fr = { exports: {} }, Ts;
function jc() {
  return Ts || (Ts = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.WordArray, a = r.enc;
        a.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function(l, c) {
            c === void 0 && (c = !0);
            var u = l.words, h = l.sigBytes, f = c ? this._safe_map : this._map;
            l.clamp();
            for (var p = [], m = 0; m < h; m += 3)
              for (var E = u[m >>> 2] >>> 24 - m % 4 * 8 & 255, y = u[m + 1 >>> 2] >>> 24 - (m + 1) % 4 * 8 & 255, C = u[m + 2 >>> 2] >>> 24 - (m + 2) % 4 * 8 & 255, g = E << 16 | y << 8 | C, d = 0; d < 4 && m + d * 0.75 < h; d++)
                p.push(f.charAt(g >>> 6 * (3 - d) & 63));
            var x = f.charAt(64);
            if (x)
              for (; p.length % 4; )
                p.push(x);
            return p.join("");
          },
          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function(l, c) {
            c === void 0 && (c = !0);
            var u = l.length, h = c ? this._safe_map : this._map, f = this._reverseMap;
            if (!f) {
              f = this._reverseMap = [];
              for (var p = 0; p < h.length; p++)
                f[h.charCodeAt(p)] = p;
            }
            var m = h.charAt(64);
            if (m) {
              var E = l.indexOf(m);
              E !== -1 && (u = E);
            }
            return o(l, u, f);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function o(l, c, u) {
          for (var h = [], f = 0, p = 0; p < c; p++)
            if (p % 4) {
              var m = u[l.charCodeAt(p - 1)] << p % 4 * 2, E = u[l.charCodeAt(p)] >>> 6 - p % 4 * 2, y = m | E;
              h[f >>> 2] |= y << 24 - f % 4 * 8, f++;
            }
          return i.create(h, f);
        }
      }(), t.enc.Base64url;
    });
  }(Fr)), Fr.exports;
}
var Sr = { exports: {} }, Ps;
function it() {
  return Ps || (Ps = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function(r) {
        var n = t, i = n.lib, a = i.WordArray, o = i.Hasher, l = n.algo, c = [];
        (function() {
          for (var E = 0; E < 64; E++)
            c[E] = r.abs(r.sin(E + 1)) * 4294967296 | 0;
        })();
        var u = l.MD5 = o.extend({
          _doReset: function() {
            this._hash = new a.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(E, y) {
            for (var C = 0; C < 16; C++) {
              var g = y + C, d = E[g];
              E[g] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
            }
            var x = this._hash.words, A = E[y + 0], _ = E[y + 1], F = E[y + 2], b = E[y + 3], R = E[y + 4], w = E[y + 5], S = E[y + 6], B = E[y + 7], D = E[y + 8], N = E[y + 9], U = E[y + 10], q = E[y + 11], V = E[y + 12], Y = E[y + 13], K = E[y + 14], W = E[y + 15], T = x[0], L = x[1], P = x[2], O = x[3];
            T = h(T, L, P, O, A, 7, c[0]), O = h(O, T, L, P, _, 12, c[1]), P = h(P, O, T, L, F, 17, c[2]), L = h(L, P, O, T, b, 22, c[3]), T = h(T, L, P, O, R, 7, c[4]), O = h(O, T, L, P, w, 12, c[5]), P = h(P, O, T, L, S, 17, c[6]), L = h(L, P, O, T, B, 22, c[7]), T = h(T, L, P, O, D, 7, c[8]), O = h(O, T, L, P, N, 12, c[9]), P = h(P, O, T, L, U, 17, c[10]), L = h(L, P, O, T, q, 22, c[11]), T = h(T, L, P, O, V, 7, c[12]), O = h(O, T, L, P, Y, 12, c[13]), P = h(P, O, T, L, K, 17, c[14]), L = h(L, P, O, T, W, 22, c[15]), T = f(T, L, P, O, _, 5, c[16]), O = f(O, T, L, P, S, 9, c[17]), P = f(P, O, T, L, q, 14, c[18]), L = f(L, P, O, T, A, 20, c[19]), T = f(T, L, P, O, w, 5, c[20]), O = f(O, T, L, P, U, 9, c[21]), P = f(P, O, T, L, W, 14, c[22]), L = f(L, P, O, T, R, 20, c[23]), T = f(T, L, P, O, N, 5, c[24]), O = f(O, T, L, P, K, 9, c[25]), P = f(P, O, T, L, b, 14, c[26]), L = f(L, P, O, T, D, 20, c[27]), T = f(T, L, P, O, Y, 5, c[28]), O = f(O, T, L, P, F, 9, c[29]), P = f(P, O, T, L, B, 14, c[30]), L = f(L, P, O, T, V, 20, c[31]), T = p(T, L, P, O, w, 4, c[32]), O = p(O, T, L, P, D, 11, c[33]), P = p(P, O, T, L, q, 16, c[34]), L = p(L, P, O, T, K, 23, c[35]), T = p(T, L, P, O, _, 4, c[36]), O = p(O, T, L, P, R, 11, c[37]), P = p(P, O, T, L, B, 16, c[38]), L = p(L, P, O, T, U, 23, c[39]), T = p(T, L, P, O, Y, 4, c[40]), O = p(O, T, L, P, A, 11, c[41]), P = p(P, O, T, L, b, 16, c[42]), L = p(L, P, O, T, S, 23, c[43]), T = p(T, L, P, O, N, 4, c[44]), O = p(O, T, L, P, V, 11, c[45]), P = p(P, O, T, L, W, 16, c[46]), L = p(L, P, O, T, F, 23, c[47]), T = m(T, L, P, O, A, 6, c[48]), O = m(O, T, L, P, B, 10, c[49]), P = m(P, O, T, L, K, 15, c[50]), L = m(L, P, O, T, w, 21, c[51]), T = m(T, L, P, O, V, 6, c[52]), O = m(O, T, L, P, b, 10, c[53]), P = m(P, O, T, L, U, 15, c[54]), L = m(L, P, O, T, _, 21, c[55]), T = m(T, L, P, O, D, 6, c[56]), O = m(O, T, L, P, W, 10, c[57]), P = m(P, O, T, L, S, 15, c[58]), L = m(L, P, O, T, Y, 21, c[59]), T = m(T, L, P, O, R, 6, c[60]), O = m(O, T, L, P, q, 10, c[61]), P = m(P, O, T, L, F, 15, c[62]), L = m(L, P, O, T, N, 21, c[63]), x[0] = x[0] + T | 0, x[1] = x[1] + L | 0, x[2] = x[2] + P | 0, x[3] = x[3] + O | 0;
          },
          _doFinalize: function() {
            var E = this._data, y = E.words, C = this._nDataBytes * 8, g = E.sigBytes * 8;
            y[g >>> 5] |= 128 << 24 - g % 32;
            var d = r.floor(C / 4294967296), x = C;
            y[(g + 64 >>> 9 << 4) + 15] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, y[(g + 64 >>> 9 << 4) + 14] = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360, E.sigBytes = (y.length + 1) * 4, this._process();
            for (var A = this._hash, _ = A.words, F = 0; F < 4; F++) {
              var b = _[F];
              _[F] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
            }
            return A;
          },
          clone: function() {
            var E = o.clone.call(this);
            return E._hash = this._hash.clone(), E;
          }
        });
        function h(E, y, C, g, d, x, A) {
          var _ = E + (y & C | ~y & g) + d + A;
          return (_ << x | _ >>> 32 - x) + y;
        }
        function f(E, y, C, g, d, x, A) {
          var _ = E + (y & g | C & ~g) + d + A;
          return (_ << x | _ >>> 32 - x) + y;
        }
        function p(E, y, C, g, d, x, A) {
          var _ = E + (y ^ C ^ g) + d + A;
          return (_ << x | _ >>> 32 - x) + y;
        }
        function m(E, y, C, g, d, x, A) {
          var _ = E + (C ^ (y | ~g)) + d + A;
          return (_ << x | _ >>> 32 - x) + y;
        }
        n.MD5 = o._createHelper(u), n.HmacMD5 = o._createHmacHelper(u);
      }(Math), t.MD5;
    });
  }(Sr)), Sr.exports;
}
var Br = { exports: {} }, Ls;
function ia() {
  return Ls || (Ls = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.WordArray, a = n.Hasher, o = r.algo, l = [], c = o.SHA1 = a.extend({
          _doReset: function() {
            this._hash = new i.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(u, h) {
            for (var f = this._hash.words, p = f[0], m = f[1], E = f[2], y = f[3], C = f[4], g = 0; g < 80; g++) {
              if (g < 16)
                l[g] = u[h + g] | 0;
              else {
                var d = l[g - 3] ^ l[g - 8] ^ l[g - 14] ^ l[g - 16];
                l[g] = d << 1 | d >>> 31;
              }
              var x = (p << 5 | p >>> 27) + C + l[g];
              g < 20 ? x += (m & E | ~m & y) + 1518500249 : g < 40 ? x += (m ^ E ^ y) + 1859775393 : g < 60 ? x += (m & E | m & y | E & y) - 1894007588 : x += (m ^ E ^ y) - 899497514, C = y, y = E, E = m << 30 | m >>> 2, m = p, p = x;
            }
            f[0] = f[0] + p | 0, f[1] = f[1] + m | 0, f[2] = f[2] + E | 0, f[3] = f[3] + y | 0, f[4] = f[4] + C | 0;
          },
          _doFinalize: function() {
            var u = this._data, h = u.words, f = this._nDataBytes * 8, p = u.sigBytes * 8;
            return h[p >>> 5] |= 128 << 24 - p % 32, h[(p + 64 >>> 9 << 4) + 14] = Math.floor(f / 4294967296), h[(p + 64 >>> 9 << 4) + 15] = f, u.sigBytes = h.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var u = a.clone.call(this);
            return u._hash = this._hash.clone(), u;
          }
        });
        r.SHA1 = a._createHelper(c), r.HmacSHA1 = a._createHmacHelper(c);
      }(), t.SHA1;
    });
  }(Br)), Br.exports;
}
var Dr = { exports: {} }, ks;
function On() {
  return ks || (ks = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      return function(r) {
        var n = t, i = n.lib, a = i.WordArray, o = i.Hasher, l = n.algo, c = [], u = [];
        (function() {
          function p(C) {
            for (var g = r.sqrt(C), d = 2; d <= g; d++)
              if (!(C % d))
                return !1;
            return !0;
          }
          function m(C) {
            return (C - (C | 0)) * 4294967296 | 0;
          }
          for (var E = 2, y = 0; y < 64; )
            p(E) && (y < 8 && (c[y] = m(r.pow(E, 1 / 2))), u[y] = m(r.pow(E, 1 / 3)), y++), E++;
        })();
        var h = [], f = l.SHA256 = o.extend({
          _doReset: function() {
            this._hash = new a.init(c.slice(0));
          },
          _doProcessBlock: function(p, m) {
            for (var E = this._hash.words, y = E[0], C = E[1], g = E[2], d = E[3], x = E[4], A = E[5], _ = E[6], F = E[7], b = 0; b < 64; b++) {
              if (b < 16)
                h[b] = p[m + b] | 0;
              else {
                var R = h[b - 15], w = (R << 25 | R >>> 7) ^ (R << 14 | R >>> 18) ^ R >>> 3, S = h[b - 2], B = (S << 15 | S >>> 17) ^ (S << 13 | S >>> 19) ^ S >>> 10;
                h[b] = w + h[b - 7] + B + h[b - 16];
              }
              var D = x & A ^ ~x & _, N = y & C ^ y & g ^ C & g, U = (y << 30 | y >>> 2) ^ (y << 19 | y >>> 13) ^ (y << 10 | y >>> 22), q = (x << 26 | x >>> 6) ^ (x << 21 | x >>> 11) ^ (x << 7 | x >>> 25), V = F + q + D + u[b] + h[b], Y = U + N;
              F = _, _ = A, A = x, x = d + V | 0, d = g, g = C, C = y, y = V + Y | 0;
            }
            E[0] = E[0] + y | 0, E[1] = E[1] + C | 0, E[2] = E[2] + g | 0, E[3] = E[3] + d | 0, E[4] = E[4] + x | 0, E[5] = E[5] + A | 0, E[6] = E[6] + _ | 0, E[7] = E[7] + F | 0;
          },
          _doFinalize: function() {
            var p = this._data, m = p.words, E = this._nDataBytes * 8, y = p.sigBytes * 8;
            return m[y >>> 5] |= 128 << 24 - y % 32, m[(y + 64 >>> 9 << 4) + 14] = r.floor(E / 4294967296), m[(y + 64 >>> 9 << 4) + 15] = E, p.sigBytes = m.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var p = o.clone.call(this);
            return p._hash = this._hash.clone(), p;
          }
        });
        n.SHA256 = o._createHelper(f), n.HmacSHA256 = o._createHmacHelper(f);
      }(Math), t.SHA256;
    });
  }(Dr)), Dr.exports;
}
var Rr = { exports: {} }, Is;
function $c() {
  return Is || (Is = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), On());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.WordArray, a = r.algo, o = a.SHA256, l = a.SHA224 = o.extend({
          _doReset: function() {
            this._hash = new i.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var c = o._doFinalize.call(this);
            return c.sigBytes -= 4, c;
          }
        });
        r.SHA224 = o._createHelper(l), r.HmacSHA224 = o._createHmacHelper(l);
      }(), t.SHA224;
    });
  }(Rr)), Rr.exports;
}
var Or = { exports: {} }, Ns;
function aa() {
  return Ns || (Ns = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), or());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.Hasher, a = r.x64, o = a.Word, l = a.WordArray, c = r.algo;
        function u() {
          return o.create.apply(o, arguments);
        }
        var h = [
          u(1116352408, 3609767458),
          u(1899447441, 602891725),
          u(3049323471, 3964484399),
          u(3921009573, 2173295548),
          u(961987163, 4081628472),
          u(1508970993, 3053834265),
          u(2453635748, 2937671579),
          u(2870763221, 3664609560),
          u(3624381080, 2734883394),
          u(310598401, 1164996542),
          u(607225278, 1323610764),
          u(1426881987, 3590304994),
          u(1925078388, 4068182383),
          u(2162078206, 991336113),
          u(2614888103, 633803317),
          u(3248222580, 3479774868),
          u(3835390401, 2666613458),
          u(4022224774, 944711139),
          u(264347078, 2341262773),
          u(604807628, 2007800933),
          u(770255983, 1495990901),
          u(1249150122, 1856431235),
          u(1555081692, 3175218132),
          u(1996064986, 2198950837),
          u(2554220882, 3999719339),
          u(2821834349, 766784016),
          u(2952996808, 2566594879),
          u(3210313671, 3203337956),
          u(3336571891, 1034457026),
          u(3584528711, 2466948901),
          u(113926993, 3758326383),
          u(338241895, 168717936),
          u(666307205, 1188179964),
          u(773529912, 1546045734),
          u(1294757372, 1522805485),
          u(1396182291, 2643833823),
          u(1695183700, 2343527390),
          u(1986661051, 1014477480),
          u(2177026350, 1206759142),
          u(2456956037, 344077627),
          u(2730485921, 1290863460),
          u(2820302411, 3158454273),
          u(3259730800, 3505952657),
          u(3345764771, 106217008),
          u(3516065817, 3606008344),
          u(3600352804, 1432725776),
          u(4094571909, 1467031594),
          u(275423344, 851169720),
          u(430227734, 3100823752),
          u(506948616, 1363258195),
          u(659060556, 3750685593),
          u(883997877, 3785050280),
          u(958139571, 3318307427),
          u(1322822218, 3812723403),
          u(1537002063, 2003034995),
          u(1747873779, 3602036899),
          u(1955562222, 1575990012),
          u(2024104815, 1125592928),
          u(2227730452, 2716904306),
          u(2361852424, 442776044),
          u(2428436474, 593698344),
          u(2756734187, 3733110249),
          u(3204031479, 2999351573),
          u(3329325298, 3815920427),
          u(3391569614, 3928383900),
          u(3515267271, 566280711),
          u(3940187606, 3454069534),
          u(4118630271, 4000239992),
          u(116418474, 1914138554),
          u(174292421, 2731055270),
          u(289380356, 3203993006),
          u(460393269, 320620315),
          u(685471733, 587496836),
          u(852142971, 1086792851),
          u(1017036298, 365543100),
          u(1126000580, 2618297676),
          u(1288033470, 3409855158),
          u(1501505948, 4234509866),
          u(1607167915, 987167468),
          u(1816402316, 1246189591)
        ], f = [];
        (function() {
          for (var m = 0; m < 80; m++)
            f[m] = u();
        })();
        var p = c.SHA512 = i.extend({
          _doReset: function() {
            this._hash = new l.init([
              new o.init(1779033703, 4089235720),
              new o.init(3144134277, 2227873595),
              new o.init(1013904242, 4271175723),
              new o.init(2773480762, 1595750129),
              new o.init(1359893119, 2917565137),
              new o.init(2600822924, 725511199),
              new o.init(528734635, 4215389547),
              new o.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(m, E) {
            for (var y = this._hash.words, C = y[0], g = y[1], d = y[2], x = y[3], A = y[4], _ = y[5], F = y[6], b = y[7], R = C.high, w = C.low, S = g.high, B = g.low, D = d.high, N = d.low, U = x.high, q = x.low, V = A.high, Y = A.low, K = _.high, W = _.low, T = F.high, L = F.low, P = b.high, O = b.low, X = R, G = w, ae = S, H = B, Ne = D, j = N, ye = U, ce = q, Ee = V, fe = Y, Ue = K, ze = W, at = T, me = L, Ae = P, Ce = O, we = 0; we < 80; we++) {
              var ve, he, M = f[we];
              if (we < 16)
                he = M.high = m[E + we * 2] | 0, ve = M.low = m[E + we * 2 + 1] | 0;
              else {
                var le = f[we - 15], be = le.high, Fe = le.low, Tt = (be >>> 1 | Fe << 31) ^ (be >>> 8 | Fe << 24) ^ be >>> 7, Pt = (Fe >>> 1 | be << 31) ^ (Fe >>> 8 | be << 24) ^ (Fe >>> 7 | be << 25), je = f[we - 2], ot = je.high, yt = je.low, ca = (ot >>> 19 | yt << 13) ^ (ot << 3 | yt >>> 29) ^ ot >>> 6, Ln = (yt >>> 19 | ot << 13) ^ (yt << 3 | ot >>> 29) ^ (yt >>> 6 | ot << 26), kn = f[we - 7], la = kn.high, ua = kn.low, In = f[we - 16], fa = In.high, Nn = In.low;
                ve = Pt + ua, he = Tt + la + (ve >>> 0 < Pt >>> 0 ? 1 : 0), ve = ve + Ln, he = he + ca + (ve >>> 0 < Ln >>> 0 ? 1 : 0), ve = ve + Nn, he = he + fa + (ve >>> 0 < Nn >>> 0 ? 1 : 0), M.high = he, M.low = ve;
              }
              var ha = Ee & Ue ^ ~Ee & at, Un = fe & ze ^ ~fe & me, da = X & ae ^ X & Ne ^ ae & Ne, xa = G & H ^ G & j ^ H & j, pa = (X >>> 28 | G << 4) ^ (X << 30 | G >>> 2) ^ (X << 25 | G >>> 7), qn = (G >>> 28 | X << 4) ^ (G << 30 | X >>> 2) ^ (G << 25 | X >>> 7), ma = (Ee >>> 14 | fe << 18) ^ (Ee >>> 18 | fe << 14) ^ (Ee << 23 | fe >>> 9), ga = (fe >>> 14 | Ee << 18) ^ (fe >>> 18 | Ee << 14) ^ (fe << 23 | Ee >>> 9), Mn = h[we], ya = Mn.high, Hn = Mn.low, Se = Ce + ga, $e = Ae + ma + (Se >>> 0 < Ce >>> 0 ? 1 : 0), Se = Se + Un, $e = $e + ha + (Se >>> 0 < Un >>> 0 ? 1 : 0), Se = Se + Hn, $e = $e + ya + (Se >>> 0 < Hn >>> 0 ? 1 : 0), Se = Se + ve, $e = $e + he + (Se >>> 0 < ve >>> 0 ? 1 : 0), zn = qn + xa, Ea = pa + da + (zn >>> 0 < qn >>> 0 ? 1 : 0);
              Ae = at, Ce = me, at = Ue, me = ze, Ue = Ee, ze = fe, fe = ce + Se | 0, Ee = ye + $e + (fe >>> 0 < ce >>> 0 ? 1 : 0) | 0, ye = Ne, ce = j, Ne = ae, j = H, ae = X, H = G, G = Se + zn | 0, X = $e + Ea + (G >>> 0 < Se >>> 0 ? 1 : 0) | 0;
            }
            w = C.low = w + G, C.high = R + X + (w >>> 0 < G >>> 0 ? 1 : 0), B = g.low = B + H, g.high = S + ae + (B >>> 0 < H >>> 0 ? 1 : 0), N = d.low = N + j, d.high = D + Ne + (N >>> 0 < j >>> 0 ? 1 : 0), q = x.low = q + ce, x.high = U + ye + (q >>> 0 < ce >>> 0 ? 1 : 0), Y = A.low = Y + fe, A.high = V + Ee + (Y >>> 0 < fe >>> 0 ? 1 : 0), W = _.low = W + ze, _.high = K + Ue + (W >>> 0 < ze >>> 0 ? 1 : 0), L = F.low = L + me, F.high = T + at + (L >>> 0 < me >>> 0 ? 1 : 0), O = b.low = O + Ce, b.high = P + Ae + (O >>> 0 < Ce >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var m = this._data, E = m.words, y = this._nDataBytes * 8, C = m.sigBytes * 8;
            E[C >>> 5] |= 128 << 24 - C % 32, E[(C + 128 >>> 10 << 5) + 30] = Math.floor(y / 4294967296), E[(C + 128 >>> 10 << 5) + 31] = y, m.sigBytes = E.length * 4, this._process();
            var g = this._hash.toX32();
            return g;
          },
          clone: function() {
            var m = i.clone.call(this);
            return m._hash = this._hash.clone(), m;
          },
          blockSize: 1024 / 32
        });
        r.SHA512 = i._createHelper(p), r.HmacSHA512 = i._createHmacHelper(p);
      }(), t.SHA512;
    });
  }(Or)), Or.exports;
}
var Tr = { exports: {} }, Us;
function Wc() {
  return Us || (Us = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), or(), aa());
    })(z, function(t) {
      return function() {
        var r = t, n = r.x64, i = n.Word, a = n.WordArray, o = r.algo, l = o.SHA512, c = o.SHA384 = l.extend({
          _doReset: function() {
            this._hash = new a.init([
              new i.init(3418070365, 3238371032),
              new i.init(1654270250, 914150663),
              new i.init(2438529370, 812702999),
              new i.init(355462360, 4144912697),
              new i.init(1731405415, 4290775857),
              new i.init(2394180231, 1750603025),
              new i.init(3675008525, 1694076839),
              new i.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var u = l._doFinalize.call(this);
            return u.sigBytes -= 16, u;
          }
        });
        r.SHA384 = l._createHelper(c), r.HmacSHA384 = l._createHmacHelper(c);
      }(), t.SHA384;
    });
  }(Tr)), Tr.exports;
}
var Pr = { exports: {} }, qs;
function Gc() {
  return qs || (qs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), or());
    })(z, function(t) {
      return function(r) {
        var n = t, i = n.lib, a = i.WordArray, o = i.Hasher, l = n.x64, c = l.Word, u = n.algo, h = [], f = [], p = [];
        (function() {
          for (var y = 1, C = 0, g = 0; g < 24; g++) {
            h[y + 5 * C] = (g + 1) * (g + 2) / 2 % 64;
            var d = C % 5, x = (2 * y + 3 * C) % 5;
            y = d, C = x;
          }
          for (var y = 0; y < 5; y++)
            for (var C = 0; C < 5; C++)
              f[y + 5 * C] = C + (2 * y + 3 * C) % 5 * 5;
          for (var A = 1, _ = 0; _ < 24; _++) {
            for (var F = 0, b = 0, R = 0; R < 7; R++) {
              if (A & 1) {
                var w = (1 << R) - 1;
                w < 32 ? b ^= 1 << w : F ^= 1 << w - 32;
              }
              A & 128 ? A = A << 1 ^ 113 : A <<= 1;
            }
            p[_] = c.create(F, b);
          }
        })();
        var m = [];
        (function() {
          for (var y = 0; y < 25; y++)
            m[y] = c.create();
        })();
        var E = u.SHA3 = o.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: o.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            for (var y = this._state = [], C = 0; C < 25; C++)
              y[C] = new c.init();
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(y, C) {
            for (var g = this._state, d = this.blockSize / 2, x = 0; x < d; x++) {
              var A = y[C + 2 * x], _ = y[C + 2 * x + 1];
              A = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360, _ = (_ << 8 | _ >>> 24) & 16711935 | (_ << 24 | _ >>> 8) & 4278255360;
              var F = g[x];
              F.high ^= _, F.low ^= A;
            }
            for (var b = 0; b < 24; b++) {
              for (var R = 0; R < 5; R++) {
                for (var w = 0, S = 0, B = 0; B < 5; B++) {
                  var F = g[R + 5 * B];
                  w ^= F.high, S ^= F.low;
                }
                var D = m[R];
                D.high = w, D.low = S;
              }
              for (var R = 0; R < 5; R++)
                for (var N = m[(R + 4) % 5], U = m[(R + 1) % 5], q = U.high, V = U.low, w = N.high ^ (q << 1 | V >>> 31), S = N.low ^ (V << 1 | q >>> 31), B = 0; B < 5; B++) {
                  var F = g[R + 5 * B];
                  F.high ^= w, F.low ^= S;
                }
              for (var Y = 1; Y < 25; Y++) {
                var w, S, F = g[Y], K = F.high, W = F.low, T = h[Y];
                T < 32 ? (w = K << T | W >>> 32 - T, S = W << T | K >>> 32 - T) : (w = W << T - 32 | K >>> 64 - T, S = K << T - 32 | W >>> 64 - T);
                var L = m[f[Y]];
                L.high = w, L.low = S;
              }
              var P = m[0], O = g[0];
              P.high = O.high, P.low = O.low;
              for (var R = 0; R < 5; R++)
                for (var B = 0; B < 5; B++) {
                  var Y = R + 5 * B, F = g[Y], X = m[Y], G = m[(R + 1) % 5 + 5 * B], ae = m[(R + 2) % 5 + 5 * B];
                  F.high = X.high ^ ~G.high & ae.high, F.low = X.low ^ ~G.low & ae.low;
                }
              var F = g[0], H = p[b];
              F.high ^= H.high, F.low ^= H.low;
            }
          },
          _doFinalize: function() {
            var y = this._data, C = y.words;
            this._nDataBytes * 8;
            var g = y.sigBytes * 8, d = this.blockSize * 32;
            C[g >>> 5] |= 1 << 24 - g % 32, C[(r.ceil((g + 1) / d) * d >>> 5) - 1] |= 128, y.sigBytes = C.length * 4, this._process();
            for (var x = this._state, A = this.cfg.outputLength / 8, _ = A / 8, F = [], b = 0; b < _; b++) {
              var R = x[b], w = R.high, S = R.low;
              w = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360, S = (S << 8 | S >>> 24) & 16711935 | (S << 24 | S >>> 8) & 4278255360, F.push(S), F.push(w);
            }
            return new a.init(F, A);
          },
          clone: function() {
            for (var y = o.clone.call(this), C = y._state = this._state.slice(0), g = 0; g < 25; g++)
              C[g] = C[g].clone();
            return y;
          }
        });
        n.SHA3 = o._createHelper(E), n.HmacSHA3 = o._createHmacHelper(E);
      }(Math), t.SHA3;
    });
  }(Pr)), Pr.exports;
}
var Lr = { exports: {} }, Ms;
function Kc() {
  return Ms || (Ms = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      return function(r) {
        var n = t, i = n.lib, a = i.WordArray, o = i.Hasher, l = n.algo, c = a.create([
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13
        ]), u = a.create([
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11
        ]), h = a.create([
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6
        ]), f = a.create([
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11
        ]), p = a.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), m = a.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), E = l.RIPEMD160 = o.extend({
          _doReset: function() {
            this._hash = a.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(_, F) {
            for (var b = 0; b < 16; b++) {
              var R = F + b, w = _[R];
              _[R] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360;
            }
            var S = this._hash.words, B = p.words, D = m.words, N = c.words, U = u.words, q = h.words, V = f.words, Y, K, W, T, L, P, O, X, G, ae;
            P = Y = S[0], O = K = S[1], X = W = S[2], G = T = S[3], ae = L = S[4];
            for (var H, b = 0; b < 80; b += 1)
              H = Y + _[F + N[b]] | 0, b < 16 ? H += y(K, W, T) + B[0] : b < 32 ? H += C(K, W, T) + B[1] : b < 48 ? H += g(K, W, T) + B[2] : b < 64 ? H += d(K, W, T) + B[3] : H += x(K, W, T) + B[4], H = H | 0, H = A(H, q[b]), H = H + L | 0, Y = L, L = T, T = A(W, 10), W = K, K = H, H = P + _[F + U[b]] | 0, b < 16 ? H += x(O, X, G) + D[0] : b < 32 ? H += d(O, X, G) + D[1] : b < 48 ? H += g(O, X, G) + D[2] : b < 64 ? H += C(O, X, G) + D[3] : H += y(O, X, G) + D[4], H = H | 0, H = A(H, V[b]), H = H + ae | 0, P = ae, ae = G, G = A(X, 10), X = O, O = H;
            H = S[1] + W + G | 0, S[1] = S[2] + T + ae | 0, S[2] = S[3] + L + P | 0, S[3] = S[4] + Y + O | 0, S[4] = S[0] + K + X | 0, S[0] = H;
          },
          _doFinalize: function() {
            var _ = this._data, F = _.words, b = this._nDataBytes * 8, R = _.sigBytes * 8;
            F[R >>> 5] |= 128 << 24 - R % 32, F[(R + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360, _.sigBytes = (F.length + 1) * 4, this._process();
            for (var w = this._hash, S = w.words, B = 0; B < 5; B++) {
              var D = S[B];
              S[B] = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360;
            }
            return w;
          },
          clone: function() {
            var _ = o.clone.call(this);
            return _._hash = this._hash.clone(), _;
          }
        });
        function y(_, F, b) {
          return _ ^ F ^ b;
        }
        function C(_, F, b) {
          return _ & F | ~_ & b;
        }
        function g(_, F, b) {
          return (_ | ~F) ^ b;
        }
        function d(_, F, b) {
          return _ & b | F & ~b;
        }
        function x(_, F, b) {
          return _ ^ (F | ~b);
        }
        function A(_, F) {
          return _ << F | _ >>> 32 - F;
        }
        n.RIPEMD160 = o._createHelper(E), n.HmacRIPEMD160 = o._createHmacHelper(E);
      }(), t.RIPEMD160;
    });
  }(Lr)), Lr.exports;
}
var kr = { exports: {} }, Hs;
function Tn() {
  return Hs || (Hs = 1, function(s, e) {
    (function(t, r) {
      s.exports = r($());
    })(z, function(t) {
      (function() {
        var r = t, n = r.lib, i = n.Base, a = r.enc, o = a.Utf8, l = r.algo;
        l.HMAC = i.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function(c, u) {
            c = this._hasher = new c.init(), typeof u == "string" && (u = o.parse(u));
            var h = c.blockSize, f = h * 4;
            u.sigBytes > f && (u = c.finalize(u)), u.clamp();
            for (var p = this._oKey = u.clone(), m = this._iKey = u.clone(), E = p.words, y = m.words, C = 0; C < h; C++)
              E[C] ^= 1549556828, y[C] ^= 909522486;
            p.sigBytes = m.sigBytes = f, this.reset();
          },
          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function() {
            var c = this._hasher;
            c.reset(), c.update(this._iKey);
          },
          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function(c) {
            return this._hasher.update(c), this;
          },
          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function(c) {
            var u = this._hasher, h = u.finalize(c);
            u.reset();
            var f = u.finalize(this._oKey.clone().concat(h));
            return f;
          }
        });
      })();
    });
  }(kr)), kr.exports;
}
var Ir = { exports: {} }, zs;
function Xc() {
  return zs || (zs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), On(), Tn());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.Base, a = n.WordArray, o = r.algo, l = o.SHA256, c = o.HMAC, u = o.PBKDF2 = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: i.extend({
            keySize: 128 / 32,
            hasher: l,
            iterations: 25e4
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function(h) {
            this.cfg = this.cfg.extend(h);
          },
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(h, f) {
            for (var p = this.cfg, m = c.create(p.hasher, h), E = a.create(), y = a.create([1]), C = E.words, g = y.words, d = p.keySize, x = p.iterations; C.length < d; ) {
              var A = m.update(f).finalize(y);
              m.reset();
              for (var _ = A.words, F = _.length, b = A, R = 1; R < x; R++) {
                b = m.finalize(b), m.reset();
                for (var w = b.words, S = 0; S < F; S++)
                  _[S] ^= w[S];
              }
              E.concat(A), g[0]++;
            }
            return E.sigBytes = d * 4, E;
          }
        });
        r.PBKDF2 = function(h, f, p) {
          return u.create(p).compute(h, f);
        };
      }(), t.PBKDF2;
    });
  }(Ir)), Ir.exports;
}
var Nr = { exports: {} }, js;
function Ze() {
  return js || (js = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), ia(), Tn());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.Base, a = n.WordArray, o = r.algo, l = o.MD5, c = o.EvpKDF = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: i.extend({
            keySize: 128 / 32,
            hasher: l,
            iterations: 1
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function(u) {
            this.cfg = this.cfg.extend(u);
          },
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(u, h) {
            for (var f, p = this.cfg, m = p.hasher.create(), E = a.create(), y = E.words, C = p.keySize, g = p.iterations; y.length < C; ) {
              f && m.update(f), f = m.update(u).finalize(h), m.reset();
              for (var d = 1; d < g; d++)
                f = m.finalize(f), m.reset();
              E.concat(f);
            }
            return E.sigBytes = C * 4, E;
          }
        });
        r.EvpKDF = function(u, h, f) {
          return c.create(f).compute(u, h);
        };
      }(), t.EvpKDF;
    });
  }(Nr)), Nr.exports;
}
var Ur = { exports: {} }, $s;
function pe() {
  return $s || ($s = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), Ze());
    })(z, function(t) {
      t.lib.Cipher || function(r) {
        var n = t, i = n.lib, a = i.Base, o = i.WordArray, l = i.BufferedBlockAlgorithm, c = n.enc;
        c.Utf8;
        var u = c.Base64, h = n.algo, f = h.EvpKDF, p = i.Cipher = l.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: a.extend(),
          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function(w, S) {
            return this.create(this._ENC_XFORM_MODE, w, S);
          },
          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function(w, S) {
            return this.create(this._DEC_XFORM_MODE, w, S);
          },
          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function(w, S, B) {
            this.cfg = this.cfg.extend(B), this._xformMode = w, this._key = S, this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            l.reset.call(this), this._doReset();
          },
          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function(w) {
            return this._append(w), this._process();
          },
          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function(w) {
            w && this._append(w);
            var S = this._doFinalize();
            return S;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: /* @__PURE__ */ function() {
            function w(S) {
              return typeof S == "string" ? R : _;
            }
            return function(S) {
              return {
                encrypt: function(B, D, N) {
                  return w(D).encrypt(S, B, D, N);
                },
                decrypt: function(B, D, N) {
                  return w(D).decrypt(S, B, D, N);
                }
              };
            };
          }()
        });
        i.StreamCipher = p.extend({
          _doFinalize: function() {
            var w = this._process(!0);
            return w;
          },
          blockSize: 1
        });
        var m = n.mode = {}, E = i.BlockCipherMode = a.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function(w, S) {
            return this.Encryptor.create(w, S);
          },
          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function(w, S) {
            return this.Decryptor.create(w, S);
          },
          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function(w, S) {
            this._cipher = w, this._iv = S;
          }
        }), y = m.CBC = function() {
          var w = E.extend();
          w.Encryptor = w.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(B, D) {
              var N = this._cipher, U = N.blockSize;
              S.call(this, B, D, U), N.encryptBlock(B, D), this._prevBlock = B.slice(D, D + U);
            }
          }), w.Decryptor = w.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(B, D) {
              var N = this._cipher, U = N.blockSize, q = B.slice(D, D + U);
              N.decryptBlock(B, D), S.call(this, B, D, U), this._prevBlock = q;
            }
          });
          function S(B, D, N) {
            var U, q = this._iv;
            q ? (U = q, this._iv = r) : U = this._prevBlock;
            for (var V = 0; V < N; V++)
              B[D + V] ^= U[V];
          }
          return w;
        }(), C = n.pad = {}, g = C.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function(w, S) {
            for (var B = S * 4, D = B - w.sigBytes % B, N = D << 24 | D << 16 | D << 8 | D, U = [], q = 0; q < D; q += 4)
              U.push(N);
            var V = o.create(U, D);
            w.concat(V);
          },
          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function(w) {
            var S = w.words[w.sigBytes - 1 >>> 2] & 255;
            w.sigBytes -= S;
          }
        };
        i.BlockCipher = p.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: p.cfg.extend({
            mode: y,
            padding: g
          }),
          reset: function() {
            var w;
            p.reset.call(this);
            var S = this.cfg, B = S.iv, D = S.mode;
            this._xformMode == this._ENC_XFORM_MODE ? w = D.createEncryptor : (w = D.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == w ? this._mode.init(this, B && B.words) : (this._mode = w.call(D, this, B && B.words), this._mode.__creator = w);
          },
          _doProcessBlock: function(w, S) {
            this._mode.processBlock(w, S);
          },
          _doFinalize: function() {
            var w, S = this.cfg.padding;
            return this._xformMode == this._ENC_XFORM_MODE ? (S.pad(this._data, this.blockSize), w = this._process(!0)) : (w = this._process(!0), S.unpad(w)), w;
          },
          blockSize: 128 / 32
        });
        var d = i.CipherParams = a.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function(w) {
            this.mixIn(w);
          },
          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function(w) {
            return (w || this.formatter).stringify(this);
          }
        }), x = n.format = {}, A = x.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function(w) {
            var S, B = w.ciphertext, D = w.salt;
            return D ? S = o.create([1398893684, 1701076831]).concat(D).concat(B) : S = B, S.toString(u);
          },
          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function(w) {
            var S, B = u.parse(w), D = B.words;
            return D[0] == 1398893684 && D[1] == 1701076831 && (S = o.create(D.slice(2, 4)), D.splice(0, 4), B.sigBytes -= 16), d.create({ ciphertext: B, salt: S });
          }
        }, _ = i.SerializableCipher = a.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: a.extend({
            format: A
          }),
          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(w, S, B, D) {
            D = this.cfg.extend(D);
            var N = w.createEncryptor(B, D), U = N.finalize(S), q = N.cfg;
            return d.create({
              ciphertext: U,
              key: B,
              iv: q.iv,
              algorithm: w,
              mode: q.mode,
              padding: q.padding,
              blockSize: w.blockSize,
              formatter: D.format
            });
          },
          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(w, S, B, D) {
            D = this.cfg.extend(D), S = this._parse(S, D.format);
            var N = w.createDecryptor(B, D).finalize(S.ciphertext);
            return N;
          },
          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function(w, S) {
            return typeof w == "string" ? S.parse(w, this) : w;
          }
        }), F = n.kdf = {}, b = F.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function(w, S, B, D, N) {
            if (D || (D = o.random(64 / 8)), N)
              var U = f.create({ keySize: S + B, hasher: N }).compute(w, D);
            else
              var U = f.create({ keySize: S + B }).compute(w, D);
            var q = o.create(U.words.slice(S), B * 4);
            return U.sigBytes = S * 4, d.create({ key: U, iv: q, salt: D });
          }
        }, R = i.PasswordBasedCipher = _.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: _.cfg.extend({
            kdf: b
          }),
          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(w, S, B, D) {
            D = this.cfg.extend(D);
            var N = D.kdf.execute(B, w.keySize, w.ivSize, D.salt, D.hasher);
            D.iv = N.iv;
            var U = _.encrypt.call(this, w, S, N.key, D);
            return U.mixIn(N), U;
          },
          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(w, S, B, D) {
            D = this.cfg.extend(D), S = this._parse(S, D.format);
            var N = D.kdf.execute(B, w.keySize, w.ivSize, S.salt, D.hasher);
            D.iv = N.iv;
            var U = _.decrypt.call(this, w, S, N.key, D);
            return U;
          }
        });
      }();
    });
  }(Ur)), Ur.exports;
}
var qr = { exports: {} }, Ws;
function Zc() {
  return Ws || (Ws = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.mode.CFB = function() {
        var r = t.lib.BlockCipherMode.extend();
        r.Encryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize;
            n.call(this, i, a, l, o), this._prevBlock = i.slice(a, a + l);
          }
        }), r.Decryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize, c = i.slice(a, a + l);
            n.call(this, i, a, l, o), this._prevBlock = c;
          }
        });
        function n(i, a, o, l) {
          var c, u = this._iv;
          u ? (c = u.slice(0), this._iv = void 0) : c = this._prevBlock, l.encryptBlock(c, 0);
          for (var h = 0; h < o; h++)
            i[a + h] ^= c[h];
        }
        return r;
      }(), t.mode.CFB;
    });
  }(qr)), qr.exports;
}
var Mr = { exports: {} }, Gs;
function Vc() {
  return Gs || (Gs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.mode.CTR = function() {
        var r = t.lib.BlockCipherMode.extend(), n = r.Encryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize, c = this._iv, u = this._counter;
            c && (u = this._counter = c.slice(0), this._iv = void 0);
            var h = u.slice(0);
            o.encryptBlock(h, 0), u[l - 1] = u[l - 1] + 1 | 0;
            for (var f = 0; f < l; f++)
              i[a + f] ^= h[f];
          }
        });
        return r.Decryptor = n, r;
      }(), t.mode.CTR;
    });
  }(Mr)), Mr.exports;
}
var Hr = { exports: {} }, Ks;
function Yc() {
  return Ks || (Ks = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      return t.mode.CTRGladman = function() {
        var r = t.lib.BlockCipherMode.extend();
        function n(o) {
          if ((o >> 24 & 255) === 255) {
            var l = o >> 16 & 255, c = o >> 8 & 255, u = o & 255;
            l === 255 ? (l = 0, c === 255 ? (c = 0, u === 255 ? u = 0 : ++u) : ++c) : ++l, o = 0, o += l << 16, o += c << 8, o += u;
          } else
            o += 1 << 24;
          return o;
        }
        function i(o) {
          return (o[0] = n(o[0])) === 0 && (o[1] = n(o[1])), o;
        }
        var a = r.Encryptor = r.extend({
          processBlock: function(o, l) {
            var c = this._cipher, u = c.blockSize, h = this._iv, f = this._counter;
            h && (f = this._counter = h.slice(0), this._iv = void 0), i(f);
            var p = f.slice(0);
            c.encryptBlock(p, 0);
            for (var m = 0; m < u; m++)
              o[l + m] ^= p[m];
          }
        });
        return r.Decryptor = a, r;
      }(), t.mode.CTRGladman;
    });
  }(Hr)), Hr.exports;
}
var zr = { exports: {} }, Xs;
function Jc() {
  return Xs || (Xs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.mode.OFB = function() {
        var r = t.lib.BlockCipherMode.extend(), n = r.Encryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize, c = this._iv, u = this._keystream;
            c && (u = this._keystream = c.slice(0), this._iv = void 0), o.encryptBlock(u, 0);
            for (var h = 0; h < l; h++)
              i[a + h] ^= u[h];
          }
        });
        return r.Decryptor = n, r;
      }(), t.mode.OFB;
    });
  }(zr)), zr.exports;
}
var jr = { exports: {} }, Zs;
function Qc() {
  return Zs || (Zs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.mode.ECB = function() {
        var r = t.lib.BlockCipherMode.extend();
        return r.Encryptor = r.extend({
          processBlock: function(n, i) {
            this._cipher.encryptBlock(n, i);
          }
        }), r.Decryptor = r.extend({
          processBlock: function(n, i) {
            this._cipher.decryptBlock(n, i);
          }
        }), r;
      }(), t.mode.ECB;
    });
  }(jr)), jr.exports;
}
var $r = { exports: {} }, Vs;
function el() {
  return Vs || (Vs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.pad.AnsiX923 = {
        pad: function(r, n) {
          var i = r.sigBytes, a = n * 4, o = a - i % a, l = i + o - 1;
          r.clamp(), r.words[l >>> 2] |= o << 24 - l % 4 * 8, r.sigBytes += o;
        },
        unpad: function(r) {
          var n = r.words[r.sigBytes - 1 >>> 2] & 255;
          r.sigBytes -= n;
        }
      }, t.pad.Ansix923;
    });
  }($r)), $r.exports;
}
var Wr = { exports: {} }, Ys;
function tl() {
  return Ys || (Ys = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.pad.Iso10126 = {
        pad: function(r, n) {
          var i = n * 4, a = i - r.sigBytes % i;
          r.concat(t.lib.WordArray.random(a - 1)).concat(t.lib.WordArray.create([a << 24], 1));
        },
        unpad: function(r) {
          var n = r.words[r.sigBytes - 1 >>> 2] & 255;
          r.sigBytes -= n;
        }
      }, t.pad.Iso10126;
    });
  }(Wr)), Wr.exports;
}
var Gr = { exports: {} }, Js;
function rl() {
  return Js || (Js = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.pad.Iso97971 = {
        pad: function(r, n) {
          r.concat(t.lib.WordArray.create([2147483648], 1)), t.pad.ZeroPadding.pad(r, n);
        },
        unpad: function(r) {
          t.pad.ZeroPadding.unpad(r), r.sigBytes--;
        }
      }, t.pad.Iso97971;
    });
  }(Gr)), Gr.exports;
}
var Kr = { exports: {} }, Qs;
function nl() {
  return Qs || (Qs = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.pad.ZeroPadding = {
        pad: function(r, n) {
          var i = n * 4;
          r.clamp(), r.sigBytes += i - (r.sigBytes % i || i);
        },
        unpad: function(r) {
          for (var n = r.words, i = r.sigBytes - 1, i = r.sigBytes - 1; i >= 0; i--)
            if (n[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
              r.sigBytes = i + 1;
              break;
            }
        }
      }, t.pad.ZeroPadding;
    });
  }(Kr)), Kr.exports;
}
var Xr = { exports: {} }, ei;
function sl() {
  return ei || (ei = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return t.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      }, t.pad.NoPadding;
    });
  }(Xr)), Xr.exports;
}
var Zr = { exports: {} }, ti;
function il() {
  return ti || (ti = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), pe());
    })(z, function(t) {
      return function(r) {
        var n = t, i = n.lib, a = i.CipherParams, o = n.enc, l = o.Hex, c = n.format;
        c.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function(u) {
            return u.ciphertext.toString(l);
          },
          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function(u) {
            var h = l.parse(u);
            return a.create({ ciphertext: h });
          }
        };
      }(), t.format.Hex;
    });
  }(Zr)), Zr.exports;
}
var Vr = { exports: {} }, ri;
function al() {
  return ri || (ri = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), st(), it(), Ze(), pe());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.BlockCipher, a = r.algo, o = [], l = [], c = [], u = [], h = [], f = [], p = [], m = [], E = [], y = [];
        (function() {
          for (var d = [], x = 0; x < 256; x++)
            x < 128 ? d[x] = x << 1 : d[x] = x << 1 ^ 283;
          for (var A = 0, _ = 0, x = 0; x < 256; x++) {
            var F = _ ^ _ << 1 ^ _ << 2 ^ _ << 3 ^ _ << 4;
            F = F >>> 8 ^ F & 255 ^ 99, o[A] = F, l[F] = A;
            var b = d[A], R = d[b], w = d[R], S = d[F] * 257 ^ F * 16843008;
            c[A] = S << 24 | S >>> 8, u[A] = S << 16 | S >>> 16, h[A] = S << 8 | S >>> 24, f[A] = S;
            var S = w * 16843009 ^ R * 65537 ^ b * 257 ^ A * 16843008;
            p[F] = S << 24 | S >>> 8, m[F] = S << 16 | S >>> 16, E[F] = S << 8 | S >>> 24, y[F] = S, A ? (A = b ^ d[d[d[w ^ b]]], _ ^= d[d[_]]) : A = _ = 1;
          }
        })();
        var C = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], g = a.AES = i.extend({
          _doReset: function() {
            var d;
            if (!(this._nRounds && this._keyPriorReset === this._key)) {
              for (var x = this._keyPriorReset = this._key, A = x.words, _ = x.sigBytes / 4, F = this._nRounds = _ + 6, b = (F + 1) * 4, R = this._keySchedule = [], w = 0; w < b; w++)
                w < _ ? R[w] = A[w] : (d = R[w - 1], w % _ ? _ > 6 && w % _ == 4 && (d = o[d >>> 24] << 24 | o[d >>> 16 & 255] << 16 | o[d >>> 8 & 255] << 8 | o[d & 255]) : (d = d << 8 | d >>> 24, d = o[d >>> 24] << 24 | o[d >>> 16 & 255] << 16 | o[d >>> 8 & 255] << 8 | o[d & 255], d ^= C[w / _ | 0] << 24), R[w] = R[w - _] ^ d);
              for (var S = this._invKeySchedule = [], B = 0; B < b; B++) {
                var w = b - B;
                if (B % 4)
                  var d = R[w];
                else
                  var d = R[w - 4];
                B < 4 || w <= 4 ? S[B] = d : S[B] = p[o[d >>> 24]] ^ m[o[d >>> 16 & 255]] ^ E[o[d >>> 8 & 255]] ^ y[o[d & 255]];
              }
            }
          },
          encryptBlock: function(d, x) {
            this._doCryptBlock(d, x, this._keySchedule, c, u, h, f, o);
          },
          decryptBlock: function(d, x) {
            var A = d[x + 1];
            d[x + 1] = d[x + 3], d[x + 3] = A, this._doCryptBlock(d, x, this._invKeySchedule, p, m, E, y, l);
            var A = d[x + 1];
            d[x + 1] = d[x + 3], d[x + 3] = A;
          },
          _doCryptBlock: function(d, x, A, _, F, b, R, w) {
            for (var S = this._nRounds, B = d[x] ^ A[0], D = d[x + 1] ^ A[1], N = d[x + 2] ^ A[2], U = d[x + 3] ^ A[3], q = 4, V = 1; V < S; V++) {
              var Y = _[B >>> 24] ^ F[D >>> 16 & 255] ^ b[N >>> 8 & 255] ^ R[U & 255] ^ A[q++], K = _[D >>> 24] ^ F[N >>> 16 & 255] ^ b[U >>> 8 & 255] ^ R[B & 255] ^ A[q++], W = _[N >>> 24] ^ F[U >>> 16 & 255] ^ b[B >>> 8 & 255] ^ R[D & 255] ^ A[q++], T = _[U >>> 24] ^ F[B >>> 16 & 255] ^ b[D >>> 8 & 255] ^ R[N & 255] ^ A[q++];
              B = Y, D = K, N = W, U = T;
            }
            var Y = (w[B >>> 24] << 24 | w[D >>> 16 & 255] << 16 | w[N >>> 8 & 255] << 8 | w[U & 255]) ^ A[q++], K = (w[D >>> 24] << 24 | w[N >>> 16 & 255] << 16 | w[U >>> 8 & 255] << 8 | w[B & 255]) ^ A[q++], W = (w[N >>> 24] << 24 | w[U >>> 16 & 255] << 16 | w[B >>> 8 & 255] << 8 | w[D & 255]) ^ A[q++], T = (w[U >>> 24] << 24 | w[B >>> 16 & 255] << 16 | w[D >>> 8 & 255] << 8 | w[N & 255]) ^ A[q++];
            d[x] = Y, d[x + 1] = K, d[x + 2] = W, d[x + 3] = T;
          },
          keySize: 256 / 32
        });
        r.AES = i._createHelper(g);
      }(), t.AES;
    });
  }(Vr)), Vr.exports;
}
var Yr = { exports: {} }, ni;
function ol() {
  return ni || (ni = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), st(), it(), Ze(), pe());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.WordArray, a = n.BlockCipher, o = r.algo, l = [
          57,
          49,
          41,
          33,
          25,
          17,
          9,
          1,
          58,
          50,
          42,
          34,
          26,
          18,
          10,
          2,
          59,
          51,
          43,
          35,
          27,
          19,
          11,
          3,
          60,
          52,
          44,
          36,
          63,
          55,
          47,
          39,
          31,
          23,
          15,
          7,
          62,
          54,
          46,
          38,
          30,
          22,
          14,
          6,
          61,
          53,
          45,
          37,
          29,
          21,
          13,
          5,
          28,
          20,
          12,
          4
        ], c = [
          14,
          17,
          11,
          24,
          1,
          5,
          3,
          28,
          15,
          6,
          21,
          10,
          23,
          19,
          12,
          4,
          26,
          8,
          16,
          7,
          27,
          20,
          13,
          2,
          41,
          52,
          31,
          37,
          47,
          55,
          30,
          40,
          51,
          45,
          33,
          48,
          44,
          49,
          39,
          56,
          34,
          53,
          46,
          42,
          50,
          36,
          29,
          32
        ], u = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], h = [
          {
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
          },
          {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
          },
          {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
          },
          {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
          },
          {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
          },
          {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
          },
          {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
          },
          {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
          }
        ], f = [
          4160749569,
          528482304,
          33030144,
          2064384,
          129024,
          8064,
          504,
          2147483679
        ], p = o.DES = a.extend({
          _doReset: function() {
            for (var C = this._key, g = C.words, d = [], x = 0; x < 56; x++) {
              var A = l[x] - 1;
              d[x] = g[A >>> 5] >>> 31 - A % 32 & 1;
            }
            for (var _ = this._subKeys = [], F = 0; F < 16; F++) {
              for (var b = _[F] = [], R = u[F], x = 0; x < 24; x++)
                b[x / 6 | 0] |= d[(c[x] - 1 + R) % 28] << 31 - x % 6, b[4 + (x / 6 | 0)] |= d[28 + (c[x + 24] - 1 + R) % 28] << 31 - x % 6;
              b[0] = b[0] << 1 | b[0] >>> 31;
              for (var x = 1; x < 7; x++)
                b[x] = b[x] >>> (x - 1) * 4 + 3;
              b[7] = b[7] << 5 | b[7] >>> 27;
            }
            for (var w = this._invSubKeys = [], x = 0; x < 16; x++)
              w[x] = _[15 - x];
          },
          encryptBlock: function(C, g) {
            this._doCryptBlock(C, g, this._subKeys);
          },
          decryptBlock: function(C, g) {
            this._doCryptBlock(C, g, this._invSubKeys);
          },
          _doCryptBlock: function(C, g, d) {
            this._lBlock = C[g], this._rBlock = C[g + 1], m.call(this, 4, 252645135), m.call(this, 16, 65535), E.call(this, 2, 858993459), E.call(this, 8, 16711935), m.call(this, 1, 1431655765);
            for (var x = 0; x < 16; x++) {
              for (var A = d[x], _ = this._lBlock, F = this._rBlock, b = 0, R = 0; R < 8; R++)
                b |= h[R][((F ^ A[R]) & f[R]) >>> 0];
              this._lBlock = F, this._rBlock = _ ^ b;
            }
            var w = this._lBlock;
            this._lBlock = this._rBlock, this._rBlock = w, m.call(this, 1, 1431655765), E.call(this, 8, 16711935), E.call(this, 2, 858993459), m.call(this, 16, 65535), m.call(this, 4, 252645135), C[g] = this._lBlock, C[g + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function m(C, g) {
          var d = (this._lBlock >>> C ^ this._rBlock) & g;
          this._rBlock ^= d, this._lBlock ^= d << C;
        }
        function E(C, g) {
          var d = (this._rBlock >>> C ^ this._lBlock) & g;
          this._lBlock ^= d, this._rBlock ^= d << C;
        }
        r.DES = a._createHelper(p);
        var y = o.TripleDES = a.extend({
          _doReset: function() {
            var C = this._key, g = C.words;
            if (g.length !== 2 && g.length !== 4 && g.length < 6)
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            var d = g.slice(0, 2), x = g.length < 4 ? g.slice(0, 2) : g.slice(2, 4), A = g.length < 6 ? g.slice(0, 2) : g.slice(4, 6);
            this._des1 = p.createEncryptor(i.create(d)), this._des2 = p.createEncryptor(i.create(x)), this._des3 = p.createEncryptor(i.create(A));
          },
          encryptBlock: function(C, g) {
            this._des1.encryptBlock(C, g), this._des2.decryptBlock(C, g), this._des3.encryptBlock(C, g);
          },
          decryptBlock: function(C, g) {
            this._des3.decryptBlock(C, g), this._des2.encryptBlock(C, g), this._des1.decryptBlock(C, g);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        r.TripleDES = a._createHelper(y);
      }(), t.TripleDES;
    });
  }(Yr)), Yr.exports;
}
var Jr = { exports: {} }, si;
function cl() {
  return si || (si = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), st(), it(), Ze(), pe());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.StreamCipher, a = r.algo, o = a.RC4 = i.extend({
          _doReset: function() {
            for (var u = this._key, h = u.words, f = u.sigBytes, p = this._S = [], m = 0; m < 256; m++)
              p[m] = m;
            for (var m = 0, E = 0; m < 256; m++) {
              var y = m % f, C = h[y >>> 2] >>> 24 - y % 4 * 8 & 255;
              E = (E + p[m] + C) % 256;
              var g = p[m];
              p[m] = p[E], p[E] = g;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(u, h) {
            u[h] ^= l.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function l() {
          for (var u = this._S, h = this._i, f = this._j, p = 0, m = 0; m < 4; m++) {
            h = (h + 1) % 256, f = (f + u[h]) % 256;
            var E = u[h];
            u[h] = u[f], u[f] = E, p |= u[(u[h] + u[f]) % 256] << 24 - m * 8;
          }
          return this._i = h, this._j = f, p;
        }
        r.RC4 = i._createHelper(o);
        var c = a.RC4Drop = o.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: o.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            o._doReset.call(this);
            for (var u = this.cfg.drop; u > 0; u--)
              l.call(this);
          }
        });
        r.RC4Drop = i._createHelper(c);
      }(), t.RC4;
    });
  }(Jr)), Jr.exports;
}
var Qr = { exports: {} }, ii;
function ll() {
  return ii || (ii = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), st(), it(), Ze(), pe());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.StreamCipher, a = r.algo, o = [], l = [], c = [], u = a.Rabbit = i.extend({
          _doReset: function() {
            for (var f = this._key.words, p = this.cfg.iv, m = 0; m < 4; m++)
              f[m] = (f[m] << 8 | f[m] >>> 24) & 16711935 | (f[m] << 24 | f[m] >>> 8) & 4278255360;
            var E = this._X = [
              f[0],
              f[3] << 16 | f[2] >>> 16,
              f[1],
              f[0] << 16 | f[3] >>> 16,
              f[2],
              f[1] << 16 | f[0] >>> 16,
              f[3],
              f[2] << 16 | f[1] >>> 16
            ], y = this._C = [
              f[2] << 16 | f[2] >>> 16,
              f[0] & 4294901760 | f[1] & 65535,
              f[3] << 16 | f[3] >>> 16,
              f[1] & 4294901760 | f[2] & 65535,
              f[0] << 16 | f[0] >>> 16,
              f[2] & 4294901760 | f[3] & 65535,
              f[1] << 16 | f[1] >>> 16,
              f[3] & 4294901760 | f[0] & 65535
            ];
            this._b = 0;
            for (var m = 0; m < 4; m++)
              h.call(this);
            for (var m = 0; m < 8; m++)
              y[m] ^= E[m + 4 & 7];
            if (p) {
              var C = p.words, g = C[0], d = C[1], x = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, A = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, _ = x >>> 16 | A & 4294901760, F = A << 16 | x & 65535;
              y[0] ^= x, y[1] ^= _, y[2] ^= A, y[3] ^= F, y[4] ^= x, y[5] ^= _, y[6] ^= A, y[7] ^= F;
              for (var m = 0; m < 4; m++)
                h.call(this);
            }
          },
          _doProcessBlock: function(f, p) {
            var m = this._X;
            h.call(this), o[0] = m[0] ^ m[5] >>> 16 ^ m[3] << 16, o[1] = m[2] ^ m[7] >>> 16 ^ m[5] << 16, o[2] = m[4] ^ m[1] >>> 16 ^ m[7] << 16, o[3] = m[6] ^ m[3] >>> 16 ^ m[1] << 16;
            for (var E = 0; E < 4; E++)
              o[E] = (o[E] << 8 | o[E] >>> 24) & 16711935 | (o[E] << 24 | o[E] >>> 8) & 4278255360, f[p + E] ^= o[E];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function h() {
          for (var f = this._X, p = this._C, m = 0; m < 8; m++)
            l[m] = p[m];
          p[0] = p[0] + 1295307597 + this._b | 0, p[1] = p[1] + 3545052371 + (p[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0, p[2] = p[2] + 886263092 + (p[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0, p[3] = p[3] + 1295307597 + (p[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0, p[4] = p[4] + 3545052371 + (p[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0, p[5] = p[5] + 886263092 + (p[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0, p[6] = p[6] + 1295307597 + (p[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0, p[7] = p[7] + 3545052371 + (p[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0, this._b = p[7] >>> 0 < l[7] >>> 0 ? 1 : 0;
          for (var m = 0; m < 8; m++) {
            var E = f[m] + p[m], y = E & 65535, C = E >>> 16, g = ((y * y >>> 17) + y * C >>> 15) + C * C, d = ((E & 4294901760) * E | 0) + ((E & 65535) * E | 0);
            c[m] = g ^ d;
          }
          f[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0, f[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0, f[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0, f[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0, f[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0, f[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0, f[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0, f[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0;
        }
        r.Rabbit = i._createHelper(u);
      }(), t.Rabbit;
    });
  }(Qr)), Qr.exports;
}
var en = { exports: {} }, ai;
function ul() {
  return ai || (ai = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), st(), it(), Ze(), pe());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.StreamCipher, a = r.algo, o = [], l = [], c = [], u = a.RabbitLegacy = i.extend({
          _doReset: function() {
            var f = this._key.words, p = this.cfg.iv, m = this._X = [
              f[0],
              f[3] << 16 | f[2] >>> 16,
              f[1],
              f[0] << 16 | f[3] >>> 16,
              f[2],
              f[1] << 16 | f[0] >>> 16,
              f[3],
              f[2] << 16 | f[1] >>> 16
            ], E = this._C = [
              f[2] << 16 | f[2] >>> 16,
              f[0] & 4294901760 | f[1] & 65535,
              f[3] << 16 | f[3] >>> 16,
              f[1] & 4294901760 | f[2] & 65535,
              f[0] << 16 | f[0] >>> 16,
              f[2] & 4294901760 | f[3] & 65535,
              f[1] << 16 | f[1] >>> 16,
              f[3] & 4294901760 | f[0] & 65535
            ];
            this._b = 0;
            for (var y = 0; y < 4; y++)
              h.call(this);
            for (var y = 0; y < 8; y++)
              E[y] ^= m[y + 4 & 7];
            if (p) {
              var C = p.words, g = C[0], d = C[1], x = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, A = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, _ = x >>> 16 | A & 4294901760, F = A << 16 | x & 65535;
              E[0] ^= x, E[1] ^= _, E[2] ^= A, E[3] ^= F, E[4] ^= x, E[5] ^= _, E[6] ^= A, E[7] ^= F;
              for (var y = 0; y < 4; y++)
                h.call(this);
            }
          },
          _doProcessBlock: function(f, p) {
            var m = this._X;
            h.call(this), o[0] = m[0] ^ m[5] >>> 16 ^ m[3] << 16, o[1] = m[2] ^ m[7] >>> 16 ^ m[5] << 16, o[2] = m[4] ^ m[1] >>> 16 ^ m[7] << 16, o[3] = m[6] ^ m[3] >>> 16 ^ m[1] << 16;
            for (var E = 0; E < 4; E++)
              o[E] = (o[E] << 8 | o[E] >>> 24) & 16711935 | (o[E] << 24 | o[E] >>> 8) & 4278255360, f[p + E] ^= o[E];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function h() {
          for (var f = this._X, p = this._C, m = 0; m < 8; m++)
            l[m] = p[m];
          p[0] = p[0] + 1295307597 + this._b | 0, p[1] = p[1] + 3545052371 + (p[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0, p[2] = p[2] + 886263092 + (p[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0, p[3] = p[3] + 1295307597 + (p[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0, p[4] = p[4] + 3545052371 + (p[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0, p[5] = p[5] + 886263092 + (p[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0, p[6] = p[6] + 1295307597 + (p[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0, p[7] = p[7] + 3545052371 + (p[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0, this._b = p[7] >>> 0 < l[7] >>> 0 ? 1 : 0;
          for (var m = 0; m < 8; m++) {
            var E = f[m] + p[m], y = E & 65535, C = E >>> 16, g = ((y * y >>> 17) + y * C >>> 15) + C * C, d = ((E & 4294901760) * E | 0) + ((E & 65535) * E | 0);
            c[m] = g ^ d;
          }
          f[0] = c[0] + (c[7] << 16 | c[7] >>> 16) + (c[6] << 16 | c[6] >>> 16) | 0, f[1] = c[1] + (c[0] << 8 | c[0] >>> 24) + c[7] | 0, f[2] = c[2] + (c[1] << 16 | c[1] >>> 16) + (c[0] << 16 | c[0] >>> 16) | 0, f[3] = c[3] + (c[2] << 8 | c[2] >>> 24) + c[1] | 0, f[4] = c[4] + (c[3] << 16 | c[3] >>> 16) + (c[2] << 16 | c[2] >>> 16) | 0, f[5] = c[5] + (c[4] << 8 | c[4] >>> 24) + c[3] | 0, f[6] = c[6] + (c[5] << 16 | c[5] >>> 16) + (c[4] << 16 | c[4] >>> 16) | 0, f[7] = c[7] + (c[6] << 8 | c[6] >>> 24) + c[5] | 0;
        }
        r.RabbitLegacy = i._createHelper(u);
      }(), t.RabbitLegacy;
    });
  }(en)), en.exports;
}
var tn = { exports: {} }, oi;
function fl() {
  return oi || (oi = 1, function(s, e) {
    (function(t, r, n) {
      s.exports = r($(), st(), it(), Ze(), pe());
    })(z, function(t) {
      return function() {
        var r = t, n = r.lib, i = n.BlockCipher, a = r.algo;
        const o = 16, l = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ], c = [
          [
            3509652390,
            2564797868,
            805139163,
            3491422135,
            3101798381,
            1780907670,
            3128725573,
            4046225305,
            614570311,
            3012652279,
            134345442,
            2240740374,
            1667834072,
            1901547113,
            2757295779,
            4103290238,
            227898511,
            1921955416,
            1904987480,
            2182433518,
            2069144605,
            3260701109,
            2620446009,
            720527379,
            3318853667,
            677414384,
            3393288472,
            3101374703,
            2390351024,
            1614419982,
            1822297739,
            2954791486,
            3608508353,
            3174124327,
            2024746970,
            1432378464,
            3864339955,
            2857741204,
            1464375394,
            1676153920,
            1439316330,
            715854006,
            3033291828,
            289532110,
            2706671279,
            2087905683,
            3018724369,
            1668267050,
            732546397,
            1947742710,
            3462151702,
            2609353502,
            2950085171,
            1814351708,
            2050118529,
            680887927,
            999245976,
            1800124847,
            3300911131,
            1713906067,
            1641548236,
            4213287313,
            1216130144,
            1575780402,
            4018429277,
            3917837745,
            3693486850,
            3949271944,
            596196993,
            3549867205,
            258830323,
            2213823033,
            772490370,
            2760122372,
            1774776394,
            2652871518,
            566650946,
            4142492826,
            1728879713,
            2882767088,
            1783734482,
            3629395816,
            2517608232,
            2874225571,
            1861159788,
            326777828,
            3124490320,
            2130389656,
            2716951837,
            967770486,
            1724537150,
            2185432712,
            2364442137,
            1164943284,
            2105845187,
            998989502,
            3765401048,
            2244026483,
            1075463327,
            1455516326,
            1322494562,
            910128902,
            469688178,
            1117454909,
            936433444,
            3490320968,
            3675253459,
            1240580251,
            122909385,
            2157517691,
            634681816,
            4142456567,
            3825094682,
            3061402683,
            2540495037,
            79693498,
            3249098678,
            1084186820,
            1583128258,
            426386531,
            1761308591,
            1047286709,
            322548459,
            995290223,
            1845252383,
            2603652396,
            3431023940,
            2942221577,
            3202600964,
            3727903485,
            1712269319,
            422464435,
            3234572375,
            1170764815,
            3523960633,
            3117677531,
            1434042557,
            442511882,
            3600875718,
            1076654713,
            1738483198,
            4213154764,
            2393238008,
            3677496056,
            1014306527,
            4251020053,
            793779912,
            2902807211,
            842905082,
            4246964064,
            1395751752,
            1040244610,
            2656851899,
            3396308128,
            445077038,
            3742853595,
            3577915638,
            679411651,
            2892444358,
            2354009459,
            1767581616,
            3150600392,
            3791627101,
            3102740896,
            284835224,
            4246832056,
            1258075500,
            768725851,
            2589189241,
            3069724005,
            3532540348,
            1274779536,
            3789419226,
            2764799539,
            1660621633,
            3471099624,
            4011903706,
            913787905,
            3497959166,
            737222580,
            2514213453,
            2928710040,
            3937242737,
            1804850592,
            3499020752,
            2949064160,
            2386320175,
            2390070455,
            2415321851,
            4061277028,
            2290661394,
            2416832540,
            1336762016,
            1754252060,
            3520065937,
            3014181293,
            791618072,
            3188594551,
            3933548030,
            2332172193,
            3852520463,
            3043980520,
            413987798,
            3465142937,
            3030929376,
            4245938359,
            2093235073,
            3534596313,
            375366246,
            2157278981,
            2479649556,
            555357303,
            3870105701,
            2008414854,
            3344188149,
            4221384143,
            3956125452,
            2067696032,
            3594591187,
            2921233993,
            2428461,
            544322398,
            577241275,
            1471733935,
            610547355,
            4027169054,
            1432588573,
            1507829418,
            2025931657,
            3646575487,
            545086370,
            48609733,
            2200306550,
            1653985193,
            298326376,
            1316178497,
            3007786442,
            2064951626,
            458293330,
            2589141269,
            3591329599,
            3164325604,
            727753846,
            2179363840,
            146436021,
            1461446943,
            4069977195,
            705550613,
            3059967265,
            3887724982,
            4281599278,
            3313849956,
            1404054877,
            2845806497,
            146425753,
            1854211946
          ],
          [
            1266315497,
            3048417604,
            3681880366,
            3289982499,
            290971e4,
            1235738493,
            2632868024,
            2414719590,
            3970600049,
            1771706367,
            1449415276,
            3266420449,
            422970021,
            1963543593,
            2690192192,
            3826793022,
            1062508698,
            1531092325,
            1804592342,
            2583117782,
            2714934279,
            4024971509,
            1294809318,
            4028980673,
            1289560198,
            2221992742,
            1669523910,
            35572830,
            157838143,
            1052438473,
            1016535060,
            1802137761,
            1753167236,
            1386275462,
            3080475397,
            2857371447,
            1040679964,
            2145300060,
            2390574316,
            1461121720,
            2956646967,
            4031777805,
            4028374788,
            33600511,
            2920084762,
            1018524850,
            629373528,
            3691585981,
            3515945977,
            2091462646,
            2486323059,
            586499841,
            988145025,
            935516892,
            3367335476,
            2599673255,
            2839830854,
            265290510,
            3972581182,
            2759138881,
            3795373465,
            1005194799,
            847297441,
            406762289,
            1314163512,
            1332590856,
            1866599683,
            4127851711,
            750260880,
            613907577,
            1450815602,
            3165620655,
            3734664991,
            3650291728,
            3012275730,
            3704569646,
            1427272223,
            778793252,
            1343938022,
            2676280711,
            2052605720,
            1946737175,
            3164576444,
            3914038668,
            3967478842,
            3682934266,
            1661551462,
            3294938066,
            4011595847,
            840292616,
            3712170807,
            616741398,
            312560963,
            711312465,
            1351876610,
            322626781,
            1910503582,
            271666773,
            2175563734,
            1594956187,
            70604529,
            3617834859,
            1007753275,
            1495573769,
            4069517037,
            2549218298,
            2663038764,
            504708206,
            2263041392,
            3941167025,
            2249088522,
            1514023603,
            1998579484,
            1312622330,
            694541497,
            2582060303,
            2151582166,
            1382467621,
            776784248,
            2618340202,
            3323268794,
            2497899128,
            2784771155,
            503983604,
            4076293799,
            907881277,
            423175695,
            432175456,
            1378068232,
            4145222326,
            3954048622,
            3938656102,
            3820766613,
            2793130115,
            2977904593,
            26017576,
            3274890735,
            3194772133,
            1700274565,
            1756076034,
            4006520079,
            3677328699,
            720338349,
            1533947780,
            354530856,
            688349552,
            3973924725,
            1637815568,
            332179504,
            3949051286,
            53804574,
            2852348879,
            3044236432,
            1282449977,
            3583942155,
            3416972820,
            4006381244,
            1617046695,
            2628476075,
            3002303598,
            1686838959,
            431878346,
            2686675385,
            1700445008,
            1080580658,
            1009431731,
            832498133,
            3223435511,
            2605976345,
            2271191193,
            2516031870,
            1648197032,
            4164389018,
            2548247927,
            300782431,
            375919233,
            238389289,
            3353747414,
            2531188641,
            2019080857,
            1475708069,
            455242339,
            2609103871,
            448939670,
            3451063019,
            1395535956,
            2413381860,
            1841049896,
            1491858159,
            885456874,
            4264095073,
            4001119347,
            1565136089,
            3898914787,
            1108368660,
            540939232,
            1173283510,
            2745871338,
            3681308437,
            4207628240,
            3343053890,
            4016749493,
            1699691293,
            1103962373,
            3625875870,
            2256883143,
            3830138730,
            1031889488,
            3479347698,
            1535977030,
            4236805024,
            3251091107,
            2132092099,
            1774941330,
            1199868427,
            1452454533,
            157007616,
            2904115357,
            342012276,
            595725824,
            1480756522,
            206960106,
            497939518,
            591360097,
            863170706,
            2375253569,
            3596610801,
            1814182875,
            2094937945,
            3421402208,
            1082520231,
            3463918190,
            2785509508,
            435703966,
            3908032597,
            1641649973,
            2842273706,
            3305899714,
            1510255612,
            2148256476,
            2655287854,
            3276092548,
            4258621189,
            236887753,
            3681803219,
            274041037,
            1734335097,
            3815195456,
            3317970021,
            1899903192,
            1026095262,
            4050517792,
            356393447,
            2410691914,
            3873677099,
            3682840055
          ],
          [
            3913112168,
            2491498743,
            4132185628,
            2489919796,
            1091903735,
            1979897079,
            3170134830,
            3567386728,
            3557303409,
            857797738,
            1136121015,
            1342202287,
            507115054,
            2535736646,
            337727348,
            3213592640,
            1301675037,
            2528481711,
            1895095763,
            1721773893,
            3216771564,
            62756741,
            2142006736,
            835421444,
            2531993523,
            1442658625,
            3659876326,
            2882144922,
            676362277,
            1392781812,
            170690266,
            3921047035,
            1759253602,
            3611846912,
            1745797284,
            664899054,
            1329594018,
            3901205900,
            3045908486,
            2062866102,
            2865634940,
            3543621612,
            3464012697,
            1080764994,
            553557557,
            3656615353,
            3996768171,
            991055499,
            499776247,
            1265440854,
            648242737,
            3940784050,
            980351604,
            3713745714,
            1749149687,
            3396870395,
            4211799374,
            3640570775,
            1161844396,
            3125318951,
            1431517754,
            545492359,
            4268468663,
            3499529547,
            1437099964,
            2702547544,
            3433638243,
            2581715763,
            2787789398,
            1060185593,
            1593081372,
            2418618748,
            4260947970,
            69676912,
            2159744348,
            86519011,
            2512459080,
            3838209314,
            1220612927,
            3339683548,
            133810670,
            1090789135,
            1078426020,
            1569222167,
            845107691,
            3583754449,
            4072456591,
            1091646820,
            628848692,
            1613405280,
            3757631651,
            526609435,
            236106946,
            48312990,
            2942717905,
            3402727701,
            1797494240,
            859738849,
            992217954,
            4005476642,
            2243076622,
            3870952857,
            3732016268,
            765654824,
            3490871365,
            2511836413,
            1685915746,
            3888969200,
            1414112111,
            2273134842,
            3281911079,
            4080962846,
            172450625,
            2569994100,
            980381355,
            4109958455,
            2819808352,
            2716589560,
            2568741196,
            3681446669,
            3329971472,
            1835478071,
            660984891,
            3704678404,
            4045999559,
            3422617507,
            3040415634,
            1762651403,
            1719377915,
            3470491036,
            2693910283,
            3642056355,
            3138596744,
            1364962596,
            2073328063,
            1983633131,
            926494387,
            3423689081,
            2150032023,
            4096667949,
            1749200295,
            3328846651,
            309677260,
            2016342300,
            1779581495,
            3079819751,
            111262694,
            1274766160,
            443224088,
            298511866,
            1025883608,
            3806446537,
            1145181785,
            168956806,
            3641502830,
            3584813610,
            1689216846,
            3666258015,
            3200248200,
            1692713982,
            2646376535,
            4042768518,
            1618508792,
            1610833997,
            3523052358,
            4130873264,
            2001055236,
            3610705100,
            2202168115,
            4028541809,
            2961195399,
            1006657119,
            2006996926,
            3186142756,
            1430667929,
            3210227297,
            1314452623,
            4074634658,
            4101304120,
            2273951170,
            1399257539,
            3367210612,
            3027628629,
            1190975929,
            2062231137,
            2333990788,
            2221543033,
            2438960610,
            1181637006,
            548689776,
            2362791313,
            3372408396,
            3104550113,
            3145860560,
            296247880,
            1970579870,
            3078560182,
            3769228297,
            1714227617,
            3291629107,
            3898220290,
            166772364,
            1251581989,
            493813264,
            448347421,
            195405023,
            2709975567,
            677966185,
            3703036547,
            1463355134,
            2715995803,
            1338867538,
            1343315457,
            2802222074,
            2684532164,
            233230375,
            2599980071,
            2000651841,
            3277868038,
            1638401717,
            4028070440,
            3237316320,
            6314154,
            819756386,
            300326615,
            590932579,
            1405279636,
            3267499572,
            3150704214,
            2428286686,
            3959192993,
            3461946742,
            1862657033,
            1266418056,
            963775037,
            2089974820,
            2263052895,
            1917689273,
            448879540,
            3550394620,
            3981727096,
            150775221,
            3627908307,
            1303187396,
            508620638,
            2975983352,
            2726630617,
            1817252668,
            1876281319,
            1457606340,
            908771278,
            3720792119,
            3617206836,
            2455994898,
            1729034894,
            1080033504
          ],
          [
            976866871,
            3556439503,
            2881648439,
            1522871579,
            1555064734,
            1336096578,
            3548522304,
            2579274686,
            3574697629,
            3205460757,
            3593280638,
            3338716283,
            3079412587,
            564236357,
            2993598910,
            1781952180,
            1464380207,
            3163844217,
            3332601554,
            1699332808,
            1393555694,
            1183702653,
            3581086237,
            1288719814,
            691649499,
            2847557200,
            2895455976,
            3193889540,
            2717570544,
            1781354906,
            1676643554,
            2592534050,
            3230253752,
            1126444790,
            2770207658,
            2633158820,
            2210423226,
            2615765581,
            2414155088,
            3127139286,
            673620729,
            2805611233,
            1269405062,
            4015350505,
            3341807571,
            4149409754,
            1057255273,
            2012875353,
            2162469141,
            2276492801,
            2601117357,
            993977747,
            3918593370,
            2654263191,
            753973209,
            36408145,
            2530585658,
            25011837,
            3520020182,
            2088578344,
            530523599,
            2918365339,
            1524020338,
            1518925132,
            3760827505,
            3759777254,
            1202760957,
            3985898139,
            3906192525,
            674977740,
            4174734889,
            2031300136,
            2019492241,
            3983892565,
            4153806404,
            3822280332,
            352677332,
            2297720250,
            60907813,
            90501309,
            3286998549,
            1016092578,
            2535922412,
            2839152426,
            457141659,
            509813237,
            4120667899,
            652014361,
            1966332200,
            2975202805,
            55981186,
            2327461051,
            676427537,
            3255491064,
            2882294119,
            3433927263,
            1307055953,
            942726286,
            933058658,
            2468411793,
            3933900994,
            4215176142,
            1361170020,
            2001714738,
            2830558078,
            3274259782,
            1222529897,
            1679025792,
            2729314320,
            3714953764,
            1770335741,
            151462246,
            3013232138,
            1682292957,
            1483529935,
            471910574,
            1539241949,
            458788160,
            3436315007,
            1807016891,
            3718408830,
            978976581,
            1043663428,
            3165965781,
            1927990952,
            4200891579,
            2372276910,
            3208408903,
            3533431907,
            1412390302,
            2931980059,
            4132332400,
            1947078029,
            3881505623,
            4168226417,
            2941484381,
            1077988104,
            1320477388,
            886195818,
            18198404,
            3786409e3,
            2509781533,
            112762804,
            3463356488,
            1866414978,
            891333506,
            18488651,
            661792760,
            1628790961,
            3885187036,
            3141171499,
            876946877,
            2693282273,
            1372485963,
            791857591,
            2686433993,
            3759982718,
            3167212022,
            3472953795,
            2716379847,
            445679433,
            3561995674,
            3504004811,
            3574258232,
            54117162,
            3331405415,
            2381918588,
            3769707343,
            4154350007,
            1140177722,
            4074052095,
            668550556,
            3214352940,
            367459370,
            261225585,
            2610173221,
            4209349473,
            3468074219,
            3265815641,
            314222801,
            3066103646,
            3808782860,
            282218597,
            3406013506,
            3773591054,
            379116347,
            1285071038,
            846784868,
            2669647154,
            3771962079,
            3550491691,
            2305946142,
            453669953,
            1268987020,
            3317592352,
            3279303384,
            3744833421,
            2610507566,
            3859509063,
            266596637,
            3847019092,
            517658769,
            3462560207,
            3443424879,
            370717030,
            4247526661,
            2224018117,
            4143653529,
            4112773975,
            2788324899,
            2477274417,
            1456262402,
            2901442914,
            1517677493,
            1846949527,
            2295493580,
            3734397586,
            2176403920,
            1280348187,
            1908823572,
            3871786941,
            846861322,
            1172426758,
            3287448474,
            3383383037,
            1655181056,
            3139813346,
            901632758,
            1897031941,
            2986607138,
            3066810236,
            3447102507,
            1393639104,
            373351379,
            950779232,
            625454576,
            3124240540,
            4148612726,
            2007998917,
            544563296,
            2244738638,
            2330496472,
            2058025392,
            1291430526,
            424198748,
            50039436,
            29584100,
            3605783033,
            2429876329,
            2791104160,
            1057563949,
            3255363231,
            3075367218,
            3463963227,
            1469046755,
            985887462
          ]
        ];
        var u = {
          pbox: [],
          sbox: []
        };
        function h(y, C) {
          let g = C >> 24 & 255, d = C >> 16 & 255, x = C >> 8 & 255, A = C & 255, _ = y.sbox[0][g] + y.sbox[1][d];
          return _ = _ ^ y.sbox[2][x], _ = _ + y.sbox[3][A], _;
        }
        function f(y, C, g) {
          let d = C, x = g, A;
          for (let _ = 0; _ < o; ++_)
            d = d ^ y.pbox[_], x = h(y, d) ^ x, A = d, d = x, x = A;
          return A = d, d = x, x = A, x = x ^ y.pbox[o], d = d ^ y.pbox[o + 1], { left: d, right: x };
        }
        function p(y, C, g) {
          let d = C, x = g, A;
          for (let _ = o + 1; _ > 1; --_)
            d = d ^ y.pbox[_], x = h(y, d) ^ x, A = d, d = x, x = A;
          return A = d, d = x, x = A, x = x ^ y.pbox[1], d = d ^ y.pbox[0], { left: d, right: x };
        }
        function m(y, C, g) {
          for (let F = 0; F < 4; F++) {
            y.sbox[F] = [];
            for (let b = 0; b < 256; b++)
              y.sbox[F][b] = c[F][b];
          }
          let d = 0;
          for (let F = 0; F < o + 2; F++)
            y.pbox[F] = l[F] ^ C[d], d++, d >= g && (d = 0);
          let x = 0, A = 0, _ = 0;
          for (let F = 0; F < o + 2; F += 2)
            _ = f(y, x, A), x = _.left, A = _.right, y.pbox[F] = x, y.pbox[F + 1] = A;
          for (let F = 0; F < 4; F++)
            for (let b = 0; b < 256; b += 2)
              _ = f(y, x, A), x = _.left, A = _.right, y.sbox[F][b] = x, y.sbox[F][b + 1] = A;
          return !0;
        }
        var E = a.Blowfish = i.extend({
          _doReset: function() {
            if (this._keyPriorReset !== this._key) {
              var y = this._keyPriorReset = this._key, C = y.words, g = y.sigBytes / 4;
              m(u, C, g);
            }
          },
          encryptBlock: function(y, C) {
            var g = f(u, y[C], y[C + 1]);
            y[C] = g.left, y[C + 1] = g.right;
          },
          decryptBlock: function(y, C) {
            var g = p(u, y[C], y[C + 1]);
            y[C] = g.left, y[C + 1] = g.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        r.Blowfish = i._createHelper(E);
      }(), t.Blowfish;
    });
  }(tn)), tn.exports;
}
(function(s, e) {
  (function(t, r, n) {
    s.exports = r($(), or(), Hc(), zc(), st(), jc(), it(), ia(), On(), $c(), aa(), Wc(), Gc(), Kc(), Tn(), Xc(), Ze(), pe(), Zc(), Vc(), Yc(), Jc(), Qc(), el(), tl(), rl(), nl(), sl(), il(), al(), ol(), cl(), ll(), ul(), fl());
  })(z, function(t) {
    return t;
  });
})(sa);
var rn = sa.exports;
class Le {
  /**
     * @param {Object} client - Instance de ApiClient
     */
  constructor(e) {
    this.client = e;
  }
  /**
   * Vérifie que l'utilisateur est connecté
   * @throws {Error} Si non connecté
   */
  requireAuth() {
    if (this.client.isConnected() === !1)
      throw new Re("The request is unauthorized without being connected", De.UNAUTHORIZED);
  }
}
class hl extends Le {
  /**
   * Récupère tous les utilisateurs (les 10 premiers par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), ne(e, "getUsers"), await this.client.doRequest("/users", "get", null, e);
  }
  /**
   * Récupère l'utilisateur d'identifiant donné
   * @param {Integer|String} id un identifiant ou "me"
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e = "me", t = {}) {
    if (e != "me" && (isNaN(parseInt(e)) || parseInt(e) < 0)) throw new Re('id must be "me" or positive number', De.USER_ID_INVALID);
    return ne(t, "getUser"), await this.client.doRequest("/users/" + e, "get", null, t);
  }
  /**
   * Met a jour un utilisateur sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t = null, r = null) {
    return this.requireAuth(), k(e), J(t, "patchUser"), await this.client.doRequest("/users/" + e, "patch", t, null, r);
  }
  /**
   * Supprime l'utilisateur d'identifiant donné
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e) {
    return this.requireAuth(), k(e), await this.client.doRequest("/users/" + e, "delete");
  }
}
class dl extends Le {
  /**
   * Récupère toutes les bases de données (les 10 premières par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), ne(e, "getDatabases"), await this.client.doRequest("/databases", "get", null, e);
  }
  /**
   * Récupère la base de données d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getDatabase"), await this.client.doRequest("/databases/" + e, "get", null, t);
  }
  /**
   * Ajoute une base de données
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), J(e, "addDatabase"), await this.client.doRequest("/databases", "post", e, null, t);
  }
  /**
   * Met a jour une base de données en remplacant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "putDatabase"), await this.client.doRequest("/databases/" + e, "put", t, null, r);
  }
  /**
   * Met a jour une base de données sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "patchDatabase"), await this.client.doRequest("/databases/" + e, "patch", t, null, r);
  }
  /**
   * Supprime la base de données d'identifiant donné
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e) {
    return this.requireAuth(), k(e), await this.client.doRequest("/databases/" + e, "delete");
  }
}
class xl extends Le {
  /**
   * Récupère tous les groupes (les 10 premiers par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), ne(e, "getCommunities"), await this.client.doRequest("/communities", "get", null, e);
  }
  /**
   * Récupère le groupe d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getCommunity"), await this.client.doRequest("/communities/" + e, "get", null, t);
  }
  /**
   * Ajoute un groupe
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), J(e, "addCommunity"), await this.client.doRequest("/communities", "post", e, null, t);
  }
  /**
   * Met a jour un groupe en remplacant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "putCommunity"), await this.client.doRequest("/communities/" + e, "put", t, null, r);
  }
  /**
   * Met a jour un groupe sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "patchCommunity"), await this.client.doRequest("/communities/" + e, "patch", t, null, r);
  }
  /**
   * Supprime le groupe d'identifiant donné
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e) {
    return this.requireAuth(), k(e), await this.client.doRequest("/communities/" + e, "delete");
  }
}
class pl extends Le {
  /**
     * Récupère toutes les colonnes (les 10 premières par defaut)
     * @param {Integer} databaseId l'identifiant de la base de données des colonnes
     * @param {Integer} tableId l'identifiant de la table des colonnes
     * @param {Object} parameters 
     * @returns {Promise}
     */
  async getAll(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getColumns"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns", "get", null, r);
  }
  /**
   * Récupère la colonne d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r, n = {}) {
    return this.requireAuth(), k(e), k(t), k(r), ne(n, "getColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "get", null, n);
  }
  /**
   * Ajoute une colonne
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "addColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns", "post", r, null, n);
  }
  /**
   * Met a jour une colonne en remplacant la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, n, i = null) {
    return this.requireAuth(), k(e), k(t), k(r), J(n, "putColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "put", n, null, i);
  }
  /**
   * Met a jour une colonne sans remplacer la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, n, i = null) {
    return this.requireAuth(), k(e), k(t), k(r), J(n, "patchColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "patch", n, null, i);
  }
  /**
   * Supprime la colonne d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e, t, r) {
    return this.requireAuth(), k(e), k(t), k(r), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "delete");
  }
}
class ml extends Le {
  /**
   * Récupère tous les objets (les 10 premiers par defaut)
   * @param {Integer} databaseId l'identifiant de la base de données des objets
   * @param {Integer} tableId l'identifiant de la table des objets
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getFeatures"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features", "get", null, r);
  }
  /**
   * Récupère l objet d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de l objet
   * @param {Integer} tableId l'identifiant de la table de l objet
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r, n = {}) {
    return this.requireAuth(), k(e), k(t), k(r), ne(n, "getFeature"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features/" + r, "get", null, n);
  }
  /**
   * Ajoute un objet
   * @param {Integer} databaseId l'identifiant de base de données de l objet
   * @param {Integer} tableId l'identifiant de la table de l objet
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features", "post", r, null, n);
  }
  /**
   * Met a jour un objet sans remplacer la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de l objet
   * @param {Integer} tableId l'identifiant de la table de l objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, n, i = null) {
    return this.requireAuth(), k(e), k(t), k(r), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features/" + r, "patch", n, null, i);
  }
  /**
   * Supprime l'objet d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de l objet
   * @param {Integer} tableId l'identifiant de la table de l objet
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e, t, r) {
    return this.requireAuth(), k(e), k(t), k(r), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features/" + r, "delete");
  }
}
class gl extends Le {
  /**
   * Récupère tous les geoservices (les 10 premiers par defaut)
   * @param {Object} parameters
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), ne(e, "getGeoservices"), await this.client.doRequest("/geoservices", "get", null, e);
  }
  /**
   * Récupère le geoservice d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getGeoservice"), await this.client.doRequest("/geoservices/" + e, "get", null, t);
  }
  /**
   * Ajoute un geoservice
   * @param {Object} body
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), J(e, "addGeoservice"), await this.client.doRequest("/geoservices", "post", e, null, t);
  }
  /**
   * Met a jour un geoservice en remplaçant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "putGeoservice"), await this.client.doRequest("/geoservices/" + e, "put", t, null, r);
  }
  /**
   * Met a jour un geoservice sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "patchGeoservice"), await this.client.doRequest("/geoservices/" + e, "patch", t, null, r);
  }
  /**
   * Supprime le geoservice d'identifiant donné
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e) {
    return this.requireAuth(), k(e), await this.client.doRequest("/geoservices/" + e, "delete");
  }
}
class yl extends Le {
  /**
   * Récupère toutes les couches (les 10 premières par defaut)
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getLayers"), await this.client.doRequest("/communities/" + e + "/layers", "get", null, t);
  }
  /**
   * Récupère la couche d'identifiant donné
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getLayer"), await this.client.doRequest("/communities/" + e + "/layers/" + t, "get", null, r);
  }
  /**
   * Ajoute une couche
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "addLayer"), await this.client.doRequest("/communities/" + e + "/layers", "post", t, null, r);
  }
  /**
   * Met a jour une couche en remplaçant la totalité de l'objet
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "putLayer"), await this.client.doRequest("/communities/" + e + "/layers/" + t, "put", r, null, n);
  }
  /**
   * Met a jour une couche sans remplacer la totalité de l'objet
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "patchLayer"), await this.client.doRequest("/communities/" + e + "/layers/" + t, "patch", r, null, n);
  }
  /**
   * Supprime la couche d'identifiant donné
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e, t) {
    return this.requireAuth(), k(e), k(t), await this.client.doRequest("/communities/" + e + "/layers/" + t, "delete");
  }
}
class El extends Le {
  /**
     * Récupère tous les membres (les 10 premiers par defaut)
     * @param {Integer} communityId l'identifiant du groupe des membres
     * @param {Object} parameters 
     * @returns {Promise}
     */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getMembers"), await this.client.doRequest("/communities/" + e + "/members", "get", null, t);
  }
  /**
   * Récupère le membre d'identifiant donné
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getMember"), await this.client.doRequest("/communities/" + e + "/members/" + t, "get", null, r);
  }
  /**
   * Ajoute un membre
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "addMember"), await this.client.doRequest("/communities/" + e + "/members", "post", t, null, r);
  }
  /**
   * Met a jour un membre en remplaçant la totalité de l'objet
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "putMember"), await this.client.doRequest("/communities/" + e + "/members/" + t, "put", r, null, n);
  }
  /**
   * Met a jour un membre sans remplacer la totalité de l'objet
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "patchMember"), await this.client.doRequest("/communities/" + e + "/members/" + t, "patch", r, null, n);
  }
  /**
   * Supprime le membre d'identifiant donné
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e, t) {
    return this.requireAuth(), k(e), k(t), await this.client.doRequest("/communities/" + e + "/members/" + t, "delete");
  }
}
class vl extends Le {
  /**
   * Récupère toutes les permissions (les 10 premières par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), ne(e, "getPermissions"), await this.client.doRequest("/permissions", "get", null, e);
  }
  /**
   * Récupère la permission d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getPermission"), await this.client.doRequest("/permissions/" + e, "get", null, t);
  }
  /**
   * Ajoute une permission
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), J(e, "addPermission"), await this.client.doRequest("/permissions", "post", e, null, t);
  }
  /**
   * Met a jour une permission en remplaçant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "putPermission"), await this.client.doRequest("/permissions/" + e, "put", t, null, r);
  }
  /**
   * Met a jour une permission sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "patchPermission"), await this.client.doRequest("/permissions/" + e, "patch", t, null, r);
  }
  /**
   * Supprime la permission d'identifiant donné
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e) {
    return this.requireAuth(), k(e), await this.client.doRequest("/permissions/" + e, "delete");
  }
}
class Cl extends Le {
  /**
   * Récupère toutes les alertes (les 10 premières par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return ne(e, "getReports"), await this.client.doRequest("/reports", "get", null, e);
  }
  /**
   * Récupère l'alerte d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return k(e), ne(t, "getReport"), await this.client.doRequest("/reports/" + e, "get", null, t);
  }
  /**
   * Ajoute une alerte
   * @param {Object} body 
   * documents must be passed as blob
   * @returns {Promise}
   */
  async add(e) {
    return this.requireAuth(), J(e, "addReport"), vr(e), await this.client.doRequest("/reports", "post", e, null, "multipart/form-data");
  }
  /**
   * Met a jour une alerte en remplaçant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @returns {Promise}
   */
  async put(e, t) {
    return this.requireAuth(), k(e), J(t, "putReport"), vr(t), await this.client.doRequest("/reports/" + e, "put", t, null, "multipart/form-data");
  }
  /**
   * Met a jour une alerte sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @returns {Promise}
   */
  async patch(e, t) {
    return this.requireAuth(), k(e), J(t, "patchReport"), await this.client.doRequest("/reports/" + e, "patch", t);
  }
  /**
   * Supprime l'alerte d'identifiant donné
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e) {
    return this.requireAuth(), k(e), await this.client.doRequest("/reports/" + e, "delete");
  }
  /**
   * Ajoute un ou plusieurs documents a une alerte (max 4)
   * @param {Integer} reportId l identifiant de l alerte
   * @returns {Promise}
   */
  async addAttachments(e, t) {
    return this.requireAuth(), k(e), vr(t), await this.client.doRequest("/reports/" + e + "/attachments", "post", t, null, "multipart/form-data");
  }
  /**
   * Ajoute une reponse a une alerte
   * @param {Integer} reportId
   * @param {Object} body
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async addReply(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "addReply"), await this.client.doRequest("/reports/" + e + "/replies", "post", t, null, r);
  }
}
class wl extends Le {
  /**
   * Récupère toutes les tables (les 10 premières par defaut)
   * @param {Integer} databaseId l'identifiant de la base de données des tables
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getTables"), await this.client.doRequest("/databases/" + e + "/tables", "get", null, t);
  }
  /**
   * Récupère la table d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getTable"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "get", null, r);
  }
  /**
   * Récupère le numrec maximum parmi les objets de la table
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id
   * @param {Object} parameters
   * @returns {Promise}
   */
  async getMaxNumrec(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getTableMaxNumrec"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/max-numrec", "get", null, r);
  }
  /**
   * Ajoute une table
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "addTable"), await this.client.doRequest("/databases/" + e + "/tables", "post", t, null, r);
  }
  /**
   * Met a jour une table en remplaçant la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "putTable"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "put", r, null, n);
  }
  /**
   * Met a jour une table sans remplacer la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, n = null) {
    return this.requireAuth(), k(e), k(t), J(r, "patchTable"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "patch", r, null, n);
  }
  /**
   * Supprime la table d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id 
   * @returns {Promise}
   */
  async delete(e, t) {
    return this.requireAuth(), k(e), k(t), await this.client.doRequest("/databases/" + e + "/tables/" + t, "delete");
  }
}
class _l extends Le {
  /**
   * Récupère toutes les transactions (les 10 premières par defaut)
   * @param {Integer} databaseId l'identifiant de la base de données des transactions
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), ne(t, "getTransactions"), await this.client.doRequest("/databases/" + e + "/transactions", "get", null, t);
  }
  /**
   * Récupère la transaction d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la transaction
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), ne(r, "getTransaction"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "get", null, r);
  }
  /**
   * Ajoute une transaction
   * @param {Integer} databaseId l'identifiant de base de données de la transaction
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), J(t, "addTransaction"), await this.client.doRequest("/databases/" + e + "/transactions", "post", t, null, r);
  }
}
function oa(s) {
  return new Promise((e) => setTimeout(e, s));
}
const ci = 2e3;
class Al {
  constructor(e) {
    this.minIntervalMs = e > 0 ? 1e3 / e : 0, this.nextSlotAt = 0, this.chain = Promise.resolve();
  }
  enqueue(e) {
    let t = () => {
    };
    const r = new Promise((i) => {
      t = i;
    }), n = this.chain;
    return this.chain = n.then(() => r), n.then(async () => {
      const i = Date.now(), a = Math.max(0, this.nextSlotAt - i);
      return this.nextSlotAt = Math.max(i, this.nextSlotAt) + this.minIntervalMs, a > 0 && await oa(a), t(), e();
    });
  }
}
function bl(s) {
  var n, i;
  const e = (i = (n = s == null ? void 0 : s.response) == null ? void 0 : n.headers) == null ? void 0 : i["retry-after"];
  if (e == null || e === "")
    return 1e3;
  const t = Number(e);
  if (Number.isFinite(t))
    return Math.min(ci, Math.max(0, t * 1e3));
  const r = Date.parse(String(e));
  return Number.isFinite(r) ? Math.min(ci, Math.max(0, r - Date.now())) : 1e3;
}
const Fl = 25, Sl = 3;
class Bl {
  /**
   * @constructor
   * @param {String} apiBaseUrl ex: https://espacecollaboratif.ign.fr/gcms/api
   * @param {String} authBaseUrl ex: https://iam-url/auth/realms/demo/protocol/openid-connect
   * @param {String} clientId
   * @param {String} clientSecret
   * @param {{ requestsPerSecond?: number, maxRetries?: number }} options
   */
  constructor(e, t = null, r = null, n = null, i = {}) {
    if (!e) throw new Re("Mandatory parameter apiBaseUrl is missing.", De.BASE_URL_MISSING);
    const a = i ?? {};
    if (this.requestsPerSecond = a.requestsPerSecond ?? Fl, this.maxRetries = a.maxRetries ?? Sl, this.requestScheduler = new Al(this.requestsPerSecond), t && r && !this.setAuthParams(t, r, n))
      throw new Re("Failed to configure Auth Client", De.CLIENT_CONFIGURATION_ERROR);
    this.secret = null;
    try {
      this.secret = process.env.SECRET;
    } finally {
      this.secret || (this.secret = "A secret not so secret");
    }
    this.axiosInstance = ie.create({
      baseURL: e
    }), this._initResources();
  }
  _initResources() {
    this.user = new hl(this), this.database = new dl(this), this.community = new xl(this), this.column = new pl(this), this.feature = new ml(this), this.geoservice = new gl(this), this.layer = new yl(this), this.member = new El(this), this.permission = new vl(this), this.report = new Cl(this), this.table = new wl(this), this.transaction = new _l(this);
  }
  /**
   * Changement de l'url de base de l'api
   * @param {String} baseUrl la nouvelle url de l'api
   * @return {Boolean} true si l'url a été changée
   */
  setBaseUrl(e) {
    if (!e) return !1;
    try {
      return this.axiosInstance.defaults.baseURL = e, !0;
    } catch {
      return !1;
    }
  }
  /**
   * Recuperation de l'url de base de l'api
   * @return {String} l url de base de l api
   */
  getBaseUrl() {
    return this.axiosInstance.defaults.baseURL;
  }
  /**
   * Changement des parametres d authentification
   * @param {String} authBaseUrl la nouvelle url de l'api d authentification
   * @param {String} clientId le nouveau client id
   * @param {String} clientSecret le nouveau client secret (optionnel, non présent si PKCE)
   * @return {Boolean} true si l'url a été changée
   */
  setAuthParams(e, t, r = null) {
    if (!e || !t) return !1;
    try {
      return this.disconnect(), this.clientAuth = new kc(e, t, r), this.accessToken = null, this.username = null, this.password = null, !0;
    } catch {
      return !1;
    }
  }
  /**
   * On stocke les informations de l utilisateur pour pouvoir récupérer le token
   * Le mot de passe est stocké encrypté (la variable d'environement SECRET est utilisée si elle est settée)
   * @param {String} username 
   * @param {String} password le mot de passe en clair ou encrypte
   * @param {Boolean} encrypted true si le mot de passe est deja encrypte
   */
  setCredentials(e, t, r = !1) {
    if (!e) throw new Error("No user provided");
    if (!t) throw new Error("No password provided");
    this.username = e, r ? this.password = t : this.password = rn.AES.encrypt(JSON.stringify(t), this.secret).toString(), this.username && e != this.username && this.disconnect();
  }
  /**
     * Configure un token obtenu via SSO externe (PKCE ou autre)
     * Permet d'utiliser l'API sans fournir de credentials
     * @param {String} accessToken - Le token d'accès OAuth2
     * @param {String} refreshToken - Le refresh token (optionnel)
     * @param {Number} expiresIn - Durée de validité en secondes (défaut: 43200 -> 12 heures)
     * @param {Number} refreshExpiresIn - Durée du refresh token en secondes
     */
  setExternalToken(e, t = null, r = 43200, n = null) {
    if (!this.clientAuth)
      throw new Re("Auth client must be configured first. Call setAuthParams() before setExternalToken()", De.CLIENT_CONFIGURATION_ERROR);
    this.clientAuth.setExternalToken(e, t, r, n), this.username = null, this.password = null;
  }
  /**
   * Deconnexion de l utilisateur
   * @return void
   */
  disconnect() {
    this.clientAuth && this.clientAuth.disconnect();
  }
  /**
   * Est ce qu un utilisateur est connecte
   * @returns {Boolean|null} 
   * renvoie true si un utilisateur est connecte et au moins une requete a ete effectuee
   * renvoie null si aucune requête effectuée mais un utilisateur est renseigne (on ne sait pas encore s'il est valide!)
   * false si aucun utilisateur renseigne ou invalide
   */
  isConnected() {
    return this.clientAuth && this.clientAuth.token ? !0 : this.username && this.clientAuth && !this.clientAuth.started ? null : !1;
  }
  /**
   * Rajoute la cle headers avec l authorizatoin
   * @param {Object} config 
   */
  async addAuthorization(e) {
    if (!this.clientAuth)
      throw new Re("Auth client must be configured first. Call setAuthParams() before adding authorization", De.CLIENT_CONFIGURATION_ERROR);
    if (this.clientAuth.usesExternalToken) {
      let t = await this.clientAuth.fetchToken(null);
      e.headers = { Authorization: "Bearer " + t };
    } else if (this.username && this.password) {
      let t = {
        username: this.username,
        password: JSON.parse(rn.AES.decrypt(this.password, this.secret).toString(rn.enc.Utf8))
      }, r = await this.clientAuth.fetchToken(t);
      e.headers = { Authorization: "Bearer " + r };
    }
  }
  /**
   * Fait une requête vers l'api collaborative
   * @param {String} url l'url relative qui nous intéresse. ex: /users
   * @param {String} method get/post/patch/put/delete
   * @param {Object} body les paramètres post 
   * @param {Object} params les paramètres get
   * @param {Array<function>} transformRequest une fonction pouvant transformer les donnees ou le header ex: [function (data, headers) {// Do whatever you want to transform the data   return data; }]
   * @returns {Promise}
   */
  async doRequest(e, t, r = null, n = null, i = "application/json") {
    let a = {
      url: e,
      method: t,
      params: n
    };
    return await this.addAuthorization(a), r && ["application/x-www-form-urlencoded", "multipart/form-data"].includes(i) && (r = na(r)), r && (a.headers["Content-Type"] = i || "application/json", a.data = r), await this._sendLimited(() => this.axiosInstance.request(a));
  }
  /**
   * Telecharge un document
   * @param url
   * @return {Promise}
   */
  async getDocument(e) {
    let t = {
      url: e,
      method: "GET",
      responseType: "arraybuffer"
    };
    return await this.addAuthorization(t), await this._sendLimited(() => this.axiosInstance.request(t));
  }
  async _sendLimited(e) {
    var r;
    let t = 0;
    for (; ; )
      try {
        return await this.requestScheduler.enqueue(e);
      } catch (n) {
        if (((r = n == null ? void 0 : n.response) == null ? void 0 : r.status) !== 429 || t >= this.maxRetries)
          throw n;
        t += 1;
        const a = bl(n);
        a > 0 && await oa(a);
      }
  }
  // Fonctions gardées pour rétro-compatibilité
  async getUsers(e = {}) {
    return await this.user.getAll(e);
  }
  async getUser(e = "me", t = {}) {
    return await this.user.get(e, t);
  }
  async patchUser(e, t = null, r = null) {
    return await this.user.patch(e, t, r);
  }
  async deleteUser(e) {
    return await this.user.delete(e);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getDatabases(e = {}) {
    return await this.database.getAll(e);
  }
  async getDatabase(e, t = {}) {
    return await this.database.get(e, t);
  }
  async addDatabase(e, t = null) {
    return await this.database.add(e, t);
  }
  async putDatabase(e, t, r = null) {
    return await this.database.put(e, t, r);
  }
  async patchDatabase(e, t, r = null) {
    return await this.database.patch(e, t, r);
  }
  async deleteDatabase(e) {
    return await this.database.delete(e);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getCommunities(e = {}) {
    return await this.community.getAll(e);
  }
  async getCommunity(e, t = {}) {
    return await this.community.get(e, t);
  }
  async addCommunity(e, t = null) {
    return await this.community.add(e, t);
  }
  async putCommunity(e, t, r = null) {
    return await this.community.put(e, t, r);
  }
  async patchCommunity(e, t, r = null) {
    return await this.community.patch(e, t, r);
  }
  async deleteCommunity(e) {
    return await this.community.delete(e);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getPermissions(e = {}) {
    return await this.permission.getAll(e);
  }
  async getPermission(e, t = {}) {
    return await this.permission.get(e, t);
  }
  async addPermission(e, t = null) {
    return await this.permission.add(e, t);
  }
  async putPermission(e, t, r = null) {
    return await this.permission.put(e, t, r);
  }
  async patchPermission(e, t, r = null) {
    return await this.permission.patch(e, t, r);
  }
  async deletePermission(e) {
    return await this.permission.delete(e);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getGeoservices(e = {}) {
    return await this.geoservice.getAll(e);
  }
  async getGeoservice(e, t = {}) {
    return await this.geoservice.get(e, t);
  }
  async addGeoservice(e, t = null) {
    return await this.geoservice.add(e, t);
  }
  async putGeoservice(e, t, r = null) {
    return await this.geoservice.put(e, t, r);
  }
  async patchGeoservice(e, t, r = null) {
    return await this.geoservice.patch(e, t, r);
  }
  async deleteGeoservice(e) {
    return await this.geoservice.delete(e);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getReports(e = {}) {
    return await this.report.getAll(e);
  }
  async getReport(e, t = {}) {
    return await this.report.get(e, t);
  }
  async addReport(e) {
    return await this.report.add(e);
  }
  async putReport(e, t) {
    return await this.report.put(e, t);
  }
  async patchReport(e, t) {
    return await this.report.patch(e, t);
  }
  async deleteReport(e) {
    return await this.report.delete(e);
  }
  async addAttachments(e, t) {
    return await this.report.addAttachments(e, t);
  }
  async addReply(e, t, r = null) {
    return await this.report.addReply(e, t, r);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getLayers(e, t = {}) {
    return await this.layer.getAll(e, t);
  }
  async getLayer(e, t, r = {}) {
    return await this.layer.get(e, t, r);
  }
  async addLayer(e, t, r = null) {
    return await this.layer.add(e, t, r);
  }
  async putLayer(e, t, r, n = null) {
    return await this.layer.put(e, t, r, n);
  }
  async patchLayer(e, t, r, n = null) {
    return await this.layer.patch(e, t, r, n);
  }
  async deleteLayer(e, t) {
    return await this.layer.delete(e, t);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getTransactions(e, t = {}) {
    return await this.transaction.getAll(e, t);
  }
  async getTransaction(e, t, r = {}) {
    return await this.transaction.get(e, t, r);
  }
  async addTransaction(e, t, r = null) {
    return await this.transaction.add(e, t, r);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getTables(e, t = {}) {
    return await this.table.getAll(e, t);
  }
  async getTable(e, t, r = {}) {
    return await this.table.get(e, t, r);
  }
  async getTableMaxNumrec(e, t, r = {}) {
    return await this.table.getMaxNumrec(e, t, r);
  }
  async addTable(e, t, r = null) {
    return await this.table.add(e, t, r);
  }
  async putTable(e, t, r, n = null) {
    return await this.table.put(e, t, r, n);
  }
  async patchTable(e, t, r, n = null) {
    return await this.table.patch(e, t, r, n);
  }
  async deleteTable(e, t) {
    return await this.table.delete(e, t);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getColumns(e, t, r = {}) {
    return await this.column.getAll(e, t, r);
  }
  async getColumn(e, t, r, n = {}) {
    return await this.column.get(e, t, r, n);
  }
  async addColumn(e, t, r, n = null) {
    return await this.column.add(e, t, r, n);
  }
  async putColumn(e, t, r, n, i = null) {
    return await this.column.put(e, t, r, n, i);
  }
  async patchColumn(e, t, r, n, i = null) {
    return await this.column.patch(e, t, r, n, i);
  }
  async deleteColumn(e, t, r) {
    return await this.column.delete(e, t, r);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getFeatures(e, t, r = {}) {
    return await this.feature.getAll(e, t, r);
  }
  async getFeature(e, t, r, n = {}) {
    return await this.feature.get(e, t, r, n);
  }
  async addFeature(e, t, r, n = null) {
    return await this.feature.add(e, t, r, n);
  }
  async patchFeature(e, t, r, n, i = null) {
    return await this.feature.patch(e, t, r, n, i);
  }
  async deleteFeature(e, t, r) {
    return await this.feature.delete(e, t, r);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getMembers(e, t = {}) {
    return await this.member.getAll(e, t);
  }
  async getMember(e, t, r = {}) {
    return await this.member.get(e, t, r);
  }
  async addMember(e, t, r = null) {
    return await this.member.add(e, t, r);
  }
  async putMember(e, t, r, n = null) {
    return await this.member.put(e, t, r, n);
  }
  async patchMember(e, t, r, n = null) {
    return await this.member.patch(e, t, r, n);
  }
  async deleteMember(e, t) {
    return await this.member.delete(e, t);
  }
}
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var xt;
(function(s) {
  s.Unimplemented = "UNIMPLEMENTED", s.Unavailable = "UNAVAILABLE";
})(xt || (xt = {}));
class nn extends Error {
  constructor(e, t, r) {
    super(e), this.message = e, this.code = t, this.data = r;
  }
}
const Dl = (s) => {
  var e, t;
  return s != null && s.androidBridge ? "android" : !((t = (e = s == null ? void 0 : s.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, Rl = (s) => {
  const e = s.CapacitorCustomPlatform || null, t = s.Capacitor || {}, r = t.Plugins = t.Plugins || {}, n = () => e !== null ? e.name : Dl(s), i = () => n() !== "web", a = (h) => {
    const f = c.get(h);
    return !!(f != null && f.platforms.has(n()) || o(h));
  }, o = (h) => {
    var f;
    return (f = t.PluginHeaders) === null || f === void 0 ? void 0 : f.find((p) => p.name === h);
  }, l = (h) => s.console.error(h), c = /* @__PURE__ */ new Map(), u = (h, f = {}) => {
    const p = c.get(h);
    if (p)
      return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`), p.proxy;
    const m = n(), E = o(h);
    let y;
    const C = async () => (!y && m in f ? y = typeof f[m] == "function" ? y = await f[m]() : y = f[m] : e !== null && !y && "web" in f && (y = typeof f.web == "function" ? y = await f.web() : y = f.web), y), g = (b, R) => {
      var w, S;
      if (E) {
        const B = E == null ? void 0 : E.methods.find((D) => R === D.name);
        if (B)
          return B.rtype === "promise" ? (D) => t.nativePromise(h, R.toString(), D) : (D, N) => t.nativeCallback(h, R.toString(), D, N);
        if (b)
          return (w = b[R]) === null || w === void 0 ? void 0 : w.bind(b);
      } else {
        if (b)
          return (S = b[R]) === null || S === void 0 ? void 0 : S.bind(b);
        throw new nn(`"${h}" plugin is not implemented on ${m}`, xt.Unimplemented);
      }
    }, d = (b) => {
      let R;
      const w = (...S) => {
        const B = C().then((D) => {
          const N = g(D, b);
          if (N) {
            const U = N(...S);
            return R = U == null ? void 0 : U.remove, U;
          } else
            throw new nn(`"${h}.${b}()" is not implemented on ${m}`, xt.Unimplemented);
        });
        return b === "addListener" && (B.remove = async () => R()), B;
      };
      return w.toString = () => `${b.toString()}() { [capacitor code] }`, Object.defineProperty(w, "name", {
        value: b,
        writable: !1,
        configurable: !1
      }), w;
    }, x = d("addListener"), A = d("removeListener"), _ = (b, R) => {
      const w = x({ eventName: b }, R), S = async () => {
        const D = await w;
        A({
          eventName: b,
          callbackId: D
        }, R);
      }, B = new Promise((D) => w.then(() => D({ remove: S })));
      return B.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await S();
      }, B;
    }, F = new Proxy({}, {
      get(b, R) {
        switch (R) {
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return E ? _ : x;
          case "removeListener":
            return A;
          default:
            return d(R);
        }
      }
    });
    return r[h] = F, c.set(h, {
      name: h,
      proxy: F,
      platforms: /* @__PURE__ */ new Set([...Object.keys(f), ...E ? [m] : []])
    }), F;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = n, t.handleError = l, t.isNativePlatform = i, t.isPluginAvailable = a, t.registerPlugin = u, t.Exception = nn, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, Ol = (s) => s.Capacitor = Rl(s), gn = /* @__PURE__ */ Ol(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), gt = gn.registerPlugin;
class Pn {
  constructor() {
    this.listeners = {}, this.retainedEventArguments = {}, this.windowListeners = {};
  }
  addListener(e, t) {
    let r = !1;
    this.listeners[e] || (this.listeners[e] = [], r = !0), this.listeners[e].push(t);
    const i = this.windowListeners[e];
    i && !i.registered && this.addWindowListener(i), r && this.sendRetainedArgumentsForEvent(e);
    const a = async () => this.removeListener(e, t);
    return Promise.resolve({ remove: a });
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const e in this.windowListeners)
      this.removeWindowListener(this.windowListeners[e]);
    this.windowListeners = {};
  }
  notifyListeners(e, t, r) {
    const n = this.listeners[e];
    if (!n) {
      if (r) {
        let i = this.retainedEventArguments[e];
        i || (i = []), i.push(t), this.retainedEventArguments[e] = i;
      }
      return;
    }
    n.forEach((i) => i(t));
  }
  hasListeners(e) {
    var t;
    return !!(!((t = this.listeners[e]) === null || t === void 0) && t.length);
  }
  registerWindowListener(e, t) {
    this.windowListeners[t] = {
      registered: !1,
      windowEventName: e,
      pluginEventName: t,
      handler: (r) => {
        this.notifyListeners(t, r);
      }
    };
  }
  unimplemented(e = "not implemented") {
    return new gn.Exception(e, xt.Unimplemented);
  }
  unavailable(e = "not available") {
    return new gn.Exception(e, xt.Unavailable);
  }
  async removeListener(e, t) {
    const r = this.listeners[e];
    if (!r)
      return;
    const n = r.indexOf(t);
    n !== -1 && this.listeners[e].splice(n, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
  }
  addWindowListener(e) {
    window.addEventListener(e.windowEventName, e.handler), e.registered = !0;
  }
  removeWindowListener(e) {
    e && (window.removeEventListener(e.windowEventName, e.handler), e.registered = !1);
  }
  sendRetainedArgumentsForEvent(e) {
    const t = this.retainedEventArguments[e];
    t && (delete this.retainedEventArguments[e], t.forEach((r) => {
      this.notifyListeners(e, r);
    }));
  }
}
const li = (s) => encodeURIComponent(s).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), ui = (s) => s.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class Tl extends Pn {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((r) => {
      if (r.length <= 0)
        return;
      let [n, i] = r.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      n = ui(n).trim(), i = ui(i).trim(), t[n] = i;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = li(e.key), r = li(e.value), n = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", i = (e.path || "/").replace("path=", ""), a = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${r || ""}${n}; path=${i}; ${a};`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async deleteCookie(e) {
    try {
      document.cookie = `${e.key}=; Max-Age=0`;
    } catch (t) {
      return Promise.reject(t);
    }
  }
  async clearCookies() {
    try {
      const e = document.cookie.split(";") || [];
      for (const t of e)
        document.cookie = t.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
gt("CapacitorCookies", {
  web: () => new Tl()
});
const Pl = async (s) => new Promise((e, t) => {
  const r = new FileReader();
  r.onload = () => {
    const n = r.result;
    e(n.indexOf(",") >= 0 ? n.split(",")[1] : n);
  }, r.onerror = (n) => t(n), r.readAsDataURL(s);
}), Ll = (s = {}) => {
  const e = Object.keys(s);
  return Object.keys(s).map((n) => n.toLocaleLowerCase()).reduce((n, i, a) => (n[i] = s[e[a]], n), {});
}, kl = (s, e = !0) => s ? Object.entries(s).reduce((r, n) => {
  const [i, a] = n;
  let o, l;
  return Array.isArray(a) ? (l = "", a.forEach((c) => {
    o = e ? encodeURIComponent(c) : c, l += `${i}=${o}&`;
  }), l.slice(0, -1)) : (o = e ? encodeURIComponent(a) : a, l = `${i}=${o}`), `${r}&${l}`;
}, "").substr(1) : null, Il = (s, e = {}) => {
  const t = Object.assign({ method: s.method || "GET", headers: s.headers }, e), n = Ll(s.headers)["content-type"] || "";
  if (typeof s.data == "string")
    t.body = s.data;
  else if (n.includes("application/x-www-form-urlencoded")) {
    const i = new URLSearchParams();
    for (const [a, o] of Object.entries(s.data || {}))
      i.set(a, o);
    t.body = i.toString();
  } else if (n.includes("multipart/form-data") || s.data instanceof FormData) {
    const i = new FormData();
    if (s.data instanceof FormData)
      s.data.forEach((o, l) => {
        i.append(l, o);
      });
    else
      for (const o of Object.keys(s.data))
        i.append(o, s.data[o]);
    t.body = i;
    const a = new Headers(t.headers);
    a.delete("content-type"), t.headers = a;
  } else (n.includes("application/json") || typeof s.data == "object") && (t.body = JSON.stringify(s.data));
  return t;
};
class Nl extends Pn {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = Il(e, e.webFetchExtra), r = kl(e.params, e.shouldEncodeUrlParams), n = r ? `${e.url}?${r}` : e.url, i = await fetch(n, t), a = i.headers.get("content-type") || "";
    let { responseType: o = "text" } = i.ok ? e : {};
    a.includes("application/json") && (o = "json");
    let l, c;
    switch (o) {
      case "arraybuffer":
      case "blob":
        c = await i.blob(), l = await Pl(c);
        break;
      case "json":
        l = await i.json();
        break;
      case "document":
      case "text":
      default:
        l = await i.text();
    }
    const u = {};
    return i.headers.forEach((h, f) => {
      u[f] = h;
    }), {
      data: l,
      headers: u,
      status: i.status,
      url: i.url
    };
  }
  /**
   * Perform an Http GET request given a set of options
   * @param options Options to build the HTTP request
   */
  async get(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "GET" }));
  }
  /**
   * Perform an Http POST request given a set of options
   * @param options Options to build the HTTP request
   */
  async post(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "POST" }));
  }
  /**
   * Perform an Http PUT request given a set of options
   * @param options Options to build the HTTP request
   */
  async put(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PUT" }));
  }
  /**
   * Perform an Http PATCH request given a set of options
   * @param options Options to build the HTTP request
   */
  async patch(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "PATCH" }));
  }
  /**
   * Perform an Http DELETE request given a set of options
   * @param options Options to build the HTTP request
   */
  async delete(e) {
    return this.request(Object.assign(Object.assign({}, e), { method: "DELETE" }));
  }
}
const sn = gt("CapacitorHttp", {
  web: () => new Nl()
});
var fi;
(function(s) {
  s.Dark = "DARK", s.Light = "LIGHT", s.Default = "DEFAULT";
})(fi || (fi = {}));
var hi;
(function(s) {
  s.StatusBar = "StatusBar", s.NavigationBar = "NavigationBar";
})(hi || (hi = {}));
class Ul extends Pn {
  async setStyle() {
    this.unavailable("not available for web");
  }
  async setAnimation() {
    this.unavailable("not available for web");
  }
  async show() {
    this.unavailable("not available for web");
  }
  async hide() {
    this.unavailable("not available for web");
  }
}
gt("SystemBars", {
  web: () => new Ul()
});
const di = gt("Browser", {
  web: () => import("./web-DSXduV7T.js").then((s) => new s.BrowserWeb())
}), ql = gt("App", {
  web: () => import("./web-BYrB6Vn4.js").then((s) => new s.AppWeb())
}), Ml = gt("Device", {
  web: () => import("./web-Bgm0MS0w.js").then((s) => new s.DeviceWeb())
}), an = "temp_code_verifier", Mt = "access_token_expires_at", Ht = "refresh_token_expires_at";
class Ku {
  constructor(e) {
    this.config = e, this.apiClient = new Bl(e.apiBaseUrl, e.oAuthBaseUrl, e.oAuthClientId);
  }
  /**
   * Get a stored timestamp from localStorage
   * @param key - The key to get the stored timestamp for
   * @returns The stored timestamp or null if not found
   */
  getStoredTimestamp(e) {
    const t = localStorage.getItem(e);
    return t ? Number(t) : null;
  }
  /**
   * Persist the token metadata (expiresIn and refreshExpiresIn) to localStorage
   * @param tokens - The tokens to persist
   * @returns The tokens to persist
   */
  persistTokenMetadata(e) {
    const t = Date.now();
    e.expiresIn ? localStorage.setItem(Mt, (t + e.expiresIn * 1e3).toString()) : localStorage.removeItem(Mt), e.refreshExpiresIn ? localStorage.setItem(Ht, (t + e.refreshExpiresIn * 1e3).toString()) : localStorage.removeItem(Ht);
  }
  /**
   * Clear the temporary code verifier from localStorage
   */
  clearTempCodeVerifier() {
    localStorage.removeItem(an);
  }
  /**
   * Clear the local authentication metadata from localStorage
   */
  clearLocalAuthMetadata() {
    this.clearTempCodeVerifier(), localStorage.removeItem(Mt), localStorage.removeItem(Ht);
  }
  /**
   * Classic 'old' login with email and password
   * @param email 
   * @param password 
   * @returns 
   */
  async loginWithPassword(e, t) {
    try {
      this.apiClient.setCredentials(e, t);
      const r = await this.apiClient.user.get("me");
      return { success: !0, user: Yn(r.data) };
    } catch (r) {
      try {
        this.apiClient.disconnect();
      } catch {
        throw new Error(se.FAILED_TO_DISCONNECT);
      }
      return r.response && r.response.status === 401 ? {
        success: !1,
        user: null,
        error: new Error(se.UNAUTHORIZED)
      } : {
        success: !1,
        user: null,
        error: new Error(se.LOGIN_FAILED)
      };
    }
  }
  /**
   * Login with OAuth
   * @param redirectUri the redirect URI to use for the OAuth flow - is different depending on the platform
   * @returns the authentication result
   */
  async loginWithOAuth(e) {
    try {
      const t = uo(), r = await ho(t), n = (await Ml.getInfo()).platform;
      localStorage.setItem(an, t);
      const i = `${this.config.oAuthBaseUrl}/auth?` + new URLSearchParams({
        client_id: this.config.oAuthClientId,
        redirect_uri: e,
        response_type: "code",
        scope: "openid profile email",
        code_challenge: r,
        code_challenge_method: "S256"
      }).toString();
      return n === "web" ? (window.location.href = i, {
        success: !1,
        user: null,
        error: new Error(se.OAUTH_REDIRECT)
      }) : new Promise((a) => {
        let o = null, l = null, c = !1, u = !1;
        const h = (p) => {
          c || (c = !0, o == null || o.remove(), l == null || l.remove(), a(p));
        }, f = async ({ url: p }) => {
          if (p.startsWith(e.split("?")[0])) {
            u = !0, o == null || o.remove();
            try {
              const m = new URL(p), E = m.searchParams.get("code");
              if (m.searchParams.get("error")) {
                this.clearTempCodeVerifier(), h({
                  success: !1,
                  user: null,
                  error: new Error(se.OAUTH_CALLBACK_FAILED)
                });
                return;
              }
              if (!E) {
                this.clearTempCodeVerifier(), h({
                  success: !1,
                  user: null,
                  error: new Error(se.NO_AUTHORIZATION_CODE)
                });
                return;
              }
              h(await this.completeOAuthCallback(E, e));
            } catch {
              this.clearTempCodeVerifier(), h({
                success: !1,
                user: null,
                error: new Error(se.OAUTH_CALLBACK_FAILED)
              });
            }
          }
        };
        (async () => {
          try {
            o = await ql.addListener("appUrlOpen", f), l = await di.addListener("browserFinished", async () => {
              u || (this.clearTempCodeVerifier(), h({
                success: !1,
                user: null,
                error: new Error(se.OAUTH_CALLBACK_FAILED)
              }));
            }), await di.open({ url: i });
          } catch {
            this.clearTempCodeVerifier(), h({
              success: !1,
              user: null,
              error: new Error(se.OAUTH_CALLBACK_FAILED)
            });
          }
        })();
      });
    } catch {
      try {
        this.clearTempCodeVerifier();
      } catch {
      }
      return {
        success: !1,
        user: null,
        error: new Error(se.OAUTH_CALLBACK_FAILED)
      };
    }
  }
  /**
   * Complete an OAuth redirect/callback once the authorization code has been received.
   * Consumers can use this for web callback routes while mobile flows reuse the same path internally.
   * @param code the authorization code returned by the OAuth provider
   * @param redirectUri the redirect URI used when starting the OAuth flow
   * @returns the authenticated user and tokens on success
   */
  async completeOAuthCallback(e, t) {
    try {
      const r = await this.exchangeCodeForTokens(e, t);
      if (!r.success || !r.tokens)
        return {
          success: !1,
          user: null,
          error: r.error
        };
      this.apiClient.setExternalToken(
        r.tokens.accessToken,
        r.tokens.refreshToken,
        r.tokens.expiresIn,
        r.tokens.refreshExpiresIn
      );
      const n = await this.apiClient.user.get("me"), i = Yn(n.data);
      return i ? {
        success: !0,
        user: i,
        tokens: r.tokens
      } : {
        success: !1,
        user: null,
        error: new Error(se.FAILED_TO_FETCH_USER_INFO)
      };
    } catch {
      return this.clearTempCodeVerifier(), {
        success: !1,
        user: null,
        error: new Error(se.OAUTH_CALLBACK_FAILED)
      };
    }
  }
  /**
  * Refresh the access token using the stored refresh token
  */
  async refreshAccessToken(e) {
    try {
      if (!e)
        return { success: !1, error: new Error(se.REFRESH_TOKEN_MISSING) };
      const t = this.getStoredTimestamp(Ht);
      if (t !== null && Date.now() >= t)
        return { success: !1, error: new Error(se.REFRESH_TOKEN_EXPIRED) };
      const r = `${this.config.oAuthBaseUrl}/token`, n = await sn.post({
        url: r,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: this.config.oAuthClientId,
          refresh_token: e
        }).toString()
      });
      if (n.status >= 400)
        return { success: !1, error: new Error(se.REFRESH_TOKEN_FAILED) };
      const i = n.data, a = {
        accessToken: i.access_token,
        refreshToken: i.refresh_token,
        idToken: i.id_token,
        expiresIn: i.expires_in,
        refreshExpiresIn: i.refresh_expires_in
      };
      return this.persistTokenMetadata(a), { success: !0, tokens: a };
    } catch {
      return {
        success: !1,
        error: new Error(se.REFRESH_TOKEN_FAILED)
      };
    }
  }
  /**
  * Exchange authorization code for tokens
  */
  async exchangeCodeForTokens(e, t) {
    try {
      const r = localStorage.getItem(an);
      if (!r)
        return {
          success: !1,
          error: new Error(se.CODE_VERIFIER_MISSING)
        };
      const n = `${this.config.oAuthBaseUrl}/token`, i = await sn.post({
        url: n,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: this.config.oAuthClientId,
          code: e,
          redirect_uri: t,
          code_verifier: r
        }).toString()
      });
      if (i.status >= 400)
        return {
          success: !1,
          error: new Error(se.TOKEN_EXCHANGE_FAILED)
        };
      const a = {
        accessToken: i.data.access_token,
        refreshToken: i.data.refresh_token,
        idToken: i.data.id_token,
        expiresIn: i.data.expires_in,
        refreshExpiresIn: i.data.refresh_expires_in
      };
      return this.persistTokenMetadata(a), this.clearTempCodeVerifier(), { success: !0, tokens: a };
    } catch {
      try {
        this.clearTempCodeVerifier();
      } catch {
        throw new Error(se.TOKEN_EXCHANGE_FAILED);
      }
      return {
        success: !1,
        error: new Error(se.TOKEN_EXCHANGE_FAILED)
      };
    }
  }
  /**
  * Logout and clear credentials.
  * Clears local session state first so logout still completes even if the
  * revoke request is slow, fails, or the app is backgrounded immediately after.
  * Token revocation remains best-effort.
  * @param accessToken - The access token to revoke
  * @param refreshToken - The refresh token to revoke
  * @returns the result of the logout operation
  */
  async logout(e, t) {
    try {
      return this.clearInMemoryAuthState(), this.clearLocalAuthMetadata(), this.revokeToken(e), this.revokeToken(t), { success: !0 };
    } catch {
      return { success: !1, error: new Error(se.UNKNOWN_ERROR) };
    }
  }
  /**
   * Revoke a token
   * @param token - The token to revoke
   * @returns the result of the revoke token operation
   */
  async revokeToken(e) {
    if (!e || e.length === 0)
      return { success: !1, error: new Error(se.TOKEN_MISSING) };
    try {
      return await sn.post({
        url: `${this.config.oAuthBaseUrl}/revoke`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: new URLSearchParams({
          client_id: this.config.oAuthClientId,
          token: e
        }).toString()
      }), { success: !0 };
    } catch (t) {
      return console.error("revokeToken => error", t), { success: !1, error: new Error(se.UNKNOWN_ERROR) };
    }
  }
  /**
   * Clear the in-memory authentication state
   */
  clearInMemoryAuthState() {
    this.apiClient.username = null, this.apiClient.password = null, this.apiClient.clientAuth && (this.apiClient.clientAuth.started = !1, this.apiClient.clientAuth.usesExternalToken = !1, this.apiClient.clientAuth.token = null, this.apiClient.clientAuth.refreshToken = null, this.apiClient.clientAuth.expirationDate = null, this.apiClient.clientAuth.refreshExpirationDate = null);
  }
  /**
   * Check if the access token is expired or about to expire
   * @param bufferSeconds - Consider token expired this many seconds before actual expiry (default: 60)
   * @returns true if the access token is expired or about to expire, false otherwise
   */
  async isAccessTokenExpired(e = 60) {
    try {
      const t = this.getStoredTimestamp(Mt);
      if (t === null)
        return !0;
      const r = e * 1e3;
      return Date.now() >= t - r;
    } catch (t) {
      return console.error("isAccessTokenExpired => error", t), !0;
    }
  }
}
export {
  Ku as A,
  Je as C,
  lo as D,
  Na as E,
  Eu as R,
  At as S,
  wu as U,
  vu as V,
  Pn as W,
  wi as a,
  Wa as b,
  vn as c,
  Cn as d,
  Zt as e,
  Z as f,
  za as g,
  _u as h,
  Cu as i,
  Ye as j,
  Au as k,
  bu as l,
  Fu as m,
  un as n,
  Vt as o,
  kt as p
};
//# sourceMappingURL=index-DDaK5rOZ.js.map
