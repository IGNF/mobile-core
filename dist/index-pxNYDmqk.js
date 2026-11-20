import { Fill as de, Style as Q, Stroke as te, Circle as ht, Icon as En, RegularShape as Br, Text as bt } from "ol/style";
import Le from "ol/style/Circle";
import Ca from "ol/style/Text";
import { createEmpty as mi, extend as wa, getCenter as gi } from "ol/extent";
import Lr from "ol/layer/Vector";
import kr from "ol/source/Vector";
import _a from "ol/layer/Group";
import { createXYZ as vn } from "ol/tilegrid";
import J from "proj4";
import { register as Aa } from "ol/proj/proj4.js";
import { bbox as yi, tile as Ei } from "ol/loadingstrategy";
import { Collection as We, Feature as ut, View as vi } from "ol";
import Dr from "ol/format/WKT";
import Ft from "ol/format/GeoJSON";
import { transformExtent as Ci, transform as ba } from "ol/proj";
import { asArray as jn } from "ol/color";
import wi from "ol-ext/style/FillPattern";
import Fa from "ol-ext/style/FontSymbol";
import { LineString as Sa, MultiLineString as Wn, SimpleGeometry as Ba } from "ol/geom";
import Da from "ol-ext/style/geoportailStyle";
import Gn from "ol/format/WFS";
import Ra from "ol/format/GML3";
import Oa from "ol/format/GML2";
import _i from "ol/Feature";
import { click as Ta } from "ol/events/condition";
import Pa from "ol/interaction/Draw";
import Kn from "ol/interaction/Modify";
import La from "ol/interaction/Select";
import ka from "ol/interaction/Translate";
import Ia from "ol/Object";
import { unByKey as Na } from "ol/Observable";
import { getUid as Pt } from "ol/util";
class Ir {
  constructor() {
    this.listeners = {};
  }
  on(e, t) {
    this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t);
  }
  once(e, t) {
    const r = (s) => {
      t(s), this.off(e, r);
    };
    this.on(e, r);
  }
  off(e, t) {
    const r = this.listeners[e];
    r && (this.listeners[e] = r.filter((s) => s !== t), this.listeners[e].length === 0 && delete this.listeners[e]);
  }
  emit(e, t) {
    const r = this.listeners[e];
    r && r.forEach((s) => s(t));
  }
}
var Ve = /* @__PURE__ */ ((n) => (n.Draft = "draft", n.Cluster = "cluster", n.Submit = "submit", n.Pending = "pending", n.Pending_Qualification = "pending0", n.Pending_Entry = "pending1", n.Pending_Validation = "pending2", n.Valid = "valid", n.Valid_Already_Treated = "valid0", n.Reject = "reject", n.Reject_Irrelevant = "reject0", n))(Ve || {}), Ai = /* @__PURE__ */ ((n) => (n.Valid = "valid", n.Valid_Already_Treated = "valid0", n.Reject = "reject", n.Reject_Irrelevant = "reject0", n))(Ai || {});
const Oe = 8, ke = new de({ color: [255, 255, 255, 0.8] }), ot = {
  cluster: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [255, 255, 255], width: 3 }),
      fill: ke
    }),
    text: new Ca({
      font: "bold 12px Sans-serif",
      textAlign: "center",
      textBaseline: "middle",
      offsetY: 1,
      fill: new de({ color: [255, 255, 255] })
    })
  }),
  pending: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [255, 128, 0], width: 3 }),
      fill: ke
    })
  }),
  submit: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [51, 102, 153], width: 3 }),
      fill: ke
    })
  }),
  valid: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [0, 192, 0], width: 3 }),
      fill: ke
    })
  }),
  reject: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [255, 0, 0], width: 3 }),
      fill: ke
    })
  }),
  draft: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [120, 128, 137], width: 3 }),
      fill: ke
    })
  }),
  pending0: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [255, 128, 0], width: 3 }),
      fill: ke
    })
  }),
  pending1: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [204, 102, 0], width: 3 }),
      fill: ke
    })
  }),
  pending2: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [255, 170, 77], width: 3 }),
      fill: ke
    })
  }),
  valid0: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [0, 140, 0], width: 3 }),
      fill: ke
    })
  }),
  reject0: new Q({
    image: new Le({
      radius: Oe,
      stroke: new te({ color: [180, 0, 0], width: 3 }),
      fill: ke
    })
  })
};
class Ua {
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
    const s = this.EXTENT_PREFIX + e;
    return await this.storage.saveMetadata(s, {
      id: s,
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
    const r = await this.get(e), s = r.length > 0 ? [...r, t] : [t];
    await this.addExtent(e, s);
  }
  /**
   * Retrieves the extent array for a given name
   * Returns empty array if not found
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async get(e) {
    const t = this.EXTENT_PREFIX + e, r = await this.storage.getMetadata(t);
    return !r || !r.extra?.extents ? [] : r.extra.extents;
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
    const t = mi(), r = Array.isArray(e) ? await this.getAllExtents(e) : await this.get(e);
    for (const s of r)
      wa(t, s);
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
class nf {
  constructor(e, t, r = {}) {
    this.storage = e, this.layerGroup = t, this.options = r, this.CACHE_PREFIX = "raster:cache:", this.ORDER_KEY = "raster:cache:order", this.LAYER_NAME = "GEOGRAPHICALGRIDSYSTEMS.MAPS", this._eventManager = new Ir(), this.extentManager = new Ua(e), this.silentErrors = r.silentErrors ?? !1, this.currentErrors = /* @__PURE__ */ new Set(), this.extentLayer = new Lr({
      source: new kr(),
      properties: {
        name: "Emprises",
        displayInLayerSwitcher: !1
      }
    }), this.layerGroup.getLayers().push(this.extentLayer), this.layerGroup.getLayers().on("remove", () => {
      setTimeout(() => {
        this.reorderCacheLayers().catch((s) => {
          this.silentErrors || this._eventManager.emit("cache:error", {
            type: "reorder",
            message: "Failed to reorder cache layers",
            error: s
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
    const e = this.layerGroup.getLayers().getArray(), t = await this.storage.getMetadata(this.ORDER_KEY);
    if (!t || !t.extra?.order)
      return;
    const r = t.extra.order, s = [...e].sort((i, a) => {
      const o = i.get("name"), l = a.get("name"), c = r.findIndex((h) => o === `cache_${h}`), u = r.findIndex((h) => l === `cache_${h}`);
      return c - u;
    });
    JSON.stringify(e) !== JSON.stringify(s) && (this.layerGroup.getLayers().clear(), s.forEach((i) => this.layerGroup.getLayers().push(i)));
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
    const s = await this.storage.listTiles(t);
    await Promise.all(s.map((i) => this.storage.deleteTile(i))), await this.storage.deleteMetadata(t), await this.removeCacheLayer(e), await this.saveCacheOrder();
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
    const t = this.CACHE_PREFIX + e, r = await this.storage.getMetadata(t);
    if (!r)
      throw new Error(`Cache ${e} not found`);
    return {
      id: e,
      type: "raster",
      total: r.extra?.totalTiles || 0,
      current: r.tileCount || 0,
      percent: r.extra?.totalTiles ? (r.tileCount || 0) / r.extra.totalTiles * 100 : 0,
      status: r.extra?.downloadStatus || "complete",
      bytesDownloaded: r.size,
      bytesTotal: r.extra?.estimatedSize || 0
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
    const r = this.layerGroup.getLayers().getArray().find((s) => s.get("name") === `cache_${e}`);
    r && this.layerGroup.getLayers().remove(r);
  }
}
const qa = {
  COLLAB_VECTOR_RENDER_MODE: "image"
}, Re = {
  FILL_COLOR: "rgba(255,255,255,0.4)",
  STROKE_COLOR: "#3399CC",
  STROKE_WIDTH: 1.25,
  CIRCLE_RADIUS: 5,
  LABEL_COLOR: "#000",
  LABEL_STROKE_COLOR: "#fff",
  LABEL_SIZE: 10,
  LABEL_STROKE_WIDTH: 4
};
class Ma {
  /**
   * Initialize all French projections
   * Define projections if not already defined
   */
  initProjections() {
    J.defs("EPSG:2154") || J.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("IGNF:LAMB93") || J.defs("IGNF:LAMB93", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("EPSG:27572") || J.defs("EPSG:27572", "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"), J.defs("EPSG:2975") || J.defs("EPSG:2975", "+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("EPSG:4467") || J.defs("EPSG:4467", "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("EPSG:4559") || J.defs("EPSG:4559", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("EPSG:5490") || J.defs("EPSG:5490", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("EPSG:2972") || J.defs("EPSG:2972", "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), J.defs("EPSG:EPSG:4471") || J.defs("EPSG:4471", "+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), Aa(J);
  }
  registerCustomProjection(e, t) {
    J.defs(e) || J.defs(e, t);
  }
  /**
   * Transform coordinates from one projection to another
   * @param coords - Coordinates as [x, y] or [longitude, latitude]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed coordinates as [x, y]
   */
  transformCoordinates(e, t, r) {
    const s = J(t, r, e);
    return [s[0], s[1]];
  }
  /**
   * Transform an extent from one projection to another
   * @param extent - Extent as [minX, minY, maxX, maxY]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed extent as [minX, minY, maxX, maxY]
   */
  transformExtent(e, t, r) {
    const [s, i, a, o] = e, l = J(t, r, [s, i]), c = J(t, r, [a, i]), u = J(t, r, [s, o]), h = J(t, r, [a, o]), f = Math.min(l[0], c[0], u[0], h[0]), p = Math.min(l[1], c[1], u[1], h[1]), m = Math.max(l[0], c[0], u[0], h[0]), E = Math.max(l[1], c[1], u[1], h[1]);
    return [f, p, m, E];
  }
  constructor() {
    this.initProjections();
  }
}
const Ye = {
  TILE_SIZE: 256,
  MAX_FEATURES: 5e3,
  SRS_NAME: "IGNF:LAMB93",
  EDTION_CACHE_URL: "FILE/layer-edition-cache/"
  // check if it's ok
}, Lt = {
  TILE_SIZE: 256,
  MIN_ZOOM_INCREASE: 2,
  SRS_NAME: "EPSG:4326"
}, cn = "EPSG:3857", Ha = "/../../document/add";
function bi(n) {
  return !n || typeof n != "object" ? !1 : n.kind === "document";
}
function $a(n) {
  const e = atob(n), t = new Uint8Array(e.length);
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
  async uploadDocument(e, t, r, s) {
    const i = new FormData();
    if (i.append("file", t, r), s)
      for (const [o, l] of Object.entries(s))
        i.append(o, String(l));
    const a = await this.apiClient.doRequest(e, "post", i, null, "multipart/form-data");
    return a.data.url || a.data.path;
  }
  /**
   * Upload a collaborative document draft and return the stored document id.
   */
  async addCollaborativeDocument(e) {
    const t = this.apiClient;
    if (typeof t.doRequest != "function")
      throw new Error("Collaborative client does not support document upload");
    const r = new Blob(
      [$a(e.contentBase64)],
      { type: e.mimeType ?? "application/octet-stream" }
    ), i = (await t.doRequest(
      Ha,
      "post",
      { document: r },
      null,
      "multipart/form-data"
    ))?.data?.id;
    if (i == null || i === "")
      throw new Error("Document upload did not return a document id");
    return String(i);
  }
  /**
   * Resolve a collaborative document draft to the value expected by the
   * transaction payload: either a stored document id or null when removed.
   */
  async resolveCollaborativeDocumentValue(e) {
    return bi(e) ? e.file ? this.addCollaborativeDocument(e.file) : e.removed ? null : e.documentId : e;
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
var _t = /* @__PURE__ */ ((n) => (n.COLLAB_NO_CLIENT_DEFINED = "Client must be defined", n.COLLAB_NO_TABLE_DEFINED = "Table must be defined", n.COLLAB_UNKNOWN_PROJECTION = "Projection inconnue", n.WFS_NO_USERNAME_OR_PASSWORD = "Username and password are required", n))(_t || {});
class Nr {
  /**
   * Inspired from the CordovApp.File.fileName function in CordovApp, File.js line 60
   * @param filename name of a file to sanitize
   * @returns sanitized filename
   */
  sanitizeFileName(e) {
    var t = /[/?<>\\:*|":]/g, r = /[\x00-\x1f\x80-\x9f]/g, s = /^\.+$/, i = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, a = /[. ]+$/;
    return (e || "_").replace(t, "_").replace(r, "_").replace(s, "_").replace(i, "_").replace(a, "_");
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
const zr = new Nr(), me = {
  insert: "Insert",
  update: "Update",
  delete: "Delete"
}, ja = 2e3, Wa = 3;
function ct(n, e) {
  if (n === e)
    return !0;
  switch (e) {
    case me.insert:
      return n === "INSERT";
    case me.update:
      return n === "UPDATE";
    case me.delete:
      return n === "DELETE";
    default:
      return !1;
  }
}
function jr(n) {
  const e = [];
  for (const t of n)
    !t || e.includes(t) || e.push(t);
  return e;
}
class Rr extends kr {
  constructor(e) {
    new Ma().initProjections();
    const r = Rr._computeVectorSourceOptions(e);
    super(r), this._isLoading = !1, this._writeUpdateCounter = 0, this._tileLoading = 0, this._projectionCode = cn, this._extentRetryGeneration = 0, this._extentRetryTimers = [], this._extentRetryAttempts = /* @__PURE__ */ new Map(), this.localProperties = {}, this.preservedFeatures = new We(), this.differentialFeatures = new We(), this.insertedFeatures = new We(), this.deletedFeatures = new We(), this.updatedFeatures = new We(), this._options = e || {}, this._cache = e.cache, this.localProperties = r.properties || {}, this._initCollabVectorSource();
  }
  static _computeVectorSourceOptions(e) {
    const t = e || {};
    if (t.client === void 0)
      throw new Error(_t.COLLAB_NO_CLIENT_DEFINED);
    if (t.table === void 0)
      throw new Error(_t.COLLAB_NO_TABLE_DEFINED);
    const r = t.table;
    let s = t.strategy || yi;
    const i = Rr._getCacheNamespace(t), a = zr.sanitizeFileName(
      `${r.database}-${r.name}-editions.txt`
    ), o = t.legacyCacheFallback !== !1, l = i ? zr.sanitizeFileName(`${i}-editions.txt`) : a, c = {
      online: t.online ?? !0,
      useCacheWhenOnline: t.useCacheWhenOnline === !0,
      cacheNamespace: i,
      cacheUrl: t.cacheUrl,
      editionCacheFile: l,
      legacyEditionCacheFile: o && l !== a ? a : void 0,
      legacyCacheFallback: o,
      formatWKT: new Dr(),
      tiled: !1,
      tileGrid: void 0,
      maxReload: void 0
    };
    if (t.tileZoom) {
      const u = vn({
        tileSize: t.tileSize || Ye.TILE_SIZE,
        minZoom: t.tileZoom,
        maxZoom: t.tileZoom
      });
      s = Ei(u), c.tiled = !0, c.tileGrid = u, c.maxReload = t.maxReload;
    }
    return {
      strategy: s,
      properties: c,
      features: new We(),
      attributions: t.attribution,
      logo: t.logo,
      useSpatialIndex: !0,
      wrapX: t.wrapX
    };
  }
  static _getCacheNamespace(e) {
    const t = e.cacheNamespace?.trim();
    if (t)
      return zr.sanitizeFileName(t);
  }
  _initCollabVectorSource() {
    const e = this._options.table || {};
    this.table = e, e.wfs && (e.docURI = e.wfs.replace(/\/gcms\/.*/, "/document/")), this._options.maxFeatures = this._options.maxFeatures || Ye.MAX_FEATURES, this._options.tileSize = this._options.tileSize || Ye.TILE_SIZE, this.localProperties.srsName = this._getTableCRS(), J.defs(this.localProperties.srsName) || console.error(_t.COLLAB_UNKNOWN_PROJECTION, this.localProperties.srsName), this.localProperties.featureFilter = this._options.filter ?? {}, e.columns?.detruit ? this.localProperties.featureFilter = { detruit: !1 } : e.columns?.gcms_detruit && (this.localProperties.featureFilter = { gcms_detruit: !1 }), this.preservedFeatures = this._options.preserved ?? new We(), this.localProperties.preservedFeatures = this.preservedFeatures, this.on("addfeature", (t) => {
      t?.feature && this.onAddFeature(t.feature);
    }), this.on("removefeature", (t) => {
      t?.feature && this.onDeleteFeature(t.feature);
    }), this.loadChanges(), this.setLoader(this.loaderFn.bind(this));
  }
  getTable() {
    return this.table;
  }
  onAddFeature(e) {
    const t = e.getGeometry();
    if (t && t.on("change", () => {
      const i = e.updates || {};
      i.geometry = !0, e.updates = i, e.dispatchEvent({
        type: "propertychange",
        target: e
      });
    }), e.on("propertychange", this.onUpdateFeature.bind(this, e)), this._isLoading) return;
    e.state = me.insert;
    const r = this.table?.columns || {}, s = this._getGeometryColumnName();
    for (const i in r)
      i !== s && e.get(i) === void 0 && e.set(i, null, !0);
    this.insertedFeatures.push(e), this.writeChanges();
  }
  onDeleteFeature(e) {
    if (this._isLoading) return;
    const t = e.state;
    ct(t, me.insert) ? this.removeFeatureFromCollection(this.insertedFeatures, e) : (ct(t, me.update) && this.removeFeatureFromCollection(this.updatedFeatures, e), this.deletedFeatures.push(e)), e.state = me.delete, this.writeChanges();
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
      if (typeof t?.addTransaction != "function") {
        const i = new Error("Collaborative client does not support addTransaction");
        throw this.dispatchEvent({ type: "saveend", status: "error", error: i }), i;
      }
      const s = (await t.addTransaction(this.table.databaseId, {
        actions: e,
        comment: `source vecteur: ${this.table.database}":"${this.table.name}`
      }))?.data;
      if (s?.status === "conflicting")
        throw this.dispatchEvent({
          type: "saveend",
          status: "error",
          error: s
        }), s;
      return this.resetChanges(), this.dispatchEvent({ type: "saveend", transaction: s }), s;
    } catch (e) {
      throw this.dispatchEvent({ type: "saveend", status: "error", error: e }), e;
    }
  }
  removeFeatureFromCollection(e, t) {
    const s = e.getArray().indexOf(t);
    s > -1 && e.removeAt(s);
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
        this._saveEditionCache(r, t).catch((s) => {
          console.error("ERROR: writeChanges on layer", s);
        });
      else
        try {
          localStorage.setItem(r, JSON.stringify(t));
        } catch (s) {
          console.error("ERROR: writeChanges fallback to localStorage", s);
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
    const s = e.getProperties(), i = {
      id: e.getId(),
      properties: {}
    }, a = this._getGeometryColumnName();
    for (const o in s)
      o !== a && o !== "geometry" && (i.properties[o] = s[o]);
    if (r) {
      const o = e.getGeometry();
      o && t && (i.geometry = t.writeGeometry(o));
    }
    return i;
  }
  loadChanges() {
    const e = this.localProperties.editionCacheFile;
    if (!e) return;
    const t = jr([
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
        for (const s of t)
          if (r = localStorage.getItem(s), r)
            break;
        if (r) {
          const s = JSON.parse(r);
          this._restoreActions(s);
        }
      } catch (r) {
        console.error("ERROR: loadChanges fallback to localStorage", r);
      }
  }
  _restoreActions(e) {
    const t = this.localProperties.formatWKT;
    e.insert && Array.isArray(e.insert) && e.insert.forEach((r) => {
      const s = this.deserializeFeature(r, t);
      s && (s.state = me.insert, this.insertedFeatures.push(s));
    }), e.update && Array.isArray(e.update) && e.update.forEach((r) => {
      const s = this.deserializeFeature(r, t);
      s && (s.state = me.update, this.updatedFeatures.push(s));
    }), e.delete && Array.isArray(e.delete) && e.delete.forEach((r) => {
      const s = this.deserializeFeature(r, t);
      s && (s.state = me.delete, this.deletedFeatures.push(s));
    }), this._dispatchEditChange();
  }
  deserializeFeature(e, t) {
    try {
      const r = new ut();
      if (e.id !== void 0 && e.id !== null && r.setId(e.id), e.properties && r.setProperties(e.properties), e.geometry && t) {
        const s = t.readGeometry(e.geometry);
        r.setGeometry(s);
      }
      return r;
    } catch (r) {
      return console.error("ERROR: deserializeFeature", r), null;
    }
  }
  onUpdateFeature(e, t) {
    if (this._isLoading) return;
    const r = e.state, s = t?.key;
    if (!ct(r, me.insert)) {
      if (s && s !== "geometry") {
        const i = e.updates || {};
        i[s] = !0, e.updates = i;
      }
      ct(r, me.update) || (e.state = me.update, this.updatedFeatures.push(e)), this.writeChanges();
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
      ...this._buildTransactionActions(this.insertedFeatures, me.insert, !0),
      ...this._buildTransactionActions(this.deletedFeatures, me.delete, !1),
      ...this._buildTransactionActions(this.updatedFeatures, me.update, !1)
    ];
  }
  _getDocumentColumnNames() {
    return Object.entries(this.table.columns).filter(([, e]) => typeof e.type == "string" && e.type.toLowerCase() === "document").map(([e]) => e);
  }
  async _resolveTransactionDocumentActions(e) {
    const t = this._getDocumentColumnNames();
    if (!t.length)
      return e;
    const r = new za(this._options.client), s = /* @__PURE__ */ new Map();
    return Promise.all(e.map(async (i) => {
      const a = i.data;
      if (!a || typeof a != "object")
        return i;
      const o = { ...a };
      for (const l of t) {
        const c = o[l];
        if (bi(c)) {
          if (c.file) {
            const u = JSON.stringify(c.file);
            let h = s.get(u);
            h || (h = await r.addCollaborativeDocument(c.file), s.set(u, h)), o[l] = h;
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
    return e.getArray().filter((s) => ct(s.state, t)).map((s) => ({
      data: this._serializeTransactionFeature(s, r),
      state: t,
      table: this.table.id
    }));
  }
  _serializeTransactionFeature(e, t) {
    const r = e.getProperties(), s = {}, i = this._getGeometryColumnName(), a = this._getIdPropertyName(), o = e.updates || {};
    if (t)
      for (const l in r)
        l !== i && l !== "geometry" && (s[l] = r[l]);
    else {
      const l = this._getFeatureIdentifier(e, a);
      l != null && (s[a] = l);
      for (const c in r)
        c === i || c === "geometry" || (o[c] || c === "gcms_fingerprint") && (s[c] = r[c]);
    }
    if (t || o.geometry) {
      const l = e.getGeometry(), c = this.localProperties.formatWKT;
      if (l && c) {
        const u = l.clone();
        this._projectionCode && this.localProperties.srsName && u.transform(this._projectionCode, this.localProperties.srsName), s[i] = c.writeGeometry(u);
      }
    }
    return s;
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
    if (!this._cache) return null;
    try {
      const t = await this._cache.getMetadata(`edition:${e}`);
      return t && t.extra?.actions ? t.extra.actions : null;
    } catch (t) {
      return console.error("ERROR: _loadEditionCache", t), null;
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
  loaderFn(e, t, r, s, i) {
    this._loadFeatures(e, t, r, s, i);
  }
  async _loadFeatures(e, t, r, s, i) {
    const a = this._extentRetryGeneration;
    if (this._projectionCode = typeof r == "string" ? r : r?.getCode?.() || cn, !J.defs(this.localProperties.srsName)) {
      this.dispatchEvent({ type: "loadend", status: "error", error: _t.COLLAB_UNKNOWN_PROJECTION }), i && i();
      return;
    }
    this.localProperties.maxReload && this.localProperties.tiled && this._tileLoading === 1 && this.getFeatures().length > this.localProperties.maxReload && this.reload(), this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading });
    try {
      let o = [];
      const l = this.localProperties.online !== !1, c = !!(this.localProperties.cacheUrl || this.localProperties.cacheNamespace), u = this.localProperties.useCacheWhenOnline === !0;
      c && (!l || u) && (o = await this._loadFromOfflineCache(e, t)), this._countPayloadFeatures(o) === 0 && l && (o = await this._loadFromOnline(e));
      const h = this._countPayloadFeatures(o), f = this._readFeatures(o, this._projectionCode), p = [];
      f.forEach((E) => {
        const y = this._findFeature(E);
        y && p.push(y);
      });
      const m = this._getIdPropertyName();
      this.insertedFeatures.getArray().forEach((E) => {
        ct(E.state, me.insert) && (this._containsFeature(p, E, m) || p.push(E));
      }), this._isLoading = !0, this.localProperties.tiled || this.clear(!0), p.length && this.addFeatures(p), this._isLoading = !1, l && await this._saveFeaturesToOfflineCache(e, t, p), this.dispatchEvent({ type: "loadend", remains: --this._tileLoading }), h >= (this._options.maxFeatures || Ye.MAX_FEATURES) && this.dispatchEvent({ type: "overload" }), a === this._extentRetryGeneration && this._extentRetryAttempts.delete(e.join(",")), s && s(p);
    } catch (o) {
      this._isLoading = !1, this.dispatchEvent({
        type: "loadend",
        error: o?.message || String(o),
        status: "error",
        remains: Math.max(0, --this._tileLoading)
      }), this._failExtentLoad(e, a, i, o);
    }
  }
  /**
   * OpenLayers marks the extent loaded as soon as the loader starts, and does not undo that when `failure` runs.
   * A failed tile is loaded again up to three times. After that, the extent stays marked loaded until a refresh.
   */
  _failExtentLoad(e, t, r, s) {
    if (r && r(), t !== this._extentRetryGeneration || s instanceof Error && s.message === "Table WFS URL is missing") return;
    const i = e.join(","), a = this._extentRetryAttempts.get(i) ?? 0;
    if (a >= Wa) return;
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
    const t = this.getWFSParams(e, this._projectionCode);
    if (!this.table?.wfs)
      throw new Error("Table WFS URL is missing");
    return (await this._options.client.doRequest(this.table.wfs, "get", null, t)).data;
  }
  async _loadFromOfflineCache(e, t) {
    if (!this._cache || typeof this._cache.loadFeatures != "function")
      return [];
    const r = this._getOfflineCacheKeys(e, t, !0);
    for (const s of r)
      try {
        const i = await this._cache.loadFeatures(s);
        if (Array.isArray(i) && i.length)
          return i;
      } catch {
      }
    return [];
  }
  async _saveFeaturesToOfflineCache(e, t, r) {
    if (!this._cache || typeof this._cache.saveFeatures != "function")
      return;
    const s = this._getOfflineCacheKeys(e, t);
    if (s.length)
      try {
        await this._cache.saveFeatures(s[0], r);
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
    const s = this._getLegacyCacheNamespace(), i = this.localProperties.legacyCacheFallback !== !1, a = jr([
      this.localProperties.cacheNamespace || s,
      r && i ? s : void 0
    ]), o = this.localProperties.tileGrid;
    if (!o)
      return a;
    const l = o.getTileCoordForCoordAndResolution(gi(e), t);
    return jr(
      a.flatMap((c) => [`${c}:${l.join("-")}`, c])
    );
  }
  _getLegacyCacheNamespace() {
    return `${this.table.database}:${this.table.name}`;
  }
  getWFSParams(e, t) {
    const r = Ci(e, t, this.localProperties.srsName);
    return {
      service: "WFS",
      request: "GetFeature",
      outputFormat: this._options.outputFormat || "JSON",
      typeName: this.table.name,
      bbox: r.join(","),
      filter: JSON.stringify(this.localProperties.featureFilter || {}),
      maxFeatures: this._options.maxFeatures || Ye.MAX_FEATURES,
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
    if (Array.isArray(e) && e.every((o) => o instanceof ut))
      return e;
    let r = e;
    if (typeof r == "string")
      try {
        r = JSON.parse(r);
      } catch {
        return [];
      }
    if (this._isGeoJSONPayload(r))
      return new Ft().readFeatures(r, {
        dataProjection: this.localProperties.srsName,
        featureProjection: t
      });
    const s = this._extractItemsFromPayload(r);
    if (!s.length)
      return [];
    const i = [], a = this._getGeometryColumnName();
    for (const o of s) {
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
        const r = new Ft().readGeometry(e, {
          dataProjection: this.localProperties.srsName,
          featureProjection: t
        });
        return r ? new ut({ geometry: r }) : null;
      } catch {
        return null;
      }
    if (typeof e == "string") {
      const r = this.localProperties.formatWKT, s = e.replace(/([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+)/g, "$1 $3");
      try {
        return r.readFeature(s, {
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
    const s = this._findFeatureInCollection(this.updatedFeatures, t, r);
    if (s)
      return s;
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
    const s = e.getGeometry();
    if (!s)
      return !1;
    const i = s.getExtent();
    return this.getFeaturesInExtent([
      i[0] - 0.1,
      i[1] - 0.1,
      i[2] + 0.1,
      i[3] + 0.1
    ]).length > 0;
  }
  _findFeatureInCollection(e, t, r) {
    const s = e.getArray();
    if (r == null)
      return null;
    for (const i of s) {
      const a = this._getFeatureIdentifier(i, t);
      if (this._featureIdentifiersMatch(a, r))
        return i;
    }
    return null;
  }
  _containsFeature(e, t, r) {
    const s = this._getFeatureIdentifier(t, r);
    return s != null ? e.some(
      (i) => this._featureIdentifiersMatch(this._getFeatureIdentifier(i, r), s)
    ) : e.includes(t);
  }
  _getFeatureIdentifier(e, t) {
    const r = e.get(t);
    if (r != null)
      return r;
    const s = e.getId();
    if (s != null)
      return s;
  }
  _featureIdentifiersMatch(e, t) {
    return e == null || t === void 0 || t === null ? !1 : String(e) === String(t);
  }
  _getIdPropertyName() {
    return this.table?.idName || "id";
  }
  _getGeometryColumnName() {
    return this.table?.geometryName || "geometry";
  }
  _getTableCRS() {
    const e = this._getGeometryColumnName();
    return this.table?.columns?.[e]?.crs || Ye.SRS_NAME;
  }
}
class Ga {
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
      }, s = new Q({
        text: this.styler.text(r),
        fill: this.styler.fill(r),
        stroke: this.styler.stroke(r)
      });
      return this.styler.setImage(s, r, t), [s];
    };
  }
  detruit() {
    return (e) => {
      if (!e.get("detruit")) return [];
      const t = {
        strokeWidth: 2,
        strokeColor: [255, 0, 0, 0.5]
      }, r = new Q({
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
      }, r = new Q({
        text: this.styler.text(t),
        fill: this.styler.fill(t),
        stroke: this.styler.stroke(t)
      });
      return this.styler.setImage(r, t, e), [r];
    };
  }
  combine(e) {
    const t = Array.isArray(e) ? e : [e];
    return (r, s) => {
      const i = [];
      for (const a of t) {
        const o = a(r, s), l = Array.isArray(o) ? o : [o];
        i.push(...l);
      }
      return i;
    };
  }
  troncon_de_route(e) {
    return e = e || {}, Da("BDTOPO_V3:troncon_de_route", { sens: e.sens || !0 });
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
    const t = (s) => s == e.direct || s == e.inverse ? e.glyph : "", r = (s, i) => {
      if (s != e.direct && s != e.inverse) return 0;
      let a = i.getCoordinates(), o = 0, l = 0, c = 0, u = i.getLength();
      for (var h = 0; h < a.length - 1 && (o = a[h + 1][0] - a[h][0], l = a[h + 1][1] - a[h][1], c += Math.sqrt(o * o + l * l), !(c >= u / 2)); h++)
        ;
      return s == e.direct ? -Math.atan2(l, o) : Math.PI - Math.atan2(l, o);
    };
    return (s) => {
      const i = s.get(e.attribute), a = {
        label: t(i),
        fontWeight: "bold",
        fontSize: e.size,
        labelRotation: r(i, s.getGeometry())
        // we have to cast to LineString | MultiLineString because getGeometry() can return undefined
      };
      return [
        new Q({
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
      const s = {
        label: t.get(e.attribute),
        fontWeight: e.weight,
        fontSize: e.size
      };
      return [new Q({
        text: this.styler.text(s)
      })];
    };
  }
  batiment(e) {
    e || (e = {});
    const t = (r, s) => {
      switch (r.get("nature")) {
        case "Industriel, agricole ou commercial":
          return [51, 102, 153, s];
        case "Remarquable":
          return [0, 192, 0, s];
        default:
          switch (r.get("fonction")) {
            case "Indifférenciée":
              return [128, 128, 128, s];
            case "Sportive":
              return [51, 153, 102, s];
            case "Religieuse":
              return [153, 102, 51, s];
            default:
              return [153, 51, 51, s];
          }
      }
    };
    return (r) => {
      if (r.get("detruit")) return [];
      const s = {
        strokeColor: t(r, 1),
        fillColor: t(r, 0.5)
      };
      return /en service/i.test(r.get("etat_de_l_objet")) || (s.strokeLineDash = [10, 5], s.fillColor = [0, 0, 0, 0]), e.symbol && (s.label = this.getSymbol(r), s.fontFamily = "Fontawesome", s.fontColor = e.color || "magenta"), s.label ? [
        new Q({
          text: this.styler.text(s),
          stroke: this.styler.stroke(s),
          fill: this.styler.fill(s)
        })
      ] : [
        new Q({
          stroke: this.styler.stroke(s),
          fill: this.styler.fill(s)
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
function Ka(n, e) {
  const t = e.split(".");
  let r = n;
  for (const s of t) {
    if (!r || typeof r != "object")
      return;
    r = r[s];
  }
  return r;
}
function Ue(n, e) {
  if (Array.isArray(n) && Array.isArray(e)) {
    if (n.length !== e.length) return !1;
    for (let t = 0; t < n.length; t++)
      if (!Ue(n[t], e[t]))
        return !1;
    return !0;
  }
  return n === e;
}
function Xa(n, e, t, r) {
  switch (n) {
    case "$eq":
      return Ue(e, t);
    case "$ne":
      return !Ue(e, t);
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
        (s) => t.some((i) => Ue(s, i))
      ) : t.some((s) => Ue(e, s)) : !1;
    case "$nin":
      return Array.isArray(t) ? Array.isArray(e) ? e.every(
        (s) => !t.some((i) => Ue(s, i))
      ) : !t.some((s) => Ue(e, s)) : !1;
    case "$exists":
      return t ? e !== void 0 : e === void 0;
    case "$regex": {
      if (typeof e != "string") return !1;
      const s = typeof r.$options == "string" ? r.$options : "";
      return (t instanceof RegExp ? t : new RegExp(String(t), s)).test(e);
    }
    case "$options":
      return !0;
    default:
      return !1;
  }
}
function Za(n, e) {
  const t = e && typeof e == "object" ? e : null;
  if (!t)
    return Ue(n, e);
  const r = Object.keys(t).filter((s) => s.startsWith("$"));
  if (r.length === 0)
    return Ue(n, e);
  for (const s of r)
    if (!Xa(
      s,
      n,
      t[s],
      t
    ))
      return !1;
  return !0;
}
function At(n, e) {
  for (const [t, r] of Object.entries(n)) {
    if (t === "$and") {
      if (!Array.isArray(r) || !r.every((i) => !i || typeof i != "object" ? !1 : At(i, e)))
        return !1;
      continue;
    }
    if (t === "$or") {
      if (!Array.isArray(r) || !r.some((i) => !i || typeof i != "object" ? !1 : At(i, e)))
        return !1;
      continue;
    }
    if (t === "$nor") {
      if (!Array.isArray(r) || r.some((i) => !i || typeof i != "object" ? !1 : At(i, e)))
        return !1;
      continue;
    }
    if (t === "$not") {
      if (!r || typeof r != "object" || At(r, e))
        return !1;
      continue;
    }
    const s = Ka(e, t);
    if (!Za(s, r))
      return !1;
  }
  return !0;
}
function Va(n) {
  let e = n;
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
    matches: (r) => At(t, r)
  };
}
function Ya(n) {
  if (n.mongo?.matches)
    return;
  const e = Va(n.condition);
  e && (n.mongo = e);
}
function Ja(n) {
  if (!n || typeof n != "object")
    return "image/png";
  const e = n, t = e["content-type"] ?? e["Content-Type"];
  return typeof t == "string" && t.length > 0 ? t : "image/png";
}
function Qa(n) {
  if (n instanceof ArrayBuffer)
    return n;
  if (ArrayBuffer.isView(n))
    return n.buffer.slice(
      n.byteOffset,
      n.byteOffset + n.byteLength
    );
  if (typeof n == "string" && n.length > 0)
    try {
      const e = atob(n), t = new Uint8Array(e.length);
      for (let r = 0; r < e.length; r += 1)
        t[r] = e.charCodeAt(r);
      return t.buffer;
    } catch {
      return null;
    }
  return null;
}
function eo(n) {
  if (!n || typeof n != "object")
    return null;
  const e = n;
  if (e.data instanceof Blob)
    return URL.createObjectURL(e.data);
  const t = Qa(e.data);
  return t ? URL.createObjectURL(new Blob([t], {
    type: Ja(e.headers)
  })) : null;
}
function ln(n) {
  return typeof n == "string" && n.length > 0 && n !== "undefined";
}
function un(n, e) {
  if (n) {
    ln(n.externalGraphic) && typeof n.uri == "string" && n.uri.length > 0 && (e[n.externalGraphic] = n.uri);
    for (const t of n.children ?? [])
      un(t, e);
  }
}
const Wr = {};
class Cn {
  constructor(e) {
    this._symbolCache = {}, this._cacheLoading = [], this._userManager = e, this.presets = new Ga(this), this.defaultStyleFn = this.getFeatureStyleFn();
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
    const s = r?.userManager;
    return new Cn(s).getFeatureStyleFn(e, t, r);
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
    for (const s in e)
      r[s] = this.formatProperties(e[s], t);
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
    const t = this.strokeLineDash(e), r = new te({
      color: e.strokeColor || "#00f",
      width: Number(e.strokeWidth) || 1,
      lineDash: t,
      lineCap: e.strokeLinecap || "round"
    });
    if (e.strokeOpacity !== void 0 && e.strokeOpacity < 1) {
      const s = jn(r.getColor());
      s.length && (s[4] = e.strokeOpacity, r.setColor(s));
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
    let t = new de({
      color: e.fillColor || "rgba(255,255,255,0.5)"
    });
    if (e.fillOpacity !== void 0 && e.fillOpacity < 1) {
      const r = jn(t.getColor());
      r.length && (r[3] = Number(e.fillOpacity), t.setColor(r));
    }
    return e.fillPattern && (t = new wi({
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
    return new ht({
      radius: 10,
      fill: new de({ color: "rgba(255,0,0,.5)" }),
      stroke: new te({ color: "#fff", width: 1.5 })
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
    let s;
    const i = t.img;
    if (i)
      Wr[i] || (Wr[i] = new En({ src: i })), s = Wr[i];
    else if (ln(t.externalGraphic))
      s = this.getDefaultCircleImage();
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
          if (s = new Br({
            points: l[0],
            radius: l[1],
            radius2: l[2],
            rotation: l[3],
            stroke: this.stroke(t),
            fill: this.fill(t)
          }), t.graphicName === "rectangle") {
            const c = s.getImage(1), u = document.createElement("canvas");
            u.width = c.width, u.height = c.height;
            const h = u.getContext("2d"), f = c.getContext("2d");
            h && f && (h.drawImage(c, 0, 0, c.width, c.height, c.width / 4, 0, c.width / 2, c.height), f.clearRect(0, 0, c.width, c.height), f.drawImage(u, 0, 0));
          }
          break;
        }
        case "lightning":
        case "church":
          s = new Fa({
            glyph: this.getGlyph(t.graphicName),
            radius: a,
            rotation: Math.PI,
            stroke: this.stroke(t),
            fill: this.fill(t)
          });
          break;
        default:
          s = new ht({
            radius: a,
            stroke: this.stroke(t),
            fill: this.fill(t)
          });
          break;
      }
    }
    s && e.setImage(s);
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
      stroke: new te({
        color: e.labelOutlineColor || "#fff",
        width: Number(e.labelOutlineWidth) || 2
      }),
      fill: new de({
        color: e.fontColor || "#000"
      })
    };
    return new bt(t);
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
    const s = new Q({
      text: new bt({
        text: "›",
        font: "bold 25px Arial"
      })
    });
    return (i, a) => {
      if (r?.directoryList && this.loadSymbolCache(r.directoryList), !e.style && e.name) {
        const E = e.name;
        if (typeof this.presets[E] == "function") {
          const y = this.presets[E](e);
          if (typeof y == "function")
            return y(i);
        }
      }
      let o = e.style;
      if (e.style?.children) {
        const E = i.getProperties();
        delete E.geometry;
        for (let y = 0; y < e.style.children.length; y++) {
          const C = e.style.children[y];
          if (Ya(C), C.mongo?.matches && C.mongo.matches(E)) {
            o = C;
            break;
          }
        }
      }
      const l = this.formatFeatureStyle(o || {}, i), c = e.symbo_attribute && o?.name ? `${o.name}/${i.get(e.symbo_attribute.name)}` : o && ln(o.externalGraphic) ? o.externalGraphic : void 0;
      c && o && (l.radius = 5, l.img = this.getSymbolURI(
        e,
        c,
        Number(o.graphicWidth) || 16,
        Number(o.graphicHeight) || 16,
        i,
        o.uri
      ) ?? void 0);
      const u = new Q({}), h = this.text(l);
      h && u.setText(h), this.setImage(u, l, i);
      const f = this.fill(l);
      f && u.setFill(f);
      const p = this.stroke(l);
      p && u.setStroke(p);
      let m;
      if (e.style?.directionField)
        try {
          m = JSON.parse(e.style.directionField);
        } catch {
          m = null, console.log("bad json direction field for style " + e.style.name);
        }
      if (a < 2 && m && typeof m == "object" && "attribute" in m && "sensDirect" in m && "sensInverse" in m) {
        const E = m.sensDirect, y = m.sensInverse, C = (d, x) => {
          if (d !== E && d !== y) return 0;
          const A = x instanceof Wn ? x.getLineString(0) : x;
          if (!A) return 0;
          const w = A.getCoordinates();
          let S = 0, b = 0, R = 0;
          const _ = A.getLength();
          for (let F = 0; F < w.length - 1 && (S = w[F + 1][0] - w[F][0], b = w[F + 1][1] - w[F][1], R += Math.sqrt(S * S + b * b), !(R >= _ / 2)); F++)
            ;
          return d === E ? -Math.atan2(b, S) : Math.PI - Math.atan2(b, S);
        }, g = i.get(m.attribute);
        if (g === E || g === y) {
          const d = i.getGeometry();
          if (d && (d instanceof Sa || d instanceof Wn)) {
            const x = C(g, d);
            return s.getText()?.setRotation(x), [u, s];
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
    if (un(e.style, t), e.styles)
      for (const r of e.styles)
        un(r, t);
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
  getSymbolURI(e, t, r, s, i, a) {
    const o = t.replace(/\//g, "_") + "_" + r + "x" + s;
    if (this._symbolCache[o])
      return this._symbolCache[o];
    const c = this.getUrls(e)[t] ?? a;
    if (!c)
      return console.warn("Symbol not found in feature type styles:", t), null;
    if (this._cacheLoading.indexOf(o) !== -1) return null;
    const u = this._userManager?.apiClient, h = u?.getDocument?.bind(u);
    if (typeof h != "function")
      return console.warn("UserManager not initialized - cannot load symbol from API"), null;
    const f = `${c}${c.includes("?") ? "&" : "?"}width=${r}&height=${s}`;
    return this._cacheLoading.push(o), h(f).then((p) => {
      const m = eo(p);
      if (!m) {
        console.warn("Failed to convert symbol response to an image URL", t);
        return;
      }
      this._symbolCache[o] = m, i.changed();
    }).catch((p) => {
      console.warn("Failed to load symbol from API", p);
    }).finally(() => {
      const p = this._cacheLoading.indexOf(o);
      p !== -1 && this._cacheLoading.splice(p, 1);
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
class wn extends Lr {
  constructor(e, t) {
    t = t || {};
    const r = wn._computeCollabVectorLayerOptions(e);
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
      renderMode: e.renderMode || qa.COLLAB_VECTOR_RENDER_MODE
    };
  }
  /**
   * Creates the source for the CollabVector layer
   */
  createSource(e, t, r) {
    const s = {
      ...t,
      table: r,
      client: t.client || e.client
    }, i = s;
    !i.userManager && i.client && (i.userManager = {
      apiClient: i.client
    }), e.checkSourceOptions && e.checkSourceOptions(this, s, r);
    const a = new Rr(s);
    this.setSource(a), this.set("title", r.title);
    const o = new vi(), l = r.maxZoomLevel, c = r.minZoomLevel;
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
      const u = Cn.getFeatureStyleFunction(r, e.cacheUrl ?? "", s);
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
const Xn = new Nr();
class sf {
  constructor(e, t) {
    this.storage = e, this.apiClient = t, this.CACHE_PREFIX = "vector:cache:";
  }
  getLayerCacheNamespace(e, t) {
    const r = t.cacheNamespace?.trim();
    return r ? Xn.sanitizeFileName(r) : Xn.sanitizeFileName(
      `vector-cache-${e.id_guichet}-${e.id}-${t.database}-${t.name}`
    );
  }
  getLayerFeatureCacheKeys(e, t) {
    const s = t.cacheNamespace?.trim() ? [this.getLayerCacheNamespace(e, t)] : [`${t.database}:${t.name}`], i = this.getCacheExtents(e), a = Number(t.table?.tileZoomLevel);
    if (!Number.isFinite(a) || i.length === 0)
      return s;
    const o = vn({
      tileSize: Ye.TILE_SIZE,
      minZoom: a,
      maxZoom: a
    }), l = /* @__PURE__ */ new Set();
    for (const c of s)
      l.add(c);
    for (const c of i) {
      const [u, h, f, p] = c, m = o.getTileCoordForCoordAndZ([u, h], a), E = o.getTileCoordForCoordAndZ([f, p], a), y = Math.min(m[1], E[1]), C = Math.max(m[1], E[1]), g = Math.min(m[2], E[2]), d = Math.max(m[2], E[2]);
      for (let x = y; x <= C; x++)
        for (let A = g; A <= d; A++)
          for (const w of s)
            l.add(`${w}:${[a, x, A].join("-")}`);
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
    for (const s of r)
      if (s.id_guichet === e.id) {
        const i = new _a({
          properties: {
            title: s.nom,
            name: s.id_guichet + "-" + s.id,
            vectorCache: s,
            baseLayer: !0
          }
        });
        for (const a of s.layers)
          if (a.table) {
            const o = new wn(a, {
              // Source options for the collaborative vector
              cache: this.storage
            });
            i.getLayers().push(o);
          }
        if (i.getLayers().getLength()) {
          t.push(i);
          const a = new Lr({
            properties: {
              title: "extent",
              displayInLayerSwitcher: !1
            },
            source: new kr()
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
        for (const s of r.layers)
          try {
            const i = this.getLayerFeatureCacheKeys(r, s);
            for (const a of i)
              await this.storage.deleteFeatures(a);
          } catch (i) {
            console.error(`Failed to delete features for layer ${s.name}:`, i);
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
    const s = r.communities.find((h) => h.active === !0);
    if (!s)
      throw new Error("Guichet not found");
    const i = await this.storage.listMetadata(this.CACHE_PREFIX), a = Math.max(0, ...i.map((h) => parseInt(h.id))), o = String(a + 1), l = t.map((h) => ({
      ...h,
      cacheNamespace: this.getLayerCacheNamespace(
        { id: o, id_guichet: s.id },
        h
      )
    })), c = /* @__PURE__ */ new Date(), u = {
      id: o,
      name: e,
      type: "vector",
      created: c,
      modified: c,
      size: 0,
      id_guichet: s.id,
      nom: e,
      layers: l,
      extent: mi(),
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
const to = new Nr(), Zn = /* @__PURE__ */ new Set([
  "service",
  "request",
  "version",
  "typenames",
  "typename",
  "srsname",
  "bbox",
  "count",
  "maxfeatures"
]), kt = /* @__PURE__ */ new Set(["cql_filter", "filter"]);
class Or extends kr {
  constructor(e, t) {
    const r = Or._computeWFSSourceOptions(e, t);
    super(r), this.localProperties = {}, this.requestProperties = {}, this._tileLoading = 0, this._done = !1, this.localProperties = r.computedLocalProperties, this._initWFSSource(e);
  }
  /**
   * Compute VectorSource options from WFS options
   */
  static _computeWFSSourceOptions(e, t) {
    const r = e || {}, s = {
      tiled: !1,
      layerExtraParams: []
    };
    let i = r.strategy;
    if (!i && r.tileZoom) {
      const a = r.tileZoom ?? r.minZoom ?? Lt.MIN_ZOOM_INCREASE, o = vn({
        tileSize: r.tileSize || Lt.TILE_SIZE,
        minZoom: a,
        maxZoom: a
      });
      i = Ei(o), s.tileGrid = o, s.table = r.table, s.tiled = !0, s.maxReload = r.maxReload;
    } else i || (i = yi);
    return t && t.loadCache && (s.loadCache = t.loadCache), t && t.saveCache && (s.saveCache = t.saveCache), t && t.loadFeatures && t.saveFeatures && (s.featureCache = t), s.useCacheWhenOnline = r.useCacheWhenOnline !== !1, {
      computedLocalProperties: s,
      strategy: i,
      features: new We(),
      attributions: r.attribution,
      useSpatialIndex: !0,
      wrapX: r.wrapX
    };
  }
  /**
   * Completes WFS-specific initialization after VectorSource setup
   */
  _initWFSSource(e) {
    const t = e || {}, r = t.geoservice || {};
    this.localProperties.proxy = t.proxy, this.localProperties.featureFilter = t.filter;
    const s = this._parseLayerSpec(r.layers || ""), i = this._resolveInitialTypeNames(r, s.typeNames);
    this.localProperties.layerExtraParams = s.extraParams;
    const a = r.url || "";
    this.set("url", a), this.set("cache", `${to.getEscapedDomainFromURL(a)}/${r.layers || ""}`), this.set("once", t.once), this.set("typename", i || r.layers || ""), this.set("version", r.version || "2.0.0"), this.set("projection", t.srs || Lt.SRS_NAME), this.set("id", r.input_mask?.id ?? -1), this.set("maxFeatures", t.maxFeatures), this.set("format", r.format || "GeoJSON"), this.setAuthentication(t.username, t.password, t.accessToken, t.tokenType), this._configureLoader();
  }
  _configureLoader() {
    this.setLoader((e, t, r, s, i) => {
      this._loaderFn(e, t, r, s, i);
    });
  }
  async _loaderFn(e, t, r, s, i) {
    if (this._done && this.get("once")) {
      s && s([]);
      return;
    }
    this._done = !0;
    const a = this._projectionToCode(r), o = String(this.get("projection") || Lt.SRS_NAME), l = Ci(e, a, o), c = this.localProperties.tileGrid ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(e, t) : null;
    this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading });
    try {
      let u, h = !1;
      this.localProperties.useCacheWhenOnline !== !1 && (u = await this._loadFromCache(l, t, c)), u === void 0 && (u = await this._loadFromService(l, o), h = !0, this.localProperties.saveCache && await Promise.resolve(this.localProperties.saveCache(u, l, t, c)));
      const p = this._readWFSResponse(u, o, a);
      h && await this._saveFeaturesToFeatureCache(l, t, c, p), p.length && this.addFeatures(p), this.dispatchEvent({ type: "loadend", remains: --this._tileLoading }), s && s(p);
    } catch (u) {
      const h = u?.name === "AbortError" ? "abort" : "error";
      this._handleWFSLoadError(h, u), i && i();
    }
  }
  async _loadFromCache(e, t, r) {
    const s = {
      tileCoord: r,
      extent: e,
      resolution: t
    };
    if (this.localProperties.loadCache)
      try {
        const o = await this.localProperties.loadCache(s);
        if (o !== void 0)
          return o;
      } catch (o) {
        if (o === "obsolete")
          try {
            const l = await this.localProperties.loadCache({
              ...s,
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
  async _saveFeaturesToFeatureCache(e, t, r, s) {
    const i = this.localProperties.featureCache;
    if (!i || s.length === 0)
      return;
    const a = this._buildFeatureCacheKey(e, t, r);
    try {
      await i.saveFeatures(a, s);
    } catch {
    }
  }
  async _loadFromService(e, t) {
    const r = this._buildCurrentGeoservice(), s = this.localProperties.layerExtraParams || [], i = this._isGeoJSONFormat(), a = this._hasFilterParams(r, s, this.localProperties.featureFilter);
    let o = String(this.get("typename") || ""), l = await this._tryLoadWithTypeNames(
      o,
      r,
      s,
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
          s,
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
  async _tryLoadWithTypeNames(e, t, r, s, i, a, o) {
    const l = this._getWfsRequestVariants(a, o), c = /* @__PURE__ */ new Set();
    let u;
    for (const h of l) {
      const p = this._buildWfsGetFeatureUrl(
        t,
        e,
        r,
        i,
        s,
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
    const t = new AbortController(), r = setTimeout(() => t.abort(), 180 * 1e3);
    try {
      const s = await fetch(e, {
        method: "GET",
        headers: this._getAuthHeaders(),
        cache: "no-cache",
        signal: t.signal
      }), i = await s.text(), a = this._getWfsExceptionMessage(i);
      if (!s.ok)
        throw new Error(`WFS ${s.status}: ${a || s.statusText}`);
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
    }, { authorization: t, username: r, password: s } = this.requestProperties;
    return t ? e.Authorization = String(t) : r && s && (e.Authorization = `Basic ${btoa(`${r}:${s}`)}`), e;
  }
  /**
   * Read WFS response and return features to add
   */
  _readWFSResponse(e, t, r) {
    if (this._isFeatureArray(e))
      return e;
    const s = this._parseFeaturesFromPayload(e, t, r);
    if (!s.length)
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
    for (const u of s) {
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
    const s = this._isGeoJSONFormat();
    if (e == null)
      return [];
    if (typeof e == "object" && e !== null && !(e instanceof Document) && (s || this._looksLikeGeoJSONPayload(e)))
      return new Ft().readFeatures(e, {
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
        const c = JSON.parse(a);
        return new Ft().readFeatures(c, {
          dataProjection: t,
          featureProjection: r
        });
      } catch {
      }
    let l = new Gn({ gmlFormat: new Ra() }).readFeatures(a, {
      dataProjection: t,
      featureProjection: r
    });
    return l.length && (!l[0]?.getGeometry() || !l[0]?.getGeometry()?.getExtent()) && (l = new Gn({ gmlFormat: new Oa() }).readFeatures(a, {
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
    return Array.isArray(e) && e.every((t) => t instanceof ut);
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
  _buildWfsGetFeatureUrl(e, t, r, s, i, a) {
    const o = new URL(e.url), l = new URL(`${o.origin}${o.pathname}`), c = /* @__PURE__ */ new Map(), u = (f, p) => {
      const m = f.toLowerCase();
      if (Zn.has(m) || m === "outputformat" || !a.includeFilters && kt.has(m)) return;
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
    l.searchParams.set("service", "WFS"), l.searchParams.set("version", e.version || "2.0.0"), l.searchParams.set("request", "GetFeature"), l.searchParams.set("typeNames", t), l.searchParams.set("srsName", s), a.includeBbox && l.searchParams.set("bbox", `${i.join(",")},${s}`);
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
    for (const [r, s] of Object.entries(e))
      s !== void 0 && (s === null ? t.push(`${r} IS NULL`) : t.push(`${r}=${this._toCqlLiteral(s)}`));
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
    let s = !1;
    new URL(e.url).searchParams.forEach((a, o) => {
      kt.has(String(o).toLowerCase()) && (s = !0);
    });
    const i = t.some(
      ([a]) => kt.has(a.toLowerCase())
    );
    return s || i ? !0 : typeof r == "string" ? r.trim().length > 0 : r && typeof r == "object" ? Object.keys(r).length > 0 : !1;
  }
  _projectionToCode(e) {
    return typeof e == "string" ? e : e && typeof e.getCode == "function" ? e.getCode() : cn;
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
    const t = e.trim();
    if (t.startsWith("<"))
      try {
        const r = new DOMParser().parseFromString(t, "application/xml");
        return r.querySelector("parsererror") ? void 0 : (r.getElementsByTagNameNS("*", "ExceptionText")[0] || r.getElementsByTagNameNS("*", "ServiceException")[0] || r.getElementsByTagNameNS("*", "Exception")[0])?.textContent?.trim() || void 0;
      } catch {
        return;
      }
  }
  _parseLayerSpec(e) {
    const t = e.trim();
    if (!t)
      return { typeNames: "", extraParams: [] };
    let r = t, s = "";
    if (r.includes("?")) {
      const [a, ...o] = r.split("?");
      r = a, s = o.join("?");
    }
    if (r.includes("&")) {
      const [a, ...o] = r.split("&");
      r = a, s = [s, o.join("&")].filter(Boolean).join("&");
    }
    const i = [];
    return new URLSearchParams(s).forEach((a, o) => {
      i.push([o, a]);
    }), {
      typeNames: r.trim(),
      extraParams: i
    };
  }
  _resolveInitialTypeNames(e, t) {
    const r = this._getTypeNamesFromGeoserviceUrl(e)?.trim();
    return t ? !t.includes(":") && r?.includes(":") ? r : t : r || e.layers || "";
  }
  _getTypeNamesFromGeoserviceUrl(e) {
    const t = new URL(e.url);
    return this._getQueryParamCaseInsensitive(t.searchParams, "typeNames") || this._getQueryParamCaseInsensitive(t.searchParams, "typeName") || void 0;
  }
  _getQueryParamCaseInsensitive(e, t) {
    const r = t.toLowerCase();
    let s = null;
    return e.forEach((i, a) => {
      s === null && String(a).toLowerCase() === r && (s = i);
    }), s;
  }
  _extractUnknownFeatureTypeName(e) {
    return e.match(/Feature type\s*:?\s*([^\s]+)\s+unknown/i)?.[1];
  }
  async _resolveUnknownTypeNames(e, t) {
    try {
      const r = this._buildWfsGetCapabilitiesUrl(e), s = await fetch(r.toString(), {
        headers: this._getAuthHeaders()
      });
      if (!s.ok)
        return;
      const i = await s.text(), a = this._parseWfsFeatureTypeNamesFromCapabilities(i);
      return this._selectFallbackTypeNames(t, a);
    } catch {
      return;
    }
  }
  _buildWfsGetCapabilitiesUrl(e) {
    const t = new URL(e.url), r = new URL(`${t.origin}${t.pathname}`);
    return t.searchParams.forEach((s, i) => {
      const a = String(i).toLowerCase();
      Zn.has(a) || kt.has(a) || a !== "outputformat" && r.searchParams.append(i, s);
    }), r.searchParams.set("service", "WFS"), r.searchParams.set("version", e.version || "2.0.0"), r.searchParams.set("request", "GetCapabilities"), r;
  }
  _parseWfsFeatureTypeNamesFromCapabilities(e) {
    const t = e.trim();
    if (!t.startsWith("<"))
      return [];
    const r = new DOMParser().parseFromString(t, "application/xml");
    if (r.querySelector("parsererror"))
      return [];
    const i = Array.from(r.getElementsByTagNameNS("*", "FeatureType")).map((a) => a.getElementsByTagNameNS("*", "Name")[0]?.textContent?.trim() || "").filter((a) => a.length > 0);
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
    const s = t.filter(
      (a) => a.startsWith(`${e}:`) || a.endsWith(`:${e}`)
    );
    return s.length === 0 ? void 0 : s.length === 1 ? s[0] : s.find((a) => a.toLowerCase().endsWith(":epci")) || s[0];
  }
  setAuthentication(e, t, r, s = "Bearer") {
    const i = r?.trim();
    if (i) {
      const a = s?.trim() || "Bearer";
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
const Vn = "__report_transport_geometry__";
class af {
  constructor(e) {
    this._cluster = [], this._apiClient = e.client, this._eventManager = new Ir(), this._cluster = [], this._cache = e.cache, this._communityId = e.communityId, this._loadClosed = e.loadClosed ?? !1;
  }
  /**
   *
   * @param feature - The feature to get the status style for
   * @returns The status style for the feature
   */
  getStatusStyle(e) {
    if (e.get("status"))
      return ot[e.get("status")] || new Q({});
    if (e.get("features")) {
      const t = e.get("features").length;
      return t < 2 ? this.getStatusStyle(e.get("features")[0]) : (!this._cluster[t] && ot[Ve.Cluster] && (this._cluster[t] = ot[Ve.Cluster].clone(), ot[Ve.Cluster].getImage()?.setRadius(Math.min(10, t / 2) + Oe), this._cluster[t] = ot[Ve.Cluster].clone()), this._cluster[t]);
    } else
      return ot[Ve.Pending] || new Q({});
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
    const t = new ut();
    return t.setGeometryName(Vn), t.setProperties(e), t;
  }
  normalizeReportEntry(e) {
    if (e instanceof ut) {
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
        const t = e.map((s) => this.createTransportFeature(s)), r = this.getCacheKey();
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
        const s = { ...r.getProperties() };
        return delete s[Vn], s;
      });
    } catch (e) {
      return console.error("Failed to load reports from cache:", e), [];
    }
  }
  async loadFeatures(e, t) {
    if (e.length === 0)
      return [];
    const r = [], s = new Dr();
    return e.forEach((i) => {
      const a = this.normalizeReportEntry(i), o = s.readFeature(a.geometry, {
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
    try {
      const i = (await this._apiClient.getUser())?.data, o = (Array.isArray(i?.communities) ? i.communities : []).find((E) => E.active === !0)?.id, l = r ?? this._loadClosed;
      !this._communityId && o && (this._communityId = o);
      const c = this._communityId ?? o, u = {
        box: e.join(","),
        limit: 100,
        page: t
      };
      typeof c == "number" && (u.communities = [c]);
      let h = Object.values(Ve);
      if (!l) {
        const E = Object.values(Ai);
        h = h.filter((y) => !E.includes(y));
      }
      const f = await this._apiClient.getReports(u);
      let p = f.headers["content-range"].split("/"), m = p[0].split("-");
      if (f.status == 200 || f.status == 206 && m[1] === p[1]) {
        const E = f.data;
        return await this.saveToCache(E), E;
      } else if (f.status == 206) {
        t = t + 1;
        const y = (await this.loadReports(e, t, l)).concat(f.data);
        return await this.saveToCache(y), y;
      } else
        return console.warn("Failed to load reports from server, loading from cache"), await this.loadFromCache();
    } catch (s) {
      return console.error("Error loading reports:", s), await this.loadFromCache();
    }
  }
  async getReport(e) {
    throw new Error("Not implemented");
  }
}
const ro = new Nr();
class fn extends Lr {
  constructor(e, t) {
    e = e || {}, e.geoservice || (e.geoservice = {}), e.geoservice.input_mask || (e.geoservice.input_mask = {});
    const r = fn._computeWFSLayerOptions(e);
    if (super(r), !e.geoservice?.url) {
      console.error("WFSLayer: geoservice.url is required");
      return;
    }
    this.cache = t, this.layerOptions = e, this.set("authentication", e.username), e.getCapabilities !== !1 ? this.getCapabilities(e) : this.createSource(e, this.cache);
    const s = new vi(), i = e.geoservice, a = i.maxZoom ?? i.max_zoom, o = i.minZoom ?? i.min_zoom;
    a && a < 20 && (s.setZoom(a), this.setMinResolution(s.getResolution() ?? 0)), (o || o === 0) && (s.setZoom(o), this.setMaxResolution(s.getResolution() ?? 0));
  }
  /**
   * Compute the options to pass to the super constructor of VectorLayer
   */
  static _computeWFSLayerOptions(e) {
    const t = ro.getEscapedDomainFromURL(e.geoservice.url), r = e.geoservice.input_mask ? e.geoservice.input_mask.attributes : null;
    return {
      title: e.geoservice.title,
      description: e.geoservice.description,
      visible: e.visibility,
      opacity: e.opacity,
      name: `${t}:${e.geoservice.layers}`,
      style: e.style || fn._createWFSStyle(r ?? {}),
      search: e.geoservice.input_mask ? e.geoservice.input_mask.searchAttribute : null,
      logo: e.logo
    };
  }
  async getCapabilities(e) {
    const t = this.layerOptions?.authentication, r = new URL(e.geoservice.url);
    r.searchParams.append("service", "WFS"), r.searchParams.append("request", "GetCapabilities");
    const s = {}, i = this.getAuthorizationHeader(e);
    i && (s.Authorization = i);
    const a = new AbortController(), o = setTimeout(() => a.abort(), 1e4);
    try {
      const l = await fetch(r.toString(), {
        headers: s,
        signal: a.signal
      });
      if (clearTimeout(o), !l.ok) {
        this.handleGetCapabilitiesError(
          l.status,
          new Error(`HTTP ${l.status}: ${l.statusText}`),
          l.statusText,
          e,
          t
        );
        return;
      }
      this.createSource(e, this.cache);
    } catch (l) {
      clearTimeout(o);
      const c = 0, u = l.name === "AbortError" ? "timeout" : "error";
      this.handleGetCapabilitiesError(
        c,
        l,
        u,
        e,
        t
      );
    }
  }
  getAuthorizationHeader(e) {
    const t = e.accessToken?.trim();
    if (t)
      return `${e.tokenType?.trim() || "Bearer"} ${t}`;
    if (e.username && e.password)
      return `Basic ${btoa(`${e.username}:${e.password}`)}`;
  }
  /**
   * Handle errors from getCapabilities request
   */
  handleGetCapabilitiesError(e, t, r, s, i) {
    const a = !!(s.username && s.password);
    if (!!!s.accessToken?.trim() && (e === 0 && !a || e === 401 || e === 500) && typeof i == "function") {
      i(this, (l, c) => {
        l ? (s.username = l, this.set("authentication", s.username), s.password = c, this.getCapabilities(s)) : (this.createSource(s, this.cache), this.dispatchEvent({ type: "error", error: t, status: e, statusText: r }));
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
    console.warn("[WFSLayer] GetCapabilities failed, fallback to direct GetFeature loader:", t.message), this.createSource(s, this.cache), this.dispatchEvent({ type: "error", error: t, status: e, statusText: r });
  }
  createSource(e, t) {
    const r = new Or(e, t);
    r.localProperties.table = {
      attributes: e.geoservice.input_mask?.attributes ?? {}
    }, this.setSource(r), setTimeout(() => this.dispatchEvent({ type: "ready", source: r }), 100), r.on("addfeature", (s) => {
      s.feature._layer = this;
    });
  }
  /**
   * Get the table for the WFS layer
   */
  getTable() {
    const e = this.getSource();
    if (e && e instanceof Or) return e.localProperties.table;
  }
  /**
   * Create a WFS style function based on feature attributes
   */
  static _createWFSStyle(e) {
    const t = new de({
      color: Re.FILL_COLOR
    }), r = new te({
      color: Re.STROKE_COLOR,
      width: Re.STROKE_WIDTH
    }), s = [
      new Q({
        image: new ht({
          fill: t,
          stroke: r,
          radius: Re.CIRCLE_RADIUS
        }),
        fill: t,
        stroke: r
      })
    ];
    if (!e || Object.keys(e).length === 0)
      return s;
    const i = {};
    for (const o in e)
      e[o].title && /^symb@/.test(e[o].title) && (i[e[o].title] = o);
    const a = (o) => i[o] || o;
    return (o) => {
      const l = o.wfsStyle;
      if (l)
        return l;
      if (!o.get(a("symb@sColor")))
        return s;
      const u = o.get(a("symb@fColor")) || Re.FILL_COLOR, h = o.get(a("symb@fPattern"));
      let f;
      if (h) {
        const A = o.get(a("symb@pAngle")), w = o.get(a("symb@pWidth")), S = o.get(a("symb@pSpace")), b = o.get(a("symb@pColor"));
        f = new wi({
          pattern: h,
          color: b || "transparent",
          fill: new de({
            color: u
          }),
          size: w || 2,
          spacing: S || 5,
          angle: A
        });
      } else
        f = new de({ color: u });
      let p;
      const m = o.get(a("symb@label"));
      if (m) {
        const A = o.get(a("symb@lColor")) || Re.LABEL_COLOR, w = o.get(a("symb@lsColor")) || Re.LABEL_STROKE_COLOR, S = o.get(a("symb@lSize")) || Re.LABEL_SIZE;
        p = new bt({
          text: String(m),
          stroke: new te({
            color: w,
            width: Re.LABEL_STROKE_WIDTH
          }),
          fill: new de({
            color: A
          }),
          overflow: !1,
          font: `${S}px sans-serif`
        });
      }
      const E = o.get(a("symb@sColor")) || Re.STROKE_COLOR, y = o.get(a("symb@sWidth")) || Re.STROKE_WIDTH, C = o.get(a("symb@sDash")), g = C ? C.split(",").map((A) => parseFloat(A)) : void 0, d = new te({
        color: E,
        width: y,
        lineDash: g && g.length > 1 ? g : void 0
      }), x = [
        new Q({
          image: new ht({
            fill: t,
            stroke: r,
            radius: Re.CIRCLE_RADIUS
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
function _n(n) {
  return n && typeof n == "object" && !Array.isArray(n) ? n : null;
}
function Se(n) {
  return typeof n == "string" && n.trim().length > 0 ? n : void 0;
}
function yt(n) {
  if (typeof n == "number" && Number.isFinite(n))
    return n;
  if (typeof n == "string" && n.trim().length > 0) {
    const e = Number(n);
    return Number.isFinite(e) ? e : void 0;
  }
}
function ft(n) {
  if (typeof n == "boolean")
    return n;
  if (typeof n == "number") {
    if (n === 1) return !0;
    if (n === 0) return !1;
  }
  if (typeof n == "string") {
    const e = n.trim().toLowerCase();
    if (e === "true" || e === "1") return !0;
    if (e === "false" || e === "0") return !1;
  }
}
function no(n) {
  const e = {};
  if (Array.isArray(n)) {
    for (const r of n) {
      const s = Yn(r);
      s && (e[s.name] = s);
    }
    return e;
  }
  const t = _n(n);
  if (!t)
    return e;
  for (const r of Object.values(t)) {
    const s = Yn(r);
    s && (e[s.name] = s);
  }
  return e;
}
function Yn(n) {
  const e = _n(n);
  if (!e)
    return null;
  const t = Se(e.name);
  if (!t)
    return null;
  const r = Se(e.type) ?? "string", s = {
    ...e,
    name: t,
    type: r
  }, i = Se(e.title);
  i !== void 0 && (s.title = i);
  const a = ft(e.required);
  a !== void 0 && (s.required = a);
  const o = ft(e.editable);
  o !== void 0 && (s.editable = o);
  const l = ft(e.searchable);
  l !== void 0 && (s.searchable = l);
  const c = Se(e.crs);
  return c !== void 0 && (s.crs = c), "default_value" in e && !("defaultValue" in s) && (s.defaultValue = e.default_value), s;
}
function so(n) {
  const e = _n(n) ?? {}, t = yt(e.databaseId ?? e.database_id ?? e.database) ?? 0, r = Se(e.database_name ?? e.database ?? e.dbname) ?? (t > 0 ? String(t) : ""), s = {
    ...e,
    id: yt(e.id) ?? 0,
    database: r,
    databaseId: t,
    name: Se(e.name ?? e.table_name) ?? "",
    title: Se(e.title ?? e.name ?? e.table_name) ?? "",
    wfs: Se(e.wfs ?? e.wfs_url) ?? "",
    geometryName: Se(e.geometryName ?? e.geometry_name) ?? "geometry",
    columns: no(e.columns)
  }, i = Se(e.idName ?? e.id_name);
  i !== void 0 && (s.idName = i);
  const a = Se(e.description);
  a !== void 0 && (s.description = a);
  const o = Se(e.projection);
  o !== void 0 && (s.projection = o);
  const l = yt(e.minZoomLevel ?? e.min_zoom_level);
  l !== void 0 && (s.minZoomLevel = l);
  const c = yt(e.maxZoomLevel ?? e.max_zoom_level);
  c !== void 0 && (s.maxZoomLevel = c);
  const u = ft(e.searchable);
  u !== void 0 && (s.searchable = u);
  const h = ft(e.editable);
  h !== void 0 && (s.editable = h);
  const f = ft(e.readOnly ?? e.read_only);
  f !== void 0 && (s.readOnly = f);
  const p = yt(e.tileZoomLevel ?? e.tile_zoom_level);
  p !== void 0 && (s.tileZoomLevel = p);
  const m = Se(e.docURI ?? e.doc_uri);
  return m !== void 0 && (s.docURI = m), s;
}
class of {
  constructor(e) {
    this.apiClient = e.apiClient, this.storage = e.storage, this._eventManager = new Ir();
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
      (s) => this.apiClient.getCommunity(s.community_id)
    ), t.communities = r.map((s, i) => ({
      ...s,
      profile: t.communities_member?.[i]?.profile
      // profile is a key
    })), t;
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
    const r = (await this.apiClient.getLayers(e, { limit: 100 })).data, s = r.map((l) => this._fetchLayerData(l)), i = this._getUniqueDatabaseIds(r), a = await this._fetchDatabaseExtents(i), o = await Promise.all(s);
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
      const s = r;
      s.table && s.database && t.add(s.database);
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
    ), r = await Promise.all(t), s = {};
    for (const i of r)
      s[i.data.id] = i.data.extent;
    return s;
  }
  /**
   * Enrich layers with fetched geoservice/table data and database extents
   * (UserManager.js lines 276-290)
   */
  _enrichLayers(e, t, r) {
    for (let s = 0; s < e.length; s++) {
      const i = e[s], a = t[s];
      if (a) {
        if (i.geoservice)
          i.geoservice = a.data;
        else if (i.table && i.database) {
          const o = so(a.data);
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
const je = {
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
class cf {
  constructor(e, t, r = {}) {
    this._defaultParams = {
      georems: {},
      protocol: "georem",
      version: "1.0",
      territory: "fr",
      theme: "",
      themes: "",
      insee: ""
    }, this._apiClient = e, this._storage = t, this._eventManager = new Ir(), this.options = r;
    const s = this._storage.loadParams("report");
    this.params = {
      ...this._defaultParams,
      ...r.defaultParams,
      ...s
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
      var s = parseInt(i[0]);
      r.attributes = JSON.stringify({
        community: s,
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
    if (!t.photos || !t.photos?.length || !t.photosToSend) return;
    const r = (/* @__PURE__ */ new Date()).getTime();
    this.params.georems || (this.params.georems = {}), this.params.georems[r] || (this.params.georems[r] = {}), this.params.georems[r].photosToSend = !1, delete this.params.georems[r].error;
    const s = t.photos;
    this.emit("attachment:uploading", { reportId: e, progress: 0 });
    try {
      const i = await Promise.all(
        s.map((o) => this._storage.getBlob(o))
        // this will be implemented on the consuming app
      ), a = {};
      i.forEach((o, l) => {
        a[`photo${l}`] = o;
      }), await this._apiClient.addAttachments(e, a), await this._storage.saveParam(this.params), this.emit("attachment:uploaded", { reportId: e, attachmentId: r });
    } catch (i) {
      this.params.georems && this.params.georems[r] && (this.params.georems[r].photosToSend = !0, this.params.georems[r].error = i?.message || "Echec d'envoi des images"), await this._storage.saveParam(this.params);
      const a = i instanceof Error ? i : new Error("Echec d'envoi des images");
      throw this.emit("report:error", {
        error: a,
        message: a.message || "Echec d'envoi des images"
      }), a;
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
    if (!e) return "";
    e instanceof Array || (e = [e]);
    const r = new Dr(), s = new Ft();
    let i;
    const a = e[0]?.getGeometry();
    a instanceof Ba ? i = a.getFirstCoordinate() : a && (i = gi(a.getExtent())), i && t && (i = ba(i, t, je.FEATURE2SKETCH.TRANSFORM_PROJECTION));
    const o = {
      context: {
        ...je.FEATURE2SKETCH.SKETCH_CONTEXT,
        lon: i?.[0]?.toFixed(7) || je.FEATURE2SKETCH.SKETCH_CONTEXT.lon,
        lat: i?.[1]?.toFixed(7) || je.FEATURE2SKETCH.SKETCH_CONTEXT.lat
      },
      objects: []
    };
    for (const l of e) {
      const c = { style: je.FEATURE2SKETCH.SKETCH_STYLE }, u = l.getGeometry()?.clone(), h = l.getProperties();
      switch (delete h.geometry, t && u?.transform(t, je.FEATURE2SKETCH.TRANSFORM_PROJECTION), u?.getLayout() === "XYZM" && (h.geom = s.writeGeometry(u)), c.name = "", c.attributes = h, c.geometry = r.writeGeometry(u), u?.getType()) {
        case "Point":
          c.type = "Point";
          break;
        case "LineString":
          c.type = "LineString";
          break;
        case "Polygon":
        case "MultiPolygon":
          c.type = "Polygone";
          break;
      }
      o.objects.push(c);
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
    const r = [], s = new Dr(), i = e.objects;
    for (const a of i) {
      if (!a || typeof a.geometry != "string" || a.geometry.length === 0)
        continue;
      const o = a.attributes ? a.attributes : {};
      try {
        const l = s.readGeometry(a.geometry);
        if (!l)
          continue;
        l.transform(
          je.SKETCH2FEATURE.TRANSFORM_PROJECTION,
          t || je.SKETCH2FEATURE.TRANSFORM_PROJECTION_FALLBACK
        ), o.geometry = l, r.push(new _i(o));
      } catch {
        continue;
      }
    }
    return r;
  }
}
function io(n) {
  return n instanceof Date && !isNaN(n.getTime());
}
class lf {
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
        const s = e.attributes[t], i = this.validateAttribute(t, r, s);
        if (!i.valid)
          return { valid: !1, error: i.error };
      }
    return { valid: !0 };
  }
  static validateAttribute(e, t, r) {
    return r.required && !t ? { valid: !1, error: `The field ${e} is required` } : r.type === "number" && isNaN(t) ? { valid: !1, error: `The field ${e} must be a number` } : r.type === "select" && !r.options?.includes(t) ? { valid: !1, error: `The field ${e} must be a valid option` } : r.type === "date" && !io(t) ? { valid: !1, error: `The field ${e} must be a valid date` } : { valid: !0 };
  }
}
const ao = 10, Ze = () => {
};
function oo(n) {
  return n === "select" || n === "modify";
}
function co(n, e) {
  const t = n[0] - e[0], r = n[1] - e[1];
  return t * t + r * r;
}
function lo(n, e) {
  const t = n.getGeometry();
  if (!t)
    return null;
  if (typeof t.intersectsCoordinate == "function" && t.intersectsCoordinate(e))
    return e;
  const r = [Number.NaN, Number.NaN];
  return t.closestPointXY(e[0], e[1], r, Number.POSITIVE_INFINITY), Number.isFinite(r[0]) && Number.isFinite(r[1]) ? r : null;
}
class uf extends Ia {
  /**
   * Creates a new SketchManager instance
   */
  constructor(e) {
    if (super(), this.isActive = !1, this.currentMode = null, this.undoStack = [], this.drawInteraction = null, this.modifyStartGeometries = new globalThis.Map(), this.translateStartGeometries = new globalThis.Map(), this.boundHandlers = [], this.listenerKeys = [], !e.map)
      throw new Error("SketchManager requires a map instance");
    if (!e.source)
      throw new Error("SketchManager requires a vector source");
    this.map = e.map, this.source = e.source, this.layerFilter = e.layerFilter, this.modifyInteractionScope = e.modifyInteractionScope ?? "source", this.selectionHitTolerance = e.selectionHitTolerance ?? ao, this.useSourceSelectionFallback = e.useSourceSelectionFallback ?? !0, this.enableUndo = e.enableUndo ?? !0, this.maxUndoStackSize = e.maxUndoStackSize ?? 50, this.buttons = {
      back: e.buttons?.back ?? null,
      drawPoint: e.buttons?.drawPoint ?? null,
      drawLine: e.buttons?.drawLine ?? null,
      drawPolygon: e.buttons?.drawPolygon ?? null,
      drawCircle: e.buttons?.drawCircle ?? null,
      modify: e.buttons?.modify ?? null,
      select: e.buttons?.select ?? null,
      delete: e.buttons?.delete ?? null,
      undo: e.buttons?.undo ?? null
    }, this.callbacks = {
      onBack: e.callbacks?.onBack ?? Ze,
      onFeatureAdded: e.callbacks?.onFeatureAdded ?? Ze,
      onFeatureSelected: e.callbacks?.onFeatureSelected ?? Ze,
      onFeatureModified: e.callbacks?.onFeatureModified ?? Ze,
      onFeatureDeleted: e.callbacks?.onFeatureDeleted ?? Ze,
      onActiveChange: e.callbacks?.onActiveChange ?? Ze,
      onModeChange: e.callbacks?.onModeChange ?? Ze
    }, this.initializeInteractions(), e.autoBindUI !== !1 && this.bindUIElements(), this.setActive(!1);
  }
  /**
   * Initialize all OpenLayers interactions
   */
  initializeInteractions() {
    this.selectInteraction = new La({
      condition: Ta,
      hitTolerance: this.selectionHitTolerance,
      layers: this.layerFilter ? this.layerFilter : void 0
    }), this.selectInteraction.setActive(!1), this.map.addInteraction(this.selectInteraction), this.modifyInteraction = this.modifyInteractionScope === "selection" ? new Kn({
      features: this.selectInteraction.getFeatures()
    }) : new Kn({
      source: this.source
    }), this.modifyInteraction.setActive(!1), this.map.addInteraction(this.modifyInteraction), this.translateInteraction = new ka({
      features: this.selectInteraction.getFeatures()
    }), this.translateInteraction.setActive(!1), this.map.addInteraction(this.translateInteraction), this.setupEventListeners();
  }
  /**
   * Set up event listeners for interactions
   * Notify callbacks and emit events when features are selected, modified, or moved.
   */
  setupEventListeners() {
    this.modifyInteractionScope === "selection" ? this.listenerKeys.push(this.map.on("singleclick", (e) => {
      if (!oo(this.currentMode))
        return;
      const t = this.findFeatureFromTap(e);
      this.updateSelectedFeature(t);
    })) : this.listenerKeys.push(this.selectInteraction.on("select", () => {
      this.notifyFeatureSelected(this.getSelectedFeature());
    })), this.listenerKeys.push(this.modifyInteraction.on("modifystart", (e) => {
      e.features.forEach((t) => {
        const r = t.getGeometry();
        r && this.modifyStartGeometries.set(String(Pt(t)), r.clone());
      });
    })), this.listenerKeys.push(this.modifyInteraction.on("modifyend", (e) => {
      e.features.getArray().forEach((r) => {
        const s = String(Pt(r)), i = this.modifyStartGeometries.get(s);
        this.enableUndo && i && this.addToUndoStack({
          type: "modify",
          feature: r,
          previousGeometry: i
        }), this.modifyStartGeometries.delete(s), this.callbacks.onFeatureModified(r), this.emitEvent("featuremodified", { feature: r });
      });
    })), this.listenerKeys.push(this.translateInteraction.on("translatestart", (e) => {
      e.features.forEach((t) => {
        const r = t.getGeometry();
        r && this.translateStartGeometries.set(String(Pt(t)), r.clone());
      });
    })), this.listenerKeys.push(this.translateInteraction.on("translateend", (e) => {
      e.features.forEach((t) => {
        const r = String(Pt(t)), s = this.translateStartGeometries.get(r);
        this.enableUndo && s && this.addToUndoStack({
          type: "modify",
          feature: t,
          previousGeometry: s
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
      const s = this.buttons[t];
      s && this.bindElement(s, r);
    });
  }
  /**
   * Bind a single element to a handler
   */
  bindElement(e, t) {
    document.querySelectorAll(e).forEach((s) => {
      const i = () => {
        t();
      };
      s.addEventListener("click", i), this.boundHandlers.push({ element: s, listener: i });
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
    this.ensureActive(), this.deactivateAll(), this.drawInteraction = new Pa({
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
    this.unbindUIElements(), this.setActive(!1), Na(this.listenerKeys), this.listenerKeys.length = 0, this.map.removeInteraction(this.modifyInteraction), this.map.removeInteraction(this.selectInteraction), this.map.removeInteraction(this.translateInteraction), this.clearUndoStack();
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
      (r, s) => {
        if (!(r instanceof _i) || Array.isArray(r.get("features")))
          return;
        const i = s;
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
    const r = lo(t, e);
    if (!r)
      return null;
    const s = this.map.getPixelFromCoordinate(e), i = this.map.getPixelFromCoordinate(r);
    return Math.sqrt(co(
      s,
      i
    )) <= this.selectionHitTolerance ? t : null;
  }
  emitEvent(e, t) {
    this.dispatchEvent({ type: e, ...t });
  }
}
const X = {
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
}, uo = {
  fill: new de({
    color: X.FILL_COLOR
  }),
  stroke: new te({
    color: X.STROKE_COLOR,
    width: X.STROKE_WIDTH,
    lineCap: "round"
  }),
  circle: new ht({
    radius: X.RADIUS,
    fill: new de({
      color: X.CIRCLE_FILL_COLOR
    }),
    stroke: new te({
      color: X.CIRCLE_STROKE_COLOR,
      width: X.CIRCLE_STROKE_WIDTH
    })
  }),
  text: new bt({
    font: `${X.LABEL_SIZE}px Arial`,
    textAlign: "left",
    textBaseline: "middle",
    text: "",
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scale: 1,
    stroke: new te({
      color: X.LABEL_STROKE_COLOR,
      width: X.LABEL_STROKE_WIDTH
    }),
    fill: new de({
      color: X.LABEL_COLOR
    })
  }),
  icon: new En({
    src: "icon.png",
    size: [X.ICON_SIZE, X.ICON_SIZE]
  }),
  regularShape: new Br({
    points: 3,
    radius: X.REGULAR_SHAPE_RADIUS,
    fill: new de({
      color: X.REGULAR_SHAPE_FILL_COLOR
    })
  })
};
class ff {
  constructor() {
    this.defaultStyle = uo;
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
      t.fill = new de({
        color: r
      });
    }
    if (e.strokeColor || e.strokeWidth) {
      const r = e.strokeColor || X.STROKE_COLOR, s = e.strokeWidth || X.STROKE_WIDTH, i = this.applyOpacity(r, e.opacity);
      t.stroke = new te({
        color: i,
        width: s
      });
    }
    if (e.icon) {
      const r = e.iconSize || X.ICON_SIZE;
      t.image = new En({
        src: e.icon,
        scale: r / X.ICON_SIZE
        // Scale relative to base icon size
      });
    } else if (e.symbol === "circle" || !e.icon && e.color) {
      const r = e.color || e.fillColor || X.CIRCLE_FILL_COLOR, s = this.applyOpacity(r, e.opacity), i = e.iconSize || X.RADIUS;
      t.image = new ht({
        radius: i,
        fill: new de({
          color: s
        }),
        stroke: e.strokeColor ? new te({
          color: this.applyOpacity(e.strokeColor, e.opacity),
          width: e.strokeWidth || X.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    } else if (e.symbol === "square") {
      const r = e.color || e.fillColor || X.CIRCLE_FILL_COLOR, s = this.applyOpacity(r, e.opacity), i = e.iconSize || X.RADIUS;
      t.image = new Br({
        points: 4,
        radius: i,
        angle: Math.PI / 4,
        fill: new de({
          color: s
        }),
        stroke: e.strokeColor ? new te({
          color: this.applyOpacity(e.strokeColor, e.opacity),
          width: e.strokeWidth || X.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    } else if (e.symbol === "triangle") {
      const r = e.color || e.fillColor || X.CIRCLE_FILL_COLOR, s = this.applyOpacity(r, e.opacity), i = e.iconSize || X.RADIUS;
      t.image = new Br({
        points: 3,
        radius: i,
        fill: new de({
          color: s
        }),
        stroke: e.strokeColor ? new te({
          color: this.applyOpacity(e.strokeColor, e.opacity),
          width: e.strokeWidth || X.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    }
    if (e.label) {
      const r = e.labelColor || X.LABEL_COLOR, s = e.labelSize || X.LABEL_SIZE;
      t.text = new bt({
        text: e.label,
        font: `${s}px Arial`,
        fill: new de({
          color: r
        }),
        stroke: new te({
          color: X.LABEL_STROKE_COLOR,
          width: X.LABEL_STROKE_WIDTH
        })
      });
    }
    return new Q(t);
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
      const r = e.replace("#", ""), s = parseInt(r.substring(0, 2), 16), i = parseInt(r.substring(2, 4), 16), a = parseInt(r.substring(4, 6), 16);
      return `rgba(${s}, ${i}, ${a}, ${t})`;
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
    return new Q({
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
    return new Q({
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
var ne = /* @__PURE__ */ ((n) => (n.FAILED_TO_DISCONNECT = "Failed to disconnect from the API", n.LOGIN_FAILED = "Login failed", n.UNAUTHORIZED = "Unauthorized", n.CODE_VERIFIER_MISSING = "Code verifier missing", n.OAUTH_REDIRECT = "OAuth redirect", n.OAUTH_CALLBACK_FAILED = "OAuth callback failed", n.NO_AUTHORIZATION_CODE = "No authorization code", n.FAILED_TO_FETCH_USER_INFO = "Failed to fetch user info", n.NO_ACCESS_TOKEN_AFTER_EXCHANGE = "No access token after exchange", n.TOKEN_EXCHANGE_FAILED = "Token exchange failed", n.REFRESH_TOKEN_MISSING = "Refresh token missing", n.REFRESH_TOKEN_EXPIRED = "Refresh token expired", n.REFRESH_TOKEN_FAILED = "Refresh token failed", n.UNKNOWN_ERROR = "Unknown error", n.TOKEN_MISSING = "Token missing", n))(ne || {});
function fo() {
  const n = new Uint8Array(32);
  return crypto.getRandomValues(n), Fi(n);
}
function Fi(n) {
  return btoa(String.fromCharCode(...n)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
async function ho(n) {
  const t = new TextEncoder().encode(n);
  return crypto.subtle.digest("SHA-256", t);
}
async function xo(n) {
  const e = await ho(n);
  return Fi(new Uint8Array(e));
}
function Jn(n) {
  return {
    id: n.id,
    email: n.email,
    firstName: n.firstName,
    lastName: n.lastName,
    username: n.username,
    avatar: n.avatar,
    description: n.description,
    communities: n.communities || [],
    communities_member: n.communities_member || []
  };
}
function Si(n, e) {
  return function() {
    return n.apply(e, arguments);
  };
}
const { toString: po } = Object.prototype, { getPrototypeOf: qe } = Object, { iterator: St, toStringTag: Bi } = Symbol, Me = (({ hasOwnProperty: n }) => (e, t) => n.call(e, t))(Object.prototype), Di = (n) => typeof n == "string" && (n === "__proto__" || n === "constructor" || n === "prototype"), Ur = (n, e, t) => n === Object.prototype || !t && e === null, mo = (n) => {
  if (!Object.isExtensible(n))
    return !1;
  const e = Object.getOwnPropertyNames(n);
  return Object.getOwnPropertySymbols && e.push(...Object.getOwnPropertySymbols(n)), e.every((t) => {
    if (Di(t))
      return !1;
    const r = Object.getOwnPropertyDescriptor(n, t);
    return !!r && r.configurable && r.writable === !0;
  });
}, An = (n, e) => {
  let t = n;
  const r = [];
  for (; t != null; ) {
    if (r.indexOf(t) !== -1)
      return !1;
    r.push(t);
    const s = qe(t);
    if (Ur(t, s, t === n))
      return !1;
    if (Me(t, e))
      return !0;
    t = s;
  }
  return !1;
}, go = (n, e) => n != null && An(n, e) ? n[e] : void 0, yo = (n) => {
  if (n == null || typeof n != "object" && typeof n != "function")
    return n;
  const e = qe(n);
  if (e === null && mo(n))
    return n;
  const t = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null), s = [];
  let i = n;
  for (; i != null && s.indexOf(i) === -1; ) {
    s.push(i);
    const a = i === n ? e : qe(i);
    if (Ur(i, a, i === n))
      break;
    const o = Object.getOwnPropertyNames(i);
    Object.getOwnPropertySymbols && o.push(...Object.getOwnPropertySymbols(i));
    for (const l of o)
      Di(l) || Me(r, l) || (t[l] = n[l], r[l] = !0);
    i = a;
  }
  return t;
}, bn = /* @__PURE__ */ ((n) => (e) => {
  const t = po.call(e);
  return n[t] || (n[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Te = (n) => (n = n.toLowerCase(), (e) => bn(e) === n), qr = (n) => (e) => typeof e === n, { isArray: et } = Array, tt = qr("undefined");
function xt(n) {
  return n !== null && !tt(n) && n.constructor !== null && !tt(n.constructor) && we(n.constructor.isBuffer) && n.constructor.isBuffer(n);
}
const Ri = Te("ArrayBuffer");
function Eo(n) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(n) : e = n && n.buffer && Ri(n.buffer), e;
}
const vo = qr("string"), we = qr("function"), Co = qr("number"), pt = (n) => n !== null && typeof n == "object", wo = (n) => n === !0 || n === !1, Ht = (n) => {
  if (!pt(n))
    return !1;
  const e = qe(n);
  return (e === null || e === Object.prototype || qe(e) === null) && // Treat own Symbol.toStringTag or Symbol.iterator members as evidence the
  // value is tagged/iterable, ignoring members reachable only through shared
  // or terminal prototype boundaries. This is exactly what
  // hasOwnInPrototypeChain(val, prop) computes here: every prototype admitted
  // above (null, Object.prototype, or a terminal null-prototype template) is
  // a boundary, so the walk never inspects anything but `val`'s own members,
  // and stops before even those when `val` is itself the boundary
  // Object.prototype. Checking that inline avoids allocating the walker's
  // `seen` list twice per call on the mergeConfig / merge hot path.
  (Ur(n, e, !0) || !Me(n, Bi) && !Me(n, St));
}, _o = (n) => {
  if (!pt(n) || xt(n))
    return !1;
  try {
    return Object.keys(n).length === 0 && Object.getPrototypeOf(n) === Object.prototype;
  } catch {
    return !1;
  }
}, Ao = Te("Date"), bo = Te("File"), Fo = (n) => !!(n && typeof n.uri < "u"), So = (n) => n && typeof n.getParts < "u", Bo = Te("Blob"), Do = Te("FileList"), Ro = Te("Set"), Oo = (n) => pt(n) && we(n.pipe);
function To() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const Qn = To(), es = typeof Qn.FormData < "u" ? Qn.FormData : void 0, Po = (n) => {
  if (!n) return !1;
  if (es && n instanceof es) return !0;
  const e = qe(n);
  if (!e || e === Object.prototype || !we(n.append)) return !1;
  const t = bn(n);
  return t === "formdata" || // detect form-data instance
  t === "object" && we(n.toString) && n.toString() === "[object FormData]";
}, Lo = Te("URLSearchParams"), [ko, Io, No, Uo] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers"
].map(Te), qo = (n) => n.trim ? n.trim() : n.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Bt(n, e, { allOwnKeys: t = !1 } = {}) {
  if (n === null || typeof n > "u")
    return;
  let r, s;
  if (typeof n != "object" && (n = [n]), et(n))
    for (r = 0, s = n.length; r < s; r++)
      e.call(null, n[r], r, n);
  else {
    if (xt(n))
      return;
    const i = t ? Object.getOwnPropertyNames(n) : Object.keys(n), a = i.length;
    let o;
    for (r = 0; r < a; r++)
      o = i[r], e.call(null, n[o], o, n);
  }
}
function Mo(n, e) {
  if (xt(n))
    return null;
  e = e.toLowerCase();
  const t = Object.keys(n);
  let r = t.length, s;
  for (; r-- > 0; )
    if (s = t[r], e === s.toLowerCase())
      return s;
  return null;
}
const Je = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Oi = (n) => !tt(n) && n !== Je;
function hn(...n) {
  const { caseless: e, skipUndefined: t } = Oi(this) && this || {}, r = {}, s = e ? /* @__PURE__ */ Object.create(null) : null, i = (a, o) => {
    if (o === "__proto__" || o === "constructor" || o === "prototype")
      return;
    let l = o;
    if (s && typeof o == "string") {
      const u = o.toLowerCase(), h = s[u];
      h !== void 0 && Me(r, h) ? l = h : s[u] = o;
    }
    const c = Me(r, l) ? r[l] : void 0;
    Ht(c) && Ht(a) ? r[l] = hn(c, a) : Ht(a) ? r[l] = hn({}, a) : et(a) ? r[l] = a.slice() : (!t || !tt(a)) && (r[l] = a);
  };
  for (let a = 0, o = n.length; a < o; a++) {
    const l = n[a];
    if (!l || xt(l) || (Bt(l, i), typeof l != "object" || et(l) || !Object.getOwnPropertySymbols))
      continue;
    const c = Object.getOwnPropertySymbols(l);
    for (let u = 0; u < c.length; u++) {
      const h = c[u];
      Jo.call(l, h) && i(l[h], h);
    }
  }
  return r;
}
const Ho = (n, e, t, { allOwnKeys: r } = {}) => (Bt(
  e,
  (s, i) => {
    t && we(s) ? Object.defineProperty(n, i, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot
      // hijack defineProperty's accessor-vs-data resolution.
      __proto__: null,
      value: Si(s, t),
      writable: !0,
      enumerable: !0,
      configurable: !0
    }) : Object.defineProperty(n, i, {
      __proto__: null,
      value: s,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  },
  { allOwnKeys: r }
), n), $o = (n) => (n.charCodeAt(0) === 65279 && (n = n.slice(1)), n), zo = (n, e, t, r) => {
  n.prototype = Object.create(e.prototype, r), Object.defineProperty(n.prototype, "constructor", {
    __proto__: null,
    value: n,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(n, "super", {
    __proto__: null,
    value: e.prototype
  }), t && Object.assign(n.prototype, t);
}, jo = (n, e, t, r) => {
  let s, i, a;
  const o = {};
  if (e = e || {}, n == null) return e;
  do {
    for (s = Object.getOwnPropertyNames(n), i = s.length; i-- > 0; )
      a = s[i], (!r || r(a, n, e)) && !o[a] && (e[a] = n[a], o[a] = !0);
    n = t !== !1 && qe(n);
  } while (n && (!t || t(n, e)) && n !== Object.prototype);
  return e;
}, Wo = (n, e, t) => {
  n = String(n), (t === void 0 || t > n.length) && (t = n.length), t -= e.length;
  const r = n.indexOf(e, t);
  return r !== -1 && r === t;
}, Go = (n) => {
  if (!n) return null;
  if (et(n)) return n;
  let e = n.length;
  if (!Number.isSafeInteger(e) || e < 0 || e > 4294967295) return null;
  const t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  let s = n;
  for (; s != null && t.size < e; ) {
    if (r.has(s)) return null;
    r.add(s);
    const a = qe(s);
    if (Ur(s, a, s === n)) break;
    Object.getOwnPropertyNames(s).forEach((o) => {
      const l = +o;
      Number.isInteger(l) && l >= 0 && l < e && String(l) === o && Me(s, o) && t.add(l);
    }), s = a;
  }
  if (t.size !== e) return null;
  const i = new Array(e);
  for (; e-- > 0; )
    i[e] = n[e];
  return i;
}, Ko = /* @__PURE__ */ ((n) => (e) => n && e instanceof n)(typeof Uint8Array < "u" && qe(Uint8Array)), Xo = (n, e) => {
  const r = (n && n[St]).call(n);
  let s;
  for (; (s = r.next()) && !s.done; ) {
    const i = s.value;
    e.call(n, i[0], i[1]);
  }
}, Zo = (n, e) => {
  let t;
  const r = [];
  for (; (t = n.exec(e)) !== null; )
    r.push(t);
  return r;
}, Vo = Te("HTMLFormElement"), Yo = (n) => n.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(t, r, s) {
  return r.toUpperCase() + s;
}), { propertyIsEnumerable: Jo } = Object.prototype, Qo = Te("RegExp"), Ti = (n, e) => {
  const t = Object.getOwnPropertyDescriptors(n), r = {};
  Bt(t, (s, i) => {
    let a;
    (a = e(s, i, n)) !== !1 && (r[i] = a || s);
  }), Object.defineProperties(n, r);
}, e0 = (n) => {
  Ti(n, (e, t) => {
    if (we(n) && ["arguments", "caller", "callee"].includes(t))
      return !1;
    const r = n[t];
    if (we(r)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, t0 = (n, e) => {
  const t = {}, r = (s) => {
    s.forEach((i) => {
      t[i] = !0;
    });
  };
  return et(n) ? r(n) : r(String(n).split(e)), t;
}, r0 = () => {
}, n0 = (n, e) => n != null && Number.isFinite(n = +n) ? n : e;
function s0(n) {
  return !!(n && we(n.append) && n[Bi] === "FormData" && n[St]);
}
const i0 = (n) => {
  const e = /* @__PURE__ */ new WeakSet(), t = (r) => {
    if (pt(r)) {
      if (e.has(r))
        return;
      if (xt(r))
        return r;
      if (!("toJSON" in r)) {
        e.add(r);
        let s;
        if (Ro(r)) {
          s = [];
          for (const i of r) {
            const a = t(i);
            !tt(a) && s.push(a);
          }
        } else
          s = et(r) ? [] : {}, Bt(r, (i, a) => {
            const o = t(i);
            !tt(o) && (s[a] = o);
          });
        return e.delete(r), s;
      }
    }
    return r;
  };
  return t(n);
}, a0 = Te("AsyncFunction"), o0 = (n) => n && (pt(n) || we(n)) && we(n.then) && we(n.catch), Pi = ((n, e) => n ? setImmediate : e ? ((t, r) => (Je.addEventListener(
  "message",
  ({ source: s, data: i }) => {
    s === Je && i === t && r.length && r.shift()();
  },
  !1
), (s) => {
  r.push(s), Je.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(typeof setImmediate == "function", we(Je.postMessage)), c0 = typeof queueMicrotask < "u" ? queueMicrotask.bind(Je) : typeof process < "u" && process.nextTick || Pi, Li = (n) => n != null && we(n[St]), l0 = (n) => n != null && An(n, St) && Li(n), v = {
  isArray: et,
  isArrayBuffer: Ri,
  isBuffer: xt,
  isFormData: Po,
  isArrayBufferView: Eo,
  isString: vo,
  isNumber: Co,
  isBoolean: wo,
  isObject: pt,
  isPlainObject: Ht,
  isEmptyObject: _o,
  isReadableStream: ko,
  isRequest: Io,
  isResponse: No,
  isHeaders: Uo,
  isUndefined: tt,
  isDate: Ao,
  isFile: bo,
  isReactNativeBlob: Fo,
  isReactNative: So,
  isBlob: Bo,
  isRegExp: Qo,
  isFunction: we,
  isStream: Oo,
  isURLSearchParams: Lo,
  isTypedArray: Ko,
  isFileList: Do,
  forEach: Bt,
  merge: hn,
  extend: Ho,
  trim: qo,
  stripBOM: $o,
  inherits: zo,
  toFlatObject: jo,
  kindOf: bn,
  kindOfTest: Te,
  endsWith: Wo,
  toArray: Go,
  forEachEntry: Xo,
  matchAll: Zo,
  isHTMLForm: Vo,
  hasOwnProperty: Me,
  hasOwnProp: Me,
  // an alias to avoid ESLint no-prototype-builtins detection
  hasOwnInPrototypeChain: An,
  getSafeProp: go,
  toSafeFlatObject: yo,
  reduceDescriptors: Ti,
  freezeMethods: e0,
  toObjectSet: t0,
  toCamelCase: Yo,
  noop: r0,
  toFiniteNumber: n0,
  findKey: Mo,
  global: Je,
  isContextDefined: Oi,
  isSpecCompliantForm: s0,
  toJSONObject: i0,
  isAsyncFn: a0,
  isThenable: o0,
  setImmediate: Pi,
  asap: c0,
  isIterable: Li,
  isSafeIterable: l0
}, u0 = v.toObjectSet([
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
]), f0 = (n) => {
  const e = /* @__PURE__ */ Object.create(null);
  let t, r, s;
  return n && n.split(`
`).forEach(function(a) {
    s = a.indexOf(":"), t = a.substring(0, s).trim().toLowerCase(), r = a.substring(s + 1).trim();
    const o = v.hasOwnProp(e, t);
    !t || o && v.hasOwnProp(u0, t) || (t === "set-cookie" ? o ? e[t].push(r) : e[t] = [r] : e[t] = o ? e[t] + ", " + r : r);
  }), e;
};
function h0(n) {
  let e = 0, t = n.length;
  for (; e < t; ) {
    const r = n.charCodeAt(e);
    if (r !== 9 && r !== 32)
      break;
    e += 1;
  }
  for (; t > e; ) {
    const r = n.charCodeAt(t - 1);
    if (r !== 9 && r !== 32)
      break;
    t -= 1;
  }
  return e === 0 && t === n.length ? n : n.slice(e, t);
}
const d0 = new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), x0 = new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function Fn(n, e) {
  return v.isArray(n) ? n.map((t) => Fn(t, e)) : h0(String(n).replace(e, ""));
}
const p0 = (n) => Fn(n, d0), m0 = (n) => Fn(n, x0);
function ki(n) {
  const e = /* @__PURE__ */ Object.create(null);
  return v.forEach(n.toJSON(), (t, r) => {
    e[r] = m0(t);
  }), e;
}
const ts = /* @__PURE__ */ Symbol("internals");
function Et(n) {
  return n && String(n).trim().toLowerCase();
}
function $t(n) {
  return n === !1 || n == null ? n : v.isArray(n) ? n.map($t) : p0(String(n));
}
function g0(n) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = t.exec(n); )
    e[r[1]] = r[2];
  return e;
}
const y0 = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
function Gr(n) {
  let e = 0, t = n.length;
  for (; e < t; ) {
    const r = n.charCodeAt(e);
    if (r !== 9 && r !== 32)
      break;
    e += 1;
  }
  for (; t > e; ) {
    const r = n.charCodeAt(t - 1);
    if (r !== 9 && r !== 32)
      break;
    t -= 1;
  }
  return e === 0 && t === n.length ? n : n.slice(e, t);
}
function E0(n) {
  const e = n.length - 1;
  if (e < 1 || n.charCodeAt(0) !== 34 || n.charCodeAt(e) !== 34)
    return n;
  let t = "";
  for (let r = 1; r < e; r++) {
    const s = n.charCodeAt(r);
    if (s === 34 || s === 92 && (r += 1, r >= e))
      return n;
    t += n[r];
  }
  return t;
}
function v0(n) {
  const e = /* @__PURE__ */ Object.create(null), t = String(n);
  let r = 0, s = !1, i = !1;
  function a(o) {
    const l = Gr(t.slice(r, o)), c = l.indexOf("=");
    if (c < 1)
      return;
    const u = Gr(l.slice(0, c));
    if (!y0.test(u))
      return;
    const h = u.toLowerCase();
    if (h === "__proto__" || h === "constructor" || h === "prototype")
      return;
    const f = Gr(l.slice(c + 1));
    e[h] = E0(f);
  }
  for (let o = 0; o < t.length; o++) {
    const l = t.charCodeAt(o);
    s ? i ? i = !1 : l === 92 ? i = !0 : l === 34 && (s = !1) : l === 34 ? s = !0 : (l === 44 || l === 59) && (a(o), r = o + 1);
  }
  return a(t.length), e;
}
const C0 = (n) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim()), w0 = "__Proto__", rs = (n) => n === "__proto__" ? w0 : n;
function Kr(n, e, t, r, s) {
  if (v.isFunction(r))
    return r.call(n, e, t);
  if (s && (e = t), !!v.isString(e)) {
    if (v.isString(r))
      return e.indexOf(r) !== -1;
    if (v.isRegExp(r))
      return r.test(e);
  }
}
function _0(n) {
  return n.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, r) => t.toUpperCase() + r);
}
function A0(n, e) {
  const t = v.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(n, r + t, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(s, i, a) {
        return this[r].call(this, e, s, i, a);
      },
      configurable: !0
    });
  });
}
let le = class {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, r) {
    const s = this;
    function i(o, l, c) {
      const u = Et(l);
      if (!u)
        return;
      const h = v.findKey(s, u);
      (!h || s[h] === void 0 || c === !0 || c === void 0 && s[h] !== !1) && (s[rs(h || l)] = $t(o));
    }
    const a = (o, l) => v.forEach(o, (c, u) => i(c, u, l));
    if (v.isPlainObject(e) || e instanceof this.constructor)
      a(e, t);
    else if (v.isString(e) && (e = e.trim()) && !C0(e))
      a(f0(e), t);
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
    if (e = Et(e), e) {
      const r = v.findKey(this, e);
      if (r) {
        const s = this[r];
        if (!t)
          return s;
        if (t === !0)
          return g0(s);
        if (v.isFunction(t))
          return t.call(this, s, r);
        if (v.isRegExp(t))
          return t.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = Et(e), e) {
      const r = v.findKey(this, e);
      return !!(r && this[r] !== void 0 && (!t || Kr(this, this[r], r, t)));
    }
    return !1;
  }
  delete(e, t) {
    const r = this;
    let s = !1;
    function i(a) {
      if (a = Et(a), a) {
        const o = v.findKey(r, a);
        o && (!t || Kr(r, r[o], o, t)) && (delete r[o], s = !0);
      }
    }
    return v.isArray(e) ? e.forEach(i) : i(e), s;
  }
  clear(e) {
    const t = Object.keys(this);
    let r = t.length, s = !1;
    for (; r--; ) {
      const i = t[r];
      (!e || Kr(this, this[i], i, e, !0)) && (delete this[i], s = !0);
    }
    return s;
  }
  normalize(e) {
    const t = this, r = /* @__PURE__ */ Object.create(null);
    return v.forEach(this, (s, i) => {
      const a = v.findKey(r, i);
      if (a) {
        t[a] = $t(s), delete t[i];
        return;
      }
      const o = rs(e ? _0(i) : String(i).trim());
      o !== i && delete t[i], t[o] = $t(s), r[o] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return v.forEach(this, (r, s) => {
      r != null && r !== !1 && (t[s] = e && v.isArray(r) ? r.join(", ") : r);
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
    return v0(e);
  }
  static concat(e, ...t) {
    const r = new this(e);
    return t.forEach((s) => r.set(s)), r;
  }
  static accessor(e) {
    const r = (this[ts] = this[ts] = {
      accessors: {}
    }).accessors, s = this.prototype;
    function i(a) {
      const o = Et(a);
      r[o] || (A0(s, a), r[o] = !0);
    }
    return v.isArray(e) ? e.forEach(i) : i(e), this;
  }
};
le.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization"
]);
v.reduceDescriptors(le.prototype, ({ value: n }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => n,
    set(r) {
      this[t] = r;
    }
  };
});
v.freezeMethods(le);
const Tr = "[REDACTED ****]";
function b0(n) {
  if (v.hasOwnProp(n, "toJSON"))
    return !0;
  let e = Object.getPrototypeOf(n);
  for (; e && e !== Object.prototype; ) {
    if (v.hasOwnProp(e, "toJSON"))
      return !0;
    e = Object.getPrototypeOf(e);
  }
  return !1;
}
function F0(n, e) {
  const t = new Set(e.map((i) => String(i).toLowerCase())), r = [], s = (i) => {
    if (i === null || typeof i != "object" || v.isBuffer(i)) return i;
    if (r.indexOf(i) !== -1) return;
    i instanceof le && (i = i.toJSON()), r.push(i);
    let a;
    if (v.isArray(i))
      a = [], i.forEach((o, l) => {
        const c = s(o);
        v.isUndefined(c) || (a[l] = c);
      });
    else {
      if (!v.isPlainObject(i) && b0(i))
        return r.pop(), i;
      a = /* @__PURE__ */ Object.create(null);
      for (const [o, l] of Object.entries(i)) {
        const c = t.has(o.toLowerCase()) ? Tr : s(l);
        v.isUndefined(c) || (a[o] = c);
      }
    }
    return r.pop(), a;
  };
  return s(n);
}
function ns(n) {
  try {
    return String(n);
  } catch {
    return "";
  }
}
function S0(n) {
  return n.errors.map((t) => {
    try {
      return t && t.message ? ns(t.message) : ns(t);
    } catch {
      return "";
    }
  }).filter(Boolean).join("; ") || n.name || "AggregateError";
}
const B0 = `
Caused by: `, dn = /* @__PURE__ */ Symbol("causeStack");
function D0(n, e) {
  const t = v.hasOwnProp(n, dn) && n[dn];
  return t && e.endsWith(t) ? e.length - t.length : -1;
}
function R0(n, e) {
  try {
    const t = e && e.stack;
    if (typeof t != "string" || !t)
      return;
    const r = n.stack;
    if (typeof r != "string" || !r)
      return;
    const s = B0 + t;
    n.stack = r + s, Object.defineProperty(n, dn, { __proto__: null, value: s });
  } catch {
  }
}
let I = class Ii extends Error {
  static from(e, t, r, s, i, a) {
    let o = e.message;
    !o && v.isArray(e.errors) && e.errors.length && (o = S0(e));
    const l = new Ii(o, t || e.code, r, s, i);
    return Object.defineProperty(l, "cause", {
      __proto__: null,
      value: e,
      writable: !0,
      enumerable: !1,
      configurable: !0
    }), l.name = e.name, R0(l, e), e.status != null && l.status == null && (l.status = e.status), a && Object.assign(l, a), l;
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
  constructor(e, t, r, s, i) {
    super(e), Object.defineProperty(this, "message", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: e,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }), this.name = "AxiosError", this.isAxiosError = !0, t && (this.code = t), r && (this.config = r), s && (this.request = s), i && (this.response = i, this.status = i.status);
  }
  toJSON() {
    const e = this.config, t = e && v.hasOwnProp(e, "redact") ? e.redact : void 0, r = v.isArray(t) && t.length > 0 ? F0(e, t) : v.toJSONObject(e);
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
const O0 = null, Ni = 100;
function xn(n) {
  return v.isPlainObject(n) || v.isArray(n);
}
function Ui(n) {
  return v.endsWith(n, "[]") ? n.slice(0, -2) : n;
}
function Xr(n, e, t) {
  return n ? n.concat(e).map(function(s, i) {
    return s = Ui(s), !t && i ? "[" + s + "]" : s;
  }).join(t ? "." : "") : e;
}
function T0(n) {
  return v.isArray(n) && !n.some(xn);
}
const P0 = v.toFlatObject(v, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function Mr(n, e, t) {
  if (!v.isObject(n))
    throw new TypeError("target must be an object");
  e = e || new FormData();
  const r = (g, d) => {
    const x = v.getSafeProp(t, g);
    return v.isUndefined(x) ? d : x;
  }, s = r("metaTokens", !0), i = r("visitor") || E, a = r("dots", !1), o = r("indexes", !1), l = r("Blob") || typeof Blob < "u" && Blob, c = r("maxDepth", Ni), u = l && v.isSpecCompliantForm(e), h = [];
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
    return JSON.stringify(g, function(w, S) {
      if (!v.isObject(S))
        return S;
      for (; x.length && x[x.length - 1] !== this; )
        x.pop();
      return x.push(S), p(d + x.length - 1), S;
    });
  }
  function E(g, d, x) {
    let A = g;
    if (v.isReactNative(e) && v.isReactNativeBlob(g))
      return e.append(Xr(x, d, a), f(g)), !1;
    if (g && !x && typeof g == "object") {
      if (v.endsWith(d, "{}"))
        d = s ? d : d.slice(0, -2), g = m(g, 1);
      else if (v.isArray(g) && T0(g) || (v.isFileList(g) || v.endsWith(d, "[]")) && (A = v.toArray(g)))
        return d = Ui(d), A.forEach(function(S, b) {
          !(v.isUndefined(S) || S === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? Xr([d], b, a) : o === null ? d : d + "[]",
            f(S)
          );
        }), !1;
    }
    return xn(g) ? !0 : (e.append(Xr(x, d, a), f(g)), !1);
  }
  const y = Object.assign(P0, {
    defaultVisitor: E,
    convertValue: f,
    isVisitable: xn
  });
  function C(g, d, x = 0) {
    if (!v.isUndefined(g)) {
      if (p(x), h.indexOf(g) !== -1)
        throw new Error("Circular reference detected in " + d.join("."));
      h.push(g), v.forEach(g, function(w, S) {
        (!(v.isUndefined(w) || w === null) && i.call(e, w, v.isString(S) ? S.trim() : S, d, y)) === !0 && C(w, d ? d.concat(S) : [S], x + 1);
      }), h.pop();
    }
  }
  if (!v.isObject(n))
    throw new TypeError("data must be an object");
  return C(n), e;
}
function ss(n) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(n).replace(/[!'()~]|%20/g, function(r) {
    return e[r];
  });
}
function Sn(n, e) {
  this._pairs = [], n && Mr(n, this, e);
}
const qi = Sn.prototype;
qi.append = function(e, t) {
  this._pairs.push([e, t]);
};
qi.toString = function(e) {
  const t = e ? (r) => e.call(this, r, ss) : ss;
  return this._pairs.map(function(s) {
    return t(s[0]) + "=" + t(s[1]);
  }, "").join("&");
};
function L0(n) {
  return encodeURIComponent(n).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function Mi(n, e, t) {
  if (!e)
    return n;
  n = n || "";
  const r = v.isFunction(t) ? {
    serialize: t
  } : t, s = v.getSafeProp(r, "encode") || L0, i = v.getSafeProp(r, "serialize");
  let a;
  if (i ? a = i(e, r) : a = v.isURLSearchParams(e) ? e.toString() : new Sn(e, r).toString(s), a) {
    const o = n.indexOf("#");
    o !== -1 && (n = n.slice(0, o)), n += (n.indexOf("?") === -1 ? "?" : "&") + a;
  }
  return n;
}
const vt = /* @__PURE__ */ Symbol("internals");
function Hi(n) {
  return n ? n.length : 0;
}
function is(n) {
  if (n)
    for (; n.length && n[n.length - 1] === null; )
      n.pop();
}
function k0(n) {
  return typeof n == "string" && n !== "" && String(Number(n)) === n ? Number(n) : n;
}
function Ct(n, e) {
  const t = n.handlers, r = Hi(t);
  t !== e.handlersRef ? (e.handlersRef = t, e.handlerEntries.clear()) : r !== e.handlersLength && (r ? e.handlerEntries.forEach(function(i, a) {
    t[i.index] !== i.handler && e.handlerEntries.delete(a);
  }) : e.handlerEntries.clear()), e.handlersLength = r;
}
class as {
  constructor() {
    this.handlers = [], this[vt] = {
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
    const s = {
      fulfilled: e,
      rejected: t,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }, i = this[vt];
    this.handlers == null && (this.handlers = []), Ct(this, i);
    const a = i.nextId++;
    return this.handlers.push(s), i.handlerEntries.set(a, {
      handler: s,
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
    const t = this[vt];
    Ct(this, t);
    const r = k0(e), s = t.handlerEntries.get(r);
    if (s) {
      if (t.handlerEntries.delete(r), this.handlers[s.index] !== s.handler)
        return;
      this.handlers[s.index] = null, t.iterationDepth || (is(this.handlers), t.handlersLength = this.handlers.length);
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = [], Ct(this, this[vt]));
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
    const t = this[vt];
    Ct(this, t), t.iterationDepth++;
    try {
      v.forEach(this.handlers, function(s) {
        s !== null && e(s);
      });
    } finally {
      --t.iterationDepth || (Ct(this, t), is(this.handlers), t.handlersLength = Hi(this.handlers));
    }
  }
}
const Bn = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1,
  legacyInterceptorReqResOrdering: !0,
  advertiseZstdAcceptEncoding: !1,
  validateStatusUndefinedResolves: !0,
  encodeBasicAuthUsername: !1
}, I0 = typeof URLSearchParams < "u" ? URLSearchParams : Sn, N0 = typeof FormData < "u" ? FormData : null, U0 = typeof Blob < "u" ? Blob : null, q0 = {
  isBrowser: !0,
  classes: {
    URLSearchParams: I0,
    FormData: N0,
    Blob: U0
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Dn = typeof window < "u" && typeof document < "u", pn = typeof navigator == "object" && navigator || void 0, M0 = Dn && (!pn || ["ReactNative", "NativeScript", "NS"].indexOf(pn.product) < 0), H0 = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", $0 = Dn && window.location.href || "http://localhost", z0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Dn,
  hasStandardBrowserEnv: M0,
  hasStandardBrowserWebWorkerEnv: H0,
  navigator: pn,
  origin: $0
}, Symbol.toStringTag, { value: "Module" })), ae = {
  ...z0,
  ...q0
};
function j0(n, e) {
  return Mr(n, new ae.classes.URLSearchParams(), {
    visitor: function(t, r, s, i) {
      return ae.isNode && v.isBuffer(t) ? (this.append(r, t.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...e
  });
}
const os = Ni;
function $i(n) {
  if (n > os)
    throw new I(
      "FormData field is too deeply nested (" + n + " levels). Max depth: " + os,
      I.ERR_FORM_DATA_DEPTH_EXCEEDED
    );
}
function W0(n) {
  const e = [], t = /[^.[\]]+|\[([^.[\]]*)]/g;
  let r;
  for (; (r = t.exec(n)) !== null; )
    $i(e.length), e.push(r[0] === "[]" ? "" : r[1] || r[0]);
  return e;
}
function zi(n) {
  const e = {}, t = Object.keys(n);
  let r;
  const s = t.length;
  let i;
  for (r = 0; r < s; r++)
    i = t[r], e[i] = n[i];
  return e;
}
function ji(n) {
  if (!v.isArray(n)) return n;
  const e = Object.keys(n);
  return e.length !== n.length || e.some((t, r) => t !== String(r)) ? zi(n) : n;
}
function G0(n) {
  const e = [n];
  for (; e.length; ) {
    const t = e.pop();
    Object.keys(t).forEach((r) => {
      const s = t[r] = ji(t[r]);
      (v.isArray(s) || v.isPlainObject(s)) && e.push(s);
    });
  }
  return n;
}
function Wi(n) {
  function e(t, r, s, i) {
    $i(i);
    let a = t[i++];
    if (a === "__proto__") return !0;
    const o = Number.isFinite(+a), l = i >= t.length;
    return a = !a && v.isArray(s) ? s.length : a, l ? (v.hasOwnProp(s, a) ? (s[a] = ji(s[a]), s[a] = v.isArray(s[a]) ? s[a].concat(r) : [s[a], r]) : s[a] = r, !o) : ((!v.hasOwnProp(s, a) || !v.isObject(s[a])) && (s[a] = []), e(t, r, s[a], i) && v.isArray(s[a]) && (s[a] = zi(s[a])), !o);
  }
  if (v.isFormData(n) && v.isFunction(n.entries)) {
    const t = {};
    return v.forEachEntry(n, (r, s) => {
      e(W0(r), s, t, 0);
    }), G0(t);
  }
  return null;
}
const Gi = Object.freeze([
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
]), lt = (n, e) => n != null && v.hasOwnProp(n, e) ? n[e] : void 0;
function K0(n, e, t) {
  if (v.isString(n))
    try {
      return (e || JSON.parse)(n), v.trim(n);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (t || JSON.stringify)(n);
}
const Dt = {
  transitional: Bn,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function(e, t) {
      const r = t.getContentType() || "", s = r.indexOf("application/json") > -1, i = v.isObject(e);
      if (i && v.isHTMLForm(e) && (e = new FormData(e)), v.isFormData(e))
        return s ? JSON.stringify(Wi(e)) : e;
      if (v.isArrayBuffer(e) || v.isBuffer(e) || v.isStream(e) || v.isFile(e) || v.isBlob(e) || v.isReadableStream(e))
        return e;
      if (v.isArrayBufferView(e))
        return e.buffer;
      if (v.isURLSearchParams(e))
        return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
      let o;
      if (i) {
        const l = lt(this, "formSerializer");
        if (r.indexOf("application/x-www-form-urlencoded") > -1)
          return j0(e, l).toString();
        if ((o = v.isFileList(e)) || r.indexOf("multipart/form-data") > -1) {
          const c = lt(this, "env"), u = c && c.FormData;
          return Mr(
            o ? { "files[]": e } : e,
            u && new u(),
            l
          );
        }
      }
      return i || s ? (t.setContentType("application/json", !1), K0(e)) : e;
    }
  ],
  transformResponse: [
    function(e) {
      const t = lt(this, "transitional") || Dt.transitional, r = t && t.forcedJSONParsing, s = lt(this, "responseType"), i = s === "json";
      if (v.isResponse(e) || v.isReadableStream(e))
        return e;
      if (e && v.isString(e) && (r && !s || i)) {
        const o = !(t && t.silentJSONParsing) && i;
        try {
          return JSON.parse(e, lt(this, "parseReviver"));
        } catch (l) {
          if (o)
            throw l.name === "SyntaxError" ? I.from(l, I.ERR_BAD_RESPONSE, this, null, lt(this, "response")) : l;
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
    FormData: ae.classes.FormData,
    Blob: ae.classes.Blob
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
v.forEach(Gi, (n) => {
  Dt.headers[n] = {};
});
function Zr(n, e) {
  const t = this || Dt, r = e || t, s = le.from(r.headers);
  let i = r.data;
  return v.forEach(n, function(o) {
    i = o.call(t, i, s.normalize(), e ? e.status : void 0);
  }), s.normalize(), i;
}
function Ki(n) {
  return !!(n && n.__CANCEL__);
}
let Rt = class extends I {
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
function Xi(n, e, t) {
  const r = t.config.validateStatus;
  !t.status || !r || r(t.status) ? n(t) : e(new I(
    "Request failed with status code " + t.status,
    t.status >= 400 && t.status < 500 ? I.ERR_BAD_REQUEST : I.ERR_BAD_RESPONSE,
    t.config,
    t.request,
    t
  ));
}
const X0 = /[\t\n\r]/g;
function Zi(n) {
  if (typeof n != "string")
    return n;
  let e = 0;
  for (; e < n.length && n.charCodeAt(e) <= 32; )
    e++;
  return n.slice(e).replace(X0, "");
}
function Vr(n) {
  const e = /^([-+\w]{1,25}):(?:\/\/)?/.exec(n);
  return e && e[1].toLowerCase() || "";
}
const cs = (n) => {
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}, Vi = ae.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(n, e, t, r, s, i, a) {
      if (typeof document > "u") return;
      const o = [`${n}=${encodeURIComponent(e)}`];
      v.isNumber(t) && o.push(`expires=${new Date(t).toUTCString()}`), v.isString(r) && o.push(`path=${r}`), v.isString(s) && o.push(`domain=${s}`), i === !0 && o.push("secure"), v.isString(a) && o.push(`SameSite=${a}`), document.cookie = o.join("; ");
    },
    read(n) {
      if (typeof document > "u") return null;
      const e = document.cookie;
      if (!e) return null;
      const t = e.split(";");
      for (let r = 0; r < t.length; r++) {
        const s = t[r].replace(/^\s+/, ""), i = s.indexOf("=");
        if (i !== -1 && s.slice(0, i) === n)
          return cs(s.slice(i + 1));
      }
      return null;
    },
    async readAsync(n) {
      try {
        const e = typeof window < "u" && window.cookieStore;
        if (e && v.isFunction(e.get)) {
          const t = await e.get(n);
          return t ? cs(t.value) : null;
        }
      } catch {
      }
      return this.read(n);
    },
    remove(n) {
      this.write(n, "", Date.now() - 864e5, "/");
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
function Z0(n, e) {
  n = n || 10;
  const t = new Array(n), r = new Array(n);
  let s = 0, i = 0, a;
  return e = e !== void 0 ? e : 1e3, function(l) {
    const c = Date.now(), u = r[i];
    a || (a = c), t[s] = l, r[s] = c;
    let h = i, f = 0;
    for (; h !== s; )
      f += t[h++], h = h % n;
    if (s = (s + 1) % n, s === i && (i = (i + 1) % n), c - a < e)
      return;
    const p = u && c - u;
    return p ? Math.round(f * 1e3 / p) : void 0;
  };
}
function V0(n, e) {
  let t = 0, r = 1e3 / e, s, i;
  const a = (u, h = Date.now()) => {
    t = h, s = null, i && (clearTimeout(i), i = null), n(...u);
  };
  return [(...u) => {
    const h = Date.now(), f = h - t;
    f >= r ? a(u, h) : (s = u, i || (i = setTimeout(() => {
      i = null, a(s);
    }, r - f)));
  }, () => s && a(s), (...u) => a(u)];
}
const Pr = (n, e, t = 3) => {
  let r = 0;
  const s = Z0(50, 250);
  return V0((i) => {
    if (!i || !v.isNumber(i.loaded))
      return;
    const a = i.loaded, o = i.lengthComputable ? i.total : void 0, l = Math.max(0, o != null ? Math.min(a, o) : a), c = Math.max(0, l - r), u = s(c);
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
    n(h);
  }, t);
}, ls = (n, e) => {
  const t = n != null;
  return [
    (r) => e[0]({
      lengthComputable: t,
      total: n,
      loaded: r
    }),
    e[1]
  ];
}, us = (n, e = v.asap) => (...t) => e(() => n(...t)), Y0 = ae.hasStandardBrowserEnv ? /* @__PURE__ */ ((n) => (e) => (e = new URL(e, document.baseURI || ae.origin), n.protocol === e.protocol && n.host === e.host && n.port === e.port))(new URL(ae.origin)) : () => !0;
function J0(n) {
  return typeof n != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(n);
}
function Q0(n, e) {
  if (!e)
    return n;
  let t = n.length;
  for (; t > 0 && n.charCodeAt(t - 1) === 47; )
    t--;
  return n.slice(0, t) + "/" + e.replace(/^\/+/, "");
}
const ec = /^https?:(?!\/\/)/i;
function tc(n) {
  return n && n.replace(/(^|&)([^=&]*=)?[^&]+/g, (e, t, r = "") => `${t}${r}${Tr}`);
}
function rc(n) {
  const e = n.replace(/^(https?:\/{0,2})[^/?#]*@/i, `$1${Tr}@`), t = e.indexOf("#"), s = (t === -1 ? e : e.slice(0, t)).replace(
    /([?&][^=&#]*=)[^&#]*/g,
    `$1${Tr}`
  );
  return t === -1 ? s : `${s}#${tc(e.slice(t + 1))}`;
}
function fs(n, e) {
  if (typeof n == "string") {
    const t = Zi(n);
    if (ec.test(t))
      throw new I(
        `Invalid URL ${JSON.stringify(rc(t))}: missing "//" after protocol`,
        I.ERR_INVALID_URL,
        e
      );
  }
}
function Yi(n, e, t, r) {
  fs(e, r);
  let s = !J0(e);
  return n && (s || t === !1) ? (fs(n, r), Q0(n, e)) : e;
}
function nc(n) {
  const e = [{ value: n }], t = /* @__PURE__ */ new WeakSet(), r = /* @__PURE__ */ new WeakSet();
  for (; e.length; ) {
    const { value: s, done: i } = e.pop();
    if (!v.isPlainObject(s) && !v.isArray(s)) continue;
    if (i) {
      t.delete(s);
      continue;
    }
    if (t.has(s))
      throw new I(
        "Circular reference detected in params",
        I.ERR_BAD_OPTION_VALUE
      );
    if (r.has(s)) continue;
    r.add(s), t.add(s), e.push({ value: s, done: !0 });
    const a = Object.keys(s);
    Object.getOwnPropertySymbols && Object.getOwnPropertyDescriptor && Object.getOwnPropertySymbols(s).forEach((o) => {
      const l = Object.getOwnPropertyDescriptor(s, o);
      l && l.enumerable && a.push(o);
    }), a.forEach((o) => {
      if (o === "__proto__" || o === "constructor" || o === "prototype") {
        const l = Object.getOwnPropertyDescriptor(s, o);
        l && v.hasOwnProp(l, "value") && e.push({ value: l.value });
      } else
        e.push({ value: s[o] });
    });
  }
}
const hs = (n) => n instanceof le ? { ...n } : n, mn = (n) => Object.getOwnPropertySymbols && Object.getOwnPropertyDescriptor ? Object.keys(n).concat(
  Object.getOwnPropertySymbols(n).filter((e) => {
    const t = Object.getOwnPropertyDescriptor(n, e);
    return t && t.enumerable;
  })
) : Object.keys(n);
function sc(n, e) {
  const t = [], r = /* @__PURE__ */ new WeakMap(), s = {};
  function i(o, l) {
    if (!v.isPlainObject(l))
      return v.isArray(l) ? l.slice() : l;
    const c = v.isPlainObject(o) ? o : s;
    let u = r.get(l);
    if (u || (u = /* @__PURE__ */ new WeakMap(), r.set(l, u)), u.has(c)) return u.get(c);
    const h = {};
    return u.set(c, h), t.push({ base: c, source: l, result: h }), h;
  }
  const a = v.isUndefined(e) ? i(void 0, n) : i(n, e);
  for (; t.length; ) {
    const { base: o, source: l, result: c } = t.pop(), u = new Set(mn(o)), h = new Set(mn(l));
    (/* @__PURE__ */ new Set([...u, ...h])).forEach((p) => {
      if (p === "__proto__" || p === "constructor" || p === "prototype") return;
      const m = h.has(p), E = m ? l[p] : void 0, y = (!m || v.isPlainObject(E)) && u.has(p) ? o[p] : void 0;
      c[p] = m ? i(y, E) : i(void 0, y);
    });
  }
  return nc(a), a;
}
function Ke(n, e, t, r) {
  return v.isPlainObject(n) && v.isPlainObject(e) ? v.merge.call({ caseless: r }, n, e) : v.isPlainObject(e) ? v.merge({}, e) : v.isArray(e) ? e.slice() : e;
}
function Ji(n, e, t, r) {
  if (v.isUndefined(e)) {
    if (!v.isUndefined(n))
      return Ke(void 0, n, t, r);
  } else return Ke(n, e, t, r);
}
function Yr(n, e) {
  if (!v.isUndefined(e))
    return Ke(void 0, e);
}
function ee(n, e) {
  if (v.isUndefined(e)) {
    if (!v.isUndefined(n))
      return Ke(void 0, n);
  } else return Ke(void 0, e);
}
function ic(n, e, t) {
  const r = v.hasOwnProp(e, "transitional") ? e.transitional : void 0;
  if (!v.isUndefined(r))
    if (v.isPlainObject(r)) {
      if (v.hasOwnProp(r, t))
        return r[t];
    } else
      return;
  const s = v.hasOwnProp(n, "transitional") ? n.transitional : void 0;
  if (v.isPlainObject(s) && v.hasOwnProp(s, t))
    return s[t];
}
function gn(n, e, t, r, s) {
  if (v.hasOwnProp(s, t))
    return Ke(n, e);
  if (v.hasOwnProp(r, t))
    return Ke(void 0, n);
}
function ac(n, e, t) {
  return Ji(hs(n), hs(e), t, !0);
}
const oc = Object.freeze({
  __proto__: null,
  value: Object.prototype.hasOwnProperty,
  enumerable: !1,
  writable: !0,
  configurable: !0
}), ds = {
  url: Yr,
  method: Yr,
  data: Yr,
  baseURL: ee,
  transformRequest: ee,
  transformResponse: ee,
  params: sc,
  paramsSerializer: ee,
  timeout: ee,
  timeoutErrorMessage: ee,
  withCredentials: ee,
  withXSRFToken: ee,
  adapter: ee,
  responseType: ee,
  xsrfCookieName: ee,
  xsrfHeaderName: ee,
  onUploadProgress: ee,
  onDownloadProgress: ee,
  decompress: ee,
  maxContentLength: ee,
  maxBodyLength: ee,
  beforeRedirect: ee,
  transport: ee,
  httpAgent: ee,
  httpsAgent: ee,
  cancelToken: ee,
  socketPath: ee,
  allowedSocketPaths: ee,
  responseEncoding: ee,
  validateStatus: gn,
  headers: ac
};
function rt(n, e) {
  n = n || {}, e = e || {};
  const t = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(t, "hasOwnProperty", oc);
  const r = mn({ ...n, ...e });
  for (let s = 0, i = r.length; s < i; s++) {
    const a = r[s];
    if (a === "__proto__" || a === "constructor" || a === "prototype") continue;
    const o = v.hasOwnProp(ds, a) ? ds[a] : Ji, l = v.hasOwnProp(n, a) ? n[a] : void 0, c = v.hasOwnProp(e, a) ? e[a] : void 0, u = o === gn ? o(l, c, a, n, e) : o(l, c, a);
    v.isUndefined(u) && o !== gn || (t[a] = u);
  }
  return v.hasOwnProp(e, "validateStatus") && v.isUndefined(e.validateStatus) && ic(n, e, "validateStatusUndefinedResolves") === !1 && (v.hasOwnProp(n, "validateStatus") ? t.validateStatus = Ke(void 0, n.validateStatus) : delete t.validateStatus), t;
}
const cc = ["content-type", "content-length"];
function lc(n, e, t) {
  if (t !== "content-only") {
    n.set(e);
    return;
  }
  Object.entries(e || {}).forEach(([r, s]) => {
    cc.includes(r.toLowerCase()) && n.set(r, s);
  });
}
const xs = (n) => encodeURIComponent(n).replace(
  /%([0-9A-F]{2})/gi,
  (e, t) => String.fromCharCode(parseInt(t, 16))
), uc = (n) => Vi.read(n);
function Qi(n, e = uc) {
  const t = rt({}, n), r = (p) => v.hasOwnProp(t, p) ? t[p] : void 0, s = r("data");
  let i = r("withXSRFToken");
  const a = r("xsrfHeaderName"), o = r("xsrfCookieName");
  let l = r("headers");
  const c = r("auth"), u = r("baseURL"), h = r("allowAbsoluteUrls"), f = r("url");
  if (t.headers = l = le.from(l), t.url = Mi(
    Yi(u, f, h, t),
    r("params"),
    r("paramsSerializer")
  ), c) {
    const p = v.getSafeProp(c, "username") || "", m = v.getSafeProp(c, "password") || "", E = r("transitional"), y = E && v.hasOwnProp(E, "encodeBasicAuthUsername") && E.encodeBasicAuthUsername === !0;
    try {
      l.set(
        "Authorization",
        // Preserve legacy username bytes unless the caller opts in to UTF-8.
        "Basic " + btoa(
          (y ? xs(p) : p) + ":" + (m ? xs(m) : "")
        )
      );
    } catch (C) {
      throw I.from(C, I.ERR_BAD_OPTION_VALUE, n);
    }
  }
  if (v.isFormData(s)) {
    const p = v.getSafeProp(s, "getHeaders");
    ae.hasStandardBrowserEnv || ae.hasStandardBrowserWebWorkerEnv || v.isReactNative(s) ? l.setContentType(void 0) : v.isFunction(p) && lc(l, p.call(s), r("formDataHeaderPolicy"));
  }
  if (ae.hasStandardBrowserEnv && (v.isFunction(i) && (i = i(t)), i === !0 || i == null && Y0(t.url))) {
    const m = a && o && e(o);
    m && l.set(a, m);
  }
  return t;
}
const fc = typeof XMLHttpRequest < "u", hc = fc && function(n) {
  return new Promise(function(t, r) {
    let s;
    try {
      const b = ae.hasStandardBrowserEnv && typeof window < "u" && window.cookieStore;
      s = b && v.isFunction(b.get);
    } catch {
    }
    let i;
    const a = Qi(
      n,
      s ? (b) => (i = b, null) : void 0
    );
    let o = a.data;
    const l = le.from(a.headers).normalize();
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
      if (x.status === 0 && (Vr(Zi(a.url)) || Vr(ae.origin)) !== "file" && !(x.responseURL && x.responseURL.startsWith("file:"))) {
        r(new I("Request aborted", I.ECONNABORTED, n, x)), d(), x = null;
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
      const R = le.from(
        "getAllResponseHeaders" in x && x.getAllResponseHeaders()
      ), F = {
        data: !c || c === "text" || c === "json" ? x.responseText : x.response,
        status: x.status,
        statusText: x.statusText,
        headers: R,
        config: n,
        request: x
      };
      Xi(
        function(D) {
          t(D), d();
        },
        function(D) {
          r(D), d();
        },
        F
      ), x = null;
    }
    if ("onloadend" in x ? x.onloadend = A : x.onreadystatechange = function() {
      !x || x.readyState !== 4 || x.status === 0 && !(x.responseURL && x.responseURL.startsWith("file:")) || setTimeout(A);
    }, x.onabort = function() {
      x && (r(new I("Request aborted", I.ECONNABORTED, n, x)), d(), x = null);
    }, x.onerror = function(R) {
      const _ = R && R.message ? R.message : "Network Error", F = new I(_, I.ERR_NETWORK, n, x);
      F.event = R || null, r(F), d(), x = null;
    }, x.ontimeout = function() {
      if (!x) return;
      let R = a.timeout ? "timeout of " + a.timeout + "ms exceeded" : "timeout exceeded";
      const _ = a.transitional || Bn;
      a.timeoutErrorMessage && (R = a.timeoutErrorMessage), r(
        new I(
          R,
          _.clarifyTimeoutError ? I.ETIMEDOUT : I.ECONNABORTED,
          n,
          x
        )
      ), d(), x = null;
    }, o === void 0 && l.setContentType(null), v.isUndefined(a.withCredentials) || (x.withCredentials = !!a.withCredentials), c && c !== "json" && (x.responseType = a.responseType), h && ([E, C, g] = Pr(
      h,
      !0
    ), x.addEventListener("progress", E)), u && x.upload && ([m, y] = Pr(u), x.upload.addEventListener("progress", m), x.upload.addEventListener("loadend", y)), a.cancelToken || a.signal) {
      if (f = (b) => {
        if (!x)
          return;
        r(!b || b.type ? new Rt(null, n, x) : b);
        const R = x;
        d(), x = null, R.abort();
      }, a.cancelToken && a.cancelToken.subscribe(f), !x) return;
      a.signal && (a.signal.aborted ? f() : a.signal.addEventListener("abort", f));
    }
    if (!x) return;
    const w = Vr(a.url);
    if (w && !ae.protocols.includes(w)) {
      r(
        new I(
          "Unsupported protocol " + w + ":",
          I.ERR_BAD_REQUEST,
          n
        )
      ), d();
      return;
    }
    const S = () => {
      x && ("setRequestHeader" in x && v.forEach(
        ki(l),
        function(R, _) {
          x.setRequestHeader(_, R);
        }
      ), x.send(o || null));
    };
    if (i) {
      const b = typeof performance < "u" && v.isFunction(performance.now) ? () => performance.now() : Date.now, R = x.timeout > 0 ? b() + Number(x.timeout) : void 0, _ = () => {
        if (!x) return;
        const F = x;
        F.ontimeout(), F.abort();
      };
      if (R !== void 0) {
        const F = () => {
          const B = R - b();
          B > 0 ? p = setTimeout(F, Math.min(B, 2147483647)) : _();
        };
        F();
      }
      Vi.readAsync(i).then((F) => {
        if (x) {
          if (R !== void 0 && b() >= R) {
            _();
            return;
          }
          if (F) {
            const B = v.hasOwnProp(a, "xsrfHeaderName") && a.xsrfHeaderName;
            l.set(B, F);
          }
          S();
        }
      }).catch((F) => {
        x && (r(I.from(F, null, n, x)), d(), x = null);
      });
    } else
      S();
  });
}, dc = (n, e) => {
  if (n = n ? n.filter(Boolean) : [], !e && !n.length)
    return;
  const t = new AbortController();
  let r = !1;
  const s = function(l) {
    if (!r) {
      r = !0, a();
      const c = l instanceof Error ? l : this.reason;
      t.abort(
        c instanceof I ? c : new Rt(c instanceof Error ? c.message : c)
      );
    }
  };
  let i = e && setTimeout(() => {
    i = null, s(new I(`timeout of ${e}ms exceeded`, I.ETIMEDOUT));
  }, e);
  const a = () => {
    n && (i && clearTimeout(i), i = null, n.forEach((l) => {
      const c = v.getSafeProp(l, "unsubscribe");
      v.isFunction(c) ? c.call(l, s) : l.removeEventListener("abort", s);
    }), n = null);
  };
  n.forEach((l) => {
    if (!r) {
      if (l.aborted) {
        s.call(l);
        return;
      }
      l.addEventListener("abort", s, { once: !0 });
    }
  });
  const { signal: o } = t;
  return o.unsubscribe = () => v.asap(a), o;
}, xc = function* (n, e) {
  let t = n.byteLength;
  if (t < e) {
    yield n;
    return;
  }
  let r = 0, s;
  for (; r < t; )
    s = r + e, yield n.slice(r, s), r = s;
}, pc = async function* (n, e) {
  for await (const t of mc(n))
    yield* xc(t, e);
}, mc = async function* (n) {
  if (n[Symbol.asyncIterator]) {
    yield* n;
    return;
  }
  const e = n.getReader();
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
}, ps = (n, e, t, r) => {
  const s = pc(n, e);
  let i = 0, a, o = (l) => {
    a || (a = !0, r && r(l));
  };
  return new ReadableStream(
    {
      async pull(l) {
        try {
          const { done: c, value: u } = await s.next();
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
        return o(l), s.return();
      }
    },
    {
      highWaterMark: 2
    }
  );
}, Ge = `\r
`, ms = (n) => String(n).replace(/\r\n|\r|\n/g, Ge), gs = (n) => String(n).replace(
  /[\r\n"]/g,
  (e) => e === "\r" ? "%0D" : e === `
` ? "%0A" : "%22"
), wt = (n, e) => {
  let t = 0;
  for (let r = 0; r < n.length; r++) {
    const s = n.charCodeAt(r);
    e && (s === 13 || s === 10) ? (s === 13 && n.charCodeAt(r + 1) === 10 && r++, t += 2) : s < 128 ? t++ : s < 2048 ? t += 2 : s >= 55296 && s <= 56319 && n.charCodeAt(r + 1) >= 56320 && n.charCodeAt(r + 1) <= 57343 ? (t += 4, r++) : t += 3;
  }
  return t;
};
class zt extends TypeError {
  constructor(e, t) {
    super(e), this.name = "FormDataError", this.reason = t;
  }
}
function gc(n, e, t, r, s) {
  if (!v.isFunction(e))
    throw new zt("Blob is not supported", "blob");
  if (!v.isString(s) || !/^[A-Za-z0-9'()+_,./:=? -]{1,70}$/.test(s) || / $/.test(s))
    throw new zt("Invalid multipart boundary", "boundary");
  const i = "--" + s + "--" + Ge;
  let a = i.length;
  const o = [], l = (u) => {
    if (a + u > t) throw r();
  };
  l(0);
  for (const [u, h] of n) {
    const f = v.isString(h), p = f ? wt(h, !0) : h.size;
    if (!Number.isFinite(p) || p < 0)
      throw new zt("Unsupported FormData part size", "part");
    l(
      p + wt(u, !0) + (!f && h.name ? wt(h.name, !1) : 0) + (!f && h.type ? wt(h.type, !1) : 0)
    );
    let m = "--" + s + Ge + 'Content-Disposition: form-data; name="' + gs(ms(u)) + '"';
    f || (m += '; filename="' + gs(v.isString(h.name) ? h.name : "blob") + '"' + Ge + "Content-Type: " + String(h.type || "application/octet-stream").replace(/[\r\n]/g, "")), m += Ge + Ge;
    const E = wt(m, !1) + p + Ge.length;
    l(E), a += E, o.push({ header: m, value: h, isString: f });
  }
  const c = [];
  for (const u of o)
    c.push(u.header, u.isString ? ms(u.value) : u.value, Ge);
  return c.push(i), new e(c, { type: "multipart/form-data; boundary=" + s });
}
function yc(n, e, t, r, s) {
  if (!v.isFunction(e))
    throw new I("Blob is not supported", I.ERR_NOT_SUPPORT);
  if (s === void 0)
    if (v.isFunction(ae.generateString))
      s = "axios-" + ae.generateString(36, "0123456789abcdef");
    else {
      const i = v.global.crypto;
      if (!i || !v.isFunction(i.getRandomValues))
        throw new I("Random byte generation is not supported", I.ERR_NOT_SUPPORT);
      const a = new Uint8Array(18);
      i.getRandomValues(a), s = "axios-" + Array.from(a, (o) => ("0" + o.toString(16)).slice(-2)).join("");
    }
  try {
    return gc(n, e, t, r, s);
  } catch (i) {
    if (i instanceof zt) {
      const a = i.reason === "boundary" ? I.ERR_BAD_OPTION_VALUE : I.ERR_BAD_REQUEST;
      throw new I(i.message, a);
    }
    throw i;
  }
}
const ys = (n) => n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102, ea = (n, e, t) => e + 2 < t && ys(n.charCodeAt(e + 1)) && ys(n.charCodeAt(e + 2)), Es = (n) => n <= 57 ? n - 48 : (n & 223) - 55, Ec = (n) => n >= 65 && n <= 90 || // A-Z
n >= 97 && n <= 122 || // a-z
n >= 48 && n <= 57 || // 0-9
n === 43 || // +
n === 47 || // /
n === 45 || // - (base64url)
n === 95, vc = (n) => n === 9 || n === 10 || n === 12 || n === 13 || n === 32, Cc = (n) => {
  const e = Math.floor(n / 4), t = n % 4;
  return e * 3 + (t === 2 ? 1 : t === 3 ? 2 : 0);
}, wc = (n) => {
  const e = n.length;
  let t = 0;
  return e > 0 && n.charCodeAt(e - 1) === 61 && (t++, e > 1 && n.charCodeAt(e - 2) === 61 && t++), Math.floor((e - t) * 3 / 4);
}, _c = (n) => {
  const e = n.length;
  let t = 0, r = 0, s = !1;
  for (let i = 0; i < e; i++) {
    let a = n.charCodeAt(i);
    if (a === 37 && ea(n, i, e) && (a = Es(n.charCodeAt(i + 1)) * 16 + Es(n.charCodeAt(i + 2)), i += 2), !vc(a)) {
      if (a === 61) {
        r++;
        continue;
      }
      if (!Ec(a) || r > 0) {
        s = !0;
        continue;
      }
      t++;
    }
  }
  return s || r > 2 || r > 0 && (t + r) % 4 !== 0 || t % 4 === 1 ? wc(n) : Cc(t);
}, Ac = (n, e, t) => {
  if (!n || typeof n != "string" || !/^data:/i.test(n)) return 0;
  const r = n.indexOf(",");
  if (r < 0) return 0;
  const s = n.slice(5, r), i = n.slice(r + 1);
  if (t.test(s))
    return e(i);
  let o = 0;
  for (let l = 0, c = i.length; l < c; l++) {
    const u = i.charCodeAt(l);
    if (u === 37 && ea(i, l, c))
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
function bc(n) {
  const e = typeof n == "string" ? n.indexOf("#") : -1;
  return Ac(
    e === -1 ? n : n.slice(0, e),
    _c,
    /; *base64[\t\n\f\r ]*$/i
  );
}
const Rn = "1.21.0", vs = 64 * 1024, Cs = {
  cache: "default",
  redirect: "follow",
  referrer: "about:client",
  referrerPolicy: "",
  mode: "cors",
  integrity: "",
  keepalive: !1,
  priority: "auto",
  window: null
}, { isFunction: It } = v, Fc = (n) => encodeURIComponent(n).replace(
  /%([0-9A-F]{2})/gi,
  (e, t) => String.fromCharCode(parseInt(t, 16))
), ws = (n) => {
  if (!v.isString(n))
    return n;
  try {
    return decodeURIComponent(n);
  } catch {
    return n;
  }
}, Nt = (n, ...e) => {
  try {
    return !!n(...e);
  } catch {
    return !1;
  }
}, Sc = (n) => {
  const e = n.indexOf("://");
  let t = n;
  return e !== -1 && (t = t.slice(e + 3)), t.includes("@") || t.includes(":");
}, Bc = (n) => {
  const e = v.global !== void 0 && v.global !== null ? v.global : globalThis, { ReadableStream: t, TextEncoder: r } = e;
  n = v.merge.call(
    {
      skipUndefined: !0
    },
    {
      Request: e.Request,
      Response: e.Response,
      Blob: e.Blob
    },
    n
  );
  const s = v.hasOwnProp(n, "fetch") ? n.fetch : void 0, { Request: i, Response: a, Blob: o } = n, l = s ? It(s) : typeof fetch == "function", c = It(i), u = It(a);
  if (!l)
    return !1;
  const h = l && It(t), f = l && (typeof r == "function" ? /* @__PURE__ */ ((d) => (x) => d.encode(x))(new r()) : async (d) => new Uint8Array(await new i(d).arrayBuffer())), p = c && h && Nt(() => {
    let d = !1;
    const x = new i(ae.origin, {
      body: new t(),
      method: "POST",
      get duplex() {
        return d = !0, "half";
      }
    }), A = x.headers.has("Content-Type");
    return x.body != null && x.body.cancel(), d && !A;
  }), m = u && h && Nt(() => v.isReadableStream(new a("").body)), E = Object.assign(/* @__PURE__ */ Object.create(null), Cs);
  c && !Nt(() => new i(ae.origin, E)) && (delete E.cache, Nt(() => new i(ae.origin, E)) || (E.cache = Cs.cache));
  const y = {
    stream: m && ((d) => d.body)
  };
  l && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((d) => {
    !y[d] && (y[d] = (x, A) => {
      let w = x && x[d];
      if (w)
        return w.call(x);
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
      data: w,
      signal: S,
      cancelToken: b,
      timeout: R,
      onDownloadProgress: _,
      onUploadProgress: F,
      responseType: B,
      headers: D,
      withCredentials: N = "same-origin",
      fetchOptions: U,
      maxContentLength: q,
      maxBodyLength: Z,
      maxRedirects: V
    } = Qi(d);
    const G = v.isNumber(q) && q > -1, j = v.isNumber(Z) && Z > -1, T = ($) => v.hasOwnProp(d, $) ? d[$] : void 0;
    let L = s || fetch;
    B = B ? (B + "").toLowerCase() : "text";
    let P = dc(
      [S, b && b.toAbortSignal()],
      R
    ), O = null;
    const K = P && P.unsubscribe && (() => {
      P.unsubscribe();
    });
    let W, ie = null, H = null;
    const Ie = () => new I(
      "Request body larger than maxBodyLength limit",
      I.ERR_BAD_REQUEST,
      d,
      O
    );
    try {
      let $;
      const ge = T("auth");
      if (ge) {
        const M = v.getSafeProp(ge, "username") || "", ce = v.getSafeProp(ge, "password") || "";
        $ = {
          username: M,
          password: ce
        };
      }
      let oe;
      if (Sc(x)) {
        if (oe = new URL(x, ae.origin), !$ && (oe.username || oe.password)) {
          const M = ws(oe.username), ce = ws(oe.password);
          $ = {
            username: M,
            password: ce
          };
        }
        (oe.username || oe.password) && (oe.username = "", oe.password = "", x = oe.href);
      }
      if ($ && (D.delete("authorization"), D.set(
        "Authorization",
        "Basic " + btoa(Fc(($.username || "") + ":" + ($.password || "")))
      )), G && oe && oe.protocol === "data:" && bc(oe.href) > q)
        throw new I(
          "maxContentLength size of " + q + " exceeded",
          I.ERR_BAD_RESPONSE,
          d,
          O
        );
      const ye = v.isSpecCompliantForm(w) && le.from(T("headers")).getContentType();
      let ue;
      if (v.isString(ye) && /^multipart\/form-data(?:\s*;|$)/i.test(ye.trim())) {
        const M = le.parseParameters(ye);
        v.hasOwnProp(M, "boundary") && (ue = M.boundary);
      }
      if (v.isSpecCompliantForm(w) && A !== "get" && A !== "head" && (j || F && p || ue !== void 0) && (w = yc(
        w,
        o,
        j ? Z : 1 / 0,
        Ie,
        ue
      ), D.setContentType(ue === void 0 ? w.type : ye), W = w.size), j && A !== "get" && A !== "head") {
        const M = await C(w);
        if (typeof M == "number" && isFinite(M) && (W = M, M > Z))
          throw Ie();
      }
      const Ne = j && (v.isReadableStream(w) || v.isStream(w)), He = (M, ce, Ae) => ps(
        M,
        vs,
        (be) => {
          if (j && be > Z)
            throw ie = Ie();
          ce && ce(be);
        },
        Ae
      );
      if (p && A !== "get" && A !== "head" && (F || Ne)) {
        if (W = W ?? await g(D, w), W !== 0 || Ne) {
          let M = new i(x, {
            method: "POST",
            body: w,
            duplex: "half"
          }), ce;
          if (v.isFormData(w) && (ce = M.headers.get("content-type")) && D.setContentType(ce), M.body) {
            const [Ae, be] = F && ls(
              W,
              Pr(us(F))
            ) || [];
            w = He(M.body, Ae, be);
          }
        }
      } else if (Ne && !c && h && A !== "get" && A !== "head")
        w = He(w);
      else if (Ne && c && !p && A !== "get" && A !== "head")
        throw new I(
          "Stream request bodies are not supported by the current fetch implementation",
          I.ERR_NOT_SUPPORT,
          d,
          O
        );
      v.isString(N) || (N = N ? "include" : "omit");
      const it = c && "credentials" in i.prototype;
      if (v.isFormData(w)) {
        const M = D.getContentType();
        M && /^multipart\/form-data/i.test(M) && !/boundary=/i.test(M) && D.delete("content-type");
      }
      D.set("User-Agent", "axios/" + Rn, !1);
      const pe = U == null ? U : Object.assign(/* @__PURE__ */ Object.create(null), U);
      pe && (delete pe.body, delete pe.headers, delete pe.method, delete pe.signal, delete pe.duplex, delete pe.credentials);
      const _e = Object.assign(/* @__PURE__ */ Object.create(null), pe, {
        signal: P,
        method: A.toUpperCase(),
        headers: ki(D.normalize()),
        body: w,
        duplex: "half",
        credentials: it ? N : void 0
      });
      c && (v.forEach(E, (M, ce) => {
        _e[ce] === void 0 && (_e[ce] = M);
      }), _e.signal === void 0 && (_e.signal = null), _e.body === void 0 && (_e.body = null)), V === 0 && (_e.redirect = "manual", pe && (pe.redirect = "manual")), O = c && new i(x, _e);
      let ve = await (c ? L(O, pe) : L(x, _e));
      const Ce = le.from(ve.headers);
      if (G) {
        const M = v.toFiniteNumber(Ce.getContentLength());
        if (M != null && M > q)
          throw new I(
            "maxContentLength size of " + q + " exceeded",
            I.ERR_BAD_RESPONSE,
            d,
            O
          );
      }
      const Ee = m && (B === "stream" || B === "response");
      if (m && ve.body && (_ || G || Ee && K)) {
        const M = {};
        ["status", "statusText", "headers"].forEach(($e) => {
          M[$e] = ve[$e];
        });
        const ce = v.toFiniteNumber(Ce.getContentLength()), [Ae, be] = _ && ls(
          ce,
          Pr(us(_), !0)
        ) || [];
        let Ot = 0;
        const Tt = ($e) => {
          if (G && (Ot = $e, Ot > q))
            throw H = new I(
              "maxContentLength size of " + q + " exceeded",
              I.ERR_BAD_RESPONSE,
              d,
              O
            );
          Ae && Ae($e);
        };
        ve = new a(
          ps(ve.body, vs, Tt, () => {
            be && be(), K && K();
          }),
          M
        );
      }
      B = B || "text";
      let fe = await y[v.findKey(y, B) || "text"](
        ve,
        d
      );
      if (G && !m && !Ee) {
        let M;
        if (fe != null && (typeof fe.byteLength == "number" ? M = fe.byteLength : typeof fe.size == "number" ? M = fe.size : typeof fe == "string" && (M = typeof r == "function" ? new r().encode(fe).byteLength : fe.length)), typeof M == "number" && M > q)
          throw new I(
            "maxContentLength size of " + q + " exceeded",
            I.ERR_BAD_RESPONSE,
            d,
            O
          );
      }
      return !Ee && K && K(), await new Promise((M, ce) => {
        Xi(M, ce, {
          data: fe,
          headers: le.from(ve.headers),
          status: ve.status,
          statusText: ve.statusText,
          config: d,
          request: O
        });
      });
    } catch ($) {
      if (K && K(), P && P.aborted && P.reason instanceof I) {
        const ge = P.reason;
        throw ge.config = d, O && (ge.request = O), $ !== ge && Object.defineProperty(ge, "cause", {
          __proto__: null,
          value: $,
          writable: !0,
          enumerable: !1,
          configurable: !0
        }), ge;
      }
      if (ie)
        throw O && !ie.request && (ie.request = O), ie;
      if (H)
        throw H;
      if ($ instanceof I)
        throw O && !$.request && ($.request = O), $;
      if ($ && $.name === "TypeError" && /Load failed|fetch/i.test($.message)) {
        const ge = new I(
          "Network Error",
          I.ERR_NETWORK,
          d,
          O,
          $ && $.response
        );
        throw Object.defineProperty(ge, "cause", {
          __proto__: null,
          value: $.cause || $,
          writable: !0,
          enumerable: !1,
          configurable: !0
        }), ge;
      }
      throw I.from($, $ && $.code, d, O, $ && $.response);
    }
  };
}, Dc = /* @__PURE__ */ new Map(), ta = (n) => {
  const e = /* @__PURE__ */ Object.create(null), t = n && v.hasOwnProp(n, "env") && n.env;
  ["fetch", "Request", "Response", "Blob"].forEach((p) => {
    t && v.hasOwnProp(t, p) && (e[p] = t[p]);
  });
  const { fetch: r, Request: s, Response: i, Blob: a } = e, o = [s, i, r, a];
  let l = o.length, c = l, u, h, f = Dc;
  for (; c--; )
    u = o[c], h = f.get(u), h === void 0 && f.set(u, h = c ? /* @__PURE__ */ new Map() : Bc(e)), f = h;
  return h;
};
ta();
const On = {
  http: O0,
  xhr: hc,
  fetch: {
    get: ta
  }
};
v.forEach(On, (n, e) => {
  if (n) {
    try {
      Object.defineProperty(n, "name", { __proto__: null, value: e });
    } catch {
    }
    Object.defineProperty(n, "adapterName", { __proto__: null, value: e });
  }
});
const _s = (n) => `- ${n}`, Rc = (n) => v.isFunction(n) || n === null || n === !1;
function Oc(n, e) {
  n = v.isArray(n) ? n : [n];
  const { length: t } = n;
  let r, s;
  const i = {};
  for (let a = 0; a < t; a++) {
    r = n[a];
    let o;
    if (s = r, !Rc(r) && (s = On[(o = String(r)).toLowerCase()], s === void 0))
      throw new I(`Unknown adapter '${o}'`);
    if (s && (v.isFunction(s) || (s = s.get(e))))
      break;
    i[o || "#" + a] = s;
  }
  if (!s) {
    const a = Object.entries(i).map(
      ([l, c]) => `adapter ${l} ` + (c === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let o = t ? a.length > 1 ? `since :
` + a.map(_s).join(`
`) : " " + _s(a[0]) : "as no adapter specified";
    throw new I(
      "There is no suitable adapter to dispatch the request " + o,
      I.ERR_NOT_SUPPORT
    );
  }
  return s;
}
const ra = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Oc,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: On
};
function Jr(n) {
  if (n.cancelToken && n.cancelToken.throwIfRequested(), n.signal && n.signal.aborted)
    throw new Rt(null, n);
}
function As(n) {
  return Math.max(0, Date.now() - n);
}
function Qr(n) {
  const e = v.toSafeFlatObject(n);
  Jr(e), e.headers = le.from(v.getSafeProp(e, "headers")), e.data = Zr.call(e, e.transformRequest), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1);
  const t = ra.getAdapter(e.adapter || Dt.adapter, e), r = Date.now();
  return t(e).then(
    function(i) {
      Jr(e), i.duration = As(r), e.response = i;
      try {
        i.data = Zr.call(e, e.transformResponse, i);
      } finally {
        delete e.response;
      }
      return i.headers = le.from(i.headers), i;
    },
    function(i) {
      if (!Ki(i) && (Jr(e), i && i.response)) {
        i.response.duration = As(r), e.response = i.response;
        try {
          i.response.data = Zr.call(
            e,
            e.transformResponse,
            i.response
          );
        } finally {
          delete e.response;
        }
        i.response.headers = le.from(i.response.headers);
      }
      return Promise.reject(i);
    }
  );
}
const Hr = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((n, e) => {
  Hr[n] = function(r) {
    return typeof r === n || "a" + (e < 1 ? "n " : " ") + n;
  };
});
const bs = {};
Hr.transitional = function(e, t, r) {
  function s(i, a) {
    return "[Axios v" + Rn + "] Transitional option '" + i + "'" + a + (r ? ". " + r : "");
  }
  return (i, a, o) => {
    if (e === !1)
      throw new I(
        s(a, " has been removed" + (t ? " in " + t : "")),
        I.ERR_DEPRECATED
      );
    return t && !bs[a] && (bs[a] = !0, console.warn(
      s(
        a,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(i, a, o) : !0;
  };
};
Hr.spelling = function(e) {
  return (t, r) => (console.warn(`${r} is likely a misspelling of ${e}`), !0);
};
function Tc(n, e, t) {
  if (typeof n != "object" || n === null)
    throw new I("options must be an object", I.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(n);
  let s = r.length;
  for (; s-- > 0; ) {
    const i = r[s], a = Object.prototype.hasOwnProperty.call(e, i) ? e[i] : void 0;
    if (a) {
      const o = n[i], l = o === void 0 || a(o, i, n);
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
const jt = {
  assertOptions: Tc,
  validators: Hr
}, he = jt.validators, en = (n) => {
  if (n == null || v.isPlainObject(n) || n instanceof le)
    return !0;
  try {
    return v.isObject(n) && v.getSafeProp(n, Symbol.toStringTag) === "AxiosHeaders" && [
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
    ].every((e) => v.isFunction(v.getSafeProp(n, e)));
  } catch {
    return !1;
  }
};
let Qe = class {
  constructor(e) {
    this.defaults = e || {}, this.interceptors = {
      request: new as(),
      response: new as()
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
          let s = {};
          Error.captureStackTrace ? Error.captureStackTrace(s) : s = new Error();
          const i = s.stack;
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
`, o + 1), c = l === -1 ? a : a.slice(l + 1), u = String(r.stack), h = D0(r, u), f = h === -1 ? u : u.slice(0, h), p = h === -1 ? "" : u.slice(h);
            f.endsWith(c) || (r.stack = f + `
` + a + p);
          }
        } catch {
        }
      throw r;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = rt(this.defaults, t);
    const { transitional: r, paramsSerializer: s, headers: i } = t;
    r !== void 0 && jt.assertOptions(
      r,
      {
        silentJSONParsing: he.transitional(he.boolean),
        forcedJSONParsing: he.transitional(he.boolean),
        clarifyTimeoutError: he.transitional(he.boolean),
        legacyInterceptorReqResOrdering: he.transitional(he.boolean),
        advertiseZstdAcceptEncoding: he.transitional(he.boolean),
        validateStatusUndefinedResolves: he.transitional(he.boolean),
        encodeBasicAuthUsername: he.transitional(he.boolean)
      },
      !1
    ), s != null && (v.isFunction(s) ? t.paramsSerializer = {
      serialize: s
    } : jt.assertOptions(
      s,
      {
        encode: he.function,
        serialize: he.function
      },
      !0
    )), t.allowAbsoluteUrls !== void 0 || (v.hasOwnProp(this.defaults, "allowAbsoluteUrls") && this.defaults.allowAbsoluteUrls !== void 0 ? t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : t.allowAbsoluteUrls = !0), jt.assertOptions(
      t,
      {
        baseUrl: he.spelling("baseURL"),
        withXsrfToken: he.spelling("withXSRFToken")
      },
      !0
    ), t.method = (v.getSafeProp(t, "method") || v.getSafeProp(this.defaults, "method") || "get").toLowerCase();
    const a = v.getSafeProp(i, "common"), o = v.getSafeProp(i, t.method), l = i && v.merge(
      en(a) ? a : void 0,
      en(o) ? o : void 0
    );
    i && v.forEach(Gi.concat("common"), (y) => {
      en(v.getSafeProp(i, y)) && delete i[y];
    }), t.headers = le.concat(l, i);
    const c = [];
    let u = !0;
    this.interceptors.request.forEach(function(C) {
      if (typeof C.runWhen == "function" && C.runWhen(t) === !1)
        return;
      u = u && C.synchronous;
      const g = t.transitional || Bn;
      g && g.legacyInterceptorReqResOrdering ? c.unshift(C.fulfilled, C.rejected) : c.push(C.fulfilled, C.rejected);
    });
    const h = [];
    this.interceptors.response.forEach(function(C) {
      h.push(C.fulfilled, C.rejected);
    });
    let f, p = 0, m;
    if (!u) {
      const y = [Qr.bind(this), void 0];
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
            () => Qr.call(this, E)
          ));
        } catch (d) {
          f = Promise.reject(d);
        }
        break;
      }
    }
    if (!f)
      try {
        f = Qr.call(this, E);
      } catch (y) {
        f = Promise.reject(y);
      }
    for (p = 0, m = h.length; p < m; )
      f = f.then(h[p++], h[p++]);
    return f;
  }
  getUri(e) {
    e = rt(this.defaults, e);
    const t = Yi(e.baseURL, e.url, e.allowAbsoluteUrls, e);
    return Mi(t, e.params, e.paramsSerializer);
  }
};
v.forEach(["delete", "get", "head", "options"], function(e) {
  Qe.prototype[e] = async function(t, r) {
    return this.request(
      rt(r || {}, {
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
        rt(o || {}, {
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
  Qe.prototype[e] = t(), e !== "query" && (Qe.prototype[e + "Form"] = t(!0));
});
let Pc = class na {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(i) {
      t = i;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0; )
        r._listeners[i](s);
      r._listeners = null;
    }), this.promise.then = (s) => {
      let i;
      const a = new Promise((o) => {
        r.subscribe(o), i = o;
      }).then(s);
      return a.cancel = function() {
        r.unsubscribe(i);
      }, a;
    }, e(function(i, a, o) {
      r.reason || (r.reason = new Rt(i, a, o), t(r.reason));
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
      token: new na(function(s) {
        e = s;
      }),
      cancel: e
    };
  }
};
function Lc(n) {
  return function(t) {
    return n.apply(null, t);
  };
}
function kc(n) {
  return v.isObject(n) && n.isAxiosError === !0;
}
const Wt = {
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
Object.entries(Wt).forEach(([n, e]) => {
  Wt[e] === void 0 && (Wt[e] = n);
});
function sa(n) {
  const e = new Qe(n), t = Si(Qe.prototype.request, e);
  return v.extend(t, Qe.prototype, e, { allOwnKeys: !0 }), v.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(s) {
    return sa(rt(n, s));
  }, t;
}
const se = sa(Dt);
se.Axios = Qe;
se.CanceledError = Rt;
se.CancelToken = Pc;
se.isCancel = Ki;
se.VERSION = Rn;
se.toFormData = Mr;
se.AxiosError = I;
se.Cancel = se.CanceledError;
se.all = function(e) {
  return Promise.all(e);
};
se.spread = Lc;
se.isAxiosError = kc;
se.mergeConfig = rt;
se.AxiosHeaders = le;
se.formToJSON = (n) => Wi(v.isHTMLForm(n) ? new FormData(n) : n);
se.getAdapter = ra.getAdapter;
se.HttpStatusCode = Wt;
se.default = se;
const {
  Axios: pf,
  AxiosError: mf,
  CanceledError: gf,
  isCancel: yf,
  CancelToken: Ef,
  VERSION: vf,
  all: Cf,
  Cancel: wf,
  isAxiosError: _f,
  spread: Af,
  toFormData: bf,
  AxiosHeaders: Ff,
  HttpStatusCode: Sf,
  formToJSON: Bf,
  getAdapter: Df,
  mergeConfig: Rf,
  create: Of
} = se, Be = {
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
class De extends Error {
  constructor(e, t, r = null) {
    super(e), this.name = "ApiError", this.code = t, this.originalError = r;
  }
}
class Ic {
  /**
   * @constructor
   * @param {String} baseUrl ex: https://iam-url/auth/realms/demo/protocol/openid-connect
   * @param {String} clientId 
   * @param {String} clientSecret (optionnel, non présent si PKCE)
   */
  constructor(e, t, r = null) {
    if (!e) throw new De("An authentication url must be provided", Be.BASE_URL_MISSING);
    if (!t) throw new De("A clientId must be provided", Be.CLIENT_ID_MISSING);
    this.clientId = t, this.clientSecret = r, this.expirationDate = null, this.refreshExpirationDate = null, this.token = null, this.refreshToken = null, this.usesPKCE = r === null, this.usesExternalToken = !1, this.axiosInstance = se.create({
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
  setExternalToken(e, t = null, r = 43200, s = null) {
    if (!e) throw new De("Access token is required", Be.ACCESS_TOKEN_MISSING);
    this.token = e, this.refreshToken = t, this.usesExternalToken = !0, this.started = !0;
    const i = /* @__PURE__ */ new Date();
    if (i.setSeconds(i.getSeconds() + r), this.expirationDate = i, t && s) {
      const a = /* @__PURE__ */ new Date();
      a.setSeconds(a.getSeconds() + s), this.refreshExpirationDate = a;
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
    let s = /* @__PURE__ */ new Date();
    s.setSeconds(s.getSeconds() + t), this.refreshExpirationDate = s;
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
    if (!this.refreshToken) throw new De("No refresh token found", Be.REFRESH_TOKEN_MISSING);
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
      throw new De("Error refreshing access token: " + e.message ? e.message : e, Be.ERROR_REFRESHING_ACCESS_TOKEN);
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
        if (t.status !== 200) throw new De("Error refreshing access token", Be.ERROR_REFRESHING_ACCESS_TOKEN);
        return this.processTokenResponse(t.data), this.token;
      } else
        throw new De("Token expired and refresh token is not valid", Be.REFRESH_TOKEN_EXPIRED);
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
function ia(n, e, t) {
  e || (e = new FormData());
  let r = 0;
  for (var s in n) {
    let i = s;
    t && (i = t + "[" + s + "]");
    let a = n[s];
    if (a instanceof Blob) {
      r += 1;
      let l = a.type.split("/")[1], c = "document" + r + "." + l;
      e.append(i, a, c);
    } else {
      if (!a && typeof a != "boolean")
        continue;
      a instanceof Date || typeof a == "boolean" ? e.append(i, JSON.stringify(a)) : typeof a == "object" && (typeof a.keys == "function" && a.keys() || Object.keys(a) && Object.keys(a).length) ? ia(a, e, i) : typeof a == "object" ? e.append(i, JSON.stringify(a)) : e.append(i, a);
    }
  }
  return e;
}
const Ut = {
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
}, Fs = {
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
}, Ss = {
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
function re(n, e) {
  let t = Ut[e] ? Ut[e] : Ut[e.substring(0, 3)] ? Ut[e.substring(0, 3)] : null;
  if (t) {
    for (const r in n)
      if (t.indexOf(r) == -1) throw "Invalid parameter " + r + ": must be in [" + t.concat(", ") + "]";
  }
}
function k(n) {
  if (isNaN(parseInt(n)) || parseInt(n) < 0) throw "id must be a positive number";
}
function Y(n, e) {
  const t = e.replace(/add|put|patch/, "").toLowerCase();
  let r = Fs[t] ? Fs[t] : null, s = Ss[t] ? Ss[t] : null;
  if (r) {
    for (const i in n)
      if (r.indexOf(i) == -1 && !(n[i] instanceof Blob)) throw "Invalid field " + i + ": must be in [" + r.concat(", ") + "]";
  }
  if (e.indexOf("patch") == -1) {
    for (const i in s)
      if (Object.keys(n).indexOf(s[i]) == -1) throw "Missing mandatory field " + s[i];
  }
}
function tn(n) {
  let e = 0;
  for (var t in n)
    if (n[t] instanceof Blob && (e += 1, e > 4))
      throw "Maximum 4 documents";
}
var rn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Nc(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var e = n.default;
  if (typeof e == "function") {
    var t = function r() {
      var s = !1;
      try {
        s = this instanceof r;
      } catch {
      }
      return s ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(n).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(n, r);
    Object.defineProperty(t, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return n[r];
      }
    });
  }), t;
}
var Gt = { exports: {} };
function Uc(n) {
  throw new Error('Could not dynamically require "' + n + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Kt = { exports: {} };
const qc = {}, Mc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qc
}, Symbol.toStringTag, { value: "Module" })), Hc = /* @__PURE__ */ Nc(Mc);
var $c = Kt.exports, Bs;
function z() {
  return Bs || (Bs = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r();
    })($c, function() {
      var t = t || (function(r, s) {
        var i;
        if (typeof window < "u" && window.crypto && (i = window.crypto), typeof self < "u" && self.crypto && (i = self.crypto), typeof globalThis < "u" && globalThis.crypto && (i = globalThis.crypto), !i && typeof window < "u" && window.msCrypto && (i = window.msCrypto), !i && typeof rn < "u" && rn.crypto && (i = rn.crypto), !i && typeof Uc == "function")
          try {
            i = Hc;
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
        }, o = Object.create || /* @__PURE__ */ (function() {
          function g() {
          }
          return function(d) {
            var x;
            return g.prototype = d, x = new g(), g.prototype = null, x;
          };
        })(), l = {}, c = l.lib = {}, u = c.Base = /* @__PURE__ */ (function() {
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
        })(), h = c.WordArray = u.extend({
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
            g = this.words = g || [], d != s ? this.sigBytes = d : this.sigBytes = g.length * 4;
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
            var d = this.words, x = g.words, A = this.sigBytes, w = g.sigBytes;
            if (this.clamp(), A % 4)
              for (var S = 0; S < w; S++) {
                var b = x[S >>> 2] >>> 24 - S % 4 * 8 & 255;
                d[A + S >>> 2] |= b << 24 - (A + S) % 4 * 8;
              }
            else
              for (var R = 0; R < w; R += 4)
                d[A + R >>> 2] = x[R >>> 2];
            return this.sigBytes += w, this;
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
            for (var d = g.words, x = g.sigBytes, A = [], w = 0; w < x; w++) {
              var S = d[w >>> 2] >>> 24 - w % 4 * 8 & 255;
              A.push((S >>> 4).toString(16)), A.push((S & 15).toString(16));
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
            for (var d = g.words, x = g.sigBytes, A = [], w = 0; w < x; w++) {
              var S = d[w >>> 2] >>> 24 - w % 4 * 8 & 255;
              A.push(String.fromCharCode(S));
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
            var d, x = this._data, A = x.words, w = x.sigBytes, S = this.blockSize, b = S * 4, R = w / b;
            g ? R = r.ceil(R) : R = r.max((R | 0) - this._minBufferSize, 0);
            var _ = R * S, F = r.min(_ * 4, w);
            if (_) {
              for (var B = 0; B < _; B += S)
                this._doProcessBlock(A, B);
              d = A.splice(0, _), x.sigBytes -= F;
            }
            return new h.init(d, F);
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
      })(Math);
      return t;
    });
  })(Kt)), Kt.exports;
}
var Xt = { exports: {} }, zc = Xt.exports, Ds;
function $r() {
  return Ds || (Ds = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(zc, function(t) {
      return (function(r) {
        var s = t, i = s.lib, a = i.Base, o = i.WordArray, l = s.x64 = {};
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
      })(), t;
    });
  })(Xt)), Xt.exports;
}
var Zt = { exports: {} }, jc = Zt.exports, Rs;
function Wc() {
  return Rs || (Rs = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(jc, function(t) {
      return (function() {
        if (typeof ArrayBuffer == "function") {
          var r = t, s = r.lib, i = s.WordArray, a = i.init, o = i.init = function(l) {
            if (l instanceof ArrayBuffer && (l = new Uint8Array(l)), (l instanceof Int8Array || typeof Uint8ClampedArray < "u" && l instanceof Uint8ClampedArray || l instanceof Int16Array || l instanceof Uint16Array || l instanceof Int32Array || l instanceof Uint32Array || l instanceof Float32Array || l instanceof Float64Array) && (l = new Uint8Array(l.buffer, l.byteOffset, l.byteLength)), l instanceof Uint8Array) {
              for (var c = l.byteLength, u = [], h = 0; h < c; h++)
                u[h >>> 2] |= l[h] << 24 - h % 4 * 8;
              a.call(this, u, c);
            } else
              a.apply(this, arguments);
          };
          o.prototype = i;
        }
      })(), t.lib.WordArray;
    });
  })(Zt)), Zt.exports;
}
var Vt = { exports: {} }, Gc = Vt.exports, Os;
function Kc() {
  return Os || (Os = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(Gc, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.WordArray, a = r.enc;
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
      })(), t.enc.Utf16;
    });
  })(Vt)), Vt.exports;
}
var Yt = { exports: {} }, Xc = Yt.exports, Ts;
function nt() {
  return Ts || (Ts = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(Xc, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.WordArray, a = r.enc;
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
      })(), t.enc.Base64;
    });
  })(Yt)), Yt.exports;
}
var Jt = { exports: {} }, Zc = Jt.exports, Ps;
function Vc() {
  return Ps || (Ps = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(Zc, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.WordArray, a = r.enc;
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
      })(), t.enc.Base64url;
    });
  })(Jt)), Jt.exports;
}
var Qt = { exports: {} }, Yc = Qt.exports, Ls;
function st() {
  return Ls || (Ls = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(Yc, function(t) {
      return (function(r) {
        var s = t, i = s.lib, a = i.WordArray, o = i.Hasher, l = s.algo, c = [];
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
            var x = this._hash.words, A = E[y + 0], w = E[y + 1], S = E[y + 2], b = E[y + 3], R = E[y + 4], _ = E[y + 5], F = E[y + 6], B = E[y + 7], D = E[y + 8], N = E[y + 9], U = E[y + 10], q = E[y + 11], Z = E[y + 12], V = E[y + 13], G = E[y + 14], j = E[y + 15], T = x[0], L = x[1], P = x[2], O = x[3];
            T = h(T, L, P, O, A, 7, c[0]), O = h(O, T, L, P, w, 12, c[1]), P = h(P, O, T, L, S, 17, c[2]), L = h(L, P, O, T, b, 22, c[3]), T = h(T, L, P, O, R, 7, c[4]), O = h(O, T, L, P, _, 12, c[5]), P = h(P, O, T, L, F, 17, c[6]), L = h(L, P, O, T, B, 22, c[7]), T = h(T, L, P, O, D, 7, c[8]), O = h(O, T, L, P, N, 12, c[9]), P = h(P, O, T, L, U, 17, c[10]), L = h(L, P, O, T, q, 22, c[11]), T = h(T, L, P, O, Z, 7, c[12]), O = h(O, T, L, P, V, 12, c[13]), P = h(P, O, T, L, G, 17, c[14]), L = h(L, P, O, T, j, 22, c[15]), T = f(T, L, P, O, w, 5, c[16]), O = f(O, T, L, P, F, 9, c[17]), P = f(P, O, T, L, q, 14, c[18]), L = f(L, P, O, T, A, 20, c[19]), T = f(T, L, P, O, _, 5, c[20]), O = f(O, T, L, P, U, 9, c[21]), P = f(P, O, T, L, j, 14, c[22]), L = f(L, P, O, T, R, 20, c[23]), T = f(T, L, P, O, N, 5, c[24]), O = f(O, T, L, P, G, 9, c[25]), P = f(P, O, T, L, b, 14, c[26]), L = f(L, P, O, T, D, 20, c[27]), T = f(T, L, P, O, V, 5, c[28]), O = f(O, T, L, P, S, 9, c[29]), P = f(P, O, T, L, B, 14, c[30]), L = f(L, P, O, T, Z, 20, c[31]), T = p(T, L, P, O, _, 4, c[32]), O = p(O, T, L, P, D, 11, c[33]), P = p(P, O, T, L, q, 16, c[34]), L = p(L, P, O, T, G, 23, c[35]), T = p(T, L, P, O, w, 4, c[36]), O = p(O, T, L, P, R, 11, c[37]), P = p(P, O, T, L, B, 16, c[38]), L = p(L, P, O, T, U, 23, c[39]), T = p(T, L, P, O, V, 4, c[40]), O = p(O, T, L, P, A, 11, c[41]), P = p(P, O, T, L, b, 16, c[42]), L = p(L, P, O, T, F, 23, c[43]), T = p(T, L, P, O, N, 4, c[44]), O = p(O, T, L, P, Z, 11, c[45]), P = p(P, O, T, L, j, 16, c[46]), L = p(L, P, O, T, S, 23, c[47]), T = m(T, L, P, O, A, 6, c[48]), O = m(O, T, L, P, B, 10, c[49]), P = m(P, O, T, L, G, 15, c[50]), L = m(L, P, O, T, _, 21, c[51]), T = m(T, L, P, O, Z, 6, c[52]), O = m(O, T, L, P, b, 10, c[53]), P = m(P, O, T, L, U, 15, c[54]), L = m(L, P, O, T, w, 21, c[55]), T = m(T, L, P, O, D, 6, c[56]), O = m(O, T, L, P, j, 10, c[57]), P = m(P, O, T, L, F, 15, c[58]), L = m(L, P, O, T, V, 21, c[59]), T = m(T, L, P, O, R, 6, c[60]), O = m(O, T, L, P, q, 10, c[61]), P = m(P, O, T, L, S, 15, c[62]), L = m(L, P, O, T, N, 21, c[63]), x[0] = x[0] + T | 0, x[1] = x[1] + L | 0, x[2] = x[2] + P | 0, x[3] = x[3] + O | 0;
          },
          _doFinalize: function() {
            var E = this._data, y = E.words, C = this._nDataBytes * 8, g = E.sigBytes * 8;
            y[g >>> 5] |= 128 << 24 - g % 32;
            var d = r.floor(C / 4294967296), x = C;
            y[(g + 64 >>> 9 << 4) + 15] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, y[(g + 64 >>> 9 << 4) + 14] = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360, E.sigBytes = (y.length + 1) * 4, this._process();
            for (var A = this._hash, w = A.words, S = 0; S < 4; S++) {
              var b = w[S];
              w[S] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
            }
            return A;
          },
          clone: function() {
            var E = o.clone.call(this);
            return E._hash = this._hash.clone(), E;
          }
        });
        function h(E, y, C, g, d, x, A) {
          var w = E + (y & C | ~y & g) + d + A;
          return (w << x | w >>> 32 - x) + y;
        }
        function f(E, y, C, g, d, x, A) {
          var w = E + (y & g | C & ~g) + d + A;
          return (w << x | w >>> 32 - x) + y;
        }
        function p(E, y, C, g, d, x, A) {
          var w = E + (y ^ C ^ g) + d + A;
          return (w << x | w >>> 32 - x) + y;
        }
        function m(E, y, C, g, d, x, A) {
          var w = E + (C ^ (y | ~g)) + d + A;
          return (w << x | w >>> 32 - x) + y;
        }
        s.MD5 = o._createHelper(u), s.HmacMD5 = o._createHmacHelper(u);
      })(Math), t.MD5;
    });
  })(Qt)), Qt.exports;
}
var er = { exports: {} }, Jc = er.exports, ks;
function aa() {
  return ks || (ks = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(Jc, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.WordArray, a = s.Hasher, o = r.algo, l = [], c = o.SHA1 = a.extend({
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
      })(), t.SHA1;
    });
  })(er)), er.exports;
}
var tr = { exports: {} }, Qc = tr.exports, Is;
function Tn() {
  return Is || (Is = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(Qc, function(t) {
      return (function(r) {
        var s = t, i = s.lib, a = i.WordArray, o = i.Hasher, l = s.algo, c = [], u = [];
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
            for (var E = this._hash.words, y = E[0], C = E[1], g = E[2], d = E[3], x = E[4], A = E[5], w = E[6], S = E[7], b = 0; b < 64; b++) {
              if (b < 16)
                h[b] = p[m + b] | 0;
              else {
                var R = h[b - 15], _ = (R << 25 | R >>> 7) ^ (R << 14 | R >>> 18) ^ R >>> 3, F = h[b - 2], B = (F << 15 | F >>> 17) ^ (F << 13 | F >>> 19) ^ F >>> 10;
                h[b] = _ + h[b - 7] + B + h[b - 16];
              }
              var D = x & A ^ ~x & w, N = y & C ^ y & g ^ C & g, U = (y << 30 | y >>> 2) ^ (y << 19 | y >>> 13) ^ (y << 10 | y >>> 22), q = (x << 26 | x >>> 6) ^ (x << 21 | x >>> 11) ^ (x << 7 | x >>> 25), Z = S + q + D + u[b] + h[b], V = U + N;
              S = w, w = A, A = x, x = d + Z | 0, d = g, g = C, C = y, y = Z + V | 0;
            }
            E[0] = E[0] + y | 0, E[1] = E[1] + C | 0, E[2] = E[2] + g | 0, E[3] = E[3] + d | 0, E[4] = E[4] + x | 0, E[5] = E[5] + A | 0, E[6] = E[6] + w | 0, E[7] = E[7] + S | 0;
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
        s.SHA256 = o._createHelper(f), s.HmacSHA256 = o._createHmacHelper(f);
      })(Math), t.SHA256;
    });
  })(tr)), tr.exports;
}
var rr = { exports: {} }, el = rr.exports, Ns;
function tl() {
  return Ns || (Ns = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), Tn());
    })(el, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.WordArray, a = r.algo, o = a.SHA256, l = a.SHA224 = o.extend({
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
      })(), t.SHA224;
    });
  })(rr)), rr.exports;
}
var nr = { exports: {} }, rl = nr.exports, Us;
function oa() {
  return Us || (Us = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), $r());
    })(rl, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.Hasher, a = r.x64, o = a.Word, l = a.WordArray, c = r.algo;
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
            for (var y = this._hash.words, C = y[0], g = y[1], d = y[2], x = y[3], A = y[4], w = y[5], S = y[6], b = y[7], R = C.high, _ = C.low, F = g.high, B = g.low, D = d.high, N = d.low, U = x.high, q = x.low, Z = A.high, V = A.low, G = w.high, j = w.low, T = S.high, L = S.low, P = b.high, O = b.low, K = R, W = _, ie = F, H = B, Ie = D, $ = N, ge = U, oe = q, ye = Z, ue = V, Ne = G, He = j, it = T, pe = L, _e = P, ve = O, Ce = 0; Ce < 80; Ce++) {
              var Ee, fe, M = f[Ce];
              if (Ce < 16)
                fe = M.high = m[E + Ce * 2] | 0, Ee = M.low = m[E + Ce * 2 + 1] | 0;
              else {
                var ce = f[Ce - 15], Ae = ce.high, be = ce.low, Ot = (Ae >>> 1 | be << 31) ^ (Ae >>> 8 | be << 24) ^ Ae >>> 7, Tt = (be >>> 1 | Ae << 31) ^ (be >>> 8 | Ae << 24) ^ (be >>> 7 | Ae << 25), $e = f[Ce - 2], at = $e.high, gt = $e.low, la = (at >>> 19 | gt << 13) ^ (at << 3 | gt >>> 29) ^ at >>> 6, kn = (gt >>> 19 | at << 13) ^ (gt << 3 | at >>> 29) ^ (gt >>> 6 | at << 26), In = f[Ce - 7], ua = In.high, fa = In.low, Nn = f[Ce - 16], ha = Nn.high, Un = Nn.low;
                Ee = Tt + fa, fe = Ot + ua + (Ee >>> 0 < Tt >>> 0 ? 1 : 0), Ee = Ee + kn, fe = fe + la + (Ee >>> 0 < kn >>> 0 ? 1 : 0), Ee = Ee + Un, fe = fe + ha + (Ee >>> 0 < Un >>> 0 ? 1 : 0), M.high = fe, M.low = Ee;
              }
              var da = ye & Ne ^ ~ye & it, qn = ue & He ^ ~ue & pe, xa = K & ie ^ K & Ie ^ ie & Ie, pa = W & H ^ W & $ ^ H & $, ma = (K >>> 28 | W << 4) ^ (K << 30 | W >>> 2) ^ (K << 25 | W >>> 7), Mn = (W >>> 28 | K << 4) ^ (W << 30 | K >>> 2) ^ (W << 25 | K >>> 7), ga = (ye >>> 14 | ue << 18) ^ (ye >>> 18 | ue << 14) ^ (ye << 23 | ue >>> 9), ya = (ue >>> 14 | ye << 18) ^ (ue >>> 18 | ye << 14) ^ (ue << 23 | ye >>> 9), Hn = h[Ce], Ea = Hn.high, $n = Hn.low, Fe = ve + ya, ze = _e + ga + (Fe >>> 0 < ve >>> 0 ? 1 : 0), Fe = Fe + qn, ze = ze + da + (Fe >>> 0 < qn >>> 0 ? 1 : 0), Fe = Fe + $n, ze = ze + Ea + (Fe >>> 0 < $n >>> 0 ? 1 : 0), Fe = Fe + Ee, ze = ze + fe + (Fe >>> 0 < Ee >>> 0 ? 1 : 0), zn = Mn + pa, va = ma + xa + (zn >>> 0 < Mn >>> 0 ? 1 : 0);
              _e = it, ve = pe, it = Ne, pe = He, Ne = ye, He = ue, ue = oe + Fe | 0, ye = ge + ze + (ue >>> 0 < oe >>> 0 ? 1 : 0) | 0, ge = Ie, oe = $, Ie = ie, $ = H, ie = K, H = W, W = Fe + zn | 0, K = ze + va + (W >>> 0 < Fe >>> 0 ? 1 : 0) | 0;
            }
            _ = C.low = _ + W, C.high = R + K + (_ >>> 0 < W >>> 0 ? 1 : 0), B = g.low = B + H, g.high = F + ie + (B >>> 0 < H >>> 0 ? 1 : 0), N = d.low = N + $, d.high = D + Ie + (N >>> 0 < $ >>> 0 ? 1 : 0), q = x.low = q + oe, x.high = U + ge + (q >>> 0 < oe >>> 0 ? 1 : 0), V = A.low = V + ue, A.high = Z + ye + (V >>> 0 < ue >>> 0 ? 1 : 0), j = w.low = j + He, w.high = G + Ne + (j >>> 0 < He >>> 0 ? 1 : 0), L = S.low = L + pe, S.high = T + it + (L >>> 0 < pe >>> 0 ? 1 : 0), O = b.low = O + ve, b.high = P + _e + (O >>> 0 < ve >>> 0 ? 1 : 0);
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
      })(), t.SHA512;
    });
  })(nr)), nr.exports;
}
var sr = { exports: {} }, nl = sr.exports, qs;
function sl() {
  return qs || (qs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), $r(), oa());
    })(nl, function(t) {
      return (function() {
        var r = t, s = r.x64, i = s.Word, a = s.WordArray, o = r.algo, l = o.SHA512, c = o.SHA384 = l.extend({
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
      })(), t.SHA384;
    });
  })(sr)), sr.exports;
}
var ir = { exports: {} }, il = ir.exports, Ms;
function al() {
  return Ms || (Ms = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), $r());
    })(il, function(t) {
      return (function(r) {
        var s = t, i = s.lib, a = i.WordArray, o = i.Hasher, l = s.x64, c = l.Word, u = s.algo, h = [], f = [], p = [];
        (function() {
          for (var y = 1, C = 0, g = 0; g < 24; g++) {
            h[y + 5 * C] = (g + 1) * (g + 2) / 2 % 64;
            var d = C % 5, x = (2 * y + 3 * C) % 5;
            y = d, C = x;
          }
          for (var y = 0; y < 5; y++)
            for (var C = 0; C < 5; C++)
              f[y + 5 * C] = C + (2 * y + 3 * C) % 5 * 5;
          for (var A = 1, w = 0; w < 24; w++) {
            for (var S = 0, b = 0, R = 0; R < 7; R++) {
              if (A & 1) {
                var _ = (1 << R) - 1;
                _ < 32 ? b ^= 1 << _ : S ^= 1 << _ - 32;
              }
              A & 128 ? A = A << 1 ^ 113 : A <<= 1;
            }
            p[w] = c.create(S, b);
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
              var A = y[C + 2 * x], w = y[C + 2 * x + 1];
              A = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360, w = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360;
              var S = g[x];
              S.high ^= w, S.low ^= A;
            }
            for (var b = 0; b < 24; b++) {
              for (var R = 0; R < 5; R++) {
                for (var _ = 0, F = 0, B = 0; B < 5; B++) {
                  var S = g[R + 5 * B];
                  _ ^= S.high, F ^= S.low;
                }
                var D = m[R];
                D.high = _, D.low = F;
              }
              for (var R = 0; R < 5; R++)
                for (var N = m[(R + 4) % 5], U = m[(R + 1) % 5], q = U.high, Z = U.low, _ = N.high ^ (q << 1 | Z >>> 31), F = N.low ^ (Z << 1 | q >>> 31), B = 0; B < 5; B++) {
                  var S = g[R + 5 * B];
                  S.high ^= _, S.low ^= F;
                }
              for (var V = 1; V < 25; V++) {
                var _, F, S = g[V], G = S.high, j = S.low, T = h[V];
                T < 32 ? (_ = G << T | j >>> 32 - T, F = j << T | G >>> 32 - T) : (_ = j << T - 32 | G >>> 64 - T, F = G << T - 32 | j >>> 64 - T);
                var L = m[f[V]];
                L.high = _, L.low = F;
              }
              var P = m[0], O = g[0];
              P.high = O.high, P.low = O.low;
              for (var R = 0; R < 5; R++)
                for (var B = 0; B < 5; B++) {
                  var V = R + 5 * B, S = g[V], K = m[V], W = m[(R + 1) % 5 + 5 * B], ie = m[(R + 2) % 5 + 5 * B];
                  S.high = K.high ^ ~W.high & ie.high, S.low = K.low ^ ~W.low & ie.low;
                }
              var S = g[0], H = p[b];
              S.high ^= H.high, S.low ^= H.low;
            }
          },
          _doFinalize: function() {
            var y = this._data, C = y.words;
            this._nDataBytes * 8;
            var g = y.sigBytes * 8, d = this.blockSize * 32;
            C[g >>> 5] |= 1 << 24 - g % 32, C[(r.ceil((g + 1) / d) * d >>> 5) - 1] |= 128, y.sigBytes = C.length * 4, this._process();
            for (var x = this._state, A = this.cfg.outputLength / 8, w = A / 8, S = [], b = 0; b < w; b++) {
              var R = x[b], _ = R.high, F = R.low;
              _ = (_ << 8 | _ >>> 24) & 16711935 | (_ << 24 | _ >>> 8) & 4278255360, F = (F << 8 | F >>> 24) & 16711935 | (F << 24 | F >>> 8) & 4278255360, S.push(F), S.push(_);
            }
            return new a.init(S, A);
          },
          clone: function() {
            for (var y = o.clone.call(this), C = y._state = this._state.slice(0), g = 0; g < 25; g++)
              C[g] = C[g].clone();
            return y;
          }
        });
        s.SHA3 = o._createHelper(E), s.HmacSHA3 = o._createHmacHelper(E);
      })(Math), t.SHA3;
    });
  })(ir)), ir.exports;
}
var ar = { exports: {} }, ol = ar.exports, Hs;
function cl() {
  return Hs || (Hs = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(ol, function(t) {
      return (function(r) {
        var s = t, i = s.lib, a = i.WordArray, o = i.Hasher, l = s.algo, c = a.create([
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
          _doProcessBlock: function(w, S) {
            for (var b = 0; b < 16; b++) {
              var R = S + b, _ = w[R];
              w[R] = (_ << 8 | _ >>> 24) & 16711935 | (_ << 24 | _ >>> 8) & 4278255360;
            }
            var F = this._hash.words, B = p.words, D = m.words, N = c.words, U = u.words, q = h.words, Z = f.words, V, G, j, T, L, P, O, K, W, ie;
            P = V = F[0], O = G = F[1], K = j = F[2], W = T = F[3], ie = L = F[4];
            for (var H, b = 0; b < 80; b += 1)
              H = V + w[S + N[b]] | 0, b < 16 ? H += y(G, j, T) + B[0] : b < 32 ? H += C(G, j, T) + B[1] : b < 48 ? H += g(G, j, T) + B[2] : b < 64 ? H += d(G, j, T) + B[3] : H += x(G, j, T) + B[4], H = H | 0, H = A(H, q[b]), H = H + L | 0, V = L, L = T, T = A(j, 10), j = G, G = H, H = P + w[S + U[b]] | 0, b < 16 ? H += x(O, K, W) + D[0] : b < 32 ? H += d(O, K, W) + D[1] : b < 48 ? H += g(O, K, W) + D[2] : b < 64 ? H += C(O, K, W) + D[3] : H += y(O, K, W) + D[4], H = H | 0, H = A(H, Z[b]), H = H + ie | 0, P = ie, ie = W, W = A(K, 10), K = O, O = H;
            H = F[1] + j + W | 0, F[1] = F[2] + T + ie | 0, F[2] = F[3] + L + P | 0, F[3] = F[4] + V + O | 0, F[4] = F[0] + G + K | 0, F[0] = H;
          },
          _doFinalize: function() {
            var w = this._data, S = w.words, b = this._nDataBytes * 8, R = w.sigBytes * 8;
            S[R >>> 5] |= 128 << 24 - R % 32, S[(R + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360, w.sigBytes = (S.length + 1) * 4, this._process();
            for (var _ = this._hash, F = _.words, B = 0; B < 5; B++) {
              var D = F[B];
              F[B] = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360;
            }
            return _;
          },
          clone: function() {
            var w = o.clone.call(this);
            return w._hash = this._hash.clone(), w;
          }
        });
        function y(w, S, b) {
          return w ^ S ^ b;
        }
        function C(w, S, b) {
          return w & S | ~w & b;
        }
        function g(w, S, b) {
          return (w | ~S) ^ b;
        }
        function d(w, S, b) {
          return w & b | S & ~b;
        }
        function x(w, S, b) {
          return w ^ (S | ~b);
        }
        function A(w, S) {
          return w << S | w >>> 32 - S;
        }
        s.RIPEMD160 = o._createHelper(E), s.HmacRIPEMD160 = o._createHmacHelper(E);
      })(), t.RIPEMD160;
    });
  })(ar)), ar.exports;
}
var or = { exports: {} }, ll = or.exports, $s;
function Pn() {
  return $s || ($s = 1, (function(n, e) {
    (function(t, r) {
      n.exports = r(z());
    })(ll, function(t) {
      (function() {
        var r = t, s = r.lib, i = s.Base, a = r.enc, o = a.Utf8, l = r.algo;
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
  })(or)), or.exports;
}
var cr = { exports: {} }, ul = cr.exports, zs;
function fl() {
  return zs || (zs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), Tn(), Pn());
    })(ul, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.Base, a = s.WordArray, o = r.algo, l = o.SHA256, c = o.HMAC, u = o.PBKDF2 = i.extend({
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
              for (var w = A.words, S = w.length, b = A, R = 1; R < x; R++) {
                b = m.finalize(b), m.reset();
                for (var _ = b.words, F = 0; F < S; F++)
                  w[F] ^= _[F];
              }
              E.concat(A), g[0]++;
            }
            return E.sigBytes = d * 4, E;
          }
        });
        r.PBKDF2 = function(h, f, p) {
          return u.create(p).compute(h, f);
        };
      })(), t.PBKDF2;
    });
  })(cr)), cr.exports;
}
var lr = { exports: {} }, hl = lr.exports, js;
function Xe() {
  return js || (js = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), aa(), Pn());
    })(hl, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.Base, a = s.WordArray, o = r.algo, l = o.MD5, c = o.EvpKDF = i.extend({
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
      })(), t.EvpKDF;
    });
  })(lr)), lr.exports;
}
var ur = { exports: {} }, dl = ur.exports, Ws;
function xe() {
  return Ws || (Ws = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), Xe());
    })(dl, function(t) {
      t.lib.Cipher || (function(r) {
        var s = t, i = s.lib, a = i.Base, o = i.WordArray, l = i.BufferedBlockAlgorithm, c = s.enc;
        c.Utf8;
        var u = c.Base64, h = s.algo, f = h.EvpKDF, p = i.Cipher = l.extend({
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
          createEncryptor: function(_, F) {
            return this.create(this._ENC_XFORM_MODE, _, F);
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
          createDecryptor: function(_, F) {
            return this.create(this._DEC_XFORM_MODE, _, F);
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
          init: function(_, F, B) {
            this.cfg = this.cfg.extend(B), this._xformMode = _, this._key = F, this.reset();
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
          process: function(_) {
            return this._append(_), this._process();
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
          finalize: function(_) {
            _ && this._append(_);
            var F = this._doFinalize();
            return F;
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
          _createHelper: /* @__PURE__ */ (function() {
            function _(F) {
              return typeof F == "string" ? R : w;
            }
            return function(F) {
              return {
                encrypt: function(B, D, N) {
                  return _(D).encrypt(F, B, D, N);
                },
                decrypt: function(B, D, N) {
                  return _(D).decrypt(F, B, D, N);
                }
              };
            };
          })()
        });
        i.StreamCipher = p.extend({
          _doFinalize: function() {
            var _ = this._process(!0);
            return _;
          },
          blockSize: 1
        });
        var m = s.mode = {}, E = i.BlockCipherMode = a.extend({
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
          createEncryptor: function(_, F) {
            return this.Encryptor.create(_, F);
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
          createDecryptor: function(_, F) {
            return this.Decryptor.create(_, F);
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
          init: function(_, F) {
            this._cipher = _, this._iv = F;
          }
        }), y = m.CBC = (function() {
          var _ = E.extend();
          _.Encryptor = _.extend({
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
              F.call(this, B, D, U), N.encryptBlock(B, D), this._prevBlock = B.slice(D, D + U);
            }
          }), _.Decryptor = _.extend({
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
              N.decryptBlock(B, D), F.call(this, B, D, U), this._prevBlock = q;
            }
          });
          function F(B, D, N) {
            var U, q = this._iv;
            q ? (U = q, this._iv = r) : U = this._prevBlock;
            for (var Z = 0; Z < N; Z++)
              B[D + Z] ^= U[Z];
          }
          return _;
        })(), C = s.pad = {}, g = C.Pkcs7 = {
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
          pad: function(_, F) {
            for (var B = F * 4, D = B - _.sigBytes % B, N = D << 24 | D << 16 | D << 8 | D, U = [], q = 0; q < D; q += 4)
              U.push(N);
            var Z = o.create(U, D);
            _.concat(Z);
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
          unpad: function(_) {
            var F = _.words[_.sigBytes - 1 >>> 2] & 255;
            _.sigBytes -= F;
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
            var _;
            p.reset.call(this);
            var F = this.cfg, B = F.iv, D = F.mode;
            this._xformMode == this._ENC_XFORM_MODE ? _ = D.createEncryptor : (_ = D.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == _ ? this._mode.init(this, B && B.words) : (this._mode = _.call(D, this, B && B.words), this._mode.__creator = _);
          },
          _doProcessBlock: function(_, F) {
            this._mode.processBlock(_, F);
          },
          _doFinalize: function() {
            var _, F = this.cfg.padding;
            return this._xformMode == this._ENC_XFORM_MODE ? (F.pad(this._data, this.blockSize), _ = this._process(!0)) : (_ = this._process(!0), F.unpad(_)), _;
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
          init: function(_) {
            this.mixIn(_);
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
          toString: function(_) {
            return (_ || this.formatter).stringify(this);
          }
        }), x = s.format = {}, A = x.OpenSSL = {
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
          stringify: function(_) {
            var F, B = _.ciphertext, D = _.salt;
            return D ? F = o.create([1398893684, 1701076831]).concat(D).concat(B) : F = B, F.toString(u);
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
          parse: function(_) {
            var F, B = u.parse(_), D = B.words;
            return D[0] == 1398893684 && D[1] == 1701076831 && (F = o.create(D.slice(2, 4)), D.splice(0, 4), B.sigBytes -= 16), d.create({ ciphertext: B, salt: F });
          }
        }, w = i.SerializableCipher = a.extend({
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
          encrypt: function(_, F, B, D) {
            D = this.cfg.extend(D);
            var N = _.createEncryptor(B, D), U = N.finalize(F), q = N.cfg;
            return d.create({
              ciphertext: U,
              key: B,
              iv: q.iv,
              algorithm: _,
              mode: q.mode,
              padding: q.padding,
              blockSize: _.blockSize,
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
          decrypt: function(_, F, B, D) {
            D = this.cfg.extend(D), F = this._parse(F, D.format);
            var N = _.createDecryptor(B, D).finalize(F.ciphertext);
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
          _parse: function(_, F) {
            return typeof _ == "string" ? F.parse(_, this) : _;
          }
        }), S = s.kdf = {}, b = S.OpenSSL = {
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
          execute: function(_, F, B, D, N) {
            if (D || (D = o.random(64 / 8)), N)
              var U = f.create({ keySize: F + B, hasher: N }).compute(_, D);
            else
              var U = f.create({ keySize: F + B }).compute(_, D);
            var q = o.create(U.words.slice(F), B * 4);
            return U.sigBytes = F * 4, d.create({ key: U, iv: q, salt: D });
          }
        }, R = i.PasswordBasedCipher = w.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: w.cfg.extend({
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
          encrypt: function(_, F, B, D) {
            D = this.cfg.extend(D);
            var N = D.kdf.execute(B, _.keySize, _.ivSize, D.salt, D.hasher);
            D.iv = N.iv;
            var U = w.encrypt.call(this, _, F, N.key, D);
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
          decrypt: function(_, F, B, D) {
            D = this.cfg.extend(D), F = this._parse(F, D.format);
            var N = D.kdf.execute(B, _.keySize, _.ivSize, F.salt, D.hasher);
            D.iv = N.iv;
            var U = w.decrypt.call(this, _, F, N.key, D);
            return U;
          }
        });
      })();
    });
  })(ur)), ur.exports;
}
var fr = { exports: {} }, xl = fr.exports, Gs;
function pl() {
  return Gs || (Gs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(xl, function(t) {
      return t.mode.CFB = (function() {
        var r = t.lib.BlockCipherMode.extend();
        r.Encryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize;
            s.call(this, i, a, l, o), this._prevBlock = i.slice(a, a + l);
          }
        }), r.Decryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize, c = i.slice(a, a + l);
            s.call(this, i, a, l, o), this._prevBlock = c;
          }
        });
        function s(i, a, o, l) {
          var c, u = this._iv;
          u ? (c = u.slice(0), this._iv = void 0) : c = this._prevBlock, l.encryptBlock(c, 0);
          for (var h = 0; h < o; h++)
            i[a + h] ^= c[h];
        }
        return r;
      })(), t.mode.CFB;
    });
  })(fr)), fr.exports;
}
var hr = { exports: {} }, ml = hr.exports, Ks;
function gl() {
  return Ks || (Ks = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(ml, function(t) {
      return t.mode.CTR = (function() {
        var r = t.lib.BlockCipherMode.extend(), s = r.Encryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize, c = this._iv, u = this._counter;
            c && (u = this._counter = c.slice(0), this._iv = void 0);
            var h = u.slice(0);
            o.encryptBlock(h, 0), u[l - 1] = u[l - 1] + 1 | 0;
            for (var f = 0; f < l; f++)
              i[a + f] ^= h[f];
          }
        });
        return r.Decryptor = s, r;
      })(), t.mode.CTR;
    });
  })(hr)), hr.exports;
}
var dr = { exports: {} }, yl = dr.exports, Xs;
function El() {
  return Xs || (Xs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(yl, function(t) {
      return t.mode.CTRGladman = (function() {
        var r = t.lib.BlockCipherMode.extend();
        function s(o) {
          if ((o >> 24 & 255) === 255) {
            var l = o >> 16 & 255, c = o >> 8 & 255, u = o & 255;
            l === 255 ? (l = 0, c === 255 ? (c = 0, u === 255 ? u = 0 : ++u) : ++c) : ++l, o = 0, o += l << 16, o += c << 8, o += u;
          } else
            o += 1 << 24;
          return o;
        }
        function i(o) {
          return (o[0] = s(o[0])) === 0 && (o[1] = s(o[1])), o;
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
      })(), t.mode.CTRGladman;
    });
  })(dr)), dr.exports;
}
var xr = { exports: {} }, vl = xr.exports, Zs;
function Cl() {
  return Zs || (Zs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(vl, function(t) {
      return t.mode.OFB = (function() {
        var r = t.lib.BlockCipherMode.extend(), s = r.Encryptor = r.extend({
          processBlock: function(i, a) {
            var o = this._cipher, l = o.blockSize, c = this._iv, u = this._keystream;
            c && (u = this._keystream = c.slice(0), this._iv = void 0), o.encryptBlock(u, 0);
            for (var h = 0; h < l; h++)
              i[a + h] ^= u[h];
          }
        });
        return r.Decryptor = s, r;
      })(), t.mode.OFB;
    });
  })(xr)), xr.exports;
}
var pr = { exports: {} }, wl = pr.exports, Vs;
function _l() {
  return Vs || (Vs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(wl, function(t) {
      return t.mode.ECB = (function() {
        var r = t.lib.BlockCipherMode.extend();
        return r.Encryptor = r.extend({
          processBlock: function(s, i) {
            this._cipher.encryptBlock(s, i);
          }
        }), r.Decryptor = r.extend({
          processBlock: function(s, i) {
            this._cipher.decryptBlock(s, i);
          }
        }), r;
      })(), t.mode.ECB;
    });
  })(pr)), pr.exports;
}
var mr = { exports: {} }, Al = mr.exports, Ys;
function bl() {
  return Ys || (Ys = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(Al, function(t) {
      return t.pad.AnsiX923 = {
        pad: function(r, s) {
          var i = r.sigBytes, a = s * 4, o = a - i % a, l = i + o - 1;
          r.clamp(), r.words[l >>> 2] |= o << 24 - l % 4 * 8, r.sigBytes += o;
        },
        unpad: function(r) {
          var s = r.words[r.sigBytes - 1 >>> 2] & 255;
          r.sigBytes -= s;
        }
      }, t.pad.Ansix923;
    });
  })(mr)), mr.exports;
}
var gr = { exports: {} }, Fl = gr.exports, Js;
function Sl() {
  return Js || (Js = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(Fl, function(t) {
      return t.pad.Iso10126 = {
        pad: function(r, s) {
          var i = s * 4, a = i - r.sigBytes % i;
          r.concat(t.lib.WordArray.random(a - 1)).concat(t.lib.WordArray.create([a << 24], 1));
        },
        unpad: function(r) {
          var s = r.words[r.sigBytes - 1 >>> 2] & 255;
          r.sigBytes -= s;
        }
      }, t.pad.Iso10126;
    });
  })(gr)), gr.exports;
}
var yr = { exports: {} }, Bl = yr.exports, Qs;
function Dl() {
  return Qs || (Qs = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(Bl, function(t) {
      return t.pad.Iso97971 = {
        pad: function(r, s) {
          r.concat(t.lib.WordArray.create([2147483648], 1)), t.pad.ZeroPadding.pad(r, s);
        },
        unpad: function(r) {
          t.pad.ZeroPadding.unpad(r), r.sigBytes--;
        }
      }, t.pad.Iso97971;
    });
  })(yr)), yr.exports;
}
var Er = { exports: {} }, Rl = Er.exports, ei;
function Ol() {
  return ei || (ei = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(Rl, function(t) {
      return t.pad.ZeroPadding = {
        pad: function(r, s) {
          var i = s * 4;
          r.clamp(), r.sigBytes += i - (r.sigBytes % i || i);
        },
        unpad: function(r) {
          for (var s = r.words, i = r.sigBytes - 1, i = r.sigBytes - 1; i >= 0; i--)
            if (s[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
              r.sigBytes = i + 1;
              break;
            }
        }
      }, t.pad.ZeroPadding;
    });
  })(Er)), Er.exports;
}
var vr = { exports: {} }, Tl = vr.exports, ti;
function Pl() {
  return ti || (ti = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(Tl, function(t) {
      return t.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      }, t.pad.NoPadding;
    });
  })(vr)), vr.exports;
}
var Cr = { exports: {} }, Ll = Cr.exports, ri;
function kl() {
  return ri || (ri = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), xe());
    })(Ll, function(t) {
      return (function(r) {
        var s = t, i = s.lib, a = i.CipherParams, o = s.enc, l = o.Hex, c = s.format;
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
      })(), t.format.Hex;
    });
  })(Cr)), Cr.exports;
}
var wr = { exports: {} }, Il = wr.exports, ni;
function Nl() {
  return ni || (ni = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), nt(), st(), Xe(), xe());
    })(Il, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.BlockCipher, a = r.algo, o = [], l = [], c = [], u = [], h = [], f = [], p = [], m = [], E = [], y = [];
        (function() {
          for (var d = [], x = 0; x < 256; x++)
            x < 128 ? d[x] = x << 1 : d[x] = x << 1 ^ 283;
          for (var A = 0, w = 0, x = 0; x < 256; x++) {
            var S = w ^ w << 1 ^ w << 2 ^ w << 3 ^ w << 4;
            S = S >>> 8 ^ S & 255 ^ 99, o[A] = S, l[S] = A;
            var b = d[A], R = d[b], _ = d[R], F = d[S] * 257 ^ S * 16843008;
            c[A] = F << 24 | F >>> 8, u[A] = F << 16 | F >>> 16, h[A] = F << 8 | F >>> 24, f[A] = F;
            var F = _ * 16843009 ^ R * 65537 ^ b * 257 ^ A * 16843008;
            p[S] = F << 24 | F >>> 8, m[S] = F << 16 | F >>> 16, E[S] = F << 8 | F >>> 24, y[S] = F, A ? (A = b ^ d[d[d[_ ^ b]]], w ^= d[d[w]]) : A = w = 1;
          }
        })();
        var C = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], g = a.AES = i.extend({
          _doReset: function() {
            var d;
            if (!(this._nRounds && this._keyPriorReset === this._key)) {
              for (var x = this._keyPriorReset = this._key, A = x.words, w = x.sigBytes / 4, S = this._nRounds = w + 6, b = (S + 1) * 4, R = this._keySchedule = [], _ = 0; _ < b; _++)
                _ < w ? R[_] = A[_] : (d = R[_ - 1], _ % w ? w > 6 && _ % w == 4 && (d = o[d >>> 24] << 24 | o[d >>> 16 & 255] << 16 | o[d >>> 8 & 255] << 8 | o[d & 255]) : (d = d << 8 | d >>> 24, d = o[d >>> 24] << 24 | o[d >>> 16 & 255] << 16 | o[d >>> 8 & 255] << 8 | o[d & 255], d ^= C[_ / w | 0] << 24), R[_] = R[_ - w] ^ d);
              for (var F = this._invKeySchedule = [], B = 0; B < b; B++) {
                var _ = b - B;
                if (B % 4)
                  var d = R[_];
                else
                  var d = R[_ - 4];
                B < 4 || _ <= 4 ? F[B] = d : F[B] = p[o[d >>> 24]] ^ m[o[d >>> 16 & 255]] ^ E[o[d >>> 8 & 255]] ^ y[o[d & 255]];
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
          _doCryptBlock: function(d, x, A, w, S, b, R, _) {
            for (var F = this._nRounds, B = d[x] ^ A[0], D = d[x + 1] ^ A[1], N = d[x + 2] ^ A[2], U = d[x + 3] ^ A[3], q = 4, Z = 1; Z < F; Z++) {
              var V = w[B >>> 24] ^ S[D >>> 16 & 255] ^ b[N >>> 8 & 255] ^ R[U & 255] ^ A[q++], G = w[D >>> 24] ^ S[N >>> 16 & 255] ^ b[U >>> 8 & 255] ^ R[B & 255] ^ A[q++], j = w[N >>> 24] ^ S[U >>> 16 & 255] ^ b[B >>> 8 & 255] ^ R[D & 255] ^ A[q++], T = w[U >>> 24] ^ S[B >>> 16 & 255] ^ b[D >>> 8 & 255] ^ R[N & 255] ^ A[q++];
              B = V, D = G, N = j, U = T;
            }
            var V = (_[B >>> 24] << 24 | _[D >>> 16 & 255] << 16 | _[N >>> 8 & 255] << 8 | _[U & 255]) ^ A[q++], G = (_[D >>> 24] << 24 | _[N >>> 16 & 255] << 16 | _[U >>> 8 & 255] << 8 | _[B & 255]) ^ A[q++], j = (_[N >>> 24] << 24 | _[U >>> 16 & 255] << 16 | _[B >>> 8 & 255] << 8 | _[D & 255]) ^ A[q++], T = (_[U >>> 24] << 24 | _[B >>> 16 & 255] << 16 | _[D >>> 8 & 255] << 8 | _[N & 255]) ^ A[q++];
            d[x] = V, d[x + 1] = G, d[x + 2] = j, d[x + 3] = T;
          },
          keySize: 256 / 32
        });
        r.AES = i._createHelper(g);
      })(), t.AES;
    });
  })(wr)), wr.exports;
}
var _r = { exports: {} }, Ul = _r.exports, si;
function ql() {
  return si || (si = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), nt(), st(), Xe(), xe());
    })(Ul, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.WordArray, a = s.BlockCipher, o = r.algo, l = [
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
            for (var w = this._subKeys = [], S = 0; S < 16; S++) {
              for (var b = w[S] = [], R = u[S], x = 0; x < 24; x++)
                b[x / 6 | 0] |= d[(c[x] - 1 + R) % 28] << 31 - x % 6, b[4 + (x / 6 | 0)] |= d[28 + (c[x + 24] - 1 + R) % 28] << 31 - x % 6;
              b[0] = b[0] << 1 | b[0] >>> 31;
              for (var x = 1; x < 7; x++)
                b[x] = b[x] >>> (x - 1) * 4 + 3;
              b[7] = b[7] << 5 | b[7] >>> 27;
            }
            for (var _ = this._invSubKeys = [], x = 0; x < 16; x++)
              _[x] = w[15 - x];
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
              for (var A = d[x], w = this._lBlock, S = this._rBlock, b = 0, R = 0; R < 8; R++)
                b |= h[R][((S ^ A[R]) & f[R]) >>> 0];
              this._lBlock = S, this._rBlock = w ^ b;
            }
            var _ = this._lBlock;
            this._lBlock = this._rBlock, this._rBlock = _, m.call(this, 1, 1431655765), E.call(this, 8, 16711935), E.call(this, 2, 858993459), m.call(this, 16, 65535), m.call(this, 4, 252645135), C[g] = this._lBlock, C[g + 1] = this._rBlock;
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
      })(), t.TripleDES;
    });
  })(_r)), _r.exports;
}
var Ar = { exports: {} }, Ml = Ar.exports, ii;
function Hl() {
  return ii || (ii = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), nt(), st(), Xe(), xe());
    })(Ml, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.StreamCipher, a = r.algo, o = a.RC4 = i.extend({
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
      })(), t.RC4;
    });
  })(Ar)), Ar.exports;
}
var br = { exports: {} }, $l = br.exports, ai;
function zl() {
  return ai || (ai = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), nt(), st(), Xe(), xe());
    })($l, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.StreamCipher, a = r.algo, o = [], l = [], c = [], u = a.Rabbit = i.extend({
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
              var C = p.words, g = C[0], d = C[1], x = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, A = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, w = x >>> 16 | A & 4294901760, S = A << 16 | x & 65535;
              y[0] ^= x, y[1] ^= w, y[2] ^= A, y[3] ^= S, y[4] ^= x, y[5] ^= w, y[6] ^= A, y[7] ^= S;
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
      })(), t.Rabbit;
    });
  })(br)), br.exports;
}
var Fr = { exports: {} }, jl = Fr.exports, oi;
function Wl() {
  return oi || (oi = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), nt(), st(), Xe(), xe());
    })(jl, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.StreamCipher, a = r.algo, o = [], l = [], c = [], u = a.RabbitLegacy = i.extend({
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
              var C = p.words, g = C[0], d = C[1], x = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, A = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, w = x >>> 16 | A & 4294901760, S = A << 16 | x & 65535;
              E[0] ^= x, E[1] ^= w, E[2] ^= A, E[3] ^= S, E[4] ^= x, E[5] ^= w, E[6] ^= A, E[7] ^= S;
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
      })(), t.RabbitLegacy;
    });
  })(Fr)), Fr.exports;
}
var Sr = { exports: {} }, Gl = Sr.exports, ci;
function Kl() {
  return ci || (ci = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), nt(), st(), Xe(), xe());
    })(Gl, function(t) {
      return (function() {
        var r = t, s = r.lib, i = s.BlockCipher, a = r.algo;
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
          let g = C >> 24 & 255, d = C >> 16 & 255, x = C >> 8 & 255, A = C & 255, w = y.sbox[0][g] + y.sbox[1][d];
          return w = w ^ y.sbox[2][x], w = w + y.sbox[3][A], w;
        }
        function f(y, C, g) {
          let d = C, x = g, A;
          for (let w = 0; w < o; ++w)
            d = d ^ y.pbox[w], x = h(y, d) ^ x, A = d, d = x, x = A;
          return A = d, d = x, x = A, x = x ^ y.pbox[o], d = d ^ y.pbox[o + 1], { left: d, right: x };
        }
        function p(y, C, g) {
          let d = C, x = g, A;
          for (let w = o + 1; w > 1; --w)
            d = d ^ y.pbox[w], x = h(y, d) ^ x, A = d, d = x, x = A;
          return A = d, d = x, x = A, x = x ^ y.pbox[1], d = d ^ y.pbox[0], { left: d, right: x };
        }
        function m(y, C, g) {
          for (let S = 0; S < 4; S++) {
            y.sbox[S] = [];
            for (let b = 0; b < 256; b++)
              y.sbox[S][b] = c[S][b];
          }
          let d = 0;
          for (let S = 0; S < o + 2; S++)
            y.pbox[S] = l[S] ^ C[d], d++, d >= g && (d = 0);
          let x = 0, A = 0, w = 0;
          for (let S = 0; S < o + 2; S += 2)
            w = f(y, x, A), x = w.left, A = w.right, y.pbox[S] = x, y.pbox[S + 1] = A;
          for (let S = 0; S < 4; S++)
            for (let b = 0; b < 256; b += 2)
              w = f(y, x, A), x = w.left, A = w.right, y.sbox[S][b] = x, y.sbox[S][b + 1] = A;
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
      })(), t.Blowfish;
    });
  })(Sr)), Sr.exports;
}
var Xl = Gt.exports, li;
function Zl() {
  return li || (li = 1, (function(n, e) {
    (function(t, r, s) {
      n.exports = r(z(), $r(), Wc(), Kc(), nt(), Vc(), st(), aa(), Tn(), tl(), oa(), sl(), al(), cl(), Pn(), fl(), Xe(), xe(), pl(), gl(), El(), Cl(), _l(), bl(), Sl(), Dl(), Ol(), Pl(), kl(), Nl(), ql(), Hl(), zl(), Wl(), Kl());
    })(Xl, function(t) {
      return t;
    });
  })(Gt)), Gt.exports;
}
var nn = Zl();
class Pe {
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
      throw new De("The request is unauthorized without being connected", Be.UNAUTHORIZED);
  }
}
class Vl extends Pe {
  /**
   * Récupère tous les utilisateurs (les 10 premiers par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), re(e, "getUsers"), await this.client.doRequest("/users", "get", null, e);
  }
  /**
   * Récupère l'utilisateur d'identifiant donné
   * @param {Integer|String} id un identifiant ou "me"
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e = "me", t = {}) {
    if (e != "me" && (isNaN(parseInt(e)) || parseInt(e) < 0)) throw new De('id must be "me" or positive number', Be.USER_ID_INVALID);
    return re(t, "getUser"), await this.client.doRequest("/users/" + e, "get", null, t);
  }
  /**
   * Met a jour un utilisateur sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t = null, r = null) {
    return this.requireAuth(), k(e), Y(t, "patchUser"), await this.client.doRequest("/users/" + e, "patch", t, null, r);
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
class Yl extends Pe {
  /**
   * Récupère toutes les bases de données (les 10 premières par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), re(e, "getDatabases"), await this.client.doRequest("/databases", "get", null, e);
  }
  /**
   * Récupère la base de données d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getDatabase"), await this.client.doRequest("/databases/" + e, "get", null, t);
  }
  /**
   * Ajoute une base de données
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), Y(e, "addDatabase"), await this.client.doRequest("/databases", "post", e, null, t);
  }
  /**
   * Met a jour une base de données en remplacant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "putDatabase"), await this.client.doRequest("/databases/" + e, "put", t, null, r);
  }
  /**
   * Met a jour une base de données sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "patchDatabase"), await this.client.doRequest("/databases/" + e, "patch", t, null, r);
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
class Jl extends Pe {
  /**
   * Récupère tous les groupes (les 10 premiers par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), re(e, "getCommunities"), await this.client.doRequest("/communities", "get", null, e);
  }
  /**
   * Récupère le groupe d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getCommunity"), await this.client.doRequest("/communities/" + e, "get", null, t);
  }
  /**
   * Ajoute un groupe
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), Y(e, "addCommunity"), await this.client.doRequest("/communities", "post", e, null, t);
  }
  /**
   * Met a jour un groupe en remplacant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "putCommunity"), await this.client.doRequest("/communities/" + e, "put", t, null, r);
  }
  /**
   * Met a jour un groupe sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "patchCommunity"), await this.client.doRequest("/communities/" + e, "patch", t, null, r);
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
class Ql extends Pe {
  /**
     * Récupère toutes les colonnes (les 10 premières par defaut)
     * @param {Integer} databaseId l'identifiant de la base de données des colonnes
     * @param {Integer} tableId l'identifiant de la table des colonnes
     * @param {Object} parameters 
     * @returns {Promise}
     */
  async getAll(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getColumns"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns", "get", null, r);
  }
  /**
   * Récupère la colonne d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r, s = {}) {
    return this.requireAuth(), k(e), k(t), k(r), re(s, "getColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "get", null, s);
  }
  /**
   * Ajoute une colonne
   * @param {Integer} databaseId l'identifiant de base de données de la colonne
   * @param {Integer} tableId l'identifiant de la table de la colonne
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "addColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns", "post", r, null, s);
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
  async put(e, t, r, s, i = null) {
    return this.requireAuth(), k(e), k(t), k(r), Y(s, "putColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "put", s, null, i);
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
  async patch(e, t, r, s, i = null) {
    return this.requireAuth(), k(e), k(t), k(r), Y(s, "patchColumn"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/columns/" + r, "patch", s, null, i);
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
class eu extends Pe {
  /**
   * Récupère tous les objets (les 10 premiers par defaut)
   * @param {Integer} databaseId l'identifiant de la base de données des objets
   * @param {Integer} tableId l'identifiant de la table des objets
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getFeatures"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features", "get", null, r);
  }
  /**
   * Récupère l objet d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de l objet
   * @param {Integer} tableId l'identifiant de la table de l objet
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r, s = {}) {
    return this.requireAuth(), k(e), k(t), k(r), re(s, "getFeature"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features/" + r, "get", null, s);
  }
  /**
   * Ajoute un objet
   * @param {Integer} databaseId l'identifiant de base de données de l objet
   * @param {Integer} tableId l'identifiant de la table de l objet
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features", "post", r, null, s);
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
  async patch(e, t, r, s, i = null) {
    return this.requireAuth(), k(e), k(t), k(r), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/features/" + r, "patch", s, null, i);
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
class tu extends Pe {
  /**
   * Récupère tous les geoservices (les 10 premiers par defaut)
   * @param {Object} parameters
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), re(e, "getGeoservices"), await this.client.doRequest("/geoservices", "get", null, e);
  }
  /**
   * Récupère le geoservice d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getGeoservice"), await this.client.doRequest("/geoservices/" + e, "get", null, t);
  }
  /**
   * Ajoute un geoservice
   * @param {Object} body
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), Y(e, "addGeoservice"), await this.client.doRequest("/geoservices", "post", e, null, t);
  }
  /**
   * Met a jour un geoservice en remplaçant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "putGeoservice"), await this.client.doRequest("/geoservices/" + e, "put", t, null, r);
  }
  /**
   * Met a jour un geoservice sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "patchGeoservice"), await this.client.doRequest("/geoservices/" + e, "patch", t, null, r);
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
class ru extends Pe {
  /**
   * Récupère toutes les couches (les 10 premières par defaut)
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getLayers"), await this.client.doRequest("/communities/" + e + "/layers", "get", null, t);
  }
  /**
   * Récupère la couche d'identifiant donné
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getLayer"), await this.client.doRequest("/communities/" + e + "/layers/" + t, "get", null, r);
  }
  /**
   * Ajoute une couche
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "addLayer"), await this.client.doRequest("/communities/" + e + "/layers", "post", t, null, r);
  }
  /**
   * Met a jour une couche en remplaçant la totalité de l'objet
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "putLayer"), await this.client.doRequest("/communities/" + e + "/layers/" + t, "put", r, null, s);
  }
  /**
   * Met a jour une couche sans remplacer la totalité de l'objet
   * @param {Integer} communityId l'identifiant de groupe auquel est rattachée la couche
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "patchLayer"), await this.client.doRequest("/communities/" + e + "/layers/" + t, "patch", r, null, s);
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
class nu extends Pe {
  /**
     * Récupère tous les membres (les 10 premiers par defaut)
     * @param {Integer} communityId l'identifiant du groupe des membres
     * @param {Object} parameters 
     * @returns {Promise}
     */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getMembers"), await this.client.doRequest("/communities/" + e + "/members", "get", null, t);
  }
  /**
   * Récupère le membre d'identifiant donné
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getMember"), await this.client.doRequest("/communities/" + e + "/members/" + t, "get", null, r);
  }
  /**
   * Ajoute un membre
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "addMember"), await this.client.doRequest("/communities/" + e + "/members", "post", t, null, r);
  }
  /**
   * Met a jour un membre en remplaçant la totalité de l'objet
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "putMember"), await this.client.doRequest("/communities/" + e + "/members/" + t, "put", r, null, s);
  }
  /**
   * Met a jour un membre sans remplacer la totalité de l'objet
   * @param {Integer} communityId l'identifiant du groupe du membre
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "patchMember"), await this.client.doRequest("/communities/" + e + "/members/" + t, "patch", r, null, s);
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
class su extends Pe {
  /**
   * Récupère toutes les permissions (les 10 premières par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return this.requireAuth(), re(e, "getPermissions"), await this.client.doRequest("/permissions", "get", null, e);
  }
  /**
   * Récupère la permission d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getPermission"), await this.client.doRequest("/permissions/" + e, "get", null, t);
  }
  /**
   * Ajoute une permission
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t = null) {
    return this.requireAuth(), Y(e, "addPermission"), await this.client.doRequest("/permissions", "post", e, null, t);
  }
  /**
   * Met a jour une permission en remplaçant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "putPermission"), await this.client.doRequest("/permissions/" + e, "put", t, null, r);
  }
  /**
   * Met a jour une permission sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "patchPermission"), await this.client.doRequest("/permissions/" + e, "patch", t, null, r);
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
class iu extends Pe {
  /**
   * Récupère toutes les alertes (les 10 premières par defaut)
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e = {}) {
    return re(e, "getReports"), await this.client.doRequest("/reports", "get", null, e);
  }
  /**
   * Récupère l'alerte d'identifiant donné
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t = {}) {
    return k(e), re(t, "getReport"), await this.client.doRequest("/reports/" + e, "get", null, t);
  }
  /**
   * Ajoute une alerte
   * @param {Object} body 
   * documents must be passed as blob
   * @returns {Promise}
   */
  async add(e) {
    return this.requireAuth(), Y(e, "addReport"), tn(e), await this.client.doRequest("/reports", "post", e, null, "multipart/form-data");
  }
  /**
   * Met a jour une alerte en remplaçant la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @returns {Promise}
   */
  async put(e, t) {
    return this.requireAuth(), k(e), Y(t, "putReport"), tn(t), await this.client.doRequest("/reports/" + e, "put", t, null, "multipart/form-data");
  }
  /**
   * Met a jour une alerte sans remplacer la totalité de l'objet
   * @param {Integer} id 
   * @param {Object} body 
   * @returns {Promise}
   */
  async patch(e, t) {
    return this.requireAuth(), k(e), Y(t, "patchReport"), await this.client.doRequest("/reports/" + e, "patch", t);
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
    return this.requireAuth(), k(e), tn(t), await this.client.doRequest("/reports/" + e + "/attachments", "post", t, null, "multipart/form-data");
  }
  /**
   * Ajoute une reponse a une alerte
   * @param {Integer} reportId
   * @param {Object} body
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async addReply(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "addReply"), await this.client.doRequest("/reports/" + e + "/replies", "post", t, null, r);
  }
}
class au extends Pe {
  /**
   * Récupère toutes les tables (les 10 premières par defaut)
   * @param {Integer} databaseId l'identifiant de la base de données des tables
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getTables"), await this.client.doRequest("/databases/" + e + "/tables", "get", null, t);
  }
  /**
   * Récupère la table d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getTable"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "get", null, r);
  }
  /**
   * Récupère le numrec maximum parmi les objets de la table
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id
   * @param {Object} parameters
   * @returns {Promise}
   */
  async getMaxNumrec(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getTableMaxNumrec"), await this.client.doRequest("/databases/" + e + "/tables/" + t + "/max-numrec", "get", null, r);
  }
  /**
   * Ajoute une table
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "addTable"), await this.client.doRequest("/databases/" + e + "/tables", "post", t, null, r);
  }
  /**
   * Met a jour une table en remplaçant la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async put(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "putTable"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "put", r, null, s);
  }
  /**
   * Met a jour une table sans remplacer la totalité de l'objet
   * @param {Integer} databaseId l'identifiant de base de données de la table
   * @param {Integer} id 
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async patch(e, t, r, s = null) {
    return this.requireAuth(), k(e), k(t), Y(r, "patchTable"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "patch", r, null, s);
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
class ou extends Pe {
  /**
   * Récupère toutes les transactions (les 10 premières par defaut)
   * @param {Integer} databaseId l'identifiant de la base de données des transactions
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async getAll(e, t = {}) {
    return this.requireAuth(), k(e), re(t, "getTransactions"), await this.client.doRequest("/databases/" + e + "/transactions", "get", null, t);
  }
  /**
   * Récupère la transaction d'identifiant donné
   * @param {Integer} databaseId l'identifiant de base de données de la transaction
   * @param {Integer} id
   * @param {Object} parameters 
   * @returns {Promise}
   */
  async get(e, t, r = {}) {
    return this.requireAuth(), k(e), k(t), re(r, "getTransaction"), await this.client.doRequest("/databases/" + e + "/tables/" + t, "get", null, r);
  }
  /**
   * Ajoute une transaction
   * @param {Integer} databaseId l'identifiant de base de données de la transaction
   * @param {Object} body 
   * @param {String} contentType si besoin autre que json
   * @returns {Promise}
   */
  async add(e, t, r = null) {
    return this.requireAuth(), k(e), Y(t, "addTransaction"), await this.client.doRequest("/databases/" + e + "/transactions", "post", t, null, r);
  }
}
function ca(n) {
  return new Promise((e) => setTimeout(e, n));
}
const ui = 2e3;
class cu {
  constructor(e) {
    this.minIntervalMs = e > 0 ? 1e3 / e : 0, this.nextSlotAt = 0, this.chain = Promise.resolve();
  }
  enqueue(e) {
    let t = () => {
    };
    const r = new Promise((i) => {
      t = i;
    }), s = this.chain;
    return this.chain = s.then(() => r), s.then(async () => {
      const i = Date.now(), a = Math.max(0, this.nextSlotAt - i);
      return this.nextSlotAt = Math.max(i, this.nextSlotAt) + this.minIntervalMs, a > 0 && await ca(a), t(), e();
    });
  }
}
function lu(n) {
  const e = n?.response?.headers?.["retry-after"];
  if (e == null || e === "")
    return 1e3;
  const t = Number(e);
  if (Number.isFinite(t))
    return Math.min(ui, Math.max(0, t * 1e3));
  const r = Date.parse(String(e));
  return Number.isFinite(r) ? Math.min(ui, Math.max(0, r - Date.now())) : 1e3;
}
const uu = 25, fu = 3;
class hu {
  /**
   * @constructor
   * @param {String} apiBaseUrl ex: https://espacecollaboratif.ign.fr/gcms/api
   * @param {String} authBaseUrl ex: https://iam-url/auth/realms/demo/protocol/openid-connect
   * @param {String} clientId
   * @param {String} clientSecret
   * @param {{ requestsPerSecond?: number, maxRetries?: number }} options
   */
  constructor(e, t = null, r = null, s = null, i = {}) {
    if (!e) throw new De("Mandatory parameter apiBaseUrl is missing.", Be.BASE_URL_MISSING);
    const a = i ?? {};
    if (this.requestsPerSecond = a.requestsPerSecond ?? uu, this.maxRetries = a.maxRetries ?? fu, this.requestScheduler = new cu(this.requestsPerSecond), t && r && !this.setAuthParams(t, r, s))
      throw new De("Failed to configure Auth Client", Be.CLIENT_CONFIGURATION_ERROR);
    this.secret = null;
    try {
      this.secret = process.env.SECRET;
    } finally {
      this.secret || (this.secret = "A secret not so secret");
    }
    this.axiosInstance = se.create({
      baseURL: e
    }), this._initResources();
  }
  _initResources() {
    this.user = new Vl(this), this.database = new Yl(this), this.community = new Jl(this), this.column = new Ql(this), this.feature = new eu(this), this.geoservice = new tu(this), this.layer = new ru(this), this.member = new nu(this), this.permission = new su(this), this.report = new iu(this), this.table = new au(this), this.transaction = new ou(this);
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
      return this.disconnect(), this.clientAuth = new Ic(e, t, r), this.accessToken = null, this.username = null, this.password = null, !0;
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
    this.username = e, r ? this.password = t : this.password = nn.AES.encrypt(JSON.stringify(t), this.secret).toString(), this.username && e != this.username && this.disconnect();
  }
  /**
     * Configure un token obtenu via SSO externe (PKCE ou autre)
     * Permet d'utiliser l'API sans fournir de credentials
     * @param {String} accessToken - Le token d'accès OAuth2
     * @param {String} refreshToken - Le refresh token (optionnel)
     * @param {Number} expiresIn - Durée de validité en secondes (défaut: 43200 -> 12 heures)
     * @param {Number} refreshExpiresIn - Durée du refresh token en secondes
     */
  setExternalToken(e, t = null, r = 43200, s = null) {
    if (!this.clientAuth)
      throw new De("Auth client must be configured first. Call setAuthParams() before setExternalToken()", Be.CLIENT_CONFIGURATION_ERROR);
    this.clientAuth.setExternalToken(e, t, r, s), this.username = null, this.password = null;
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
      throw new De("Auth client must be configured first. Call setAuthParams() before adding authorization", Be.CLIENT_CONFIGURATION_ERROR);
    if (this.clientAuth.usesExternalToken) {
      let t = await this.clientAuth.fetchToken(null);
      e.headers = { Authorization: "Bearer " + t };
    } else if (this.username && this.password) {
      let t = {
        username: this.username,
        password: JSON.parse(nn.AES.decrypt(this.password, this.secret).toString(nn.enc.Utf8))
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
  async doRequest(e, t, r = null, s = null, i = "application/json") {
    let a = {
      url: e,
      method: t,
      params: s
    };
    return await this.addAuthorization(a), r && ["application/x-www-form-urlencoded", "multipart/form-data"].includes(i) && (r = ia(r)), r && (a.headers["Content-Type"] = i || "application/json", a.data = r), await this._sendLimited(() => this.axiosInstance.request(a));
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
    let t = 0;
    for (; ; )
      try {
        return await this.requestScheduler.enqueue(e);
      } catch (r) {
        if (r?.response?.status !== 429 || t >= this.maxRetries)
          throw r;
        t += 1;
        const i = lu(r);
        i > 0 && await ca(i);
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
  async putLayer(e, t, r, s = null) {
    return await this.layer.put(e, t, r, s);
  }
  async patchLayer(e, t, r, s = null) {
    return await this.layer.patch(e, t, r, s);
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
  async putTable(e, t, r, s = null) {
    return await this.table.put(e, t, r, s);
  }
  async patchTable(e, t, r, s = null) {
    return await this.table.patch(e, t, r, s);
  }
  async deleteTable(e, t) {
    return await this.table.delete(e, t);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getColumns(e, t, r = {}) {
    return await this.column.getAll(e, t, r);
  }
  async getColumn(e, t, r, s = {}) {
    return await this.column.get(e, t, r, s);
  }
  async addColumn(e, t, r, s = null) {
    return await this.column.add(e, t, r, s);
  }
  async putColumn(e, t, r, s, i = null) {
    return await this.column.put(e, t, r, s, i);
  }
  async patchColumn(e, t, r, s, i = null) {
    return await this.column.patch(e, t, r, s, i);
  }
  async deleteColumn(e, t, r) {
    return await this.column.delete(e, t, r);
  }
  // Fonctions gardées pour rétro-compatibilité
  async getFeatures(e, t, r = {}) {
    return await this.feature.getAll(e, t, r);
  }
  async getFeature(e, t, r, s = {}) {
    return await this.feature.get(e, t, r, s);
  }
  async addFeature(e, t, r, s = null) {
    return await this.feature.add(e, t, r, s);
  }
  async patchFeature(e, t, r, s, i = null) {
    return await this.feature.patch(e, t, r, s, i);
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
  async putMember(e, t, r, s = null) {
    return await this.member.put(e, t, r, s);
  }
  async patchMember(e, t, r, s = null) {
    return await this.member.patch(e, t, r, s);
  }
  async deleteMember(e, t) {
    return await this.member.delete(e, t);
  }
}
var dt;
(function(n) {
  n.Unimplemented = "UNIMPLEMENTED", n.Unavailable = "UNAVAILABLE";
})(dt || (dt = {}));
class sn extends Error {
  constructor(e, t, r) {
    super(e), this.message = e, this.code = t, this.data = r;
  }
}
const du = (n) => {
  var e, t;
  return n?.androidBridge ? "android" : !((t = (e = n?.webkit) === null || e === void 0 ? void 0 : e.messageHandlers) === null || t === void 0) && t.bridge ? "ios" : "web";
}, xu = (n) => {
  const e = n.CapacitorCustomPlatform || null, t = n.Capacitor || {}, r = t.Plugins = t.Plugins || {}, s = () => e !== null ? e.name : du(n), i = () => s() !== "web", a = (h) => {
    const f = c.get(h);
    return !!(f?.platforms.has(s()) || o(h));
  }, o = (h) => {
    var f;
    return (f = t.PluginHeaders) === null || f === void 0 ? void 0 : f.find((p) => p.name === h);
  }, l = (h) => n.console.error(h), c = /* @__PURE__ */ new Map(), u = (h, f = {}) => {
    const p = c.get(h);
    if (p)
      return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`), p.proxy;
    const m = s(), E = o(h);
    let y;
    const C = async () => (!y && m in f ? y = typeof f[m] == "function" ? y = await f[m]() : y = f[m] : e !== null && !y && "web" in f && (y = typeof f.web == "function" ? y = await f.web() : y = f.web), y), g = (b, R) => {
      var _, F;
      if (E) {
        const B = E?.methods.find((D) => R === D.name);
        if (B)
          return B.rtype === "promise" ? (D) => t.nativePromise(h, R.toString(), D) : (D, N) => t.nativeCallback(h, R.toString(), D, N);
        if (b)
          return (_ = b[R]) === null || _ === void 0 ? void 0 : _.bind(b);
      } else {
        if (b)
          return (F = b[R]) === null || F === void 0 ? void 0 : F.bind(b);
        throw new sn(`"${h}" plugin is not implemented on ${m}`, dt.Unimplemented);
      }
    }, d = (b) => {
      let R;
      const _ = (...F) => {
        const B = C().then((D) => {
          const N = g(D, b);
          if (N) {
            const U = N(...F);
            return R = U?.remove, U;
          } else
            throw new sn(`"${h}.${b}()" is not implemented on ${m}`, dt.Unimplemented);
        });
        return b === "addListener" && (B.remove = async () => R()), B;
      };
      return _.toString = () => `${b.toString()}() { [capacitor code] }`, Object.defineProperty(_, "name", {
        value: b,
        writable: !1,
        configurable: !1
      }), _;
    }, x = d("addListener"), A = d("removeListener"), w = (b, R) => {
      const _ = x({ eventName: b }, R), F = async () => {
        const D = await _;
        A({
          eventName: b,
          callbackId: D
        }, R);
      }, B = new Promise((D) => _.then(() => D({ remove: F })));
      return B.remove = async () => {
        console.warn("Using addListener() without 'await' is deprecated."), await F();
      }, B;
    }, S = new Proxy({}, {
      get(b, R) {
        switch (R) {
          // https://github.com/facebook/react/issues/20030
          case "$$typeof":
            return;
          case "toJSON":
            return () => ({});
          case "addListener":
            return E ? w : x;
          case "removeListener":
            return A;
          default:
            return d(R);
        }
      }
    });
    return r[h] = S, c.set(h, {
      name: h,
      proxy: S,
      platforms: /* @__PURE__ */ new Set([...Object.keys(f), ...E ? [m] : []])
    }), S;
  };
  return t.convertFileSrc || (t.convertFileSrc = (h) => h), t.getPlatform = s, t.handleError = l, t.isNativePlatform = i, t.isPluginAvailable = a, t.registerPlugin = u, t.Exception = sn, t.DEBUG = !!t.DEBUG, t.isLoggingEnabled = !!t.isLoggingEnabled, t;
}, pu = (n) => n.Capacitor = xu(n), yn = /* @__PURE__ */ pu(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), mt = yn.registerPlugin;
class Ln {
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
    const s = this.listeners[e];
    if (!s) {
      if (r) {
        let i = this.retainedEventArguments[e];
        i || (i = []), i.push(t), this.retainedEventArguments[e] = i;
      }
      return;
    }
    s.forEach((i) => i(t));
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
    return new yn.Exception(e, dt.Unimplemented);
  }
  unavailable(e = "not available") {
    return new yn.Exception(e, dt.Unavailable);
  }
  async removeListener(e, t) {
    const r = this.listeners[e];
    if (!r)
      return;
    const s = r.indexOf(t);
    s !== -1 && this.listeners[e].splice(s, 1), this.listeners[e].length || this.removeWindowListener(this.windowListeners[e]);
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
const fi = (n) => encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape), hi = (n) => n.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class mu extends Ln {
  async getCookies() {
    const e = document.cookie, t = {};
    return e.split(";").forEach((r) => {
      if (r.length <= 0)
        return;
      let [s, i] = r.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      s = hi(s).trim(), i = hi(i).trim(), t[s] = i;
    }), t;
  }
  async setCookie(e) {
    try {
      const t = fi(e.key), r = fi(e.value), s = e.expires ? `; expires=${e.expires.replace("expires=", "")}` : "", i = (e.path || "/").replace("path=", ""), a = e.url != null && e.url.length > 0 ? `domain=${e.url}` : "";
      document.cookie = `${t}=${r || ""}${s}; path=${i}; ${a};`;
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
mt("CapacitorCookies", {
  web: () => new mu()
});
const gu = async (n) => new Promise((e, t) => {
  const r = new FileReader();
  r.onload = () => {
    const s = r.result;
    e(s.indexOf(",") >= 0 ? s.split(",")[1] : s);
  }, r.onerror = (s) => t(s), r.readAsDataURL(n);
}), yu = (n = {}) => {
  const e = Object.keys(n);
  return Object.keys(n).map((s) => s.toLocaleLowerCase()).reduce((s, i, a) => (s[i] = n[e[a]], s), {});
}, Eu = (n, e = !0) => n ? Object.entries(n).reduce((r, s) => {
  const [i, a] = s;
  let o, l;
  return Array.isArray(a) ? (l = "", a.forEach((c) => {
    o = e ? encodeURIComponent(c) : c, l += `${i}=${o}&`;
  }), l.slice(0, -1)) : (o = e ? encodeURIComponent(a) : a, l = `${i}=${o}`), `${r}&${l}`;
}, "").substr(1) : null, vu = (n, e = {}) => {
  const t = Object.assign({ method: n.method || "GET", headers: n.headers }, e), s = yu(n.headers)["content-type"] || "";
  if (typeof n.data == "string")
    t.body = n.data;
  else if (s.includes("application/x-www-form-urlencoded")) {
    const i = new URLSearchParams();
    for (const [a, o] of Object.entries(n.data || {}))
      i.set(a, o);
    t.body = i.toString();
  } else if (s.includes("multipart/form-data") || n.data instanceof FormData) {
    const i = new FormData();
    if (n.data instanceof FormData)
      n.data.forEach((o, l) => {
        i.append(l, o);
      });
    else
      for (const o of Object.keys(n.data))
        i.append(o, n.data[o]);
    t.body = i;
    const a = new Headers(t.headers);
    a.delete("content-type"), t.headers = a;
  } else (s.includes("application/json") || typeof n.data == "object") && (t.body = JSON.stringify(n.data));
  return t;
};
class Cu extends Ln {
  /**
   * Perform an Http request given a set of options
   * @param options Options to build the HTTP request
   */
  async request(e) {
    const t = vu(e, e.webFetchExtra), r = Eu(e.params, e.shouldEncodeUrlParams), s = r ? `${e.url}?${r}` : e.url, i = await fetch(s, t), a = i.headers.get("content-type") || "";
    let { responseType: o = "text" } = i.ok ? e : {};
    a.includes("application/json") && (o = "json");
    let l, c;
    switch (o) {
      case "arraybuffer":
      case "blob":
        c = await i.blob(), l = await gu(c);
        break;
      case "json":
        l = await i.json();
        break;
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
const an = mt("CapacitorHttp", {
  web: () => new Cu()
});
var di;
(function(n) {
  n.Dark = "DARK", n.Light = "LIGHT", n.Default = "DEFAULT";
})(di || (di = {}));
var xi;
(function(n) {
  n.StatusBar = "StatusBar", n.NavigationBar = "NavigationBar";
})(xi || (xi = {}));
class wu extends Ln {
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
mt("SystemBars", {
  web: () => new wu()
});
const pi = mt("Browser", {
  web: () => import("./web-CZ_X6wEK.js").then((n) => new n.BrowserWeb())
}), _u = mt("App", {
  web: () => import("./web-BndEfL7h.js").then((n) => new n.AppWeb())
}), Au = mt("Device", {
  web: () => import("./web-C_6F7IMk.js").then((n) => new n.DeviceWeb())
}), on = "temp_code_verifier", qt = "access_token_expires_at", Mt = "refresh_token_expires_at";
class Tf {
  constructor(e) {
    this.config = e, this.apiClient = new hu(e.apiBaseUrl, e.oAuthBaseUrl, e.oAuthClientId);
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
    e.expiresIn ? localStorage.setItem(qt, (t + e.expiresIn * 1e3).toString()) : localStorage.removeItem(qt), e.refreshExpiresIn ? localStorage.setItem(Mt, (t + e.refreshExpiresIn * 1e3).toString()) : localStorage.removeItem(Mt);
  }
  /**
   * Clear the temporary code verifier from localStorage
   */
  clearTempCodeVerifier() {
    localStorage.removeItem(on);
  }
  /**
   * Clear the local authentication metadata from localStorage
   */
  clearLocalAuthMetadata() {
    this.clearTempCodeVerifier(), localStorage.removeItem(qt), localStorage.removeItem(Mt);
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
      return { success: !0, user: Jn(r.data) };
    } catch (r) {
      try {
        this.apiClient.disconnect();
      } catch {
        throw new Error(ne.FAILED_TO_DISCONNECT);
      }
      return r.response && r.response.status === 401 ? {
        success: !1,
        user: null,
        error: new Error(ne.UNAUTHORIZED)
      } : {
        success: !1,
        user: null,
        error: new Error(ne.LOGIN_FAILED)
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
      const t = fo(), r = await xo(t), s = (await Au.getInfo()).platform;
      localStorage.setItem(on, t);
      const i = `${this.config.oAuthBaseUrl}/auth?` + new URLSearchParams({
        client_id: this.config.oAuthClientId,
        redirect_uri: e,
        response_type: "code",
        scope: "openid profile email",
        code_challenge: r,
        code_challenge_method: "S256"
      }).toString();
      return s === "web" ? (window.location.href = i, {
        success: !1,
        user: null,
        error: new Error(ne.OAUTH_REDIRECT)
      }) : new Promise((a) => {
        let o = null, l = null, c = !1, u = !1;
        const h = (p) => {
          c || (c = !0, o?.remove(), l?.remove(), a(p));
        }, f = async ({ url: p }) => {
          if (p.startsWith(e.split("?")[0])) {
            u = !0, o?.remove();
            try {
              const m = new URL(p), E = m.searchParams.get("code");
              if (m.searchParams.get("error")) {
                this.clearTempCodeVerifier(), h({
                  success: !1,
                  user: null,
                  error: new Error(ne.OAUTH_CALLBACK_FAILED)
                });
                return;
              }
              if (!E) {
                this.clearTempCodeVerifier(), h({
                  success: !1,
                  user: null,
                  error: new Error(ne.NO_AUTHORIZATION_CODE)
                });
                return;
              }
              h(await this.completeOAuthCallback(E, e));
            } catch {
              this.clearTempCodeVerifier(), h({
                success: !1,
                user: null,
                error: new Error(ne.OAUTH_CALLBACK_FAILED)
              });
            }
          }
        };
        (async () => {
          try {
            o = await _u.addListener("appUrlOpen", f), l = await pi.addListener("browserFinished", async () => {
              u || (this.clearTempCodeVerifier(), h({
                success: !1,
                user: null,
                error: new Error(ne.OAUTH_CALLBACK_FAILED)
              }));
            }), await pi.open({ url: i });
          } catch {
            this.clearTempCodeVerifier(), h({
              success: !1,
              user: null,
              error: new Error(ne.OAUTH_CALLBACK_FAILED)
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
        error: new Error(ne.OAUTH_CALLBACK_FAILED)
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
      const s = await this.apiClient.user.get("me"), i = Jn(s.data);
      return i ? {
        success: !0,
        user: i,
        tokens: r.tokens
      } : {
        success: !1,
        user: null,
        error: new Error(ne.FAILED_TO_FETCH_USER_INFO)
      };
    } catch {
      return this.clearTempCodeVerifier(), {
        success: !1,
        user: null,
        error: new Error(ne.OAUTH_CALLBACK_FAILED)
      };
    }
  }
  /**
  * Refresh the access token using the stored refresh token
  */
  async refreshAccessToken(e) {
    try {
      if (!e)
        return { success: !1, error: new Error(ne.REFRESH_TOKEN_MISSING) };
      const t = this.getStoredTimestamp(Mt);
      if (t !== null && Date.now() >= t)
        return { success: !1, error: new Error(ne.REFRESH_TOKEN_EXPIRED) };
      const r = `${this.config.oAuthBaseUrl}/token`, s = await an.post({
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
      if (s.status >= 400)
        return { success: !1, error: new Error(ne.REFRESH_TOKEN_FAILED) };
      const i = s.data, a = {
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
        error: new Error(ne.REFRESH_TOKEN_FAILED)
      };
    }
  }
  /**
  * Exchange authorization code for tokens
  */
  async exchangeCodeForTokens(e, t) {
    try {
      const r = localStorage.getItem(on);
      if (!r)
        return {
          success: !1,
          error: new Error(ne.CODE_VERIFIER_MISSING)
        };
      const s = `${this.config.oAuthBaseUrl}/token`, i = await an.post({
        url: s,
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
          error: new Error(ne.TOKEN_EXCHANGE_FAILED)
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
        throw new Error(ne.TOKEN_EXCHANGE_FAILED);
      }
      return {
        success: !1,
        error: new Error(ne.TOKEN_EXCHANGE_FAILED)
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
      return { success: !1, error: new Error(ne.UNKNOWN_ERROR) };
    }
  }
  /**
   * Revoke a token
   * @param token - The token to revoke
   * @returns the result of the revoke token operation
   */
  async revokeToken(e) {
    if (!e || e.length === 0)
      return { success: !1, error: new Error(ne.TOKEN_MISSING) };
    try {
      return await an.post({
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
      return console.error("revokeToken => error", t), { success: !1, error: new Error(ne.UNKNOWN_ERROR) };
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
      const t = this.getStoredTimestamp(qt);
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
  Tf as A,
  Ye as C,
  uo as D,
  Ua as E,
  nf as R,
  _t as S,
  of as U,
  sf as V,
  Ln as W,
  Ai as a,
  Ga as b,
  Cn as c,
  wn as d,
  Rr as e,
  X as f,
  za as g,
  cf as h,
  af as i,
  Ve as j,
  lf as k,
  uf as l,
  ff as m,
  fn as n,
  Or as o,
  Lt as p
};
//# sourceMappingURL=index-pxNYDmqk.js.map
