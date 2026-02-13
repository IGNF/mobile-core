var mc = Object.defineProperty;
var _c = (r, t, e) => t in r ? mc(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var oa = (r, t, e) => _c(r, typeof t != "symbol" ? t + "" : t, e);
import ot from "proj4";
import { Collection as We, Feature as yn, View as Ml } from "ol";
class On {
  constructor() {
    this.listeners = {};
  }
  on(t, e) {
    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e);
  }
  once(t, e) {
    const i = (n) => {
      e(n), this.off(t, i);
    };
    this.on(t, i);
  }
  off(t, e) {
    const i = this.listeners[t];
    i && (this.listeners[t] = i.filter((n) => n !== e), this.listeners[t].length === 0 && delete this.listeners[t]);
  }
  emit(t, e) {
    const i = this.listeners[t];
    i && i.forEach((n) => n(e));
  }
}
const Y = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3
}, li = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", pc = li.includes("safari") && !li.includes("chrom");
pc && (li.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(li));
li.includes("webkit") && li.includes("edge");
li.includes("macintosh");
const aa = typeof devicePixelRatio < "u" ? devicePixelRatio : 1, Js = typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope, yc = typeof Image < "u" && Image.prototype.decode;
(function() {
  let r = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        r = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return r;
})();
function Ft(r, t, e, i) {
  let n;
  return e && e.length ? n = /** @type {HTMLCanvasElement} */
  e.shift() : Js ? n = new OffscreenCanvas(r || 300, t || 300) : n = document.createElement("canvas"), r && (n.width = r), t && (n.height = t), /** @type {CanvasRenderingContext2D} */
  n.getContext("2d", i);
}
let rs;
function _r() {
  return rs || (rs = Ft(1, 1)), rs;
}
function wc(r) {
  const t = r.canvas;
  t.width = 1, t.height = 1, r.clearRect(0, 0, 1, 1);
}
function ht(r, t, e) {
  return Math.min(Math.max(r, t), e);
}
function Ec(r, t, e, i, n, s) {
  const o = n - e, a = s - i;
  if (o !== 0 || a !== 0) {
    const l = ((r - e) * o + (t - i) * a) / (o * o + a * a);
    l > 1 ? (e = n, i = s) : l > 0 && (e += o * l, i += a * l);
  }
  return Ce(r, t, e, i);
}
function Ce(r, t, e, i) {
  const n = e - r, s = i - t;
  return n * n + s * s;
}
function la(r) {
  return r * 180 / Math.PI;
}
function wn(r) {
  return r * Math.PI / 180;
}
function ha(r, t) {
  const e = r % t;
  return e * t < 0 ? e + t : e;
}
function kt(r, t, e) {
  return r + e * (t - r);
}
function bn(r, t) {
  const e = Math.pow(10, t);
  return Math.round(r * e) / e;
}
function Zn(r, t) {
  return Math.floor(bn(r, t));
}
function Vn(r, t) {
  return Math.ceil(bn(r, t));
}
function vs(r, t, e) {
  if (r >= t && r < e)
    return r;
  const i = e - t;
  return ((r - t) % i + i) % i + t;
}
const Qs = [NaN, NaN, NaN, 0];
let ss;
function Cc() {
  return ss || (ss = Ft(1, 1, void 0, {
    willReadFrequently: !0,
    desynchronized: !0
  })), ss;
}
const Sc = /^rgba?\(\s*(\d+%?)\s+(\d+%?)\s+(\d+%?)(?:\s*\/\s*(\d+%|\d*\.\d+|[01]))?\s*\)$/i, xc = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+%|\d*\.\d+|[01]))?\s*\)$/i, Rc = /^rgba?\(\s*(\d+%)\s*,\s*(\d+%)\s*,\s*(\d+%)(?:\s*,\s*(\d+%|\d*\.\d+|[01]))?\s*\)$/i, Ic = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
function jn(r, t) {
  return r.endsWith("%") ? Number(r.substring(0, r.length - 1)) / t : Number(r);
}
function En(r) {
  throw new Error('failed to parse "' + r + '" as color');
}
function Fl(r) {
  if (r.toLowerCase().startsWith("rgb")) {
    const s = r.match(xc) || r.match(Sc) || r.match(Rc);
    if (s) {
      const o = s[4], a = 100 / 255;
      return [
        ht(jn(s[1], a) + 0.5 | 0, 0, 255),
        ht(jn(s[2], a) + 0.5 | 0, 0, 255),
        ht(jn(s[3], a) + 0.5 | 0, 0, 255),
        o !== void 0 ? ht(jn(o, 100), 0, 1) : 1
      ];
    }
    En(r);
  }
  if (r.startsWith("#")) {
    if (Ic.test(r)) {
      const s = r.substring(1), o = s.length <= 4 ? 1 : 2, a = [0, 0, 0, 255];
      for (let l = 0, c = s.length; l < c; l += o) {
        let h = parseInt(s.substring(l, l + o), 16);
        o === 1 && (h += h << 4), a[l / o] = h;
      }
      return a[3] = a[3] / 255, a;
    }
    En(r);
  }
  const t = Cc();
  t.fillStyle = "#abcdef";
  let e = t.fillStyle;
  t.fillStyle = r, t.fillStyle === e && (t.fillStyle = "#fedcba", e = t.fillStyle, t.fillStyle = r, t.fillStyle === e && En(r));
  const i = t.fillStyle;
  if (i.startsWith("#") || i.startsWith("rgba"))
    return Fl(i);
  t.clearRect(0, 0, 1, 1), t.fillRect(0, 0, 1, 1);
  const n = Array.from(t.getImageData(0, 0, 1, 1).data);
  return n[3] = bn(n[3] / 255, 3), n;
}
function Qt(r) {
  return typeof r == "string" ? r : eo(r);
}
const Tc = 1024, rn = {};
let os = 0;
function Pc(r) {
  if (r.length === 4)
    return r;
  const t = r.slice();
  return t[3] = 1, t;
}
function as(r) {
  return r > 31308e-7 ? Math.pow(r, 1 / 2.4) * 269.025 - 14.025 : r * 3294.6;
}
function ls(r) {
  return r > 0.2068965 ? Math.pow(r, 3) : (r - 4 / 29) * (108 / 841);
}
function hs(r) {
  return r > 10.314724 ? Math.pow((r + 14.025) / 269.025, 2.4) : r / 3294.6;
}
function cs(r) {
  return r > 88564e-7 ? Math.pow(r, 1 / 3) : r / (108 / 841) + 4 / 29;
}
function ca(r) {
  const t = hs(r[0]), e = hs(r[1]), i = hs(r[2]), n = cs(t * 0.222488403 + e * 0.716873169 + i * 0.06060791), s = 500 * (cs(t * 0.452247074 + e * 0.399439023 + i * 0.148375274) - n), o = 200 * (n - cs(t * 0.016863605 + e * 0.117638439 + i * 0.865350722)), a = Math.atan2(o, s) * (180 / Math.PI);
  return [
    116 * n - 16,
    Math.sqrt(s * s + o * o),
    a < 0 ? a + 360 : a,
    r[3]
  ];
}
function Mc(r) {
  const t = (r[0] + 16) / 116, e = r[1], i = r[2] * Math.PI / 180, n = ls(t), s = ls(t + e / 500 * Math.cos(i)), o = ls(t - e / 200 * Math.sin(i)), a = as(s * 3.021973625 - n * 1.617392459 - o * 0.404875592), l = as(s * -0.943766287 + n * 1.916279586 + o * 0.027607165), c = as(s * 0.069407491 - n * 0.22898585 + o * 1.159737864);
  return [
    ht(a + 0.5 | 0, 0, 255),
    ht(l + 0.5 | 0, 0, 255),
    ht(c + 0.5 | 0, 0, 255),
    r[3]
  ];
}
function to(r) {
  if (r === "none")
    return Qs;
  if (rn.hasOwnProperty(r))
    return rn[r];
  if (os >= Tc) {
    let e = 0;
    for (const i in rn)
      e++ & 3 || (delete rn[i], --os);
  }
  const t = Fl(r);
  t.length !== 4 && En(r);
  for (const e of t)
    isNaN(e) && En(r);
  return rn[r] = t, ++os, t;
}
function Ve(r) {
  return Array.isArray(r) ? r : to(r);
}
function eo(r) {
  let t = r[0];
  t != (t | 0) && (t = t + 0.5 | 0);
  let e = r[1];
  e != (e | 0) && (e = e + 0.5 | 0);
  let i = r[2];
  i != (i | 0) && (i = i + 0.5 | 0);
  const n = r[3] === void 0 ? 1 : Math.round(r[3] * 1e3) / 1e3;
  return "rgba(" + t + "," + e + "," + i + "," + n + ")";
}
const Rt = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event module:ol/events/Event~BaseEvent#change
   * @api
   */
  CHANGE: "change",
  CONTEXTMENU: "contextmenu",
  CLICK: "click",
  DBLCLICK: "dblclick"
};
class Fc {
  constructor() {
    this.disposed = !1;
  }
  /**
   * Clean up.
   */
  dispose() {
    this.disposed || (this.disposed = !0, this.disposeInternal());
  }
  /**
   * Extension point for disposable objects.
   * @protected
   */
  disposeInternal() {
  }
}
function vc(r, t, e) {
  let i, n;
  e = e || ze;
  let s = 0, o = r.length, a = !1;
  for (; s < o; )
    i = s + (o - s >> 1), n = +e(r[i], t), n < 0 ? s = i + 1 : (o = i, a = !n);
  return a ? s : ~s;
}
function ze(r, t) {
  return r > t ? 1 : r < t ? -1 : 0;
}
function Ac(r, t) {
  return r < t ? 1 : r > t ? -1 : 0;
}
function io(r, t, e) {
  if (r[0] <= t)
    return 0;
  const i = r.length;
  if (t <= r[i - 1])
    return i - 1;
  if (typeof e == "function") {
    for (let n = 1; n < i; ++n) {
      const s = r[n];
      if (s === t)
        return n;
      if (s < t)
        return e(t, r[n - 1], s) > 0 ? n - 1 : n;
    }
    return i - 1;
  }
  if (e > 0) {
    for (let n = 1; n < i; ++n)
      if (r[n] < t)
        return n - 1;
    return i - 1;
  }
  if (e < 0) {
    for (let n = 1; n < i; ++n)
      if (r[n] <= t)
        return n;
    return i - 1;
  }
  for (let n = 1; n < i; ++n) {
    if (r[n] == t)
      return n;
    if (r[n] < t)
      return r[n - 1] - t < t - r[n] ? n - 1 : n;
  }
  return i - 1;
}
function Lc(r, t, e) {
  for (; t < e; ) {
    const i = r[t];
    r[t] = r[e], r[e] = i, ++t, --e;
  }
}
function It(r, t) {
  const e = Array.isArray(t) ? t : [t], i = e.length;
  for (let n = 0; n < i; n++)
    r[r.length] = e[n];
}
function gi(r, t) {
  const e = r.length;
  if (e !== t.length)
    return !1;
  for (let i = 0; i < e; i++)
    if (r[i] !== t[i])
      return !1;
  return !0;
}
function Oc(r, t, e) {
  const i = t || ze;
  return r.every(function(n, s) {
    if (s === 0)
      return !0;
    const o = i(r[s - 1], n);
    return !(o > 0 || o === 0);
  });
}
function hi() {
  return !0;
}
function vl() {
  return !1;
}
function pr() {
}
function Al(r) {
  let t, e, i;
  return function() {
    const n = Array.prototype.slice.call(arguments);
    return (!e || this !== i || !gi(n, e)) && (i = this, e = n, t = r.apply(this, arguments)), t;
  };
}
function Nr(r) {
  for (const t in r)
    delete r[t];
}
function ci(r) {
  let t;
  for (t in r)
    return !1;
  return !t;
}
class fe {
  /**
   * @param {string} type Type.
   */
  constructor(t) {
    this.propagationStopped, this.defaultPrevented, this.type = t, this.target = null;
  }
  /**
   * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
   * will be fired.
   * @api
   */
  preventDefault() {
    this.defaultPrevented = !0;
  }
  /**
   * Stop event propagation.
   * @api
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
class Ll extends Fc {
  /**
   * @param {*} [target] Default event target for dispatched events.
   */
  constructor(t) {
    super(), this.eventTarget_ = t, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  addEventListener(t, e) {
    if (!t || !e)
      return;
    const i = this.listeners_ || (this.listeners_ = {}), n = i[t] || (i[t] = []);
    n.includes(e) || n.push(e);
  }
  /**
   * Dispatches an event and calls all listeners listening for events
   * of this type. The event parameter can either be a string or an
   * Object with a `type` property.
   *
   * @param {import("./Event.js").default|string} event Event object.
   * @return {boolean|undefined} `false` if anyone called preventDefault on the
   *     event object or if any of the listeners returned false.
   * @api
   */
  dispatchEvent(t) {
    const e = typeof t == "string", i = e ? t : t.type, n = this.listeners_ && this.listeners_[i];
    if (!n)
      return;
    const s = e ? new fe(t) : (
      /** @type {Event} */
      t
    );
    s.target || (s.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in o || (o[i] = 0, a[i] = 0), ++o[i];
    let l;
    for (let c = 0, h = n.length; c < h; ++c)
      if ("handleEvent" in n[c] ? l = /** @type {import("../events.js").ListenerObject} */
      n[c].handleEvent(s) : l = /** @type {import("../events.js").ListenerFunction} */
      n[c].call(this, s), l === !1 || s.propagationStopped) {
        l = !1;
        break;
      }
    if (--o[i] === 0) {
      let c = a[i];
      for (delete a[i]; c--; )
        this.removeEventListener(i, pr);
      delete o[i];
    }
    return l;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Nr(this.listeners_);
  }
  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {Array<import("../events.js").Listener>|undefined} Listeners.
   */
  getListeners(t) {
    return this.listeners_ && this.listeners_[t] || void 0;
  }
  /**
   * @param {string} [type] Type. If not provided,
   *     `true` will be returned if this event target has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener(t) {
    return this.listeners_ ? t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0 : !1;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  removeEventListener(t, e) {
    if (!this.listeners_)
      return;
    const i = this.listeners_[t];
    if (!i)
      return;
    const n = i.indexOf(e);
    n !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[n] = pr, ++this.pendingRemovals_[t]) : (i.splice(n, 1), i.length === 0 && delete this.listeners_[t]));
  }
}
function ue(r, t, e, i, n) {
  if (n) {
    const o = e;
    e = function(a) {
      return r.removeEventListener(t, e), o.call(i ?? this, a);
    };
  } else i && i !== r && (e = e.bind(i));
  const s = {
    target: r,
    type: t,
    listener: e
  };
  return r.addEventListener(t, e), s;
}
function ua(r, t, e, i) {
  return ue(r, t, e, i, !0);
}
function Se(r) {
  r && r.target && (r.target.removeEventListener(r.type, r.listener), Nr(r));
}
function bc(r, t) {
  return new Promise((e, i) => {
    function n() {
      o(), e(r);
    }
    function s() {
      o(), i(new Error("Image load error"));
    }
    function o() {
      r.removeEventListener("load", n), r.removeEventListener("error", s);
    }
    r.addEventListener("load", n), r.addEventListener("error", s);
  });
}
function Nc(r, t) {
  return t && (r.src = t), r.src && yc ? new Promise(
    (e, i) => r.decode().then(() => e(r)).catch(
      (n) => r.complete && r.width ? e(r) : i(n)
    )
  ) : bc(r);
}
class kc {
  constructor() {
    this.cache_ = {}, this.patternCache_ = {}, this.cacheSize_ = 0, this.maxCacheSize_ = 1024;
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.cache_ = {}, this.patternCache_ = {}, this.cacheSize_ = 0;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.cacheSize_ > this.maxCacheSize_;
  }
  /**
   * FIXME empty description for jsdoc
   */
  expire() {
    if (this.canExpireCache()) {
      let t = 0;
      for (const e in this.cache_) {
        const i = this.cache_[e];
        !(t++ & 3) && !i.hasListener() && (delete this.cache_[e], delete this.patternCache_[e], --this.cacheSize_);
      }
    }
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @return {import("./IconImage.js").default} Icon image.
   */
  get(t, e, i) {
    const n = us(t, e, i);
    return n in this.cache_ ? this.cache_[n] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @return {CanvasPattern} Icon image.
   */
  getPattern(t, e, i) {
    const n = us(t, e, i);
    return n in this.patternCache_ ? this.patternCache_[n] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @param {import("./IconImage.js").default|null} iconImage Icon image.
   * @param {boolean} [pattern] Also cache a `'repeat'` pattern with this `iconImage`.
   */
  set(t, e, i, n, s) {
    const o = us(t, e, i), a = o in this.cache_;
    this.cache_[o] = n, s && (n.getImageState() === Y.IDLE && n.load(), n.getImageState() === Y.LOADING ? n.ready().then(() => {
      this.patternCache_[o] = _r().createPattern(
        n.getImage(1),
        "repeat"
      );
    }) : this.patternCache_[o] = _r().createPattern(
      n.getImage(1),
      "repeat"
    )), a || ++this.cacheSize_;
  }
  /**
   * Set the cache size of the icon cache. Default is `1024`. Change this value when
   * your map uses more than 1024 different icon images and you are not caching icon
   * styles on the application level.
   * @param {number} maxCacheSize Cache max size.
   * @api
   */
  setSize(t) {
    this.maxCacheSize_ = t, this.expire();
  }
}
function us(r, t, e) {
  const i = e ? Ve(e) : "null";
  return t + ":" + r + ":" + i;
}
const he = new kc();
let sn = null;
class Ol extends Ll {
  /**
   * @param {HTMLImageElement|HTMLCanvasElement|ImageBitmap|null} image Image.
   * @param {string|undefined} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../ImageState.js").default|undefined} imageState Image state.
   * @param {import("../color.js").Color|string|null} color Color.
   */
  constructor(t, e, i, n, s) {
    super(), this.hitDetectionImage_ = null, this.image_ = t, this.crossOrigin_ = i, this.canvas_ = {}, this.color_ = s, this.imageState_ = n === void 0 ? Y.IDLE : n, this.size_ = t && t.width && t.height ? [t.width, t.height] : null, this.src_ = e, this.tainted_, this.ready_ = null;
  }
  /**
   * @private
   */
  initializeImage_() {
    this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_);
  }
  /**
   * @private
   * @return {boolean} The image canvas is tainted.
   */
  isTainted_() {
    if (this.tainted_ === void 0 && this.imageState_ === Y.LOADED) {
      sn || (sn = Ft(1, 1, void 0, {
        willReadFrequently: !0
      })), sn.drawImage(this.image_, 0, 0);
      try {
        sn.getImageData(0, 0, 1, 1), this.tainted_ = !1;
      } catch {
        sn = null, this.tainted_ = !0;
      }
    }
    return this.tainted_ === !0;
  }
  /**
   * @private
   */
  dispatchChangeEvent_() {
    this.dispatchEvent(Rt.CHANGE);
  }
  /**
   * @private
   */
  handleImageError_() {
    this.imageState_ = Y.ERROR, this.dispatchChangeEvent_();
  }
  /**
   * @private
   */
  handleImageLoad_() {
    this.imageState_ = Y.LOADED, this.size_ = [this.image_.width, this.image_.height], this.dispatchChangeEvent_();
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image or Canvas element or image bitmap.
   */
  getImage(t) {
    return this.image_ || this.initializeImage_(), this.replaceColor_(t), this.canvas_[t] ? this.canvas_[t] : this.image_;
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Image or Canvas element.
   */
  getPixelRatio(t) {
    return this.replaceColor_(t), this.canvas_[t] ? t : 1;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image element.
   */
  getHitDetectionImage() {
    if (this.image_ || this.initializeImage_(), !this.hitDetectionImage_)
      if (this.isTainted_()) {
        const t = this.size_[0], e = this.size_[1], i = Ft(t, e);
        i.fillRect(0, 0, t, e), this.hitDetectionImage_ = i.canvas;
      } else
        this.hitDetectionImage_ = this.image_;
    return this.hitDetectionImage_;
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   */
  getSize() {
    return this.size_;
  }
  /**
   * @return {string|undefined} Image src.
   */
  getSrc() {
    return this.src_;
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.imageState_ === Y.IDLE) {
      this.image_ || this.initializeImage_(), this.imageState_ = Y.LOADING;
      try {
        this.src_ !== void 0 && (this.image_.src = this.src_);
      } catch {
        this.handleImageError_();
      }
      this.image_ instanceof HTMLImageElement && Nc(this.image_, this.src_).then((t) => {
        this.image_ = t, this.handleImageLoad_();
      }).catch(this.handleImageError_.bind(this));
    }
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @private
   */
  replaceColor_(t) {
    if (!this.color_ || this.canvas_[t] || this.imageState_ !== Y.LOADED)
      return;
    const e = this.image_, i = Ft(
      Math.ceil(e.width * t),
      Math.ceil(e.height * t)
    ), n = i.canvas;
    i.scale(t, t), i.drawImage(e, 0, 0), i.globalCompositeOperation = "multiply", i.fillStyle = Qt(this.color_), i.fillRect(0, 0, n.width / t, n.height / t), i.globalCompositeOperation = "destination-in", i.drawImage(e, 0, 0), this.canvas_[t] = n;
  }
  /**
   * @return {Promise<void>} Promise that resolves when the image is loaded.
   */
  ready() {
    return this.ready_ || (this.ready_ = new Promise((t) => {
      if (this.imageState_ === Y.LOADED || this.imageState_ === Y.ERROR)
        t();
      else {
        const e = () => {
          (this.imageState_ === Y.LOADED || this.imageState_ === Y.ERROR) && (this.removeEventListener(Rt.CHANGE, e), t());
        };
        this.addEventListener(Rt.CHANGE, e);
      }
    })), this.ready_;
  }
}
function no(r, t, e, i, n, s) {
  let o = t === void 0 ? void 0 : he.get(t, e, n);
  return o || (o = new Ol(
    r,
    r && "src" in r ? r.src || void 0 : t,
    e,
    i,
    n
  ), he.set(t, e, n, o, s)), s && o && !he.getPattern(t, e, n) && he.set(t, e, n, o, s), o;
}
function ce(r) {
  return r ? Array.isArray(r) ? eo(r) : typeof r == "object" && "src" in r ? Dc(r) : r : null;
}
function Dc(r) {
  if (!r.offset || !r.size)
    return he.getPattern(r.src, "anonymous", r.color);
  const t = r.src + ":" + r.offset, e = he.getPattern(
    t,
    void 0,
    r.color
  );
  if (e)
    return e;
  const i = he.get(r.src, "anonymous", null);
  if (i.getImageState() !== Y.LOADED)
    return null;
  const n = Ft(
    r.size[0],
    r.size[1]
  );
  return n.drawImage(
    i.getImage(1),
    r.offset[0],
    r.offset[1],
    r.size[0],
    r.size[1],
    0,
    0,
    r.size[0],
    r.size[1]
  ), no(
    n.canvas,
    t,
    void 0,
    Y.LOADED,
    r.color,
    !0
  ), he.getPattern(t, void 0, r.color);
}
const bl = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
class Nn extends Ll {
  constructor() {
    super(), this.on = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onInternal, this.once = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onceInternal, this.un = /** @type {ObservableOnSignature<void>} */
    this.unInternal, this.revision_ = 0;
  }
  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  changed() {
    ++this.revision_, this.dispatchEvent(Rt.CHANGE);
  }
  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return {number} Revision.
   * @api
   */
  getRevision() {
    return this.revision_;
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const i = t.length, n = new Array(i);
      for (let s = 0; s < i; ++s)
        n[s] = ue(this, t[s], e);
      return n;
    }
    return ue(
      this,
      /** @type {string} */
      t,
      e
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, e) {
    let i;
    if (Array.isArray(t)) {
      const n = t.length;
      i = new Array(n);
      for (let s = 0; s < n; ++s)
        i[s] = ua(this, t[s], e);
    } else
      i = ua(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = i, i;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const i = (
      /** @type {Object} */
      e.ol_key
    );
    if (i)
      Gc(i);
    else if (Array.isArray(t))
      for (let n = 0, s = t.length; n < s; ++n)
        this.removeEventListener(t[n], e);
    else
      this.removeEventListener(t, e);
  }
}
Nn.prototype.on;
Nn.prototype.once;
Nn.prototype.un;
function Gc(r) {
  if (Array.isArray(r))
    for (let t = 0, e = r.length; t < e; ++t)
      Se(r[t]);
  else
    Se(
      /** @type {import("./events.js").EventsKey} */
      r
    );
}
function b() {
  throw new Error("Unimplemented abstract method.");
}
let Uc = 0;
function nt(r) {
  return r.ol_uid || (r.ol_uid = String(++Uc));
}
class da extends fe {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, i) {
    super(t), this.key = e, this.oldValue = i;
  }
}
class Ae extends Nn {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, nt(this), this.values_ = null, t !== void 0 && this.setProperties(t);
  }
  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get(t) {
    let e;
    return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e;
  }
  /**
   * Get a list of object property names.
   * @return {Array<string>} List of property names.
   * @api
   */
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>} Object.
   * @api
   */
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>?} Object.
   */
  getPropertiesInternal() {
    return this.values_;
  }
  /**
   * @return {boolean} The object has properties.
   */
  hasProperties() {
    return !!this.values_;
  }
  /**
   * @param {string} key Key name.
   * @param {*} oldValue Old value.
   */
  notify(t, e) {
    let i;
    i = `change:${t}`, this.hasListener(i) && this.dispatchEvent(new da(i, t, e)), i = bl.PROPERTYCHANGE, this.hasListener(i) && this.dispatchEvent(new da(i, t, e));
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  addChangeListener(t, e) {
    this.addEventListener(`change:${t}`, e);
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  removeChangeListener(t, e) {
    this.removeEventListener(`change:${t}`, e);
  }
  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  set(t, e, i) {
    const n = this.values_ || (this.values_ = {});
    if (i)
      n[t] = e;
    else {
      const s = n[t];
      n[t] = e, s !== e && this.notify(t, s);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Object<string, *>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(t, e) {
    for (const i in t)
      this.set(i, t[i], e);
  }
  /**
   * Apply any properties from another object without triggering events.
   * @param {BaseObject} source The source object.
   * @protected
   */
  applyProperties(t) {
    t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_);
  }
  /**
   * Unsets a property.
   * @param {string} key Key name.
   * @param {boolean} [silent] Unset without triggering an event.
   * @api
   */
  unset(t, e) {
    if (this.values_ && t in this.values_) {
      const i = this.values_[t];
      delete this.values_[t], ci(this.values_) && (this.values_ = null), e || this.notify(t, i);
    }
  }
}
const Wc = new RegExp(
  [
    "^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)",
    "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?",
    "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))",
    "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))",
    `?\\s*([-,\\"\\'\\sa-z0-9]+?)\\s*$`
  ].join(""),
  "i"
), fa = [
  "style",
  "variant",
  "weight",
  "size",
  "lineHeight",
  "family"
], As = {
  normal: 400,
  bold: 700
}, Ls = function(r) {
  const t = r.match(Wc);
  if (!t)
    return null;
  const e = (
    /** @type {FontParameters} */
    {
      lineHeight: "normal",
      size: "1.2em",
      style: "normal",
      weight: "400",
      variant: "normal"
    }
  );
  for (let i = 0, n = fa.length; i < n; ++i) {
    const s = t[i + 1];
    s !== void 0 && (e[fa[i]] = typeof s == "string" ? s.trim() : s);
  }
  return isNaN(Number(e.weight)) && e.weight in As && (e.weight = As[e.weight]), e.families = e.family.split(/,\s?/).map((i) => i.trim().replace(/^['"]|['"]$/g, "")), e;
}, Nl = "10px sans-serif", At = "#000", Bi = "round", xe = [], Re = 0, Xi = "round", xn = 10, Rn = "#000", In = "center", yr = "middle", ti = [0, 0, 0, 0], Tn = 1, on = new Ae();
let an = null, ga;
const Os = {}, Yc = /* @__PURE__ */ new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong"
]);
function Bc(r, t, e) {
  return `${r} ${t} 16px "${e}"`;
}
const Xc = /* @__PURE__ */ function() {
  let t, e;
  async function i(s) {
    await e.ready;
    const o = await e.load(s);
    if (o.length === 0)
      return !1;
    const a = Ls(s), l = a.families[0].toLowerCase(), c = a.weight;
    return o.some(
      /**
       * @param {import('../css.js').FontParameters} f Font.
       * @return {boolean} Font matches.
       */
      (h) => {
        const u = h.family.replace(/^['"]|['"]$/g, "").toLowerCase(), d = As[h.weight] || h.weight;
        return u === l && h.style === a.style && d == c;
      }
    );
  }
  async function n() {
    await e.ready;
    let s = !0;
    const o = on.getProperties(), a = Object.keys(o).filter(
      (l) => o[l] < 100
    );
    for (let l = a.length - 1; l >= 0; --l) {
      const c = a[l];
      let h = o[c];
      h < 100 && (await i(c) ? (Nr(Os), on.set(c, 100)) : (h += 10, on.set(c, h, !0), h < 100 && (s = !1)));
    }
    t = void 0, s || (t = setTimeout(n, 100));
  }
  return async function(s) {
    e || (e = Js ? self.fonts : document.fonts);
    const o = Ls(s);
    if (!o)
      return;
    const a = o.families;
    let l = !1;
    for (const c of a) {
      if (Yc.has(c))
        continue;
      const h = Bc(o.style, o.weight, c);
      on.get(h) === void 0 && (on.set(h, 0, !0), l = !0);
    }
    l && (clearTimeout(t), t = setTimeout(n, 100));
  };
}(), zc = /* @__PURE__ */ function() {
  let r;
  return function(t) {
    let e = Os[t];
    if (e == null) {
      if (Js) {
        const i = Ls(t), n = kl(t, "Žg");
        e = (isNaN(Number(i.lineHeight)) ? 1.2 : Number(i.lineHeight)) * (n.actualBoundingBoxAscent + n.actualBoundingBoxDescent);
      } else
        r || (r = document.createElement("div"), r.innerHTML = "M", r.style.minHeight = "0", r.style.maxHeight = "none", r.style.height = "auto", r.style.padding = "0", r.style.border = "none", r.style.position = "absolute", r.style.display = "block", r.style.left = "-99999px"), r.style.font = t, document.body.appendChild(r), e = r.offsetHeight, document.body.removeChild(r);
      Os[t] = e;
    }
    return e;
  };
}();
function kl(r, t) {
  return an || (an = Ft(1, 1)), r != ga && (an.font = r, ga = an.font), an.measureText(t);
}
function Dl(r, t) {
  return kl(r, t).width;
}
function ma(r, t, e) {
  if (t in e)
    return e[t];
  const i = t.split(`
`).reduce((n, s) => Math.max(n, Dl(r, s)), 0);
  return e[t] = i, i;
}
function Zc(r, t) {
  const e = [], i = [], n = [];
  let s = 0, o = 0, a = 0, l = 0;
  for (let c = 0, h = t.length; c <= h; c += 2) {
    const u = t[c];
    if (u === `
` || c === h) {
      s = Math.max(s, o), n.push(o), o = 0, a += l, l = 0;
      continue;
    }
    const d = t[c + 1] || r.font, f = Dl(d, u);
    e.push(f), o += f;
    const g = zc(d);
    i.push(g), l = Math.max(l, g);
  }
  return { width: s, height: a, widths: e, heights: i, lineWidths: n };
}
function Vc(r, t, e, i, n, s, o, a, l, c, h) {
  r.save(), e !== 1 && (r.globalAlpha === void 0 ? r.globalAlpha = (u) => u.globalAlpha *= e : r.globalAlpha *= e), t && r.transform.apply(r, t), /** @type {*} */
  i.contextInstructions ? (r.translate(l, c), r.scale(h[0], h[1]), jc(
    /** @type {Label} */
    i,
    r
  )) : h[0] < 0 || h[1] < 0 ? (r.translate(l, c), r.scale(h[0], h[1]), r.drawImage(
    /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
    i,
    n,
    s,
    o,
    a,
    0,
    0,
    o,
    a
  )) : r.drawImage(
    /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
    i,
    n,
    s,
    o,
    a,
    l,
    c,
    o * h[0],
    a * h[1]
  ), r.restore();
}
function jc(r, t) {
  const e = r.contextInstructions;
  for (let i = 0, n = e.length; i < n; i += 2)
    Array.isArray(e[i + 1]) ? t[e[i]].apply(
      t,
      e[i + 1]
    ) : t[e[i]] = e[i + 1];
}
function ie(r, t) {
  return Array.isArray(r) ? r : (t === void 0 ? t = [r, r] : (t[0] = r, t[1] = r), t);
}
class kr {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    this.opacity_ = t.opacity, this.rotateWithView_ = t.rotateWithView, this.rotation_ = t.rotation, this.scale_ = t.scale, this.scaleArray_ = ie(t.scale), this.displacement_ = t.displacement, this.declutterMode_ = t.declutterMode;
  }
  /**
   * Clones the style.
   * @return {ImageStyle} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale();
    return new kr({
      opacity: this.getOpacity(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the symbolizer opacity.
   * @return {number} Opacity.
   * @api
   */
  getOpacity() {
    return this.opacity_;
  }
  /**
   * Determine whether the symbolizer rotates with the map.
   * @return {boolean} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Get the symoblizer rotation.
   * @return {number} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the symbolizer scale.
   * @return {number|import("../size.js").Size} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the displacement of the shape
   * @return {Array<number>} Shape's center displacement
   * @api
   */
  getDisplacement() {
    return this.displacement_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {import("./Style.js").DeclutterMode} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @abstract
   * @return {Array<number>} Anchor.
   */
  getAnchor() {
    return b();
  }
  /**
   * Get the image element for the symbolizer.
   * @abstract
   * @param {number} pixelRatio Pixel ratio.
   * @return {import('../DataTile.js').ImageLike} Image element.
   */
  getImage(t) {
    return b();
  }
  /**
   * @abstract
   * @return {import('../DataTile.js').ImageLike} Image element.
   */
  getHitDetectionImage() {
    return b();
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   */
  getPixelRatio(t) {
    return 1;
  }
  /**
   * @abstract
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return b();
  }
  /**
   * @abstract
   * @return {import("../size.js").Size} Image size.
   */
  getImageSize() {
    return b();
  }
  /**
   * Get the origin of the symbolizer.
   * @abstract
   * @return {Array<number>} Origin.
   */
  getOrigin() {
    return b();
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @abstract
   * @return {import("../size.js").Size} Size.
   */
  getSize() {
    return b();
  }
  /**
   * Set the displacement.
   *
   * @param {Array<number>} displacement Displacement.
   * @api
   */
  setDisplacement(t) {
    this.displacement_ = t;
  }
  /**
   * Set the opacity.
   *
   * @param {number} opacity Opacity.
   * @api
   */
  setOpacity(t) {
    this.opacity_ = t;
  }
  /**
   * Set whether to rotate the style with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  /**
   * Set the rotation.
   *
   * @param {number} rotation Rotation.
   * @api
   */
  setRotation(t) {
    this.rotation_ = t;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   */
  setScale(t) {
    this.scale_ = t, this.scaleArray_ = ie(t);
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  listenImageChange(t) {
    b();
  }
  /**
   * Load not yet loaded URI.
   * @abstract
   */
  load() {
    b();
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  unlistenImageChange(t) {
    b();
  }
  /**
   * @return {Promise<void>} `false` or Promise that resolves when the style is ready to use.
   */
  ready() {
    return Promise.resolve();
  }
}
class Pe extends kr {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    super({
      opacity: 1,
      rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      scale: t.scale !== void 0 ? t.scale : 1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode
    }), this.hitDetectionCanvas_ = null, this.fill_ = t.fill !== void 0 ? t.fill : null, this.origin_ = [0, 0], this.points_ = t.points, this.radius = t.radius, this.radius2_ = t.radius2, this.angle_ = t.angle !== void 0 ? t.angle : 0, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.size_, this.renderOptions_, this.imageState_ = this.fill_ && this.fill_.loading() ? Y.LOADING : Y.LOADED, this.imageState_ === Y.LOADING && this.ready().then(() => this.imageState_ = Y.LOADED), this.render();
  }
  /**
   * Clones the style.
   * @return {RegularShape} The cloned style.
   * @api
   * @override
   */
  clone() {
    const t = this.getScale(), e = new Pe({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      points: this.getPoints(),
      radius: this.getRadius(),
      radius2: this.getRadius2(),
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(t) ? t.slice() : t,
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    return e.setOpacity(this.getOpacity()), e;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   * @override
   */
  getAnchor() {
    const t = this.size_, e = this.getDisplacement(), i = this.getScaleArray();
    return [
      t[0] / 2 - e[0] / i[0],
      t[1] / 2 + e[1] / i[1]
    ];
  }
  /**
   * Get the angle used in generating the shape.
   * @return {number} Shape's rotation in radians.
   * @api
   */
  getAngle() {
    return this.angle_;
  }
  /**
   * Get the fill style for the shape.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t, this.render();
  }
  /**
   * @return {HTMLCanvasElement} Image element.
   * @override
   */
  getHitDetectionImage() {
    return this.hitDetectionCanvas_ || (this.hitDetectionCanvas_ = this.createHitDetectionCanvas_(
      this.renderOptions_
    )), this.hitDetectionCanvas_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLCanvasElement} Image or Canvas element.
   * @api
   * @override
   */
  getImage(t) {
    var s, o;
    const e = (s = this.fill_) == null ? void 0 : s.getKey(), i = `${t},${this.angle_},${this.radius},${this.radius2_},${this.points_},${e}` + Object.values(this.renderOptions_).join(",");
    let n = (
      /** @type {HTMLCanvasElement} */
      (o = he.get(i, null, null)) == null ? void 0 : o.getImage(1)
    );
    if (!n) {
      const a = this.renderOptions_, l = Math.ceil(a.size * t), c = Ft(l, l);
      this.draw_(a, c, t), n = c.canvas, he.set(
        i,
        null,
        null,
        new Ol(n, void 0, null, Y.LOADED, null)
      );
    }
    return n;
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   * @override
   */
  getPixelRatio(t) {
    return t;
  }
  /**
   * @return {import("../size.js").Size} Image size.
   * @override
   */
  getImageSize() {
    return this.size_;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   * @override
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   * @override
   */
  getOrigin() {
    return this.origin_;
  }
  /**
   * Get the number of points for generating the shape.
   * @return {number} Number of points for stars and regular polygons.
   * @api
   */
  getPoints() {
    return this.points_;
  }
  /**
   * Get the (primary) radius for the shape.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return this.radius;
  }
  /**
   * Get the secondary radius for the shape.
   * @return {number|undefined} Radius2.
   * @api
   */
  getRadius2() {
    return this.radius2_;
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @return {import("../size.js").Size} Size.
   * @api
   * @override
   */
  getSize() {
    return this.size_;
  }
  /**
   * Get the stroke style for the shape.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t, this.render();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  listenImageChange(t) {
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  unlistenImageChange(t) {
  }
  /**
   * Calculate additional canvas size needed for the miter.
   * @param {string} lineJoin Line join
   * @param {number} strokeWidth Stroke width
   * @param {number} miterLimit Miter limit
   * @return {number} Additional canvas size needed
   * @private
   */
  calculateLineJoinSize_(t, e, i) {
    if (e === 0 || this.points_ === 1 / 0 || t !== "bevel" && t !== "miter")
      return e;
    let n = this.radius, s = this.radius2_ === void 0 ? n : this.radius2_;
    if (n < s) {
      const I = n;
      n = s, s = I;
    }
    const o = this.radius2_ === void 0 ? this.points_ : this.points_ * 2, a = 2 * Math.PI / o, l = s * Math.sin(a), c = Math.sqrt(s * s - l * l), h = n - c, u = Math.sqrt(l * l + h * h), d = u / l;
    if (t === "miter" && d <= i)
      return d * e;
    const f = e / 2 / d, g = e / 2 * (h / u), _ = Math.sqrt((n + f) * (n + f) + g * g) - n;
    if (this.radius2_ === void 0 || t === "bevel")
      return _ * 2;
    const p = n * Math.sin(a), y = Math.sqrt(n * n - p * p), S = s - y, R = Math.sqrt(p * p + S * S) / p;
    if (R <= i) {
      const I = R * e / 2 - s - n;
      return 2 * Math.max(_, I);
    }
    return _ * 2;
  }
  /**
   * @return {RenderOptions}  The render options
   * @protected
   */
  createRenderOptions() {
    let t = Bi, e = Xi, i = 0, n = null, s = 0, o, a = 0;
    this.stroke_ && (o = ce(this.stroke_.getColor() ?? Rn), a = this.stroke_.getWidth() ?? Tn, n = this.stroke_.getLineDash(), s = this.stroke_.getLineDashOffset() ?? 0, e = this.stroke_.getLineJoin() ?? Xi, t = this.stroke_.getLineCap() ?? Bi, i = this.stroke_.getMiterLimit() ?? xn);
    const l = this.calculateLineJoinSize_(e, a, i), c = Math.max(this.radius, this.radius2_ || 0), h = Math.ceil(2 * c + l);
    return {
      strokeStyle: o,
      strokeWidth: a,
      size: h,
      lineCap: t,
      lineDash: n,
      lineDashOffset: s,
      lineJoin: e,
      miterLimit: i
    };
  }
  /**
   * @protected
   */
  render() {
    this.renderOptions_ = this.createRenderOptions();
    const t = this.renderOptions_.size;
    this.hitDetectionCanvas_ = null, this.size_ = [t, t];
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The rendering context.
   * @param {number} pixelRatio The pixel ratio.
   */
  draw_(t, e, i) {
    if (e.scale(i, i), e.translate(t.size / 2, t.size / 2), this.createPath_(e), this.fill_) {
      let n = this.fill_.getColor();
      n === null && (n = At), e.fillStyle = ce(n), e.fill();
    }
    t.strokeStyle && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineCap = t.lineCap, e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @return {HTMLCanvasElement} Canvas containing the icon
   */
  createHitDetectionCanvas_(t) {
    let e;
    if (this.fill_) {
      let i = this.fill_.getColor(), n = 0;
      typeof i == "string" && (i = Ve(i)), i === null ? n = 1 : Array.isArray(i) && (n = i.length === 4 ? i[3] : 1), n === 0 && (e = Ft(t.size, t.size), this.drawHitDetectionCanvas_(t, e));
    }
    return e ? e.canvas : this.getImage(1);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context The context to draw in.
   */
  createPath_(t) {
    let e = this.points_;
    const i = this.radius;
    if (e === 1 / 0)
      t.arc(0, 0, i, 0, 2 * Math.PI);
    else {
      const n = this.radius2_ === void 0 ? i : this.radius2_;
      this.radius2_ !== void 0 && (e *= 2);
      const s = this.angle_ - Math.PI / 2, o = 2 * Math.PI / e;
      for (let a = 0; a < e; a++) {
        const l = s + a * o, c = a % 2 === 0 ? i : n;
        t.lineTo(c * Math.cos(l), c * Math.sin(l));
      }
      t.closePath();
    }
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The context.
   */
  drawHitDetectionCanvas_(t, e) {
    e.translate(t.size / 2, t.size / 2), this.createPath_(e), e.fillStyle = At, e.fill(), t.strokeStyle && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
  }
  /**
   * @override
   */
  ready() {
    return this.fill_ ? this.fill_.ready() : Promise.resolve();
  }
}
class Et extends Pe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || { radius: 5 }, super({
      points: 1 / 0,
      fill: t.fill,
      radius: t.radius,
      stroke: t.stroke,
      scale: t.scale !== void 0 ? t.scale : 1,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode
    });
  }
  /**
   * Clones the style.
   * @return {CircleStyle} The cloned style.
   * @api
   * @override
   */
  clone() {
    const t = this.getScale(), e = new Et({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      radius: this.getRadius(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    return e.setOpacity(this.getOpacity()), e;
  }
  /**
   * Set the circle radius.
   *
   * @param {number} radius Circle radius.
   * @api
   */
  setRadius(t) {
    this.radius = t, this.render();
  }
}
class $ {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.patternImage_ = null, this.color_ = null, t.color !== void 0 && this.setColor(t.color);
  }
  /**
   * Clones the style. The color is not cloned if it is a {@link module:ol/colorlike~ColorLike}.
   * @return {Fill} The cloned style.
   * @api
   */
  clone() {
    const t = this.getColor();
    return new $({
      color: Array.isArray(t) ? t.slice() : t || void 0
    });
  }
  /**
   * Get the fill color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike|import('../colorlike.js').PatternDescriptor|null} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike|import('../colorlike.js').PatternDescriptor|null} color Color.
   * @api
   */
  setColor(t) {
    if (t !== null && typeof t == "object" && "src" in t) {
      const e = no(
        null,
        t.src,
        "anonymous",
        void 0,
        t.offset ? null : t.color ? t.color : null,
        !(t.offset && t.size)
      );
      e.ready().then(() => {
        this.patternImage_ = null;
      }), e.getImageState() === Y.IDLE && e.load(), e.getImageState() === Y.LOADING && (this.patternImage_ = e);
    }
    this.color_ = t;
  }
  /**
   * @return {string} Key of the fill for cache lookup.
   */
  getKey() {
    const t = this.getColor();
    return t ? t instanceof CanvasPattern || t instanceof CanvasGradient ? nt(t) : typeof t == "object" && "src" in t ? t.src + ":" + t.offset : Ve(t).toString() : "";
  }
  /**
   * @return {boolean} The fill style is loading an image pattern.
   */
  loading() {
    return !!this.patternImage_;
  }
  /**
   * @return {Promise<void>} `false` or a promise that resolves when the style is ready to use.
   */
  ready() {
    return this.patternImage_ ? this.patternImage_.ready() : Promise.resolve();
  }
}
function at(r, t) {
  if (!r)
    throw new Error(t);
}
function _a(r, t, e, i) {
  return e !== void 0 && i !== void 0 ? [e / r, i / t] : e !== void 0 ? e / r : i !== void 0 ? i / t : 1;
}
class mi extends kr {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.opacity !== void 0 ? t.opacity : 1, i = t.rotation !== void 0 ? t.rotation : 0, n = t.scale !== void 0 ? t.scale : 1, s = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
    super({
      opacity: e,
      rotation: i,
      scale: n,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      rotateWithView: s,
      declutterMode: t.declutterMode
    }), this.anchor_ = t.anchor !== void 0 ? t.anchor : [0.5, 0.5], this.normalizedAnchor_ = null, this.anchorOrigin_ = t.anchorOrigin !== void 0 ? t.anchorOrigin : "top-left", this.anchorXUnits_ = t.anchorXUnits !== void 0 ? t.anchorXUnits : "fraction", this.anchorYUnits_ = t.anchorYUnits !== void 0 ? t.anchorYUnits : "fraction", this.crossOrigin_ = t.crossOrigin !== void 0 ? t.crossOrigin : null;
    const o = t.img !== void 0 ? t.img : null;
    let a = t.src;
    at(
      !(a !== void 0 && o),
      "`image` and `src` cannot be provided at the same time"
    ), (a === void 0 || a.length === 0) && o && (a = /** @type {HTMLImageElement} */
    o.src || nt(o)), at(
      a !== void 0 && a.length > 0,
      "A defined and non-empty `src` or `image` must be provided"
    ), at(
      !((t.width !== void 0 || t.height !== void 0) && t.scale !== void 0),
      "`width` or `height` cannot be provided together with `scale`"
    );
    let l;
    if (t.src !== void 0 ? l = Y.IDLE : o !== void 0 && ("complete" in o ? o.complete ? l = o.src ? Y.LOADED : Y.IDLE : l = Y.LOADING : l = Y.LOADED), this.color_ = t.color !== void 0 ? Ve(t.color) : null, this.iconImage_ = no(
      o,
      /** @type {string} */
      a,
      this.crossOrigin_,
      l,
      this.color_
    ), this.offset_ = t.offset !== void 0 ? t.offset : [0, 0], this.offsetOrigin_ = t.offsetOrigin !== void 0 ? t.offsetOrigin : "top-left", this.origin_ = null, this.size_ = t.size !== void 0 ? t.size : null, this.initialOptions_, t.width !== void 0 || t.height !== void 0) {
      let c, h;
      if (t.size)
        [c, h] = t.size;
      else {
        const u = this.getImage(1);
        if (u.width && u.height)
          c = u.width, h = u.height;
        else if (u instanceof HTMLImageElement) {
          this.initialOptions_ = t;
          const d = () => {
            if (this.unlistenImageChange(d), !this.initialOptions_)
              return;
            const f = this.iconImage_.getSize();
            this.setScale(
              _a(
                f[0],
                f[1],
                t.width,
                t.height
              )
            );
          };
          this.listenImageChange(d);
          return;
        }
      }
      c !== void 0 && this.setScale(
        _a(c, h, t.width, t.height)
      );
    }
  }
  /**
   * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
   * @return {Icon} The cloned style.
   * @api
   * @override
   */
  clone() {
    let t, e, i;
    return this.initialOptions_ ? (e = this.initialOptions_.width, i = this.initialOptions_.height) : (t = this.getScale(), t = Array.isArray(t) ? t.slice() : t), new mi({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0,
      crossOrigin: this.crossOrigin_,
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      opacity: this.getOpacity(),
      rotateWithView: this.getRotateWithView(),
      rotation: this.getRotation(),
      scale: t,
      width: e,
      height: i,
      size: this.size_ !== null ? this.size_.slice() : void 0,
      src: this.getSrc(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   * @override
   */
  getAnchor() {
    let t = this.normalizedAnchor_;
    if (!t) {
      t = this.anchor_;
      const n = this.getSize();
      if (this.anchorXUnits_ == "fraction" || this.anchorYUnits_ == "fraction") {
        if (!n)
          return null;
        t = this.anchor_.slice(), this.anchorXUnits_ == "fraction" && (t[0] *= n[0]), this.anchorYUnits_ == "fraction" && (t[1] *= n[1]);
      }
      if (this.anchorOrigin_ != "top-left") {
        if (!n)
          return null;
        t === this.anchor_ && (t = this.anchor_.slice()), (this.anchorOrigin_ == "top-right" || this.anchorOrigin_ == "bottom-right") && (t[0] = -t[0] + n[0]), (this.anchorOrigin_ == "bottom-left" || this.anchorOrigin_ == "bottom-right") && (t[1] = -t[1] + n[1]);
      }
      this.normalizedAnchor_ = t;
    }
    const e = this.getDisplacement(), i = this.getScaleArray();
    return [
      t[0] - e[0] / i[0],
      t[1] + e[1] / i[1]
    ];
  }
  /**
   * Set the anchor point. The anchor determines the center point for the
   * symbolizer.
   *
   * @param {Array<number>} anchor Anchor.
   * @api
   */
  setAnchor(t) {
    this.anchor_ = t, this.normalizedAnchor_ = null;
  }
  /**
   * Get the icon color.
   * @return {import("../color.js").Color} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image or Canvas element. If the Icon
   * style was configured with `src` or with a not let loaded `img`, an `ImageBitmap` will be returned.
   * @api
   * @override
   */
  getImage(t) {
    return this.iconImage_.getImage(t);
  }
  /**
   * Get the pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} The pixel ratio of the image.
   * @api
   * @override
   */
  getPixelRatio(t) {
    return this.iconImage_.getPixelRatio(t);
  }
  /**
   * @return {import("../size.js").Size} Image size.
   * @override
   */
  getImageSize() {
    return this.iconImage_.getSize();
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   * @override
   */
  getImageState() {
    return this.iconImage_.getImageState();
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image element.
   * @override
   */
  getHitDetectionImage() {
    return this.iconImage_.getHitDetectionImage();
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   * @override
   */
  getOrigin() {
    if (this.origin_)
      return this.origin_;
    let t = this.offset_;
    if (this.offsetOrigin_ != "top-left") {
      const e = this.getSize(), i = this.iconImage_.getSize();
      if (!e || !i)
        return null;
      t = t.slice(), (this.offsetOrigin_ == "top-right" || this.offsetOrigin_ == "bottom-right") && (t[0] = i[0] - e[0] - t[0]), (this.offsetOrigin_ == "bottom-left" || this.offsetOrigin_ == "bottom-right") && (t[1] = i[1] - e[1] - t[1]);
    }
    return this.origin_ = t, this.origin_;
  }
  /**
   * Get the image URL.
   * @return {string|undefined} Image src.
   * @api
   */
  getSrc() {
    return this.iconImage_.getSrc();
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   * @api
   * @override
   */
  getSize() {
    return this.size_ ? this.size_ : this.iconImage_.getSize();
  }
  /**
   * Get the width of the icon (in pixels). Will return undefined when the icon image is not yet loaded.
   * @return {number} Icon width (in pixels).
   * @api
   */
  getWidth() {
    const t = this.getScaleArray();
    if (this.size_)
      return this.size_[0] * t[0];
    if (this.iconImage_.getImageState() == Y.LOADED)
      return this.iconImage_.getSize()[0] * t[0];
  }
  /**
   * Get the height of the icon (in pixels). Will return undefined when the icon image is not yet loaded.
   * @return {number} Icon height (in pixels).
   * @api
   */
  getHeight() {
    const t = this.getScaleArray();
    if (this.size_)
      return this.size_[1] * t[1];
    if (this.iconImage_.getImageState() == Y.LOADED)
      return this.iconImage_.getSize()[1] * t[1];
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   * @override
   */
  setScale(t) {
    delete this.initialOptions_, super.setScale(t);
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  listenImageChange(t) {
    this.iconImage_.addEventListener(Rt.CHANGE, t);
  }
  /**
   * Load not yet loaded URI.
   * When rendering a feature with an icon style, the vector renderer will
   * automatically call this method. However, you might want to call this
   * method yourself for preloading or other purposes.
   * @api
   * @override
   */
  load() {
    this.iconImage_.load();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  unlistenImageChange(t) {
    this.iconImage_.removeEventListener(Rt.CHANGE, t);
  }
  /**
   * @override
   */
  ready() {
    return this.iconImage_.ready();
  }
}
class K {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.color_ = t.color !== void 0 ? t.color : null, this.lineCap_ = t.lineCap, this.lineDash_ = t.lineDash !== void 0 ? t.lineDash : null, this.lineDashOffset_ = t.lineDashOffset, this.lineJoin_ = t.lineJoin, this.miterLimit_ = t.miterLimit, this.width_ = t.width;
  }
  /**
   * Clones the style.
   * @return {Stroke} The cloned style.
   * @api
   */
  clone() {
    const t = this.getColor();
    return new K({
      color: Array.isArray(t) ? t.slice() : t || void 0,
      lineCap: this.getLineCap(),
      lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
      lineDashOffset: this.getLineDashOffset(),
      lineJoin: this.getLineJoin(),
      miterLimit: this.getMiterLimit(),
      width: this.getWidth()
    });
  }
  /**
   * Get the stroke color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the line cap type for the stroke.
   * @return {CanvasLineCap|undefined} Line cap.
   * @api
   */
  getLineCap() {
    return this.lineCap_;
  }
  /**
   * Get the line dash style for the stroke.
   * @return {Array<number>|null} Line dash.
   * @api
   */
  getLineDash() {
    return this.lineDash_;
  }
  /**
   * Get the line dash offset for the stroke.
   * @return {number|undefined} Line dash offset.
   * @api
   */
  getLineDashOffset() {
    return this.lineDashOffset_;
  }
  /**
   * Get the line join type for the stroke.
   * @return {CanvasLineJoin|undefined} Line join.
   * @api
   */
  getLineJoin() {
    return this.lineJoin_;
  }
  /**
   * Get the miter limit for the stroke.
   * @return {number|undefined} Miter limit.
   * @api
   */
  getMiterLimit() {
    return this.miterLimit_;
  }
  /**
   * Get the stroke width.
   * @return {number|undefined} Width.
   * @api
   */
  getWidth() {
    return this.width_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike} color Color.
   * @api
   */
  setColor(t) {
    this.color_ = t;
  }
  /**
   * Set the line cap.
   *
   * @param {CanvasLineCap|undefined} lineCap Line cap.
   * @api
   */
  setLineCap(t) {
    this.lineCap_ = t;
  }
  /**
   * Set the line dash.
   *
   * @param {Array<number>|null} lineDash Line dash.
   * @api
   */
  setLineDash(t) {
    this.lineDash_ = t;
  }
  /**
   * Set the line dash offset.
   *
   * @param {number|undefined} lineDashOffset Line dash offset.
   * @api
   */
  setLineDashOffset(t) {
    this.lineDashOffset_ = t;
  }
  /**
   * Set the line join.
   *
   * @param {CanvasLineJoin|undefined} lineJoin Line join.
   * @api
   */
  setLineJoin(t) {
    this.lineJoin_ = t;
  }
  /**
   * Set the miter limit.
   *
   * @param {number|undefined} miterLimit Miter limit.
   * @api
   */
  setMiterLimit(t) {
    this.miterLimit_ = t;
  }
  /**
   * Set the width.
   *
   * @param {number|undefined} width Width.
   * @api
   */
  setWidth(t) {
    this.width_ = t;
  }
}
class X {
  /**
   * @param {Options} [options] Style options.
   */
  constructor(t) {
    t = t || {}, this.geometry_ = null, this.geometryFunction_ = pa, t.geometry !== void 0 && this.setGeometry(t.geometry), this.fill_ = t.fill !== void 0 ? t.fill : null, this.image_ = t.image !== void 0 ? t.image : null, this.renderer_ = t.renderer !== void 0 ? t.renderer : null, this.hitDetectionRenderer_ = t.hitDetectionRenderer !== void 0 ? t.hitDetectionRenderer : null, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.text_ = t.text !== void 0 ? t.text : null, this.zIndex_ = t.zIndex;
  }
  /**
   * Clones the style.
   * @return {Style} The cloned style.
   * @api
   */
  clone() {
    let t = this.getGeometry();
    return t && typeof t == "object" && (t = /** @type {import("../geom/Geometry.js").default} */
    t.clone()), new X({
      geometry: t ?? void 0,
      fill: this.getFill() ? this.getFill().clone() : void 0,
      image: this.getImage() ? this.getImage().clone() : void 0,
      renderer: this.getRenderer() ?? void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      text: this.getText() ? this.getText().clone() : void 0,
      zIndex: this.getZIndex()
    });
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setRenderer} or the `renderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Sets a custom renderer function for this style. When set, `fill`, `stroke`
   * and `image` options of the style will be ignored.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setRenderer(t) {
    this.renderer_ = t;
  }
  /**
   * Sets a custom renderer function for this style used
   * in hit detection.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setHitDetectionRenderer(t) {
    this.hitDetectionRenderer_ = t;
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setHitDetectionRenderer} or the `hitDetectionRenderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getHitDetectionRenderer() {
    return this.hitDetectionRenderer_;
  }
  /**
   * Get the geometry to be rendered.
   * @return {string|import("../geom/Geometry.js").default|GeometryFunction|null}
   * Feature property or geometry or function that returns the geometry that will
   * be rendered with this style.
   * @api
   */
  getGeometry() {
    return this.geometry_;
  }
  /**
   * Get the function used to generate a geometry for rendering.
   * @return {!GeometryFunction} Function that is called with a feature
   * and returns the geometry to render instead of the feature's geometry.
   * @api
   */
  getGeometryFunction() {
    return this.geometryFunction_;
  }
  /**
   * Get the fill style.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t;
  }
  /**
   * Get the image style.
   * @return {import("./Image.js").default|null} Image style.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Set the image style.
   * @param {import("./Image.js").default} image Image style.
   * @api
   */
  setImage(t) {
    this.image_ = t;
  }
  /**
   * Get the stroke style.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t;
  }
  /**
   * Get the text style.
   * @return {import("./Text.js").default|null} Text style.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Set the text style.
   * @param {import("./Text.js").default} text Text style.
   * @api
   */
  setText(t) {
    this.text_ = t;
  }
  /**
   * Get the z-index for the style.
   * @return {number|undefined} ZIndex.
   * @api
   */
  getZIndex() {
    return this.zIndex_;
  }
  /**
   * Set a geometry that is rendered instead of the feature's geometry.
   *
   * @param {string|import("../geom/Geometry.js").default|GeometryFunction|null} geometry
   *     Feature property or geometry or function returning a geometry to render
   *     for this style.
   * @api
   */
  setGeometry(t) {
    typeof t == "function" ? this.geometryFunction_ = t : typeof t == "string" ? this.geometryFunction_ = function(e) {
      return (
        /** @type {import("../geom/Geometry.js").default} */
        e.get(t)
      );
    } : t ? t !== void 0 && (this.geometryFunction_ = function() {
      return (
        /** @type {import("../geom/Geometry.js").default} */
        t
      );
    }) : this.geometryFunction_ = pa, this.geometry_ = t;
  }
  /**
   * Set the z-index.
   *
   * @param {number|undefined} zIndex ZIndex.
   * @api
   */
  setZIndex(t) {
    this.zIndex_ = t;
  }
}
function $c(r) {
  let t;
  if (typeof r == "function")
    t = r;
  else {
    let e;
    Array.isArray(r) ? e = r : (at(
      typeof /** @type {?} */
      r.getZIndex == "function",
      "Expected an `Style` or an array of `Style`"
    ), e = [
      /** @type {Style} */
      r
    ]), t = function() {
      return e;
    };
  }
  return t;
}
let ds = null;
function Gl(r, t) {
  if (!ds) {
    const e = new $({
      color: "rgba(255,255,255,0.4)"
    }), i = new K({
      color: "#3399CC",
      width: 1.25
    });
    ds = [
      new X({
        image: new Et({
          fill: e,
          stroke: i,
          radius: 5
        }),
        fill: e,
        stroke: i
      })
    ];
  }
  return ds;
}
function ro() {
  const r = {}, t = [255, 255, 255, 1], e = [0, 153, 255, 1], i = 3;
  return r.Polygon = [
    new X({
      fill: new $({
        color: [255, 255, 255, 0.5]
      })
    })
  ], r.MultiPolygon = r.Polygon, r.LineString = [
    new X({
      stroke: new K({
        color: t,
        width: i + 2
      })
    }),
    new X({
      stroke: new K({
        color: e,
        width: i
      })
    })
  ], r.MultiLineString = r.LineString, r.Circle = r.Polygon.concat(r.LineString), r.Point = [
    new X({
      image: new Et({
        radius: i * 2,
        fill: new $({
          color: e
        }),
        stroke: new K({
          color: t,
          width: i / 2
        })
      }),
      zIndex: 1 / 0
    })
  ], r.MultiPoint = r.Point, r.GeometryCollection = r.Polygon.concat(
    r.LineString,
    r.Point
  ), r;
}
function pa(r) {
  return r.getGeometry();
}
const Kc = "#333";
class Kt {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.font_ = t.font, this.rotation_ = t.rotation, this.rotateWithView_ = t.rotateWithView, this.keepUpright_ = t.keepUpright, this.scale_ = t.scale, this.scaleArray_ = ie(t.scale !== void 0 ? t.scale : 1), this.text_ = t.text, this.textAlign_ = t.textAlign, this.justify_ = t.justify, this.repeat_ = t.repeat, this.textBaseline_ = t.textBaseline, this.fill_ = t.fill !== void 0 ? t.fill : new $({ color: Kc }), this.maxAngle_ = t.maxAngle !== void 0 ? t.maxAngle : Math.PI / 4, this.placement_ = t.placement !== void 0 ? t.placement : "point", this.overflow_ = !!t.overflow, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.offsetX_ = t.offsetX !== void 0 ? t.offsetX : 0, this.offsetY_ = t.offsetY !== void 0 ? t.offsetY : 0, this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null, this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null, this.padding_ = t.padding === void 0 ? null : t.padding, this.declutterMode_ = t.declutterMode;
  }
  /**
   * Clones the style.
   * @return {Text} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale();
    return new Kt({
      font: this.getFont(),
      placement: this.getPlacement(),
      repeat: this.getRepeat(),
      maxAngle: this.getMaxAngle(),
      overflow: this.getOverflow(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      keepUpright: this.getKeepUpright(),
      scale: Array.isArray(t) ? t.slice() : t,
      text: this.getText(),
      textAlign: this.getTextAlign(),
      justify: this.getJustify(),
      textBaseline: this.getTextBaseline(),
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0,
      backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0,
      padding: this.getPadding() || void 0,
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the `overflow` configuration.
   * @return {boolean} Let text overflow the length of the path they follow.
   * @api
   */
  getOverflow() {
    return this.overflow_;
  }
  /**
   * Get the font name.
   * @return {string|undefined} Font.
   * @api
   */
  getFont() {
    return this.font_;
  }
  /**
   * Get the maximum angle between adjacent characters.
   * @return {number} Angle in radians.
   * @api
   */
  getMaxAngle() {
    return this.maxAngle_;
  }
  /**
   * Get the label placement.
   * @return {TextPlacement} Text placement.
   * @api
   */
  getPlacement() {
    return this.placement_;
  }
  /**
   * Get the repeat interval of the text.
   * @return {number|undefined} Repeat interval in pixels.
   * @api
   */
  getRepeat() {
    return this.repeat_;
  }
  /**
   * Get the x-offset for the text.
   * @return {number} Horizontal text offset.
   * @api
   */
  getOffsetX() {
    return this.offsetX_;
  }
  /**
   * Get the y-offset for the text.
   * @return {number} Vertical text offset.
   * @api
   */
  getOffsetY() {
    return this.offsetY_;
  }
  /**
   * Get the fill style for the text.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Determine whether the text rotates with the map.
   * @return {boolean|undefined} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Determine whether the text can be rendered upside down.
   * @return {boolean|undefined} Keep text upright.
   * @api
   */
  getKeepUpright() {
    return this.keepUpright_;
  }
  /**
   * Get the text rotation.
   * @return {number|undefined} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the text scale.
   * @return {number|import("../size.js").Size|undefined} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the stroke style for the text.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Get the text to be rendered.
   * @return {string|Array<string>|undefined} Text.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Get the text alignment.
   * @return {CanvasTextAlign|undefined} Text align.
   * @api
   */
  getTextAlign() {
    return this.textAlign_;
  }
  /**
   * Get the justification.
   * @return {TextJustify|undefined} Justification.
   * @api
   */
  getJustify() {
    return this.justify_;
  }
  /**
   * Get the text baseline.
   * @return {CanvasTextBaseline|undefined} Text baseline.
   * @api
   */
  getTextBaseline() {
    return this.textBaseline_;
  }
  /**
   * Get the background fill style for the text.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getBackgroundFill() {
    return this.backgroundFill_;
  }
  /**
   * Get the background stroke style for the text.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getBackgroundStroke() {
    return this.backgroundStroke_;
  }
  /**
   * Get the padding for the text.
   * @return {Array<number>|null} Padding.
   * @api
   */
  getPadding() {
    return this.padding_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {import("./Style.js").DeclutterMode} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Set the `overflow` property.
   *
   * @param {boolean} overflow Let text overflow the path that it follows.
   * @api
   */
  setOverflow(t) {
    this.overflow_ = t;
  }
  /**
   * Set the font.
   *
   * @param {string|undefined} font Font.
   * @api
   */
  setFont(t) {
    this.font_ = t;
  }
  /**
   * Set the maximum angle between adjacent characters.
   *
   * @param {number} maxAngle Angle in radians.
   * @api
   */
  setMaxAngle(t) {
    this.maxAngle_ = t;
  }
  /**
   * Set the x offset.
   *
   * @param {number} offsetX Horizontal text offset.
   * @api
   */
  setOffsetX(t) {
    this.offsetX_ = t;
  }
  /**
   * Set the y offset.
   *
   * @param {number} offsetY Vertical text offset.
   * @api
   */
  setOffsetY(t) {
    this.offsetY_ = t;
  }
  /**
   * Set the text placement.
   *
   * @param {TextPlacement} placement Placement.
   * @api
   */
  setPlacement(t) {
    this.placement_ = t;
  }
  /**
   * Set the repeat interval of the text.
   * @param {number|undefined} [repeat] Repeat interval in pixels.
   * @api
   */
  setRepeat(t) {
    this.repeat_ = t;
  }
  /**
   * Set whether to rotate the text with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  /**
   * Set whether the text can be rendered upside down.
   *
   * @param {boolean} keepUpright Keep text upright.
   * @api
   */
  setKeepUpright(t) {
    this.keepUpright_ = t;
  }
  /**
   * Set the fill.
   *
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t;
  }
  /**
   * Set the rotation.
   *
   * @param {number|undefined} rotation Rotation.
   * @api
   */
  setRotation(t) {
    this.rotation_ = t;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size|undefined} scale Scale.
   * @api
   */
  setScale(t) {
    this.scale_ = t, this.scaleArray_ = ie(t !== void 0 ? t : 1);
  }
  /**
   * Set the stroke.
   *
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t;
  }
  /**
   * Set the text.
   *
   * @param {string|Array<string>|undefined} text Text.
   * @api
   */
  setText(t) {
    this.text_ = t;
  }
  /**
   * Set the text alignment.
   *
   * @param {CanvasTextAlign|undefined} textAlign Text align.
   * @api
   */
  setTextAlign(t) {
    this.textAlign_ = t;
  }
  /**
   * Set the justification.
   *
   * @param {TextJustify|undefined} justify Justification.
   * @api
   */
  setJustify(t) {
    this.justify_ = t;
  }
  /**
   * Set the text baseline.
   *
   * @param {CanvasTextBaseline|undefined} textBaseline Text baseline.
   * @api
   */
  setTextBaseline(t) {
    this.textBaseline_ = t;
  }
  /**
   * Set the background fill.
   *
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setBackgroundFill(t) {
    this.backgroundFill_ = t;
  }
  /**
   * Set the background stroke.
   *
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setBackgroundStroke(t) {
    this.backgroundStroke_ = t;
  }
  /**
   * Set the padding (`[top, right, bottom, left]`).
   *
   * @param {Array<number>|null} padding Padding.
   * @api
   */
  setPadding(t) {
    this.padding_ = t;
  }
}
var qe = /* @__PURE__ */ ((r) => (r.Draft = "draft", r.Cluster = "cluster", r.Submit = "submit", r.Pending = "pending", r.Pending_Qualification = "pending0", r.Pending_Entry = "pending1", r.Pending_Validation = "pending2", r.Valid = "valid", r.Valid_Already_Treated = "valid0", r.Reject = "reject", r.Reject_Irrelevant = "reject0", r))(qe || {}), Ul = /* @__PURE__ */ ((r) => (r.Valid = "valid", r.Valid_Already_Treated = "valid0", r.Reject = "reject", r.Reject_Irrelevant = "reject0", r))(Ul || {});
const Fi = 8, ln = new $({ color: [255, 255, 255, 0.8] }), Ei = {
  cluster: new X({
    image: new Et({
      radius: Fi,
      stroke: new K({ color: [255, 255, 255], width: 3 }),
      fill: ln
    }),
    text: new Kt({
      font: "bold 12px Sans-serif",
      textAlign: "center",
      textBaseline: "middle",
      offsetY: 1,
      fill: new $({ color: [255, 255, 255] })
    })
  }),
  pending: new X({
    image: new Et({
      radius: Fi,
      stroke: new K({ color: [255, 128, 0], width: 3 }),
      fill: ln
    })
  }),
  submit: new X({
    image: new Et({
      radius: Fi,
      stroke: new K({ color: [51, 102, 153], width: 3 }),
      fill: ln
    })
  }),
  valid: new X({
    image: new Et({
      radius: Fi,
      stroke: new K({ color: [0, 192, 0], width: 3 }),
      fill: ln
    })
  }),
  reject: new X({
    image: new Et({
      radius: Fi,
      stroke: new K({ color: [255, 0, 0], width: 3 }),
      fill: ln
    })
  })
}, yt = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function Zt(r) {
  const t = Me();
  for (let e = 0, i = r.length; e < i; ++e)
    Bl(t, r[e]);
  return t;
}
function Hc(r, t, e) {
  const i = Math.min.apply(null, r), n = Math.min.apply(null, t), s = Math.max.apply(null, r), o = Math.max.apply(null, t);
  return ne(i, n, s, o, e);
}
function Dr(r, t, e) {
  return e ? (e[0] = r[0] - t, e[1] = r[1] - t, e[2] = r[2] + t, e[3] = r[3] + t, e) : [
    r[0] - t,
    r[1] - t,
    r[2] + t,
    r[3] + t
  ];
}
function qc(r, t) {
  return r.slice();
}
function _i(r, t, e) {
  let i, n;
  return t < r[0] ? i = r[0] - t : r[2] < t ? i = t - r[2] : i = 0, e < r[1] ? n = r[1] - e : r[3] < e ? n = e - r[3] : n = 0, i * i + n * n;
}
function bs(r, t) {
  return so(r, t[0], t[1]);
}
function cn(r, t) {
  return r[0] <= t[0] && t[2] <= r[2] && r[1] <= t[1] && t[3] <= r[3];
}
function so(r, t, e) {
  return r[0] <= t && t <= r[2] && r[1] <= e && e <= r[3];
}
function Ns(r, t) {
  const e = r[0], i = r[1], n = r[2], s = r[3], o = t[0], a = t[1];
  let l = yt.UNKNOWN;
  return o < e ? l = l | yt.LEFT : o > n && (l = l | yt.RIGHT), a < i ? l = l | yt.BELOW : a > s && (l = l | yt.ABOVE), l === yt.UNKNOWN && (l = yt.INTERSECTING), l;
}
function Me() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function ne(r, t, e, i, n) {
  return n ? (n[0] = r, n[1] = t, n[2] = e, n[3] = i, n) : [r, t, e, i];
}
function Gr(r) {
  return ne(1 / 0, 1 / 0, -1 / 0, -1 / 0, r);
}
function Cn(r, t) {
  const e = r[0], i = r[1];
  return ne(e, i, e, i, t);
}
function oo(r, t, e, i, n) {
  const s = Gr(n);
  return Xl(s, r, t, e, i);
}
function Wl(r, t) {
  return r[0] == t[0] && r[2] == t[2] && r[1] == t[1] && r[3] == t[3];
}
function Yl(r, t) {
  return t[0] < r[0] && (r[0] = t[0]), t[2] > r[2] && (r[2] = t[2]), t[1] < r[1] && (r[1] = t[1]), t[3] > r[3] && (r[3] = t[3]), r;
}
function Bl(r, t) {
  t[0] < r[0] && (r[0] = t[0]), t[0] > r[2] && (r[2] = t[0]), t[1] < r[1] && (r[1] = t[1]), t[1] > r[3] && (r[3] = t[1]);
}
function Xl(r, t, e, i, n) {
  for (; e < i; e += n)
    Jc(r, t[e], t[e + 1]);
  return r;
}
function Jc(r, t, e) {
  r[0] = Math.min(r[0], t), r[1] = Math.min(r[1], e), r[2] = Math.max(r[2], t), r[3] = Math.max(r[3], e);
}
function zl(r, t) {
  let e;
  return e = t(Zl(r)), e || (e = t(Vl(r)), e) || (e = t(jl(r)), e) || (e = t(ao(r)), e) ? e : !1;
}
function Zl(r) {
  return [r[0], r[1]];
}
function Vl(r) {
  return [r[2], r[1]];
}
function Fe(r) {
  return [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2];
}
function Qc(r, t, e, i, n) {
  const [s, o, a, l, c, h, u, d] = tu(
    r,
    t,
    e,
    i
  );
  return ne(
    Math.min(s, a, c, u),
    Math.min(o, l, h, d),
    Math.max(s, a, c, u),
    Math.max(o, l, h, d),
    n
  );
}
function tu(r, t, e, i) {
  const n = t * i[0] / 2, s = t * i[1] / 2, o = Math.cos(e), a = Math.sin(e), l = n * o, c = n * a, h = s * o, u = s * a, d = r[0], f = r[1];
  return [
    d - l + u,
    f - c - h,
    d - l - u,
    f - c + h,
    d + l - u,
    f + c + h,
    d + l + u,
    f + c - h,
    d - l + u,
    f - c - h
  ];
}
function de(r) {
  return r[3] - r[1];
}
function ao(r) {
  return [r[0], r[3]];
}
function jl(r) {
  return [r[2], r[3]];
}
function St(r) {
  return r[2] - r[0];
}
function jt(r, t) {
  return r[0] <= t[2] && r[2] >= t[0] && r[1] <= t[3] && r[3] >= t[1];
}
function lo(r) {
  return r[2] < r[0] || r[3] < r[1];
}
function eu(r, t) {
  return t ? (t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t) : r;
}
function iu(r, t, e) {
  let i = !1;
  const n = Ns(r, t), s = Ns(r, e);
  if (n === yt.INTERSECTING || s === yt.INTERSECTING)
    i = !0;
  else {
    const o = r[0], a = r[1], l = r[2], c = r[3], h = t[0], u = t[1], d = e[0], f = e[1], g = (f - u) / (d - h);
    let m, _;
    s & yt.ABOVE && !(n & yt.ABOVE) && (m = d - (f - c) / g, i = m >= o && m <= l), !i && s & yt.RIGHT && !(n & yt.RIGHT) && (_ = f - (d - l) * g, i = _ >= a && _ <= c), !i && s & yt.BELOW && !(n & yt.BELOW) && (m = d - (f - a) / g, i = m >= o && m <= l), !i && s & yt.LEFT && !(n & yt.LEFT) && (_ = f - (d - o) * g, i = _ >= a && _ <= c);
  }
  return i;
}
function nu(r, t, e, i) {
  if (lo(r))
    return Gr(e);
  let n = [];
  n = [
    r[0],
    r[1],
    r[2],
    r[1],
    r[2],
    r[3],
    r[0],
    r[3]
  ], t(n, n, 2);
  const s = [], o = [];
  for (let a = 0, l = n.length; a < l; a += 2)
    s.push(n[a]), o.push(n[a + 1]);
  return Hc(s, o, e);
}
function $l(r, t) {
  const e = t.getExtent(), i = Fe(r);
  if (t.canWrapX() && (i[0] < e[0] || i[0] >= e[2])) {
    const n = St(e), o = Math.floor(
      (i[0] - e[0]) / n
    ) * n;
    r[0] -= o, r[2] -= o;
  }
  return r;
}
function ru(r, t, e) {
  if (t.canWrapX()) {
    const i = t.getExtent();
    if (!isFinite(r[0]) || !isFinite(r[2]))
      return [[i[0], r[1], i[2], r[3]]];
    $l(r, t);
    const n = St(i);
    if (St(r) > n)
      return [[i[0], r[1], i[2], r[3]]];
    if (r[0] < i[0])
      return [
        [r[0] + n, r[1], i[2], r[3]],
        [i[0], r[1], r[2], r[3]]
      ];
    if (r[2] > i[2])
      return [
        [r[0], r[1], i[2], r[3]],
        [i[0], r[1], r[2] - n, r[3]]
      ];
  }
  return [r];
}
class su {
  constructor(t) {
    this.storage = t, this.EXTENT_PREFIX = "extent:";
  }
  /**
   * Adds or replaces a named extent area
   * @param name - Name of the extent area (generated if not provided)
   * @param extents - Single extent or array of extents
   * @returns The name used to store the extents
   */
  async addExtent(t, e) {
    const i = Array.isArray(e) ? e : [e];
    (!t || t.trim() === "") && (t = `Sans titre ${(await this.getNames()).length}`);
    const n = this.EXTENT_PREFIX + t;
    return await this.storage.saveMetadata(n, {
      id: n,
      name: t,
      type: "vector",
      created: /* @__PURE__ */ new Date(),
      modified: /* @__PURE__ */ new Date(),
      size: 0,
      extra: {
        extents: i
      }
    }), t;
  }
  /**
   * Appends a single extent to an existing named area
   * @param name - Name of the extent area
   * @param extent - Extent to append
   */
  async appendExtent(t, e) {
    const i = await this.get(t), n = i.length > 0 ? [...i, e] : [e];
    await this.addExtent(t, n);
  }
  /**
   * Retrieves the extent array for a given name
   * Returns empty array if not found
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async get(t) {
    var n;
    const e = this.EXTENT_PREFIX + t, i = await this.storage.getMetadata(e);
    return !i || !((n = i.extra) != null && n.extents) ? [] : i.extra.extents;
  }
  /**
   * Retrieves a single extent for a given name (alias for get)
   * @param name - Name of the extent area
   * @returns Array of extents
   */
  async getExtent(t) {
    return this.get(t);
  }
  /**
   * Returns all stored extent names
   * @returns Array of extent area names
   */
  async getNames() {
    return (await this.storage.listMetadata(this.EXTENT_PREFIX)).filter((e) => e.id.startsWith(this.EXTENT_PREFIX)).map((e) => e.id.substring(this.EXTENT_PREFIX.length));
  }
  /**
   * Returns key-value pairs of extent names
   * @returns Object mapping names to themselves
   */
  async getExtentNames() {
    const t = await this.getNames(), e = {};
    for (const i of t)
      e[i] = i;
    return e;
  }
  /**
   * Removes a named extent area
   * @param name - Name of the extent area to remove
   */
  async deleteExtent(t) {
    const e = this.EXTENT_PREFIX + t;
    await this.storage.deleteMetadata(e);
  }
  /**
   * Retrieves a single extent that encompasses all extents for the given name(s)
   * Unions multiple extent boxes into one bounding box that contains all of them
   * @param names - Single name or array of names
   * @returns Combined extent
   */
  async getAllInOneExtent(t) {
    const e = Me(), i = Array.isArray(t) ? await this.getAllExtents(t) : await this.get(t);
    for (const n of i)
      Yl(e, n);
    return e;
  }
  /**
   * Retrieves all extents for multiple names as a flat array
   * @param names - Array of extent area names
   * @returns Flattened array of all extents
   */
  async getAllExtents(t) {
    if (!Array.isArray(t))
      throw new Error("names parameter must be an array");
    return (await Promise.all(
      t.map((i) => this.get(i))
    )).flat();
  }
}
const Vt = {
  ANIMATING: 0,
  INTERACTING: 1
};
function ou(r, t) {
  return r[0] += +t[0], r[1] += +t[1], r;
}
function Kl(r, t) {
  const e = r[0], i = r[1], n = t[0], s = t[1], o = n[0], a = n[1], l = s[0], c = s[1], h = l - o, u = c - a, d = h === 0 && u === 0 ? 0 : (h * (e - o) + u * (i - a)) / (h * h + u * u || 0);
  let f, g;
  return d <= 0 ? (f = o, g = a) : d >= 1 ? (f = l, g = c) : (f = o + d * h, g = a + d * u), [f, g];
}
function Pt(r, t) {
  let e = !0;
  for (let i = r.length - 1; i >= 0; --i)
    if (r[i] != t[i]) {
      e = !1;
      break;
    }
  return e;
}
function au(r, t) {
  const e = Math.cos(t), i = Math.sin(t), n = r[0] * e - r[1] * i, s = r[1] * e + r[0] * i;
  return r[0] = n, r[1] = s, r;
}
function zi(r, t) {
  const e = r[0] - t[0], i = r[1] - t[1];
  return e * e + i * i;
}
function wr(r, t) {
  return Math.sqrt(zi(r, t));
}
function lu(r, t) {
  return zi(r, Kl(r, t));
}
function hu(r, t) {
  if (t.canWrapX()) {
    const e = St(t.getExtent()), i = Hl(r, t, e);
    i && (r[0] -= i * e);
  }
  return r;
}
function Hl(r, t, e) {
  const i = t.getExtent();
  let n = 0;
  return t.canWrapX() && (r[0] < i[0] || r[0] > i[2]) && (e = e || St(i), n = Math.floor(
    (r[0] - i[0]) / e
  )), n;
}
function cu(...r) {
  console.warn(...r);
}
const ql = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class Ur {
  /**
   * @param {Options} options Projection options.
   */
  constructor(t) {
    this.code_ = t.code, this.units_ = /** @type {import("./Units.js").Units} */
    t.units, this.extent_ = t.extent !== void 0 ? t.extent : null, this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null, this.axisOrientation_ = t.axisOrientation !== void 0 ? t.axisOrientation : "enu", this.global_ = t.global !== void 0 ? t.global : !1, this.canWrapX_ = !!(this.global_ && this.extent_), this.getPointResolutionFunc_ = t.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = t.metersPerUnit;
  }
  /**
   * @return {boolean} The projection is suitable for wrapping the x-axis
   */
  canWrapX() {
    return this.canWrapX_;
  }
  /**
   * Get the code for this projection, e.g. 'EPSG:4326'.
   * @return {string} Code.
   * @api
   */
  getCode() {
    return this.code_;
  }
  /**
   * Get the validity extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the units of this projection.
   * @return {import("./Units.js").Units} Units.
   * @api
   */
  getUnits() {
    return this.units_;
  }
  /**
   * Get the amount of meters per unit of this projection.  If the projection is
   * not configured with `metersPerUnit` or a units identifier, the return is
   * `undefined`.
   * @return {number|undefined} Meters.
   * @api
   */
  getMetersPerUnit() {
    return this.metersPerUnit_ || ql[this.units_];
  }
  /**
   * Get the world extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getWorldExtent() {
    return this.worldExtent_;
  }
  /**
   * Get the axis orientation of this projection.
   * Example values are:
   * enu - the default easting, northing, elevation.
   * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
   *     or south orientated transverse mercator.
   * wnu - westing, northing, up - some planetary coordinate systems have
   *     "west positive" coordinate systems
   * @return {string} Axis orientation.
   * @api
   */
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  /**
   * Is this projection a global projection which spans the whole world?
   * @return {boolean} Whether the projection is global.
   * @api
   */
  isGlobal() {
    return this.global_;
  }
  /**
   * Set if the projection is a global projection which spans the whole world
   * @param {boolean} global Whether the projection is global.
   * @api
   */
  setGlobal(t) {
    this.global_ = t, this.canWrapX_ = !!(t && this.extent_);
  }
  /**
   * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
   */
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  /**
   * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
   */
  setDefaultTileGrid(t) {
    this.defaultTileGrid_ = t;
  }
  /**
   * Set the validity extent for this projection.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  setExtent(t) {
    this.extent_ = t, this.canWrapX_ = !!(this.global_ && t);
  }
  /**
   * Set the world extent for this projection.
   * @param {import("../extent.js").Extent} worldExtent World extent
   *     [minlon, minlat, maxlon, maxlat].
   * @api
   */
  setWorldExtent(t) {
    this.worldExtent_ = t;
  }
  /**
   * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
   * for this projection.
   * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
   * @api
   */
  setGetPointResolution(t) {
    this.getPointResolutionFunc_ = t;
  }
  /**
   * Get the custom point resolution function for this projection (if set).
   * @return {GetPointResolution|undefined} The custom point
   * resolution function (if set).
   */
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const kn = 6378137, Li = Math.PI * kn, uu = [-Li, -Li, Li, Li], du = [-180, -85, 180, 85], $n = kn * Math.log(Math.tan(Math.PI / 2));
class Ci extends Ur {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: uu,
      global: !0,
      worldExtent: du,
      getPointResolution: function(e, i) {
        return e / Math.cosh(i[1] / kn);
      }
    });
  }
}
const ya = [
  new Ci("EPSG:3857"),
  new Ci("EPSG:102100"),
  new Ci("EPSG:102113"),
  new Ci("EPSG:900913"),
  new Ci("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new Ci("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function fu(r, t, e, i) {
  const n = r.length;
  e = e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = r.slice() : t = new Array(n));
  for (let s = 0; s < n; s += i) {
    t[s] = Li * r[s] / 180;
    let o = kn * Math.log(Math.tan(Math.PI * (+r[s + 1] + 90) / 360));
    o > $n ? o = $n : o < -$n && (o = -$n), t[s + 1] = o;
  }
  return t;
}
function gu(r, t, e, i) {
  const n = r.length;
  e = e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = r.slice() : t = new Array(n));
  for (let s = 0; s < n; s += i)
    t[s] = 180 * r[s] / Li, t[s + 1] = 360 * Math.atan(Math.exp(r[s + 1] / kn)) / Math.PI - 90;
  return t;
}
const mu = 6378137, wa = [-180, -90, 180, 90], _u = Math.PI * mu / 180;
class He extends Ur {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: wa,
      axisOrientation: e,
      global: !0,
      metersPerUnit: _u,
      worldExtent: wa
    });
  }
}
const Ea = [
  new He("CRS:84"),
  new He("EPSG:4326", "neu"),
  new He("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new He("urn:ogc:def:crs:OGC:2:84"),
  new He("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new He("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new He("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let ks = {};
function gr(r) {
  return ks[r] || ks[r.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function pu(r, t) {
  ks[r] = t;
}
let Gi = {};
function ui(r, t, e) {
  const i = r.getCode(), n = t.getCode();
  i in Gi || (Gi[i] = {}), Gi[i][n] = e;
}
function mr(r, t) {
  return r in Gi && t in Gi[r] ? Gi[r][t] : null;
}
const Er = 0.9996, Ht = 669438e-8, Wr = Ht * Ht, Yr = Wr * Ht, ei = Ht / (1 - Ht), Ca = Math.sqrt(1 - Ht), Zi = (1 - Ca) / (1 + Ca), Jl = Zi * Zi, ho = Jl * Zi, co = ho * Zi, Ql = co * Zi, th = 1 - Ht / 4 - 3 * Wr / 64 - 5 * Yr / 256, yu = 3 * Ht / 8 + 3 * Wr / 32 + 45 * Yr / 1024, wu = 15 * Wr / 256 + 45 * Yr / 1024, Eu = 35 * Yr / 3072, Cu = 3 / 2 * Zi - 27 / 32 * ho + 269 / 512 * Ql, Su = 21 / 16 * Jl - 55 / 32 * co, xu = 151 / 96 * ho - 417 / 128 * Ql, Ru = 1097 / 512 * co, Cr = 6378137;
function Iu(r, t, e) {
  const i = r - 5e5, o = (e.north ? t : t - 1e7) / Er / (Cr * th), a = o + Cu * Math.sin(2 * o) + Su * Math.sin(4 * o) + xu * Math.sin(6 * o) + Ru * Math.sin(8 * o), l = Math.sin(a), c = l * l, h = Math.cos(a), u = l / h, d = u * u, f = d * d, g = 1 - Ht * c, m = Math.sqrt(1 - Ht * c), _ = Cr / m, p = (1 - Ht) / g, y = ei * h ** 2, S = y * y, C = i / (_ * Er), R = C * C, I = R * C, F = I * C, P = F * C, M = P * C, A = a - u / p * (R / 2 - F / 24 * (5 + 3 * d + 10 * y - 4 * S - 9 * ei)) + M / 720 * (61 + 90 * d + 298 * y + 45 * f - 252 * ei - 3 * S);
  let z = (C - I / 6 * (1 + 2 * d + y) + P / 120 * (5 - 2 * y + 28 * d - 3 * S + 8 * ei + 24 * f)) / h;
  return z = vs(
    z + wn(eh(e.number)),
    -Math.PI,
    Math.PI
  ), [la(z), la(A)];
}
const Sa = -80, xa = 84, Tu = -180, Pu = 180;
function Mu(r, t, e) {
  r = vs(r, Tu, Pu), t < Sa ? t = Sa : t > xa && (t = xa);
  const i = wn(t), n = Math.sin(i), s = Math.cos(i), o = n / s, a = o * o, l = a * a, c = wn(r), h = eh(e.number), u = wn(h), d = Cr / Math.sqrt(1 - Ht * n ** 2), f = ei * s ** 2, g = s * vs(c - u, -Math.PI, Math.PI), m = g * g, _ = m * g, p = _ * g, y = p * g, S = y * g, C = Cr * (th * i - yu * Math.sin(2 * i) + wu * Math.sin(4 * i) - Eu * Math.sin(6 * i)), R = Er * d * (g + _ / 6 * (1 - a + f) + y / 120 * (5 - 18 * a + l + 72 * f - 58 * ei)) + 5e5;
  let I = Er * (C + d * o * (m / 2 + p / 24 * (5 - a + 9 * f + 4 * f ** 2) + S / 720 * (61 - 58 * a + l + 600 * f - 330 * ei)));
  return e.north || (I += 1e7), [R, I];
}
function eh(r) {
  return (r - 1) * 6 - 180 + 3;
}
const Fu = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function ih(r) {
  let t = 0;
  for (const n of Fu) {
    const s = r.match(n);
    if (s) {
      t = parseInt(s[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, i = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (i = !0, e = t - 32600), e ? { number: e, north: i } : null;
}
function Ra(r, t) {
  return function(e, i, n, s) {
    const o = e.length;
    n = n > 1 ? n : 2, s = s ?? n, i || (n > 2 ? i = e.slice() : i = new Array(o));
    for (let a = 0; a < o; a += s) {
      const l = e[a], c = e[a + 1], h = r(l, c, t);
      i[a] = h[0], i[a + 1] = h[1];
    }
    return i;
  };
}
function vu(r) {
  return ih(r) ? new Ur({ code: r, units: "m" }) : null;
}
function Au(r) {
  const t = ih(r.getCode());
  return t ? {
    forward: Ra(Mu, t),
    inverse: Ra(Iu, t)
  } : null;
}
const Lu = [Au], Ou = [vu];
let Ds = !0;
function bu(r) {
  Ds = !1;
}
function uo(r, t) {
  if (t !== void 0) {
    for (let e = 0, i = r.length; e < i; ++e)
      t[e] = r[e];
    t = t;
  } else
    t = r.slice();
  return t;
}
function Sr(r) {
  pu(r.getCode(), r), ui(r, r, uo);
}
function Nu(r) {
  r.forEach(Sr);
}
function rt(r) {
  if (typeof r != "string")
    return r;
  const t = gr(r);
  if (t)
    return t;
  for (const e of Ou) {
    const i = e(r);
    if (i)
      return i;
  }
  return null;
}
function Gs(r) {
  Nu(r), r.forEach(function(t) {
    r.forEach(function(e) {
      t !== e && ui(t, e, uo);
    });
  });
}
function ku(r, t, e, i) {
  r.forEach(function(n) {
    t.forEach(function(s) {
      ui(n, s, e), ui(s, n, i);
    });
  });
}
function fo(r, t) {
  return r ? typeof r == "string" ? rt(r) : (
    /** @type {Projection} */
    r
  ) : rt(t);
}
function Ia(r) {
  return (
    /**
     * @param {Array<number>} input Input.
     * @param {Array<number>} [output] Output.
     * @param {number} [dimension] Dimensions that should be transformed.
     * @param {number} [stride] Stride.
     * @return {Array<number>} Output.
     */
    function(t, e, i, n) {
      const s = t.length;
      i = i !== void 0 ? i : 2, n = n ?? i, e = e !== void 0 ? e : new Array(s);
      for (let o = 0; o < s; o += n) {
        const a = r(t.slice(o, o + i)), l = a.length;
        for (let c = 0, h = n; c < h; ++c)
          e[o + c] = c >= l ? t[o + c] : a[c];
      }
      return e;
    }
  );
}
function Du(r, t, e, i) {
  const n = rt(r), s = rt(t);
  ui(
    n,
    s,
    Ia(e)
  ), ui(
    s,
    n,
    Ia(i)
  );
}
function nh(r, t) {
  if (r === t)
    return !0;
  const e = r.getUnits() === t.getUnits();
  return (r.getCode() === t.getCode() || rh(r, t) === uo) && e;
}
function rh(r, t) {
  const e = r.getCode(), i = t.getCode();
  let n = mr(e, i);
  if (n)
    return n;
  let s = null, o = null;
  for (const l of Lu)
    s || (s = l(r)), o || (o = l(t));
  if (!s && !o)
    return null;
  const a = "EPSG:4326";
  if (o)
    if (s)
      n = fs(
        s.inverse,
        o.forward
      );
    else {
      const l = mr(e, a);
      l && (n = fs(
        l,
        o.forward
      ));
    }
  else {
    const l = mr(a, i);
    l && (n = fs(
      s.inverse,
      l
    ));
  }
  return n && (Sr(r), Sr(t), ui(r, t, n)), n;
}
function fs(r, t) {
  return function(e, i, n, s) {
    return i = r(e, i, n, s), t(i, i, n, s);
  };
}
function Pn(r, t) {
  const e = rt(r), i = rt(t);
  return rh(e, i);
}
function Gu(r, t, e) {
  const i = Pn(t, e);
  if (!i) {
    const n = rt(t).getCode(), s = rt(e).getCode();
    throw new Error(
      `No transform available between ${n} and ${s}`
    );
  }
  return i(r, void 0, r.length);
}
function go(r, t, e, i) {
  const n = Pn(t, e);
  return nu(r, n, void 0);
}
function Vi(r, t) {
  return r;
}
function lt(r, t) {
  return Ds && !Pt(r, [0, 0]) && r[0] >= -180 && r[0] <= 180 && r[1] >= -90 && r[1] <= 90 && (Ds = !1, cu(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), r;
}
function Br(r, t) {
  return r;
}
function ii(r, t) {
  return r;
}
function Uu(r, t) {
  return r;
}
function Ta(r, t, e) {
  return function(i) {
    let n, s;
    if (r.canWrapX()) {
      const o = r.getExtent(), a = St(o);
      i = i.slice(0), s = Hl(i, r, a), s && (i[0] = i[0] - s * a), i[0] = ht(i[0], o[0], o[2]), i[1] = ht(i[1], o[1], o[3]), n = e(i);
    } else
      n = e(i);
    return s && t.canWrapX() && (n[0] += s * St(t.getExtent())), n;
  };
}
function Wu() {
  Gs(ya), Gs(Ea), ku(
    Ea,
    ya,
    fu,
    gu
  );
}
Wu();
const ni = {
  /**
   * Triggered before a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#prerender
   * @api
   */
  PRERENDER: "prerender",
  /**
   * Triggered after a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
};
function Be(r, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let s = 0;
  for (let o = t; o < e; o += i)
    n[s++] = r.slice(o, o + i);
  return n.length = s, n;
}
function Mn(r, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let s = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    n[s++] = Be(
      r,
      t,
      l,
      i,
      n[s]
    ), t = l;
  }
  return n.length = s, n;
}
function Us(r, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let s = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    n[s++] = l.length === 1 && l[0] === t ? [] : Mn(
      r,
      t,
      l,
      i,
      n[s]
    ), t = l[l.length - 1];
  }
  return n.length = s, n;
}
class sh {
  /**
   * Render a geometry with a custom renderer.
   *
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {Function} renderer Renderer.
   * @param {Function} hitDetectionRenderer Renderer.
   * @param {number} [index] Render order index.
   */
  drawCustom(t, e, i, n, s) {
  }
  /**
   * Render a geometry.
   *
   * @param {import("../geom/Geometry.js").default} geometry The geometry to render.
   */
  drawGeometry(t) {
  }
  /**
   * Set the rendering style.
   *
   * @param {import("../style/Style.js").default} style The rendering style.
   */
  setStyle(t) {
  }
  /**
   * @param {import("../geom/Circle.js").default} circleGeometry Circle geometry.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawCircle(t, e, i) {
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("../style/Style.js").default} style Style.
   * @param {number} [index] Render order index.
   */
  drawFeature(t, e, i) {
  }
  /**
   * @param {import("../geom/GeometryCollection.js").default} geometryCollectionGeometry Geometry collection.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawGeometryCollection(t, e, i) {
  }
  /**
   * @param {import("../geom/LineString.js").default|import("./Feature.js").default} lineStringGeometry Line string geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawLineString(t, e, i) {
  }
  /**
   * @param {import("../geom/MultiLineString.js").default|import("./Feature.js").default} multiLineStringGeometry MultiLineString geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawMultiLineString(t, e, i) {
  }
  /**
   * @param {import("../geom/MultiPoint.js").default|import("./Feature.js").default} multiPointGeometry MultiPoint geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawMultiPoint(t, e, i) {
  }
  /**
   * @param {import("../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawMultiPolygon(t, e, i) {
  }
  /**
   * @param {import("../geom/Point.js").default|import("./Feature.js").default} pointGeometry Point geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawPoint(t, e, i) {
  }
  /**
   * @param {import("../geom/Polygon.js").default|import("./Feature.js").default} polygonGeometry Polygon geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawPolygon(t, e, i) {
  }
  /**
   * @param {import("../geom/SimpleGeometry.js").default|import("./Feature.js").default} geometry Geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawText(t, e, i) {
  }
  /**
   * @param {import("../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../style/Stroke.js").default} strokeStyle Stroke style.
   */
  setFillStrokeStyle(t, e) {
  }
  /**
   * @param {import("../style/Image.js").default} imageStyle Image style.
   * @param {import("../render/canvas.js").DeclutterImageWithText} [declutterImageWithText] Shared data for combined decluttering with a text style.
   */
  setImageStyle(t, e) {
  }
  /**
   * @param {import("../style/Text.js").default} textStyle Text style.
   * @param {import("../render/canvas.js").DeclutterImageWithText} [declutterImageWithText] Shared data for combined decluttering with an image style.
   */
  setTextStyle(t, e) {
  }
}
const L = {
  BEGIN_GEOMETRY: 0,
  BEGIN_PATH: 1,
  CIRCLE: 2,
  CLOSE_PATH: 3,
  CUSTOM: 4,
  DRAW_CHARS: 5,
  DRAW_IMAGE: 6,
  END_GEOMETRY: 7,
  FILL: 8,
  MOVE_TO_LINE_TO: 9,
  SET_FILL_STYLE: 10,
  SET_STROKE_STYLE: 11,
  STROKE: 12
}, Kn = [L.FILL], Xe = [L.STROKE], ri = [L.BEGIN_PATH], Pa = [L.CLOSE_PATH];
class Dn extends sh {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(), this.tolerance = t, this.maxExtent = e, this.pixelRatio = n, this.maxLineWidth = 0, this.resolution = i, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_ = null, this.bufferedMaxExtent_ = null, this.instructions = [], this.coordinates = [], this.tmpCoordinate_ = [], this.hitDetectionInstructions = [], this.state = /** @type {import("../canvas.js").FillStrokeState} */
    {};
  }
  /**
   * @protected
   * @param {Array<number>} dashArray Dash array.
   * @return {Array<number>} Dash array with pixel ratio applied
   */
  applyPixelRatio(t) {
    const e = this.pixelRatio;
    return e == 1 ? t : t.map(function(i) {
      return i * e;
    });
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} stride Stride.
   * @protected
   * @return {number} My end
   */
  appendFlatPointCoordinates(t, e) {
    const i = this.getBufferedMaxExtent(), n = this.tmpCoordinate_, s = this.coordinates;
    let o = s.length;
    for (let a = 0, l = t.length; a < l; a += e)
      n[0] = t[a], n[1] = t[a + 1], bs(i, n) && (s[o++] = n[0], s[o++] = n[1]);
    return o;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} closed Last input coordinate equals first.
   * @param {boolean} skipFirst Skip first coordinate.
   * @protected
   * @return {number} My end.
   */
  appendFlatLineCoordinates(t, e, i, n, s, o) {
    const a = this.coordinates;
    let l = a.length;
    const c = this.getBufferedMaxExtent();
    o && (e += n);
    let h = t[e], u = t[e + 1];
    const d = this.tmpCoordinate_;
    let f = !0, g, m, _;
    for (g = e + n; g < i; g += n)
      d[0] = t[g], d[1] = t[g + 1], _ = Ns(c, d), _ !== m ? (f && (a[l++] = h, a[l++] = u, f = !1), a[l++] = d[0], a[l++] = d[1]) : _ === yt.INTERSECTING ? (a[l++] = d[0], a[l++] = d[1], f = !1) : f = !0, h = d[0], u = d[1], m = _;
    return (s && f || g === e + n) && (a[l++] = h, a[l++] = u), l;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @param {Array<number>} builderEnds Builder ends.
   * @return {number} Offset.
   */
  drawCustomCoordinates_(t, e, i, n, s) {
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o], c = this.appendFlatLineCoordinates(
        t,
        e,
        l,
        n,
        !1,
        !1
      );
      s.push(c), e = l;
    }
    return e;
  }
  /**
   * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {Function} renderer Renderer.
   * @param {Function} hitDetectionRenderer Renderer.
   * @param {number} [index] Render order index.
   * @override
   */
  drawCustom(t, e, i, n, s) {
    this.beginGeometry(t, e, s);
    const o = t.getType(), a = t.getStride(), l = this.coordinates.length;
    let c, h, u, d, f;
    switch (o) {
      case "MultiPolygon":
        c = /** @type {import("../../geom/MultiPolygon.js").default} */
        t.getOrientedFlatCoordinates(), d = [];
        const g = (
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t.getEndss()
        );
        f = 0;
        for (let m = 0, _ = g.length; m < _; ++m) {
          const p = [];
          f = this.drawCustomCoordinates_(
            c,
            f,
            g[m],
            a,
            p
          ), d.push(p);
        }
        this.instructions.push([
          L.CUSTOM,
          l,
          d,
          t,
          i,
          Us,
          s
        ]), this.hitDetectionInstructions.push([
          L.CUSTOM,
          l,
          d,
          t,
          n || i,
          Us,
          s
        ]);
        break;
      case "Polygon":
      case "MultiLineString":
        u = [], c = o == "Polygon" ? (
          /** @type {import("../../geom/Polygon.js").default} */
          t.getOrientedFlatCoordinates()
        ) : t.getFlatCoordinates(), f = this.drawCustomCoordinates_(
          c,
          0,
          /** @type {import("../../geom/Polygon.js").default|import("../../geom/MultiLineString.js").default} */
          t.getEnds(),
          a,
          u
        ), this.instructions.push([
          L.CUSTOM,
          l,
          u,
          t,
          i,
          Mn,
          s
        ]), this.hitDetectionInstructions.push([
          L.CUSTOM,
          l,
          u,
          t,
          n || i,
          Mn,
          s
        ]);
        break;
      case "LineString":
      case "Circle":
        c = t.getFlatCoordinates(), h = this.appendFlatLineCoordinates(
          c,
          0,
          c.length,
          a,
          !1,
          !1
        ), this.instructions.push([
          L.CUSTOM,
          l,
          h,
          t,
          i,
          Be,
          s
        ]), this.hitDetectionInstructions.push([
          L.CUSTOM,
          l,
          h,
          t,
          n || i,
          Be,
          s
        ]);
        break;
      case "MultiPoint":
        c = t.getFlatCoordinates(), h = this.appendFlatPointCoordinates(c, a), h > l && (this.instructions.push([
          L.CUSTOM,
          l,
          h,
          t,
          i,
          Be,
          s
        ]), this.hitDetectionInstructions.push([
          L.CUSTOM,
          l,
          h,
          t,
          n || i,
          Be,
          s
        ]));
        break;
      case "Point":
        c = t.getFlatCoordinates(), this.coordinates.push(c[0], c[1]), h = this.coordinates.length, this.instructions.push([
          L.CUSTOM,
          l,
          h,
          t,
          i,
          void 0,
          s
        ]), this.hitDetectionInstructions.push([
          L.CUSTOM,
          l,
          h,
          t,
          n || i,
          void 0,
          s
        ]);
        break;
    }
    this.endGeometry(e);
  }
  /**
   * @protected
   * @param {import("../../geom/Geometry").default|import("../Feature.js").default} geometry The geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} index Render order index
   */
  beginGeometry(t, e, i) {
    this.beginGeometryInstruction1_ = [
      L.BEGIN_GEOMETRY,
      e,
      0,
      t,
      i
    ], this.instructions.push(this.beginGeometryInstruction1_), this.beginGeometryInstruction2_ = [
      L.BEGIN_GEOMETRY,
      e,
      0,
      t,
      i
    ], this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    return {
      instructions: this.instructions,
      hitDetectionInstructions: this.hitDetectionInstructions,
      coordinates: this.coordinates
    };
  }
  /**
   * Reverse the hit detection instructions.
   */
  reverseHitDetectionInstructions() {
    const t = this.hitDetectionInstructions;
    t.reverse();
    let e;
    const i = t.length;
    let n, s, o = -1;
    for (e = 0; e < i; ++e)
      n = t[e], s = /** @type {import("./Instruction.js").default} */
      n[0], s == L.END_GEOMETRY ? o = e : s == L.BEGIN_GEOMETRY && (n[2] = e, Lc(this.hitDetectionInstructions, o, e), o = -1);
  }
  /**
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import('../canvas.js').FillStrokeState} [state] State.
   * @return {import('../canvas.js').FillStrokeState} State.
   */
  fillStyleToState(t, e = (
    /** @type {import('../canvas.js').FillStrokeState} */
    {}
  )) {
    if (t) {
      const i = t.getColor();
      e.fillPatternScale = i && typeof i == "object" && "src" in i ? this.pixelRatio : 1, e.fillStyle = ce(
        i || At
      );
    } else
      e.fillStyle = void 0;
    return e;
  }
  /**
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {import("../canvas.js").FillStrokeState} State.
   */
  strokeStyleToState(t, e = (
    /** @type {import('../canvas.js').FillStrokeState} */
    {}
  )) {
    if (t) {
      const i = t.getColor();
      e.strokeStyle = ce(
        i || Rn
      );
      const n = t.getLineCap();
      e.lineCap = n !== void 0 ? n : Bi;
      const s = t.getLineDash();
      e.lineDash = s ? s.slice() : xe;
      const o = t.getLineDashOffset();
      e.lineDashOffset = o || Re;
      const a = t.getLineJoin();
      e.lineJoin = a !== void 0 ? a : Xi;
      const l = t.getWidth();
      e.lineWidth = l !== void 0 ? l : Tn;
      const c = t.getMiterLimit();
      e.miterLimit = c !== void 0 ? c : xn, e.lineWidth > this.maxLineWidth && (this.maxLineWidth = e.lineWidth, this.bufferedMaxExtent_ = null);
    } else
      e.strokeStyle = void 0, e.lineCap = void 0, e.lineDash = null, e.lineDashOffset = void 0, e.lineJoin = void 0, e.lineWidth = void 0, e.miterLimit = void 0;
    return e;
  }
  /**
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @override
   */
  setFillStrokeStyle(t, e) {
    const i = this.state;
    this.fillStyleToState(t, i), this.strokeStyleToState(e, i);
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {Array<*>} Fill instruction.
   */
  createFill(t) {
    const e = t.fillStyle, i = [L.SET_FILL_STYLE, e];
    return typeof e != "string" && i.push(t.fillPatternScale), i;
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   */
  applyStroke(t) {
    this.instructions.push(this.createStroke(t));
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {Array<*>} Stroke instruction.
   */
  createStroke(t) {
    return [
      L.SET_STROKE_STYLE,
      t.strokeStyle,
      t.lineWidth * this.pixelRatio,
      t.lineCap,
      t.lineJoin,
      t.miterLimit,
      t.lineDash ? this.applyPixelRatio(t.lineDash) : null,
      t.lineDashOffset * this.pixelRatio
    ];
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState):Array<*>} createFill Create fill.
   */
  updateFillStyle(t, e) {
    const i = t.fillStyle;
    (typeof i != "string" || t.currentFillStyle != i) && (this.instructions.push(e.call(this, t)), t.currentFillStyle = i);
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState): void} applyStroke Apply stroke.
   */
  updateStrokeStyle(t, e) {
    const i = t.strokeStyle, n = t.lineCap, s = t.lineDash, o = t.lineDashOffset, a = t.lineJoin, l = t.lineWidth, c = t.miterLimit;
    (t.currentStrokeStyle != i || t.currentLineCap != n || s != t.currentLineDash && !gi(t.currentLineDash, s) || t.currentLineDashOffset != o || t.currentLineJoin != a || t.currentLineWidth != l || t.currentMiterLimit != c) && (e.call(this, t), t.currentStrokeStyle = i, t.currentLineCap = n, t.currentLineDash = s, t.currentLineDashOffset = o, t.currentLineJoin = a, t.currentLineWidth = l, t.currentMiterLimit = c);
  }
  /**
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  endGeometry(t) {
    this.beginGeometryInstruction1_[2] = this.instructions.length, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length, this.beginGeometryInstruction2_ = null;
    const e = [L.END_GEOMETRY, t];
    this.instructions.push(e), this.hitDetectionInstructions.push(e);
  }
  /**
   * Get the buffered rendering extent.  Rendering will be clipped to the extent
   * provided to the constructor.  To account for symbolizers that may intersect
   * this extent, we calculate a buffered extent (e.g. based on stroke width).
   * @return {import("../../extent.js").Extent} The buffered rendering extent.
   * @protected
   */
  getBufferedMaxExtent() {
    if (!this.bufferedMaxExtent_ && (this.bufferedMaxExtent_ = qc(this.maxExtent), this.maxLineWidth > 0)) {
      const t = this.resolution * (this.maxLineWidth + 1) / 2;
      Dr(this.bufferedMaxExtent_, t, this.bufferedMaxExtent_);
    }
    return this.bufferedMaxExtent_;
  }
}
class Yu extends Dn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n), this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.anchorX_ = void 0, this.anchorY_ = void 0, this.height_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.scale_ = void 0, this.width_ = void 0, this.declutterMode_ = void 0, this.declutterImageWithText_ = void 0;
  }
  /**
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} pointGeometry Point geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawPoint(t, e, i) {
    if (!this.image_ || this.maxExtent && !bs(this.maxExtent, t.getFlatCoordinates()))
      return;
    this.beginGeometry(t, e, i);
    const n = t.getFlatCoordinates(), s = t.getStride(), o = this.coordinates.length, a = this.appendFlatPointCoordinates(n, s);
    this.instructions.push([
      L.DRAW_IMAGE,
      o,
      a,
      this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.hitDetectionInstructions.push([
      L.DRAW_IMAGE,
      o,
      a,
      this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_,
      this.anchorY_,
      this.height_,
      1,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} multiPointGeometry MultiPoint geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawMultiPoint(t, e, i) {
    if (!this.image_)
      return;
    this.beginGeometry(t, e, i);
    const n = t.getFlatCoordinates(), s = [];
    for (let l = 0, c = n.length; l < c; l += t.getStride())
      (!this.maxExtent || bs(this.maxExtent, n.slice(l, l + 2))) && s.push(
        n[l],
        n[l + 1]
      );
    const o = this.coordinates.length, a = this.appendFlatPointCoordinates(s, 2);
    this.instructions.push([
      L.DRAW_IMAGE,
      o,
      a,
      this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.hitDetectionInstructions.push([
      L.DRAW_IMAGE,
      o,
      a,
      this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_,
      this.anchorY_,
      this.height_,
      1,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    return this.reverseHitDetectionInstructions(), this.anchorX_ = void 0, this.anchorY_ = void 0, this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.height_ = void 0, this.scale_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.width_ = void 0, super.finish();
  }
  /**
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   * @param {Object} [sharedData] Shared data.
   * @override
   */
  setImageStyle(t, e) {
    const i = t.getAnchor(), n = t.getSize(), s = t.getOrigin();
    this.imagePixelRatio_ = t.getPixelRatio(this.pixelRatio), this.anchorX_ = i[0], this.anchorY_ = i[1], this.hitDetectionImage_ = t.getHitDetectionImage(), this.image_ = t.getImage(this.pixelRatio), this.height_ = n[1], this.opacity_ = t.getOpacity(), this.originX_ = s[0], this.originY_ = s[1], this.rotateWithView_ = t.getRotateWithView(), this.rotation_ = t.getRotation(), this.scale_ = t.getScaleArray(), this.width_ = n[0], this.declutterMode_ = t.getDeclutterMode(), this.declutterImageWithText_ = e;
  }
}
class Bu extends Dn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   * @return {number} end.
   */
  drawFlatCoordinates_(t, e, i, n) {
    const s = this.coordinates.length, o = this.appendFlatLineCoordinates(
      t,
      e,
      i,
      n,
      !1,
      !1
    ), a = [
      L.MOVE_TO_LINE_TO,
      s,
      o
    ];
    return this.instructions.push(a), this.hitDetectionInstructions.push(a), i;
  }
  /**
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} lineStringGeometry Line string geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawLineString(t, e, i) {
    const n = this.state, s = n.strokeStyle, o = n.lineWidth;
    if (s === void 0 || o === void 0)
      return;
    this.updateStrokeStyle(n, this.applyStroke), this.beginGeometry(t, e, i), this.hitDetectionInstructions.push(
      [
        L.SET_STROKE_STYLE,
        n.strokeStyle,
        n.lineWidth,
        n.lineCap,
        n.lineJoin,
        n.miterLimit,
        xe,
        Re
      ],
      ri
    );
    const a = t.getFlatCoordinates(), l = t.getStride();
    this.drawFlatCoordinates_(
      a,
      0,
      a.length,
      l
    ), this.hitDetectionInstructions.push(Xe), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} multiLineStringGeometry MultiLineString geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawMultiLineString(t, e, i) {
    const n = this.state, s = n.strokeStyle, o = n.lineWidth;
    if (s === void 0 || o === void 0)
      return;
    this.updateStrokeStyle(n, this.applyStroke), this.beginGeometry(t, e, i), this.hitDetectionInstructions.push(
      [
        L.SET_STROKE_STYLE,
        n.strokeStyle,
        n.lineWidth,
        n.lineCap,
        n.lineJoin,
        n.miterLimit,
        xe,
        Re
      ],
      ri
    );
    const a = t.getEnds(), l = t.getFlatCoordinates(), c = t.getStride();
    let h = 0;
    for (let u = 0, d = a.length; u < d; ++u)
      h = this.drawFlatCoordinates_(
        l,
        h,
        /** @type {number} */
        a[u],
        c
      );
    this.hitDetectionInstructions.push(Xe), this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    const t = this.state;
    return t.lastStroke != null && t.lastStroke != this.coordinates.length && this.instructions.push(Xe), this.reverseHitDetectionInstructions(), this.state = null, super.finish();
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @override
   */
  applyStroke(t) {
    t.lastStroke != null && t.lastStroke != this.coordinates.length && (this.instructions.push(Xe), t.lastStroke = this.coordinates.length), t.lastStroke = 0, super.applyStroke(t), this.instructions.push(ri);
  }
}
function Xr(r, t, e, i, n, s, o) {
  const a = (e - t) / i;
  if (a < 3) {
    for (; t < e; t += i)
      s[o++] = r[t], s[o++] = r[t + 1];
    return o;
  }
  const l = new Array(a);
  l[0] = 1, l[a - 1] = 1;
  const c = [t, e - i];
  let h = 0;
  for (; c.length > 0; ) {
    const u = c.pop(), d = c.pop();
    let f = 0;
    const g = r[d], m = r[d + 1], _ = r[u], p = r[u + 1];
    for (let y = d + i; y < u; y += i) {
      const S = r[y], C = r[y + 1], R = Ec(S, C, g, m, _, p);
      R > f && (h = y, f = R);
    }
    f > n && (l[(h - t) / i] = 1, d + i < h && c.push(d, h), h + i < u && c.push(h, u));
  }
  for (let u = 0; u < a; ++u)
    l[u] && (s[o++] = r[t + u * i], s[o++] = r[t + u * i + 1]);
  return o;
}
function oh(r, t, e, i, n, s, o, a) {
  for (let l = 0, c = e.length; l < c; ++l) {
    const h = e[l];
    o = Xr(
      r,
      t,
      h,
      i,
      n,
      s,
      o
    ), a.push(o), t = h;
  }
  return o;
}
function Je(r, t) {
  return t * Math.round(r / t);
}
function Xu(r, t, e, i, n, s, o) {
  if (t == e)
    return o;
  let a = Je(r[t], n), l = Je(r[t + 1], n);
  t += i, s[o++] = a, s[o++] = l;
  let c, h;
  do
    if (c = Je(r[t], n), h = Je(r[t + 1], n), t += i, t == e)
      return s[o++] = c, s[o++] = h, o;
  while (c == a && h == l);
  for (; t < e; ) {
    const u = Je(r[t], n), d = Je(r[t + 1], n);
    if (t += i, u == c && d == h)
      continue;
    const f = c - a, g = h - l, m = u - a, _ = d - l;
    if (f * _ == g * m && (f < 0 && m < f || f == m || f > 0 && m > f) && (g < 0 && _ < g || g == _ || g > 0 && _ > g)) {
      c = u, h = d;
      continue;
    }
    s[o++] = c, s[o++] = h, a = c, l = h, c = u, h = d;
  }
  return s[o++] = c, s[o++] = h, o;
}
function mo(r, t, e, i, n, s, o, a) {
  for (let l = 0, c = e.length; l < c; ++l) {
    const h = e[l];
    o = Xu(
      r,
      t,
      h,
      i,
      n,
      s,
      o
    ), a.push(o), t = h;
  }
  return o;
}
function zu(r, t, e, i, n, s, o, a) {
  for (let l = 0, c = e.length; l < c; ++l) {
    const h = e[l], u = [];
    o = mo(
      r,
      t,
      h,
      i,
      n,
      s,
      o,
      u
    ), a.push(u), t = h[h.length - 1];
  }
  return o;
}
class Ma extends Dn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  drawFlatCoordinatess_(t, e, i, n) {
    const s = this.state, o = s.fillStyle !== void 0, a = s.strokeStyle !== void 0, l = i.length;
    this.instructions.push(ri), this.hitDetectionInstructions.push(ri);
    for (let c = 0; c < l; ++c) {
      const h = i[c], u = this.coordinates.length, d = this.appendFlatLineCoordinates(
        t,
        e,
        h,
        n,
        !0,
        !a
      ), f = [
        L.MOVE_TO_LINE_TO,
        u,
        d
      ];
      this.instructions.push(f), this.hitDetectionInstructions.push(f), a && (this.instructions.push(Pa), this.hitDetectionInstructions.push(Pa)), e = h;
    }
    return o && (this.instructions.push(Kn), this.hitDetectionInstructions.push(Kn)), a && (this.instructions.push(Xe), this.hitDetectionInstructions.push(Xe)), e;
  }
  /**
   * @param {import("../../geom/Circle.js").default} circleGeometry Circle geometry.
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawCircle(t, e, i) {
    const n = this.state, s = n.fillStyle, o = n.strokeStyle;
    if (s === void 0 && o === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e, i), n.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      L.SET_FILL_STYLE,
      At
    ]), n.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      L.SET_STROKE_STYLE,
      n.strokeStyle,
      n.lineWidth,
      n.lineCap,
      n.lineJoin,
      n.miterLimit,
      xe,
      Re
    ]);
    const a = t.getFlatCoordinates(), l = t.getStride(), c = this.coordinates.length;
    this.appendFlatLineCoordinates(
      a,
      0,
      a.length,
      l,
      !1,
      !1
    );
    const h = [L.CIRCLE, c];
    this.instructions.push(ri, h), this.hitDetectionInstructions.push(ri, h), n.fillStyle !== void 0 && (this.instructions.push(Kn), this.hitDetectionInstructions.push(Kn)), n.strokeStyle !== void 0 && (this.instructions.push(Xe), this.hitDetectionInstructions.push(Xe)), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} polygonGeometry Polygon geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawPolygon(t, e, i) {
    const n = this.state, s = n.fillStyle, o = n.strokeStyle;
    if (s === void 0 && o === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e, i), n.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      L.SET_FILL_STYLE,
      At
    ]), n.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      L.SET_STROKE_STYLE,
      n.strokeStyle,
      n.lineWidth,
      n.lineCap,
      n.lineJoin,
      n.miterLimit,
      xe,
      Re
    ]);
    const a = t.getEnds(), l = t.getOrientedFlatCoordinates(), c = t.getStride();
    this.drawFlatCoordinatess_(
      l,
      0,
      /** @type {Array<number>} */
      a,
      c
    ), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawMultiPolygon(t, e, i) {
    const n = this.state, s = n.fillStyle, o = n.strokeStyle;
    if (s === void 0 && o === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e, i), n.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      L.SET_FILL_STYLE,
      At
    ]), n.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      L.SET_STROKE_STYLE,
      n.strokeStyle,
      n.lineWidth,
      n.lineCap,
      n.lineJoin,
      n.miterLimit,
      xe,
      Re
    ]);
    const a = t.getEndss(), l = t.getOrientedFlatCoordinates(), c = t.getStride();
    let h = 0;
    for (let u = 0, d = a.length; u < d; ++u)
      h = this.drawFlatCoordinatess_(
        l,
        h,
        a[u],
        c
      );
    this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    this.reverseHitDetectionInstructions(), this.state = null;
    const t = this.tolerance;
    if (t !== 0) {
      const e = this.coordinates;
      for (let i = 0, n = e.length; i < n; ++i)
        e[i] = Je(e[i], t);
    }
    return super.finish();
  }
  /**
   * @private
   */
  setFillStrokeStyles_() {
    const t = this.state;
    this.updateFillStyle(t, this.createFill), this.updateStrokeStyle(t, this.applyStroke);
  }
}
function Zu(r, t, e, i, n) {
  const s = [];
  let o = e, a = 0, l = t.slice(e, 2);
  for (; a < r && o + n < i; ) {
    const [c, h] = l.slice(-2), u = t[o + n], d = t[o + n + 1], f = Math.sqrt(
      (u - c) * (u - c) + (d - h) * (d - h)
    );
    if (a += f, a >= r) {
      const g = (r - a + f) / f, m = kt(c, u, g), _ = kt(h, d, g);
      l.push(m, _), s.push(l), l = [m, _], a == r && (o += n), a = 0;
    } else if (a < r)
      l.push(
        t[o + n],
        t[o + n + 1]
      ), o += n;
    else {
      const g = f - a, m = kt(c, u, g / f), _ = kt(h, d, g / f);
      l.push(m, _), s.push(l), l = [m, _], a = 0, o += n;
    }
  }
  return a > 0 && s.push(l), s;
}
function Vu(r, t, e, i, n) {
  let s = e, o = e, a = 0, l = 0, c = e, h, u, d, f, g, m, _, p, y, S;
  for (u = e; u < i; u += n) {
    const C = t[u], R = t[u + 1];
    g !== void 0 && (y = C - g, S = R - m, f = Math.sqrt(y * y + S * S), _ !== void 0 && (l += d, h = Math.acos((_ * y + p * S) / (d * f)), h > r && (l > a && (a = l, s = c, o = u), l = 0, c = u - n)), d = f, _ = y, p = S), g = C, m = R;
  }
  return l += f, l > a ? [c, u] : [s, o];
}
const xr = {
  left: 0,
  center: 0.5,
  right: 1,
  top: 0,
  middle: 0.5,
  hanging: 0.2,
  alphabetic: 0.8,
  ideographic: 0.8,
  bottom: 1
};
class ju extends Dn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    super(t, e, i, n), this.labels_ = null, this.text_ = "", this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = void 0, this.textKeepUpright_ = void 0, this.textRotation_ = 0, this.textFillState_ = null, this.fillStates = {}, this.fillStates[At] = { fillStyle: At }, this.textStrokeState_ = null, this.strokeStates = {}, this.textState_ = /** @type {import("../canvas.js").TextState} */
    {}, this.textStates = {}, this.textKey_ = "", this.fillKey_ = "", this.strokeKey_ = "", this.declutterMode_ = void 0, this.declutterImageWithText_ = void 0;
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    const t = super.finish();
    return t.textStates = this.textStates, t.fillStates = this.fillStates, t.strokeStates = this.strokeStates, t;
  }
  /**
   * @param {import("../../geom/SimpleGeometry.js").default|import("../Feature.js").default} geometry Geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawText(t, e, i) {
    const n = this.textFillState_, s = this.textStrokeState_, o = this.textState_;
    if (this.text_ === "" || !o || !n && !s)
      return;
    const a = this.coordinates;
    let l = a.length;
    const c = t.getType();
    let h = null, u = t.getStride();
    if (o.placement === "line" && (c == "LineString" || c == "MultiLineString" || c == "Polygon" || c == "MultiPolygon")) {
      if (!jt(this.maxExtent, t.getExtent()))
        return;
      let d;
      if (h = t.getFlatCoordinates(), c == "LineString")
        d = [h.length];
      else if (c == "MultiLineString")
        d = /** @type {import("../../geom/MultiLineString.js").default} */
        t.getEnds();
      else if (c == "Polygon")
        d = /** @type {import("../../geom/Polygon.js").default} */
        t.getEnds().slice(0, 1);
      else if (c == "MultiPolygon") {
        const _ = (
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t.getEndss()
        );
        d = [];
        for (let p = 0, y = _.length; p < y; ++p)
          d.push(_[p][0]);
      }
      this.beginGeometry(t, e, i);
      const f = o.repeat, g = f ? void 0 : o.textAlign;
      let m = 0;
      for (let _ = 0, p = d.length; _ < p; ++_) {
        let y;
        f ? y = Zu(
          f * this.resolution,
          h,
          m,
          d[_],
          u
        ) : y = [h.slice(m, d[_])];
        for (let S = 0, C = y.length; S < C; ++S) {
          const R = y[S];
          let I = 0, F = R.length;
          if (g == null) {
            const M = Vu(
              o.maxAngle,
              R,
              0,
              R.length,
              2
            );
            I = M[0], F = M[1];
          }
          for (let M = I; M < F; M += u)
            a.push(R[M], R[M + 1]);
          const P = a.length;
          m = d[_], this.drawChars_(l, P), l = P;
        }
      }
      this.endGeometry(e);
    } else {
      let d = o.overflow ? null : [];
      switch (c) {
        case "Point":
        case "MultiPoint":
          h = /** @type {import("../../geom/MultiPoint.js").default} */
          t.getFlatCoordinates();
          break;
        case "LineString":
          h = /** @type {import("../../geom/LineString.js").default} */
          t.getFlatMidpoint();
          break;
        case "Circle":
          h = /** @type {import("../../geom/Circle.js").default} */
          t.getCenter();
          break;
        case "MultiLineString":
          h = /** @type {import("../../geom/MultiLineString.js").default} */
          t.getFlatMidpoints(), u = 2;
          break;
        case "Polygon":
          h = /** @type {import("../../geom/Polygon.js").default} */
          t.getFlatInteriorPoint(), o.overflow || d.push(h[2] / this.resolution), u = 3;
          break;
        case "MultiPolygon":
          const C = (
            /** @type {import("../../geom/MultiPolygon.js").default} */
            t.getFlatInteriorPoints()
          );
          h = [];
          for (let R = 0, I = C.length; R < I; R += 3)
            o.overflow || d.push(C[R + 2] / this.resolution), h.push(C[R], C[R + 1]);
          if (h.length === 0)
            return;
          u = 2;
          break;
      }
      const f = this.appendFlatPointCoordinates(h, u);
      if (f === l)
        return;
      if (d && (f - l) / 2 !== h.length / u) {
        let C = l / 2;
        d = d.filter((R, I) => {
          const F = a[(C + I) * 2] === h[I * u] && a[(C + I) * 2 + 1] === h[I * u + 1];
          return F || --C, F;
        });
      }
      this.saveTextStates_();
      const g = o.backgroundFill ? this.createFill(this.fillStyleToState(o.backgroundFill)) : null, m = o.backgroundStroke ? this.createStroke(this.strokeStyleToState(o.backgroundStroke)) : null;
      this.beginGeometry(t, e, i);
      let _ = o.padding;
      if (_ != ti && (o.scale[0] < 0 || o.scale[1] < 0)) {
        let C = o.padding[0], R = o.padding[1], I = o.padding[2], F = o.padding[3];
        o.scale[0] < 0 && (R = -R, F = -F), o.scale[1] < 0 && (C = -C, I = -I), _ = [C, R, I, F];
      }
      const p = this.pixelRatio;
      this.instructions.push([
        L.DRAW_IMAGE,
        l,
        f,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [1, 1],
        NaN,
        this.declutterMode_,
        this.declutterImageWithText_,
        _ == ti ? ti : _.map(function(C) {
          return C * p;
        }),
        g,
        m,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        d
      ]);
      const y = 1 / p, S = g ? g.slice(0) : null;
      S && (S[1] = At), this.hitDetectionInstructions.push([
        L.DRAW_IMAGE,
        l,
        f,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [y, y],
        NaN,
        this.declutterMode_,
        this.declutterImageWithText_,
        _,
        S,
        m,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_ ? At : this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        d
      ]), this.endGeometry(e);
    }
  }
  /**
   * @private
   */
  saveTextStates_() {
    const t = this.textStrokeState_, e = this.textState_, i = this.textFillState_, n = this.strokeKey_;
    t && (n in this.strokeStates || (this.strokeStates[n] = {
      strokeStyle: t.strokeStyle,
      lineCap: t.lineCap,
      lineDashOffset: t.lineDashOffset,
      lineWidth: t.lineWidth,
      lineJoin: t.lineJoin,
      miterLimit: t.miterLimit,
      lineDash: t.lineDash
    }));
    const s = this.textKey_;
    s in this.textStates || (this.textStates[s] = {
      font: e.font,
      textAlign: e.textAlign || In,
      justify: e.justify,
      textBaseline: e.textBaseline || yr,
      scale: e.scale
    });
    const o = this.fillKey_;
    i && (o in this.fillStates || (this.fillStates[o] = {
      fillStyle: i.fillStyle
    }));
  }
  /**
   * @private
   * @param {number} begin Begin.
   * @param {number} end End.
   */
  drawChars_(t, e) {
    const i = this.textStrokeState_, n = this.textState_, s = this.strokeKey_, o = this.textKey_, a = this.fillKey_;
    this.saveTextStates_();
    const l = this.pixelRatio, c = xr[n.textBaseline], h = this.textOffsetY_ * l, u = this.text_, d = i ? i.lineWidth * Math.abs(n.scale[0]) / 2 : 0;
    this.instructions.push([
      L.DRAW_CHARS,
      t,
      e,
      c,
      n.overflow,
      a,
      n.maxAngle,
      l,
      h,
      s,
      d * l,
      u,
      o,
      1,
      this.declutterMode_,
      this.textKeepUpright_
    ]), this.hitDetectionInstructions.push([
      L.DRAW_CHARS,
      t,
      e,
      c,
      n.overflow,
      a && At,
      n.maxAngle,
      l,
      h,
      s,
      d * l,
      u,
      o,
      1 / l,
      this.declutterMode_,
      this.textKeepUpright_
    ]);
  }
  /**
   * @param {import("../../style/Text.js").default} textStyle Text style.
   * @param {Object} [sharedData] Shared data.
   * @override
   */
  setTextStyle(t, e) {
    let i, n, s;
    if (!t)
      this.text_ = "";
    else {
      const o = t.getFill();
      o ? (n = this.textFillState_, n || (n = /** @type {import("../canvas.js").FillState} */
      {}, this.textFillState_ = n), n.fillStyle = ce(
        o.getColor() || At
      )) : (n = null, this.textFillState_ = n);
      const a = t.getStroke();
      if (!a)
        s = null, this.textStrokeState_ = s;
      else {
        s = this.textStrokeState_, s || (s = /** @type {import("../canvas.js").StrokeState} */
        {}, this.textStrokeState_ = s);
        const m = a.getLineDash(), _ = a.getLineDashOffset(), p = a.getWidth(), y = a.getMiterLimit();
        s.lineCap = a.getLineCap() || Bi, s.lineDash = m ? m.slice() : xe, s.lineDashOffset = _ === void 0 ? Re : _, s.lineJoin = a.getLineJoin() || Xi, s.lineWidth = p === void 0 ? Tn : p, s.miterLimit = y === void 0 ? xn : y, s.strokeStyle = ce(
          a.getColor() || Rn
        );
      }
      i = this.textState_;
      const l = t.getFont() || Nl;
      Xc(l);
      const c = t.getScaleArray();
      i.overflow = t.getOverflow(), i.font = l, i.maxAngle = t.getMaxAngle(), i.placement = t.getPlacement(), i.textAlign = t.getTextAlign(), i.repeat = t.getRepeat(), i.justify = t.getJustify(), i.textBaseline = t.getTextBaseline() || yr, i.backgroundFill = t.getBackgroundFill(), i.backgroundStroke = t.getBackgroundStroke(), i.padding = t.getPadding() || ti, i.scale = c === void 0 ? [1, 1] : c;
      const h = t.getOffsetX(), u = t.getOffsetY(), d = t.getRotateWithView(), f = t.getKeepUpright(), g = t.getRotation();
      this.text_ = t.getText() || "", this.textOffsetX_ = h === void 0 ? 0 : h, this.textOffsetY_ = u === void 0 ? 0 : u, this.textRotateWithView_ = d === void 0 ? !1 : d, this.textKeepUpright_ = f === void 0 ? !0 : f, this.textRotation_ = g === void 0 ? 0 : g, this.strokeKey_ = s ? (typeof s.strokeStyle == "string" ? s.strokeStyle : nt(s.strokeStyle)) + s.lineCap + s.lineDashOffset + "|" + s.lineWidth + s.lineJoin + s.miterLimit + "[" + s.lineDash.join() + "]" : "", this.textKey_ = i.font + i.scale + (i.textAlign || "?") + (i.repeat || "?") + (i.justify || "?") + (i.textBaseline || "?"), this.fillKey_ = n && n.fillStyle ? typeof n.fillStyle == "string" ? n.fillStyle : "|" + nt(n.fillStyle) : "";
    }
    this.declutterMode_ = t.getDeclutterMode(), this.declutterImageWithText_ = e;
  }
}
const $u = {
  Circle: Ma,
  Default: Dn,
  Image: Yu,
  LineString: Bu,
  Polygon: Ma,
  Text: ju
};
class Ku {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Max extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, n) {
    this.tolerance_ = t, this.maxExtent_ = e, this.pixelRatio_ = n, this.resolution_ = i, this.buildersByZIndex_ = {};
  }
  /**
   * @return {!Object<string, !Object<import("../canvas.js").BuilderType, import("./Builder.js").SerializableInstructions>>} The serializable instructions
   */
  finish() {
    const t = {};
    for (const e in this.buildersByZIndex_) {
      t[e] = t[e] || {};
      const i = this.buildersByZIndex_[e];
      for (const n in i) {
        const s = i[n].finish();
        t[e][n] = s;
      }
    }
    return t;
  }
  /**
   * @param {number|undefined} zIndex Z index.
   * @param {import("../canvas.js").BuilderType} builderType Replay type.
   * @return {import("../VectorContext.js").default} Replay.
   */
  getBuilder(t, e) {
    const i = t !== void 0 ? t.toString() : "0";
    let n = this.buildersByZIndex_[i];
    n === void 0 && (n = {}, this.buildersByZIndex_[i] = n);
    let s = n[e];
    if (s === void 0) {
      const o = $u[e];
      s = new o(
        this.tolerance_,
        this.maxExtent_,
        this.resolution_,
        this.pixelRatio_
      ), n[e] = s;
    }
    return s;
  }
}
function Ze(r, t, e, i, n, s, o) {
  s = s || [], o = o || 2;
  let a = 0;
  for (let l = t; l < e; l += i) {
    const c = r[l], h = r[l + 1];
    s[a++] = n[0] * c + n[2] * h + n[4], s[a++] = n[1] * c + n[3] * h + n[5];
    for (let u = 2; u < o; u++)
      s[a++] = r[l + u];
  }
  return s && s.length != a && (s.length = a), s;
}
function _o(r, t, e, i, n, s, o) {
  o = o || [];
  const a = Math.cos(n), l = Math.sin(n), c = s[0], h = s[1];
  let u = 0;
  for (let d = t; d < e; d += i) {
    const f = r[d] - c, g = r[d + 1] - h;
    o[u++] = c + f * a - g * l, o[u++] = h + f * l + g * a;
    for (let m = d + 2; m < d + i; ++m)
      o[u++] = r[m];
  }
  return o && o.length != u && (o.length = u), o;
}
function Hu(r, t, e, i, n, s, o, a) {
  a = a || [];
  const l = o[0], c = o[1];
  let h = 0;
  for (let u = t; u < e; u += i) {
    const d = r[u] - l, f = r[u + 1] - c;
    a[h++] = l + n * d, a[h++] = c + s * f;
    for (let g = u + 2; g < u + i; ++g)
      a[h++] = r[g];
  }
  return a && a.length != h && (a.length = h), a;
}
function qu(r, t, e, i, n, s, o) {
  o = o || [];
  let a = 0;
  for (let l = t; l < e; l += i) {
    o[a++] = r[l] + n, o[a++] = r[l + 1] + s;
    for (let c = l + 2; c < l + i; ++c)
      o[a++] = r[c];
  }
  return o && o.length != a && (o.length = a), o;
}
new Array(6);
function Ie() {
  return [1, 0, 0, 1, 0, 0];
}
function Ju(r, t) {
  return r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r;
}
function Nt(r, t) {
  const e = t[0], i = t[1];
  return t[0] = r[0] * e + r[2] * i + r[4], t[1] = r[1] * e + r[3] * i + r[5], t;
}
function di(r, t, e, i, n, s, o, a) {
  const l = Math.sin(s), c = Math.cos(s);
  return r[0] = i * c, r[1] = n * l, r[2] = -i * l, r[3] = n * c, r[4] = o * i * c - a * i * l + t, r[5] = o * n * l + a * n * c + e, r;
}
function Qu(r, t) {
  const e = td(t);
  at(e !== 0, "Transformation matrix cannot be inverted");
  const i = t[0], n = t[1], s = t[2], o = t[3], a = t[4], l = t[5];
  return r[0] = o / e, r[1] = -n / e, r[2] = -s / e, r[3] = i / e, r[4] = (s * l - o * a) / e, r[5] = -(i * l - n * a) / e, r;
}
function td(r) {
  return r[0] * r[3] - r[1] * r[2];
}
const ed = [1e5, 1e5, 1e5, 1e5, 2, 2];
function id(r) {
  return "matrix(" + r.join(", ") + ")";
}
function Fa(r) {
  return r.substring(7, r.length - 1).split(",").map(parseFloat);
}
function nd(r, t) {
  const e = Fa(r), i = Fa(t);
  for (let n = 0; n < 6; ++n)
    if (Math.round((e[n] - i[n]) * ed[n]) !== 0)
      return !1;
  return !0;
}
function po(r, t, e, i) {
  let n = r[t], s = r[t + 1], o = 0;
  for (let a = t + i; a < e; a += i) {
    const l = r[a], c = r[a + 1];
    o += Math.sqrt((l - n) * (l - n) + (c - s) * (c - s)), n = l, s = c;
  }
  return o;
}
function rd(r, t, e, i, n, s, o, a, l, c, h, u, d = !0) {
  let f = r[t], g = r[t + 1], m = 0, _ = 0, p = 0, y = 0;
  function S() {
    m = f, _ = g, t += i, f = r[t], g = r[t + 1], y += p, p = Math.sqrt((f - m) * (f - m) + (g - _) * (g - _));
  }
  do
    S();
  while (t < e - i && y + p < s);
  let C = p === 0 ? 0 : (s - y) / p;
  const R = kt(m, f, C), I = kt(_, g, C), F = t - i, P = y, M = s + a * l(c, n, h);
  for (; t < e - i && y + p < M; )
    S();
  C = p === 0 ? 0 : (M - y) / p;
  const A = kt(m, f, C), z = kt(_, g, C);
  let Z = !1;
  if (d)
    if (u) {
      const q = [R, I, A, z];
      _o(q, 0, 4, 2, u, q, q), Z = q[0] > q[2];
    } else
      Z = R > A;
  const V = Math.PI, B = [], ft = F + i === t;
  t = F, p = 0, y = P, f = r[t], g = r[t + 1];
  let U;
  if (ft) {
    S(), U = Math.atan2(g - _, f - m), Z && (U += U > 0 ? -V : V);
    const q = (A + R) / 2, et = (z + I) / 2;
    return B[0] = [q, et, (M - s) / 2, U, n], B;
  }
  n = n.replace(/\n/g, " ");
  for (let q = 0, et = n.length; q < et; ) {
    S();
    let pt = Math.atan2(g - _, f - m);
    if (Z && (pt += pt > 0 ? -V : V), U !== void 0) {
      let oe = pt - U;
      if (oe += oe > V ? -2 * V : oe < -V ? 2 * V : 0, Math.abs(oe) > o)
        return null;
    }
    U = pt;
    const ct = q;
    let gt = 0;
    for (; q < et; ++q) {
      const oe = Z ? et - q - 1 : q, Yn = a * l(c, n[oe], h);
      if (t + i < e && y + p < s + gt + Yn / 2)
        break;
      gt += Yn;
    }
    if (q === ct)
      continue;
    const T = Z ? n.substring(et - ct, et - q) : n.substring(ct, q);
    C = p === 0 ? 0 : (s + gt / 2 - y) / p;
    const Hi = kt(m, f, C), qi = kt(_, g, C);
    B.push([Hi, qi, gt / 2, pt, T]), s += gt;
  }
  return B;
}
class ah {
  constructor() {
    /**
     * @private
     * @param {...*} args Args.
     * @return {ZIndexContext} This.
     */
    oa(this, "pushMethodArgs_", (...t) => (this.push_(t), this));
    this.instructions_ = [], this.zIndex = 0, this.offset_ = 0, this.context_ = /** @type {ZIndexContextProxy} */
    new Proxy(_r(), {
      get: (t, e) => {
        if (typeof /** @type {*} */
        _r()[e] == "function")
          return this.push_(e), this.pushMethodArgs_;
      },
      set: (t, e, i) => (this.push_(e, i), !0)
    });
  }
  /**
   * @param {...*} args Arguments to push to the instructions array.
   * @private
   */
  push_(...t) {
    const e = this.instructions_, i = this.zIndex + this.offset_;
    e[i] || (e[i] = []), e[i].push(...t);
  }
  /**
   * Push a function that renders to the context directly.
   * @param {function(CanvasRenderingContext2D): void} render Function.
   */
  pushFunction(t) {
    this.push_(t);
  }
  /**
   * Get a proxy for CanvasRenderingContext2D which does not support getting state
   * (e.g. `context.globalAlpha`, which will return `undefined`). To set state, if it relies on a
   * previous state (e.g. `context.globalAlpha = context.globalAlpha / 2`), set a function,
   * e.g. `context.globalAlpha = (context) => context.globalAlpha / 2`.
   * @return {ZIndexContextProxy} Context.
   */
  getContext() {
    return this.context_;
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   */
  draw(t) {
    this.instructions_.forEach((e) => {
      for (let i = 0, n = e.length; i < n; ++i) {
        const s = e[i];
        if (typeof s == "function") {
          s(t);
          continue;
        }
        const o = e[++i];
        if (typeof /** @type {*} */
        t[s] == "function")
          t[s](...o);
        else {
          if (typeof o == "function") {
            t[s] = o(t);
            continue;
          }
          t[s] = o;
        }
      }
    });
  }
  clear() {
    this.instructions_.length = 0, this.zIndex = 0, this.offset_ = 0;
  }
  /**
   * Offsets the zIndex by the highest current zIndex. Useful for rendering multiple worlds or tiles, to
   * avoid conflicting context.clip() or context.save()/restore() calls.
   */
  offset() {
    this.offset_ = this.instructions_.length, this.zIndex = 0;
  }
}
const Si = Me(), be = [], pe = [], ye = [], Ne = [];
function va(r) {
  return r[3].declutterBox;
}
const Aa = new RegExp(
  /* eslint-disable prettier/prettier */
  "[֑-ࣿיִ-﷿ﹰ-ﻼࠀ-࿿-]"
  /* eslint-enable prettier/prettier */
);
function gs(r, t) {
  return t === "start" ? t = Aa.test(r) ? "right" : "left" : t === "end" && (t = Aa.test(r) ? "left" : "right"), xr[t];
}
function sd(r, t, e) {
  return e > 0 && r.push(`
`, ""), r.push(t, ""), r;
}
function od(r, t, e) {
  return e % 2 === 0 && (r += t), r;
}
class ad {
  /**
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {import("../canvas.js").SerializableInstructions} instructions The serializable instructions.
   * @param {boolean} [deferredRendering] Enable deferred rendering.
   */
  constructor(t, e, i, n, s) {
    this.overlaps = i, this.pixelRatio = e, this.resolution = t, this.alignAndScaleFill_, this.instructions = n.instructions, this.coordinates = n.coordinates, this.coordinateCache_ = {}, this.renderedTransform_ = Ie(), this.hitDetectionInstructions = n.hitDetectionInstructions, this.pixelCoordinates_ = null, this.viewRotation_ = 0, this.fillStates = n.fillStates || {}, this.strokeStates = n.strokeStates || {}, this.textStates = n.textStates || {}, this.widths_ = {}, this.labels_ = {}, this.zIndexContext_ = s ? new ah() : null;
  }
  /**
   * @return {ZIndexContext} ZIndex context.
   */
  getZIndexContext() {
    return this.zIndexContext_;
  }
  /**
   * @param {string|Array<string>} text Text.
   * @param {string} textKey Text style key.
   * @param {string} fillKey Fill style key.
   * @param {string} strokeKey Stroke style key.
   * @return {import("../canvas.js").Label} Label.
   */
  createLabel(t, e, i, n) {
    const s = t + e + i + n;
    if (this.labels_[s])
      return this.labels_[s];
    const o = n ? this.strokeStates[n] : null, a = i ? this.fillStates[i] : null, l = this.textStates[e], c = this.pixelRatio, h = [
      l.scale[0] * c,
      l.scale[1] * c
    ], u = l.justify ? xr[l.justify] : gs(
      Array.isArray(t) ? t[0] : t,
      l.textAlign || In
    ), d = n && o.lineWidth ? o.lineWidth : 0, f = Array.isArray(t) ? t : String(t).split(`
`).reduce(sd, []), { width: g, height: m, widths: _, heights: p, lineWidths: y } = Zc(
      l,
      f
    ), S = g + d, C = [], R = (S + 2) * h[0], I = (m + d) * h[1], F = {
      width: R < 0 ? Math.floor(R) : Math.ceil(R),
      height: I < 0 ? Math.floor(I) : Math.ceil(I),
      contextInstructions: C
    };
    (h[0] != 1 || h[1] != 1) && C.push("scale", h), n && (C.push("strokeStyle", o.strokeStyle), C.push("lineWidth", d), C.push("lineCap", o.lineCap), C.push("lineJoin", o.lineJoin), C.push("miterLimit", o.miterLimit), C.push("setLineDash", [o.lineDash]), C.push("lineDashOffset", o.lineDashOffset)), i && C.push("fillStyle", a.fillStyle), C.push("textBaseline", "middle"), C.push("textAlign", "center");
    const P = 0.5 - u;
    let M = u * S + P * d;
    const A = [], z = [];
    let Z = 0, V = 0, B = 0, ft = 0, U;
    for (let q = 0, et = f.length; q < et; q += 2) {
      const pt = f[q];
      if (pt === `
`) {
        V += Z, Z = 0, M = u * S + P * d, ++ft;
        continue;
      }
      const ct = f[q + 1] || l.font;
      ct !== U && (n && A.push("font", ct), i && z.push("font", ct), U = ct), Z = Math.max(Z, p[B]);
      const gt = [
        pt,
        M + P * _[B] + u * (_[B] - y[ft]),
        0.5 * (d + Z) + V
      ];
      M += _[B], n && A.push("strokeText", gt), i && z.push("fillText", gt), ++B;
    }
    return Array.prototype.push.apply(C, A), Array.prototype.push.apply(C, z), this.labels_[s] = F, F;
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../coordinate.js").Coordinate} p1 1st point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p2 2nd point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p3 3rd point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p4 4th point of the background box.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   */
  replayTextBackground_(t, e, i, n, s, o, a) {
    t.beginPath(), t.moveTo.apply(t, e), t.lineTo.apply(t, i), t.lineTo.apply(t, n), t.lineTo.apply(t, s), t.lineTo.apply(t, e), o && (this.alignAndScaleFill_ = /** @type {number} */
    o[2], t.fillStyle = /** @type {string} */
    o[1], this.fill_(t)), a && (this.setStrokeStyle_(
      t,
      /** @type {Array<*>} */
      a
    ), t.stroke());
  }
  /**
   * @private
   * @param {number} sheetWidth Width of the sprite sheet.
   * @param {number} sheetHeight Height of the sprite sheet.
   * @param {number} centerX X.
   * @param {number} centerY Y.
   * @param {number} width Width.
   * @param {number} height Height.
   * @param {number} anchorX Anchor X.
   * @param {number} anchorY Anchor Y.
   * @param {number} originX Origin X.
   * @param {number} originY Origin Y.
   * @param {number} rotation Rotation.
   * @param {import("../../size.js").Size} scale Scale.
   * @param {boolean} snapToPixel Snap to pixel.
   * @param {Array<number>} padding Padding.
   * @param {boolean} fillStroke Background fill or stroke.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @return {ImageOrLabelDimensions} Dimensions for positioning and decluttering the image or label.
   */
  calculateImageOrLabelDimensions_(t, e, i, n, s, o, a, l, c, h, u, d, f, g, m, _) {
    a *= d[0], l *= d[1];
    let p = i - a, y = n - l;
    const S = s + c > t ? t - c : s, C = o + h > e ? e - h : o, R = g[3] + S * d[0] + g[1], I = g[0] + C * d[1] + g[2], F = p - g[3], P = y - g[0];
    (m || u !== 0) && (be[0] = F, Ne[0] = F, be[1] = P, pe[1] = P, pe[0] = F + R, ye[0] = pe[0], ye[1] = P + I, Ne[1] = ye[1]);
    let M;
    return u !== 0 ? (M = di(
      Ie(),
      i,
      n,
      1,
      1,
      u,
      -i,
      -n
    ), Nt(M, be), Nt(M, pe), Nt(M, ye), Nt(M, Ne), ne(
      Math.min(be[0], pe[0], ye[0], Ne[0]),
      Math.min(be[1], pe[1], ye[1], Ne[1]),
      Math.max(be[0], pe[0], ye[0], Ne[0]),
      Math.max(be[1], pe[1], ye[1], Ne[1]),
      Si
    )) : ne(
      Math.min(F, F + R),
      Math.min(P, P + I),
      Math.max(F, F + R),
      Math.max(P, P + I),
      Si
    ), f && (p = Math.round(p), y = Math.round(y)), {
      drawImageX: p,
      drawImageY: y,
      drawImageW: S,
      drawImageH: C,
      originX: c,
      originY: h,
      declutterBox: {
        minX: Si[0],
        minY: Si[1],
        maxX: Si[2],
        maxY: Si[3],
        value: _
      },
      canvasTransform: M,
      scale: d
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scaled canvas size.
   * @param {import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageOrLabel Image.
   * @param {ImageOrLabelDimensions} dimensions Dimensions.
   * @param {number} opacity Opacity.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   * @return {boolean} The image or label was rendered.
   */
  replayImageOrLabel_(t, e, i, n, s, o, a) {
    const l = !!(o || a), c = n.declutterBox, h = a ? a[2] * n.scale[0] / 2 : 0;
    return c.minX - h <= e[0] && c.maxX + h >= 0 && c.minY - h <= e[1] && c.maxY + h >= 0 && (l && this.replayTextBackground_(
      t,
      be,
      pe,
      ye,
      Ne,
      /** @type {Array<*>} */
      o,
      /** @type {Array<*>} */
      a
    ), Vc(
      t,
      n.canvasTransform,
      s,
      i,
      n.originX,
      n.originY,
      n.drawImageW,
      n.drawImageH,
      n.drawImageX,
      n.drawImageY,
      n.scale
    )), !0;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   */
  fill_(t) {
    const e = this.alignAndScaleFill_;
    if (e) {
      const i = Nt(this.renderedTransform_, [0, 0]), n = 512 * this.pixelRatio;
      t.save(), t.translate(i[0] % n, i[1] % n), e !== 1 && t.scale(e, e), t.rotate(this.viewRotation_);
    }
    t.fill(), e && t.restore();
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {Array<*>} instruction Instruction.
   */
  setStrokeStyle_(t, e) {
    t.strokeStyle = /** @type {import("../../colorlike.js").ColorLike} */
    e[1], e[1] && (t.lineWidth = /** @type {number} */
    e[2], t.lineCap = /** @type {CanvasLineCap} */
    e[3], t.lineJoin = /** @type {CanvasLineJoin} */
    e[4], t.miterLimit = /** @type {number} */
    e[5], t.lineDashOffset = /** @type {number} */
    e[7], t.setLineDash(
      /** @type {Array<number>} */
      e[6]
    ));
  }
  /**
   * @private
   * @param {string|Array<string>} text The text to draw.
   * @param {string} textKey The key of the text state.
   * @param {string} strokeKey The key for the stroke state.
   * @param {string} fillKey The key for the fill state.
   * @return {{label: import("../canvas.js").Label, anchorX: number, anchorY: number}} The text image and its anchor.
   */
  drawLabelWithPointPlacement_(t, e, i, n) {
    const s = this.textStates[e], o = this.createLabel(t, e, n, i), a = this.strokeStates[i], l = this.pixelRatio, c = gs(
      Array.isArray(t) ? t[0] : t,
      s.textAlign || In
    ), h = xr[s.textBaseline || yr], u = a && a.lineWidth ? a.lineWidth : 0, d = o.width / l - 2 * s.scale[0], f = c * d + 2 * (0.5 - c) * u, g = h * o.height / l + 2 * (0.5 - h) * u;
    return {
      label: o,
      anchorX: f,
      anchorY: g
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scaled canvas size
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {Array<*>} instructions Instructions array.
   * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
   * @param {FeatureCallback<T>} [featureCallback] Feature callback.
   * @param {import("../../extent.js").Extent} [hitExtent] Only check
   *     features that intersect this extent.
   * @param {import("rbush").default<DeclutterEntry>} [declutterTree] Declutter tree.
   * @return {T|undefined} Callback result.
   * @template T
   */
  execute_(t, e, i, n, s, o, a, l) {
    const c = this.zIndexContext_;
    let h;
    this.pixelCoordinates_ && gi(i, this.renderedTransform_) ? h = this.pixelCoordinates_ : (this.pixelCoordinates_ || (this.pixelCoordinates_ = []), h = Ze(
      this.coordinates,
      0,
      this.coordinates.length,
      2,
      i,
      this.pixelCoordinates_
    ), Ju(this.renderedTransform_, i));
    let u = 0;
    const d = n.length;
    let f = 0, g, m, _, p, y, S, C, R, I, F, P, M, A, z = 0, Z = 0;
    const V = this.coordinateCache_, B = this.viewRotation_, ft = Math.round(Math.atan2(-i[1], i[0]) * 1e12) / 1e12, U = (
      /** @type {import("../../render.js").State} */
      {
        context: t,
        pixelRatio: this.pixelRatio,
        resolution: this.resolution,
        rotation: B
      }
    ), q = this.instructions != n || this.overlaps ? 0 : 200;
    let et, pt, ct, gt;
    for (; u < d; ) {
      const T = n[u];
      switch (
        /** @type {import("./Instruction.js").default} */
        T[0]
      ) {
        case L.BEGIN_GEOMETRY:
          et = /** @type {import("../../Feature.js").FeatureLike} */
          T[1], gt = T[3], et.getGeometry() ? a !== void 0 && !jt(a, gt.getExtent()) ? u = /** @type {number} */
          T[2] + 1 : ++u : u = /** @type {number} */
          T[2], c && (c.zIndex = T[4]);
          break;
        case L.BEGIN_PATH:
          z > q && (this.fill_(t), z = 0), Z > q && (t.stroke(), Z = 0), !z && !Z && (t.beginPath(), y = NaN, S = NaN), ++u;
          break;
        case L.CIRCLE:
          f = /** @type {number} */
          T[1];
          const qi = h[f], oe = h[f + 1], Yn = h[f + 2], nc = h[f + 3], $o = Yn - qi, Ko = nc - oe, Ho = Math.sqrt($o * $o + Ko * Ko);
          t.moveTo(qi + Ho, oe), t.arc(qi, oe, Ho, 0, 2 * Math.PI, !0), ++u;
          break;
        case L.CLOSE_PATH:
          t.closePath(), ++u;
          break;
        case L.CUSTOM:
          f = /** @type {number} */
          T[1], g = T[2];
          const rc = (
            /** @type {import("../../geom/SimpleGeometry.js").default} */
            T[3]
          ), sc = T[4], qo = T[5];
          U.geometry = rc, U.feature = et, u in V || (V[u] = []);
          const Ji = V[u];
          qo ? qo(h, f, g, 2, Ji) : (Ji[0] = h[f], Ji[1] = h[f + 1], Ji.length = 2), c && (c.zIndex = T[6]), sc(Ji, U), ++u;
          break;
        case L.DRAW_IMAGE:
          f = /** @type {number} */
          T[1], g = /** @type {number} */
          T[2], I = /** @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} */
          T[3], m = /** @type {number} */
          T[4], _ = /** @type {number} */
          T[5];
          let qr = (
            /** @type {number} */
            T[6]
          );
          const oc = (
            /** @type {number} */
            T[7]
          ), ac = (
            /** @type {number} */
            T[8]
          ), lc = (
            /** @type {number} */
            T[9]
          ), Jo = (
            /** @type {boolean} */
            T[10]
          );
          let Jr = (
            /** @type {number} */
            T[11]
          );
          const hc = (
            /** @type {import("../../size.js").Size} */
            T[12]
          );
          let Bn = (
            /** @type {number} */
            T[13]
          );
          p = T[14] || "declutter";
          const Qi = (
            /** @type {{args: import("../canvas.js").DeclutterImageWithText, declutterMode: import('../../style/Style.js').DeclutterMode}} */
            T[15]
          );
          if (!I && T.length >= 20) {
            F = /** @type {string} */
            T[19], P = /** @type {string} */
            T[20], M = /** @type {string} */
            T[21], A = /** @type {string} */
            T[22];
            const Wt = this.drawLabelWithPointPlacement_(
              F,
              P,
              M,
              A
            );
            I = Wt.label, T[3] = I;
            const Ke = (
              /** @type {number} */
              T[23]
            );
            m = (Wt.anchorX - Ke) * this.pixelRatio, T[4] = m;
            const Yt = (
              /** @type {number} */
              T[24]
            );
            _ = (Wt.anchorY - Yt) * this.pixelRatio, T[5] = _, qr = I.height, T[6] = qr, Bn = I.width, T[13] = Bn;
          }
          let Qr;
          T.length > 25 && (Qr = /** @type {number} */
          T[25]);
          let ts, Xn, zn;
          T.length > 17 ? (ts = /** @type {Array<number>} */
          T[16], Xn = /** @type {Array<*>} */
          T[17], zn = /** @type {Array<*>} */
          T[18]) : (ts = ti, Xn = null, zn = null), Jo && ft ? Jr += B : !Jo && !ft && (Jr -= B);
          let cc = 0;
          for (; f < g; f += 2) {
            if (Qr && Qr[cc++] < Bn / this.pixelRatio)
              continue;
            const Wt = this.calculateImageOrLabelDimensions_(
              I.width,
              I.height,
              h[f],
              h[f + 1],
              Bn,
              qr,
              m,
              _,
              ac,
              lc,
              Jr,
              hc,
              s,
              ts,
              !!Xn || !!zn,
              et
            ), Ke = [
              t,
              e,
              I,
              Wt,
              oc,
              Xn,
              zn
            ];
            if (l) {
              let Yt, ae, Bt;
              if (Qi) {
                const ut = g - f;
                if (!Qi[ut]) {
                  Qi[ut] = { args: Ke, declutterMode: p };
                  continue;
                }
                const Tt = Qi[ut];
                Yt = Tt.args, ae = Tt.declutterMode, delete Qi[ut], Bt = va(Yt);
              }
              let ge, me;
              if (Yt && (ae !== "declutter" || !l.collides(Bt)) && (ge = !0), (p !== "declutter" || !l.collides(Wt.declutterBox)) && (me = !0), ae === "declutter" && p === "declutter") {
                const ut = ge && me;
                ge = ut, me = ut;
              }
              ge && (ae !== "none" && l.insert(Bt), this.replayImageOrLabel_.apply(this, Yt)), me && (p !== "none" && l.insert(Wt.declutterBox), this.replayImageOrLabel_.apply(this, Ke));
            } else
              this.replayImageOrLabel_.apply(this, Ke);
          }
          ++u;
          break;
        case L.DRAW_CHARS:
          const Qo = (
            /** @type {number} */
            T[1]
          ), ta = (
            /** @type {number} */
            T[2]
          ), es = (
            /** @type {number} */
            T[3]
          ), uc = (
            /** @type {number} */
            T[4]
          );
          A = /** @type {string} */
          T[5];
          const dc = (
            /** @type {number} */
            T[6]
          ), ea = (
            /** @type {number} */
            T[7]
          ), ia = (
            /** @type {number} */
            T[8]
          );
          M = /** @type {string} */
          T[9];
          const is = (
            /** @type {number} */
            T[10]
          );
          F = /** @type {string|Array<string>} */
          T[11], Array.isArray(F) && (F = F.reduce(od, "")), P = /** @type {string} */
          T[12];
          const na = [
            /** @type {number} */
            T[13],
            /** @type {number} */
            T[13]
          ];
          p = T[14] || "declutter";
          const fc = (
            /** @type {boolean} */
            T[15]
          ), ns = this.textStates[P], tn = ns.font, en = [
            ns.scale[0] * ea,
            ns.scale[1] * ea
          ];
          let nn;
          tn in this.widths_ ? nn = this.widths_[tn] : (nn = {}, this.widths_[tn] = nn);
          const ra = po(h, Qo, ta, 2), sa = Math.abs(en[0]) * ma(tn, F, nn);
          if (uc || sa <= ra) {
            const Wt = this.textStates[P].textAlign, Ke = (ra - sa) * gs(F, Wt), Yt = rd(
              h,
              Qo,
              ta,
              2,
              F,
              Ke,
              dc,
              Math.abs(en[0]),
              ma,
              tn,
              nn,
              ft ? 0 : this.viewRotation_,
              fc
            );
            t: if (Yt) {
              const ae = [];
              let Bt, ge, me, ut, Tt;
              if (M)
                for (Bt = 0, ge = Yt.length; Bt < ge; ++Bt) {
                  Tt = Yt[Bt], me = /** @type {string} */
                  Tt[4], ut = this.createLabel(me, P, "", M), m = /** @type {number} */
                  Tt[2] + (en[0] < 0 ? -is : is), _ = es * ut.height + (0.5 - es) * 2 * is * en[1] / en[0] - ia;
                  const _e = this.calculateImageOrLabelDimensions_(
                    ut.width,
                    ut.height,
                    Tt[0],
                    Tt[1],
                    ut.width,
                    ut.height,
                    m,
                    _,
                    0,
                    0,
                    Tt[3],
                    na,
                    !1,
                    ti,
                    !1,
                    et
                  );
                  if (l && p === "declutter" && l.collides(_e.declutterBox))
                    break t;
                  ae.push([
                    t,
                    e,
                    ut,
                    _e,
                    1,
                    null,
                    null
                  ]);
                }
              if (A)
                for (Bt = 0, ge = Yt.length; Bt < ge; ++Bt) {
                  Tt = Yt[Bt], me = /** @type {string} */
                  Tt[4], ut = this.createLabel(me, P, A, ""), m = /** @type {number} */
                  Tt[2], _ = es * ut.height - ia;
                  const _e = this.calculateImageOrLabelDimensions_(
                    ut.width,
                    ut.height,
                    Tt[0],
                    Tt[1],
                    ut.width,
                    ut.height,
                    m,
                    _,
                    0,
                    0,
                    Tt[3],
                    na,
                    !1,
                    ti,
                    !1,
                    et
                  );
                  if (l && p === "declutter" && l.collides(_e.declutterBox))
                    break t;
                  ae.push([
                    t,
                    e,
                    ut,
                    _e,
                    1,
                    null,
                    null
                  ]);
                }
              l && p !== "none" && l.load(ae.map(va));
              for (let _e = 0, gc = ae.length; _e < gc; ++_e)
                this.replayImageOrLabel_.apply(this, ae[_e]);
            }
          }
          ++u;
          break;
        case L.END_GEOMETRY:
          if (o !== void 0) {
            et = /** @type {import("../../Feature.js").FeatureLike} */
            T[1];
            const Wt = o(
              et,
              gt,
              p
            );
            if (Wt)
              return Wt;
          }
          ++u;
          break;
        case L.FILL:
          q ? z++ : this.fill_(t), ++u;
          break;
        case L.MOVE_TO_LINE_TO:
          for (f = /** @type {number} */
          T[1], g = /** @type {number} */
          T[2], pt = h[f], ct = h[f + 1], t.moveTo(pt, ct), y = pt + 0.5 | 0, S = ct + 0.5 | 0, f += 2; f < g; f += 2)
            pt = h[f], ct = h[f + 1], C = pt + 0.5 | 0, R = ct + 0.5 | 0, (f == g - 2 || C !== y || R !== S) && (t.lineTo(pt, ct), y = C, S = R);
          ++u;
          break;
        case L.SET_FILL_STYLE:
          this.alignAndScaleFill_ = T[2], z && (this.fill_(t), z = 0, Z && (t.stroke(), Z = 0)), t.fillStyle = T[1], ++u;
          break;
        case L.SET_STROKE_STYLE:
          Z && (t.stroke(), Z = 0), this.setStrokeStyle_(
            t,
            /** @type {Array<*>} */
            T
          ), ++u;
          break;
        case L.STROKE:
          q ? Z++ : t.stroke(), ++u;
          break;
        default:
          ++u;
          break;
      }
    }
    z && this.fill_(t), Z && t.stroke();
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scaled canvas size.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
   * @param {import("rbush").default<DeclutterEntry>} [declutterTree] Declutter tree.
   */
  execute(t, e, i, n, s, o) {
    this.viewRotation_ = n, this.execute_(
      t,
      e,
      i,
      this.instructions,
      s,
      void 0,
      void 0,
      o
    );
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {FeatureCallback<T>} [featureCallback] Feature callback.
   * @param {import("../../extent.js").Extent} [hitExtent] Only check
   *     features that intersect this extent.
   * @return {T|undefined} Callback result.
   * @template T
   */
  executeHitDetection(t, e, i, n, s) {
    return this.viewRotation_ = i, this.execute_(
      t,
      [t.canvas.width, t.canvas.height],
      e,
      this.hitDetectionInstructions,
      !0,
      n,
      s
    );
  }
}
const Qe = [
  "Polygon",
  "Circle",
  "LineString",
  "Image",
  "Text",
  "Default"
], lh = ["Image", "Text"], ld = Qe.filter(
  (r) => !lh.includes(r)
);
class hd {
  /**
   * @param {import("../../extent.js").Extent} maxExtent Max extent for clipping. When a
   * `maxExtent` was set on the Builder for this executor group, the same `maxExtent`
   * should be set here, unless the target context does not exceed that extent (which
   * can be the case when rendering to tiles).
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The executor group can have overlapping geometries.
   * @param {!Object<string, !Object<import("../canvas.js").BuilderType, import("../canvas.js").SerializableInstructions>>} allInstructions
   * The serializable instructions.
   * @param {number} [renderBuffer] Optional rendering buffer.
   * @param {boolean} [deferredRendering] Enable deferred rendering with renderDeferred().
   */
  constructor(t, e, i, n, s, o, a) {
    this.maxExtent_ = t, this.overlaps_ = n, this.pixelRatio_ = i, this.resolution_ = e, this.renderBuffer_ = o, this.executorsByZIndex_ = {}, this.hitDetectionContext_ = null, this.hitDetectionTransform_ = Ie(), this.renderedContext_ = null, this.deferredZIndexContexts_ = {}, this.createExecutors_(s, a);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../transform.js").Transform} transform Transform.
   */
  clip(t, e) {
    const i = this.getClipCoords(e);
    t.beginPath(), t.moveTo(i[0], i[1]), t.lineTo(i[2], i[3]), t.lineTo(i[4], i[5]), t.lineTo(i[6], i[7]), t.clip();
  }
  /**
   * Create executors and populate them using the provided instructions.
   * @private
   * @param {!Object<string, !Object<string, import("../canvas.js").SerializableInstructions>>} allInstructions The serializable instructions
   * @param {boolean} deferredRendering Enable deferred rendering.
   */
  createExecutors_(t, e) {
    for (const i in t) {
      let n = this.executorsByZIndex_[i];
      n === void 0 && (n = {}, this.executorsByZIndex_[i] = n);
      const s = t[i];
      for (const o in s) {
        const a = s[o];
        n[o] = new ad(
          this.resolution_,
          this.pixelRatio_,
          this.overlaps_,
          a,
          e
        );
      }
    }
  }
  /**
   * @param {Array<import("../canvas.js").BuilderType>} executors Executors.
   * @return {boolean} Has executors of the provided types.
   */
  hasExecutors(t) {
    for (const e in this.executorsByZIndex_) {
      const i = this.executorsByZIndex_[e];
      for (let n = 0, s = t.length; n < s; ++n)
        if (t[n] in i)
          return !0;
    }
    return !1;
  }
  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default, number): T} callback Feature callback.
   * @param {Array<import("../../Feature.js").FeatureLike>} declutteredFeatures Decluttered features.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, n, s, o) {
    n = Math.round(n);
    const a = n * 2 + 1, l = di(
      this.hitDetectionTransform_,
      n + 0.5,
      n + 0.5,
      1 / e,
      -1 / e,
      -i,
      -t[0],
      -t[1]
    ), c = !this.hitDetectionContext_;
    c && (this.hitDetectionContext_ = Ft(
      a,
      a
    ));
    const h = this.hitDetectionContext_;
    h.canvas.width !== a || h.canvas.height !== a ? (h.canvas.width = a, h.canvas.height = a) : c || h.clearRect(0, 0, a, a);
    let u;
    this.renderBuffer_ !== void 0 && (u = Me(), Bl(u, t), Dr(
      u,
      e * (this.renderBuffer_ + n),
      u
    ));
    const d = cd(n);
    let f;
    function g(R, I, F) {
      const P = h.getImageData(
        0,
        0,
        a,
        a
      ).data;
      for (let M = 0, A = d.length; M < A; M++)
        if (P[d[M]] > 0) {
          if (!o || F === "none" || f !== "Image" && f !== "Text" || o.includes(R)) {
            const z = (d[M] - 3) / 4, Z = n - z % a, V = n - (z / a | 0), B = s(R, I, Z * Z + V * V);
            if (B)
              return B;
          }
          h.clearRect(0, 0, a, a);
          break;
        }
    }
    const m = Object.keys(this.executorsByZIndex_).map(Number);
    m.sort(ze);
    let _, p, y, S, C;
    for (_ = m.length - 1; _ >= 0; --_) {
      const R = m[_].toString();
      for (y = this.executorsByZIndex_[R], p = Qe.length - 1; p >= 0; --p)
        if (f = Qe[p], S = y[f], S !== void 0 && (C = S.executeHitDetection(
          h,
          l,
          i,
          g,
          u
        ), C))
          return C;
    }
  }
  /**
   * @param {import("../../transform.js").Transform} transform Transform.
   * @return {Array<number>|null} Clip coordinates.
   */
  getClipCoords(t) {
    const e = this.maxExtent_;
    if (!e)
      return null;
    const i = e[0], n = e[1], s = e[2], o = e[3], a = [i, n, i, o, s, o, s, n];
    return Ze(a, 0, 8, 2, t, a), a;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return ci(this.executorsByZIndex_);
  }
  /**
   * @param {CanvasRenderingContext2D} targetContext Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scale of the context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {boolean} snapToPixel Snap point symbols and test to integer pixel.
   * @param {Array<import("../canvas.js").BuilderType>} [builderTypes] Ordered replay types to replay.
   *     Default is {@link module:ol/render/replay~ALL}
   * @param {import("rbush").default<import('./Executor.js').DeclutterEntry>|null} [declutterTree] Declutter tree.
   *     When set to null, no decluttering is done, even when the executor group has a `ZIndexContext`.
   */
  execute(t, e, i, n, s, o, a) {
    const l = Object.keys(this.executorsByZIndex_).map(Number);
    l.sort(a ? Ac : ze), o = o || Qe;
    const c = Qe.length;
    for (let h = 0, u = l.length; h < u; ++h) {
      const d = l[h].toString(), f = this.executorsByZIndex_[d];
      for (let g = 0, m = o.length; g < m; ++g) {
        const _ = o[g], p = f[_];
        if (p !== void 0) {
          const y = a === null ? void 0 : p.getZIndexContext(), S = y ? y.getContext() : t, C = this.maxExtent_ && _ !== "Image" && _ !== "Text";
          if (C && (S.save(), this.clip(S, i)), !y || _ === "Text" || _ === "Image" ? p.execute(
            S,
            e,
            i,
            n,
            s,
            a
          ) : y.pushFunction(
            (R) => p.execute(
              R,
              e,
              i,
              n,
              s,
              a
            )
          ), C && S.restore(), y) {
            y.offset();
            const R = l[h] * c + Qe.indexOf(_);
            this.deferredZIndexContexts_[R] || (this.deferredZIndexContexts_[R] = []), this.deferredZIndexContexts_[R].push(y);
          }
        }
      }
    }
    this.renderedContext_ = t;
  }
  getDeferredZIndexContexts() {
    return this.deferredZIndexContexts_;
  }
  getRenderedContext() {
    return this.renderedContext_;
  }
  renderDeferred() {
    const t = this.deferredZIndexContexts_, e = Object.keys(t).map(Number).sort(ze);
    for (let i = 0, n = e.length; i < n; ++i)
      t[e[i]].forEach((s) => {
        s.draw(this.renderedContext_), s.clear();
      }), t[e[i]].length = 0;
  }
}
const ms = {};
function cd(r) {
  if (ms[r] !== void 0)
    return ms[r];
  const t = r * 2 + 1, e = r * r, i = new Array(e + 1);
  for (let s = 0; s <= r; ++s)
    for (let o = 0; o <= r; ++o) {
      const a = s * s + o * o;
      if (a > e)
        break;
      let l = i[a];
      l || (l = [], i[a] = l), l.push(((r + s) * t + (r + o)) * 4 + 3), s > 0 && l.push(((r - s) * t + (r + o)) * 4 + 3), o > 0 && (l.push(((r + s) * t + (r - o)) * 4 + 3), s > 0 && l.push(((r - s) * t + (r - o)) * 4 + 3));
    }
  const n = [];
  for (let s = 0, o = i.length; s < o; ++s)
    i[s] && n.push(...i[s]);
  return ms[r] = n, n;
}
const La = Ie(), ud = [NaN, NaN];
class yo extends Ae {
  constructor() {
    super(), this.extent_ = Me(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Al(
      (t, e, i) => {
        if (!i)
          return this.getSimplifiedGeometry(e);
        const n = this.clone();
        return n.applyTransform(i), n.getSimplifiedGeometry(e);
      }
    );
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {Geometry} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  clone() {
    return b();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, n) {
    return b();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, ud, Number.MIN_VALUE) === 0;
  }
  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate} [closestPoint] Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  getClosestPoint(t, e) {
    return e = e || [NaN, NaN], this.closestPointXY(t[0], t[1], e, 1 / 0), e;
  }
  /**
   * Returns true if this geometry includes the specified coordinate. If the
   * coordinate is on the boundary of the geometry, returns false.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {boolean} Contains coordinate.
   * @api
   */
  intersectsCoordinate(t) {
    return this.containsXY(t[0], t[1]);
  }
  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return b();
  }
  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const e = this.computeExtent(this.extent_);
      (isNaN(e[0]) || isNaN(e[1])) && Gr(e), this.extentRevision_ = this.getRevision();
    }
    return eu(this.extent_, t);
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, e) {
    b();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(t, e, i) {
    b();
  }
  /**
   * Create a simplified version of this geometry.  For linestrings, this uses
   * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
   * algorithm.  For polygons, a quantization-based
   * simplification is used to preserve topology.
   * @param {number} tolerance The tolerance distance for simplification.
   * @return {Geometry} A new, simplified version of the original geometry.
   * @api
   */
  simplify(t) {
    return this.getSimplifiedGeometry(t * t);
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker
   * algorithm.
   * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Geometry} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return b();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return b();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @abstract
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   */
  applyTransform(t) {
    b();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return b();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, e) {
    b();
  }
  /**
   * Transform each coordinate of the geometry from one coordinate reference
   * system to another. The geometry is modified in place.
   * For example, a line will be transformed to a line and a circle to a circle.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   *
   * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @return {this} This geometry.  Note that original geometry is
   *     modified in place.
   * @api
   */
  transform(t, e) {
    const i = rt(t), n = i.getUnits() == "tile-pixels" ? function(s, o, a) {
      const l = i.getExtent(), c = i.getWorldExtent(), h = de(c) / de(l);
      di(
        La,
        c[0],
        c[3],
        h,
        -h,
        0,
        0,
        0
      );
      const u = Ze(
        s,
        0,
        s.length,
        a,
        La,
        o
      ), d = Pn(i, e);
      return d ? d(u, u, a) : u;
    } : Pn(i, e);
    return this.applyTransform(n), this;
  }
}
class Le extends yo {
  constructor() {
    super(), this.layout = "XY", this.stride = 2, this.flatCoordinates;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return oo(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * @abstract
   * @return {Array<*> | null} Coordinates.
   */
  getCoordinates() {
    return b();
  }
  /**
   * Return the first coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} First coordinate.
   * @api
   */
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  /**
   * Return the last coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} Last point.
   * @api
   */
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  /**
   * Return the {@link import("./Geometry.js").GeometryLayout layout} of the geometry.
   * @return {import("./Geometry.js").GeometryLayout} Layout.
   * @api
   */
  getLayout() {
    return this.layout;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @override
   */
  getSimplifiedGeometry(t) {
    if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance)
      return this;
    const e = this.getSimplifiedGeometryInternal(t);
    return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    return this;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride;
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout} layout Layout.
   * @param {Array<number>} flatCoordinates Flat coordinates.
   */
  setFlatCoordinates(t, e) {
    this.stride = Rr(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    b();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, i) {
    let n;
    if (t)
      n = Rr(t);
    else {
      for (let s = 0; s < i; ++s) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      n = e.length, t = pi(n);
    }
    this.layout = t, this.stride = n;
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   * @override
   */
  applyTransform(t) {
    this.flatCoordinates && (t(
      this.flatCoordinates,
      this.flatCoordinates,
      this.layout.startsWith("XYZ") ? 3 : 2,
      this.stride
    ), this.changed());
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      _o(
        i,
        0,
        i.length,
        n,
        t,
        e,
        i
      ), this.changed();
    }
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   * @override
   */
  scale(t, e, i) {
    e === void 0 && (e = t), i || (i = Fe(this.getExtent()));
    const n = this.getFlatCoordinates();
    if (n) {
      const s = this.getStride();
      Hu(
        n,
        0,
        n.length,
        s,
        t,
        e,
        i,
        n
      ), this.changed();
    }
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   * @override
   */
  translate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      qu(
        i,
        0,
        i.length,
        n,
        t,
        e,
        i
      ), this.changed();
    }
  }
}
function pi(r) {
  let t;
  return r == 2 ? t = "XY" : r == 3 ? t = "XYZ" : r == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Rr(r) {
  let t;
  return r == "XY" ? t = 2 : r == "XYZ" || r == "XYM" ? t = 3 : r == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function dd(r, t, e) {
  const i = r.getFlatCoordinates();
  if (!i)
    return null;
  const n = r.getStride();
  return Ze(
    i,
    0,
    i.length,
    n,
    t,
    e
  );
}
class fd extends sh {
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../extent.js").Extent} extent Extent.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {number} [squaredTolerance] Optional squared tolerance for simplification.
   * @param {import("../../proj.js").TransformFunction} [userTransform] Transform from user to view projection.
   */
  constructor(t, e, i, n, s, o, a) {
    super(), this.context_ = t, this.pixelRatio_ = e, this.extent_ = i, this.transform_ = n, this.transformRotation_ = n ? bn(Math.atan2(n[1], n[0]), 10) : 0, this.viewRotation_ = s, this.squaredTolerance_ = o, this.userTransform_ = a, this.contextFillState_ = null, this.contextStrokeState_ = null, this.contextTextState_ = null, this.fillState_ = null, this.strokeState_ = null, this.image_ = null, this.imageAnchorX_ = 0, this.imageAnchorY_ = 0, this.imageHeight_ = 0, this.imageOpacity_ = 0, this.imageOriginX_ = 0, this.imageOriginY_ = 0, this.imageRotateWithView_ = !1, this.imageRotation_ = 0, this.imageScale_ = [0, 0], this.imageWidth_ = 0, this.text_ = "", this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = !1, this.textRotation_ = 0, this.textScale_ = [0, 0], this.textFillState_ = null, this.textStrokeState_ = null, this.textState_ = null, this.pixelCoordinates_ = [], this.tmpLocalTransform_ = Ie();
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  drawImages_(t, e, i, n) {
    if (!this.image_)
      return;
    const s = Ze(
      t,
      e,
      i,
      n,
      this.transform_,
      this.pixelCoordinates_
    ), o = this.context_, a = this.tmpLocalTransform_, l = o.globalAlpha;
    this.imageOpacity_ != 1 && (o.globalAlpha = l * this.imageOpacity_);
    let c = this.imageRotation_;
    this.transformRotation_ === 0 && (c -= this.viewRotation_), this.imageRotateWithView_ && (c += this.viewRotation_);
    for (let h = 0, u = s.length; h < u; h += 2) {
      const d = s[h] - this.imageAnchorX_, f = s[h + 1] - this.imageAnchorY_;
      if (c !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
        const g = d + this.imageAnchorX_, m = f + this.imageAnchorY_;
        di(
          a,
          g,
          m,
          1,
          1,
          c,
          -g,
          -m
        ), o.save(), o.transform.apply(o, a), o.translate(g, m), o.scale(this.imageScale_[0], this.imageScale_[1]), o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          -this.imageAnchorX_,
          -this.imageAnchorY_,
          this.imageWidth_,
          this.imageHeight_
        ), o.restore();
      } else
        o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          d,
          f,
          this.imageWidth_,
          this.imageHeight_
        );
    }
    this.imageOpacity_ != 1 && (o.globalAlpha = l);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  drawText_(t, e, i, n) {
    if (!this.textState_ || this.text_ === "")
      return;
    this.textFillState_ && this.setContextFillState_(this.textFillState_), this.textStrokeState_ && this.setContextStrokeState_(this.textStrokeState_), this.setContextTextState_(this.textState_);
    const s = Ze(
      t,
      e,
      i,
      n,
      this.transform_,
      this.pixelCoordinates_
    ), o = this.context_;
    let a = this.textRotation_;
    for (this.transformRotation_ === 0 && (a -= this.viewRotation_), this.textRotateWithView_ && (a += this.viewRotation_); e < i; e += n) {
      const l = s[e] + this.textOffsetX_, c = s[e + 1] + this.textOffsetY_;
      a !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1 ? (o.save(), o.translate(l - this.textOffsetX_, c - this.textOffsetY_), o.rotate(a), o.translate(this.textOffsetX_, this.textOffsetY_), o.scale(this.textScale_[0], this.textScale_[1]), this.textStrokeState_ && o.strokeText(this.text_, 0, 0), this.textFillState_ && o.fillText(this.text_, 0, 0), o.restore()) : (this.textStrokeState_ && o.strokeText(this.text_, l, c), this.textFillState_ && o.fillText(this.text_, l, c));
    }
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} close Close.
   * @private
   * @return {number} end End.
   */
  moveToLineTo_(t, e, i, n, s) {
    const o = this.context_, a = Ze(
      t,
      e,
      i,
      n,
      this.transform_,
      this.pixelCoordinates_
    );
    o.moveTo(a[0], a[1]);
    let l = a.length;
    s && (l -= 2);
    for (let c = 2; c < l; c += 2)
      o.lineTo(a[c], a[c + 1]);
    return s && o.closePath(), i;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  drawRings_(t, e, i, n) {
    for (let s = 0, o = i.length; s < o; ++s)
      e = this.moveToLineTo_(
        t,
        e,
        i[s],
        n,
        !0
      );
    return e;
  }
  /**
   * Render a circle geometry into the canvas.  Rendering is immediate and uses
   * the current fill and stroke styles.
   *
   * @param {import("../../geom/Circle.js").default} geometry Circle geometry.
   * @api
   * @override
   */
  drawCircle(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/Circle.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!jt(this.extent_, t.getExtent())) {
      if (this.fillState_ || this.strokeState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = dd(
          t,
          this.transform_,
          this.pixelCoordinates_
        ), i = e[2] - e[0], n = e[3] - e[1], s = Math.sqrt(i * i + n * n), o = this.context_;
        o.beginPath(), o.arc(
          e[0],
          e[1],
          s,
          0,
          2 * Math.PI
        ), this.fillState_ && o.fill(), this.strokeState_ && o.stroke();
      }
      this.text_ !== "" && this.drawText_(t.getCenter(), 0, 2, 2);
    }
  }
  /**
   * Set the rendering style.  Note that since this is an immediate rendering API,
   * any `zIndex` on the provided style will be ignored.
   *
   * @param {import("../../style/Style.js").default} style The rendering style.
   * @api
   * @override
   */
  setStyle(t) {
    this.setFillStrokeStyle(t.getFill(), t.getStroke()), this.setImageStyle(t.getImage()), this.setTextStyle(t.getText());
  }
  /**
   * @param {import("../../transform.js").Transform} transform Transform.
   */
  setTransform(t) {
    this.transform_ = t;
  }
  /**
   * Render a geometry into the canvas.  Call
   * {@link module:ol/render/canvas/Immediate~CanvasImmediateRenderer#setStyle renderer.setStyle()} first to set the rendering style.
   *
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
   * @api
   * @override
   */
  drawGeometry(t) {
    switch (t.getType()) {
      case "Point":
        this.drawPoint(
          /** @type {import("../../geom/Point.js").default} */
          t
        );
        break;
      case "LineString":
        this.drawLineString(
          /** @type {import("../../geom/LineString.js").default} */
          t
        );
        break;
      case "Polygon":
        this.drawPolygon(
          /** @type {import("../../geom/Polygon.js").default} */
          t
        );
        break;
      case "MultiPoint":
        this.drawMultiPoint(
          /** @type {import("../../geom/MultiPoint.js").default} */
          t
        );
        break;
      case "MultiLineString":
        this.drawMultiLineString(
          /** @type {import("../../geom/MultiLineString.js").default} */
          t
        );
        break;
      case "MultiPolygon":
        this.drawMultiPolygon(
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t
        );
        break;
      case "GeometryCollection":
        this.drawGeometryCollection(
          /** @type {import("../../geom/GeometryCollection.js").default} */
          t
        );
        break;
      case "Circle":
        this.drawCircle(
          /** @type {import("../../geom/Circle.js").default} */
          t
        );
        break;
    }
  }
  /**
   * Render a feature into the canvas.  Note that any `zIndex` on the provided
   * style will be ignored - features are rendered immediately in the order that
   * this method is called.  If you need `zIndex` support, you should be using an
   * {@link module:ol/layer/Vector~VectorLayer} instead.
   *
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {import("../../style/Style.js").default} style Style.
   * @api
   * @override
   */
  drawFeature(t, e) {
    const i = e.getGeometryFunction()(t);
    i && (this.setStyle(e), this.drawGeometry(i));
  }
  /**
   * Render a GeometryCollection to the canvas.  Rendering is immediate and
   * uses the current styles appropriate for each geometry in the collection.
   *
   * @param {import("../../geom/GeometryCollection.js").default} geometry Geometry collection.
   * @override
   */
  drawGeometryCollection(t) {
    const e = t.getGeometriesArray();
    for (let i = 0, n = e.length; i < n; ++i)
      this.drawGeometry(e[i]);
  }
  /**
   * Render a Point geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} geometry Point geometry.
   * @override
   */
  drawPoint(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/Point.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getFlatCoordinates(), i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  /**
   * Render a MultiPoint geometry  into the canvas.  Rendering is immediate and
   * uses the current style.
   *
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} geometry MultiPoint geometry.
   * @override
   */
  drawMultiPoint(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiPoint.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getFlatCoordinates(), i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  /**
   * Render a LineString into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} geometry LineString geometry.
   * @override
   */
  drawLineString(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/LineString.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!jt(this.extent_, t.getExtent())) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const e = this.context_, i = t.getFlatCoordinates();
        e.beginPath(), this.moveToLineTo_(
          i,
          0,
          i.length,
          t.getStride(),
          !1
        ), e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatMidpoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  /**
   * Render a MultiLineString geometry into the canvas.  Rendering is immediate
   * and uses the current style.
   *
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} geometry MultiLineString geometry.
   * @override
   */
  drawMultiLineString(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiLineString.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getExtent();
    if (jt(this.extent_, e)) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const i = this.context_, n = t.getFlatCoordinates();
        let s = 0;
        const o = (
          /** @type {Array<number>} */
          t.getEnds()
        ), a = t.getStride();
        i.beginPath();
        for (let l = 0, c = o.length; l < c; ++l)
          s = this.moveToLineTo_(
            n,
            s,
            o[l],
            a,
            !1
          );
        i.stroke();
      }
      if (this.text_ !== "") {
        const i = t.getFlatMidpoints();
        this.drawText_(i, 0, i.length, 2);
      }
    }
  }
  /**
   * Render a Polygon geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} geometry Polygon geometry.
   * @override
   */
  drawPolygon(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/Polygon.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!jt(this.extent_, t.getExtent())) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_;
        e.beginPath(), this.drawRings_(
          t.getOrientedFlatCoordinates(),
          0,
          /** @type {Array<number>} */
          t.getEnds(),
          t.getStride()
        ), this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  /**
   * Render MultiPolygon geometry into the canvas.  Rendering is immediate and
   * uses the current style.
   * @param {import("../../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
   * @override
   */
  drawMultiPolygon(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiPolygon.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!jt(this.extent_, t.getExtent())) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_, i = t.getOrientedFlatCoordinates();
        let n = 0;
        const s = t.getEndss(), o = t.getStride();
        e.beginPath();
        for (let a = 0, l = s.length; a < l; ++a) {
          const c = s[a];
          n = this.drawRings_(i, n, c, o);
        }
        this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoints();
        this.drawText_(e, 0, e.length, 2);
      }
    }
  }
  /**
   * @param {import("../canvas.js").FillState} fillState Fill state.
   * @private
   */
  setContextFillState_(t) {
    const e = this.context_, i = this.contextFillState_;
    i ? i.fillStyle != t.fillStyle && (i.fillStyle = t.fillStyle, e.fillStyle = t.fillStyle) : (e.fillStyle = t.fillStyle, this.contextFillState_ = {
      fillStyle: t.fillStyle
    });
  }
  /**
   * @param {import("../canvas.js").StrokeState} strokeState Stroke state.
   * @private
   */
  setContextStrokeState_(t) {
    const e = this.context_, i = this.contextStrokeState_;
    i ? (i.lineCap != t.lineCap && (i.lineCap = t.lineCap, e.lineCap = t.lineCap), gi(i.lineDash, t.lineDash) || e.setLineDash(
      i.lineDash = t.lineDash
    ), i.lineDashOffset != t.lineDashOffset && (i.lineDashOffset = t.lineDashOffset, e.lineDashOffset = t.lineDashOffset), i.lineJoin != t.lineJoin && (i.lineJoin = t.lineJoin, e.lineJoin = t.lineJoin), i.lineWidth != t.lineWidth && (i.lineWidth = t.lineWidth, e.lineWidth = t.lineWidth), i.miterLimit != t.miterLimit && (i.miterLimit = t.miterLimit, e.miterLimit = t.miterLimit), i.strokeStyle != t.strokeStyle && (i.strokeStyle = t.strokeStyle, e.strokeStyle = t.strokeStyle)) : (e.lineCap = t.lineCap, e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset, e.lineJoin = t.lineJoin, e.lineWidth = t.lineWidth, e.miterLimit = t.miterLimit, e.strokeStyle = t.strokeStyle, this.contextStrokeState_ = {
      lineCap: t.lineCap,
      lineDash: t.lineDash,
      lineDashOffset: t.lineDashOffset,
      lineJoin: t.lineJoin,
      lineWidth: t.lineWidth,
      miterLimit: t.miterLimit,
      strokeStyle: t.strokeStyle
    });
  }
  /**
   * @param {import("../canvas.js").TextState} textState Text state.
   * @private
   */
  setContextTextState_(t) {
    const e = this.context_, i = this.contextTextState_, n = t.textAlign ? t.textAlign : In;
    i ? (i.font != t.font && (i.font = t.font, e.font = t.font), i.textAlign != n && (i.textAlign = n, e.textAlign = n), i.textBaseline != t.textBaseline && (i.textBaseline = t.textBaseline, e.textBaseline = t.textBaseline)) : (e.font = t.font, e.textAlign = n, e.textBaseline = t.textBaseline, this.contextTextState_ = {
      font: t.font,
      textAlign: n,
      textBaseline: t.textBaseline
    });
  }
  /**
   * Set the fill and stroke style for subsequent draw operations.  To clear
   * either fill or stroke styles, pass null for the appropriate parameter.
   *
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @override
   */
  setFillStrokeStyle(t, e) {
    if (!t)
      this.fillState_ = null;
    else {
      const i = t.getColor();
      this.fillState_ = {
        fillStyle: ce(
          i || At
        )
      };
    }
    if (!e)
      this.strokeState_ = null;
    else {
      const i = e.getColor(), n = e.getLineCap(), s = e.getLineDash(), o = e.getLineDashOffset(), a = e.getLineJoin(), l = e.getWidth(), c = e.getMiterLimit(), h = s || xe;
      this.strokeState_ = {
        lineCap: n !== void 0 ? n : Bi,
        lineDash: this.pixelRatio_ === 1 ? h : h.map((u) => u * this.pixelRatio_),
        lineDashOffset: (o || Re) * this.pixelRatio_,
        lineJoin: a !== void 0 ? a : Xi,
        lineWidth: (l !== void 0 ? l : Tn) * this.pixelRatio_,
        miterLimit: c !== void 0 ? c : xn,
        strokeStyle: ce(
          i || Rn
        )
      };
    }
  }
  /**
   * Set the image style for subsequent draw operations.  Pass null to remove
   * the image style.
   *
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   * @override
   */
  setImageStyle(t) {
    let e;
    if (!t || !(e = t.getSize())) {
      this.image_ = null;
      return;
    }
    const i = t.getPixelRatio(this.pixelRatio_), n = t.getAnchor(), s = t.getOrigin();
    this.image_ = t.getImage(this.pixelRatio_), this.imageAnchorX_ = n[0] * i, this.imageAnchorY_ = n[1] * i, this.imageHeight_ = e[1] * i, this.imageOpacity_ = t.getOpacity(), this.imageOriginX_ = s[0], this.imageOriginY_ = s[1], this.imageRotateWithView_ = t.getRotateWithView(), this.imageRotation_ = t.getRotation();
    const o = t.getScaleArray();
    this.imageScale_ = [
      o[0] * this.pixelRatio_ / i,
      o[1] * this.pixelRatio_ / i
    ], this.imageWidth_ = e[0] * i;
  }
  /**
   * Set the text style for subsequent draw operations.  Pass null to
   * remove the text style.
   *
   * @param {import("../../style/Text.js").default} textStyle Text style.
   * @override
   */
  setTextStyle(t) {
    if (!t)
      this.text_ = "";
    else {
      const e = t.getFill();
      if (!e)
        this.textFillState_ = null;
      else {
        const f = e.getColor();
        this.textFillState_ = {
          fillStyle: ce(
            f || At
          )
        };
      }
      const i = t.getStroke();
      if (!i)
        this.textStrokeState_ = null;
      else {
        const f = i.getColor(), g = i.getLineCap(), m = i.getLineDash(), _ = i.getLineDashOffset(), p = i.getLineJoin(), y = i.getWidth(), S = i.getMiterLimit();
        this.textStrokeState_ = {
          lineCap: g !== void 0 ? g : Bi,
          lineDash: m || xe,
          lineDashOffset: _ || Re,
          lineJoin: p !== void 0 ? p : Xi,
          lineWidth: y !== void 0 ? y : Tn,
          miterLimit: S !== void 0 ? S : xn,
          strokeStyle: ce(
            f || Rn
          )
        };
      }
      const n = t.getFont(), s = t.getOffsetX(), o = t.getOffsetY(), a = t.getRotateWithView(), l = t.getRotation(), c = t.getScaleArray(), h = t.getText(), u = t.getTextAlign(), d = t.getTextBaseline();
      this.textState_ = {
        font: n !== void 0 ? n : Nl,
        textAlign: u !== void 0 ? u : In,
        textBaseline: d !== void 0 ? d : yr
      }, this.text_ = h !== void 0 ? Array.isArray(h) ? h.reduce((f, g, m) => f += m % 2 ? " " : g, "") : h : "", this.textOffsetX_ = s !== void 0 ? this.pixelRatio_ * s : 0, this.textOffsetY_ = o !== void 0 ? this.pixelRatio_ * o : 0, this.textRotateWithView_ = a !== void 0 ? a : !1, this.textRotation_ = l !== void 0 ? l : 0, this.textScale_ = [
        this.pixelRatio_ * c[0],
        this.pixelRatio_ * c[1]
      ];
    }
  }
}
const le = 0.5;
function gd(r, t, e, i, n, s, o, a, l) {
  const c = n, h = r[0] * le, u = r[1] * le, d = Ft(h, u);
  d.imageSmoothingEnabled = !1;
  const f = d.canvas, g = new fd(
    d,
    le,
    n,
    null,
    o,
    a,
    null
  ), m = e.length, _ = Math.floor((256 * 256 * 256 - 1) / m), p = {};
  for (let S = 1; S <= m; ++S) {
    const C = e[S - 1], R = C.getStyleFunction() || i;
    if (!R)
      continue;
    let I = R(C, s);
    if (!I)
      continue;
    Array.isArray(I) || (I = [I]);
    const P = (S * _).toString(16).padStart(7, "#00000");
    for (let M = 0, A = I.length; M < A; ++M) {
      const z = I[M], Z = z.getGeometryFunction()(C);
      if (!Z || !jt(c, Z.getExtent()))
        continue;
      const V = z.clone(), B = V.getFill();
      B && B.setColor(P);
      const ft = V.getStroke();
      ft && (ft.setColor(P), ft.setLineDash(null)), V.setText(void 0);
      const U = z.getImage();
      if (U) {
        const ct = U.getImageSize();
        if (!ct)
          continue;
        const gt = Ft(
          ct[0],
          ct[1],
          void 0,
          { alpha: !1 }
        ), T = gt.canvas;
        gt.fillStyle = P, gt.fillRect(0, 0, T.width, T.height), V.setImage(
          new mi({
            img: T,
            anchor: U.getAnchor(),
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            offset: U.getOrigin(),
            opacity: 1,
            size: U.getSize(),
            scale: U.getScale(),
            rotation: U.getRotation(),
            rotateWithView: U.getRotateWithView()
          })
        );
      }
      const q = V.getZIndex() || 0;
      let et = p[q];
      et || (et = {}, p[q] = et, et.Polygon = [], et.Circle = [], et.LineString = [], et.Point = []);
      const pt = Z.getType();
      if (pt === "GeometryCollection") {
        const ct = (
          /** @type {import("../../geom/GeometryCollection.js").default} */
          Z.getGeometriesArrayRecursive()
        );
        for (let gt = 0, T = ct.length; gt < T; ++gt) {
          const Hi = ct[gt];
          et[Hi.getType().replace("Multi", "")].push(
            Hi,
            V
          );
        }
      } else
        et[pt.replace("Multi", "")].push(Z, V);
    }
  }
  const y = Object.keys(p).map(Number).sort(ze);
  for (let S = 0, C = y.length; S < C; ++S) {
    const R = p[y[S]];
    for (const I in R) {
      const F = R[I];
      for (let P = 0, M = F.length; P < M; P += 2) {
        g.setStyle(F[P + 1]);
        for (let A = 0, z = t.length; A < z; ++A)
          g.setTransform(t[A]), g.drawGeometry(F[P]);
      }
    }
  }
  return d.getImageData(0, 0, f.width, f.height);
}
function md(r, t, e) {
  const i = [];
  if (e) {
    const n = Math.floor(Math.round(r[0]) * le), s = Math.floor(Math.round(r[1]) * le), o = (ht(n, 0, e.width - 1) + ht(s, 0, e.height - 1) * e.width) * 4, a = e.data[o], l = e.data[o + 1], h = e.data[o + 2] + 256 * (l + 256 * a), u = Math.floor((256 * 256 * 256 - 1) / t.length);
    h && h % u === 0 && i.push(t[h / u - 1]);
  }
  return i;
}
const _d = 0.5, hh = {
  Point: Rd,
  LineString: Cd,
  Polygon: Td,
  MultiPoint: Id,
  MultiLineString: Sd,
  MultiPolygon: xd,
  GeometryCollection: Ed,
  Circle: yd
};
function pd(r, t) {
  return parseInt(nt(r), 10) - parseInt(nt(t), 10);
}
function Oa(r, t) {
  const e = ch(r, t);
  return e * e;
}
function ch(r, t) {
  return _d * r / t;
}
function yd(r, t, e, i, n) {
  const s = e.getFill(), o = e.getStroke();
  if (s || o) {
    const l = r.getBuilder(e.getZIndex(), "Circle");
    l.setFillStrokeStyle(s, o), l.drawCircle(t, i, n);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = r.getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i);
  }
}
function ba(r, t, e, i, n, s, o, a) {
  const l = [], c = e.getImage();
  if (c) {
    let d = !0;
    const f = c.getImageState();
    f == Y.LOADED || f == Y.ERROR ? d = !1 : f == Y.IDLE && c.load(), d && l.push(c.ready());
  }
  const h = e.getFill();
  h && h.loading() && l.push(h.ready());
  const u = l.length > 0;
  return u && Promise.all(l).then(() => n(null)), wd(
    r,
    t,
    e,
    i,
    s,
    o,
    a
  ), u;
}
function wd(r, t, e, i, n, s, o) {
  const a = e.getGeometryFunction()(t);
  if (!a)
    return;
  const l = a.simplifyTransformed(
    i,
    n
  );
  if (e.getRenderer())
    uh(r, l, e, t, o);
  else {
    const h = hh[l.getType()];
    h(
      r,
      l,
      e,
      t,
      o,
      s
    );
  }
}
function uh(r, t, e, i, n) {
  if (t.getType() == "GeometryCollection") {
    const o = (
      /** @type {import("../geom/GeometryCollection.js").default} */
      t.getGeometries()
    );
    for (let a = 0, l = o.length; a < l; ++a)
      uh(r, o[a], e, i, n);
    return;
  }
  r.getBuilder(e.getZIndex(), "Default").drawCustom(
    /** @type {import("../geom/SimpleGeometry.js").default} */
    t,
    i,
    e.getRenderer(),
    e.getHitDetectionRenderer(),
    n
  );
}
function Ed(r, t, e, i, n, s) {
  const o = t.getGeometriesArray();
  let a, l;
  for (a = 0, l = o.length; a < l; ++a) {
    const c = hh[o[a].getType()];
    c(
      r,
      o[a],
      e,
      i,
      n,
      s
    );
  }
}
function Cd(r, t, e, i, n) {
  const s = e.getStroke();
  if (s) {
    const a = r.getBuilder(
      e.getZIndex(),
      "LineString"
    );
    a.setFillStrokeStyle(null, s), a.drawLineString(t, i, n);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = r.getBuilder(e.getZIndex(), "Text");
    a.setTextStyle(o), a.drawText(t, i, n);
  }
}
function Sd(r, t, e, i, n) {
  const s = e.getStroke();
  if (s) {
    const a = r.getBuilder(
      e.getZIndex(),
      "LineString"
    );
    a.setFillStrokeStyle(null, s), a.drawMultiLineString(t, i, n);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = r.getBuilder(e.getZIndex(), "Text");
    a.setTextStyle(o), a.drawText(t, i, n);
  }
}
function xd(r, t, e, i, n) {
  const s = e.getFill(), o = e.getStroke();
  if (o || s) {
    const l = r.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(s, o), l.drawMultiPolygon(t, i, n);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = r.getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i, n);
  }
}
function Rd(r, t, e, i, n, s) {
  const o = e.getImage(), a = e.getText(), l = a && a.getText(), c = s && o && l ? {} : void 0;
  if (o) {
    if (o.getImageState() != Y.LOADED)
      return;
    const h = r.getBuilder(e.getZIndex(), "Image");
    h.setImageStyle(o, c), h.drawPoint(t, i, n);
  }
  if (l) {
    const h = r.getBuilder(e.getZIndex(), "Text");
    h.setTextStyle(a, c), h.drawText(t, i, n);
  }
}
function Id(r, t, e, i, n, s) {
  const o = e.getImage(), a = o && o.getOpacity() !== 0, l = e.getText(), c = l && l.getText(), h = s && a && c ? {} : void 0;
  if (a) {
    if (o.getImageState() != Y.LOADED)
      return;
    const u = r.getBuilder(e.getZIndex(), "Image");
    u.setImageStyle(o, h), u.drawMultiPoint(t, i, n);
  }
  if (c) {
    const u = r.getBuilder(e.getZIndex(), "Text");
    u.setTextStyle(l, h), u.drawText(t, i, n);
  }
}
function Td(r, t, e, i, n) {
  const s = e.getFill(), o = e.getStroke();
  if (s || o) {
    const l = r.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(s, o), l.drawPolygon(t, i, n);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = r.getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i, n);
  }
}
class Pd extends fe {
  /**
   * @param {import("./EventType.js").default} type Type.
   * @param {import("../transform.js").Transform} [inversePixelTransform] Transform for
   *     CSS pixels to rendered pixels.
   * @param {import("../Map.js").FrameState} [frameState] Frame state.
   * @param {?(CanvasRenderingContext2D|WebGLRenderingContext)} [context] Context.
   */
  constructor(t, e, i, n) {
    super(t), this.inversePixelTransform = e, this.frameState = i, this.context = n;
  }
}
const Md = 5;
class Fd extends Nn {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(), this.ready = !0, this.boundHandleImageChange_ = this.handleImageChange_.bind(this), this.layer_ = t, this.staleKeys_ = new Array(), this.maxStaleKeys = Md;
  }
  /**
   * @return {Array<string>} Get the list of stale keys.
   */
  getStaleKeys() {
    return this.staleKeys_;
  }
  /**
   * @param {string} key The new stale key.
   */
  prependStaleKey(t) {
    this.staleKeys_.unshift(t), this.staleKeys_.length > this.maxStaleKeys && (this.staleKeys_.length = this.maxStaleKeys);
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return b();
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return null;
  }
  /**
   * Determine whether render should be called.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(t) {
    return b();
  }
  /**
   * Render the layer.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement|null} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(t, e) {
    return b();
  }
  /**
   * @abstract
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("./Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, n, s) {
  }
  /**
   * @return {LayerType} Layer.
   */
  getLayer() {
    return this.layer_;
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   * @abstract
   */
  handleFontsChanged() {
  }
  /**
   * Handle changes in image state.
   * @param {import("../events/Event.js").default} event Image change event.
   * @private
   */
  handleImageChange_(t) {
    const e = (
      /** @type {import("../Image.js").default} */
      t.target
    );
    (e.getState() === Y.LOADED || e.getState() === Y.ERROR) && this.renderIfReadyAndVisible();
  }
  /**
   * Load the image if not already loaded, and register the image change
   * listener if needed.
   * @param {import("../Image.js").default} image Image.
   * @return {boolean} `true` if the image is already loaded, `false` otherwise.
   * @protected
   */
  loadImage(t) {
    let e = t.getState();
    return e != Y.LOADED && e != Y.ERROR && t.addEventListener(Rt.CHANGE, this.boundHandleImageChange_), e == Y.IDLE && (t.load(), e = t.getState()), e == Y.LOADED;
  }
  /**
   * @protected
   */
  renderIfReadyAndVisible() {
    const t = this.getLayer();
    t && t.getVisible() && t.getSourceState() === "ready" && t.changed();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  renderDeferred(t) {
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    delete this.layer_, super.disposeInternal();
  }
}
const Na = [];
let vi = null;
function vd() {
  vi = Ft(1, 1, void 0, {
    willReadFrequently: !0
  });
}
class Ad extends Fd {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(t), this.container = null, this.renderedResolution, this.tempTransform = Ie(), this.pixelTransform = Ie(), this.inversePixelTransform = Ie(), this.context = null, this.deferredContext_ = null, this.containerReused = !1, this.frameState = null;
  }
  /**
   * @param {import('../../DataTile.js').ImageLike} image Image.
   * @param {number} col The column index.
   * @param {number} row The row index.
   * @return {Uint8ClampedArray|null} The image data.
   */
  getImageData(t, e, i) {
    vi || vd(), vi.clearRect(0, 0, 1, 1);
    let n;
    try {
      vi.drawImage(t, e, i, 1, 1, 0, 0, 1, 1), n = vi.getImageData(0, 0, 1, 1).data;
    } catch {
      return vi = null, null;
    }
    return n;
  }
  /**
   * @param {import('../../Map.js').FrameState} frameState Frame state.
   * @return {string} Background color.
   */
  getBackground(t) {
    let i = this.getLayer().getBackground();
    return typeof i == "function" && (i = i(t.viewState.resolution)), i || void 0;
  }
  /**
   * Get a rendering container from an existing target, if compatible.
   * @param {HTMLElement} target Potential render target.
   * @param {string} transform CSS transform matrix.
   * @param {string} [backgroundColor] Background color.
   */
  useContainer(t, e, i) {
    const n = this.getLayer().getClassName();
    let s, o;
    if (t && t.className === n && (!i || t && t.style.backgroundColor && gi(
      Ve(t.style.backgroundColor),
      Ve(i)
    ))) {
      const a = t.firstElementChild;
      a instanceof HTMLCanvasElement && (o = a.getContext("2d"));
    }
    if (o && nd(o.canvas.style.transform, e) ? (this.container = t, this.context = o, this.containerReused = !0) : this.containerReused ? (this.container = null, this.context = null, this.containerReused = !1) : this.container && (this.container.style.backgroundColor = null), !this.container) {
      s = document.createElement("div"), s.className = n;
      let a = s.style;
      a.position = "absolute", a.width = "100%", a.height = "100%", o = Ft();
      const l = o.canvas;
      s.appendChild(l), a = l.style, a.position = "absolute", a.left = "0", a.transformOrigin = "top left", this.container = s, this.context = o;
    }
    !this.containerReused && i && !this.container.style.backgroundColor && (this.container.style.backgroundColor = i);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent Clip extent.
   * @protected
   */
  clipUnrotated(t, e, i) {
    const n = ao(i), s = jl(i), o = Vl(i), a = Zl(i);
    Nt(e.coordinateToPixelTransform, n), Nt(e.coordinateToPixelTransform, s), Nt(e.coordinateToPixelTransform, o), Nt(e.coordinateToPixelTransform, a);
    const l = this.inversePixelTransform;
    Nt(l, n), Nt(l, s), Nt(l, o), Nt(l, a), t.save(), t.beginPath(), t.moveTo(Math.round(n[0]), Math.round(n[1])), t.lineTo(Math.round(s[0]), Math.round(s[1])), t.lineTo(Math.round(o[0]), Math.round(o[1])), t.lineTo(Math.round(a[0]), Math.round(a[1])), t.clip();
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @protected
   */
  prepareContainer(t, e) {
    const i = t.extent, n = t.viewState.resolution, s = t.viewState.rotation, o = t.pixelRatio, a = Math.round(St(i) / n * o), l = Math.round(de(i) / n * o);
    di(
      this.pixelTransform,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / o,
      1 / o,
      s,
      -a / 2,
      -l / 2
    ), Qu(this.inversePixelTransform, this.pixelTransform);
    const c = id(this.pixelTransform);
    if (this.useContainer(e, c, this.getBackground(t)), !this.containerReused) {
      const h = this.context.canvas;
      h.width != a || h.height != l ? (h.width = a, h.height = l) : this.context.clearRect(0, 0, a, l), c !== h.style.transform && (h.style.transform = c);
    }
  }
  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @private
   */
  dispatchRenderEvent_(t, e, i) {
    const n = this.getLayer();
    if (n.hasListener(t)) {
      const s = new Pd(
        t,
        this.inversePixelTransform,
        i,
        e
      );
      n.dispatchEvent(s);
    }
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  preRender(t, e) {
    this.frameState = e, !e.declutter && this.dispatchRenderEvent_(ni.PRERENDER, t, e);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  postRender(t, e) {
    e.declutter || this.dispatchRenderEvent_(ni.POSTRENDER, t, e);
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   */
  renderDeferredInternal(t) {
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import('../../render/canvas/ZIndexContext.js').ZIndexContextProxy} Context.
   */
  getRenderContext(t) {
    return t.declutter && !this.deferredContext_ && (this.deferredContext_ = new ah()), t.declutter ? this.deferredContext_.getContext() : this.context;
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderDeferred(t) {
    t.declutter && (this.dispatchRenderEvent_(
      ni.PRERENDER,
      this.context,
      t
    ), t.declutter && this.deferredContext_ && (this.deferredContext_.draw(this.context), this.deferredContext_.clear()), this.renderDeferredInternal(t), this.dispatchRenderEvent_(
      ni.POSTRENDER,
      this.context,
      t
    ));
  }
  /**
   * Creates a transform for rendering to an element that will be rotated after rendering.
   * @param {import("../../coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} width Width of the rendered element (in pixels).
   * @param {number} height Height of the rendered element (in pixels).
   * @param {number} offsetX Offset on the x-axis in view coordinates.
   * @protected
   * @return {!import("../../transform.js").Transform} Transform.
   */
  getRenderTransform(t, e, i, n, s, o, a) {
    const l = s / 2, c = o / 2, h = n / e, u = -h, d = -t[0] + a, f = -t[1];
    return di(
      this.tempTransform,
      l,
      c,
      h,
      u,
      -i,
      d,
      f
    );
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    delete this.frameState, super.disposeInternal();
  }
}
class Ld extends Ad {
  /**
   * @param {import("../../layer/BaseVector.js").default} vectorLayer Vector layer.
   */
  constructor(t) {
    super(t), this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this), this.animatingOrInteracting_, this.hitDetectionImageData_ = null, this.clipped_ = !1, this.renderedFeatures_ = null, this.renderedRevision_ = -1, this.renderedResolution_ = NaN, this.renderedExtent_ = Me(), this.wrappedRenderedExtent_ = Me(), this.renderedRotation_, this.renderedCenter_ = null, this.renderedProjection_ = null, this.renderedPixelRatio_ = 1, this.renderedRenderOrder_ = null, this.renderedFrameDeclutter_, this.replayGroup_ = null, this.replayGroupChanged = !0, this.clipping = !0, this.targetContext_ = null, this.opacity_ = 1;
  }
  /**
   * @param {ExecutorGroup} executorGroup Executor group.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {boolean} [declutterable] `true` to only render declutterable items,
   *     `false` to only render non-declutterable items, `undefined` to render all.
   */
  renderWorlds(t, e, i) {
    const n = e.extent, s = e.viewState, o = s.center, a = s.resolution, l = s.projection, c = s.rotation, h = l.getExtent(), u = this.getLayer().getSource(), d = this.getLayer().getDeclutter(), f = e.pixelRatio, g = e.viewHints, m = !(g[Vt.ANIMATING] || g[Vt.INTERACTING]), _ = this.context, p = Math.round(St(n) / a * f), y = Math.round(de(n) / a * f), S = u.getWrapX() && l.canWrapX(), C = S ? St(h) : null, R = S ? Math.ceil((n[2] - h[2]) / C) + 1 : 1;
    let I = S ? Math.floor((n[0] - h[0]) / C) : 0;
    do {
      let F = this.getRenderTransform(
        o,
        a,
        0,
        f,
        p,
        y,
        I * C
      );
      e.declutter && (F = F.slice(0)), t.execute(
        _,
        [_.canvas.width, _.canvas.height],
        F,
        c,
        m,
        i === void 0 ? Qe : i ? lh : ld,
        i ? d && e.declutter[d] : void 0
      );
    } while (++I < R);
  }
  /**
   * @private
   */
  setDrawContext_() {
    this.opacity_ !== 1 && (this.targetContext_ = this.context, this.context = Ft(
      this.context.canvas.width,
      this.context.canvas.height,
      Na
    ));
  }
  /**
   * @private
   */
  resetDrawContext_() {
    if (this.opacity_ !== 1 && this.targetContext_) {
      const t = this.targetContext_.globalAlpha;
      this.targetContext_.globalAlpha = this.opacity_, this.targetContext_.drawImage(this.context.canvas, 0, 0), this.targetContext_.globalAlpha = t, wc(this.context), Na.push(this.context.canvas), this.context = this.targetContext_, this.targetContext_ = null;
    }
  }
  /**
   * Render declutter items for this layer
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   */
  renderDeclutter(t) {
    !this.replayGroup_ || !this.getLayer().getDeclutter() || this.renderWorlds(this.replayGroup_, t, !0);
  }
  /**
   * Render deferred instructions.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderDeferredInternal(t) {
    this.replayGroup_ && (this.replayGroup_.renderDeferred(), this.clipped_ && this.context.restore(), this.resetDrawContext_());
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement|null} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   * @override
   */
  renderFrame(t, e) {
    const i = t.layerStatesArray[t.layerIndex];
    this.opacity_ = i.opacity;
    const n = t.viewState;
    this.prepareContainer(t, e);
    const s = this.context, o = this.replayGroup_;
    let a = o && !o.isEmpty();
    if (!a && !(this.getLayer().hasListener(ni.PRERENDER) || this.getLayer().hasListener(ni.POSTRENDER)))
      return this.container;
    if (this.setDrawContext_(), this.preRender(s, t), n.projection, this.clipped_ = !1, a && i.extent && this.clipping) {
      const l = ii(i.extent);
      a = jt(l, t.extent), this.clipped_ = a && !cn(l, t.extent), this.clipped_ && this.clipUnrotated(s, t, l);
    }
    return a && this.renderWorlds(
      o,
      t,
      this.getLayer().getDeclutter() ? !1 : void 0
    ), !t.declutter && this.clipped_ && s.restore(), this.postRender(s, t), this.renderedRotation_ !== n.rotation && (this.renderedRotation_ = n.rotation, this.hitDetectionImageData_ = null), t.declutter || this.resetDrawContext_(), this.container;
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../../Feature").default>>} Promise
   * that resolves with an array of features.
   * @override
   */
  getFeatures(t) {
    return new Promise((e) => {
      if (this.frameState && !this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
        const i = this.frameState.size.slice(), n = this.renderedCenter_, s = this.renderedResolution_, o = this.renderedRotation_, a = this.renderedProjection_, l = this.wrappedRenderedExtent_, c = this.getLayer(), h = [], u = i[0] * le, d = i[1] * le;
        h.push(
          this.getRenderTransform(
            n,
            s,
            o,
            le,
            u,
            d,
            0
          ).slice()
        );
        const f = c.getSource(), g = a.getExtent();
        if (f.getWrapX() && a.canWrapX() && !cn(g, l)) {
          let m = l[0];
          const _ = St(g);
          let p = 0, y;
          for (; m < g[0]; )
            --p, y = _ * p, h.push(
              this.getRenderTransform(
                n,
                s,
                o,
                le,
                u,
                d,
                y
              ).slice()
            ), m += _;
          for (p = 0, m = l[2]; m > g[2]; )
            ++p, y = _ * p, h.push(
              this.getRenderTransform(
                n,
                s,
                o,
                le,
                u,
                d,
                y
              ).slice()
            ), m -= _;
        }
        this.hitDetectionImageData_ = gd(
          i,
          h,
          this.renderedFeatures_,
          c.getStyleFunction(),
          l,
          s,
          o,
          Oa(s, this.renderedPixelRatio_)
        );
      }
      e(
        md(t, this.renderedFeatures_, this.hitDetectionImageData_)
      );
    });
  }
  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("../vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("../Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   * @override
   */
  forEachFeatureAtCoordinate(t, e, i, n, s) {
    var d, f;
    if (!this.replayGroup_)
      return;
    const o = e.viewState.resolution, a = e.viewState.rotation, l = this.getLayer(), c = {}, h = function(g, m, _) {
      const p = nt(g), y = c[p];
      if (y) {
        if (y !== !0 && _ < y.distanceSq) {
          if (_ === 0)
            return c[p] = !0, s.splice(s.lastIndexOf(y), 1), n(g, l, m);
          y.geometry = m, y.distanceSq = _;
        }
      } else {
        if (_ === 0)
          return c[p] = !0, n(g, l, m);
        s.push(
          c[p] = {
            feature: g,
            layer: l,
            geometry: m,
            distanceSq: _,
            callback: n
          }
        );
      }
    }, u = this.getLayer().getDeclutter();
    return this.replayGroup_.forEachFeatureAtCoordinate(
      t,
      o,
      a,
      i,
      h,
      u ? (f = (d = e.declutter) == null ? void 0 : d[u]) == null ? void 0 : f.all().map((g) => g.value) : null
    );
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   * @override
   */
  handleFontsChanged() {
    const t = this.getLayer();
    t.getVisible() && this.replayGroup_ && t.changed();
  }
  /**
   * Handle changes in image style state.
   * @param {import("../../events/Event.js").default} event Image style change event.
   * @private
   */
  handleStyleImageChange_(t) {
    this.renderIfReadyAndVisible();
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   * @override
   */
  prepareFrame(t) {
    const e = this.getLayer(), i = e.getSource();
    if (!i)
      return !1;
    const n = t.viewHints[Vt.ANIMATING], s = t.viewHints[Vt.INTERACTING], o = e.getUpdateWhileAnimating(), a = e.getUpdateWhileInteracting();
    if (this.ready && !o && n || !a && s)
      return this.animatingOrInteracting_ = !0, !0;
    this.animatingOrInteracting_ = !1;
    const l = t.extent, c = t.viewState, h = c.projection, u = c.resolution, d = t.pixelRatio, f = e.getRevision(), g = e.getRenderBuffer();
    let m = e.getRenderOrder();
    m === void 0 && (m = pd);
    const _ = c.center.slice(), p = Dr(
      l,
      g * u
    ), y = p.slice(), S = [p.slice()], C = h.getExtent();
    if (i.getWrapX() && h.canWrapX() && !cn(C, t.extent)) {
      const B = St(C), ft = Math.max(St(p) / 2, B);
      p[0] = C[0] - ft, p[2] = C[2] + ft, hu(_, h);
      const U = $l(S[0], h);
      U[0] < C[0] && U[2] < C[2] ? S.push([
        U[0] + B,
        U[1],
        U[2] + B,
        U[3]
      ]) : U[0] > C[0] && U[2] > C[2] && S.push([
        U[0] - B,
        U[1],
        U[2] - B,
        U[3]
      ]);
    }
    if (this.ready && this.renderedResolution_ == u && this.renderedRevision_ == f && this.renderedRenderOrder_ == m && this.renderedFrameDeclutter_ === !!t.declutter && cn(this.wrappedRenderedExtent_, p))
      return gi(this.renderedExtent_, y) || (this.hitDetectionImageData_ = null, this.renderedExtent_ = y), this.renderedCenter_ = _, this.replayGroupChanged = !1, !0;
    this.replayGroup_ = null;
    const R = new Ku(
      ch(u, d),
      p,
      u,
      d
    );
    let I;
    for (let B = 0, ft = S.length; B < ft; ++B)
      i.loadFeatures(S[B], u, h);
    const F = Oa(u, d);
    let P = !0;
    const M = (
      /**
       * @param {import("../../Feature.js").default} feature Feature.
       * @param {number} index Index.
       */
      (B, ft) => {
        let U;
        const q = B.getStyleFunction() || e.getStyleFunction();
        if (q && (U = q(B, u)), U) {
          const et = this.renderFeature(
            B,
            F,
            U,
            R,
            I,
            this.getLayer().getDeclutter(),
            ft
          );
          P = P && !et;
        }
      }
    ), A = Br(p), z = i.getFeaturesInExtent(A);
    m && z.sort(m);
    for (let B = 0, ft = z.length; B < ft; ++B)
      M(z[B], B);
    this.renderedFeatures_ = z, this.ready = P;
    const Z = R.finish(), V = new hd(
      p,
      u,
      d,
      i.getOverlaps(),
      Z,
      e.getRenderBuffer(),
      !!t.declutter
    );
    return this.renderedResolution_ = u, this.renderedRevision_ = f, this.renderedRenderOrder_ = m, this.renderedFrameDeclutter_ = !!t.declutter, this.renderedExtent_ = y, this.wrappedRenderedExtent_ = p, this.renderedCenter_ = _, this.renderedProjection_ = h, this.renderedPixelRatio_ = d, this.replayGroup_ = V, this.hitDetectionImageData_ = null, this.replayGroupChanged = !0, !0;
  }
  /**
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {number} squaredTolerance Squared render tolerance.
   * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
   * @param {import("../../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
   * @param {import("../../proj.js").TransformFunction} [transform] Transform from user to view projection.
   * @param {boolean} [declutter] Enable decluttering.
   * @param {number} [index] Render order index.
   * @return {boolean} `true` if an image is loading.
   */
  renderFeature(t, e, i, n, s, o, a) {
    if (!i)
      return !1;
    let l = !1;
    if (Array.isArray(i))
      for (let c = 0, h = i.length; c < h; ++c)
        l = ba(
          n,
          t,
          i[c],
          e,
          this.boundHandleStyleImageChange_,
          s,
          o,
          a
        ) || l;
    else
      l = ba(
        n,
        t,
        i,
        e,
        this.boundHandleStyleImageChange_,
        s,
        o,
        a
      );
    return l;
  }
}
function dh(r, t, e = 0, i = r.length - 1, n = Od) {
  for (; i > e; ) {
    if (i - e > 600) {
      const l = i - e + 1, c = t - e + 1, h = Math.log(l), u = 0.5 * Math.exp(2 * h / 3), d = 0.5 * Math.sqrt(h * u * (l - u) / l) * (c - l / 2 < 0 ? -1 : 1), f = Math.max(e, Math.floor(t - c * u / l + d)), g = Math.min(i, Math.floor(t + (l - c) * u / l + d));
      dh(r, t, f, g, n);
    }
    const s = r[t];
    let o = e, a = i;
    for (hn(r, e, t), n(r[i], s) > 0 && hn(r, e, i); o < a; ) {
      for (hn(r, o, a), o++, a--; n(r[o], s) < 0; ) o++;
      for (; n(r[a], s) > 0; ) a--;
    }
    n(r[e], s) === 0 ? hn(r, e, a) : (a++, hn(r, a, i)), a <= t && (e = a + 1), t <= a && (i = a - 1);
  }
}
function hn(r, t, e) {
  const i = r[t];
  r[t] = r[e], r[e] = i;
}
function Od(r, t) {
  return r < t ? -1 : r > t ? 1 : 0;
}
let fh = class {
  constructor(t = 9) {
    this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(t) {
    let e = this.data;
    const i = [];
    if (!qn(t, e)) return i;
    const n = this.toBBox, s = [];
    for (; e; ) {
      for (let o = 0; o < e.children.length; o++) {
        const a = e.children[o], l = e.leaf ? n(a) : a;
        qn(t, l) && (e.leaf ? i.push(a) : ps(t, l) ? this._all(a, i) : s.push(a));
      }
      e = s.pop();
    }
    return i;
  }
  collides(t) {
    let e = this.data;
    if (!qn(t, e)) return !1;
    const i = [];
    for (; e; ) {
      for (let n = 0; n < e.children.length; n++) {
        const s = e.children[n], o = e.leaf ? this.toBBox(s) : s;
        if (qn(t, o)) {
          if (e.leaf || ps(t, o)) return !0;
          i.push(s);
        }
      }
      e = i.pop();
    }
    return !1;
  }
  load(t) {
    if (!(t && t.length)) return this;
    if (t.length < this._minEntries) {
      for (let i = 0; i < t.length; i++)
        this.insert(t[i]);
      return this;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (!this.data.children.length)
      this.data = e;
    else if (this.data.height === e.height)
      this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const i = this.data;
        this.data = e, e = i;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(t) {
    return t && this._insert(t, this.data.height - 1), this;
  }
  clear() {
    return this.data = Ai([]), this;
  }
  remove(t, e) {
    if (!t) return this;
    let i = this.data;
    const n = this.toBBox(t), s = [], o = [];
    let a, l, c;
    for (; i || s.length; ) {
      if (i || (i = s.pop(), l = s[s.length - 1], a = o.pop(), c = !0), i.leaf) {
        const h = bd(t, i.children, e);
        if (h !== -1)
          return i.children.splice(h, 1), s.push(i), this._condense(s), this;
      }
      !c && !i.leaf && ps(i, n) ? (s.push(i), o.push(a), a = 0, l = i, i = i.children[0]) : l ? (a++, i = l.children[a], c = !1) : i = null;
    }
    return this;
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(t) {
    return this.data = t, this;
  }
  _all(t, e) {
    const i = [];
    for (; t; )
      t.leaf ? e.push(...t.children) : i.push(...t.children), t = i.pop();
    return e;
  }
  _build(t, e, i, n) {
    const s = i - e + 1;
    let o = this._maxEntries, a;
    if (s <= o)
      return a = Ai(t.slice(e, i + 1)), xi(a, this.toBBox), a;
    n || (n = Math.ceil(Math.log(s) / Math.log(o)), o = Math.ceil(s / Math.pow(o, n - 1))), a = Ai([]), a.leaf = !1, a.height = n;
    const l = Math.ceil(s / o), c = l * Math.ceil(Math.sqrt(o));
    ka(t, e, i, c, this.compareMinX);
    for (let h = e; h <= i; h += c) {
      const u = Math.min(h + c - 1, i);
      ka(t, h, u, l, this.compareMinY);
      for (let d = h; d <= u; d += l) {
        const f = Math.min(d + l - 1, u);
        a.children.push(this._build(t, d, f, n - 1));
      }
    }
    return xi(a, this.toBBox), a;
  }
  _chooseSubtree(t, e, i, n) {
    for (; n.push(e), !(e.leaf || n.length - 1 === i); ) {
      let s = 1 / 0, o = 1 / 0, a;
      for (let l = 0; l < e.children.length; l++) {
        const c = e.children[l], h = _s(c), u = Dd(t, c) - h;
        u < o ? (o = u, s = h < s ? h : s, a = c) : u === o && h < s && (s = h, a = c);
      }
      e = a || e.children[0];
    }
    return e;
  }
  _insert(t, e, i) {
    const n = i ? t : this.toBBox(t), s = [], o = this._chooseSubtree(n, this.data, e, s);
    for (o.children.push(t), dn(o, n); e >= 0 && s[e].children.length > this._maxEntries; )
      this._split(s, e), e--;
    this._adjustParentBBoxes(n, s, e);
  }
  // split overflowed node into two
  _split(t, e) {
    const i = t[e], n = i.children.length, s = this._minEntries;
    this._chooseSplitAxis(i, s, n);
    const o = this._chooseSplitIndex(i, s, n), a = Ai(i.children.splice(o, i.children.length - o));
    a.height = i.height, a.leaf = i.leaf, xi(i, this.toBBox), xi(a, this.toBBox), e ? t[e - 1].children.push(a) : this._splitRoot(i, a);
  }
  _splitRoot(t, e) {
    this.data = Ai([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, xi(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, i) {
    let n, s = 1 / 0, o = 1 / 0;
    for (let a = e; a <= i - e; a++) {
      const l = un(t, 0, a, this.toBBox), c = un(t, a, i, this.toBBox), h = Gd(l, c), u = _s(l) + _s(c);
      h < s ? (s = h, n = a, o = u < o ? u : o) : h === s && u < o && (o = u, n = a);
    }
    return n || i - e;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(t, e, i) {
    const n = t.leaf ? this.compareMinX : Nd, s = t.leaf ? this.compareMinY : kd, o = this._allDistMargin(t, e, i, n), a = this._allDistMargin(t, e, i, s);
    o < a && t.children.sort(n);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(t, e, i, n) {
    t.children.sort(n);
    const s = this.toBBox, o = un(t, 0, e, s), a = un(t, i - e, i, s);
    let l = Hn(o) + Hn(a);
    for (let c = e; c < i - e; c++) {
      const h = t.children[c];
      dn(o, t.leaf ? s(h) : h), l += Hn(o);
    }
    for (let c = i - e - 1; c >= e; c--) {
      const h = t.children[c];
      dn(a, t.leaf ? s(h) : h), l += Hn(a);
    }
    return l;
  }
  _adjustParentBBoxes(t, e, i) {
    for (let n = i; n >= 0; n--)
      dn(e[n], t);
  }
  _condense(t) {
    for (let e = t.length - 1, i; e >= 0; e--)
      t[e].children.length === 0 ? e > 0 ? (i = t[e - 1].children, i.splice(i.indexOf(t[e]), 1)) : this.clear() : xi(t[e], this.toBBox);
  }
};
function bd(r, t, e) {
  if (!e) return t.indexOf(r);
  for (let i = 0; i < t.length; i++)
    if (e(r, t[i])) return i;
  return -1;
}
function xi(r, t) {
  un(r, 0, r.children.length, t, r);
}
function un(r, t, e, i, n) {
  n || (n = Ai(null)), n.minX = 1 / 0, n.minY = 1 / 0, n.maxX = -1 / 0, n.maxY = -1 / 0;
  for (let s = t; s < e; s++) {
    const o = r.children[s];
    dn(n, r.leaf ? i(o) : o);
  }
  return n;
}
function dn(r, t) {
  return r.minX = Math.min(r.minX, t.minX), r.minY = Math.min(r.minY, t.minY), r.maxX = Math.max(r.maxX, t.maxX), r.maxY = Math.max(r.maxY, t.maxY), r;
}
function Nd(r, t) {
  return r.minX - t.minX;
}
function kd(r, t) {
  return r.minY - t.minY;
}
function _s(r) {
  return (r.maxX - r.minX) * (r.maxY - r.minY);
}
function Hn(r) {
  return r.maxX - r.minX + (r.maxY - r.minY);
}
function Dd(r, t) {
  return (Math.max(t.maxX, r.maxX) - Math.min(t.minX, r.minX)) * (Math.max(t.maxY, r.maxY) - Math.min(t.minY, r.minY));
}
function Gd(r, t) {
  const e = Math.max(r.minX, t.minX), i = Math.max(r.minY, t.minY), n = Math.min(r.maxX, t.maxX), s = Math.min(r.maxY, t.maxY);
  return Math.max(0, n - e) * Math.max(0, s - i);
}
function ps(r, t) {
  return r.minX <= t.minX && r.minY <= t.minY && t.maxX <= r.maxX && t.maxY <= r.maxY;
}
function qn(r, t) {
  return t.minX <= r.maxX && t.minY <= r.maxY && t.maxX >= r.minX && t.maxY >= r.minY;
}
function Ai(r) {
  return {
    children: r,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function ka(r, t, e, i, n) {
  const s = [t, e];
  for (; s.length; ) {
    if (e = s.pop(), t = s.pop(), e - t <= i) continue;
    const o = t + Math.ceil((e - t) / i / 2) * i;
    dh(r, o, t, e, n), s.push(t, o, o, e);
  }
}
let yi = 0;
const Mt = 1 << yi++, j = 1 << yi++, Lt = 1 << yi++, ee = 1 << yi++, fi = 1 << yi++, fn = 1 << yi++, Jn = Math.pow(2, yi) - 1, wo = {
  [Mt]: "boolean",
  [j]: "number",
  [Lt]: "string",
  [ee]: "color",
  [fi]: "number[]",
  [fn]: "size"
}, Ud = Object.keys(wo).map(Number).sort(ze);
function Wd(r) {
  return r in wo;
}
function gn(r) {
  const t = [];
  for (const e of Ud)
    mn(r, e) && t.push(wo[e]);
  return t.length === 0 ? "untyped" : t.length < 3 ? t.join(" or ") : t.slice(0, -1).join(", ") + ", or " + t[t.length - 1];
}
function mn(r, t) {
  return (r & t) === t;
}
function ke(r, t) {
  return r === t;
}
class _t {
  /**
   * @param {number} type The value type.
   * @param {LiteralValue} value The literal value.
   */
  constructor(t, e) {
    if (!Wd(t))
      throw new Error(
        `literal expressions must have a specific type, got ${gn(t)}`
      );
    this.type = t, this.value = e;
  }
}
class Yd {
  /**
   * @param {number} type The return type.
   * @param {string} operator The operator.
   * @param {...Expression} args The arguments.
   */
  constructor(t, e, ...i) {
    this.type = t, this.operator = e, this.args = i;
  }
}
function gh() {
  return {
    variables: /* @__PURE__ */ new Set(),
    properties: /* @__PURE__ */ new Set(),
    featureId: !1,
    geometryType: !1,
    mapState: !1
  };
}
function xt(r, t, e) {
  switch (typeof r) {
    case "boolean": {
      if (ke(t, Lt))
        return new _t(Lt, r ? "true" : "false");
      if (!mn(t, Mt))
        throw new Error(
          `got a boolean, but expected ${gn(t)}`
        );
      return new _t(Mt, r);
    }
    case "number": {
      if (ke(t, fn))
        return new _t(fn, ie(r));
      if (ke(t, Mt))
        return new _t(Mt, !!r);
      if (ke(t, Lt))
        return new _t(Lt, r.toString());
      if (!mn(t, j))
        throw new Error(`got a number, but expected ${gn(t)}`);
      return new _t(j, r);
    }
    case "string": {
      if (ke(t, ee))
        return new _t(ee, to(r));
      if (ke(t, Mt))
        return new _t(Mt, !!r);
      if (!mn(t, Lt))
        throw new Error(`got a string, but expected ${gn(t)}`);
      return new _t(Lt, r);
    }
  }
  if (!Array.isArray(r))
    throw new Error("expression must be an array or a primitive value");
  if (r.length === 0)
    throw new Error("empty expression");
  if (typeof r[0] == "string")
    return Jd(r, t, e);
  for (const i of r)
    if (typeof i != "number")
      throw new Error("expected an array of numbers");
  if (ke(t, fn)) {
    if (r.length !== 2)
      throw new Error(
        `expected an array of two values for a size, got ${r.length}`
      );
    return new _t(fn, r);
  }
  if (ke(t, ee)) {
    if (r.length === 3)
      return new _t(ee, [...r, 1]);
    if (r.length === 4)
      return new _t(ee, r);
    throw new Error(
      `expected an array of 3 or 4 values for a color, got ${r.length}`
    );
  }
  if (!mn(t, fi))
    throw new Error(
      `got an array of numbers, but expected ${gn(t)}`
    );
  return new _t(fi, r);
}
const w = {
  Get: "get",
  Var: "var",
  Concat: "concat",
  GeometryType: "geometry-type",
  LineMetric: "line-metric",
  Any: "any",
  All: "all",
  Not: "!",
  Resolution: "resolution",
  Zoom: "zoom",
  Time: "time",
  Equal: "==",
  NotEqual: "!=",
  GreaterThan: ">",
  GreaterThanOrEqualTo: ">=",
  LessThan: "<",
  LessThanOrEqualTo: "<=",
  Multiply: "*",
  Divide: "/",
  Add: "+",
  Subtract: "-",
  Clamp: "clamp",
  Mod: "%",
  Pow: "^",
  Abs: "abs",
  Floor: "floor",
  Ceil: "ceil",
  Round: "round",
  Sin: "sin",
  Cos: "cos",
  Atan: "atan",
  Sqrt: "sqrt",
  Match: "match",
  Between: "between",
  Interpolate: "interpolate",
  Coalesce: "coalesce",
  Case: "case",
  In: "in",
  Number: "number",
  String: "string",
  Array: "array",
  Color: "color",
  Id: "id",
  Band: "band",
  Palette: "palette",
  ToString: "to-string",
  Has: "has"
}, Bd = {
  [w.Get]: N(G(1, 1 / 0), Da),
  [w.Var]: N(G(1, 1), Xd),
  [w.Has]: N(G(1, 1 / 0), Da),
  [w.Id]: N(zd, Ri),
  [w.Concat]: N(
    G(2, 1 / 0),
    Q(Lt)
  ),
  [w.GeometryType]: N(Zd, Ri),
  [w.LineMetric]: N(Ri),
  [w.Resolution]: N(ys, Ri),
  [w.Zoom]: N(ys, Ri),
  [w.Time]: N(ys, Ri),
  [w.Any]: N(
    G(2, 1 / 0),
    Q(Mt)
  ),
  [w.All]: N(
    G(2, 1 / 0),
    Q(Mt)
  ),
  [w.Not]: N(
    G(1, 1),
    Q(Mt)
  ),
  [w.Equal]: N(
    G(2, 2),
    Q(Jn)
  ),
  [w.NotEqual]: N(
    G(2, 2),
    Q(Jn)
  ),
  [w.GreaterThan]: N(
    G(2, 2),
    Q(j)
  ),
  [w.GreaterThanOrEqualTo]: N(
    G(2, 2),
    Q(j)
  ),
  [w.LessThan]: N(
    G(2, 2),
    Q(j)
  ),
  [w.LessThanOrEqualTo]: N(
    G(2, 2),
    Q(j)
  ),
  [w.Multiply]: N(
    G(2, 1 / 0),
    Ga
  ),
  [w.Coalesce]: N(
    G(2, 1 / 0),
    Ga
  ),
  [w.Divide]: N(
    G(2, 2),
    Q(j)
  ),
  [w.Add]: N(
    G(2, 1 / 0),
    Q(j)
  ),
  [w.Subtract]: N(
    G(2, 2),
    Q(j)
  ),
  [w.Clamp]: N(
    G(3, 3),
    Q(j)
  ),
  [w.Mod]: N(
    G(2, 2),
    Q(j)
  ),
  [w.Pow]: N(
    G(2, 2),
    Q(j)
  ),
  [w.Abs]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Floor]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Ceil]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Round]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Sin]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Cos]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Atan]: N(
    G(1, 2),
    Q(j)
  ),
  [w.Sqrt]: N(
    G(1, 1),
    Q(j)
  ),
  [w.Match]: N(
    G(4, 1 / 0),
    Ua,
    jd
  ),
  [w.Between]: N(
    G(3, 3),
    Q(j)
  ),
  [w.Interpolate]: N(
    G(6, 1 / 0),
    Ua,
    $d
  ),
  [w.Case]: N(
    G(3, 1 / 0),
    Vd,
    Kd
  ),
  [w.In]: N(G(2, 2), Hd),
  [w.Number]: N(
    G(1, 1 / 0),
    Q(Jn)
  ),
  [w.String]: N(
    G(1, 1 / 0),
    Q(Jn)
  ),
  [w.Array]: N(
    G(1, 1 / 0),
    Q(j)
  ),
  [w.Color]: N(
    G(1, 4),
    Q(j)
  ),
  [w.Band]: N(
    G(1, 3),
    Q(j)
  ),
  [w.Palette]: N(
    G(2, 2),
    qd
  ),
  [w.ToString]: N(
    G(1, 1),
    Q(Mt | j | Lt | ee)
  )
};
function Da(r, t, e) {
  const i = r.length - 1, n = new Array(i);
  for (let s = 0; s < i; ++s) {
    const o = r[s + 1];
    switch (typeof o) {
      case "number": {
        n[s] = new _t(j, o);
        break;
      }
      case "string": {
        n[s] = new _t(Lt, o);
        break;
      }
      default:
        throw new Error(
          `expected a string key or numeric array index for a get operation, got ${o}`
        );
    }
    s === 0 && e.properties.add(String(o));
  }
  return n;
}
function Xd(r, t, e) {
  const i = r[1];
  if (typeof i != "string")
    throw new Error("expected a string argument for var operation");
  return e.variables.add(i), [new _t(Lt, i)];
}
function zd(r, t, e) {
  e.featureId = !0;
}
function Zd(r, t, e) {
  e.geometryType = !0;
}
function ys(r, t, e) {
  e.mapState = !0;
}
function Ri(r, t, e) {
  const i = r[0];
  if (r.length !== 1)
    throw new Error(`expected no arguments for ${i} operation`);
  return [];
}
function G(r, t) {
  return function(e, i, n) {
    const s = e[0], o = e.length - 1;
    if (r === t) {
      if (o !== r) {
        const a = r === 1 ? "" : "s";
        throw new Error(
          `expected ${r} argument${a} for ${s}, got ${o}`
        );
      }
    } else if (o < r || o > t) {
      const a = t === 1 / 0 ? `${r} or more` : `${r} to ${t}`;
      throw new Error(
        `expected ${a} arguments for ${s}, got ${o}`
      );
    }
  };
}
function Ga(r, t, e) {
  const i = r.length - 1, n = new Array(i);
  for (let s = 0; s < i; ++s) {
    const o = xt(r[s + 1], t, e);
    n[s] = o;
  }
  return n;
}
function Q(r) {
  return function(t, e, i) {
    const n = t.length - 1, s = new Array(n);
    for (let o = 0; o < n; ++o) {
      const a = xt(t[o + 1], r, i);
      s[o] = a;
    }
    return s;
  };
}
function Vd(r, t, e) {
  const i = r[0], n = r.length - 1;
  if (n % 2 === 0)
    throw new Error(
      `expected an odd number of arguments for ${i}, got ${n} instead`
    );
}
function Ua(r, t, e) {
  const i = r[0], n = r.length - 1;
  if (n % 2 === 1)
    throw new Error(
      `expected an even number of arguments for operation ${i}, got ${n} instead`
    );
}
function jd(r, t, e) {
  const i = r.length - 1, n = Lt | j | Mt, s = xt(r[1], n, e), o = xt(r[r.length - 1], t, e), a = new Array(i - 2);
  for (let l = 0; l < i - 2; l += 2) {
    try {
      const c = xt(r[l + 2], s.type, e);
      a[l] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 1} of match expression: ${c.message}`
      );
    }
    try {
      const c = xt(r[l + 3], o.type, e);
      a[l + 1] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 2} of match expression: ${c.message}`
      );
    }
  }
  return [s, ...a, o];
}
function $d(r, t, e) {
  const i = r[1];
  let n;
  switch (i[0]) {
    case "linear":
      n = 1;
      break;
    case "exponential":
      const l = i[1];
      if (typeof l != "number" || l <= 0)
        throw new Error(
          `expected a number base for exponential interpolation, got ${JSON.stringify(l)} instead`
        );
      n = l;
      break;
    default:
      throw new Error(
        `invalid interpolation type: ${JSON.stringify(i)}`
      );
  }
  const s = new _t(j, n);
  let o;
  try {
    o = xt(r[2], j, e);
  } catch (l) {
    throw new Error(
      `failed to parse argument 1 in interpolate expression: ${l.message}`
    );
  }
  const a = new Array(r.length - 3);
  for (let l = 0; l < a.length; l += 2) {
    try {
      const c = xt(r[l + 3], j, e);
      a[l] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 2} for interpolate expression: ${c.message}`
      );
    }
    try {
      const c = xt(r[l + 4], t, e);
      a[l + 1] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 3} for interpolate expression: ${c.message}`
      );
    }
  }
  return [s, o, ...a];
}
function Kd(r, t, e) {
  const i = xt(r[r.length - 1], t, e), n = new Array(r.length - 1);
  for (let s = 0; s < n.length - 1; s += 2) {
    try {
      const o = xt(r[s + 1], Mt, e);
      n[s] = o;
    } catch (o) {
      throw new Error(
        `failed to parse argument ${s} of case expression: ${o.message}`
      );
    }
    try {
      const o = xt(r[s + 2], i.type, e);
      n[s + 1] = o;
    } catch (o) {
      throw new Error(
        `failed to parse argument ${s + 1} of case expression: ${o.message}`
      );
    }
  }
  return n[n.length - 1] = i, n;
}
function Hd(r, t, e) {
  let i = r[2];
  if (!Array.isArray(i))
    throw new Error(
      'the second argument for the "in" operator must be an array'
    );
  let n;
  if (typeof i[0] == "string") {
    if (i[0] !== "literal")
      throw new Error(
        'for the "in" operator, a string array should be wrapped in a "literal" operator to disambiguate from expressions'
      );
    if (!Array.isArray(i[1]))
      throw new Error(
        'failed to parse "in" expression: the literal operator must be followed by an array'
      );
    i = i[1], n = Lt;
  } else
    n = j;
  const s = new Array(i.length);
  for (let a = 0; a < s.length; a++)
    try {
      const l = xt(i[a], n, e);
      s[a] = l;
    } catch (l) {
      throw new Error(
        `failed to parse haystack item ${a} for "in" expression: ${l.message}`
      );
    }
  return [xt(r[1], n, e), ...s];
}
function qd(r, t, e) {
  let i;
  try {
    i = xt(r[1], j, e);
  } catch (o) {
    throw new Error(
      `failed to parse first argument in palette expression: ${o.message}`
    );
  }
  const n = r[2];
  if (!Array.isArray(n))
    throw new Error("the second argument of palette must be an array");
  const s = new Array(n.length);
  for (let o = 0; o < s.length; o++) {
    let a;
    try {
      a = xt(n[o], ee, e);
    } catch (l) {
      throw new Error(
        `failed to parse color at index ${o} in palette expression: ${l.message}`
      );
    }
    if (!(a instanceof _t))
      throw new Error(
        `the palette color at index ${o} must be a literal value`
      );
    s[o] = a;
  }
  return [i, ...s];
}
function N(...r) {
  return function(t, e, i) {
    const n = t[0];
    let s;
    for (let o = 0; o < r.length; o++) {
      const a = r[o](t, e, i);
      if (o == r.length - 1) {
        if (!a)
          throw new Error(
            "expected last argument validator to return the parsed args"
          );
        s = a;
      }
    }
    return new Yd(e, n, ...s);
  };
}
function Jd(r, t, e) {
  const i = r[0], n = Bd[i];
  if (!n)
    throw new Error(`unknown operator: ${i}`);
  return n(r, t, e);
}
function mh(r) {
  if (!r)
    return "";
  const t = r.getType();
  switch (t) {
    case "Point":
    case "LineString":
    case "Polygon":
      return t;
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
      return (
        /** @type {'Point'|'LineString'|'Polygon'} */
        t.substring(5)
      );
    case "Circle":
      return "Polygon";
    case "GeometryCollection":
      return mh(
        /** @type {import("../geom/GeometryCollection.js").default} */
        r.getGeometries()[0]
      );
    default:
      return "";
  }
}
function _h() {
  return {
    variables: {},
    properties: {},
    resolution: NaN,
    featureId: null,
    geometryType: ""
  };
}
function Oe(r, t, e) {
  const i = xt(r, t, e);
  return re(i);
}
function re(r, t) {
  if (r instanceof _t) {
    if (r.type === ee && typeof r.value == "string") {
      const i = to(r.value);
      return function() {
        return i;
      };
    }
    return function() {
      return r.value;
    };
  }
  const e = r.operator;
  switch (e) {
    case w.Number:
    case w.String:
    case w.Coalesce:
      return Qd(r);
    case w.Get:
    case w.Var:
    case w.Has:
      return tf(r);
    case w.Id:
      return (i) => i.featureId;
    case w.GeometryType:
      return (i) => i.geometryType;
    case w.Concat: {
      const i = r.args.map((n) => re(n));
      return (n) => "".concat(...i.map((s) => s(n).toString()));
    }
    case w.Resolution:
      return (i) => i.resolution;
    case w.Any:
    case w.All:
    case w.Between:
    case w.In:
    case w.Not:
      return nf(r);
    case w.Equal:
    case w.NotEqual:
    case w.LessThan:
    case w.LessThanOrEqualTo:
    case w.GreaterThan:
    case w.GreaterThanOrEqualTo:
      return ef(r);
    case w.Multiply:
    case w.Divide:
    case w.Add:
    case w.Subtract:
    case w.Clamp:
    case w.Mod:
    case w.Pow:
    case w.Abs:
    case w.Floor:
    case w.Ceil:
    case w.Round:
    case w.Sin:
    case w.Cos:
    case w.Atan:
    case w.Sqrt:
      return rf(r);
    case w.Case:
      return sf(r);
    case w.Match:
      return of(r);
    case w.Interpolate:
      return af(r);
    case w.ToString:
      return lf(r);
    default:
      throw new Error(`Unsupported operator ${e}`);
  }
}
function Qd(r, t) {
  const e = r.operator, i = r.args.length, n = new Array(i);
  for (let s = 0; s < i; ++s)
    n[s] = re(r.args[s]);
  switch (e) {
    case w.Coalesce:
      return (s) => {
        for (let o = 0; o < i; ++o) {
          const a = n[o](s);
          if (typeof a < "u" && a !== null)
            return a;
        }
        throw new Error("Expected one of the values to be non-null");
      };
    case w.Number:
    case w.String:
      return (s) => {
        for (let o = 0; o < i; ++o) {
          const a = n[o](s);
          if (typeof a === e)
            return a;
        }
        throw new Error(`Expected one of the values to be a ${e}`);
      };
    default:
      throw new Error(`Unsupported assertion operator ${e}`);
  }
}
function tf(r, t) {
  const i = (
    /** @type {string} */
    /** @type {LiteralExpression} */
    r.args[0].value
  );
  switch (r.operator) {
    case w.Get:
      return (n) => {
        const s = r.args;
        let o = n.properties[i];
        for (let a = 1, l = s.length; a < l; ++a) {
          const h = (
            /** @type {string|number} */
            /** @type {LiteralExpression} */
            s[a].value
          );
          o = o[h];
        }
        return o;
      };
    case w.Var:
      return (n) => n.variables[i];
    case w.Has:
      return (n) => {
        const s = r.args;
        if (!(i in n.properties))
          return !1;
        let o = n.properties[i];
        for (let a = 1, l = s.length; a < l; ++a) {
          const h = (
            /** @type {string|number} */
            /** @type {LiteralExpression} */
            s[a].value
          );
          if (!o || !Object.hasOwn(o, h))
            return !1;
          o = o[h];
        }
        return !0;
      };
    default:
      throw new Error(`Unsupported accessor operator ${r.operator}`);
  }
}
function ef(r, t) {
  const e = r.operator, i = re(r.args[0]), n = re(r.args[1]);
  switch (e) {
    case w.Equal:
      return (s) => i(s) === n(s);
    case w.NotEqual:
      return (s) => i(s) !== n(s);
    case w.LessThan:
      return (s) => i(s) < n(s);
    case w.LessThanOrEqualTo:
      return (s) => i(s) <= n(s);
    case w.GreaterThan:
      return (s) => i(s) > n(s);
    case w.GreaterThanOrEqualTo:
      return (s) => i(s) >= n(s);
    default:
      throw new Error(`Unsupported comparison operator ${e}`);
  }
}
function nf(r, t) {
  const e = r.operator, i = r.args.length, n = new Array(i);
  for (let s = 0; s < i; ++s)
    n[s] = re(r.args[s]);
  switch (e) {
    case w.Any:
      return (s) => {
        for (let o = 0; o < i; ++o)
          if (n[o](s))
            return !0;
        return !1;
      };
    case w.All:
      return (s) => {
        for (let o = 0; o < i; ++o)
          if (!n[o](s))
            return !1;
        return !0;
      };
    case w.Between:
      return (s) => {
        const o = n[0](s), a = n[1](s), l = n[2](s);
        return o >= a && o <= l;
      };
    case w.In:
      return (s) => {
        const o = n[0](s);
        for (let a = 1; a < i; ++a)
          if (o === n[a](s))
            return !0;
        return !1;
      };
    case w.Not:
      return (s) => !n[0](s);
    default:
      throw new Error(`Unsupported logical operator ${e}`);
  }
}
function rf(r, t) {
  const e = r.operator, i = r.args.length, n = new Array(i);
  for (let s = 0; s < i; ++s)
    n[s] = re(r.args[s]);
  switch (e) {
    case w.Multiply:
      return (s) => {
        let o = 1;
        for (let a = 0; a < i; ++a)
          o *= n[a](s);
        return o;
      };
    case w.Divide:
      return (s) => n[0](s) / n[1](s);
    case w.Add:
      return (s) => {
        let o = 0;
        for (let a = 0; a < i; ++a)
          o += n[a](s);
        return o;
      };
    case w.Subtract:
      return (s) => n[0](s) - n[1](s);
    case w.Clamp:
      return (s) => {
        const o = n[0](s), a = n[1](s);
        if (o < a)
          return a;
        const l = n[2](s);
        return o > l ? l : o;
      };
    case w.Mod:
      return (s) => n[0](s) % n[1](s);
    case w.Pow:
      return (s) => Math.pow(n[0](s), n[1](s));
    case w.Abs:
      return (s) => Math.abs(n[0](s));
    case w.Floor:
      return (s) => Math.floor(n[0](s));
    case w.Ceil:
      return (s) => Math.ceil(n[0](s));
    case w.Round:
      return (s) => Math.round(n[0](s));
    case w.Sin:
      return (s) => Math.sin(n[0](s));
    case w.Cos:
      return (s) => Math.cos(n[0](s));
    case w.Atan:
      return i === 2 ? (s) => Math.atan2(n[0](s), n[1](s)) : (s) => Math.atan(n[0](s));
    case w.Sqrt:
      return (s) => Math.sqrt(n[0](s));
    default:
      throw new Error(`Unsupported numeric operator ${e}`);
  }
}
function sf(r, t) {
  const e = r.args.length, i = new Array(e);
  for (let n = 0; n < e; ++n)
    i[n] = re(r.args[n]);
  return (n) => {
    for (let s = 0; s < e - 1; s += 2)
      if (i[s](n))
        return i[s + 1](n);
    return i[e - 1](n);
  };
}
function of(r, t) {
  const e = r.args.length, i = new Array(e);
  for (let n = 0; n < e; ++n)
    i[n] = re(r.args[n]);
  return (n) => {
    const s = i[0](n);
    for (let o = 1; o < e - 1; o += 2)
      if (s === i[o](n))
        return i[o + 1](n);
    return i[e - 1](n);
  };
}
function af(r, t) {
  const e = r.args.length, i = new Array(e);
  for (let n = 0; n < e; ++n)
    i[n] = re(r.args[n]);
  return (n) => {
    const s = i[0](n), o = i[1](n);
    let a, l;
    for (let c = 2; c < e; c += 2) {
      const h = i[c](n);
      let u = i[c + 1](n);
      const d = Array.isArray(u);
      if (d && (u = Pc(u)), h >= o)
        return c === 2 ? u : d ? hf(
          s,
          o,
          a,
          l,
          h,
          u
        ) : _n(
          s,
          o,
          a,
          l,
          h,
          u
        );
      a = h, l = u;
    }
    return l;
  };
}
function lf(r, t) {
  const e = r.operator, i = r.args.length, n = new Array(i);
  for (let s = 0; s < i; ++s)
    n[s] = re(r.args[s]);
  switch (e) {
    case w.ToString:
      return (s) => {
        const o = n[0](s);
        return r.args[0].type === ee ? eo(o) : o.toString();
      };
    default:
      throw new Error(`Unsupported convert operator ${e}`);
  }
}
function _n(r, t, e, i, n, s) {
  const o = n - e;
  if (o === 0)
    return i;
  const a = t - e, l = r === 1 ? a / o : (Math.pow(r, a) - 1) / (Math.pow(r, o) - 1);
  return i + l * (s - i);
}
function hf(r, t, e, i, n, s) {
  if (n - e === 0)
    return i;
  const a = ca(i), l = ca(s);
  let c = l[2] - a[2];
  c > 180 ? c -= 360 : c < -180 && (c += 360);
  const h = [
    _n(r, t, e, a[0], n, l[0]),
    _n(r, t, e, a[1], n, l[1]),
    a[2] + _n(r, t, e, 0, n, c),
    _n(r, t, e, i[3], n, s[3])
  ];
  return Mc(h);
}
function cf(r) {
  return !0;
}
function uf(r) {
  const t = gh(), e = df(r, t), i = _h();
  return function(n, s) {
    if (i.properties = n.getPropertiesInternal(), i.resolution = s, t.featureId) {
      const o = n.getId();
      o !== void 0 ? i.featureId = o : i.featureId = null;
    }
    return t.geometryType && (i.geometryType = mh(
      n.getGeometry()
    )), e(i);
  };
}
function Wa(r) {
  const t = gh(), e = r.length, i = new Array(e);
  for (let o = 0; o < e; ++o)
    i[o] = Ws(r[o], t);
  const n = _h(), s = new Array(e);
  return function(o, a) {
    if (n.properties = o.getPropertiesInternal(), n.resolution = a, t.featureId) {
      const c = o.getId();
      c !== void 0 ? n.featureId = c : n.featureId = null;
    }
    let l = 0;
    for (let c = 0; c < e; ++c) {
      const h = i[c](n);
      h && (s[l] = h, l += 1);
    }
    return s.length = l, s;
  };
}
function df(r, t) {
  const e = r.length, i = new Array(e);
  for (let n = 0; n < e; ++n) {
    const s = r[n], o = "filter" in s ? Oe(s.filter, Mt, t) : cf;
    let a;
    if (Array.isArray(s.style)) {
      const l = s.style.length;
      a = new Array(l);
      for (let c = 0; c < l; ++c)
        a[c] = Ws(s.style[c], t);
    } else
      a = [Ws(s.style, t)];
    i[n] = { filter: o, styles: a };
  }
  return function(n) {
    const s = [];
    let o = !1;
    for (let a = 0; a < e; ++a) {
      const l = i[a].filter;
      if (l(n) && !(r[a].else && o)) {
        o = !0;
        for (const c of i[a].styles) {
          const h = c(n);
          h && s.push(h);
        }
      }
    }
    return s;
  };
}
function Ws(r, t) {
  const e = Fn(r, "", t), i = vn(r, "", t), n = ff(r, t), s = gf(r, t), o = Ot(r, "z-index", t);
  if (!e && !i && !n && !s && !ci(r))
    throw new Error(
      "No fill, stroke, point, or text symbolizer properties in style: " + JSON.stringify(r)
    );
  const a = new X();
  return function(l) {
    let c = !0;
    if (e) {
      const h = e(l);
      h && (c = !1), a.setFill(h);
    }
    if (i) {
      const h = i(l);
      h && (c = !1), a.setStroke(h);
    }
    if (n) {
      const h = n(l);
      h && (c = !1), a.setText(h);
    }
    if (s) {
      const h = s(l);
      h && (c = !1), a.setImage(h);
    }
    return o && a.setZIndex(o(l)), c ? null : a;
  };
}
function Fn(r, t, e) {
  let i;
  if (t + "fill-pattern-src" in r)
    i = yf(r, t + "fill-", e);
  else {
    if (r[t + "fill-color"] === "none")
      return (s) => null;
    i = Eo(
      r,
      t + "fill-color",
      e
    );
  }
  if (!i)
    return null;
  const n = new $();
  return function(s) {
    const o = i(s);
    return o === Qs ? null : (n.setColor(o), n);
  };
}
function vn(r, t, e) {
  const i = Ot(
    r,
    t + "stroke-width",
    e
  ), n = Eo(
    r,
    t + "stroke-color",
    e
  );
  if (!i && !n)
    return null;
  const s = Ee(
    r,
    t + "stroke-line-cap",
    e
  ), o = Ee(
    r,
    t + "stroke-line-join",
    e
  ), a = ph(
    r,
    t + "stroke-line-dash",
    e
  ), l = Ot(
    r,
    t + "stroke-line-dash-offset",
    e
  ), c = Ot(
    r,
    t + "stroke-miter-limit",
    e
  ), h = new K();
  return function(u) {
    if (n) {
      const d = n(u);
      if (d === Qs)
        return null;
      h.setColor(d);
    }
    if (i && h.setWidth(i(u)), s) {
      const d = s(u);
      if (d !== "butt" && d !== "round" && d !== "square")
        throw new Error("Expected butt, round, or square line cap");
      h.setLineCap(d);
    }
    if (o) {
      const d = o(u);
      if (d !== "bevel" && d !== "round" && d !== "miter")
        throw new Error("Expected bevel, round, or miter line join");
      h.setLineJoin(d);
    }
    return a && h.setLineDash(a(u)), l && h.setLineDashOffset(l(u)), c && h.setMiterLimit(c(u)), h;
  };
}
function ff(r, t) {
  const e = "text-", i = Ee(r, e + "value", t);
  if (!i)
    return null;
  const n = Fn(r, e, t), s = Fn(
    r,
    e + "background-",
    t
  ), o = vn(r, e, t), a = vn(
    r,
    e + "background-",
    t
  ), l = Ee(r, e + "font", t), c = Ot(
    r,
    e + "max-angle",
    t
  ), h = Ot(
    r,
    e + "offset-x",
    t
  ), u = Ot(
    r,
    e + "offset-y",
    t
  ), d = Ui(
    r,
    e + "overflow",
    t
  ), f = Ee(
    r,
    e + "placement",
    t
  ), g = Ot(r, e + "repeat", t), m = zr(r, e + "scale", t), _ = Ui(
    r,
    e + "rotate-with-view",
    t
  ), p = Ot(
    r,
    e + "rotation",
    t
  ), y = Ee(r, e + "align", t), S = Ee(
    r,
    e + "justify",
    t
  ), C = Ee(
    r,
    e + "baseline",
    t
  ), R = Ui(
    r,
    e + "keep-upright",
    t
  ), I = ph(
    r,
    e + "padding",
    t
  ), F = Zr(
    r,
    e + "declutter-mode"
  ), P = new Kt({ declutterMode: F });
  return function(M) {
    if (P.setText(i(M)), n && P.setFill(n(M)), s && P.setBackgroundFill(s(M)), o && P.setStroke(o(M)), a && P.setBackgroundStroke(a(M)), l && P.setFont(l(M)), c && P.setMaxAngle(c(M)), h && P.setOffsetX(h(M)), u && P.setOffsetY(u(M)), d && P.setOverflow(d(M)), f) {
      const A = f(M);
      if (A !== "point" && A !== "line")
        throw new Error("Expected point or line for text-placement");
      P.setPlacement(A);
    }
    if (g && P.setRepeat(g(M)), m && P.setScale(m(M)), _ && P.setRotateWithView(_(M)), p && P.setRotation(p(M)), y) {
      const A = y(M);
      if (A !== "left" && A !== "center" && A !== "right" && A !== "end" && A !== "start")
        throw new Error(
          "Expected left, right, center, start, or end for text-align"
        );
      P.setTextAlign(A);
    }
    if (S) {
      const A = S(M);
      if (A !== "left" && A !== "right" && A !== "center")
        throw new Error("Expected left, right, or center for text-justify");
      P.setJustify(A);
    }
    if (C) {
      const A = C(M);
      if (A !== "bottom" && A !== "top" && A !== "middle" && A !== "alphabetic" && A !== "hanging")
        throw new Error(
          "Expected bottom, top, middle, alphabetic, or hanging for text-baseline"
        );
      P.setTextBaseline(A);
    }
    return I && P.setPadding(I(M)), R && P.setKeepUpright(R(M)), P;
  };
}
function gf(r, t) {
  return "icon-src" in r ? mf(r, t) : "shape-points" in r ? _f(r, t) : "circle-radius" in r ? pf(r, t) : null;
}
function mf(r, t) {
  const e = "icon-", i = e + "src", n = yh(r[i], i), s = Ir(
    r,
    e + "anchor",
    t
  ), o = zr(r, e + "scale", t), a = Ot(
    r,
    e + "opacity",
    t
  ), l = Ir(
    r,
    e + "displacement",
    t
  ), c = Ot(
    r,
    e + "rotation",
    t
  ), h = Ui(
    r,
    e + "rotate-with-view",
    t
  ), u = Ba(r, e + "anchor-origin"), d = Xa(
    r,
    e + "anchor-x-units"
  ), f = Xa(
    r,
    e + "anchor-y-units"
  ), g = Sf(r, e + "color"), m = Ef(r, e + "cross-origin"), _ = Cf(r, e + "offset"), p = Ba(r, e + "offset-origin"), y = Tr(r, e + "width"), S = Tr(r, e + "height"), C = wf(r, e + "size"), R = Zr(
    r,
    e + "declutter-mode"
  ), I = new mi({
    src: n,
    anchorOrigin: u,
    anchorXUnits: d,
    anchorYUnits: f,
    color: g,
    crossOrigin: m,
    offset: _,
    offsetOrigin: p,
    height: S,
    width: y,
    size: C,
    declutterMode: R
  });
  return function(F) {
    return a && I.setOpacity(a(F)), l && I.setDisplacement(l(F)), c && I.setRotation(c(F)), h && I.setRotateWithView(h(F)), o && I.setScale(o(F)), s && I.setAnchor(s(F)), I;
  };
}
function _f(r, t) {
  const e = "shape-", i = e + "points", n = e + "radius", s = Ys(r[i], i), o = Ys(r[n], n), a = Fn(r, e, t), l = vn(r, e, t), c = zr(r, e + "scale", t), h = Ir(
    r,
    e + "displacement",
    t
  ), u = Ot(
    r,
    e + "rotation",
    t
  ), d = Ui(
    r,
    e + "rotate-with-view",
    t
  ), f = Tr(r, e + "radius2"), g = Tr(r, e + "angle"), m = Zr(
    r,
    e + "declutter-mode"
  ), _ = new Pe({
    points: s,
    radius: o,
    radius2: f,
    angle: g,
    declutterMode: m
  });
  return function(p) {
    return a && _.setFill(a(p)), l && _.setStroke(l(p)), h && _.setDisplacement(h(p)), u && _.setRotation(u(p)), d && _.setRotateWithView(d(p)), c && _.setScale(c(p)), _;
  };
}
function pf(r, t) {
  const e = "circle-", i = Fn(r, e, t), n = vn(r, e, t), s = Ot(r, e + "radius", t), o = zr(r, e + "scale", t), a = Ir(
    r,
    e + "displacement",
    t
  ), l = Ot(
    r,
    e + "rotation",
    t
  ), c = Ui(
    r,
    e + "rotate-with-view",
    t
  ), h = Zr(
    r,
    e + "declutter-mode"
  ), u = new Et({
    radius: 5,
    // this is arbitrary, but required - the evaluated radius is used below
    declutterMode: h
  });
  return function(d) {
    return s && u.setRadius(s(d)), i && u.setFill(i(d)), n && u.setStroke(n(d)), a && u.setDisplacement(a(d)), l && u.setRotation(l(d)), c && u.setRotateWithView(c(d)), o && u.setScale(o(d)), u;
  };
}
function Ot(r, t, e) {
  if (!(t in r))
    return;
  const i = Oe(r[t], j, e);
  return function(n) {
    return Ys(i(n), t);
  };
}
function Ee(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(r[t], Lt, e);
  return function(n) {
    return yh(i(n), t);
  };
}
function yf(r, t, e) {
  const i = Ee(
    r,
    t + "pattern-src",
    e
  ), n = Ya(
    r,
    t + "pattern-offset",
    e
  ), s = Ya(
    r,
    t + "pattern-size",
    e
  ), o = Eo(
    r,
    t + "color",
    e
  );
  return function(a) {
    return {
      src: i(a),
      offset: n && n(a),
      size: s && s(a),
      color: o && o(a)
    };
  };
}
function Ui(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(r[t], Mt, e);
  return function(n) {
    const s = i(n);
    if (typeof s != "boolean")
      throw new Error(`Expected a boolean for ${t}`);
    return s;
  };
}
function Eo(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(r[t], ee, e);
  return function(n) {
    return wh(i(n), t);
  };
}
function ph(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(r[t], fi, e);
  return function(n) {
    return Gn(i(n), t);
  };
}
function Ir(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(r[t], fi, e);
  return function(n) {
    const s = Gn(i(n), t);
    if (s.length !== 2)
      throw new Error(`Expected two numbers for ${t}`);
    return s;
  };
}
function Ya(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(r[t], fi, e);
  return function(n) {
    return Eh(i(n), t);
  };
}
function zr(r, t, e) {
  if (!(t in r))
    return null;
  const i = Oe(
    r[t],
    fi | j,
    e
  );
  return function(n) {
    return xf(i(n), t);
  };
}
function Tr(r, t) {
  const e = r[t];
  if (e !== void 0) {
    if (typeof e != "number")
      throw new Error(`Expected a number for ${t}`);
    return e;
  }
}
function wf(r, t) {
  const e = r[t];
  if (e !== void 0) {
    if (typeof e == "number")
      return ie(e);
    if (!Array.isArray(e))
      throw new Error(`Expected a number or size array for ${t}`);
    if (e.length !== 2 || typeof e[0] != "number" || typeof e[1] != "number")
      throw new Error(`Expected a number or size array for ${t}`);
    return e;
  }
}
function Ef(r, t) {
  const e = r[t];
  if (e !== void 0) {
    if (typeof e != "string")
      throw new Error(`Expected a string for ${t}`);
    return e;
  }
}
function Ba(r, t) {
  const e = r[t];
  if (e !== void 0) {
    if (e !== "bottom-left" && e !== "bottom-right" && e !== "top-left" && e !== "top-right")
      throw new Error(
        `Expected bottom-left, bottom-right, top-left, or top-right for ${t}`
      );
    return e;
  }
}
function Xa(r, t) {
  const e = r[t];
  if (e !== void 0) {
    if (e !== "pixels" && e !== "fraction")
      throw new Error(`Expected pixels or fraction for ${t}`);
    return e;
  }
}
function Cf(r, t) {
  const e = r[t];
  if (e !== void 0)
    return Gn(e, t);
}
function Zr(r, t) {
  const e = r[t];
  if (e !== void 0) {
    if (typeof e != "string")
      throw new Error(`Expected a string for ${t}`);
    if (e !== "declutter" && e !== "obstacle" && e !== "none")
      throw new Error(`Expected declutter, obstacle, or none for ${t}`);
    return e;
  }
}
function Sf(r, t) {
  const e = r[t];
  if (e !== void 0)
    return wh(e, t);
}
function Gn(r, t) {
  if (!Array.isArray(r))
    throw new Error(`Expected an array for ${t}`);
  const e = r.length;
  for (let i = 0; i < e; ++i)
    if (typeof r[i] != "number")
      throw new Error(`Expected an array of numbers for ${t}`);
  return r;
}
function yh(r, t) {
  if (typeof r != "string")
    throw new Error(`Expected a string for ${t}`);
  return r;
}
function Ys(r, t) {
  if (typeof r != "number")
    throw new Error(`Expected a number for ${t}`);
  return r;
}
function wh(r, t) {
  if (typeof r == "string")
    return r;
  const e = Gn(r, t), i = e.length;
  if (i < 3 || i > 4)
    throw new Error(`Expected a color with 3 or 4 values for ${t}`);
  return e;
}
function Eh(r, t) {
  const e = Gn(r, t);
  if (e.length !== 2)
    throw new Error(`Expected an array of two numbers for ${t}`);
  return e;
}
function xf(r, t) {
  return typeof r == "number" ? r : Eh(r, t);
}
const Jt = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function za(r, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    function(i, n, s, o, a) {
      if (!i)
        return;
      if (!n && !t)
        return i;
      const l = t ? 0 : s[0] * n, c = t ? 0 : s[1] * n, h = a ? a[0] : 0, u = a ? a[1] : 0;
      let d = r[0] + l / 2 + h, f = r[2] - l / 2 + h, g = r[1] + c / 2 + u, m = r[3] - c / 2 + u;
      d > f && (d = (f + d) / 2, f = d), g > m && (g = (m + g) / 2, m = g);
      let _ = ht(i[0], d, f), p = ht(i[1], g, m);
      if (o && e && n) {
        const y = 30 * n;
        _ += -y * Math.log(1 + Math.max(0, d - i[0]) / y) + y * Math.log(1 + Math.max(0, i[0] - f) / y), p += -y * Math.log(1 + Math.max(0, g - i[1]) / y) + y * Math.log(1 + Math.max(0, i[1] - m) / y);
      }
      return [_, p];
    }
  );
}
function Rf(r) {
  return r;
}
function If(r) {
  return Math.pow(r, 3);
}
function Tf(r) {
  return 1 - If(1 - r);
}
function Pf(r) {
  return 3 * r * r - 2 * r * r * r;
}
function Ch(r, t, e, i) {
  let n = 0;
  const s = r[e - i], o = r[e - i + 1];
  let a = 0, l = 0;
  for (; t < e; t += i) {
    const c = r[t] - s, h = r[t + 1] - o;
    n += l * c - a * h, a = c, l = h;
  }
  return n / 2;
}
function Sh(r, t, e, i) {
  let n = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    n += Ch(r, t, a, i), t = a;
  }
  return n;
}
function Mf(r, t, e, i) {
  let n = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    n += Sh(r, t, a, i), t = a[a.length - 1];
  }
  return n;
}
function Za(r, t, e, i, n, s, o) {
  const a = r[t], l = r[t + 1], c = r[e] - a, h = r[e + 1] - l;
  let u;
  if (c === 0 && h === 0)
    u = t;
  else {
    const d = ((n - a) * c + (s - l) * h) / (c * c + h * h);
    if (d > 1)
      u = e;
    else if (d > 0) {
      for (let f = 0; f < i; ++f)
        o[f] = kt(
          r[t + f],
          r[e + f],
          d
        );
      o.length = i;
      return;
    } else
      u = t;
  }
  for (let d = 0; d < i; ++d)
    o[d] = r[u + d];
  o.length = i;
}
function Co(r, t, e, i, n) {
  let s = r[t], o = r[t + 1];
  for (t += i; t < e; t += i) {
    const a = r[t], l = r[t + 1], c = Ce(s, o, a, l);
    c > n && (n = c), s = a, o = l;
  }
  return n;
}
function So(r, t, e, i, n) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    n = Co(r, t, a, i, n), t = a;
  }
  return n;
}
function Ff(r, t, e, i, n) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    n = So(r, t, a, i, n), t = a[a.length - 1];
  }
  return n;
}
function xo(r, t, e, i, n, s, o, a, l, c, h) {
  if (t == e)
    return c;
  let u, d;
  if (n === 0) {
    if (d = Ce(
      o,
      a,
      r[t],
      r[t + 1]
    ), d < c) {
      for (u = 0; u < i; ++u)
        l[u] = r[t + u];
      return l.length = i, d;
    }
    return c;
  }
  h = h || [NaN, NaN];
  let f = t + i;
  for (; f < e; )
    if (Za(
      r,
      f - i,
      f,
      i,
      o,
      a,
      h
    ), d = Ce(o, a, h[0], h[1]), d < c) {
      for (c = d, u = 0; u < i; ++u)
        l[u] = h[u];
      l.length = i, f += i;
    } else
      f += i * Math.max(
        (Math.sqrt(d) - Math.sqrt(c)) / n | 0,
        1
      );
  if (s && (Za(
    r,
    e - i,
    t,
    i,
    o,
    a,
    h
  ), d = Ce(o, a, h[0], h[1]), d < c)) {
    for (c = d, u = 0; u < i; ++u)
      l[u] = h[u];
    l.length = i;
  }
  return c;
}
function Ro(r, t, e, i, n, s, o, a, l, c, h) {
  h = h || [NaN, NaN];
  for (let u = 0, d = e.length; u < d; ++u) {
    const f = e[u];
    c = xo(
      r,
      t,
      f,
      i,
      n,
      s,
      o,
      a,
      l,
      c,
      h
    ), t = f;
  }
  return c;
}
function vf(r, t, e, i, n, s, o, a, l, c, h) {
  h = h || [NaN, NaN];
  for (let u = 0, d = e.length; u < d; ++u) {
    const f = e[u];
    c = Ro(
      r,
      t,
      f,
      i,
      n,
      s,
      o,
      a,
      l,
      c,
      h
    ), t = f[f.length - 1];
  }
  return c;
}
function xh(r, t, e, i) {
  for (let n = 0, s = e.length; n < s; ++n)
    r[t++] = e[n];
  return t;
}
function Vr(r, t, e, i) {
  for (let n = 0, s = e.length; n < s; ++n) {
    const o = e[n];
    for (let a = 0; a < i; ++a)
      r[t++] = o[a];
  }
  return t;
}
function Un(r, t, e, i, n) {
  n = n || [];
  let s = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = Vr(
      r,
      t,
      e[o],
      i
    );
    n[s++] = l, t = l;
  }
  return n.length = s, n;
}
function Rh(r, t, e, i, n) {
  n = n || [];
  let s = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = Un(
      r,
      t,
      e[o],
      i,
      n[s]
    );
    l.length === 0 && (l[0] = t), n[s++] = l, t = l[l.length - 1];
  }
  return n.length = s, n;
}
class ji extends Le {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @api
   * @override
   */
  clone() {
    return new ji(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    return n < _i(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Co(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), xo(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Ch(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinates of the linear ring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return Be(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LinearRing} Simplified LinearRing.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = Xr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new ji(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "LinearRing";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return !1;
  }
  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Vr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class Gt extends Le {
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.setCoordinates(t, e);
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Gt(this.flatCoordinates.slice(), this.layout);
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    const s = this.flatCoordinates, o = Ce(
      t,
      e,
      s[0],
      s[1]
    );
    if (o < n) {
      const a = this.stride;
      for (let l = 0; l < a; ++l)
        i[l] = s[l];
      return i.length = a, o;
    }
    return n;
  }
  /**
   * Return the coordinate of the point.
   * @return {import("../coordinate.js").Coordinate} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return this.flatCoordinates.slice();
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return Cn(this.flatCoordinates, t);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Point";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return so(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = xh(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Af(r, t, e, i, n) {
  return !zl(
    n,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !si(
        r,
        t,
        e,
        i,
        o[0],
        o[1]
      );
    }
  );
}
function si(r, t, e, i, n, s) {
  let o = 0, a = r[e - i], l = r[e - i + 1];
  for (; t < e; t += i) {
    const c = r[t], h = r[t + 1];
    l <= s ? h > s && (c - a) * (s - l) - (n - a) * (h - l) > 0 && o++ : h <= s && (c - a) * (s - l) - (n - a) * (h - l) < 0 && o--, a = c, l = h;
  }
  return o !== 0;
}
function Io(r, t, e, i, n, s) {
  if (e.length === 0 || !si(r, t, e[0], i, n, s))
    return !1;
  for (let o = 1, a = e.length; o < a; ++o)
    if (si(r, e[o - 1], e[o], i, n, s))
      return !1;
  return !0;
}
function Lf(r, t, e, i, n, s) {
  if (e.length === 0)
    return !1;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    if (Io(r, t, l, i, n, s))
      return !0;
    t = l[l.length - 1];
  }
  return !1;
}
function To(r, t, e, i, n, s, o) {
  let a, l, c, h, u, d, f;
  const g = n[s + 1], m = [];
  for (let y = 0, S = e.length; y < S; ++y) {
    const C = e[y];
    for (h = r[C - i], d = r[C - i + 1], a = t; a < C; a += i)
      u = r[a], f = r[a + 1], (g <= d && f <= g || d <= g && g <= f) && (c = (g - d) / (f - d) * (u - h) + h, m.push(c)), h = u, d = f;
  }
  let _ = NaN, p = -1 / 0;
  for (m.sort(ze), h = m[0], a = 1, l = m.length; a < l; ++a) {
    u = m[a];
    const y = Math.abs(u - h);
    y > p && (c = (h + u) / 2, Io(r, t, e, i, c, g) && (_ = c, p = y)), h = u;
  }
  return isNaN(_) && (_ = n[s]), o ? (o.push(_, g, p), o) : [_, g, p];
}
function Ih(r, t, e, i, n) {
  let s = [];
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    s = To(
      r,
      t,
      l,
      i,
      n,
      2 * o,
      s
    ), t = l[l.length - 1];
  }
  return s;
}
function Th(r, t, e, i, n) {
  let s;
  for (t += i; t < e; t += i)
    if (s = n(
      r.slice(t - i, t),
      r.slice(t, t + i)
    ), s)
      return s;
  return !1;
}
function jr(r, t, e, i, n, s) {
  return s = s ?? Xl(Me(), r, t, e, i), jt(n, s) ? s[0] >= n[0] && s[2] <= n[2] || s[1] >= n[1] && s[3] <= n[3] ? !0 : Th(
    r,
    t,
    e,
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, a) {
      return iu(n, o, a);
    }
  ) : !1;
}
function Of(r, t, e, i, n) {
  for (let s = 0, o = e.length; s < o; ++s) {
    if (jr(r, t, e[s], i, n))
      return !0;
    t = e[s];
  }
  return !1;
}
function Ph(r, t, e, i, n) {
  return !!(jr(r, t, e, i, n) || si(
    r,
    t,
    e,
    i,
    n[0],
    n[1]
  ) || si(
    r,
    t,
    e,
    i,
    n[0],
    n[3]
  ) || si(
    r,
    t,
    e,
    i,
    n[2],
    n[1]
  ) || si(
    r,
    t,
    e,
    i,
    n[2],
    n[3]
  ));
}
function Mh(r, t, e, i, n) {
  if (!Ph(r, t, e[0], i, n))
    return !1;
  if (e.length === 1)
    return !0;
  for (let s = 1, o = e.length; s < o; ++s)
    if (Af(
      r,
      e[s - 1],
      e[s],
      i,
      n
    ) && !jr(
      r,
      e[s - 1],
      e[s],
      i,
      n
    ))
      return !1;
  return !0;
}
function bf(r, t, e, i, n) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    if (Mh(r, t, a, i, n))
      return !0;
    t = a[a.length - 1];
  }
  return !1;
}
function Nf(r, t, e, i) {
  for (; t < e - i; ) {
    for (let n = 0; n < i; ++n) {
      const s = r[t + n];
      r[t + n] = r[e - i + n], r[e - i + n] = s;
    }
    t += i, e -= i;
  }
}
function Po(r, t, e, i) {
  let n = 0, s = r[e - i], o = r[e - i + 1];
  for (; t < e; t += i) {
    const a = r[t], l = r[t + 1];
    n += (a - s) * (l + o), s = a, o = l;
  }
  return n === 0 ? void 0 : n > 0;
}
function Mo(r, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s], l = Po(
      r,
      t,
      a,
      i
    );
    if (s === 0) {
      if (n && l || !n && !l)
        return !1;
    } else if (n && !l || !n && l)
      return !1;
    t = a;
  }
  return !0;
}
function Fh(r, t, e, i, n) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    if (!Mo(r, t, a, i, n))
      return !1;
    a.length && (t = a[a.length - 1]);
  }
  return !0;
}
function Pr(r, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s], l = Po(
      r,
      t,
      a,
      i
    );
    (s === 0 ? n && l || !n && !l : n && !l || !n && l) && Nf(r, t, a, i), t = a;
  }
  return t;
}
function Bs(r, t, e, i, n) {
  for (let s = 0, o = e.length; s < o; ++s)
    t = Pr(
      r,
      t,
      e[s],
      i,
      n
    );
  return t;
}
function kf(r, t) {
  const e = [];
  let i = 0, n = 0, s;
  for (let o = 0, a = t.length; o < a; ++o) {
    const l = t[o], c = Po(r, i, l, 2);
    if (s === void 0 && (s = c), c === s)
      e.push(t.slice(n, o + 1));
    else {
      if (e.length === 0)
        continue;
      e[e.length - 1].push(t[n]);
    }
    n = o + 1, i = l;
  }
  return e;
}
class qt extends Le {
  /**
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
   *     Array of linear rings that define the polygon. The first linear ring of the
   *     array defines the outer-boundary or surface of the polygon. Each subsequent
   *     linear ring defines a hole in the surface of the polygon. A linear ring is
   *     an array of vertices' coordinates where the first coordinate and the last are
   *     equivalent. (For internal use, flat coordinates in combination with
   *     `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Ends (for internal use with flat coordinates).
   */
  constructor(t, e, i) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && i ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = i) : this.setCoordinates(
      /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
      t,
      e
    );
  }
  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  appendLinearRing(t) {
    this.flatCoordinates ? It(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new qt(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    return n < _i(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      So(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Ro(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return Io(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      e
    );
  }
  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Sh(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates(t) {
    let e;
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), Pr(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, Mn(e, 0, this.ends_, this.stride);
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * @return {Array<number>} Interior point.
   */
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const t = Fe(this.getExtent());
      this.flatInteriorPoint_ = To(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        t,
        0
      ), this.flatInteriorPointRevision_ = this.getRevision();
    }
    return (
      /** @type {import("../coordinate.js").Coordinate} */
      this.flatInteriorPoint_
    );
  }
  /**
   * Return an interior point of the polygon.
   * @return {Point} Interior point as XYM coordinate, where M is the
   * length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoint() {
    return new Gt(this.getFlatInteriorPoint(), "XYM");
  }
  /**
   * Return the number of rings of the polygon,  this includes the exterior
   * ring and any interior rings.
   *
   * @return {number} Number of rings.
   * @api
   */
  getLinearRingCount() {
    return this.ends_.length;
  }
  /**
   * Return the Nth linear ring of the polygon geometry. Return `null` if the
   * given index is out of range.
   * The exterior linear ring is available at index `0` and the interior rings
   * at index `1` and beyond.
   *
   * @param {number} index Index.
   * @return {LinearRing|null} Linear ring.
   * @api
   */
  getLinearRing(t) {
    return t < 0 || this.ends_.length <= t ? null : new ji(
      this.flatCoordinates.slice(
        t === 0 ? 0 : this.ends_[t - 1],
        this.ends_[t]
      ),
      this.layout
    );
  }
  /**
   * Return the linear rings of the polygon.
   * @return {Array<LinearRing>} Linear rings.
   * @api
   */
  getLinearRings() {
    const t = this.layout, e = this.flatCoordinates, i = this.ends_, n = [];
    let s = 0;
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o], c = new ji(
        e.slice(s, l),
        t
      );
      n.push(c), s = l;
    }
    return n;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      Mo(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = Pr(
        this.orientedFlatCoordinates_,
        0,
        this.ends_,
        this.stride
      )), this.orientedRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.orientedFlatCoordinates_
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Polygon} Simplified Polygon.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], i = [];
    return e.length = mo(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      i
    ), new qt(e, "XY", i);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Polygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return Mh(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the polygon.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const i = Un(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
function Va(r) {
  if (lo(r))
    throw new Error("Cannot create polygon from empty extent");
  const t = r[0], e = r[1], i = r[2], n = r[3], s = [
    t,
    e,
    t,
    n,
    i,
    n,
    i,
    e,
    t,
    e
  ];
  return new qt(s, "XY", [s.length]);
}
function Fo(r, t, e, i) {
  const n = St(t) / e[0], s = de(t) / e[1];
  return i ? Math.min(r, Math.max(n, s)) : Math.min(r, Math.min(n, s));
}
function vo(r, t, e) {
  let i = Math.min(r, t);
  const n = 50;
  return i *= Math.log(1 + n * Math.max(0, r / t - 1)) / n + 1, e && (i = Math.max(i, e), i /= Math.log(1 + n * Math.max(0, e / r - 1)) / n + 1), ht(i, e / 2, t * 2);
}
function Df(r, t, e, i) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(n, s, o, a) {
    if (n !== void 0) {
      const l = r[0], c = r[r.length - 1], h = e ? Fo(
        l,
        e,
        o,
        i
      ) : l;
      if (a)
        return t ? vo(
          n,
          h,
          c
        ) : ht(n, c, h);
      const u = Math.min(h, n), d = Math.floor(io(r, u, s));
      return r[d] > h && d < r.length - 1 ? r[d + 1] : r[d];
    }
  };
}
function Gf(r, t, e, i, n, s) {
  return i = i !== void 0 ? i : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(o, a, l, c) {
    if (o !== void 0) {
      const h = n ? Fo(
        t,
        n,
        l,
        s
      ) : t;
      if (c)
        return i ? vo(
          o,
          h,
          e
        ) : ht(o, e, h);
      const u = 1e-9, d = Math.ceil(
        Math.log(t / h) / Math.log(r) - u
      ), f = -a * (0.5 - u) + 0.5, g = Math.min(h, o), m = Math.floor(
        Math.log(t / g) / Math.log(r) + f
      ), _ = Math.max(d, m), p = t / Math.pow(r, _);
      return ht(p, e, h);
    }
  };
}
function ja(r, t, e, i, n) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(s, o, a, l) {
    if (s !== void 0) {
      const c = i ? Fo(
        r,
        i,
        a,
        n
      ) : r;
      return !e || !l ? ht(s, t, c) : vo(
        s,
        c,
        t
      );
    }
  };
}
function Uf(r) {
  if (r !== void 0)
    return 0;
}
function $a(r) {
  if (r !== void 0)
    return r;
}
function Wf(r) {
  const t = 2 * Math.PI / r;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, i) {
      if (i)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    }
  );
}
function Yf(r) {
  const t = wn(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, i) {
      return i || e === void 0 ? e : Math.abs(e) <= t ? 0 : e;
    }
  );
}
const Bf = 42, Ao = 256, ws = 0;
class Ka extends Ae {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = fo(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && bu(), t.center && (t.center = lt(t.center, this.projection_)), t.extent && (t.extent = ii(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const a in Jt)
      delete e[a];
    this.setProperties(e, !0);
    const i = zf(t);
    this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom;
    const n = Xf(t), s = i.constraint, o = Zf(t);
    this.constraints_ = {
      center: n,
      resolution: s,
      rotation: o
    }, this.setRotation(t.rotation !== void 0 ? t.rotation : 0), this.setCenterInternal(
      t.center !== void 0 ? t.center : null
    ), t.resolution !== void 0 ? this.setResolution(t.resolution) : t.zoom !== void 0 && this.setZoom(t.zoom);
  }
  /**
   * Padding (in css pixels).
   * If the map viewport is partially covered with other content (overlays) along
   * its edges, this setting allows to shift the center of the viewport away from that
   * content. The order of the values in the array is top, right, bottom, left.
   * The default is no padding, which is equivalent to `[0, 0, 0, 0]`.
   * @type {Array<number>|undefined}
   * @api
   */
  get padding() {
    return this.padding_;
  }
  set padding(t) {
    let e = this.padding_;
    this.padding_ = t;
    const i = this.getCenterInternal();
    if (i) {
      const n = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const s = this.getResolution(), o = s / 2 * (n[3] - e[3] + e[1] - n[1]), a = s / 2 * (n[0] - e[0] + e[2] - n[2]);
      this.setCenterInternal([i[0] + o, i[1] - a]);
    }
  }
  /**
   * Get an updated version of the view options used to construct the view.  The
   * current resolution (or zoom), center, and rotation are applied to any stored
   * options.  The provided options can be used to apply new min/max zoom or
   * resolution limits.
   * @param {ViewOptions} newOptions New options to be applied.
   * @return {ViewOptions} New options updated with the current view state.
   */
  getUpdatedOptions_(t) {
    const e = this.getProperties();
    return e.resolution !== void 0 ? e.resolution = this.getResolution() : e.zoom = this.getZoom(), e.center = this.getCenterInternal(), e.rotation = this.getRotation(), Object.assign({}, e, t);
  }
  /**
   * Animate the view.  The view's center, zoom (or resolution), and rotation
   * can be animated for smooth transitions between view states.  For example,
   * to animate the view to a new zoom level:
   *
   *     view.animate({zoom: view.getZoom() + 1});
   *
   * By default, the animation lasts one second and uses in-and-out easing.  You
   * can customize this behavior by including `duration` (in milliseconds) and
   * `easing` options (see {@link module:ol/easing}).
   *
   * To chain together multiple animations, call the method with multiple
   * animation objects.  For example, to first zoom and then pan:
   *
   *     view.animate({zoom: 10}, {center: [0, 0]});
   *
   * If you provide a function as the last argument to the animate method, it
   * will get called at the end of an animation series.  The callback will be
   * called with `true` if the animation series completed on its own or `false`
   * if it was cancelled.
   *
   * Animations are cancelled by user interactions (e.g. dragging the map) or by
   * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
   * (or another method that calls one of these).
   *
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation
   *     options.  Multiple animations can be run in series by passing multiple
   *     options objects.  To run multiple animations in parallel, call the method
   *     multiple times.  An optional callback can be provided as a final
   *     argument.  The callback will be called with a boolean indicating whether
   *     the animation completed without being cancelled.
   * @api
   */
  animate(t) {
    this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
    const e = new Array(arguments.length);
    for (let i = 0; i < e.length; ++i) {
      let n = arguments[i];
      n.center && (n = Object.assign({}, n), n.center = lt(
        n.center,
        this.getProjection()
      )), n.anchor && (n = Object.assign({}, n), n.anchor = lt(
        n.anchor,
        this.getProjection()
      )), e[i] = n;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, i;
    e > 1 && typeof arguments[e - 1] == "function" && (i = arguments[e - 1], --e);
    let n = 0;
    for (; n < e && !this.isDef(); ++n) {
      const h = arguments[n];
      h.center && this.setCenterInternal(h.center), h.zoom !== void 0 ? this.setZoom(h.zoom) : h.resolution && this.setResolution(h.resolution), h.rotation !== void 0 && this.setRotation(h.rotation);
    }
    if (n === e) {
      i && Qn(i, !0);
      return;
    }
    let s = Date.now(), o = this.targetCenter_.slice(), a = this.targetResolution_, l = this.targetRotation_;
    const c = [];
    for (; n < e; ++n) {
      const h = (
        /** @type {AnimationOptions} */
        arguments[n]
      ), u = {
        start: s,
        complete: !1,
        anchor: h.anchor,
        duration: h.duration !== void 0 ? h.duration : 1e3,
        easing: h.easing || Pf,
        callback: i
      };
      if (h.center && (u.sourceCenter = o, u.targetCenter = h.center.slice(), o = u.targetCenter), h.zoom !== void 0 ? (u.sourceResolution = a, u.targetResolution = this.getResolutionForZoom(h.zoom), a = u.targetResolution) : h.resolution && (u.sourceResolution = a, u.targetResolution = h.resolution, a = u.targetResolution), h.rotation !== void 0) {
        u.sourceRotation = l;
        const d = ha(h.rotation - l + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = l + d, l = u.targetRotation;
      }
      Vf(u) ? u.complete = !0 : s += u.duration, c.push(u);
    }
    this.animations_.push(c), this.setHint(Vt.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[Vt.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[Vt.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(Vt.ANIMATING, -this.hints_[Vt.ANIMATING]);
    let t;
    for (let e = 0, i = this.animations_.length; e < i; ++e) {
      const n = this.animations_[e];
      if (n[0].callback && Qn(n[0].callback, !1), !t)
        for (let s = 0, o = n.length; s < o; ++s) {
          const a = n[s];
          if (!a.complete) {
            t = a.anchor;
            break;
          }
        }
    }
    this.animations_.length = 0, this.cancelAnchor_ = t, this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
  }
  /**
   * Update all animations.
   */
  updateAnimations_() {
    if (this.updateAnimationKey_ !== void 0 && (cancelAnimationFrame(this.updateAnimationKey_), this.updateAnimationKey_ = void 0), !this.getAnimating())
      return;
    const t = Date.now();
    let e = !1;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const n = this.animations_[i];
      let s = !0;
      for (let o = 0, a = n.length; o < a; ++o) {
        const l = n[o];
        if (l.complete)
          continue;
        const c = t - l.start;
        let h = l.duration > 0 ? c / l.duration : 1;
        h >= 1 ? (l.complete = !0, h = 1) : s = !1;
        const u = l.easing(h);
        if (l.sourceCenter) {
          const d = l.sourceCenter[0], f = l.sourceCenter[1], g = l.targetCenter[0], m = l.targetCenter[1];
          this.nextCenter_ = l.targetCenter;
          const _ = d + u * (g - d), p = f + u * (m - f);
          this.targetCenter_ = [_, p];
        }
        if (l.sourceResolution && l.targetResolution) {
          const d = u === 1 ? l.targetResolution : l.sourceResolution + u * (l.targetResolution - l.sourceResolution);
          if (l.anchor) {
            const f = this.getViewportSize_(this.getRotation()), g = this.constraints_.resolution(
              d,
              0,
              f,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              g,
              l.anchor
            );
          }
          this.nextResolution_ = l.targetResolution, this.targetResolution_ = d, this.applyTargetState_(!0);
        }
        if (l.sourceRotation !== void 0 && l.targetRotation !== void 0) {
          const d = u === 1 ? ha(l.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : l.sourceRotation + u * (l.targetRotation - l.sourceRotation);
          if (l.anchor) {
            const f = this.constraints_.rotation(
              d,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              f,
              l.anchor
            );
          }
          this.nextRotation_ = l.targetRotation, this.targetRotation_ = d;
        }
        if (this.applyTargetState_(!0), e = !0, !l.complete)
          break;
      }
      if (s) {
        this.animations_[i] = null, this.setHint(Vt.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = n[0].callback;
        o && Qn(o, !0);
      }
    }
    this.animations_ = this.animations_.filter(Boolean), e && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(
      this.updateAnimations_.bind(this)
    ));
  }
  /**
   * @param {number} rotation Target rotation.
   * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
   */
  calculateCenterRotate(t, e) {
    let i;
    const n = this.getCenterInternal();
    return n !== void 0 && (i = [n[0] - e[0], n[1] - e[1]], au(i, t - this.getRotation()), ou(i, e)), i;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let i;
    const n = this.getCenterInternal(), s = this.getResolution();
    if (n !== void 0 && s !== void 0) {
      const o = e[0] - t * (e[0] - n[0]) / s, a = e[1] - t * (e[1] - n[1]) / s;
      i = [o, a];
    }
    return i;
  }
  /**
   * Returns the current viewport size.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size or `[100, 100]` when no viewport is found.
   */
  getViewportSize_(t) {
    const e = this.viewportSize_;
    if (t) {
      const i = e[0], n = e[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(n * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(n * Math.cos(t))
      ];
    }
    return e;
  }
  /**
   * Stores the viewport size on the view. The viewport size is not read every time from the DOM
   * to avoid performance hit and layout reflow.
   * This should be done on map size change.
   * Note: the constraints are not resolved during an animation to avoid stopping it
   * @param {import("./size.js").Size} [size] Viewport size; if undefined, [100, 100] is assumed
   */
  setViewportSize(t) {
    this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100], this.getAnimating() || this.resolveConstraints(0);
  }
  /**
   * Get the view center.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   * @observable
   * @api
   */
  getCenter() {
    const t = this.getCenterInternal();
    return t && Vi(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Jt.CENTER)
    );
  }
  /**
   * @return {Constraints} Constraints.
   */
  getConstraints() {
    return this.constraints_;
  }
  /**
   * @return {boolean} Resolution constraint is set
   */
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  /**
   * @param {Array<number>} [hints] Destination array.
   * @return {Array<number>} Hint.
   */
  getHints(t) {
    return t !== void 0 ? (t[0] = this.hints_[0], t[1] = this.hints_[1], t) : this.hints_.slice();
  }
  /**
   * Calculate the extent for the current view state and the passed box size.
   * @param {import("./size.js").Size} [size] The pixel dimensions of the box
   * into which the calculated extent should fit. Defaults to the size of the
   * map the view is associated with.
   * If no map or multiple maps are connected to the view, provide the desired
   * box size (e.g. `map.getSize()`).
   * @return {import("./extent.js").Extent} Extent.
   * @api
   */
  calculateExtent(t) {
    const e = this.calculateExtentInternal(t);
    return Br(e, this.getProjection());
  }
  /**
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided,
   * the map's last known viewport size will be used.
   * @return {import("./extent.js").Extent} Extent.
   */
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const e = (
      /** @type {!import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    at(e, "The view center is not defined");
    const i = (
      /** @type {!number} */
      this.getResolution()
    );
    at(i !== void 0, "The view resolution is not defined");
    const n = (
      /** @type {!number} */
      this.getRotation()
    );
    return at(n !== void 0, "The view rotation is not defined"), Qc(e, i, n, t);
  }
  /**
   * Get the maximum resolution of the view.
   * @return {number} The maximum resolution of the view.
   * @api
   */
  getMaxResolution() {
    return this.maxResolution_;
  }
  /**
   * Get the minimum resolution of the view.
   * @return {number} The minimum resolution of the view.
   * @api
   */
  getMinResolution() {
    return this.minResolution_;
  }
  /**
   * Get the maximum zoom level for the view.
   * @return {number} The maximum zoom level.
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.minResolution_)
    );
  }
  /**
   * Set a new maximum zoom level for the view.
   * @param {number} zoom The maximum zoom level.
   * @api
   */
  setMaxZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: t }));
  }
  /**
   * Get the minimum zoom level for the view.
   * @return {number} The minimum zoom level.
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.maxResolution_)
    );
  }
  /**
   * Set a new minimum zoom level for the view.
   * @param {number} zoom The minimum zoom level.
   * @api
   */
  setMinZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: t }));
  }
  /**
   * Set whether the view should allow intermediary zoom levels.
   * @param {boolean} enabled Whether the resolution is constrained.
   * @api
   */
  setConstrainResolution(t) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: t }));
  }
  /**
   * Get the view projection.
   * @return {import("./proj/Projection.js").default} The projection of the view.
   * @api
   */
  getProjection() {
    return this.projection_;
  }
  /**
   * Get the view resolution.
   * @return {number|undefined} The resolution of the view.
   * @observable
   * @api
   */
  getResolution() {
    return (
      /** @type {number|undefined} */
      this.get(Jt.RESOLUTION)
    );
  }
  /**
   * Get the resolutions for the view. This returns the array of resolutions
   * passed to the constructor of the View, or undefined if none were given.
   * @return {Array<number>|undefined} The resolutions of the view.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   * @api
   */
  getResolutionForExtent(t, e) {
    return this.getResolutionForExtentInternal(
      ii(t, this.getProjection()),
      e
    );
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   */
  getResolutionForExtentInternal(t, e) {
    e = e || this.getViewportSizeMinusPadding_();
    const i = St(t) / e[0], n = de(t) / e[1];
    return Math.max(i, n);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_), i = this.minResolution_, n = Math.log(e / i) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      function(s) {
        return e / Math.pow(t, s * n);
      }
    );
  }
  /**
   * Get the view rotation.
   * @return {number} The rotation of the view in radians.
   * @observable
   * @api
   */
  getRotation() {
    return (
      /** @type {number} */
      this.get(Jt.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), i = this.getConstrainedResolution(this.maxResolution_), n = this.minResolution_, s = Math.log(i / n) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      function(o) {
        return Math.log(i / o) / e / s;
      }
    );
  }
  /**
   * Returns the size of the viewport minus padding.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size reduced by the padding.
   */
  getViewportSizeMinusPadding_(t) {
    let e = this.getViewportSize_(t);
    const i = this.padding_;
    return i && (e = [
      e[0] - i[1] - i[3],
      e[1] - i[0] - i[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), i = this.getRotation();
    let n = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const s = this.padding_;
    if (s) {
      const o = this.getViewportSizeMinusPadding_();
      n = Es(
        n,
        this.getViewportSize_(),
        [o[0] / 2 + s[3], o[1] / 2 + s[0]],
        e,
        i
      );
    }
    return {
      center: n.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: i,
      zoom: this.getZoom()
    };
  }
  /**
   * @return {ViewStateLayerStateExtent} Like `FrameState`, but just `viewState` and `extent`.
   */
  getViewStateAndExtent() {
    return {
      viewState: this.getState(),
      extent: this.calculateExtent()
    };
  }
  /**
   * Get the current zoom level. This method may return non-integer zoom levels
   * if the view does not constrain the resolution, or if an interaction or
   * animation is underway.
   * @return {number|undefined} Zoom.
   * @api
   */
  getZoom() {
    let t;
    const e = this.getResolution();
    return e !== void 0 && (t = this.getZoomForResolution(e)), t;
  }
  /**
   * Get the zoom level for a resolution.
   * @param {number} resolution The resolution.
   * @return {number|undefined} The zoom level for the provided resolution.
   * @api
   */
  getZoomForResolution(t) {
    let e = this.minZoom_ || 0, i, n;
    if (this.resolutions_) {
      const s = io(this.resolutions_, t, 1);
      e = s, i = this.resolutions_[s], s == this.resolutions_.length - 1 ? n = 2 : n = i / this.resolutions_[s + 1];
    } else
      i = this.maxResolution_, n = this.zoomFactor_;
    return e + Math.log(i / t) / Math.log(n);
  }
  /**
   * Get the resolution for a zoom level.
   * @param {number} zoom Zoom level.
   * @return {number} The view resolution for the provided zoom level.
   * @api
   */
  getResolutionForZoom(t) {
    var e;
    if ((e = this.resolutions_) != null && e.length) {
      if (this.resolutions_.length === 1)
        return this.resolutions_[0];
      const i = ht(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), n = this.resolutions_[i] / this.resolutions_[i + 1];
      return this.resolutions_[i] / Math.pow(n, ht(t - i, 0, 1));
    }
    return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
  }
  /**
   * Fit the given geometry or extent based on the given map size and border.
   * The size is pixel dimensions of the box to fit the extent into.
   * In most cases you will want to use the map size, that is `map.getSize()`.
   * Takes care of the map angle.
   * @param {import("./geom/SimpleGeometry.js").default|import("./extent.js").Extent} geometryOrExtent The geometry or
   *     extent to fit the view to.
   * @param {FitOptions} [options] Options.
   * @api
   */
  fit(t, e) {
    let i;
    if (at(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      at(
        !lo(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const n = ii(t, this.getProjection());
      i = Va(n);
    } else if (t.getType() === "Circle") {
      const n = ii(
        t.getExtent(),
        this.getProjection()
      );
      i = Va(n), i.rotate(this.getRotation(), Fe(n));
    } else
      i = t;
    this.fitInternal(i, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), i = Math.cos(e), n = Math.sin(-e), s = t.getFlatCoordinates(), o = t.getStride();
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let u = 0, d = s.length; u < d; u += o) {
      const f = s[u] * i - s[u + 1] * n, g = s[u] * n + s[u + 1] * i;
      a = Math.min(a, f), l = Math.min(l, g), c = Math.max(c, f), h = Math.max(h, g);
    }
    return [a, l, c, h];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let i = e.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const n = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], s = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
    const a = this.rotatedExtentForGeometry(t);
    let l = this.getResolutionForExtentInternal(a, [
      i[0] - n[1] - n[3],
      i[1] - n[0] - n[2]
    ]);
    l = isNaN(l) ? o : Math.max(l, o), l = this.getConstrainedResolution(l, s ? 0 : 1);
    const c = this.getRotation(), h = Math.sin(c), u = Math.cos(c), d = Fe(a);
    d[0] += (n[1] - n[3]) / 2 * l, d[1] += (n[0] - n[2]) / 2 * l;
    const f = d[0] * u - d[1] * h, g = d[1] * u + d[0] * h, m = this.getConstrainedCenter([f, g], l), _ = e.callback ? e.callback : pr;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: l,
        center: m,
        duration: e.duration,
        easing: e.easing
      },
      _
    ) : (this.targetResolution_ = l, this.targetCenter_ = m, this.applyTargetState_(!1, !0), Qn(_, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, i) {
    this.centerOnInternal(
      lt(t, this.getProjection()),
      e,
      i
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, i) {
    this.setCenterInternal(
      Es(
        t,
        e,
        i,
        this.getResolution(),
        this.getRotation()
      )
    );
  }
  /**
   * Calculates the shift between map and viewport center.
   * @param {import("./coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {import("./size.js").Size} size Size.
   * @return {Array<number>|undefined} Center shift.
   */
  calculateCenterShift(t, e, i, n) {
    let s;
    const o = this.padding_;
    if (o && t) {
      const a = this.getViewportSizeMinusPadding_(-i), l = Es(
        t,
        n,
        [a[0] / 2 + o[3], a[1] / 2 + o[0]],
        e,
        i
      );
      s = [
        t[0] - l[0],
        t[1] - l[1]
      ];
    }
    return s;
  }
  /**
   * @return {boolean} Is defined.
   */
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   * @api
   */
  adjustCenter(t) {
    const e = Vi(this.targetCenter_, this.getProjection());
    this.setCenter([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   */
  adjustCenterInternal(t) {
    const e = this.targetCenter_;
    this.setCenterInternal([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustResolution(t, e) {
    e = e && lt(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), n = this.getViewportSize_(this.getRotation()), s = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      n,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(s, e)), this.targetResolution_ *= t, this.applyTargetState_();
  }
  /**
   * Adds a value to the view zoom level, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom level.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustZoom(t, e) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, e) {
    e && (e = lt(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), n = this.constraints_.rotation(
      this.targetRotation_ + t,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(n, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && lt(t, this.getProjection())
    );
  }
  /**
   * Set the center using the view projection (not the user projection).
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   */
  setCenterInternal(t) {
    this.targetCenter_ = t, this.applyTargetState_();
  }
  /**
   * @param {import("./ViewHint.js").default} hint Hint.
   * @param {number} delta Delta.
   * @return {number} New value.
   */
  setHint(t, e) {
    return this.hints_[t] += e, this.changed(), this.hints_[t];
  }
  /**
   * Set the resolution for this view. Any resolution constraint will apply.
   * @param {number|undefined} resolution The resolution of the view.
   * @observable
   * @api
   */
  setResolution(t) {
    this.targetResolution_ = t, this.applyTargetState_();
  }
  /**
   * Set the rotation for this view. Any rotation constraint will apply.
   * @param {number} rotation The rotation of the view in radians.
   * @observable
   * @api
   */
  setRotation(t) {
    this.targetRotation_ = t, this.applyTargetState_();
  }
  /**
   * Zoom to a specific zoom level. Any resolution constrain will apply.
   * @param {number} zoom Zoom level.
   * @api
   */
  setZoom(t) {
    this.setResolution(this.getResolutionForZoom(t));
  }
  /**
   * Recompute rotation/resolution/center based on target values.
   * Note: we have to compute rotation first, then resolution and center considering that
   * parameters can influence one another in case a view extent constraint is present.
   * @param {boolean} [doNotCancelAnims] Do not cancel animations.
   * @param {boolean} [forceMoving] Apply constraints as if the view is moving.
   * @private
   */
  applyTargetState_(t, e) {
    const i = this.getAnimating() || this.getInteracting() || e, n = this.constraints_.rotation(
      this.targetRotation_,
      i
    ), s = this.getViewportSize_(n), o = this.constraints_.resolution(
      this.targetResolution_,
      0,
      s,
      i
    ), a = this.constraints_.center(
      this.targetCenter_,
      o,
      s,
      i,
      this.calculateCenterShift(
        this.targetCenter_,
        o,
        n,
        s
      )
    );
    this.get(Jt.ROTATION) !== n && this.set(Jt.ROTATION, n), this.get(Jt.RESOLUTION) !== o && (this.set(Jt.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!a || !this.get(Jt.CENTER) || !Pt(this.get(Jt.CENTER), a)) && this.set(Jt.CENTER, a), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
  }
  /**
   * If any constraints need to be applied, an animation will be triggered.
   * This is typically done on interaction end.
   * Note: calling this with a duration of 0 will apply the constrained values straight away,
   * without animation.
   * @param {number} [duration] The animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  resolveConstraints(t, e, i) {
    t = t !== void 0 ? t : 200;
    const n = e || 0, s = this.constraints_.rotation(this.targetRotation_), o = this.getViewportSize_(s), a = this.constraints_.resolution(
      this.targetResolution_,
      n,
      o
    ), l = this.constraints_.center(
      this.targetCenter_,
      a,
      o,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        a,
        s,
        o
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = a, this.targetRotation_ = s, this.targetCenter_ = l, this.applyTargetState_();
      return;
    }
    i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== a || this.getRotation() !== s || !this.getCenterInternal() || !Pt(this.getCenterInternal(), l)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: s,
      center: l,
      resolution: a,
      duration: t,
      easing: Tf,
      anchor: i
    }));
  }
  /**
   * Notify the View that an interaction has started.
   * The view state will be resolved to a stable one if needed
   * (depending on its constraints).
   * @api
   */
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(Vt.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, i) {
    i = i && lt(i, this.getProjection()), this.endInteractionInternal(t, e, i);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, i) {
    this.getInteracting() && (this.setHint(Vt.INTERACTING, -1), this.resolveConstraints(t, e, i));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(
      t,
      e || this.getResolution(),
      i
    );
  }
  /**
   * Get a valid zoom level according to the current view constraints.
   * @param {number|undefined} targetZoom Target zoom.
   * @param {number} [direction] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid zoom level.
   */
  getConstrainedZoom(t, e) {
    const i = this.getResolutionForZoom(t);
    return this.getZoomForResolution(
      this.getConstrainedResolution(i, e)
    );
  }
  /**
   * Get a valid resolution according to the current view constraints.
   * @param {number|undefined} targetResolution Target resolution.
   * @param {number} [direction] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid resolution.
   */
  getConstrainedResolution(t, e) {
    e = e || 0;
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(t, e, i);
  }
}
function Qn(r, t) {
  setTimeout(function() {
    r(t);
  }, 0);
}
function Xf(r) {
  if (r.extent !== void 0) {
    const e = r.smoothExtentConstraint !== void 0 ? r.smoothExtentConstraint : !0;
    return za(r.extent, r.constrainOnlyCenter, e);
  }
  const t = fo(r.projection, "EPSG:3857");
  if (r.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, za(e, !1, !1);
  }
  return Rf;
}
function zf(r) {
  let t, e, i, o = r.minZoom !== void 0 ? r.minZoom : ws, a = r.maxZoom !== void 0 ? r.maxZoom : 28;
  const l = r.zoomFactor !== void 0 ? r.zoomFactor : 2, c = r.multiWorld !== void 0 ? r.multiWorld : !1, h = r.smoothResolutionConstraint !== void 0 ? r.smoothResolutionConstraint : !0, u = r.showFullExtent !== void 0 ? r.showFullExtent : !1, d = fo(r.projection, "EPSG:3857"), f = d.getExtent();
  let g = r.constrainOnlyCenter, m = r.extent;
  if (!c && !m && d.isGlobal() && (g = !1, m = f), r.resolutions !== void 0) {
    const _ = r.resolutions;
    e = _[o], i = _[a] !== void 0 ? _[a] : _[_.length - 1], r.constrainResolution ? t = Df(
      _,
      h,
      !g && m,
      u
    ) : t = ja(
      e,
      i,
      h,
      !g && m,
      u
    );
  } else {
    const p = (f ? Math.max(St(f), de(f)) : (
      // use an extent that can fit the whole world if need be
      360 * ql.degrees / d.getMetersPerUnit()
    )) / Ao / Math.pow(2, ws), y = p / Math.pow(2, 28 - ws);
    e = r.maxResolution, e !== void 0 ? o = 0 : e = p / Math.pow(l, o), i = r.minResolution, i === void 0 && (r.maxZoom !== void 0 ? r.maxResolution !== void 0 ? i = e / Math.pow(l, a) : i = p / Math.pow(l, a) : i = y), a = o + Math.floor(
      Math.log(e / i) / Math.log(l)
    ), i = e / Math.pow(l, a - o), r.constrainResolution ? t = Gf(
      l,
      e,
      i,
      h,
      !g && m,
      u
    ) : t = ja(
      e,
      i,
      h,
      !g && m,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: i,
    minZoom: o,
    zoomFactor: l
  };
}
function Zf(r) {
  if (r.enableRotation !== void 0 ? r.enableRotation : !0) {
    const e = r.constrainRotation;
    return e === void 0 || e === !0 ? Yf() : e === !1 ? $a : typeof e == "number" ? Wf(e) : $a;
  }
  return Uf;
}
function Vf(r) {
  return !(r.sourceCenter && r.targetCenter && !Pt(r.sourceCenter, r.targetCenter) || r.sourceResolution !== r.targetResolution || r.sourceRotation !== r.targetRotation);
}
function Es(r, t, e, i, n) {
  const s = Math.cos(-n);
  let o = Math.sin(-n), a = r[0] * s - r[1] * o, l = r[1] * s + r[0] * o;
  a += (t[0] / 2 - e[0]) * i, l += (e[1] - t[1] / 2) * i, o = -o;
  const c = a * s - l * o, h = l * s + a * o;
  return [c, h];
}
const st = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map"
};
class jf extends Ae {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[st.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, at(
      typeof e[st.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[st.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[st.Z_INDEX] = t.zIndex, e[st.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[st.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[st.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[st.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
  }
  /**
   * Get the background for this layer.
   * @return {BackgroundColor|false} Layer background.
   */
  getBackground() {
    return this.background_;
  }
  /**
   * @return {string} CSS class name.
   */
  getClassName() {
    return this.className_;
  }
  /**
   * This method is not meant to be called by layers or layer renderers because the state
   * is incorrect if the layer is included in a layer group.
   *
   * @param {boolean} [managed] Layer is managed.
   * @return {import("./Layer.js").State} Layer state.
   */
  getLayerState(t) {
    const e = this.state_ || /** @type {?} */
    {
      layer: this,
      managed: t === void 0 ? !0 : t
    }, i = this.getZIndex();
    return e.opacity = ht(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return b();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return b();
  }
  /**
   * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
   * will be visible regardless of extent.
   * @return {import("../extent.js").Extent|undefined} The layer extent.
   * @observable
   * @api
   */
  getExtent() {
    return (
      /** @type {import("../extent.js").Extent|undefined} */
      this.get(st.EXTENT)
    );
  }
  /**
   * Return the maximum resolution of the layer. Returns Infinity if
   * the layer has no maximum resolution set.
   * @return {number} The maximum resolution of the layer.
   * @observable
   * @api
   */
  getMaxResolution() {
    return (
      /** @type {number} */
      this.get(st.MAX_RESOLUTION)
    );
  }
  /**
   * Return the minimum resolution of the layer. Returns 0 if
   * the layer has no minimum resolution set.
   * @return {number} The minimum resolution of the layer.
   * @observable
   * @api
   */
  getMinResolution() {
    return (
      /** @type {number} */
      this.get(st.MIN_RESOLUTION)
    );
  }
  /**
   * Return the minimum zoom level of the layer. Returns -Infinity if
   * the layer has no minimum zoom set.
   * @return {number} The minimum zoom level of the layer.
   * @observable
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.get(st.MIN_ZOOM)
    );
  }
  /**
   * Return the maximum zoom level of the layer. Returns Infinity if
   * the layer has no maximum zoom set.
   * @return {number} The maximum zoom level of the layer.
   * @observable
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.get(st.MAX_ZOOM)
    );
  }
  /**
   * Return the opacity of the layer (between 0 and 1).
   * @return {number} The opacity of the layer.
   * @observable
   * @api
   */
  getOpacity() {
    return (
      /** @type {number} */
      this.get(st.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return b();
  }
  /**
   * Return the value of this layer's `visible` property. To find out whether the layer
   * is visible on a map, use `isVisible()` instead.
   * @return {boolean} The value of the `visible` property of the layer.
   * @observable
   * @api
   */
  getVisible() {
    return (
      /** @type {boolean} */
      this.get(st.VISIBLE)
    );
  }
  /**
   * Return the Z-index of the layer, which is used to order layers before
   * rendering. Returns undefined if the layer is unmanaged.
   * @return {number|undefined} The Z-index of the layer.
   * @observable
   * @api
   */
  getZIndex() {
    return (
      /** @type {number|undefined} */
      this.get(st.Z_INDEX)
    );
  }
  /**
   * Sets the background color.
   * @param {BackgroundColor} [background] Background color.
   */
  setBackground(t) {
    this.background_ = t, this.changed();
  }
  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
   * @observable
   * @api
   */
  setExtent(t) {
    this.set(st.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(st.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(st.MIN_RESOLUTION, t);
  }
  /**
   * Set the maximum zoom (exclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} maxZoom The maximum zoom of the layer.
   * @observable
   * @api
   */
  setMaxZoom(t) {
    this.set(st.MAX_ZOOM, t);
  }
  /**
   * Set the minimum zoom (inclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} minZoom The minimum zoom of the layer.
   * @observable
   * @api
   */
  setMinZoom(t) {
    this.set(st.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    at(typeof t == "number", "Layer opacity must be a number"), this.set(st.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(st.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(st.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
class $f extends jf {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      st.SOURCE,
      this.handleSourcePropertyChange_
    );
    const i = t.source ? (
      /** @type {SourceType} */
      t.source
    ) : null;
    this.setSource(i);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   * @override
   */
  getLayersArray(t) {
    return t = t || [], t.push(this), t;
  }
  /**
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   * @override
   */
  getLayerStatesArray(t) {
    return t = t || [], t.push(this.getLayerState()), t;
  }
  /**
   * Get the layer source.
   * @return {SourceType|null} The layer source (or `null` if not yet set).
   * @observable
   * @api
   */
  getSource() {
    return (
      /** @type {SourceType} */
      this.get(st.SOURCE) || null
    );
  }
  /**
   * @return {SourceType|null} The source being rendered.
   */
  getRenderSource() {
    return this.getSource();
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   * @override
   */
  getSourceState() {
    const t = this.getSource();
    return t ? t.getState() : "undefined";
  }
  /**
   * @private
   */
  handleSourceChange_() {
    this.changed(), !(this.sourceReady_ || this.getSource().getState() !== "ready") && (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (Se(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = ue(
      t,
      Rt.CHANGE,
      this.handleSourceChange_,
      this
    ), t.getState() === "ready" && (this.sourceReady_ = !0, setTimeout(() => {
      this.dispatchEvent("sourceready");
    }, 0))), this.changed();
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t);
  }
  /**
   * The layer is visible on the map view, i.e. within its min/max resolution or zoom and
   * extent, not set to `visible: false`, and not inside a layer group that is set
   * to `visible: false`.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {boolean} The layer is visible in the map view.
   * @api
   */
  isVisible(t) {
    let e;
    const i = this.getMapInternal();
    !t && i && (t = i.getView()), t instanceof Ka ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && i && (e.layerStatesArray = i.getLayerGroup().getLayerStatesArray());
    let n;
    if (e.layerStatesArray) {
      if (n = e.layerStatesArray.find(
        (o) => o.layer === this
      ), !n)
        return !1;
    } else
      n = this.getLayerState();
    const s = this.getExtent();
    return Kf(n, e.viewState) && (!s || jt(s, e.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    var s;
    if (!this.isVisible(t))
      return [];
    const e = (s = this.getSource()) == null ? void 0 : s.getAttributions();
    if (!e)
      return [];
    const i = t instanceof Ka ? t.getViewStateAndExtent() : t;
    let n = e(i);
    return Array.isArray(n) || (n = [n]), n;
  }
  /**
   * In charge to manage the rendering of the layer. One layer type is
   * bounded with one layer renderer.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target which the renderer may (but need not) use
   * for rendering its content.
   * @return {HTMLElement|null} The rendered element.
   */
  render(t, e) {
    const i = this.getRenderer();
    return i.prepareFrame(t) ? (this.rendered = !0, i.renderFrame(t, e)) : null;
  }
  /**
   * Called when a layer is not visible during a map render.
   */
  unrender() {
    this.rendered = !1;
  }
  /** @return {string} Declutter */
  getDeclutter() {
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   */
  renderDeclutter(t, e) {
  }
  /**
   * When the renderer follows a layout -> render approach, do the final rendering here.
   * @param {import('../Map.js').FrameState} frameState Frame state
   */
  renderDeferred(t) {
    const e = this.getRenderer();
    e && e.renderDeferred(t);
  }
  /**
   * For use inside the library only.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMapInternal(t) {
    t || this.unrender(), this.set(st.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(st.MAP);
  }
  /**
   * Sets the layer to be rendered on top of other layers on a map. The map will
   * not manage this layer in its layers collection. This
   * is useful for temporary layers. To remove an unmanaged layer from the map,
   * use `#setMap(null)`.
   *
   * To add the layer to a map and have it managed by the map, use
   * {@link module:ol/Map~Map#addLayer} instead.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.mapPrecomposeKey_ && (Se(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (Se(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = ue(
      t,
      ni.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = ue(this, Rt.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const e = (
      /** @type {import("../render/Event.js").default} */
      t.frameState.layerStatesArray
    ), i = this.getLayerState(!1);
    at(
      !e.some(
        (n) => n.layer === i.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), e.push(i);
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(st.SOURCE, t);
  }
  /**
   * Get the renderer for this layer.
   * @return {RendererType|null} The layer renderer.
   */
  getRenderer() {
    return this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_;
  }
  /**
   * @return {boolean} The layer has a renderer.
   */
  hasRenderer() {
    return !!this.renderer_;
  }
  /**
   * Create a renderer for this layer.
   * @return {RendererType} A layer renderer.
   * @protected
   */
  createRenderer() {
    return null;
  }
  /**
   * This will clear the renderer so that a new one can be created next time it is needed
   */
  clearRenderer() {
    this.renderer_ && (this.renderer_.dispose(), delete this.renderer_);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.clearRenderer(), this.setSource(null), super.disposeInternal();
  }
}
function Kf(r, t) {
  if (!r.visible)
    return !1;
  const e = t.resolution;
  if (e < r.minResolution || e >= r.maxResolution)
    return !1;
  const i = t.zoom;
  return i > r.minZoom && i <= r.maxZoom;
}
const Ha = {
  RENDER_ORDER: "renderOrder"
};
class Hf extends $f {
  /**
   * @param {Options<FeatureType, VectorSourceType>} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.style, delete e.renderBuffer, delete e.updateWhileAnimating, delete e.updateWhileInteracting, super(e), this.declutter_ = t.declutter ? String(t.declutter) : void 0, this.renderBuffer_ = t.renderBuffer !== void 0 ? t.renderBuffer : 100, this.style_ = null, this.styleFunction_ = void 0, this.setStyle(t.style), this.updateWhileAnimating_ = t.updateWhileAnimating !== void 0 ? t.updateWhileAnimating : !1, this.updateWhileInteracting_ = t.updateWhileInteracting !== void 0 ? t.updateWhileInteracting : !1;
  }
  /**
   * @return {string} Declutter group.
   * @override
   */
  getDeclutter() {
    return this.declutter_;
  }
  /**
   * Get the topmost feature that intersects the given pixel on the viewport. Returns a promise
   * that resolves with an array of features. The array will either contain the topmost feature
   * when a hit was detected, or it will be empty.
   *
   * The hit detection algorithm used for this method is optimized for performance, but is less
   * accurate than the one used in [map.getFeaturesAtPixel()]{@link import("../Map.js").default#getFeaturesAtPixel}.
   * Text is not considered, and icons are only represented by their bounding box instead of the exact
   * image.
   *
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with an array of features.
   * @api
   * @override
   */
  getFeatures(t) {
    return super.getFeatures(t);
  }
  /**
   * @return {number|undefined} Render buffer.
   */
  getRenderBuffer() {
    return this.renderBuffer_;
  }
  /**
   * @return {import("../render.js").OrderFunction|null|undefined} Render order.
   */
  getRenderOrder() {
    return (
      /** @type {import("../render.js").OrderFunction|null|undefined} */
      this.get(Ha.RENDER_ORDER)
    );
  }
  /**
   * Get the style for features.  This returns whatever was passed to the `style`
   * option at construction or to the `setStyle` method.
   * @return {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null|undefined} Layer style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the style function.
   * @return {import("../style/Style.js").StyleFunction|undefined} Layer style function.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     animating.
   */
  getUpdateWhileAnimating() {
    return this.updateWhileAnimating_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     interacting.
   */
  getUpdateWhileInteracting() {
    return this.updateWhileInteracting_;
  }
  /**
   * Render declutter items for this layer
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   * @override
   */
  renderDeclutter(t, e) {
    const i = this.getDeclutter();
    i in t.declutter || (t.declutter[i] = new fh(9)), this.getRenderer().renderDeclutter(t, e);
  }
  /**
   * @param {import("../render.js").OrderFunction|null|undefined} renderOrder
   *     Render order.
   */
  setRenderOrder(t) {
    this.set(Ha.RENDER_ORDER, t);
  }
  /**
   * Set the style for features.  This can be a single style object, an array
   * of styles, or a function that takes a feature and resolution and returns
   * an array of styles. If set to `null`, the layer has no style (a `null` style),
   * so only features that have their own styles will be rendered in the layer. Call
   * `setStyle()` without arguments to reset to the default style. See
   * [the ol/style/Style module]{@link module:ol/style/Style~Style} for information on the default style.
   *
   * If your layer has a static style, you can use [flat style]{@link module:ol/style/flat~FlatStyle} object
   * literals instead of using the `Style` and symbolizer constructors (`Fill`, `Stroke`, etc.):
   * ```js
   * vectorLayer.setStyle({
   *   "fill-color": "yellow",
   *   "stroke-color": "black",
   *   "stroke-width": 4
   * })
   * ```
   *
   * @param {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null} [style] Layer style.
   * @api
   */
  setStyle(t) {
    this.style_ = t === void 0 ? Gl : t;
    const e = qf(t);
    this.styleFunction_ = t === null ? void 0 : $c(e), this.changed();
  }
  /**
   * @param {boolean|string|number} declutter Declutter images and text.
   * @api
   */
  setDeclutter(t) {
    this.declutter_ = t ? String(t) : void 0, this.changed();
  }
}
function qf(r) {
  if (r === void 0)
    return Gl;
  if (!r)
    return null;
  if (typeof r == "function" || r instanceof X)
    return r;
  if (!Array.isArray(r))
    return Wa([r]);
  if (r.length === 0)
    return [];
  const t = r.length, e = r[0];
  if (e instanceof X) {
    const n = new Array(t);
    for (let s = 0; s < t; ++s) {
      const o = r[s];
      if (!(o instanceof X))
        throw new Error("Expected a list of style instances");
      n[s] = o;
    }
    return n;
  }
  if ("style" in e) {
    const n = new Array(t);
    for (let s = 0; s < t; ++s) {
      const o = r[s];
      if (!("style" in o))
        throw new Error("Expected a list of rules with a style property");
      n[s] = o;
    }
    return uf(n);
  }
  return Wa(
    /** @type {Array<import("../style/flat.js").FlatStyle>} */
    r
  );
}
class $i extends Hf {
  /**
   * @param {Options<VectorSourceType, FeatureType>} [options] Options.
   */
  constructor(t) {
    super(t);
  }
  /**
   * @override
   */
  createRenderer() {
    return new Ld(this);
  }
}
const $t = {
  /**
   * Triggered when an item is added to the collection.
   * @event module:ol/Collection.CollectionEvent#add
   * @api
   */
  ADD: "add",
  /**
   * Triggered when an item is removed from the collection.
   * @event module:ol/Collection.CollectionEvent#remove
   * @api
   */
  REMOVE: "remove"
}, qa = {
  LENGTH: "length"
};
class tr extends fe {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, i) {
    super(t), this.element = e, this.index = i;
  }
}
class oi extends Ae {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t || [], this.unique_)
      for (let i = 0, n = this.array_.length; i < n; ++i)
        this.assertUnique_(this.array_[i], i);
    this.updateLength_();
  }
  /**
   * Remove all elements from the collection.
   * @api
   */
  clear() {
    for (; this.getLength() > 0; )
      this.pop();
  }
  /**
   * Add elements to the collection.  This pushes each item in the provided array
   * to the end of the collection.
   * @param {!Array<T>} arr Array.
   * @return {Collection<T>} This collection.
   * @api
   */
  extend(t) {
    for (let e = 0, i = t.length; e < i; ++e)
      this.push(t[e]);
    return this;
  }
  /**
   * Iterate over each element, calling the provided callback.
   * @param {function(T, number, Array<T>): *} f The function to call
   *     for every element. This function takes 3 arguments (the element, the
   *     index and the array). The return value is ignored.
   * @api
   */
  forEach(t) {
    const e = this.array_;
    for (let i = 0, n = e.length; i < n; ++i)
      t(e[i], i, e);
  }
  /**
   * Get a reference to the underlying Array object. Warning: if the array
   * is mutated, no events will be dispatched by the collection, and the
   * collection's "length" property won't be in sync with the actual length
   * of the array.
   * @return {!Array<T>} Array.
   * @api
   */
  getArray() {
    return this.array_;
  }
  /**
   * Get the element at the provided index.
   * @param {number} index Index.
   * @return {T} Element.
   * @api
   */
  item(t) {
    return this.array_[t];
  }
  /**
   * Get the length of this collection.
   * @return {number} The length of the array.
   * @observable
   * @api
   */
  getLength() {
    return this.get(qa.LENGTH);
  }
  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(t, e) {
    if (t < 0 || t > this.getLength())
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e), this.array_.splice(t, 0, e), this.updateLength_(), this.dispatchEvent(
      new tr($t.ADD, e, t)
    );
  }
  /**
   * Remove the last element of the collection and return it.
   * Return `undefined` if the collection is empty.
   * @return {T|undefined} Element.
   * @api
   */
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  /**
   * Insert the provided element at the end of the collection.
   * @param {T} elem Element.
   * @return {number} New length of the collection.
   * @api
   */
  push(t) {
    this.unique_ && this.assertUnique_(t);
    const e = this.getLength();
    return this.insertAt(e, t), this.getLength();
  }
  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(t) {
    const e = this.array_;
    for (let i = 0, n = e.length; i < n; ++i)
      if (e[i] === t)
        return this.removeAt(i);
  }
  /**
   * Remove the element at the provided index and return it.
   * Return `undefined` if the collection does not contain this index.
   * @param {number} index Index.
   * @return {T|undefined} Value.
   * @api
   */
  removeAt(t) {
    if (t < 0 || t >= this.getLength())
      return;
    const e = this.array_[t];
    return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new tr($t.REMOVE, e, t)
    ), e;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, e) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const n = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new tr($t.REMOVE, n, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new tr($t.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(qa.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    for (let i = 0, n = this.array_.length; i < n; ++i)
      if (this.array_[i] === t && i !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
let Jf = !1;
function Qf(r, t, e, i, n, s, o) {
  const a = new XMLHttpRequest();
  a.open(
    "GET",
    typeof r == "function" ? r(e, i, n) : r,
    !0
  ), t.getType() == "arraybuffer" && (a.responseType = "arraybuffer"), a.withCredentials = Jf, a.onload = function(l) {
    if (!a.status || a.status >= 200 && a.status < 300) {
      const c = t.getType();
      try {
        let h;
        c == "text" || c == "json" ? h = a.responseText : c == "xml" ? h = a.responseXML || a.responseText : c == "arraybuffer" && (h = /** @type {ArrayBuffer} */
        a.response), h ? s(
          /** @type {Array<FeatureType>} */
          t.readFeatures(h, {
            extent: e,
            featureProjection: n
          }),
          t.readProjection(h)
        ) : o();
      } catch {
        o();
      }
    } else
      o();
  }, a.onerror = o, a.send();
}
function Ja(r, t) {
  return function(e, i, n, s, o) {
    Qf(
      r,
      t,
      e,
      i,
      n,
      /**
       * @param {Array<FeatureType>} features The loaded features.
       * @param {import("./proj/Projection.js").default} dataProjection Data
       * projection.
       */
      (a, l) => {
        this.addFeatures(a), s !== void 0 && s(a);
      },
      () => {
        this.changed(), o !== void 0 && o();
      }
    );
  };
}
function tg(r, t) {
  return [[-1 / 0, -1 / 0, 1 / 0, 1 / 0]];
}
function vh(r, t) {
  return [r];
}
function Ah(r) {
  return (
    /**
     * @param {import("./extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {import("./proj.js").Projection} projection Projection.
     * @return {Array<import("./extent.js").Extent>} Extents.
     */
    function(t, e, i) {
      const n = r.getZForResolution(
        Uu(e)
      ), s = r.getTileRangeForExtentAndZ(
        ii(t),
        n
      ), o = [], a = [n, 0, 0];
      for (a[1] = s.minX; a[1] <= s.maxX; ++a[1])
        for (a[2] = s.minY; a[2] <= s.maxY; ++a[2])
          o.push(
            Br(r.getTileCoordExtent(a))
          );
      return o;
    }
  );
}
class Ct extends Ae {
  /**
   * @param {Geometry|ObjectWithGeometry<Geometry>} [geometryOrProperties]
   *     You may pass a Geometry object directly, or an object literal containing
   *     properties. If you pass an object literal, you may include a Geometry
   *     associated with a `geometry` key.
   */
  constructor(t) {
    if (super(), this.on, this.once, this.un, this.id_ = void 0, this.geometryName_ = "geometry", this.style_ = null, this.styleFunction_ = void 0, this.geometryChangeKey_ = null, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), t)
      if (typeof /** @type {?} */
      t.getSimplifiedGeometry == "function") {
        const e = (
          /** @type {Geometry} */
          t
        );
        this.setGeometry(e);
      } else {
        const e = t;
        this.setProperties(e);
      }
  }
  /**
   * Clone this feature. If the original feature has a geometry it
   * is also cloned. The feature id is not set in the clone.
   * @return {Feature<Geometry>} The clone.
   * @api
   */
  clone() {
    const t = (
      /** @type {Feature<Geometry>} */
      new Ct(this.hasProperties() ? this.getProperties() : null)
    );
    t.setGeometryName(this.getGeometryName());
    const e = this.getGeometry();
    e && t.setGeometry(
      /** @type {Geometry} */
      e.clone()
    );
    const i = this.getStyle();
    return i && t.setStyle(i), t;
  }
  /**
   * Get the feature's default geometry.  A feature may have any number of named
   * geometries.  The "default" geometry (the one that is rendered by default) is
   * set when calling {@link module:ol/Feature~Feature#setGeometry}.
   * @return {Geometry|undefined} The default geometry for the feature.
   * @api
   * @observable
   */
  getGeometry() {
    return (
      /** @type {Geometry|undefined} */
      this.get(this.geometryName_)
    );
  }
  /**
   * Get the feature identifier.  This is a stable identifier for the feature and
   * is either set when reading data from a remote source or set explicitly by
   * calling {@link module:ol/Feature~Feature#setId}.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id_;
  }
  /**
   * Get the name of the feature's default geometry.  By default, the default
   * geometry is named `geometry`.
   * @return {string} Get the property name associated with the default geometry
   *     for this feature.
   * @api
   */
  getGeometryName() {
    return this.geometryName_;
  }
  /**
   * Get the feature's style. Will return what was provided to the
   * {@link module:ol/Feature~Feature#setStyle} method.
   * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the feature's style function.
   * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
   * representing the current style of this feature.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @private
   */
  handleGeometryChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleGeometryChanged_() {
    this.geometryChangeKey_ && (Se(this.geometryChangeKey_), this.geometryChangeKey_ = null);
    const t = this.getGeometry();
    t && (this.geometryChangeKey_ = ue(
      t,
      Rt.CHANGE,
      this.handleGeometryChange_,
      this
    )), this.changed();
  }
  /**
   * Set the default geometry for the feature.  This will update the property
   * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
   * @param {Geometry|undefined} geometry The new geometry.
   * @api
   * @observable
   */
  setGeometry(t) {
    this.set(this.geometryName_, t);
  }
  /**
   * Set the style for the feature to override the layer style.  This can be a
   * single style object, an array of styles, or a function that takes a
   * resolution and returns an array of styles. To unset the feature style, call
   * `setStyle()` without arguments or a falsey value.
   * @param {import("./style/Style.js").StyleLike} [style] Style for this feature.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setStyle(t) {
    this.style_ = t, this.styleFunction_ = t ? eg(t) : void 0, this.changed();
  }
  /**
   * Set the feature id.  The feature id is considered stable and may be used when
   * requesting features or comparing identifiers returned from a remote source.
   * The feature id can be used with the
   * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
   * @param {number|string|undefined} id The feature id.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setId(t) {
    this.id_ = t, this.changed();
  }
  /**
   * Set the property name to be used when getting the feature's default geometry.
   * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
   * this name will be returned.
   * @param {string} name The property name of the default geometry.
   * @api
   */
  setGeometryName(t) {
    this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_), this.geometryName_ = t, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), this.handleGeometryChanged_();
  }
}
function eg(r) {
  if (typeof r == "function")
    return r;
  let t;
  return Array.isArray(r) ? t = r : (at(
    typeof /** @type {?} */
    r.getZIndex == "function",
    "Expected an `ol/style/Style` or an array of `ol/style/Style.js`"
  ), t = [
    /** @type {import("./style/Style.js").default} */
    r
  ]), function() {
    return t;
  };
}
function Lh(r, t, e, i) {
  const n = [];
  let s = Me();
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    s = oo(
      r,
      t,
      l[0],
      i
    ), n.push((s[0] + s[2]) / 2, (s[1] + s[3]) / 2), t = l[l.length - 1];
  }
  return n;
}
function Mr(r, t, e, i, n, s, o) {
  let a, l;
  const c = (e - t) / i;
  if (c === 1)
    a = t;
  else if (c === 2)
    a = t, l = n;
  else if (c !== 0) {
    let h = r[t], u = r[t + 1], d = 0;
    const f = [0];
    for (let _ = t + i; _ < e; _ += i) {
      const p = r[_], y = r[_ + 1];
      d += Math.sqrt((p - h) * (p - h) + (y - u) * (y - u)), f.push(d), h = p, u = y;
    }
    const g = n * d, m = vc(f, g);
    m < 0 ? (l = (g - f[-m - 2]) / (f[-m - 1] - f[-m - 2]), a = t + (-m - 2) * i) : a = t + m * i;
  }
  o = o > 1 ? o : 2, s = s || new Array(o);
  for (let h = 0; h < o; ++h)
    s[h] = a === void 0 ? NaN : l === void 0 ? r[a + h] : kt(r[a + h], r[a + i + h], l);
  return s;
}
function Xs(r, t, e, i, n, s) {
  if (e == t)
    return null;
  let o;
  if (n < r[t + i - 1])
    return s ? (o = r.slice(t, t + i), o[i - 1] = n, o) : null;
  if (r[e - 1] < n)
    return s ? (o = r.slice(e - i, e), o[i - 1] = n, o) : null;
  if (n == r[t + i - 1])
    return r.slice(t, t + i);
  let a = t / i, l = e / i;
  for (; a < l; ) {
    const d = a + l >> 1;
    n < r[(d + 1) * i - 1] ? l = d : a = d + 1;
  }
  const c = r[a * i - 1];
  if (n == c)
    return r.slice((a - 1) * i, (a - 1) * i + i);
  const h = r[(a + 1) * i - 1], u = (n - c) / (h - c);
  o = [];
  for (let d = 0; d < i - 1; ++d)
    o.push(
      kt(
        r[(a - 1) * i + d],
        r[a * i + d],
        u
      )
    );
  return o.push(n), o;
}
function ig(r, t, e, i, n, s, o) {
  if (o)
    return Xs(
      r,
      t,
      e[e.length - 1],
      i,
      n,
      s
    );
  let a;
  if (n < r[i - 1])
    return s ? (a = r.slice(0, i), a[i - 1] = n, a) : null;
  if (r[r.length - 1] < n)
    return s ? (a = r.slice(r.length - i), a[i - 1] = n, a) : null;
  for (let l = 0, c = e.length; l < c; ++l) {
    const h = e[l];
    if (t != h) {
      if (n < r[t + i - 1])
        return null;
      if (n <= r[h - 1])
        return Xs(
          r,
          t,
          h,
          i,
          n,
          !1
        );
      t = h;
    }
  }
  return null;
}
class $r extends Le {
  /**
   * @param {!import("../coordinate.js").Coordinate} center Center.
   *     For internal use, flat coordinates in combination with `layout` and no
   *     `radius` are also accepted.
   * @param {number} [radius] Radius in units of the projection.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e, i) {
    super(), i !== void 0 && e === void 0 ? this.setFlatCoordinates(i, t) : (e = e || 0, this.setCenterAndRadius(t, e, i));
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Circle} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new $r(
      this.flatCoordinates.slice(),
      void 0,
      this.layout
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    const s = this.flatCoordinates, o = t - s[0], a = e - s[1], l = o * o + a * a;
    if (l < n) {
      if (l === 0)
        for (let c = 0; c < this.stride; ++c)
          i[c] = s[c];
      else {
        const c = this.getRadius() / Math.sqrt(l);
        i[0] = s[0] + c * o, i[1] = s[1] + c * a;
        for (let h = 2; h < this.stride; ++h)
          i[h] = s[h];
      }
      return i.length = this.stride, l;
    }
    return n;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    const i = this.flatCoordinates, n = t - i[0], s = e - i[1];
    return n * n + s * s <= this.getRadiusSquared_();
  }
  /**
   * Return the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @return {import("../coordinate.js").Coordinate} Center.
   * @api
   */
  getCenter() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    const e = this.flatCoordinates, i = e[this.stride] - e[0];
    return ne(
      e[0] - i,
      e[1] - i,
      e[0] + i,
      e[1] + i,
      t
    );
  }
  /**
   * Return the radius of the circle.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return Math.sqrt(this.getRadiusSquared_());
  }
  /**
   * @private
   * @return {number} Radius squared.
   */
  getRadiusSquared_() {
    const t = this.flatCoordinates[this.stride] - this.flatCoordinates[0], e = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
    return t * t + e * e;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Circle";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    const e = this.getExtent();
    if (jt(t, e)) {
      const i = this.getCenter();
      return t[0] <= i[0] && t[2] >= i[0] || t[1] <= i[1] && t[3] >= i[1] ? !0 : zl(t, this.intersectsCoordinate.bind(this));
    }
    return !1;
  }
  /**
   * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} center Center.
   * @api
   */
  setCenter(t) {
    const e = this.stride, i = this.flatCoordinates[e] - this.flatCoordinates[0], n = t.slice();
    n[e] = n[0] + i;
    for (let s = 1; s < e; ++s)
      n[e + s] = t[s];
    this.setFlatCoordinates(this.layout, n), this.changed();
  }
  /**
   * Set the center (as {@link module:ol/coordinate~Coordinate coordinate}) and the radius (as
   * number) of the circle.
   * @param {!import("../coordinate.js").Coordinate} center Center.
   * @param {number} radius Radius.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCenterAndRadius(t, e, i) {
    this.setLayout(i, t, 0), this.flatCoordinates || (this.flatCoordinates = []);
    const n = this.flatCoordinates;
    let s = xh(n, 0, t, this.stride);
    n[s++] = n[0] + e;
    for (let o = 1, a = this.stride; o < a; ++o)
      n[s++] = n[o];
    n.length = s, this.changed();
  }
  /**
   * @override
   */
  getCoordinates() {
    return null;
  }
  /**
   * @override
   */
  setCoordinates(t, e) {
  }
  /**
   * Set the radius of the circle. The radius is in the units of the projection.
   * @param {number} radius Radius.
   * @api
   */
  setRadius(t) {
    this.flatCoordinates[this.stride] = this.flatCoordinates[0] + t, this.changed();
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const i = this.getCenter(), n = this.getStride();
    this.setCenter(
      _o(i, 0, i.length, n, t, e, i)
    ), this.changed();
  }
}
$r.prototype.transform;
class je extends yo {
  /**
   * @param {Array<Geometry>} geometries Geometries.
   */
  constructor(t) {
    super(), this.geometries_ = t, this.changeEventsKeys_ = [], this.listenGeometriesChange_();
  }
  /**
   * @private
   */
  unlistenGeometriesChange_() {
    this.changeEventsKeys_.forEach(Se), this.changeEventsKeys_.length = 0;
  }
  /**
   * @private
   */
  listenGeometriesChange_() {
    const t = this.geometries_;
    for (let e = 0, i = t.length; e < i; ++e)
      this.changeEventsKeys_.push(
        ue(t[e], Rt.CHANGE, this.changed, this)
      );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!GeometryCollection} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new je(
      Cs(this.geometries_)
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    if (n < _i(this.getExtent(), t, e))
      return n;
    const s = this.geometries_;
    for (let o = 0, a = s.length; o < a; ++o)
      n = s[o].closestPointXY(
        t,
        e,
        i,
        n
      );
    return n;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    const i = this.geometries_;
    for (let n = 0, s = i.length; n < s; ++n)
      if (i[n].containsXY(t, e))
        return !0;
    return !1;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    Gr(t);
    const e = this.geometries_;
    for (let i = 0, n = e.length; i < n; ++i)
      Yl(t, e[i].getExtent());
    return t;
  }
  /**
   * Return the geometries that make up this geometry collection.
   * @return {Array<Geometry>} Geometries.
   * @api
   */
  getGeometries() {
    return Cs(this.geometries_);
  }
  /**
   * @return {Array<Geometry>} Geometries.
   */
  getGeometriesArray() {
    return this.geometries_;
  }
  /**
   * @return {Array<Geometry>} Geometries.
   */
  getGeometriesArrayRecursive() {
    let t = [];
    const e = this.geometries_;
    for (let i = 0, n = e.length; i < n; ++i)
      e[i].getType() === this.getType() ? t = t.concat(
        /** @type {GeometryCollection} */
        e[i].getGeometriesArrayRecursive()
      ) : t.push(e[i]);
    return t;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {GeometryCollection} Simplified GeometryCollection.
   * @override
   */
  getSimplifiedGeometry(t) {
    if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t < this.simplifiedGeometryMaxMinSquaredTolerance)
      return this;
    const e = [], i = this.geometries_;
    let n = !1;
    for (let s = 0, o = i.length; s < o; ++s) {
      const a = i[s], l = a.getSimplifiedGeometry(t);
      e.push(l), l !== a && (n = !0);
    }
    return n ? new je(
      e
    ) : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "GeometryCollection";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    const e = this.geometries_;
    for (let i = 0, n = e.length; i < n; ++i)
      if (e[i].intersectsExtent(t))
        return !0;
    return !1;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.geometries_.length === 0;
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const i = this.geometries_;
    for (let n = 0, s = i.length; n < s; ++n)
      i[n].rotate(t, e);
    this.changed();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   * @override
   */
  scale(t, e, i) {
    i || (i = Fe(this.getExtent()));
    const n = this.geometries_;
    for (let s = 0, o = n.length; s < o; ++s)
      n[s].scale(t, e, i);
    this.changed();
  }
  /**
   * Set the geometries that make up this geometry collection.
   * @param {Array<Geometry>} geometries Geometries.
   * @api
   */
  setGeometries(t) {
    this.setGeometriesArray(Cs(t));
  }
  /**
   * @param {Array<Geometry>} geometries Geometries.
   */
  setGeometriesArray(t) {
    this.unlistenGeometriesChange_(), this.geometries_ = t, this.listenGeometriesChange_(), this.changed();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   * @override
   */
  applyTransform(t) {
    const e = this.geometries_;
    for (let i = 0, n = e.length; i < n; ++i)
      e[i].applyTransform(t);
    this.changed();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   * @override
   */
  translate(t, e) {
    const i = this.geometries_;
    for (let n = 0, s = i.length; n < s; ++n)
      i[n].translate(t, e);
    this.changed();
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.unlistenGeometriesChange_(), super.disposeInternal();
  }
}
function Cs(r) {
  return r.map((t) => t.clone());
}
class bt extends Le {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.flatMidpoint_ = null, this.flatMidpointRevision_ = -1, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Append the passed coordinate to the coordinates of the linestring.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @api
   */
  appendCoordinate(t) {
    It(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new bt(
      this.flatCoordinates.slice(),
      this.layout
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    return n < _i(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Co(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), xo(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * Iterate over each segment, calling the provided callback.
   * If the callback returns a truthy value the function returns that
   * value immediately. Otherwise the function returns `false`.
   *
   * @param {function(this: S, import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): T} callback Function
   *     called for each segment. The function will receive two arguments, the start and end coordinates of the segment.
   * @return {T|boolean} Value.
   * @template T,S
   * @api
   */
  forEachSegment(t) {
    return Th(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * @param {number} m M.
   * @param {boolean} [extrapolate] Extrapolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate|null} Coordinate.
   * @api
   */
  getCoordinateAtM(t, e) {
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, Xs(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e
    ));
  }
  /**
   * Return the coordinates of the linestring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return Be(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinate at the provided fraction along the linestring.
   * The `fraction` is a number between 0 and 1, where 0 is the start of the
   * linestring and 1 is the end.
   * @param {number} fraction Fraction.
   * @param {import("../coordinate.js").Coordinate} [dest] Optional coordinate whose values will
   *     be modified. If not provided, a new coordinate will be returned.
   * @return {import("../coordinate.js").Coordinate} Coordinate of the interpolated point.
   * @api
   */
  getCoordinateAt(t, e) {
    return Mr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      this.stride
    );
  }
  /**
   * Return the length of the linestring on projected plane.
   * @return {number} Length (on projected plane).
   * @api
   */
  getLength() {
    return po(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @return {Array<number>} Flat midpoint.
   */
  getFlatMidpoint() {
    return this.flatMidpointRevision_ != this.getRevision() && (this.flatMidpoint_ = this.getCoordinateAt(
      0.5,
      this.flatMidpoint_ ?? void 0
    ), this.flatMidpointRevision_ = this.getRevision()), /** @type {Array<number>} */
    this.flatMidpoint_;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LineString} Simplified LineString.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = Xr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new bt(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "LineString";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return jr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      this.getExtent()
    );
  }
  /**
   * Set the coordinates of the linestring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Vr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class se extends Le {
  /**
   * @param {Array<Array<import("../coordinate.js").Coordinate>|LineString>|Array<number>} coordinates
   *     Coordinates or LineString geometries. (For internal use, flat coordinates in
   *     combination with `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Flat coordinate ends for internal use.
   */
  constructor(t, e, i) {
    if (super(), this.ends_ = [], this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, Array.isArray(t[0]))
      this.setCoordinates(
        /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
        t,
        e
      );
    else if (e !== void 0 && i)
      this.setFlatCoordinates(
        e,
        /** @type {Array<number>} */
        t
      ), this.ends_ = i;
    else {
      const n = (
        /** @type {Array<LineString>} */
        t
      ), s = [], o = [];
      for (let l = 0, c = n.length; l < c; ++l) {
        const h = n[l];
        It(s, h.getFlatCoordinates()), o.push(s.length);
      }
      const a = n.length === 0 ? this.getLayout() : n[0].getLayout();
      this.setFlatCoordinates(a, s), this.ends_ = o;
    }
  }
  /**
   * Append the passed linestring to the multilinestring.
   * @param {LineString} lineString LineString.
   * @api
   */
  appendLineString(t) {
    It(this.flatCoordinates, t.getFlatCoordinates().slice()), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiLineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new se(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    return n < _i(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      So(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Ro(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * `interpolate` controls interpolation between consecutive LineStrings
   * within the MultiLineString. If `interpolate` is `true` the coordinates
   * will be linearly interpolated between the last coordinate of one LineString
   * and the first coordinate of the next LineString.  If `interpolate` is
   * `false` then the function will return `null` for Ms falling between
   * LineStrings.
   *
   * @param {number} m M.
   * @param {boolean} [extrapolate] Extrapolate. Default is `false`.
   * @param {boolean} [interpolate] Interpolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate|null} Coordinate.
   * @api
   */
  getCoordinateAtM(t, e, i) {
    return this.layout != "XYM" && this.layout != "XYZM" || this.flatCoordinates.length === 0 ? null : (e = e !== void 0 ? e : !1, i = i !== void 0 ? i : !1, ig(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      t,
      e,
      i
    ));
  }
  /**
   * Return the coordinates of the multilinestring.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return Mn(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * Return the linestring at the specified index.
   * @param {number} index Index.
   * @return {LineString} LineString.
   * @api
   */
  getLineString(t) {
    return t < 0 || this.ends_.length <= t ? null : new bt(
      this.flatCoordinates.slice(
        t === 0 ? 0 : this.ends_[t - 1],
        this.ends_[t]
      ),
      this.layout
    );
  }
  /**
   * Return the linestrings of this multilinestring.
   * @return {Array<LineString>} LineStrings.
   * @api
   */
  getLineStrings() {
    const t = this.flatCoordinates, e = this.ends_, i = this.layout, n = [];
    let s = 0;
    for (let o = 0, a = e.length; o < a; ++o) {
      const l = e[o], c = new bt(
        t.slice(s, l),
        i
      );
      n.push(c), s = l;
    }
    return n;
  }
  /**
   * Return the sum of all line string lengths
   * @return {number} Length (on projected plane).
   * @api
   */
  getLength() {
    const t = this.ends_;
    let e = 0, i = 0;
    for (let n = 0, s = t.length; n < s; ++n)
      i += po(
        this.flatCoordinates,
        e,
        t[n],
        this.stride
      ), e = t[n];
    return i;
  }
  /**
   * @return {Array<number>} Flat midpoints.
   */
  getFlatMidpoints() {
    const t = [], e = this.flatCoordinates;
    let i = 0;
    const n = this.ends_, s = this.stride;
    for (let o = 0, a = n.length; o < a; ++o) {
      const l = n[o], c = Mr(
        e,
        i,
        l,
        s,
        0.5
      );
      It(t, c), i = l;
    }
    return t;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {MultiLineString} Simplified MultiLineString.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], i = [];
    return e.length = oh(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      t,
      e,
      0,
      i
    ), new se(e, "XY", i);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "MultiLineString";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return Of(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the multilinestring.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const i = Un(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
class wi extends Le {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), e && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Append the passed point to this multipoint.
   * @param {Point} point Point.
   * @api
   */
  appendPoint(t) {
    It(this.flatCoordinates, t.getFlatCoordinates()), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPoint} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new wi(
      this.flatCoordinates.slice(),
      this.layout
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    if (n < _i(this.getExtent(), t, e))
      return n;
    const s = this.flatCoordinates, o = this.stride;
    for (let a = 0, l = s.length; a < l; a += o) {
      const c = Ce(
        t,
        e,
        s[a],
        s[a + 1]
      );
      if (c < n) {
        n = c;
        for (let h = 0; h < o; ++h)
          i[h] = s[a + h];
        i.length = o;
      }
    }
    return n;
  }
  /**
   * Return the coordinates of the multipoint.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return Be(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the point at the specified index.
   * @param {number} index Index.
   * @return {Point} Point.
   * @api
   */
  getPoint(t) {
    const e = this.flatCoordinates.length / this.stride;
    return t < 0 || e <= t ? null : new Gt(
      this.flatCoordinates.slice(
        t * this.stride,
        (t + 1) * this.stride
      ),
      this.layout
    );
  }
  /**
   * Return the points of this multipoint.
   * @return {Array<Point>} Points.
   * @api
   */
  getPoints() {
    const t = this.flatCoordinates, e = this.layout, i = this.stride, n = [];
    for (let s = 0, o = t.length; s < o; s += i) {
      const a = new Gt(t.slice(s, s + i), e);
      n.push(a);
    }
    return n;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "MultiPoint";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    const e = this.flatCoordinates, i = this.stride;
    for (let n = 0, s = e.length; n < s; n += i) {
      const o = e[n], a = e[n + 1];
      if (so(t, o, a))
        return !0;
    }
    return !1;
  }
  /**
   * Set the coordinates of the multipoint.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Vr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class ve extends Le {
  /**
   * @param {Array<Array<Array<import("../coordinate.js").Coordinate>>|Polygon>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` and `endss` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<Array<number>>} [endss] Array of ends for internal use with flat coordinates.
   */
  constructor(t, e, i) {
    if (super(), this.endss_ = [], this.flatInteriorPointsRevision_ = -1, this.flatInteriorPoints_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, !i && !Array.isArray(t[0])) {
      const n = (
        /** @type {Array<Polygon>} */
        t
      ), s = [], o = [];
      for (let a = 0, l = n.length; a < l; ++a) {
        const c = n[a], h = s.length, u = c.getEnds();
        for (let d = 0, f = u.length; d < f; ++d)
          u[d] += h;
        It(s, c.getFlatCoordinates()), o.push(u);
      }
      e = n.length === 0 ? this.getLayout() : n[0].getLayout(), t = s, i = o;
    }
    e !== void 0 && i ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.endss_ = i) : this.setCoordinates(
      /** @type {Array<Array<Array<import("../coordinate.js").Coordinate>>>} */
      t,
      e
    );
  }
  /**
   * Append the passed polygon to this multipolygon.
   * @param {Polygon} polygon Polygon.
   * @api
   */
  appendPolygon(t) {
    let e;
    if (!this.flatCoordinates)
      this.flatCoordinates = t.getFlatCoordinates().slice(), e = t.getEnds().slice(), this.endss_.push();
    else {
      const i = this.flatCoordinates.length;
      It(this.flatCoordinates, t.getFlatCoordinates()), e = t.getEnds().slice();
      for (let n = 0, s = e.length; n < s; ++n)
        e[n] += i;
    }
    this.endss_.push(e), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPolygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = this.endss_.length, e = new Array(t);
    for (let n = 0; n < t; ++n)
      e[n] = this.endss_[n].slice();
    const i = new ve(
      this.flatCoordinates.slice(),
      this.layout,
      e
    );
    return i.applyProperties(this), i;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    return n < _i(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Ff(
        this.flatCoordinates,
        0,
        this.endss_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), vf(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return Lf(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      t,
      e
    );
  }
  /**
   * Return the area of the multipolygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Mf(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for multi-polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<Array<import("../coordinate.js").Coordinate>>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates(t) {
    let e;
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), Bs(
      e,
      0,
      this.endss_,
      this.stride,
      t
    )) : e = this.flatCoordinates, Us(
      e,
      0,
      this.endss_,
      this.stride
    );
  }
  /**
   * @return {Array<Array<number>>} Endss.
   */
  getEndss() {
    return this.endss_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoints() {
    if (this.flatInteriorPointsRevision_ != this.getRevision()) {
      const t = Lh(
        this.flatCoordinates,
        0,
        this.endss_,
        this.stride
      );
      this.flatInteriorPoints_ = Ih(
        this.getOrientedFlatCoordinates(),
        0,
        this.endss_,
        this.stride,
        t
      ), this.flatInteriorPointsRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.flatInteriorPoints_
    );
  }
  /**
   * Return the interior points as {@link module:ol/geom/MultiPoint~MultiPoint multipoint}.
   * @return {MultiPoint} Interior points as XYM coordinates, where M is
   * the length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoints() {
    return new wi(this.getFlatInteriorPoints().slice(), "XYM");
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      Fh(t, 0, this.endss_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = Bs(
        this.orientedFlatCoordinates_,
        0,
        this.endss_,
        this.stride
      )), this.orientedRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.orientedFlatCoordinates_
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {MultiPolygon} Simplified MultiPolygon.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], i = [];
    return e.length = zu(
      this.flatCoordinates,
      0,
      this.endss_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      i
    ), new ve(e, "XY", i);
  }
  /**
   * Return the polygon at the specified index.
   * @param {number} index Index.
   * @return {Polygon} Polygon.
   * @api
   */
  getPolygon(t) {
    if (t < 0 || this.endss_.length <= t)
      return null;
    let e;
    if (t === 0)
      e = 0;
    else {
      const s = this.endss_[t - 1];
      e = s[s.length - 1];
    }
    const i = this.endss_[t].slice(), n = i[i.length - 1];
    if (e !== 0)
      for (let s = 0, o = i.length; s < o; ++s)
        i[s] -= e;
    return new qt(
      this.flatCoordinates.slice(e, n),
      this.layout,
      i
    );
  }
  /**
   * Return the polygons of this multipolygon.
   * @return {Array<Polygon>} Polygons.
   * @api
   */
  getPolygons() {
    const t = this.layout, e = this.flatCoordinates, i = this.endss_, n = [];
    let s = 0;
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o].slice(), c = l[l.length - 1];
      if (s !== 0)
        for (let u = 0, d = l.length; u < d; ++u)
          l[u] -= s;
      const h = new qt(
        e.slice(s, c),
        t,
        l
      );
      n.push(h), s = c;
    }
    return n;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "MultiPolygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return bf(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the multipolygon.
   * @param {!Array<Array<Array<import("../coordinate.js").Coordinate>>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 3), this.flatCoordinates || (this.flatCoordinates = []);
    const i = Rh(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.endss_
    );
    if (i.length === 0)
      this.flatCoordinates.length = 0;
    else {
      const n = i[i.length - 1];
      this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1];
    }
    this.changed();
  }
}
const Qa = Ie();
class Dt {
  /**
   * @param {Type} type Geometry type.
   * @param {Array<number>} flatCoordinates Flat coordinates. These always need
   *     to be right-handed for polygons.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @param {Object<string, *>} properties Properties.
   * @param {number|string|undefined} id Feature id.
   */
  constructor(t, e, i, n, s, o) {
    this.styleFunction, this.extent_, this.id_ = o, this.type_ = t, this.flatCoordinates_ = e, this.flatInteriorPoints_ = null, this.flatMidpoints_ = null, this.ends_ = i || null, this.properties_ = s, this.squaredTolerance_, this.stride_ = n, this.simplifiedGeometry_;
  }
  /**
   * Get a feature property by its key.
   * @param {string} key Key
   * @return {*} Value for the requested key.
   * @api
   */
  get(t) {
    return this.properties_[t];
  }
  /**
   * Get the extent of this feature's geometry.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_ || (this.extent_ = this.type_ === "Point" ? Cn(this.flatCoordinates_) : oo(
      this.flatCoordinates_,
      0,
      this.flatCoordinates_.length,
      2
    )), this.extent_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoint() {
    if (!this.flatInteriorPoints_) {
      const t = Fe(this.getExtent());
      this.flatInteriorPoints_ = To(
        this.flatCoordinates_,
        0,
        this.ends_,
        2,
        t,
        0
      );
    }
    return this.flatInteriorPoints_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoints() {
    if (!this.flatInteriorPoints_) {
      const t = kf(this.flatCoordinates_, this.ends_), e = Lh(this.flatCoordinates_, 0, t, 2);
      this.flatInteriorPoints_ = Ih(
        this.flatCoordinates_,
        0,
        t,
        2,
        e
      );
    }
    return this.flatInteriorPoints_;
  }
  /**
   * @return {Array<number>} Flat midpoint.
   */
  getFlatMidpoint() {
    return this.flatMidpoints_ || (this.flatMidpoints_ = Mr(
      this.flatCoordinates_,
      0,
      this.flatCoordinates_.length,
      2,
      0.5
    )), this.flatMidpoints_;
  }
  /**
   * @return {Array<number>} Flat midpoints.
   */
  getFlatMidpoints() {
    if (!this.flatMidpoints_) {
      this.flatMidpoints_ = [];
      const t = this.flatCoordinates_;
      let e = 0;
      const i = (
        /** @type {Array<number>} */
        this.ends_
      );
      for (let n = 0, s = i.length; n < s; ++n) {
        const o = i[n], a = Mr(t, e, o, 2, 0.5);
        It(this.flatMidpoints_, a), e = o;
      }
    }
    return this.flatMidpoints_;
  }
  /**
   * Get the feature identifier.  This is a stable identifier for the feature and
   * is set when reading data from a remote source.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id_;
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getOrientedFlatCoordinates() {
    return this.flatCoordinates_;
  }
  /**
   * For API compatibility with {@link module:ol/Feature~Feature}, this method is useful when
   * determining the geometry type in style function (see {@link #getType}).
   * @return {RenderFeature} Feature.
   * @api
   */
  getGeometry() {
    return this;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {RenderFeature} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return this;
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {RenderFeature} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this;
  }
  /**
   * Get the feature properties.
   * @return {Object<string, *>} Feature properties.
   * @api
   */
  getProperties() {
    return this.properties_;
  }
  /**
   * Get an object of all property names and values.  This has the same behavior as getProperties,
   * but is here to conform with the {@link module:ol/Feature~Feature} interface.
   * @return {Object<string, *>?} Object.
   */
  getPropertiesInternal() {
    return this.properties_;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride_;
  }
  /**
   * @return {import('../style/Style.js').StyleFunction|undefined} Style
   */
  getStyleFunction() {
    return this.styleFunction;
  }
  /**
   * Get the type of this feature's geometry.
   * @return {Type} Geometry type.
   * @api
   */
  getType() {
    return this.type_;
  }
  /**
   * Transform geometry coordinates from tile pixel space to projected.
   *
   * @param {import("../proj.js").ProjectionLike} projection The data projection
   */
  transform(t) {
    t = rt(t);
    const e = t.getExtent(), i = t.getWorldExtent();
    if (e && i) {
      const n = de(i) / de(e);
      di(
        Qa,
        i[0],
        i[3],
        n,
        -n,
        0,
        0,
        0
      ), Ze(
        this.flatCoordinates_,
        0,
        this.flatCoordinates_.length,
        2,
        Qa,
        this.flatCoordinates_
      );
    }
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   */
  applyTransform(t) {
    t(this.flatCoordinates_, this.flatCoordinates_, this.stride_);
  }
  /**
   * @return {RenderFeature} A cloned render feature.
   */
  clone() {
    var t;
    return new Dt(
      this.type_,
      this.flatCoordinates_.slice(),
      (t = this.ends_) == null ? void 0 : t.slice(),
      this.stride_,
      Object.assign({}, this.properties_),
      this.id_
    );
  }
  /**
   * @return {Array<number>|null} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * Add transform and resolution based geometry simplification to this instance.
   * @return {RenderFeature} This render feature.
   */
  enableSimplifyTransformed() {
    return this.simplifyTransformed = Al((t, e) => {
      if (t === this.squaredTolerance_)
        return this.simplifiedGeometry_;
      this.simplifiedGeometry_ = this.clone(), e && this.simplifiedGeometry_.applyTransform(e);
      const i = this.simplifiedGeometry_.getFlatCoordinates();
      let n;
      switch (this.type_) {
        case "LineString":
          i.length = Xr(
            i,
            0,
            this.simplifiedGeometry_.flatCoordinates_.length,
            this.simplifiedGeometry_.stride_,
            t,
            i,
            0
          ), n = [i.length];
          break;
        case "MultiLineString":
          n = [], i.length = oh(
            i,
            0,
            this.simplifiedGeometry_.ends_,
            this.simplifiedGeometry_.stride_,
            t,
            i,
            0,
            n
          );
          break;
        case "Polygon":
          n = [], i.length = mo(
            i,
            0,
            this.simplifiedGeometry_.ends_,
            this.simplifiedGeometry_.stride_,
            Math.sqrt(t),
            i,
            0,
            n
          );
          break;
      }
      return n && (this.simplifiedGeometry_ = new Dt(
        this.type_,
        i,
        n,
        2,
        this.properties_,
        this.id_
      )), this.squaredTolerance_ = t, this.simplifiedGeometry_;
    }), this;
  }
}
Dt.prototype.getFlatCoordinates = Dt.prototype.getOrientedFlatCoordinates;
class zs {
  /**
   * @param {number} [maxEntries] Max entries.
   */
  constructor(t) {
    this.rbush_ = new fh(t), this.items_ = {};
  }
  /**
   * Insert a value into the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  insert(t, e) {
    const i = {
      minX: t[0],
      minY: t[1],
      maxX: t[2],
      maxY: t[3],
      value: e
    };
    this.rbush_.insert(i), this.items_[nt(e)] = i;
  }
  /**
   * Bulk-insert values into the RBush.
   * @param {Array<import("../extent.js").Extent>} extents Extents.
   * @param {Array<T>} values Values.
   */
  load(t, e) {
    const i = new Array(e.length);
    for (let n = 0, s = e.length; n < s; n++) {
      const o = t[n], a = e[n], l = {
        minX: o[0],
        minY: o[1],
        maxX: o[2],
        maxY: o[3],
        value: a
      };
      i[n] = l, this.items_[nt(a)] = l;
    }
    this.rbush_.load(i);
  }
  /**
   * Remove a value from the RBush.
   * @param {T} value Value.
   * @return {boolean} Removed.
   */
  remove(t) {
    const e = nt(t), i = this.items_[e];
    return delete this.items_[e], this.rbush_.remove(i) !== null;
  }
  /**
   * Update the extent of a value in the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  update(t, e) {
    const i = this.items_[nt(e)], n = [i.minX, i.minY, i.maxX, i.maxY];
    Wl(n, t) || (this.remove(e), this.insert(t, e));
  }
  /**
   * Return all values in the RBush.
   * @return {Array<T>} All.
   */
  getAll() {
    return this.rbush_.all().map(function(e) {
      return e.value;
    });
  }
  /**
   * Return all values in the given extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {Array<T>} All in extent.
   */
  getInExtent(t) {
    const e = {
      minX: t[0],
      minY: t[1],
      maxX: t[2],
      maxY: t[3]
    };
    return this.rbush_.search(e).map(function(n) {
      return n.value;
    });
  }
  /**
   * Calls a callback function with each value in the tree.
   * If the callback returns a truthy value, this value is returned without
   * checking the rest of the tree.
   * @param {function(T): R} callback Callback.
   * @return {R|undefined} Callback return value.
   * @template R
   */
  forEach(t) {
    return this.forEach_(this.getAll(), t);
  }
  /**
   * Calls a callback function with each value in the provided extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(T): R} callback Callback.
   * @return {R|undefined} Callback return value.
   * @template R
   */
  forEachInExtent(t, e) {
    return this.forEach_(this.getInExtent(t), e);
  }
  /**
   * @param {Array<T>} values Values.
   * @param {function(T): R} callback Callback.
   * @return {R|undefined} Callback return value.
   * @template R
   * @private
   */
  forEach_(t, e) {
    let i;
    for (let n = 0, s = t.length; n < s; n++)
      if (i = e(t[n]), i)
        return i;
    return i;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return ci(this.items_);
  }
  /**
   * Remove all values from the RBush.
   */
  clear() {
    this.rbush_.clear(), this.items_ = {};
  }
  /**
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} Extent.
   */
  getExtent(t) {
    const e = this.rbush_.toJSON();
    return ne(e.minX, e.minY, e.maxX, e.maxY, t);
  }
  /**
   * @param {RBush<T>} rbush R-Tree.
   */
  concat(t) {
    this.rbush_.load(t.rbush_.all());
    for (const e in t.items_)
      this.items_[e] = t.items_[e];
  }
}
class ng extends Ae {
  /**
   * @param {Options} options Source options.
   */
  constructor(t) {
    super(), this.projection = rt(t.projection), this.attributions_ = tl(t.attributions), this.attributionsCollapsible_ = t.attributionsCollapsible ?? !0, this.loading = !1, this.state_ = t.state !== void 0 ? t.state : "ready", this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1, this.interpolate_ = !!t.interpolate, this.viewResolver = null, this.viewRejector = null;
    const e = this;
    this.viewPromise_ = new Promise(function(i, n) {
      e.viewResolver = i, e.viewRejector = n;
    });
  }
  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   * @api
   */
  getAttributions() {
    return this.attributions_;
  }
  /**
   * @return {boolean} Attributions are collapsible.
   * @api
   */
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default|null} Projection.
   * @api
   */
  getProjection() {
    return this.projection;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(t) {
    return null;
  }
  /**
   * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
   */
  getView() {
    return this.viewPromise_;
  }
  /**
   * Get the state of the source, see {@link import("./Source.js").State} for possible states.
   * @return {import("./Source.js").State} State.
   * @api
   */
  getState() {
    return this.state_;
  }
  /**
   * @return {boolean|undefined} Wrap X.
   */
  getWrapX() {
    return this.wrapX_;
  }
  /**
   * @return {boolean} Use linear interpolation when resampling.
   */
  getInterpolate() {
    return this.interpolate_;
  }
  /**
   * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
   * @api
   */
  refresh() {
    this.changed();
  }
  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
   *     or `undefined`.
   * @api
   */
  setAttributions(t) {
    this.attributions_ = tl(t), this.changed();
  }
  /**
   * Set the state of the source.
   * @param {import("./Source.js").State} state State.
   */
  setState(t) {
    this.state_ = t, this.changed();
  }
}
function tl(r) {
  return r ? typeof r == "function" ? r : (Array.isArray(r) || (r = [r]), (t) => r) : null;
}
const vt = {
  /**
   * Triggered when a feature is added to the source.
   * @event module:ol/source/Vector.VectorSourceEvent#addfeature
   * @api
   */
  ADDFEATURE: "addfeature",
  /**
   * Triggered when a feature is updated.
   * @event module:ol/source/Vector.VectorSourceEvent#changefeature
   * @api
   */
  CHANGEFEATURE: "changefeature",
  /**
   * Triggered when the clear method is called on the source.
   * @event module:ol/source/Vector.VectorSourceEvent#clear
   * @api
   */
  CLEAR: "clear",
  /**
   * Triggered when a feature is removed from the source.
   * See {@link module:ol/source/Vector~VectorSource#clear source.clear()} for exceptions.
   * @event module:ol/source/Vector.VectorSourceEvent#removefeature
   * @api
   */
  REMOVEFEATURE: "removefeature",
  /**
   * Triggered when features starts loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadstart
   * @api
   */
  FEATURESLOADSTART: "featuresloadstart",
  /**
   * Triggered when features finishes loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadend
   * @api
   */
  FEATURESLOADEND: "featuresloadend",
  /**
   * Triggered if feature loading results in an error.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloaderror
   * @api
   */
  FEATURESLOADERROR: "featuresloaderror"
};
class De extends fe {
  /**
   * @param {string} type Type.
   * @param {FeatureType} [feature] Feature.
   * @param {Array<FeatureType>} [features] Features.
   */
  constructor(t, e, i) {
    super(t), this.feature = e, this.features = i;
  }
}
class Wn extends ng {
  /**
   * @param {Options<FeatureType>} [options] Vector source options.
   */
  constructor(t) {
    t = t || {}, super({
      attributions: t.attributions,
      interpolate: !0,
      projection: void 0,
      state: "ready",
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0
    }), this.on, this.once, this.un, this.loader_ = pr, this.format_ = t.format || null, this.overlaps_ = t.overlaps === void 0 ? !0 : t.overlaps, this.url_ = t.url, t.loader !== void 0 ? this.loader_ = t.loader : this.url_ !== void 0 && (at(this.format_, "`format` must be set when `url` is set"), this.loader_ = Ja(this.url_, this.format_)), this.strategy_ = t.strategy !== void 0 ? t.strategy : tg;
    const e = t.useSpatialIndex !== void 0 ? t.useSpatialIndex : !0;
    this.featuresRtree_ = e ? new zs() : null, this.loadedExtentsRtree_ = new zs(), this.loadingExtentsCount_ = 0, this.nullGeometryFeatures_ = {}, this.idIndex_ = {}, this.uidIndex_ = {}, this.featureChangeKeys_ = {}, this.featuresCollection_ = null;
    let i, n;
    Array.isArray(t.features) ? n = t.features : t.features && (i = t.features, n = i.getArray()), !e && i === void 0 && (i = new oi(n)), n !== void 0 && this.addFeaturesInternal(n), i !== void 0 && this.bindFeaturesCollection_(i);
  }
  /**
   * Add a single feature to the source.  If you want to add a batch of features
   * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
   * instead. A feature will not be added to the source if feature with
   * the same id is already there. The reason for this behavior is to avoid
   * feature duplication when using bbox or tile loading strategies.
   * Note: this also applies if a {@link module:ol/Collection~Collection} is used for features,
   * meaning that if a feature with a duplicate id is added in the collection, it will
   * be removed from it right away.
   * @param {FeatureType} feature Feature to add.
   * @api
   */
  addFeature(t) {
    this.addFeatureInternal(t), this.changed();
  }
  /**
   * Add a feature without firing a `change` event.
   * @param {FeatureType} feature Feature.
   * @protected
   */
  addFeatureInternal(t) {
    const e = nt(t);
    if (!this.addToIndex_(e, t)) {
      this.featuresCollection_ && this.featuresCollection_.remove(t);
      return;
    }
    this.setupChangeEvents_(e, t);
    const i = t.getGeometry();
    if (i) {
      const n = i.getExtent();
      this.featuresRtree_ && this.featuresRtree_.insert(n, t);
    } else
      this.nullGeometryFeatures_[e] = t;
    this.dispatchEvent(
      new De(vt.ADDFEATURE, t)
    );
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {FeatureType} feature The feature.
   * @private
   */
  setupChangeEvents_(t, e) {
    e instanceof Dt || (this.featureChangeKeys_[t] = [
      ue(e, Rt.CHANGE, this.handleFeatureChange_, this),
      ue(
        e,
        bl.PROPERTYCHANGE,
        this.handleFeatureChange_,
        this
      )
    ]);
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {FeatureType} feature The feature.
   * @return {boolean} The feature is "valid", in the sense that it is also a
   *     candidate for insertion into the Rtree.
   * @private
   */
  addToIndex_(t, e) {
    let i = !0;
    if (e.getId() !== void 0) {
      const n = String(e.getId());
      if (!(n in this.idIndex_))
        this.idIndex_[n] = e;
      else if (e instanceof Dt) {
        const s = this.idIndex_[n];
        s instanceof Dt ? Array.isArray(s) ? s.push(e) : this.idIndex_[n] = [s, e] : i = !1;
      } else
        i = !1;
    }
    return i && (at(
      !(t in this.uidIndex_),
      "The passed `feature` was already added to the source"
    ), this.uidIndex_[t] = e), i;
  }
  /**
   * Add a batch of features to the source.
   * @param {Array<FeatureType>} features Features to add.
   * @api
   */
  addFeatures(t) {
    this.addFeaturesInternal(t), this.changed();
  }
  /**
   * Add features without firing a `change` event.
   * @param {Array<FeatureType>} features Features.
   * @protected
   */
  addFeaturesInternal(t) {
    const e = [], i = [], n = [];
    for (let s = 0, o = t.length; s < o; s++) {
      const a = t[s], l = nt(a);
      this.addToIndex_(l, a) && i.push(a);
    }
    for (let s = 0, o = i.length; s < o; s++) {
      const a = i[s], l = nt(a);
      this.setupChangeEvents_(l, a);
      const c = a.getGeometry();
      if (c) {
        const h = c.getExtent();
        e.push(h), n.push(a);
      } else
        this.nullGeometryFeatures_[l] = a;
    }
    if (this.featuresRtree_ && this.featuresRtree_.load(e, n), this.hasListener(vt.ADDFEATURE))
      for (let s = 0, o = i.length; s < o; s++)
        this.dispatchEvent(
          new De(vt.ADDFEATURE, i[s])
        );
  }
  /**
   * @param {!Collection<FeatureType>} collection Collection.
   * @private
   */
  bindFeaturesCollection_(t) {
    let e = !1;
    this.addEventListener(
      vt.ADDFEATURE,
      /**
       * @param {VectorSourceEvent<FeatureType>} evt The vector source event
       */
      function(i) {
        e || (e = !0, t.push(i.feature), e = !1);
      }
    ), this.addEventListener(
      vt.REMOVEFEATURE,
      /**
       * @param {VectorSourceEvent<FeatureType>} evt The vector source event
       */
      function(i) {
        e || (e = !0, t.remove(i.feature), e = !1);
      }
    ), t.addEventListener(
      $t.ADD,
      /**
       * @param {import("../Collection.js").CollectionEvent<FeatureType>} evt The collection event
       */
      (i) => {
        e || (e = !0, this.addFeature(i.element), e = !1);
      }
    ), t.addEventListener(
      $t.REMOVE,
      /**
       * @param {import("../Collection.js").CollectionEvent<FeatureType>} evt The collection event
       */
      (i) => {
        e || (e = !0, this.removeFeature(i.element), e = !1);
      }
    ), this.featuresCollection_ = t;
  }
  /**
   * Remove all features from the source.
   * @param {boolean} [fast] Skip dispatching of {@link module:ol/source/Vector.VectorSourceEvent#event:removefeature} events.
   * @api
   */
  clear(t) {
    if (t) {
      for (const i in this.featureChangeKeys_)
        this.featureChangeKeys_[i].forEach(Se);
      this.featuresCollection_ || (this.featureChangeKeys_ = {}, this.idIndex_ = {}, this.uidIndex_ = {});
    } else if (this.featuresRtree_) {
      this.featuresRtree_.forEach((i) => {
        this.removeFeatureInternal(i);
      });
      for (const i in this.nullGeometryFeatures_)
        this.removeFeatureInternal(this.nullGeometryFeatures_[i]);
    }
    this.featuresCollection_ && this.featuresCollection_.clear(), this.featuresRtree_ && this.featuresRtree_.clear(), this.nullGeometryFeatures_ = {};
    const e = new De(vt.CLEAR);
    this.dispatchEvent(e), this.changed();
  }
  /**
   * Iterate through all features on the source, calling the provided callback
   * with each one.  If the callback returns any "truthy" value, iteration will
   * stop and the function will return the same value.
   * Note: this function only iterate through the feature that have a defined geometry.
   *
   * @param {function(FeatureType): T} callback Called with each feature
   *     on the source.  Return a truthy value to stop iteration.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeature(t) {
    if (this.featuresRtree_)
      return this.featuresRtree_.forEach(t);
    this.featuresCollection_ && this.featuresCollection_.forEach(t);
  }
  /**
   * Iterate through all features whose geometries contain the provided
   * coordinate, calling the callback with each feature.  If the callback returns
   * a "truthy" value, iteration will stop and the function will return the same
   * value.
   *
   * For {@link module:ol/render/Feature~RenderFeature} features, the callback will be
   * called for all features.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(FeatureType): T} callback Called with each feature
   *     whose goemetry contains the provided coordinate.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   */
  forEachFeatureAtCoordinateDirect(t, e) {
    const i = [t[0], t[1], t[0], t[1]];
    return this.forEachFeatureInExtent(i, function(n) {
      const s = n.getGeometry();
      if (s instanceof Dt || s.intersectsCoordinate(t))
        return e(n);
    });
  }
  /**
   * Iterate through all features whose bounding box intersects the provided
   * extent (note that the feature's geometry may not intersect the extent),
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you are interested in features whose geometry intersects an extent, call
   * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
   *
   * When `useSpatialIndex` is set to false, this method will loop through all
   * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(FeatureType): T} callback Called with each feature
   *     whose bounding box intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureInExtent(t, e) {
    if (this.featuresRtree_)
      return this.featuresRtree_.forEachInExtent(t, e);
    this.featuresCollection_ && this.featuresCollection_.forEach(e);
  }
  /**
   * Iterate through all features whose geometry intersects the provided extent,
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you only want to test for bounding box intersection, call the
   * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(FeatureType): T} callback Called with each feature
   *     whose geometry intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureIntersectingExtent(t, e) {
    return this.forEachFeatureInExtent(
      t,
      /**
       * @param {FeatureType} feature Feature.
       * @return {T|undefined} The return value from the last call to the callback.
       */
      function(i) {
        const n = i.getGeometry();
        if (n instanceof Dt || n.intersectsExtent(t)) {
          const s = e(i);
          if (s)
            return s;
        }
      }
    );
  }
  /**
   * Get the features collection associated with this source. Will be `null`
   * unless the source was configured with `useSpatialIndex` set to `false`, or
   * with a {@link module:ol/Collection~Collection} as `features`.
   * @return {Collection<FeatureType>|null} The collection of features.
   * @api
   */
  getFeaturesCollection() {
    return this.featuresCollection_;
  }
  /**
   * Get a snapshot of the features currently on the source in random order. The returned array
   * is a copy, the features are references to the features in the source.
   * @return {Array<FeatureType>} Features.
   * @api
   */
  getFeatures() {
    let t;
    return this.featuresCollection_ ? t = this.featuresCollection_.getArray().slice(0) : this.featuresRtree_ && (t = this.featuresRtree_.getAll(), ci(this.nullGeometryFeatures_) || It(t, Object.values(this.nullGeometryFeatures_))), t;
  }
  /**
   * Get all features whose geometry intersects the provided coordinate.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {Array<FeatureType>} Features.
   * @api
   */
  getFeaturesAtCoordinate(t) {
    const e = [];
    return this.forEachFeatureAtCoordinateDirect(t, function(i) {
      e.push(i);
    }), e;
  }
  /**
   * Get all features whose bounding box intersects the provided extent.  Note that this returns an array of
   * all features intersecting the given extent in random order (so it may include
   * features whose geometries do not intersect the extent).
   *
   * When `useSpatialIndex` is set to false, this method will return all
   * features.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {import("../proj/Projection.js").default} [projection] Include features
   * where `extent` exceeds the x-axis bounds of `projection` and wraps around the world.
   * @return {Array<FeatureType>} Features.
   * @api
   */
  getFeaturesInExtent(t, e) {
    if (this.featuresRtree_) {
      if (!(e && e.canWrapX() && this.getWrapX()))
        return this.featuresRtree_.getInExtent(t);
      const n = ru(t, e);
      return [].concat(
        ...n.map((s) => this.featuresRtree_.getInExtent(s))
      );
    }
    return this.featuresCollection_ ? this.featuresCollection_.getArray().slice(0) : [];
  }
  /**
   * Get the closest feature to the provided coordinate.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false` and the features in this source are of type
   * {@link module:ol/Feature~Feature}.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(FeatureType):boolean} [filter] Feature filter function.
   *     The filter function will receive one argument, the {@link module:ol/Feature~Feature feature}
   *     and it should return a boolean value. By default, no filtering is made.
   * @return {FeatureType|null} Closest feature (or `null` if none found).
   * @api
   */
  getClosestFeatureToCoordinate(t, e) {
    const i = t[0], n = t[1];
    let s = null;
    const o = [NaN, NaN];
    let a = 1 / 0;
    const l = [-1 / 0, -1 / 0, 1 / 0, 1 / 0];
    return e = e || hi, this.featuresRtree_.forEachInExtent(
      l,
      /**
       * @param {FeatureType} feature Feature.
       */
      function(c) {
        if (e(c)) {
          const h = c.getGeometry(), u = a;
          if (a = h instanceof Dt ? 0 : h.closestPointXY(i, n, o, a), a < u) {
            s = c;
            const d = Math.sqrt(a);
            l[0] = i - d, l[1] = n - d, l[2] = i + d, l[3] = n + d;
          }
        }
      }
    ), s;
  }
  /**
   * Get the extent of the features currently in the source.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false`.
   * @param {import("../extent.js").Extent} [extent] Destination extent. If provided, no new extent
   *     will be created. Instead, that extent's coordinates will be overwritten.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent(t) {
    return this.featuresRtree_.getExtent(t);
  }
  /**
   * Get a feature by its identifier (the value returned by feature.getId()). When `RenderFeature`s
   * are used, `getFeatureById()` can return an array of `RenderFeature`s. This allows for handling
   * of `GeometryCollection` geometries, where format readers create one `RenderFeature` per
   * `GeometryCollection` member.
   * Note that the index treats string and numeric identifiers as the same.  So
   * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
   *
   * @param {string|number} id Feature identifier.
   * @return {FeatureClassOrArrayOfRenderFeatures<FeatureType>|null} The feature (or `null` if not found).
   * @api
   */
  getFeatureById(t) {
    const e = this.idIndex_[t.toString()];
    return e !== void 0 ? (
      /** @type {FeatureClassOrArrayOfRenderFeatures<FeatureType>} */
      e
    ) : null;
  }
  /**
   * Get a feature by its internal unique identifier (using `getUid`).
   *
   * @param {string} uid Feature identifier.
   * @return {FeatureType|null} The feature (or `null` if not found).
   */
  getFeatureByUid(t) {
    const e = this.uidIndex_[t];
    return e !== void 0 ? e : null;
  }
  /**
   * Get the format associated with this source.
   *
   * @return {import("../format/Feature.js").default<FeatureType>|null}} The feature format.
   * @api
   */
  getFormat() {
    return this.format_;
  }
  /**
   * @return {boolean} The source can have overlapping geometries.
   */
  getOverlaps() {
    return this.overlaps_;
  }
  /**
   * Get the url associated with this source.
   *
   * @return {string|import("../featureloader.js").FeatureUrlFunction|undefined} The url.
   * @api
   */
  getUrl() {
    return this.url_;
  }
  /**
   * @param {Event} event Event.
   * @private
   */
  handleFeatureChange_(t) {
    const e = (
      /** @type {FeatureType} */
      t.target
    ), i = nt(e), n = e.getGeometry();
    if (!n)
      i in this.nullGeometryFeatures_ || (this.featuresRtree_ && this.featuresRtree_.remove(e), this.nullGeometryFeatures_[i] = e);
    else {
      const o = n.getExtent();
      i in this.nullGeometryFeatures_ ? (delete this.nullGeometryFeatures_[i], this.featuresRtree_ && this.featuresRtree_.insert(o, e)) : this.featuresRtree_ && this.featuresRtree_.update(o, e);
    }
    const s = e.getId();
    if (s !== void 0) {
      const o = s.toString();
      this.idIndex_[o] !== e && (this.removeFromIdIndex_(e), this.idIndex_[o] = e);
    } else
      this.removeFromIdIndex_(e), this.uidIndex_[i] = e;
    this.changed(), this.dispatchEvent(
      new De(vt.CHANGEFEATURE, e)
    );
  }
  /**
   * Returns true if the feature is contained within the source.
   * @param {FeatureType} feature Feature.
   * @return {boolean} Has feature.
   * @api
   */
  hasFeature(t) {
    const e = t.getId();
    return e !== void 0 ? e in this.idIndex_ : nt(t) in this.uidIndex_;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.featuresRtree_ ? this.featuresRtree_.isEmpty() && ci(this.nullGeometryFeatures_) : this.featuresCollection_ ? this.featuresCollection_.getLength() === 0 : !0;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  loadFeatures(t, e, i) {
    const n = this.loadedExtentsRtree_, s = this.strategy_(t, e, i);
    for (let o = 0, a = s.length; o < a; ++o) {
      const l = s[o];
      n.forEachInExtent(
        l,
        /**
         * @param {{extent: import("../extent.js").Extent}} object Object.
         * @return {boolean} Contains.
         */
        function(h) {
          return cn(h.extent, l);
        }
      ) || (++this.loadingExtentsCount_, this.dispatchEvent(
        new De(vt.FEATURESLOADSTART)
      ), this.loader_.call(
        this,
        l,
        e,
        i,
        /**
         * @param {Array<FeatureType>} features Loaded features
         */
        (h) => {
          --this.loadingExtentsCount_, this.dispatchEvent(
            new De(
              vt.FEATURESLOADEND,
              void 0,
              h
            )
          );
        },
        () => {
          --this.loadingExtentsCount_, this.dispatchEvent(
            new De(vt.FEATURESLOADERROR)
          );
        }
      ), n.insert(l, { extent: l.slice() }));
    }
    this.loading = this.loader_.length < 4 ? !1 : this.loadingExtentsCount_ > 0;
  }
  /**
   * @override
   */
  refresh() {
    this.clear(!0), this.loadedExtentsRtree_.clear(), super.refresh();
  }
  /**
   * Remove an extent from the list of loaded extents.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  removeLoadedExtent(t) {
    const e = this.loadedExtentsRtree_, i = e.forEachInExtent(t, function(n) {
      if (Wl(n.extent, t))
        return n;
    });
    i && e.remove(i);
  }
  /**
   * Batch remove features from the source.  If you want to remove all features
   * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
   * instead.
   * @param {Array<FeatureType>} features Features to remove.
   * @api
   */
  removeFeatures(t) {
    let e = !1;
    for (let i = 0, n = t.length; i < n; ++i)
      e = this.removeFeatureInternal(t[i]) || e;
    e && this.changed();
  }
  /**
   * Remove a single feature from the source. If you want to batch remove
   * features, use the {@link module:ol/source/Vector~VectorSource#removeFeatures #removeFeatures()} method
   * instead.
   * @param {FeatureType} feature Feature to remove.
   * @api
   */
  removeFeature(t) {
    if (!t)
      return;
    this.removeFeatureInternal(t) && this.changed();
  }
  /**
   * Remove feature without firing a `change` event.
   * @param {FeatureType} feature Feature.
   * @return {boolean} True if the feature was removed, false if it was not found.
   * @protected
   */
  removeFeatureInternal(t) {
    const e = nt(t);
    if (!(e in this.uidIndex_))
      return !1;
    e in this.nullGeometryFeatures_ ? delete this.nullGeometryFeatures_[e] : this.featuresRtree_ && this.featuresRtree_.remove(t);
    const i = this.featureChangeKeys_[e];
    i == null || i.forEach(Se), delete this.featureChangeKeys_[e];
    const n = t.getId();
    if (n !== void 0) {
      const s = n.toString(), o = this.idIndex_[s];
      o === t ? delete this.idIndex_[s] : Array.isArray(o) && (o.splice(o.indexOf(t), 1), o.length === 1 && (this.idIndex_[s] = o[0]));
    }
    return delete this.uidIndex_[e], this.hasListener(vt.REMOVEFEATURE) && this.dispatchEvent(
      new De(vt.REMOVEFEATURE, t)
    ), !0;
  }
  /**
   * Remove a feature from the id index.  Called internally when the feature id
   * may have changed.
   * @param {FeatureType} feature The feature.
   * @private
   */
  removeFromIdIndex_(t) {
    for (const e in this.idIndex_)
      if (this.idIndex_[e] === t) {
        delete this.idIndex_[e];
        break;
      }
  }
  /**
   * Set the new loader of the source. The next render cycle will use the
   * new loader.
   * @param {import("../featureloader.js").FeatureLoader} loader The loader to set.
   * @api
   */
  setLoader(t) {
    this.loader_ = t;
  }
  /**
   * Points the source to a new url. The next render cycle will use the new url.
   * @param {string|import("../featureloader.js").FeatureUrlFunction} url Url.
   * @api
   */
  setUrl(t) {
    at(this.format_, "`format` must be set when `url` is set"), this.url_ = t, this.setLoader(Ja(t, this.format_));
  }
  /**
   * @param {boolean} overlaps The source can have overlapping geometries.
   */
  setOverlaps(t) {
    this.overlaps_ = t, this.changed();
  }
}
class Ym {
  constructor(t, e, i = {}) {
    this.storage = t, this.layerGroup = e, this.options = i, this.CACHE_PREFIX = "raster:cache:", this.ORDER_KEY = "raster:cache:order", this.LAYER_NAME = "GEOGRAPHICALGRIDSYSTEMS.MAPS", this._eventManager = new On(), this.extentManager = new su(t), this.silentErrors = i.silentErrors ?? !1, this.currentErrors = /* @__PURE__ */ new Set(), this.extentLayer = new $i({
      source: new Wn(),
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
    const t = this.options.cacheRoot || "", e = this.options.dirName || "geoportail";
    return `${t}${e}/`;
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
    var s;
    const t = this.layerGroup.getLayers().getArray(), e = await this.storage.getMetadata(this.ORDER_KEY);
    if (!e || !((s = e.extra) != null && s.order))
      return;
    const i = e.extra.order, n = [...t].sort((o, a) => {
      const l = o.get("name"), c = a.get("name"), h = i.findIndex((d) => l === `cache_${d}`), u = i.findIndex((d) => c === `cache_${d}`);
      return h - u;
    });
    JSON.stringify(t) !== JSON.stringify(n) && (this.layerGroup.getLayers().clear(), n.forEach((o) => this.layerGroup.getLayers().push(o)));
  }
  /**
   * Saves the current cache layer order to storage
   */
  async saveCacheOrder() {
    const e = (await this.storage.listMetadata(this.CACHE_PREFIX)).map((i) => i.id.replace(this.CACHE_PREFIX, ""));
    await this.storage.saveMetadata(this.ORDER_KEY, {
      id: this.ORDER_KEY,
      name: "Cache Order",
      type: "raster",
      created: /* @__PURE__ */ new Date(),
      modified: /* @__PURE__ */ new Date(),
      size: 0,
      extra: { order: e }
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
  async createCache(t) {
    const e = {};
    return await this.storage.saveMetadata(e.id, e), await this.saveCacheOrder(), t.id;
  }
  /**
   * Deletes a cache and all its associated data
   * @param id - Cache ID to delete
   */
  async deleteCache(t) {
    const e = this.CACHE_PREFIX + t;
    if (!await this.storage.getMetadata(e))
      throw new Error(`Cache ${t} not found`);
    const n = await this.storage.listTiles(e);
    await Promise.all(n.map((s) => this.storage.deleteTile(s))), await this.storage.deleteMetadata(e), await this.removeCacheLayer(t), await this.saveCacheOrder();
  }
  /**
   * Loads a cache as a layer in the layer group
   * @param id - Cache ID to load
   */
  async loadCache(t) {
    const e = this.CACHE_PREFIX + t;
    if (!await this.storage.getMetadata(e))
      throw new Error(`Cache ${t} not found`);
    await this.addCacheLayer(t, this.layerGroup);
  }
  /**
   * Starts downloading tiles for a cache
   * @param id - Cache ID to start downloading
   * @returns Promise that resolves when download starts (currently not implemented)
   * 
   * @todo Implement actual download logic with TileCache integration
   */
  async startDownload(t) {
    this.currentCacheId = t, this.currentErrors.clear(), console.warn(`startDownload(${t}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:download:start", { id: t, status: "not_implemented" });
  }
  /**
   * Pauses an ongoing cache download
   * @param id - Cache ID to pause
   * @returns Promise that resolves when download is paused (currently not implemented)
   * 
   * @todo Implement pause logic with TileCache integration
   */
  async pauseDownload(t) {
    if (this.currentCacheId !== t) {
      console.warn(`pauseDownload(${t}): No active download for this cache`);
      return;
    }
    console.warn(`pauseDownload(${t}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:download:pause", { id: t, status: "not_implemented" });
  }
  /**
   * Cancels an ongoing cache download
   * @param id - Cache ID to cancel
   * @returns Promise that resolves when download is cancelled (currently not implemented)
   * 
   * @todo Implement cancel logic with TileCache integration
   */
  async cancelDownload(t) {
    if (this.currentCacheId !== t) {
      console.warn(`cancelDownload(${t}): No active download for this cache`);
      return;
    }
    this.currentCacheId = void 0, this.currentErrors.clear(), console.warn(`cancelDownload(${t}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:download:cancel", { id: t, status: "not_implemented" });
  }
  /**
   * Gets the download progress for a cache
   * @param id - Cache ID
   * @returns Progress information
   */
  async getDownloadProgress(t) {
    var n, s, o, a;
    const e = this.CACHE_PREFIX + t, i = await this.storage.getMetadata(e);
    if (!i)
      throw new Error(`Cache ${t} not found`);
    return {
      id: t,
      type: "raster",
      total: ((n = i.extra) == null ? void 0 : n.totalTiles) || 0,
      current: i.tileCount || 0,
      percent: (s = i.extra) != null && s.totalTiles ? (i.tileCount || 0) / i.extra.totalTiles * 100 : 0,
      status: ((o = i.extra) == null ? void 0 : o.downloadStatus) || "complete",
      bytesDownloaded: i.size,
      bytesTotal: ((a = i.extra) == null ? void 0 : a.estimatedSize) || 0
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
  async addCacheLayer(t, e) {
    console.warn(`addCacheLayer(${t}): Not yet implemented - requires TileCache integration`), this._eventManager.emit("cache:layer:add", { id: t, status: "not_implemented" });
  }
  /**
   * Removes a cache layer from the layer group
   * @param id - Cache ID
   */
  async removeCacheLayer(t) {
    const i = this.layerGroup.getLayers().getArray().find((n) => n.get("name") === `cache_${t}`);
    i && this.layerGroup.getLayers().remove(i);
  }
}
function rg(r) {
  const t = Object.keys(r.defs), e = t.length;
  let i, n;
  for (i = 0; i < e; ++i) {
    const s = t[i];
    if (!gr(s)) {
      const o = r.defs(s);
      let a = (
        /** @type {import("./Units.js").Units} */
        o.units
      );
      !a && o.projName === "longlat" && (a = "degrees"), Sr(
        new Ur({
          code: s,
          axisOrientation: o.axis,
          metersPerUnit: o.to_meter,
          units: a
        })
      );
    }
  }
  for (i = 0; i < e; ++i) {
    const s = t[i], o = gr(s);
    for (n = 0; n < e; ++n) {
      const a = t[n], l = gr(a);
      if (!mr(s, a))
        if (r.defs[s] === r.defs[a])
          Gs([o, l]);
        else {
          const c = r(s, a);
          Du(
            o,
            l,
            Ta(o, l, c.forward),
            Ta(l, o, c.inverse)
          );
        }
    }
  }
}
class sg {
  /**
   * Initialize all French projections
   * Define projections if not already defined
   */
  initProjections() {
    ot.defs("EPSG:2154") || ot.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("IGNF:LAMB93") || ot.defs("IGNF:LAMB93", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("EPSG:27572") || ot.defs("EPSG:27572", "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs"), ot.defs("EPSG:2975") || ot.defs("EPSG:2975", "+proj=utm +zone=40 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("EPSG:4467") || ot.defs("EPSG:4467", "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("EPSG:4559") || ot.defs("EPSG:4559", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("EPSG:5490") || ot.defs("EPSG:5490", "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("EPSG:2972") || ot.defs("EPSG:2972", "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), ot.defs("EPSG:EPSG:4471") || ot.defs("EPSG:4471", "+proj=utm +zone=38 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"), rg(ot);
  }
  registerCustomProjection(t, e) {
    ot.defs(t) || ot.defs(t, e);
  }
  /**
   * Transform coordinates from one projection to another
   * @param coords - Coordinates as [x, y] or [longitude, latitude]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed coordinates as [x, y]
   */
  transformCoordinates(t, e, i) {
    const n = ot(e, i, t);
    return [n[0], n[1]];
  }
  /**
   * Transform an extent from one projection to another
   * @param extent - Extent as [minX, minY, maxX, maxY]
   * @param fromProj - Source projection code (e.g., 'EPSG:4326')
   * @param toProj - Target projection code (e.g., 'EPSG:2154')
   * @returns Transformed extent as [minX, minY, maxX, maxY]
   */
  transformExtent(t, e, i) {
    const [n, s, o, a] = t, l = ot(e, i, [n, s]), c = ot(e, i, [o, s]), h = ot(e, i, [n, a]), u = ot(e, i, [o, a]), d = Math.min(l[0], c[0], h[0], u[0]), f = Math.min(l[1], c[1], h[1], u[1]), g = Math.max(l[0], c[0], h[0], u[0]), m = Math.max(l[1], c[1], h[1], u[1]);
    return [d, f, g, m];
  }
  constructor() {
    this.initProjections();
  }
}
const Ii = {
  TILE_SIZE: 256,
  MAX_FEATURES: 5e3,
  SRS_NAME: "IGNF:LAMB93",
  EDTION_CACHE_URL: "FILE/layer-edition-cache/"
  // check if it's ok
}, er = {
  TILE_SIZE: 256,
  MIN_ZOOM_INCREASE: 2,
  SRS_NAME: "EPSG:4326"
}, Zs = "EPSG:3857";
class Oh {
  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  constructor(t, e, i, n) {
    this.minX = t, this.maxX = e, this.minY = i, this.maxY = n;
  }
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */
  contains(t) {
    return this.containsXY(t[1], t[2]);
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Contains.
   */
  containsTileRange(t) {
    return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY;
  }
  /**
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @return {boolean} Contains coordinate.
   */
  containsXY(t, e) {
    return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Equals.
   */
  equals(t) {
    return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   */
  extend(t) {
    t.minX < this.minX && (this.minX = t.minX), t.maxX > this.maxX && (this.maxX = t.maxX), t.minY < this.minY && (this.minY = t.minY), t.maxY > this.maxY && (this.maxY = t.maxY);
  }
  /**
   * @return {number} Height.
   */
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  /**
   * @return {import("./size.js").Size} Size.
   */
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  /**
   * @return {number} Width.
   */
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Intersects.
   */
  intersects(t) {
    return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY;
  }
}
function Ti(r, t, e, i, n) {
  return n !== void 0 ? (n.minX = r, n.maxX = t, n.minY = e, n.maxY = i, n) : new Oh(r, t, e, i);
}
function el(r, t, e, i) {
  return i !== void 0 ? (i[0] = r, i[1] = t, i[2] = e, i) : [r, t, e];
}
const Pi = [0, 0, 0], Ge = 5;
class og {
  /**
   * @param {Options} options Tile grid options.
   */
  constructor(t) {
    this.minZoom = t.minZoom !== void 0 ? t.minZoom : 0, this.resolutions_ = t.resolutions, at(
      Oc(
        this.resolutions_,
        /**
         * @param {number} a First resolution
         * @param {number} b Second resolution
         * @return {number} Comparison result
         */
        (n, s) => s - n
      ),
      "`resolutions` must be sorted in descending order"
    );
    let e;
    if (!t.origins) {
      for (let n = 0, s = this.resolutions_.length - 1; n < s; ++n)
        if (!e)
          e = this.resolutions_[n] / this.resolutions_[n + 1];
        else if (this.resolutions_[n] / this.resolutions_[n + 1] !== e) {
          e = void 0;
          break;
        }
    }
    this.zoomFactor_ = e, this.maxZoom = this.resolutions_.length - 1, this.origin_ = t.origin !== void 0 ? t.origin : null, this.origins_ = null, t.origins !== void 0 && (this.origins_ = t.origins, at(
      this.origins_.length == this.resolutions_.length,
      "Number of `origins` and `resolutions` must be equal"
    ));
    const i = t.extent;
    i !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = ao(i)), at(
      !this.origin_ && this.origins_ || this.origin_ && !this.origins_,
      "Either `origin` or `origins` must be configured, never both"
    ), this.tileSizes_ = null, t.tileSizes !== void 0 && (this.tileSizes_ = t.tileSizes, at(
      this.tileSizes_.length == this.resolutions_.length,
      "Number of `tileSizes` and `resolutions` must be equal"
    )), this.tileSize_ = t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : Ao, at(
      !this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_,
      "Either `tileSize` or `tileSizes` must be configured, never both"
    ), this.extent_ = i !== void 0 ? i : null, this.fullTileRanges_ = null, this.tmpSize_ = [0, 0], this.tmpExtent_ = [0, 0, 0, 0], t.sizes !== void 0 ? this.fullTileRanges_ = t.sizes.map((n, s) => {
      const o = new Oh(
        Math.min(0, n[0]),
        Math.max(n[0] - 1, -1),
        Math.min(0, n[1]),
        Math.max(n[1] - 1, -1)
      );
      if (i) {
        const a = this.getTileRangeForExtentAndZ(i, s);
        o.minX = Math.max(a.minX, o.minX), o.maxX = Math.min(a.maxX, o.maxX), o.minY = Math.max(a.minY, o.minY), o.maxY = Math.min(a.maxY, o.maxY);
      }
      return o;
    }) : i && this.calculateTileRanges_(i);
  }
  /**
   * Call a function with each tile coordinate for a given extent and zoom level.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} zoom Integer zoom level.
   * @param {function(import("../tilecoord.js").TileCoord): void} callback Function called with each tile coordinate.
   * @api
   */
  forEachTileCoord(t, e, i) {
    const n = this.getTileRangeForExtentAndZ(t, e);
    for (let s = n.minX, o = n.maxX; s <= o; ++s)
      for (let a = n.minY, l = n.maxY; a <= l; ++a)
        i([e, s, a]);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {function(number, import("../TileRange.js").default): boolean} callback Callback.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {boolean} Callback succeeded.
   */
  forEachTileCoordParentTileRange(t, e, i, n) {
    let s, o, a, l = null, c = t[0] - 1;
    for (this.zoomFactor_ === 2 ? (o = t[1], a = t[2]) : l = this.getTileCoordExtent(t, n); c >= this.minZoom; ) {
      if (o !== void 0 && a !== void 0 ? (o = Math.floor(o / 2), a = Math.floor(a / 2), s = Ti(o, o, a, a, i)) : s = this.getTileRangeForExtentAndZ(
        l,
        c,
        i
      ), e(c, s))
        return !0;
      --c;
    }
    return !1;
  }
  /**
   * Get the extent for this tile grid, if it was configured.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the maximum zoom level for the grid.
   * @return {number} Max zoom.
   * @api
   */
  getMaxZoom() {
    return this.maxZoom;
  }
  /**
   * Get the minimum zoom level for the grid.
   * @return {number} Min zoom.
   * @api
   */
  getMinZoom() {
    return this.minZoom;
  }
  /**
   * Get the origin for the grid at the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {import("../coordinate.js").Coordinate} Origin.
   * @api
   */
  getOrigin(t) {
    return this.origin_ ? this.origin_ : this.origins_[t];
  }
  /**
   * Get the resolution for the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {number} Resolution.
   * @api
   */
  getResolution(t) {
    return this.resolutions_[t];
  }
  /**
   * Get the list of resolutions for the tile grid.
   * @return {Array<number>} Resolutions.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileCoordChildTileRange(t, e, i) {
    if (t[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const s = t[1] * 2, o = t[2] * 2;
        return Ti(
          s,
          s + 1,
          o,
          o + 1,
          e
        );
      }
      const n = this.getTileCoordExtent(
        t,
        i || this.tmpExtent_
      );
      return this.getTileRangeForExtentAndZ(
        n,
        t[0] + 1,
        e
      );
    }
    return null;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileRangeForTileCoordAndZ(t, e, i) {
    if (e > this.maxZoom || e < this.minZoom)
      return null;
    const n = t[0], s = t[1], o = t[2];
    if (e === n)
      return Ti(
        s,
        o,
        s,
        o,
        i
      );
    if (this.zoomFactor_) {
      const l = Math.pow(this.zoomFactor_, e - n), c = Math.floor(s * l), h = Math.floor(o * l);
      if (e < n)
        return Ti(c, c, h, h, i);
      const u = Math.floor(l * (s + 1)) - 1, d = Math.floor(l * (o + 1)) - 1;
      return Ti(c, u, h, d, i);
    }
    const a = this.getTileCoordExtent(t, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(a, e, i);
  }
  /**
   * Get a tile range for the given extent and integer zoom level.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary tile range object.
   * @return {import("../TileRange.js").default} Tile range.
   */
  getTileRangeForExtentAndZ(t, e, i) {
    this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, Pi);
    const n = Pi[1], s = Pi[2];
    this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, Pi);
    const o = Pi[1], a = Pi[2];
    return Ti(n, o, s, a, i);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {import("../coordinate.js").Coordinate} Tile center.
   */
  getTileCoordCenter(t) {
    const e = this.getOrigin(t[0]), i = this.getResolution(t[0]), n = ie(this.getTileSize(t[0]), this.tmpSize_);
    return [
      e[0] + (t[1] + 0.5) * n[0] * i,
      e[1] - (t[2] + 0.5) * n[1] * i
    ];
  }
  /**
   * Get the extent of a tile coordinate.
   *
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary extent object.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getTileCoordExtent(t, e) {
    const i = this.getOrigin(t[0]), n = this.getResolution(t[0]), s = ie(this.getTileSize(t[0]), this.tmpSize_), o = i[0] + t[1] * s[0] * n, a = i[1] - (t[2] + 1) * s[1] * n, l = o + s[0] * n, c = a + s[1] * n;
    return ne(o, a, l, c, e);
  }
  /**
   * Get the tile coordinate for the given map coordinate and resolution.  This
   * method considers that coordinates that intersect tile boundaries should be
   * assigned the higher tile coordinate.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndResolution(t, e, i) {
    return this.getTileCoordForXYAndResolution_(
      t[0],
      t[1],
      e,
      !1,
      i
    );
  }
  /**
   * Note that this method should not be called for resolutions that correspond
   * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
   * @param {number} x X.
   * @param {number} y Y.
   * @param {number} resolution Resolution (for a non-integer zoom level).
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndResolution_(t, e, i, n, s) {
    const o = this.getZForResolution(i), a = i / this.getResolution(o), l = this.getOrigin(o), c = ie(this.getTileSize(o), this.tmpSize_);
    let h = a * (t - l[0]) / i / c[0], u = a * (l[1] - e) / i / c[1];
    return n ? (h = Vn(h, Ge) - 1, u = Vn(u, Ge) - 1) : (h = Zn(h, Ge), u = Zn(u, Ge)), el(o, h, u, s);
  }
  /**
   * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
   * they should have separate implementations.  This method is for integer zoom
   * levels.  The other method should only be called for resolutions corresponding
   * to non-integer zoom levels.
   * @param {number} x Map x coordinate.
   * @param {number} y Map y coordinate.
   * @param {number} z Integer zoom level.
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndZ_(t, e, i, n, s) {
    const o = this.getOrigin(i), a = this.getResolution(i), l = ie(this.getTileSize(i), this.tmpSize_);
    let c = (t - o[0]) / a / l[0], h = (o[1] - e) / a / l[1];
    return n ? (c = Vn(c, Ge) - 1, h = Vn(h, Ge) - 1) : (c = Zn(c, Ge), h = Zn(h, Ge)), el(i, c, h, s);
  }
  /**
   * Get a tile coordinate given a map coordinate and zoom level.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} z Integer zoom level, e.g. the result of a `getZForResolution()` method call
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndZ(t, e, i) {
    return this.getTileCoordForXYAndZ_(
      t[0],
      t[1],
      e,
      !1,
      i
    );
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {number} Tile resolution.
   */
  getTileCoordResolution(t) {
    return this.resolutions_[t[0]];
  }
  /**
   * Get the tile size for a zoom level. The type of the return value matches the
   * `tileSize` or `tileSizes` that the tile grid was configured with. To always
   * get an {@link import("../size.js").Size}, run the result through {@link module:ol/size.toSize}.
   * @param {number} z Z.
   * @return {number|import("../size.js").Size} Tile size.
   * @api
   */
  getTileSize(t) {
    return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t];
  }
  /**
   * @param {number} z Zoom level.
   * @return {import("../TileRange.js").default|null} Extent tile range for the specified zoom level.
   */
  getFullTileRange(t) {
    return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null;
  }
  /**
   * @param {number} resolution Resolution.
   * @param {number|import("../array.js").NearestDirectionFunction} [opt_direction]
   *     If 0, the nearest resolution will be used.
   *     If 1, the nearest higher resolution (lower Z) will be used. If -1, the
   *     nearest lower resolution (higher Z) will be used. Default is 0.
   *     Use a {@link module:ol/array~NearestDirectionFunction} for more precise control.
   *
   * For example to change tile Z at the midpoint of zoom levels
   * ```js
   * function(value, high, low) {
   *   return value - low * Math.sqrt(high / low);
   * }
   * ```
   * @return {number} Z.
   * @api
   */
  getZForResolution(t, e) {
    const i = io(
      this.resolutions_,
      t,
      e || 0
    );
    return ht(i, this.minZoom, this.maxZoom);
  }
  /**
   * The tile with the provided tile coordinate intersects the given viewport.
   * @param {import('../tilecoord.js').TileCoord} tileCoord Tile coordinate.
   * @param {Array<number>} viewport Viewport as returned from {@link module:ol/extent.getRotatedViewport}.
   * @return {boolean} The tile with the provided tile coordinate intersects the given viewport.
   */
  tileCoordIntersectsViewport(t, e) {
    return Ph(
      e,
      0,
      e.length,
      2,
      this.getTileCoordExtent(t)
    );
  }
  /**
   * @param {!import("../extent.js").Extent} extent Extent for this tile grid.
   * @private
   */
  calculateTileRanges_(t) {
    const e = this.resolutions_.length, i = new Array(e);
    for (let n = this.minZoom; n < e; ++n)
      i[n] = this.getTileRangeForExtentAndZ(t, n);
    this.fullTileRanges_ = i;
  }
}
function bh(r) {
  const t = r || {}, e = t.extent || rt("EPSG:3857").getExtent(), i = {
    extent: e,
    minZoom: t.minZoom,
    tileSize: t.tileSize,
    resolutions: ag(
      e,
      t.maxZoom,
      t.tileSize,
      t.maxResolution
    )
  };
  return new og(i);
}
function ag(r, t, e, i) {
  t = t !== void 0 ? t : Bf, e = ie(e !== void 0 ? e : Ao);
  const n = de(r), s = St(r);
  i = i > 0 ? i : Math.max(s / e[0], n / e[1]);
  const o = t + 1, a = new Array(o);
  for (let l = 0; l < o; ++l)
    a[l] = i / Math.pow(2, l);
  return a;
}
class Lo {
  constructor() {
    this.dataProjection = void 0, this.defaultFeatureProjection = void 0, this.featureClass = /** @type {FeatureToFeatureClass<FeatureType>} */
    Ct, this.supportedMediaTypes = null;
  }
  /**
   * Adds the data projection to the read options.
   * @param {Document|Element|Object|string} source Source.
   * @param {ReadOptions} [options] Options.
   * @return {ReadOptions|undefined} Options.
   * @protected
   */
  getReadOptions(t, e) {
    if (e) {
      let i = e.dataProjection ? rt(e.dataProjection) : this.readProjection(t);
      e.extent && i && i.getUnits() === "tile-pixels" && (i = rt(i), i.setWorldExtent(e.extent)), e = {
        dataProjection: i,
        featureProjection: e.featureProjection
      };
    }
    return this.adaptOptions(e);
  }
  /**
   * Sets the `dataProjection` on the options, if no `dataProjection`
   * is set.
   * @param {WriteOptions|ReadOptions|undefined} options
   *     Options.
   * @protected
   * @return {WriteOptions|ReadOptions|undefined}
   *     Updated options.
   */
  adaptOptions(t) {
    return Object.assign(
      {
        dataProjection: this.dataProjection,
        featureProjection: this.defaultFeatureProjection,
        featureClass: this.featureClass
      },
      t
    );
  }
  /**
   * @abstract
   * @return {Type} The format type.
   */
  getType() {
    return b();
  }
  /**
   * Read a single feature from a source.
   *
   * @abstract
   * @param {Document|Element|Object|string} source Source.
   * @param {ReadOptions} [options] Read options.
   * @return {FeatureType|Array<FeatureType>} Feature.
   */
  readFeature(t, e) {
    return b();
  }
  /**
   * Read all features from a source.
   *
   * @abstract
   * @param {Document|Element|ArrayBuffer|Object|string} source Source.
   * @param {ReadOptions} [options] Read options.
   * @return {Array<FeatureType>} Features.
   */
  readFeatures(t, e) {
    return b();
  }
  /**
   * Read a single geometry from a source.
   *
   * @abstract
   * @param {Document|Element|Object|string} source Source.
   * @param {ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometry(t, e) {
    return b();
  }
  /**
   * Read the projection from a source.
   *
   * @abstract
   * @param {Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default|undefined} Projection.
   */
  readProjection(t) {
    return b();
  }
  /**
   * Encode a feature in this format.
   *
   * @abstract
   * @param {Feature} feature Feature.
   * @param {WriteOptions} [options] Write options.
   * @return {string|ArrayBuffer} Result.
   */
  writeFeature(t, e) {
    return b();
  }
  /**
   * Encode an array of features in this format.
   *
   * @abstract
   * @param {Array<Feature>} features Features.
   * @param {WriteOptions} [options] Write options.
   * @return {string|ArrayBuffer} Result.
   */
  writeFeatures(t, e) {
    return b();
  }
  /**
   * Write a single geometry in this format.
   *
   * @abstract
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {WriteOptions} [options] Write options.
   * @return {string|ArrayBuffer} Result.
   */
  writeGeometry(t, e) {
    return b();
  }
}
function $e(r, t, e) {
  const i = e ? rt(e.featureProjection) : null, n = e ? rt(e.dataProjection) : null;
  let s = r;
  if (i && n && !nh(i, n)) {
    t && (s = /** @type {T} */
    r.clone());
    const o = t ? i : n, a = t ? n : i;
    o.getUnits() === "tile-pixels" ? s.transform(o, a) : s.applyTransform(Pn(o, a));
  }
  if (t && e && /** @type {WriteOptions} */
  e.decimals !== void 0) {
    const o = Math.pow(
      10,
      /** @type {WriteOptions} */
      e.decimals
    ), a = function(l) {
      for (let c = 0, h = l.length; c < h; ++c)
        l[c] = Math.round(l[c] * o) / o;
      return l;
    };
    s === r && (s = /** @type {T} */
    r.clone()), s.applyTransform(a);
  }
  return s;
}
function Oo(r, t) {
  const e = t ? rt(t.featureProjection) : null, i = t ? rt(t.dataProjection) : null;
  return e && i && !nh(e, i) ? go(r, i, e) : r;
}
const lg = {
  Point: Gt,
  LineString: bt,
  Polygon: qt,
  MultiPoint: wi,
  MultiLineString: se,
  MultiPolygon: ve
};
function hg(r, t, e) {
  return Array.isArray(t[0]) ? (Fh(r, 0, t, e) || (r = r.slice(), Bs(r, 0, t, e)), r) : (Mo(r, 0, t, e) || (r = r.slice(), Pr(r, 0, t, e)), r);
}
function Nh(r, t) {
  var s;
  const e = r.geometry;
  if (!e)
    return [];
  if (Array.isArray(e))
    return e.map((o) => Nh({ ...r, geometry: o })).flat();
  const i = e.type === "MultiPolygon" ? "Polygon" : e.type;
  if (i === "GeometryCollection" || i === "Circle")
    throw new Error("Unsupported geometry type: " + i);
  const n = e.layout.length;
  return $e(
    new Dt(
      i,
      i === "Polygon" ? hg(e.flatCoordinates, e.ends, n) : e.flatCoordinates,
      (s = e.ends) == null ? void 0 : s.flat(),
      n,
      r.properties || {},
      r.id
    ).enableSimplifyTransformed(),
    !1,
    t
  );
}
function bo(r, t) {
  if (!r)
    return null;
  if (Array.isArray(r)) {
    const i = r.map(
      (n) => bo(n, t)
    );
    return new je(i);
  }
  const e = lg[r.type];
  return $e(
    new e(r.flatCoordinates, r.layout || "XY", r.ends),
    !1,
    t
  );
}
class cg extends Lo {
  constructor() {
    super();
  }
  /**
   * @return {import("./Feature.js").Type} Format.
   * @override
   */
  getType() {
    return "text";
  }
  /**
   * Read the feature from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../Feature.js").default} Feature.
   * @api
   * @override
   */
  readFeature(t, e) {
    return this.readFeatureFromText(
      ir(t),
      this.adaptOptions(e)
    );
  }
  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromText(t, e) {
    return b();
  }
  /**
   * Read the features from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @api
   * @override
   */
  readFeatures(t, e) {
    return this.readFeaturesFromText(
      ir(t),
      this.adaptOptions(e)
    );
  }
  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromText(t, e) {
    return b();
  }
  /**
   * Read the geometry from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @api
   * @override
   */
  readGeometry(t, e) {
    return this.readGeometryFromText(
      ir(t),
      this.adaptOptions(e)
    );
  }
  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromText(t, e) {
    return b();
  }
  /**
   * Read the projection from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default|undefined} Projection.
   * @api
   * @override
   */
  readProjection(t) {
    return this.readProjectionFromText(ir(t));
  }
  /**
   * @param {string} text Text.
   * @protected
   * @return {import("../proj/Projection.js").default|undefined} Projection.
   */
  readProjectionFromText(t) {
    return this.dataProjection;
  }
  /**
   * Encode a feature as a string.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded feature.
   * @api
   * @override
   */
  writeFeature(t, e) {
    return this.writeFeatureText(t, this.adaptOptions(e));
  }
  /**
   * @abstract
   * @param {import("../Feature.js").default} feature Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   */
  writeFeatureText(t, e) {
    return b();
  }
  /**
   * Encode an array of features as string.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded features.
   * @api
   * @override
   */
  writeFeatures(t, e) {
    return this.writeFeaturesText(t, this.adaptOptions(e));
  }
  /**
   * @abstract
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   */
  writeFeaturesText(t, e) {
    return b();
  }
  /**
   * Write a single geometry.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Geometry.
   * @api
   * @override
   */
  writeGeometry(t, e) {
    return this.writeGeometryText(t, this.adaptOptions(e));
  }
  /**
   * @abstract
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   */
  writeGeometryText(t, e) {
    return b();
  }
}
function ir(r) {
  return typeof r == "string" ? r : "";
}
const ug = {
  POINT: Gt,
  LINESTRING: bt,
  POLYGON: qt,
  MULTIPOINT: wi,
  MULTILINESTRING: se,
  MULTIPOLYGON: ve
}, kh = "EMPTY", Dh = "Z", Gh = "M", dg = "ZM", tt = {
  START: 0,
  TEXT: 1,
  LEFT_PAREN: 2,
  RIGHT_PAREN: 3,
  NUMBER: 4,
  COMMA: 5,
  EOF: 6
}, fg = {
  Point: "POINT",
  LineString: "LINESTRING",
  Polygon: "POLYGON",
  MultiPoint: "MULTIPOINT",
  MultiLineString: "MULTILINESTRING",
  MultiPolygon: "MULTIPOLYGON",
  GeometryCollection: "GEOMETRYCOLLECTION",
  Circle: "CIRCLE"
};
class gg {
  /**
   * @param {string} wkt WKT string.
   */
  constructor(t) {
    this.wkt = t, this.index_ = -1;
  }
  /**
   * @param {string} c Character.
   * @return {boolean} Whether the character is alphabetic.
   * @private
   */
  isAlpha_(t) {
    return t >= "a" && t <= "z" || t >= "A" && t <= "Z";
  }
  /**
   * @param {string} c Character.
   * @param {boolean} [decimal] Whether the string number
   *     contains a dot, i.e. is a decimal number.
   * @return {boolean} Whether the character is numeric.
   * @private
   */
  isNumeric_(t, e) {
    return e = e !== void 0 ? e : !1, t >= "0" && t <= "9" || t == "." && !e;
  }
  /**
   * @param {string} c Character.
   * @return {boolean} Whether the character is whitespace.
   * @private
   */
  isWhiteSpace_(t) {
    return t == " " || t == "	" || t == "\r" || t == `
`;
  }
  /**
   * @return {string} Next string character.
   * @private
   */
  nextChar_() {
    return this.wkt.charAt(++this.index_);
  }
  /**
   * Fetch and return the next token.
   * @return {Token} Next string token.
   */
  nextToken() {
    const t = this.nextChar_(), e = this.index_;
    let i = t, n;
    if (t == "(")
      n = tt.LEFT_PAREN;
    else if (t == ",")
      n = tt.COMMA;
    else if (t == ")")
      n = tt.RIGHT_PAREN;
    else if (this.isNumeric_(t) || t == "-")
      n = tt.NUMBER, i = this.readNumber_();
    else if (this.isAlpha_(t))
      n = tt.TEXT, i = this.readText_();
    else {
      if (this.isWhiteSpace_(t))
        return this.nextToken();
      if (t === "")
        n = tt.EOF;
      else
        throw new Error("Unexpected character: " + t);
    }
    return { position: e, value: i, type: n };
  }
  /**
   * @return {number} Numeric token value.
   * @private
   */
  readNumber_() {
    let t;
    const e = this.index_;
    let i = !1, n = !1;
    do
      t == "." ? i = !0 : (t == "e" || t == "E") && (n = !0), t = this.nextChar_();
    while (this.isNumeric_(t, i) || // if we haven't detected a scientific number before, 'e' or 'E'
    // hint that we should continue to read
    !n && (t == "e" || t == "E") || // once we know that we have a scientific number, both '-' and '+'
    // are allowed
    n && (t == "-" || t == "+"));
    return parseFloat(this.wkt.substring(e, this.index_--));
  }
  /**
   * @return {string} String token value.
   * @private
   */
  readText_() {
    let t;
    const e = this.index_;
    do
      t = this.nextChar_();
    while (this.isAlpha_(t));
    return this.wkt.substring(e, this.index_--).toUpperCase();
  }
}
class mg {
  /**
   * @param {Lexer} lexer The lexer.
   */
  constructor(t) {
    this.lexer_ = t, this.token_ = {
      position: 0,
      type: tt.START
    }, this.layout_ = "XY";
  }
  /**
   * Fetch the next token form the lexer and replace the active token.
   * @private
   */
  consume_() {
    this.token_ = this.lexer_.nextToken();
  }
  /**
   * Tests if the given type matches the type of the current token.
   * @param {TokenType} type Token type.
   * @return {boolean} Whether the token matches the given type.
   */
  isTokenType(t) {
    return this.token_.type == t;
  }
  /**
   * If the given type matches the current token, consume it.
   * @param {TokenType} type Token type.
   * @return {boolean} Whether the token matches the given type.
   */
  match(t) {
    const e = this.isTokenType(t);
    return e && this.consume_(), e;
  }
  /**
   * Try to parse the tokens provided by the lexer.
   * @return {import("../geom/Geometry.js").default} The geometry.
   */
  parse() {
    return this.consume_(), this.parseGeometry_();
  }
  /**
   * Try to parse the dimensional info.
   * @return {import("../geom/Geometry.js").GeometryLayout} The layout.
   * @private
   */
  parseGeometryLayout_() {
    let t = "XY";
    const e = this.token_;
    if (this.isTokenType(tt.TEXT)) {
      const i = e.value;
      i === Dh ? t = "XYZ" : i === Gh ? t = "XYM" : i === dg && (t = "XYZM"), t !== "XY" && this.consume_();
    }
    return t;
  }
  /**
   * @return {Array<import("../geom/Geometry.js").default>} A collection of geometries.
   * @private
   */
  parseGeometryCollectionText_() {
    if (this.match(tt.LEFT_PAREN)) {
      const t = [];
      do
        t.push(this.parseGeometry_());
      while (this.match(tt.COMMA));
      if (this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<number>} All values in a point.
   * @private
   */
  parsePointText_() {
    if (this.match(tt.LEFT_PAREN)) {
      const t = this.parsePoint_();
      if (this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<Array<number>>} All points in a linestring.
   * @private
   */
  parseLineStringText_() {
    if (this.match(tt.LEFT_PAREN)) {
      const t = this.parsePointList_();
      if (this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<Array<Array<number>>>} All points in a polygon.
   * @private
   */
  parsePolygonText_() {
    if (this.match(tt.LEFT_PAREN)) {
      const t = this.parseLineStringTextList_();
      if (this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<Array<number>>} All points in a multipoint.
   * @private
   */
  parseMultiPointText_() {
    if (this.match(tt.LEFT_PAREN)) {
      let t;
      if (this.token_.type == tt.LEFT_PAREN ? t = this.parsePointTextList_() : t = this.parsePointList_(), this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<Array<Array<number>>>} All linestring points
   *                                          in a multilinestring.
   * @private
   */
  parseMultiLineStringText_() {
    if (this.match(tt.LEFT_PAREN)) {
      const t = this.parseLineStringTextList_();
      if (this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<Array<Array<Array<number>>>>} All polygon points in a multipolygon.
   * @private
   */
  parseMultiPolygonText_() {
    if (this.match(tt.LEFT_PAREN)) {
      const t = this.parsePolygonTextList_();
      if (this.match(tt.RIGHT_PAREN))
        return t;
    }
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<number>} A point.
   * @private
   */
  parsePoint_() {
    const t = [], e = this.layout_.length;
    for (let i = 0; i < e; ++i) {
      const n = this.token_;
      if (this.match(tt.NUMBER))
        t.push(
          /** @type {number} */
          n.value
        );
      else
        break;
    }
    if (t.length == e)
      return t;
    throw new Error(this.formatErrorMessage_());
  }
  /**
   * @return {Array<Array<number>>} An array of points.
   * @private
   */
  parsePointList_() {
    const t = [this.parsePoint_()];
    for (; this.match(tt.COMMA); )
      t.push(this.parsePoint_());
    return t;
  }
  /**
   * @return {Array<Array<number>>} An array of points.
   * @private
   */
  parsePointTextList_() {
    const t = [this.parsePointText_()];
    for (; this.match(tt.COMMA); )
      t.push(this.parsePointText_());
    return t;
  }
  /**
   * @return {Array<Array<Array<number>>>} An array of points.
   * @private
   */
  parseLineStringTextList_() {
    const t = [this.parseLineStringText_()];
    for (; this.match(tt.COMMA); )
      t.push(this.parseLineStringText_());
    return t;
  }
  /**
   * @return {Array<Array<Array<Array<number>>>>} An array of points.
   * @private
   */
  parsePolygonTextList_() {
    const t = [this.parsePolygonText_()];
    for (; this.match(tt.COMMA); )
      t.push(this.parsePolygonText_());
    return t;
  }
  /**
   * @return {boolean} Whether the token implies an empty geometry.
   * @private
   */
  isEmptyGeometry_() {
    const t = this.isTokenType(tt.TEXT) && this.token_.value == kh;
    return t && this.consume_(), t;
  }
  /**
   * Create an error message for an unexpected token error.
   * @return {string} Error message.
   * @private
   */
  formatErrorMessage_() {
    return "Unexpected `" + this.token_.value + "` at position " + this.token_.position + " in `" + this.lexer_.wkt + "`";
  }
  /**
   * @return {import("../geom/Geometry.js").default} The geometry.
   * @private
   */
  parseGeometry_() {
    const t = this.token_;
    if (this.match(tt.TEXT)) {
      const e = (
        /** @type {string} */
        t.value
      );
      this.layout_ = this.parseGeometryLayout_();
      const i = this.isEmptyGeometry_();
      if (e == "GEOMETRYCOLLECTION") {
        if (i)
          return new je([]);
        const o = this.parseGeometryCollectionText_();
        return new je(o);
      }
      const n = ug[e];
      if (!n)
        throw new Error("Invalid geometry type: " + e);
      let s;
      if (i)
        e == "POINT" ? s = [NaN, NaN] : s = [];
      else
        switch (e) {
          case "POINT": {
            s = this.parsePointText_();
            break;
          }
          case "LINESTRING": {
            s = this.parseLineStringText_();
            break;
          }
          case "POLYGON": {
            s = this.parsePolygonText_();
            break;
          }
          case "MULTIPOINT": {
            s = this.parseMultiPointText_();
            break;
          }
          case "MULTILINESTRING": {
            s = this.parseMultiLineStringText_();
            break;
          }
          case "MULTIPOLYGON": {
            s = this.parseMultiPolygonText_();
            break;
          }
        }
      return new n(s, this.layout_);
    }
    throw new Error(this.formatErrorMessage_());
  }
}
class Fr extends cg {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.splitCollection_ = t.splitCollection !== void 0 ? t.splitCollection : !1;
  }
  /**
   * Parse a WKT string.
   * @param {string} wkt WKT string.
   * @return {import("../geom/Geometry.js").default}
   *     The geometry created.
   * @private
   */
  parse_(t) {
    const e = new gg(t);
    return new mg(e).parse();
  }
  /**
   * @protected
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../Feature.js").default} Feature.
   * @override
   */
  readFeatureFromText(t, e) {
    const i = this.readGeometryFromText(t, e), n = new Ct();
    return n.setGeometry(i), n;
  }
  /**
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {Array<Feature>} Features.
   * @override
   */
  readFeaturesFromText(t, e) {
    let i = [];
    const n = this.readGeometryFromText(t, e);
    this.splitCollection_ && n.getType() == "GeometryCollection" ? i = /** @type {GeometryCollection} */
    n.getGeometriesArray() : i = [n];
    const s = [];
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = new Ct();
      l.setGeometry(i[o]), s.push(l);
    }
    return s;
  }
  /**
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @override
   */
  readGeometryFromText(t, e) {
    const i = this.parse_(t);
    return $e(i, !1, e);
  }
  /**
   * @param {import("../Feature.js").default} feature Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   * @override
   */
  writeFeatureText(t, e) {
    const i = t.getGeometry();
    return i ? this.writeGeometryText(i, e) : "";
  }
  /**
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   * @override
   */
  writeFeaturesText(t, e) {
    if (t.length == 1)
      return this.writeFeatureText(t[0], e);
    const i = [];
    for (let s = 0, o = t.length; s < o; ++s)
      i.push(t[s].getGeometry());
    const n = new je(i);
    return this.writeGeometryText(n, e);
  }
  /**
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   * @override
   */
  writeGeometryText(t, e) {
    return Yh($e(t, !0, e));
  }
}
function Uh(r) {
  const t = r.getCoordinates();
  return t.length === 0 ? "" : t.join(" ");
}
function _g(r) {
  const t = [], e = r.getPoints();
  for (let i = 0, n = e.length; i < n; ++i)
    t.push("(" + Uh(e[i]) + ")");
  return t.join(",");
}
function pg(r) {
  const t = [], e = r.getGeometries();
  for (let i = 0, n = e.length; i < n; ++i)
    t.push(Yh(e[i]));
  return t.join(",");
}
function No(r) {
  const t = r.getCoordinates(), e = [];
  for (let i = 0, n = t.length; i < n; ++i)
    e.push(t[i].join(" "));
  return e.join(",");
}
function yg(r) {
  const t = [], e = r.getLineStrings();
  for (let i = 0, n = e.length; i < n; ++i)
    t.push("(" + No(e[i]) + ")");
  return t.join(",");
}
function Wh(r) {
  const t = [], e = r.getLinearRings();
  for (let i = 0, n = e.length; i < n; ++i)
    t.push("(" + No(e[i]) + ")");
  return t.join(",");
}
function wg(r) {
  const t = [], e = r.getPolygons();
  for (let i = 0, n = e.length; i < n; ++i)
    t.push("(" + Wh(e[i]) + ")");
  return t.join(",");
}
function Eg(r) {
  const t = r.getLayout();
  let e = "";
  return (t === "XYZ" || t === "XYZM") && (e += Dh), (t === "XYM" || t === "XYZM") && (e += Gh), e;
}
const Cg = {
  Point: Uh,
  LineString: No,
  Polygon: Wh,
  MultiPoint: _g,
  MultiLineString: yg,
  MultiPolygon: wg,
  GeometryCollection: pg
};
function Yh(r) {
  const t = r.getType(), e = Cg[t], i = e(r);
  let n = fg[t];
  if (typeof /** @type {?} */
  r.getFlatCoordinates == "function") {
    const s = Eg(
      /** @type {import("../geom/SimpleGeometry.js").default} */
      r
    );
    s.length > 0 && (n += " " + s);
  }
  return i.length === 0 ? n + " " + kh : n + "(" + i + ")";
}
class Sg extends Lo {
  constructor() {
    super();
  }
  /**
   * @return {import("./Feature.js").Type} Format.
   * @override
   */
  getType() {
    return "json";
  }
  /**
   * Read a feature.  Only works for a single feature. Use `readFeatures` to
   * read a feature collection.
   *
   * @param {ArrayBuffer|Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {FeatureType|Array<FeatureType>} Feature.
   * @api
   * @override
   */
  readFeature(t, e) {
    return this.readFeatureFromObject(
      nr(t),
      this.getReadOptions(t, e)
    );
  }
  /**
   * Read all features.  Works with both a single feature and a feature
   * collection.
   *
   * @param {ArrayBuffer|Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {Array<FeatureType>} Features.
   * @api
   * @override
   */
  readFeatures(t, e) {
    return this.readFeaturesFromObject(
      nr(t),
      this.getReadOptions(t, e)
    );
  }
  /**
   * @abstract
   * @param {Object} object Object.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {FeatureType|Array<FeatureType>} Feature.
   */
  readFeatureFromObject(t, e) {
    return b();
  }
  /**
   * @abstract
   * @param {Object} object Object.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {Array<FeatureType>} Features.
   */
  readFeaturesFromObject(t, e) {
    return b();
  }
  /**
   * Read a geometry.
   *
   * @param {ArrayBuffer|Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @api
   * @override
   */
  readGeometry(t, e) {
    return this.readGeometryFromObject(
      nr(t),
      this.getReadOptions(t, e)
    );
  }
  /**
   * @abstract
   * @param {Object} object Object.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromObject(t, e) {
    return b();
  }
  /**
   * Read the projection.
   *
   * @param {ArrayBuffer|Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default} Projection.
   * @api
   * @override
   */
  readProjection(t) {
    return this.readProjectionFromObject(nr(t));
  }
  /**
   * @abstract
   * @param {Object} object Object.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   */
  readProjectionFromObject(t) {
    return b();
  }
  /**
   * Encode a feature as string.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded feature.
   * @api
   * @override
   */
  writeFeature(t, e) {
    return JSON.stringify(this.writeFeatureObject(t, e));
  }
  /**
   * @abstract
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {Object} Object.
   */
  writeFeatureObject(t, e) {
    return b();
  }
  /**
   * Encode an array of features as string.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded features.
   * @api
   * @override
   */
  writeFeatures(t, e) {
    return JSON.stringify(this.writeFeaturesObject(t, e));
  }
  /**
   * @abstract
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {Object} Object.
   */
  writeFeaturesObject(t, e) {
    return b();
  }
  /**
   * Encode a geometry as string.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded geometry.
   * @api
   * @override
   */
  writeGeometry(t, e) {
    return JSON.stringify(this.writeGeometryObject(t, e));
  }
  /**
   * @abstract
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {Object} Object.
   */
  writeGeometryObject(t, e) {
    return b();
  }
}
function nr(r) {
  if (typeof r == "string") {
    const t = JSON.parse(r);
    return t || null;
  }
  return r !== null ? r : null;
}
class An extends Sg {
  /**
   * @param {Options<FeatureType>} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(), this.dataProjection = rt(
      t.dataProjection ? t.dataProjection : "EPSG:4326"
    ), t.featureProjection && (this.defaultFeatureProjection = rt(t.featureProjection)), t.featureClass && (this.featureClass = t.featureClass), this.geometryName_ = t.geometryName, this.extractGeometryName_ = t.extractGeometryName, this.supportedMediaTypes = [
      "application/geo+json",
      "application/vnd.geo+json"
    ];
  }
  /**
   * @param {Object} object Object.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {FeatureType|Array<FeatureType>} Feature.
   * @override
   */
  readFeatureFromObject(t, e) {
    let i = null;
    t.type === "Feature" ? i = /** @type {GeoJSONFeature} */
    t : i = {
      type: "Feature",
      geometry: (
        /** @type {GeoJSONGeometry} */
        t
      ),
      properties: null
    };
    const n = ko(i.geometry);
    if (this.featureClass === Dt)
      return (
        /** @type {FeatureType|Array<FeatureType>} */
        Nh(
          {
            geometry: n,
            id: i.id,
            properties: i.properties
          },
          e
        )
      );
    const s = new Ct();
    return this.geometryName_ ? s.setGeometryName(this.geometryName_) : this.extractGeometryName_ && i.geometry_name && s.setGeometryName(i.geometry_name), s.setGeometry(bo(n, e)), "id" in i && s.setId(i.id), i.properties && s.setProperties(i.properties, !0), /** @type {FeatureType|Array<FeatureType>} */
    s;
  }
  /**
   * @param {Object} object Object.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {Array<FeatureType>} Features.
   * @override
   */
  readFeaturesFromObject(t, e) {
    const i = (
      /** @type {GeoJSONObject} */
      t
    );
    let n = null;
    if (i.type === "FeatureCollection") {
      const s = (
        /** @type {GeoJSONFeatureCollection} */
        t
      );
      n = [];
      const o = s.features;
      for (let a = 0, l = o.length; a < l; ++a) {
        const c = this.readFeatureFromObject(
          o[a],
          e
        );
        c && n.push(c);
      }
    } else
      n = [this.readFeatureFromObject(t, e)];
    return (
      /** @type {Array<FeatureType>} */
      n.flat()
    );
  }
  /**
   * @param {GeoJSONGeometry} object Object.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @override
   */
  readGeometryFromObject(t, e) {
    return xg(t, e);
  }
  /**
   * @param {Object} object Object.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   * @override
   */
  readProjectionFromObject(t) {
    const e = t.crs;
    let i;
    if (e)
      if (e.type == "name")
        i = rt(e.properties.name);
      else if (e.type === "EPSG")
        i = rt("EPSG:" + e.properties.code);
      else
        throw new Error("Unknown SRS type");
    else
      i = this.dataProjection;
    return (
      /** @type {import("../proj/Projection.js").default} */
      i
    );
  }
  /**
   * Encode a feature as a GeoJSON Feature object.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {GeoJSONFeature} Object.
   * @api
   * @override
   */
  writeFeatureObject(t, e) {
    e = this.adaptOptions(e);
    const i = {
      type: "Feature",
      geometry: null,
      properties: null
    }, n = t.getId();
    if (n !== void 0 && (i.id = n), !t.hasProperties())
      return i;
    const s = t.getProperties(), o = t.getGeometry();
    return o && (i.geometry = Vs(o, e), delete s[t.getGeometryName()]), ci(s) || (i.properties = s), i;
  }
  /**
   * Encode an array of features as a GeoJSON object.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {GeoJSONFeatureCollection} GeoJSON Object.
   * @api
   * @override
   */
  writeFeaturesObject(t, e) {
    e = this.adaptOptions(e);
    const i = [];
    for (let n = 0, s = t.length; n < s; ++n)
      i.push(this.writeFeatureObject(t[n], e));
    return {
      type: "FeatureCollection",
      features: i
    };
  }
  /**
   * Encode a geometry as a GeoJSON object.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {GeoJSONGeometry|GeoJSONGeometryCollection} Object.
   * @api
   * @override
   */
  writeGeometryObject(t, e) {
    return Vs(t, this.adaptOptions(e));
  }
}
function ko(r, t) {
  if (!r)
    return null;
  let e;
  switch (r.type) {
    case "Point": {
      e = Ig(
        /** @type {GeoJSONPoint} */
        r
      );
      break;
    }
    case "LineString": {
      e = Tg(
        /** @type {GeoJSONLineString} */
        r
      );
      break;
    }
    case "Polygon": {
      e = vg(
        /** @type {GeoJSONPolygon} */
        r
      );
      break;
    }
    case "MultiPoint": {
      e = Mg(
        /** @type {GeoJSONMultiPoint} */
        r
      );
      break;
    }
    case "MultiLineString": {
      e = Pg(
        /** @type {GeoJSONMultiLineString} */
        r
      );
      break;
    }
    case "MultiPolygon": {
      e = Fg(
        /** @type {GeoJSONMultiPolygon} */
        r
      );
      break;
    }
    case "GeometryCollection": {
      e = Rg(
        /** @type {GeoJSONGeometryCollection} */
        r
      );
      break;
    }
    default:
      throw new Error("Unsupported GeoJSON type: " + r.type);
  }
  return e;
}
function xg(r, t) {
  const e = ko(r);
  return bo(e, t);
}
function Rg(r, t) {
  return r.geometries.map(
    /**
     * @param {GeoJSONGeometry} geometry Geometry.
     * @return {import("./Feature.js").GeometryObject} geometry Geometry.
     */
    function(i) {
      return ko(i);
    }
  );
}
function Ig(r) {
  const t = r.coordinates;
  return {
    type: "Point",
    flatCoordinates: t,
    layout: pi(t.length)
  };
}
function Tg(r) {
  var i;
  const t = r.coordinates, e = t.flat();
  return {
    type: "LineString",
    flatCoordinates: e,
    ends: [e.length],
    layout: pi(((i = t[0]) == null ? void 0 : i.length) || 2)
  };
}
function Pg(r) {
  var s, o;
  const t = r.coordinates, e = ((o = (s = t[0]) == null ? void 0 : s[0]) == null ? void 0 : o.length) || 2, i = [], n = Un(i, 0, t, e);
  return {
    type: "MultiLineString",
    flatCoordinates: i,
    ends: n,
    layout: pi(e)
  };
}
function Mg(r) {
  var e;
  const t = r.coordinates;
  return {
    type: "MultiPoint",
    flatCoordinates: t.flat(),
    layout: pi(((e = t[0]) == null ? void 0 : e.length) || 2)
  };
}
function Fg(r) {
  var s, o;
  const t = r.coordinates, e = [], i = ((o = (s = t[0]) == null ? void 0 : s[0]) == null ? void 0 : o[0].length) || 2, n = Rh(
    e,
    0,
    t,
    i
  );
  return {
    type: "MultiPolygon",
    flatCoordinates: e,
    ends: n,
    layout: pi(i)
  };
}
function vg(r) {
  var s, o;
  const t = r.coordinates, e = [], i = (o = (s = t[0]) == null ? void 0 : s[0]) == null ? void 0 : o.length, n = Un(e, 0, t, i);
  return {
    type: "Polygon",
    flatCoordinates: e,
    ends: n,
    layout: pi(i)
  };
}
function Vs(r, t) {
  r = $e(r, !0, t);
  const e = r.getType();
  let i;
  switch (e) {
    case "Point": {
      i = kg(
        /** @type {import("../geom/Point.js").default} */
        r
      );
      break;
    }
    case "LineString": {
      i = Lg(
        /** @type {import("../geom/LineString.js").default} */
        r
      );
      break;
    }
    case "Polygon": {
      i = Dg(
        /** @type {import("../geom/Polygon.js").default} */
        r,
        t
      );
      break;
    }
    case "MultiPoint": {
      i = bg(
        /** @type {import("../geom/MultiPoint.js").default} */
        r
      );
      break;
    }
    case "MultiLineString": {
      i = Og(
        /** @type {import("../geom/MultiLineString.js").default} */
        r
      );
      break;
    }
    case "MultiPolygon": {
      i = Ng(
        /** @type {import("../geom/MultiPolygon.js").default} */
        r,
        t
      );
      break;
    }
    case "GeometryCollection": {
      i = Ag(
        /** @type {import("../geom/GeometryCollection.js").default} */
        r,
        t
      );
      break;
    }
    case "Circle": {
      i = {
        type: "GeometryCollection",
        geometries: []
      };
      break;
    }
    default:
      throw new Error("Unsupported geometry type: " + e);
  }
  return i;
}
function Ag(r, t) {
  return t = Object.assign({}, t), delete t.featureProjection, {
    type: "GeometryCollection",
    geometries: r.getGeometriesArray().map(function(i) {
      return Vs(i, t);
    })
  };
}
function Lg(r, t) {
  return {
    type: "LineString",
    coordinates: r.getCoordinates()
  };
}
function Og(r, t) {
  return {
    type: "MultiLineString",
    coordinates: r.getCoordinates()
  };
}
function bg(r, t) {
  return {
    type: "MultiPoint",
    coordinates: r.getCoordinates()
  };
}
function Ng(r, t) {
  let e;
  return t && (e = t.rightHanded), {
    type: "MultiPolygon",
    coordinates: r.getCoordinates(e)
  };
}
function kg(r, t) {
  return {
    type: "Point",
    coordinates: r.getCoordinates()
  };
}
function Dg(r, t) {
  let e;
  return t && (e = t.rightHanded), {
    type: "Polygon",
    coordinates: r.getCoordinates(e)
  };
}
var pn = /* @__PURE__ */ ((r) => (r.COLLAB_NO_CLIENT_DEFINED = "Client must be defined", r.COLLAB_NO_TABLE_DEFINED = "Table must be defined", r.COLLAB_UNKNOWN_PROJECTION = "Projection inconnue", r.WFS_NO_USERNAME_OR_PASSWORD = "Username and password are required", r))(pn || {});
class Do {
  /**
   * Inspired from the CordovApp.File.fileName function in CordovApp, File.js line 60
   * @param filename name of a file to sanitize
   * @returns sanitized filename
   */
  sanitizeFileName(t) {
    var e = /[/?<>\\:*|":]/g, i = /[\x00-\x1f\x80-\x9f]/g, n = /^\.+$/, s = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, o = /[. ]+$/;
    return (t || "_").replace(e, "_").replace(i, "_").replace(n, "_").replace(s, "_").replace(o, "_");
  }
  /**
   * Get the domain from a full URL
   * @param URL like https://example.com/path/file.html
   * @returns the escaped domain, like example_com
   */
  getEscapedDomainFromURL(t) {
    return t.replace(/^((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?$/, "$3").replace(/\./g, "_");
  }
}
const Gg = new Do();
class Go extends Wn {
  constructor(t) {
    new sg().initProjections();
    const i = Go._computeVectorSourceOptions(t);
    super(i), this._isLoading = !1, this._writeUpdateCounter = 0, this._tileLoading = 0, this._projectionCode = Zs, this.localProperties = {}, this.preservedFeatures = new We(), this.differentialFeatures = new We(), this.insertedFeatures = new We(), this.deletedFeatures = new We(), this.updatedFeatures = new We(), this._options = t || {}, this._cache = t.cache, this.localProperties = i.properties || {}, this._initCollabVectorSource();
  }
  static _computeVectorSourceOptions(t) {
    const e = t || {};
    if (e.client === void 0)
      throw new Error(pn.COLLAB_NO_CLIENT_DEFINED);
    if (e.table === void 0)
      throw new Error(pn.COLLAB_NO_TABLE_DEFINED);
    const i = e.table;
    let n = e.strategy || vh;
    const s = {
      online: e.online ?? !0,
      useCacheWhenOnline: e.useCacheWhenOnline === !0,
      cacheUrl: e.cacheUrl,
      editionCacheFile: Gg.sanitizeFileName(`${i.database}-${i.name}-editions.txt`),
      formatWKT: new Fr(),
      tiled: !1,
      tileGrid: void 0,
      maxReload: void 0
    };
    if (e.tileZoom) {
      const o = bh({
        tileSize: e.tileSize || Ii.TILE_SIZE,
        minZoom: e.tileZoom,
        maxZoom: e.tileZoom
      });
      n = Ah(o), s.tiled = !0, s.tileGrid = o, s.maxReload = e.maxReload;
    }
    return {
      strategy: n,
      properties: s,
      features: new We(),
      attributions: e.attribution,
      logo: e.logo,
      useSpatialIndex: !0,
      wrapX: e.wrapX
    };
  }
  _initCollabVectorSource() {
    var e, i;
    const t = this._options.table || {};
    this.table = t, t.wfs && (t.docURI = t.wfs.replace(/\/gcms\/.*/, "/document/")), this._options.maxFeatures = this._options.maxFeatures || Ii.MAX_FEATURES, this._options.tileSize = this._options.tileSize || Ii.TILE_SIZE, this.localProperties.srsName = this._getTableCRS(), ot.defs(this.localProperties.srsName) || console.error(pn.COLLAB_UNKNOWN_PROJECTION, this.localProperties.srsName), this.localProperties.featureFilter = this._options.filter ?? {}, (e = t.columns) != null && e.detruit ? this.localProperties.featureFilter = { detruit: !1 } : (i = t.columns) != null && i.gcms_detruit && (this.localProperties.featureFilter = { gcms_detruit: !1 }), this.preservedFeatures = this._options.preserved ?? new We(), this.localProperties.preservedFeatures = this.preservedFeatures, this.on("addfeature", (n) => {
      n != null && n.feature && this.onAddFeature(n.feature);
    }), this.on("removefeature", (n) => {
      n != null && n.feature && this.onDeleteFeature(n.feature);
    }), this.loadChanges(), this.setLoader(this.loaderFn.bind(this));
  }
  getTable() {
    return this.table;
  }
  onAddFeature(t) {
    var s;
    const e = t.getGeometry();
    if (e && e.on("change", () => {
      const o = t.updates || {};
      o.geometry = !0, t.updates = o, t.dispatchEvent({
        type: "propertychange",
        target: t
      });
    }), t.on("propertychange", this.onUpdateFeature.bind(this, t)), this._isLoading) return;
    t.state = "INSERT";
    const i = ((s = this.table) == null ? void 0 : s.columns) || {}, n = this._getGeometryColumnName();
    for (const o in i)
      o !== n && t.get(o) === void 0 && t.set(o, null, !0);
    this.insertedFeatures.push(t), this.writeChanges();
  }
  onDeleteFeature(t) {
    if (this._isLoading) return;
    const e = t.state;
    e === "INSERT" ? this.removeFeatureFromCollection(this.insertedFeatures, t) : (e === "UPDATE" && this.removeFeatureFromCollection(this.updatedFeatures, t), this.deletedFeatures.push(t)), t.state = "DELETE", this.writeChanges();
  }
  removeFeatureFromCollection(t, e) {
    const n = t.getArray().indexOf(e);
    n > -1 && t.removeAt(n);
  }
  writeChanges(t = !1) {
    if (!t) {
      this._writeUpdateCounter++, setTimeout(() => {
        this.writeChanges(!0);
      }, 100);
      return;
    }
    if (this._writeUpdateCounter--, this._writeUpdateCounter > 0) return;
    this._writeUpdateCounter = 0;
    const e = this.getSaveActions(!0), i = this.localProperties.editionCacheFile;
    if (i)
      if (this._cache)
        this._saveEditionCache(i, e).catch((n) => {
          console.error("ERROR: writeChanges on layer", n);
        });
      else
        try {
          localStorage.setItem(i, JSON.stringify(e));
        } catch (n) {
          console.error("ERROR: writeChanges fallback to localStorage", n);
        }
  }
  getSaveActions(t = !0) {
    const e = this.localProperties.formatWKT;
    return {
      insert: this.insertedFeatures.getArray().map((i) => this.serializeFeature(i, e, t)),
      update: this.updatedFeatures.getArray().map((i) => this.serializeFeature(i, e, t)),
      delete: this.deletedFeatures.getArray().map((i) => this.serializeFeature(i, e, !1))
    };
  }
  serializeFeature(t, e, i) {
    const n = t.getProperties(), s = {
      id: t.getId(),
      properties: {}
    }, o = this._getGeometryColumnName();
    for (const a in n)
      a !== o && a !== "geometry" && (s.properties[a] = n[a]);
    if (i) {
      const a = t.getGeometry();
      a && e && (s.geometry = e.writeGeometry(a));
    }
    return s;
  }
  loadChanges() {
    const t = this.localProperties.editionCacheFile;
    if (t)
      if (this._cache)
        this._loadEditionCache(t).then((e) => {
          e && this._restoreActions(e);
        }).catch((e) => {
          console.error("ERROR: loadChanges on layer", e);
        });
      else
        try {
          const e = localStorage.getItem(t);
          if (e) {
            const i = JSON.parse(e);
            this._restoreActions(i);
          }
        } catch (e) {
          console.error("ERROR: loadChanges fallback to localStorage", e);
        }
  }
  _restoreActions(t) {
    const e = this.localProperties.formatWKT;
    t.insert && Array.isArray(t.insert) && t.insert.forEach((i) => {
      const n = this.deserializeFeature(i, e);
      n && (n.state = "INSERT", this.insertedFeatures.push(n));
    }), t.update && Array.isArray(t.update) && t.update.forEach((i) => {
      const n = this.deserializeFeature(i, e);
      n && (n.state = "UPDATE", this.updatedFeatures.push(n));
    }), t.delete && Array.isArray(t.delete) && t.delete.forEach((i) => {
      const n = this.deserializeFeature(i, e);
      n && (n.state = "DELETE", this.deletedFeatures.push(n));
    });
  }
  deserializeFeature(t, e) {
    try {
      const i = new yn();
      if (t.id !== void 0 && t.id !== null && i.setId(t.id), t.properties && i.setProperties(t.properties), t.geometry && e) {
        const n = e.readGeometry(t.geometry);
        i.setGeometry(n);
      }
      return i;
    } catch (i) {
      return console.error("ERROR: deserializeFeature", i), null;
    }
  }
  onUpdateFeature(t) {
    if (this._isLoading) return;
    const e = t.state;
    e !== "INSERT" && (e !== "UPDATE" && (t.state = "UPDATE", this.updatedFeatures.push(t)), this.writeChanges());
  }
  async _saveEditionCache(t, e) {
    if (!this._cache) return;
    const i = {
      id: `edition:${t}`,
      name: `Edition Cache: ${this.table.name}`,
      type: "vector",
      created: /* @__PURE__ */ new Date(),
      modified: /* @__PURE__ */ new Date(),
      size: JSON.stringify(e).length,
      extra: {
        actions: e
      }
    };
    await this._cache.saveMetadata(i.id, i);
  }
  async _loadEditionCache(t) {
    var e;
    if (!this._cache) return null;
    try {
      const i = await this._cache.getMetadata(`edition:${t}`);
      return i && ((e = i.extra) != null && e.actions) ? i.extra.actions : null;
    } catch (i) {
      return console.error("ERROR: _loadEditionCache", i), null;
    }
  }
  setLoading(t) {
    this._isLoading = t;
  }
  reload() {
    this._isLoading = !0, this.clear(!0), this._isLoading = !1, this.dispatchEvent({ type: "reload", maxreload: this.localProperties.maxReload }), this.refresh();
  }
  loaderFn(t, e, i, n, s) {
    this._loadFeatures(t, e, i, n, s);
  }
  async _loadFeatures(t, e, i, n, s) {
    var o;
    if (this._projectionCode = typeof i == "string" ? i : ((o = i == null ? void 0 : i.getCode) == null ? void 0 : o.call(i)) || Zs, !ot.defs(this.localProperties.srsName)) {
      this.dispatchEvent({ type: "loadend", status: "error", error: pn.COLLAB_UNKNOWN_PROJECTION }), s && s();
      return;
    }
    this.localProperties.maxReload && this.localProperties.tiled && this._tileLoading === 1 && this.getFeatures().length > this.localProperties.maxReload && this.reload(), this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading });
    try {
      let a = [];
      const l = this.localProperties.online !== !1, c = !!this.localProperties.cacheUrl, h = this.localProperties.useCacheWhenOnline === !0;
      c && (!l || h) && (a = await this._loadFromOfflineCache(t, e)), this._countPayloadFeatures(a) === 0 && l && (a = await this._loadFromOnline(t));
      const u = this._countPayloadFeatures(a), d = this._readFeatures(a, this._projectionCode), f = [];
      d.forEach((m) => {
        const _ = this._findFeature(m);
        _ && f.push(_);
      });
      const g = this._getIdPropertyName();
      this.insertedFeatures.getArray().forEach((m) => {
        m.state === "INSERT" && (this._containsFeature(f, m, g) || f.push(m));
      }), this._isLoading = !0, this.localProperties.tiled || this.clear(!0), f.length && this.addFeatures(f), this._isLoading = !1, l && await this._saveFeaturesToOfflineCache(t, e, f), this.dispatchEvent({ type: "loadend", remains: --this._tileLoading }), u >= (this._options.maxFeatures || Ii.MAX_FEATURES) && this.dispatchEvent({ type: "overload" }), n && n(f);
    } catch (a) {
      this._isLoading = !1, this.dispatchEvent({
        type: "loadend",
        error: (a == null ? void 0 : a.message) || String(a),
        status: "error",
        remains: Math.max(0, --this._tileLoading)
      }), s && s();
    }
  }
  async _loadFromOnline(t) {
    var n;
    const e = this.getWFSParams(t, this._projectionCode);
    if (!((n = this.table) != null && n.wfs))
      throw new Error("Table WFS URL is missing");
    return (await this._options.client.doRequest(this.table.wfs, "get", null, e)).data;
  }
  async _loadFromOfflineCache(t, e) {
    if (!this._cache || typeof this._cache.loadFeatures != "function")
      return [];
    const i = this._getOfflineCacheKeys(t, e);
    for (const n of i)
      try {
        const s = await this._cache.loadFeatures(n);
        if (Array.isArray(s) && s.length)
          return s;
      } catch {
      }
    return [];
  }
  async _saveFeaturesToOfflineCache(t, e, i) {
    if (!this._cache || typeof this._cache.saveFeatures != "function")
      return;
    const n = this._getOfflineCacheKeys(t, e);
    if (n.length)
      try {
        await this._cache.saveFeatures(n[0], i);
      } catch {
      }
  }
  _getOfflineCacheKeys(t, e) {
    const i = `${this.table.database}:${this.table.name}`, n = this.localProperties.tileGrid;
    if (!n)
      return [i];
    const s = n.getTileCoordForCoordAndResolution(Fe(t), e);
    return [`${i}:${s.join("-")}`, i];
  }
  getWFSParams(t, e) {
    const i = go(t, e, this.localProperties.srsName);
    return {
      service: "WFS",
      request: "GetFeature",
      outputFormat: this._options.outputFormat || "JSON",
      typeName: this.table.name,
      bbox: i.join(","),
      filter: JSON.stringify(this.localProperties.featureFilter || {}),
      maxFeatures: this._options.maxFeatures || Ii.MAX_FEATURES,
      version: "1.1.0"
    };
  }
  _countPayloadFeatures(t) {
    if (Array.isArray(t))
      return t.length;
    if (!t || typeof t != "object")
      return 0;
    const e = t;
    return e.type === "FeatureCollection" && Array.isArray(e.features) || Array.isArray(e.features) ? e.features.length : Array.isArray(e.data) ? e.data.length : Array.isArray(e.rows) ? e.rows.length : Array.isArray(e.items) ? e.items.length : 0;
  }
  _readFeatures(t, e) {
    if (!t)
      return [];
    if (Array.isArray(t) && t.every((a) => a instanceof yn))
      return t;
    let i = t;
    if (typeof i == "string")
      try {
        i = JSON.parse(i);
      } catch {
        return [];
      }
    if (this._isGeoJSONPayload(i))
      return new An().readFeatures(i, {
        dataProjection: this.localProperties.srsName,
        featureProjection: e
      });
    const n = this._extractItemsFromPayload(i);
    if (!n.length)
      return [];
    const s = [], o = this._getGeometryColumnName();
    for (const a of n) {
      const l = a[o] ?? a.geometry;
      if (!l) continue;
      const c = this.createFeatureFromGeom(l, e);
      if (!c) continue;
      const h = { ...a };
      delete h[o], delete h.geometry, c.setProperties(h, !0), s.push(c);
    }
    return s;
  }
  createFeatureFromGeom(t, e) {
    if (!t)
      return null;
    if (typeof t == "object" && t !== null && "type" in t)
      try {
        const i = new An().readGeometry(t, {
          dataProjection: this.localProperties.srsName,
          featureProjection: e
        });
        return new yn({ geometry: i });
      } catch {
        return null;
      }
    if (typeof t == "string") {
      const i = this.localProperties.formatWKT, n = t.replace(/([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+) ([-+]?(\d*[.])?\d+)/g, "$1 $3");
      try {
        return i.readFeature(n, {
          dataProjection: this.localProperties.srsName,
          featureProjection: e
        });
      } catch {
        return null;
      }
    }
    return null;
  }
  _isGeoJSONPayload(t) {
    if (!t || typeof t != "object")
      return !1;
    const e = t;
    return e.type === "FeatureCollection" || e.type === "Feature";
  }
  _extractItemsFromPayload(t) {
    if (Array.isArray(t))
      return t;
    if (!t || typeof t != "object")
      return [];
    const e = t;
    return Array.isArray(e.data) ? e.data : Array.isArray(e.rows) ? e.rows : Array.isArray(e.items) ? e.items : Array.isArray(e.features) ? e.features : [];
  }
  _findFeature(t) {
    const e = this._getIdPropertyName(), i = this._getFeatureIdentifier(t, e);
    if (this.localProperties.tiled && this._featureExistsInSource(t, e, i) || this._findFeatureInCollection(this.deletedFeatures, e, i))
      return null;
    const n = this._findFeatureInCollection(this.updatedFeatures, e, i);
    if (n)
      return n;
    const s = this._findFeatureInCollection(this.differentialFeatures, e, i);
    if (s)
      return s.get("detruit") || s.get("gcms_detruit") ? null : s;
    const o = this._findFeatureInCollection(this.preservedFeatures, e, i);
    return o || t;
  }
  _featureExistsInSource(t, e, i) {
    if (i != null)
      return this.getFeatures().some(
        (a) => this._featureIdentifiersMatch(this._getFeatureIdentifier(a, e), i)
      );
    const n = t.getGeometry();
    if (!n)
      return !1;
    const s = n.getExtent();
    return this.getFeaturesInExtent([
      s[0] - 0.1,
      s[1] - 0.1,
      s[2] + 0.1,
      s[3] + 0.1
    ]).length > 0;
  }
  _findFeatureInCollection(t, e, i) {
    const n = t.getArray();
    if (i == null)
      return null;
    for (const s of n) {
      const o = this._getFeatureIdentifier(s, e);
      if (this._featureIdentifiersMatch(o, i))
        return s;
    }
    return null;
  }
  _containsFeature(t, e, i) {
    const n = this._getFeatureIdentifier(e, i);
    return n != null ? t.some(
      (s) => this._featureIdentifiersMatch(this._getFeatureIdentifier(s, i), n)
    ) : t.includes(e);
  }
  _getFeatureIdentifier(t, e) {
    const i = t.get(e);
    if (i != null)
      return i;
    const n = t.getId();
    if (n != null)
      return n;
  }
  _featureIdentifiersMatch(t, e) {
    return t == null || e === void 0 || e === null ? !1 : String(t) === String(e);
  }
  _getIdPropertyName() {
    const t = this.table;
    return t.idName || t.id_name || "id";
  }
  _getGeometryColumnName() {
    const t = this.table;
    return t.geometryName || t.geometry_name || "geometry";
  }
  _getTableCRS() {
    var i, n;
    const t = this._getGeometryColumnName(), e = (n = (i = this.table) == null ? void 0 : i.columns) == null ? void 0 : n[t];
    return (e == null ? void 0 : e.crs) || Ii.SRS_NAME;
  }
}
const js = "http://www.w3.org/2001/XMLSchema-instance";
function D(r, t) {
  return Uo().createElementNS(r, t);
}
function Ln(r, t) {
  return Bh(r, t, []).join("");
}
function Bh(r, t, e) {
  if (r.nodeType == Node.CDATA_SECTION_NODE || r.nodeType == Node.TEXT_NODE)
    e.push(r.nodeValue);
  else {
    let i;
    for (i = r.firstChild; i; i = i.nextSibling)
      Bh(i, t, e);
  }
  return e;
}
function Oi(r) {
  return "documentElement" in r;
}
function Ug(r, t, e) {
  return r.getAttributeNS(t, e) || "";
}
function bi(r) {
  return new DOMParser().parseFromString(r, "application/xml");
}
function Xh(r, t) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @this {*}
     */
    function(e, i) {
      const n = r.call(this, e, i);
      if (n !== void 0) {
        const s = (
          /** @type {Array<*>} */
          i[i.length - 1]
        );
        It(s, n);
      }
    }
  );
}
function k(r, t) {
  return (
    /**
     * @param {Element} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @this {*}
     */
    function(e, i) {
      const n = r.call(t ?? this, e, i);
      n !== void 0 && /** @type {Array<*>} */
      i[i.length - 1].push(n);
    }
  );
}
function O(r, t) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @this {*}
     */
    function(e, i) {
      const n = r.call(t ?? this, e, i);
      n !== void 0 && (i[i.length - 1] = n);
    }
  );
}
function te(r, t, e) {
  return (
    /**
     * @param {Element} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @this {*}
     */
    function(i, n) {
      const s = r.call(this, i, n);
      if (s !== void 0) {
        const o = (
          /** @type {!Object} */
          n[n.length - 1]
        ), a = t !== void 0 ? t : i.localName;
        o[a] = s;
      }
    }
  );
}
function E(r, t) {
  return (
    /**
     * @param {Element} node Node.
     * @param {*} value Value to be written.
     * @param {Array<*>} objectStack Object stack.
     * @this {*}
     */
    function(e, i, n) {
      r.call(t ?? this, e, i, n), /** @type {NodeStackItem} */
      n[n.length - 1].node.appendChild(e);
    }
  );
}
function Ut(r, t) {
  return (
    /**
     * @param {*} value Value.
     * @param {Array<*>} objectStack Object stack.
     * @param {string} [newNodeName] Node name.
     * @return {Node} Node.
     */
    function(e, i, n) {
      const o = /** @type {NodeStackItem} */ i[i.length - 1].node;
      let a = r;
      a === void 0 && (a = n);
      const l = t !== void 0 ? t : o.namespaceURI;
      return D(
        l,
        /** @type {string} */
        a
      );
    }
  );
}
const zh = Ut();
function ai(r, t, e, i) {
  let n;
  for (n = t.firstElementChild; n; n = n.nextElementSibling) {
    const s = r[n.namespaceURI];
    if (s !== void 0) {
      const o = s[n.localName];
      o !== void 0 && o.call(i, n, e);
    }
  }
}
function it(r, t, e, i, n) {
  return i.push(r), ai(t, e, i, n), /** @type {T} */
  i.pop();
}
function Wg(r, t, e, i, n, s) {
  const o = (n !== void 0 ? n : e).length;
  let a, l;
  for (let c = 0; c < o; ++c)
    a = e[c], a !== void 0 && (l = t.call(
      s,
      a,
      i,
      n !== void 0 ? n[c] : void 0
    ), l !== void 0 && r[l.namespaceURI][l.localName].call(
      s,
      l,
      a,
      i
    ));
}
function dt(r, t, e, i, n, s, o) {
  return n.push(r), Wg(t, e, i, n, s, o), /** @type {O|undefined} */
  n.pop();
}
let Ss;
function Yg() {
  return Ss === void 0 && typeof XMLSerializer < "u" && (Ss = new XMLSerializer()), Ss;
}
let xs;
function Uo() {
  return xs === void 0 && typeof document < "u" && (xs = document.implementation.createDocument("", "", null)), xs;
}
class Zh extends Lo {
  constructor() {
    super(), this.xmlSerializer_ = Yg();
  }
  /**
   * @return {import("./Feature.js").Type} Format.
   * @override
   */
  getType() {
    return "xml";
  }
  /**
   * Read a single feature.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../Feature.js").default} Feature.
   * @api
   * @override
   */
  readFeature(t, e) {
    if (!t)
      return null;
    if (typeof t == "string") {
      const i = bi(t);
      return this.readFeatureFromDocument(i, e);
    }
    return Oi(t) ? this.readFeatureFromDocument(
      /** @type {Document} */
      t,
      e
    ) : this.readFeatureFromNode(
      /** @type {Element} */
      t,
      e
    );
  }
  /**
   * @param {Document} doc Document.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromDocument(t, e) {
    const i = this.readFeaturesFromDocument(t, e);
    return i.length > 0 ? i[0] : null;
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromNode(t, e) {
    return null;
  }
  /**
   * Read all features from a feature collection.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @api
   * @override
   */
  readFeatures(t, e) {
    if (!t)
      return [];
    if (typeof t == "string") {
      const i = bi(t);
      return this.readFeaturesFromDocument(i, e);
    }
    return Oi(t) ? this.readFeaturesFromDocument(
      /** @type {Document} */
      t,
      e
    ) : this.readFeaturesFromNode(
      /** @type {Element} */
      t,
      e
    );
  }
  /**
   * @param {Document} doc Document.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromDocument(t, e) {
    const i = [];
    for (let n = t.firstChild; n; n = n.nextSibling)
      n.nodeType == Node.ELEMENT_NODE && It(
        i,
        this.readFeaturesFromNode(
          /** @type {Element} */
          n,
          e
        )
      );
    return i;
  }
  /**
   * @abstract
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromNode(t, e) {
    return b();
  }
  /**
   * Read a single geometry from a source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @override
   */
  readGeometry(t, e) {
    if (!t)
      return null;
    if (typeof t == "string") {
      const i = bi(t);
      return this.readGeometryFromDocument(i, e);
    }
    return Oi(t) ? this.readGeometryFromDocument(
      /** @type {Document} */
      t,
      e
    ) : this.readGeometryFromNode(
      /** @type {Element} */
      t,
      e
    );
  }
  /**
   * @param {Document} doc Document.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromDocument(t, e) {
    return null;
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromNode(t, e) {
    return null;
  }
  /**
   * Read the projection from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default} Projection.
   * @api
   * @override
   */
  readProjection(t) {
    if (!t)
      return null;
    if (typeof t == "string") {
      const e = bi(t);
      return this.readProjectionFromDocument(e);
    }
    return Oi(t) ? this.readProjectionFromDocument(
      /** @type {Document} */
      t
    ) : this.readProjectionFromNode(
      /** @type {Element} */
      t
    );
  }
  /**
   * @param {Document} doc Document.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   */
  readProjectionFromDocument(t) {
    return this.dataProjection;
  }
  /**
   * @param {Element} node Node.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   */
  readProjectionFromNode(t) {
    return this.dataProjection;
  }
  /**
   * Encode a feature as string.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded feature.
   * @override
   */
  writeFeature(t, e) {
    const i = this.writeFeatureNode(t, e);
    return this.xmlSerializer_.serializeToString(i);
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @protected
   * @return {Node} Node.
   */
  writeFeatureNode(t, e) {
    return null;
  }
  /**
   * Encode an array of features as string.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Result.
   * @api
   * @override
   */
  writeFeatures(t, e) {
    const i = this.writeFeaturesNode(t, e);
    return this.xmlSerializer_.serializeToString(i);
  }
  /**
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Node} Node.
   */
  writeFeaturesNode(t, e) {
    return null;
  }
  /**
   * Encode a geometry as string.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded geometry.
   * @override
   */
  writeGeometry(t, e) {
    const i = this.writeGeometryNode(t, e);
    return this.xmlSerializer_.serializeToString(i);
  }
  /**
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Node} Node.
   */
  writeGeometryNode(t, e) {
    return null;
  }
}
const Te = "http://www.opengis.net/gml", Bg = /^\s*$/;
class v extends Zh {
  /**
   * @param {Options} [options] Optional configuration object.
   */
  constructor(t) {
    super(), t = t || {}, this.featureType = t.featureType, this.featureNS = t.featureNS, this.srsName = t.srsName, this.schemaLocation = "", this.FEATURE_COLLECTION_PARSERS = {}, this.FEATURE_COLLECTION_PARSERS[this.namespace] = {
      featureMember: k(this.readFeaturesInternal),
      featureMembers: O(this.readFeaturesInternal)
    }, this.supportedMediaTypes = ["application/gml+xml"];
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<Feature> | undefined} Features.
   */
  readFeaturesInternal(t, e) {
    const i = t.localName;
    let n = null;
    if (i == "FeatureCollection")
      n = it(
        [],
        this.FEATURE_COLLECTION_PARSERS,
        t,
        e,
        this
      );
    else if (i == "featureMembers" || i == "featureMember" || i == "member") {
      const s = e[0];
      let o = s.featureType, a = s.featureNS;
      const l = "p", c = "p0";
      if (!o && t.childNodes) {
        o = [], a = {};
        for (let d = 0, f = t.childNodes.length; d < f; ++d) {
          const g = (
            /** @type {Element} */
            t.childNodes[d]
          );
          if (g.nodeType === 1) {
            const m = g.nodeName.split(":").pop();
            if (!o.includes(m)) {
              let _ = "", p = 0;
              const y = g.namespaceURI;
              for (const S in a) {
                if (a[S] === y) {
                  _ = S;
                  break;
                }
                ++p;
              }
              _ || (_ = l + p, a[_] = y), o.push(_ + ":" + m);
            }
          }
        }
        i != "featureMember" && (s.featureType = o, s.featureNS = a);
      }
      if (typeof a == "string") {
        const d = a;
        a = {}, a[c] = d;
      }
      const h = {}, u = Array.isArray(o) ? o : [o];
      for (const d in a) {
        const f = {};
        for (let g = 0, m = u.length; g < m; ++g)
          (u[g].includes(":") ? u[g].split(":")[0] : c) === d && (f[u[g].split(":").pop()] = i == "featureMembers" ? k(this.readFeatureElement, this) : O(this.readFeatureElement, this));
        h[a[d]] = f;
      }
      i == "featureMember" || i == "member" ? n = it(void 0, h, t, e) : n = it([], h, t, e);
    }
    return n === null && (n = []), n;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {import("../geom/Geometry.js").default|import("../extent.js").Extent|undefined} Geometry.
   */
  readGeometryOrExtent(t, e) {
    const i = (
      /** @type {Object} */
      e[0]
    );
    return i.srsName = t.firstElementChild.getAttribute("srsName"), i.srsDimension = t.firstElementChild.getAttribute("srsDimension"), it(
      null,
      this.GEOMETRY_PARSERS,
      t,
      e,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {import("../extent.js").Extent|undefined} Geometry.
   */
  readExtentElement(t, e) {
    const i = (
      /** @type {Object} */
      e[0]
    ), n = (
      /** @type {import("../extent.js").Extent} */
      this.readGeometryOrExtent(t, e)
    );
    return n ? Oo(n, i) : void 0;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {import("../geom/Geometry.js").default|undefined} Geometry.
   */
  readGeometryElement(t, e) {
    const i = (
      /** @type {Object} */
      e[0]
    ), n = (
      /** @type {import("../geom/Geometry.js").default} */
      this.readGeometryOrExtent(t, e)
    );
    return n ? $e(n, !1, i) : void 0;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @param {boolean} asFeature whether result should be wrapped as a feature.
   * @return {Feature|Object} Feature
   */
  readFeatureElementInternal(t, e, i) {
    let n;
    const s = {};
    for (let l = t.firstElementChild; l; l = l.nextElementSibling) {
      let c;
      const h = l.localName;
      l.childNodes.length === 0 || l.childNodes.length === 1 && (l.firstChild.nodeType === 3 || l.firstChild.nodeType === 4) ? (c = Ln(l, !1), Bg.test(c) && (c = void 0)) : (i && (c = h === "boundedBy" ? this.readExtentElement(l, e) : this.readGeometryElement(l, e)), c ? h !== "boundedBy" && (n = h) : c = this.readFeatureElementInternal(l, e, !1));
      const u = l.attributes.length;
      if (u > 0 && !(c instanceof yo)) {
        c = { _content_: c };
        for (let d = 0; d < u; d++) {
          const f = l.attributes[d].name;
          c[f] = l.attributes[d].value;
        }
      }
      s[h] ? (s[h] instanceof Array || (s[h] = [s[h]]), s[h].push(c)) : s[h] = c;
    }
    if (!i)
      return s;
    const o = new Ct(s);
    n && o.setGeometryName(n);
    const a = t.getAttribute("fid") || Ug(t, this.namespace, "id");
    return a && o.setId(a), o;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Feature} Feature.
   */
  readFeatureElement(t, e) {
    return this.readFeatureElementInternal(t, e, !0);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Point|undefined} Point.
   */
  readPoint(t, e) {
    const i = this.readFlatCoordinatesFromNode(t, e);
    if (i)
      return new Gt(i, "XYZ");
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiPoint|undefined} MultiPoint.
   */
  readMultiPoint(t, e) {
    const i = it(
      [],
      this.MULTIPOINT_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return new wi(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiLineString|undefined} MultiLineString.
   */
  readMultiLineString(t, e) {
    const i = it(
      [],
      this.MULTILINESTRING_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return new se(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiPolygon|undefined} MultiPolygon.
   */
  readMultiPolygon(t, e) {
    const i = it(
      [],
      this.MULTIPOLYGON_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return new ve(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  pointMemberParser(t, e) {
    ai(this.POINTMEMBER_PARSERS, t, e, this);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  lineStringMemberParser(t, e) {
    ai(this.LINESTRINGMEMBER_PARSERS, t, e, this);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  polygonMemberParser(t, e) {
    ai(this.POLYGONMEMBER_PARSERS, t, e, this);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {LineString|undefined} LineString.
   */
  readLineString(t, e) {
    const i = this.readFlatCoordinatesFromNode(t, e);
    if (i)
      return new bt(i, "XYZ");
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} LinearRing flat coordinates.
   */
  readFlatLinearRing(t, e) {
    const i = it(
      null,
      this.GEOMETRY_FLAT_COORDINATES_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return i;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {LinearRing|undefined} LinearRing.
   */
  readLinearRing(t, e) {
    const i = this.readFlatCoordinatesFromNode(t, e);
    if (i)
      return new ji(i, "XYZ");
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Polygon|undefined} Polygon.
   */
  readPolygon(t, e) {
    const i = it(
      [null],
      this.FLAT_LINEAR_RINGS_PARSERS,
      t,
      e,
      this
    );
    if (i && i[0]) {
      const n = i[0], s = [n.length];
      let o, a;
      for (o = 1, a = i.length; o < a; ++o)
        It(n, i[o]), s.push(n.length);
      return new qt(n, "XYZ", s);
    }
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>} Flat coordinates.
   */
  readFlatCoordinatesFromNode(t, e) {
    return it(
      null,
      this.GEOMETRY_FLAT_COORDINATES_PARSERS,
      t,
      e,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @override
   */
  readGeometryFromNode(t, e) {
    const i = this.readGeometryElement(t, [
      this.getReadOptions(t, e || {})
    ]);
    return i || null;
  }
  /**
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @override
   */
  readFeaturesFromNode(t, e) {
    const i = {
      featureType: this.featureType,
      featureNS: this.featureNS
    };
    return i && Object.assign(i, this.getReadOptions(t, e)), this.readFeaturesInternal(t, [i]) || [];
  }
  /**
   * @param {Element} node Node.
   * @return {import("../proj/Projection.js").default} Projection.
   * @override
   */
  readProjectionFromNode(t) {
    return rt(
      this.srsName ? this.srsName : t.firstElementChild.getAttribute("srsName")
    );
  }
}
v.prototype.namespace = Te;
v.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  "http://www.opengis.net/gml": {}
};
v.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  "http://www.opengis.net/gml": {}
};
v.prototype.GEOMETRY_PARSERS = {
  "http://www.opengis.net/gml": {}
};
v.prototype.MULTIPOINT_PARSERS = {
  "http://www.opengis.net/gml": {
    pointMember: k(v.prototype.pointMemberParser),
    pointMembers: k(v.prototype.pointMemberParser)
  }
};
v.prototype.MULTILINESTRING_PARSERS = {
  "http://www.opengis.net/gml": {
    lineStringMember: k(
      v.prototype.lineStringMemberParser
    ),
    lineStringMembers: k(
      v.prototype.lineStringMemberParser
    )
  }
};
v.prototype.MULTIPOLYGON_PARSERS = {
  "http://www.opengis.net/gml": {
    polygonMember: k(v.prototype.polygonMemberParser),
    polygonMembers: k(v.prototype.polygonMemberParser)
  }
};
v.prototype.POINTMEMBER_PARSERS = {
  "http://www.opengis.net/gml": {
    Point: k(v.prototype.readFlatCoordinatesFromNode)
  }
};
v.prototype.LINESTRINGMEMBER_PARSERS = {
  "http://www.opengis.net/gml": {
    LineString: k(v.prototype.readLineString)
  }
};
v.prototype.POLYGONMEMBER_PARSERS = {
  "http://www.opengis.net/gml": {
    Polygon: k(v.prototype.readPolygon)
  }
};
v.prototype.RING_PARSERS = {
  "http://www.opengis.net/gml": {
    LinearRing: O(v.prototype.readFlatLinearRing)
  }
};
function Mi(r) {
  const t = Ln(r, !1);
  return Ni(t);
}
function Ni(r) {
  const t = /^\s*(\d+)\s*$/.exec(r);
  if (t)
    return parseInt(t[1], 10);
}
function Xg(r, t) {
  r.appendChild(Uo().createCDATASection(t));
}
const zg = /^\s/, Zg = /\s$/, Vg = /(\n|\t|\r|<|&| {2})/;
function mt(r, t) {
  typeof t == "string" && (zg.test(t) || Zg.test(t) || Vg.test(t)) ? t.split("]]>").forEach((e, i, n) => {
    i < n.length - 1 && (e += "]]"), i > 0 && (e = ">" + e), Xg(r, e);
  }) : r.appendChild(Uo().createTextNode(t));
}
const jg = Te + " http://schemas.opengis.net/gml/2.1.2/feature.xsd", $g = {
  MultiLineString: "lineStringMember",
  MultiCurve: "curveMember",
  MultiPolygon: "polygonMember",
  MultiSurface: "surfaceMember"
};
class W extends v {
  /**
   * @param {import("./GMLBase.js").Options} [options] Optional configuration object.
   */
  constructor(t) {
    t = t || {}, super(t), this.FEATURE_COLLECTION_PARSERS[Te].featureMember = k(
      this.readFeaturesInternal
    ), this.schemaLocation = t.schemaLocation ? t.schemaLocation : jg;
  }
  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} Flat coordinates.
   */
  readFlatCoordinates(t, e) {
    const i = Ln(t, !1).replace(/^\s*|\s*$/g, ""), s = /** @type {import("../xml.js").NodeStackItem} */ e[0].srsName;
    let o = "enu";
    if (s) {
      const c = rt(s);
      c && (o = c.getAxisOrientation());
    }
    const a = i.trim().split(/\s+/), l = [];
    for (let c = 0, h = a.length; c < h; c++) {
      const u = a[c].split(/,+/), d = parseFloat(u[0]), f = parseFloat(u[1]), g = u.length === 3 ? parseFloat(u[2]) : 0;
      o.startsWith("en") ? l.push(d, f, g) : l.push(f, d, g);
    }
    return l;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {import("../extent.js").Extent|undefined} Envelope.
   */
  readBox(t, e) {
    const i = it(
      [null],
      this.BOX_PARSERS_,
      t,
      e,
      this
    );
    return ne(
      i[1][0],
      i[1][1],
      i[1][3],
      i[1][4]
    );
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  innerBoundaryIsParser(t, e) {
    const i = it(
      void 0,
      this.RING_PARSERS,
      t,
      e,
      this
    );
    i && /** @type {Array<Array<number>>} */
    e[e.length - 1].push(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  outerBoundaryIsParser(t, e) {
    const i = it(
      void 0,
      this.RING_PARSERS,
      t,
      e,
      this
    );
    if (i) {
      const n = (
        /** @type {Array<Array<number>>} */
        e[e.length - 1]
      );
      n[0] = i;
    }
  }
  /**
   * @const
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string} [nodeName] Node name.
   * @return {Element|undefined} Node.
   * @private
   */
  GEOMETRY_NODE_FACTORY_(t, e, i) {
    const n = e[e.length - 1], s = n.multiSurface, o = n.surface, a = n.multiCurve;
    return Array.isArray(t) ? i = "Envelope" : (i = /** @type {import("../geom/Geometry.js").default} */
    t.getType(), i === "MultiPolygon" && s === !0 ? i = "MultiSurface" : i === "Polygon" && o === !0 ? i = "Surface" : i === "MultiLineString" && a === !0 && (i = "MultiCurve")), D("http://www.opengis.net/gml", i);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {Array<*>} objectStack Node stack.
   */
  writeFeatureElement(t, e, i) {
    const n = e.getId();
    n && t.setAttribute(
      "fid",
      /** @type {string} */
      n
    );
    const s = (
      /** @type {Object} */
      i[i.length - 1]
    ), o = s.featureNS, a = e.getGeometryName();
    s.serializers || (s.serializers = {}, s.serializers[o] = {});
    const l = [], c = [];
    if (e.hasProperties()) {
      const u = e.getProperties();
      for (const d in u) {
        const f = u[d];
        f != null && (l.push(d), c.push(f), d == a || typeof /** @type {?} */
        f.getSimplifiedGeometry == "function" ? d in s.serializers[o] || (s.serializers[o][d] = E(
          this.writeGeometryElement,
          this
        )) : d in s.serializers[o] || (s.serializers[o][d] = E(mt)));
      }
    }
    const h = Object.assign({}, s);
    h.node = t, dt(
      /** @type {import("../xml.js").NodeStackItem} */
      h,
      s.serializers,
      Ut(void 0, o),
      c,
      i,
      l
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LineString.js").default} geometry LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeCurveOrLineString(t, e, i) {
    const s = i[i.length - 1].srsName;
    if (t.nodeName !== "LineStringSegment" && s && t.setAttribute("srsName", s), t.nodeName === "LineString" || t.nodeName === "LineStringSegment") {
      const o = this.createCoordinatesNode_(t.namespaceURI);
      t.appendChild(o), this.writeCoordinates_(o, e, i);
    } else if (t.nodeName === "Curve") {
      const o = D(t.namespaceURI, "segments");
      t.appendChild(o), this.writeCurveSegments_(o, e, i);
    }
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LineString.js").default} line LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeLineStringOrCurveMember(t, e, i) {
    const n = this.GEOMETRY_NODE_FACTORY_(e, i);
    n && (t.appendChild(n), this.writeCurveOrLineString(n, e, i));
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/MultiLineString.js").default} geometry MultiLineString geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeMultiCurveOrLineString(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName, a = n.curve;
    o && t.setAttribute("srsName", o);
    const l = e.getLineStrings();
    dt(
      { node: t, hasZ: s, srsName: o, curve: a },
      this.LINESTRINGORCURVEMEMBER_SERIALIZERS,
      this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,
      l,
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Node} node Node.
   * @param {import("../geom/Geometry.js").default|import("../extent.js").Extent} geometry Geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeGeometryElement(t, e, i) {
    const n = (
      /** @type {import("./Feature.js").WriteOptions} */
      i[i.length - 1]
    ), s = Object.assign({}, n);
    s.node = t;
    let o;
    Array.isArray(e) ? o = Oo(
      /** @type {import("../extent.js").Extent} */
      e,
      n
    ) : o = $e(
      /** @type {import("../geom/Geometry.js").default} */
      e,
      !0,
      n
    ), dt(
      /** @type {import("../xml.js").NodeStackItem} */
      s,
      this.GEOMETRY_SERIALIZERS,
      this.GEOMETRY_NODE_FACTORY_,
      [o],
      i,
      void 0,
      this
    );
  }
  /**
   * @param {string} namespaceURI XML namespace.
   * @return {Element} coordinates node.
   * @private
   */
  createCoordinatesNode_(t) {
    const e = D(t, "coordinates");
    return e.setAttribute("decimal", "."), e.setAttribute("cs", ","), e.setAttribute("ts", " "), e;
  }
  /**
   * @param {Node} node Node.
   * @param {import("../geom/LineString.js").default|import("../geom/LinearRing.js").default} value Geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writeCoordinates_(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName, a = e.getCoordinates(), l = a.length, c = new Array(l);
    for (let h = 0; h < l; ++h) {
      const u = a[h];
      c[h] = this.getCoords_(u, o, s);
    }
    mt(t, c.join(" "));
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LineString.js").default} line LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writeCurveSegments_(t, e, i) {
    const n = D(t.namespaceURI, "LineStringSegment");
    t.appendChild(n), this.writeCurveOrLineString(n, e, i);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Polygon.js").default} geometry Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeSurfaceOrPolygon(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName;
    if (t.nodeName !== "PolygonPatch" && o && t.setAttribute("srsName", o), t.nodeName === "Polygon" || t.nodeName === "PolygonPatch") {
      const a = e.getLinearRings();
      dt(
        { node: t, hasZ: s, srsName: o },
        this.RING_SERIALIZERS,
        this.RING_NODE_FACTORY_,
        a,
        i,
        void 0,
        this
      );
    } else if (t.nodeName === "Surface") {
      const a = D(t.namespaceURI, "patches");
      t.appendChild(a), this.writeSurfacePatches_(a, e, i);
    }
  }
  /**
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string} [nodeName] Node name.
   * @return {Node} Node.
   * @private
   */
  RING_NODE_FACTORY_(t, e, i) {
    const n = e[e.length - 1], s = n.node, o = n.exteriorWritten;
    return o === void 0 && (n.exteriorWritten = !0), D(
      s.namespaceURI,
      o !== void 0 ? "innerBoundaryIs" : "outerBoundaryIs"
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Polygon.js").default} polygon Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writeSurfacePatches_(t, e, i) {
    const n = D(t.namespaceURI, "PolygonPatch");
    t.appendChild(n), this.writeSurfaceOrPolygon(n, e, i);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LinearRing.js").default} ring LinearRing geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeRing(t, e, i) {
    const n = D(t.namespaceURI, "LinearRing");
    t.appendChild(n), this.writeLinearRing(n, e, i);
  }
  /**
   * @param {Array<number>} point Point geometry.
   * @param {string} [srsName] Optional srsName
   * @param {boolean} [hasZ] whether the geometry has a Z coordinate (is 3D) or not.
   * @return {string} The coords string.
   * @private
   */
  getCoords_(t, e, i) {
    let s = (e ? rt(e).getAxisOrientation() : "enu").startsWith("en") ? t[0] + "," + t[1] : t[1] + "," + t[0];
    if (i) {
      const o = t[2] || 0;
      s += "," + o;
    }
    return s;
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} geometry Point geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writePoint(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName;
    o && t.setAttribute("srsName", o);
    const a = this.createCoordinatesNode_(t.namespaceURI);
    t.appendChild(a);
    const l = e.getCoordinates(), c = this.getCoords_(l, o, s);
    mt(a, c);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/MultiPoint.js").default} geometry MultiPoint geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeMultiPoint(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName;
    o && t.setAttribute("srsName", o);
    const a = e.getPoints();
    dt(
      { node: t, hasZ: s, srsName: o },
      this.POINTMEMBER_SERIALIZERS,
      Ut("pointMember"),
      a,
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} point Point geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writePointMember(t, e, i) {
    const n = D(t.namespaceURI, "Point");
    t.appendChild(n), this.writePoint(n, e, i);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LinearRing.js").default} geometry LinearRing geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeLinearRing(t, e, i) {
    const s = i[i.length - 1].srsName;
    s && t.setAttribute("srsName", s);
    const o = this.createCoordinatesNode_(t.namespaceURI);
    t.appendChild(o), this.writeCoordinates_(o, e, i);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeMultiSurfaceOrPolygon(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName, a = n.surface;
    o && t.setAttribute("srsName", o);
    const l = e.getPolygons();
    dt(
      { node: t, hasZ: s, srsName: o, surface: a },
      this.SURFACEORPOLYGONMEMBER_SERIALIZERS,
      this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,
      l,
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Node} node Node.
   * @param {import("../geom/Polygon.js").default} polygon Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeSurfaceOrPolygonMember(t, e, i) {
    const n = this.GEOMETRY_NODE_FACTORY_(e, i);
    n && (t.appendChild(n), this.writeSurfaceOrPolygon(n, e, i));
  }
  /**
   * @param {Element} node Node.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {Array<*>} objectStack Node stack.
   */
  writeEnvelope(t, e, i) {
    const s = i[i.length - 1].srsName;
    s && t.setAttribute("srsName", s);
    const o = ["lowerCorner", "upperCorner"], a = [e[0] + " " + e[1], e[2] + " " + e[3]];
    dt(
      /** @type {import("../xml.js").NodeStackItem} */
      { node: t },
      this.ENVELOPE_SERIALIZERS,
      zh,
      a,
      i,
      o,
      this
    );
  }
  /**
   * @const
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string} [nodeName] Node name.
   * @return {Node|undefined} Node.
   * @private
   */
  MULTIGEOMETRY_MEMBER_NODE_FACTORY_(t, e, i) {
    const n = e[e.length - 1].node;
    return D(
      "http://www.opengis.net/gml",
      $g[n.nodeName]
    );
  }
}
W.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  "http://www.opengis.net/gml": {
    coordinates: O(W.prototype.readFlatCoordinates)
  }
};
W.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  "http://www.opengis.net/gml": {
    innerBoundaryIs: W.prototype.innerBoundaryIsParser,
    outerBoundaryIs: W.prototype.outerBoundaryIsParser
  }
};
W.prototype.BOX_PARSERS_ = {
  "http://www.opengis.net/gml": {
    coordinates: k(W.prototype.readFlatCoordinates)
  }
};
W.prototype.GEOMETRY_PARSERS = {
  "http://www.opengis.net/gml": {
    Point: O(v.prototype.readPoint),
    MultiPoint: O(v.prototype.readMultiPoint),
    LineString: O(v.prototype.readLineString),
    MultiLineString: O(v.prototype.readMultiLineString),
    LinearRing: O(v.prototype.readLinearRing),
    Polygon: O(v.prototype.readPolygon),
    MultiPolygon: O(v.prototype.readMultiPolygon),
    Box: O(W.prototype.readBox)
  }
};
W.prototype.GEOMETRY_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    Curve: E(W.prototype.writeCurveOrLineString),
    MultiCurve: E(W.prototype.writeMultiCurveOrLineString),
    Point: E(W.prototype.writePoint),
    MultiPoint: E(W.prototype.writeMultiPoint),
    LineString: E(W.prototype.writeCurveOrLineString),
    MultiLineString: E(
      W.prototype.writeMultiCurveOrLineString
    ),
    LinearRing: E(W.prototype.writeLinearRing),
    Polygon: E(W.prototype.writeSurfaceOrPolygon),
    MultiPolygon: E(
      W.prototype.writeMultiSurfaceOrPolygon
    ),
    Surface: E(W.prototype.writeSurfaceOrPolygon),
    MultiSurface: E(
      W.prototype.writeMultiSurfaceOrPolygon
    ),
    Envelope: E(W.prototype.writeEnvelope)
  }
};
W.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    lineStringMember: E(
      W.prototype.writeLineStringOrCurveMember
    ),
    curveMember: E(
      W.prototype.writeLineStringOrCurveMember
    )
  }
};
W.prototype.RING_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    outerBoundaryIs: E(W.prototype.writeRing),
    innerBoundaryIs: E(W.prototype.writeRing)
  }
};
W.prototype.POINTMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    pointMember: E(W.prototype.writePointMember)
  }
};
W.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    surfaceMember: E(
      W.prototype.writeSurfaceOrPolygonMember
    ),
    polygonMember: E(
      W.prototype.writeSurfaceOrPolygonMember
    )
  }
};
W.prototype.ENVELOPE_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    lowerCorner: E(mt),
    upperCorner: E(mt)
  }
};
const Kg = Te + " http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/1.0.0/gmlsf.xsd", Hg = {
  MultiLineString: "lineStringMember",
  MultiCurve: "curveMember",
  MultiPolygon: "polygonMember",
  MultiSurface: "surfaceMember"
};
class x extends v {
  /**
   * @param {import("./GMLBase.js").Options} [options] Optional configuration object.
   */
  constructor(t) {
    t = t || {}, super(t), this.surface_ = t.surface !== void 0 ? t.surface : !1, this.curve_ = t.curve !== void 0 ? t.curve : !1, this.multiCurve_ = t.multiCurve !== void 0 ? t.multiCurve : !0, this.multiSurface_ = t.multiSurface !== void 0 ? t.multiSurface : !0, this.schemaLocation = t.schemaLocation ? t.schemaLocation : Kg, this.hasZ = t.hasZ !== void 0 ? t.hasZ : !1;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiLineString|undefined} MultiLineString.
   */
  readMultiCurve(t, e) {
    const i = it(
      [],
      this.MULTICURVE_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return new se(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} Polygon.
   */
  readFlatCurveRing(t, e) {
    const i = it(
      [],
      this.MULTICURVE_PARSERS,
      t,
      e,
      this
    ), n = [];
    for (let s = 0, o = i.length; s < o; ++s)
      It(n, i[s].getFlatCoordinates());
    return n;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiPolygon|undefined} MultiPolygon.
   */
  readMultiSurface(t, e) {
    const i = it(
      [],
      this.MULTISURFACE_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return new ve(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  curveMemberParser(t, e) {
    ai(this.CURVEMEMBER_PARSERS, t, e, this);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  surfaceMemberParser(t, e) {
    ai(this.SURFACEMEMBER_PARSERS, t, e, this);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<(Array<number>)>|undefined} flat coordinates.
   */
  readPatch(t, e) {
    return it(
      [null],
      this.PATCHES_PARSERS,
      t,
      e,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} flat coordinates.
   */
  readSegment(t, e) {
    return it([], this.SEGMENTS_PARSERS, t, e, this);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<(Array<number>)>|undefined} flat coordinates.
   */
  readPolygonPatch(t, e) {
    return it(
      [null],
      this.FLAT_LINEAR_RINGS_PARSERS,
      t,
      e,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} flat coordinates.
   */
  readLineStringSegment(t, e) {
    return it(
      [null],
      this.GEOMETRY_FLAT_COORDINATES_PARSERS,
      t,
      e,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  interiorParser(t, e) {
    const i = it(
      void 0,
      this.RING_PARSERS,
      t,
      e,
      this
    );
    i && /** @type {Array<Array<number>>} */
    e[e.length - 1].push(i);
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   */
  exteriorParser(t, e) {
    const i = it(
      void 0,
      this.RING_PARSERS,
      t,
      e,
      this
    );
    if (i) {
      const n = (
        /** @type {Array<Array<number>>} */
        e[e.length - 1]
      );
      n[0] = i;
    }
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Polygon|undefined} Polygon.
   */
  readSurface(t, e) {
    const i = it(
      [null],
      this.SURFACE_PARSERS,
      t,
      e,
      this
    );
    if (i && i[0]) {
      const n = i[0], s = [n.length];
      let o, a;
      for (o = 1, a = i.length; o < a; ++o)
        It(n, i[o]), s.push(n.length);
      return new qt(n, "XYZ", s);
    }
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {LineString|undefined} LineString.
   */
  readCurve(t, e) {
    const i = it(
      [null],
      this.CURVE_PARSERS,
      t,
      e,
      this
    );
    if (i)
      return new bt(i, "XYZ");
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {import("../extent.js").Extent|undefined} Envelope.
   */
  readEnvelope(t, e) {
    const i = it(
      [null],
      this.ENVELOPE_PARSERS,
      t,
      e,
      this
    );
    return ne(
      i[1][0],
      i[1][1],
      i[2][0],
      i[2][1]
    );
  }
  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} Flat coordinates.
   */
  readFlatPos(t, e) {
    let i = Ln(t, !1);
    const n = /^\s*([+\-]?\d*\.?\d+(?:[eE][+\-]?\d+)?)\s*/, s = [];
    let o;
    for (; o = n.exec(i); )
      s.push(parseFloat(o[1])), i = i.substr(o[0].length);
    if (i !== "")
      return;
    const l = e[0].srsName;
    if ((l ? rt(l).getAxisOrientation() : "enu") === "neu")
      for (let u = 0, d = s.length; u < d; u += 3) {
        const f = s[u], g = s[u + 1];
        s[u] = g, s[u + 1] = f;
      }
    const h = s.length;
    if (h == 2 && s.push(0), h !== 0)
      return s;
  }
  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<number>|undefined} Flat coordinates.
   */
  readFlatPosList(t, e) {
    const i = Ln(t, !1).replace(/^\s*|\s*$/g, ""), n = e[0], s = n.srsName, o = n.srsDimension, a = s ? rt(s).getAxisOrientation() : "enu", l = i.split(/\s+/);
    let c = 2;
    t.getAttribute("srsDimension") ? c = Ni(t.getAttribute("srsDimension")) : t.getAttribute("dimension") ? c = Ni(t.getAttribute("dimension")) : /** @type {Element} */ t.parentNode.getAttribute("srsDimension") ? c = Ni(
      /** @type {Element} */
      t.parentNode.getAttribute("srsDimension")
    ) : o && (c = Ni(o));
    const h = a.startsWith("en");
    let u, d, f;
    const g = [];
    for (let m = 0, _ = l.length; m < _; m += c)
      u = parseFloat(l[m]), d = parseFloat(l[m + 1]), f = c === 3 ? parseFloat(l[m + 2]) : 0, h ? g.push(u, d, f) : g.push(d, u, f);
    return g;
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} value Point geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writePos_(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = s ? "3" : "2";
    t.setAttribute("srsDimension", o);
    const a = n.srsName, l = a ? rt(a).getAxisOrientation() : "enu", c = e.getCoordinates();
    let h = l.startsWith("en") ? c[0] + " " + c[1] : c[1] + " " + c[0];
    if (s) {
      const u = c[2] || 0;
      h += " " + u;
    }
    mt(t, h);
  }
  /**
   * @param {Array<number>} point Point geometry.
   * @param {string} [srsName] Optional srsName
   * @param {boolean} [hasZ] whether the geometry has a Z coordinate (is 3D) or not.
   * @return {string} The coords string.
   * @private
   */
  getCoords_(t, e, i) {
    let s = (e ? rt(e).getAxisOrientation() : "enu").startsWith("en") ? t[0] + " " + t[1] : t[1] + " " + t[0];
    if (i) {
      const o = t[2] || 0;
      s += " " + o;
    }
    return s;
  }
  /**
   * @param {Element} node Node.
   * @param {LineString|import("../geom/LinearRing.js").default} value Geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writePosList_(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = s ? "3" : "2";
    t.setAttribute("srsDimension", o);
    const a = n.srsName, l = e.getCoordinates(), c = l.length, h = new Array(c);
    let u;
    for (let d = 0; d < c; ++d)
      u = l[d], h[d] = this.getCoords_(u, a, s);
    mt(t, h.join(" "));
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} geometry Point geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writePoint(t, e, i) {
    const s = i[i.length - 1].srsName;
    s && t.setAttribute("srsName", s);
    const o = D(t.namespaceURI, "pos");
    t.appendChild(o), this.writePos_(o, e, i);
  }
  /**
   * @param {Element} node Node.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {Array<*>} objectStack Node stack.
   */
  writeEnvelope(t, e, i) {
    const s = i[i.length - 1].srsName;
    s && t.setAttribute("srsName", s);
    const o = ["lowerCorner", "upperCorner"], a = [e[0] + " " + e[1], e[2] + " " + e[3]];
    dt(
      /** @type {import("../xml.js").NodeStackItem} */
      { node: t },
      this.ENVELOPE_SERIALIZERS,
      zh,
      a,
      i,
      o,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LinearRing.js").default} geometry LinearRing geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeLinearRing(t, e, i) {
    const s = i[i.length - 1].srsName;
    s && t.setAttribute("srsName", s);
    const o = D(t.namespaceURI, "posList");
    t.appendChild(o), this.writePosList_(o, e, i);
  }
  /**
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string} [nodeName] Node name.
   * @return {Node} Node.
   * @private
   */
  RING_NODE_FACTORY_(t, e, i) {
    const n = e[e.length - 1], s = n.node, o = n.exteriorWritten;
    return o === void 0 && (n.exteriorWritten = !0), D(
      s.namespaceURI,
      o !== void 0 ? "interior" : "exterior"
    );
  }
  /**
   * @param {Element} node Node.
   * @param {Polygon} geometry Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeSurfaceOrPolygon(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName;
    if (t.nodeName !== "PolygonPatch" && o && t.setAttribute("srsName", o), t.nodeName === "Polygon" || t.nodeName === "PolygonPatch") {
      const a = e.getLinearRings();
      dt(
        { node: t, hasZ: s, srsName: o },
        this.RING_SERIALIZERS,
        this.RING_NODE_FACTORY_,
        a,
        i,
        void 0,
        this
      );
    } else if (t.nodeName === "Surface") {
      const a = D(t.namespaceURI, "patches");
      t.appendChild(a), this.writeSurfacePatches_(a, e, i);
    }
  }
  /**
   * @param {Element} node Node.
   * @param {LineString} geometry LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeCurveOrLineString(t, e, i) {
    const s = i[i.length - 1].srsName;
    if (t.nodeName !== "LineStringSegment" && s && t.setAttribute("srsName", s), t.nodeName === "LineString" || t.nodeName === "LineStringSegment") {
      const o = D(t.namespaceURI, "posList");
      t.appendChild(o), this.writePosList_(o, e, i);
    } else if (t.nodeName === "Curve") {
      const o = D(t.namespaceURI, "segments");
      t.appendChild(o), this.writeCurveSegments_(o, e, i);
    }
  }
  /**
   * @param {Element} node Node.
   * @param {MultiPolygon} geometry MultiPolygon geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeMultiSurfaceOrPolygon(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName, a = n.surface;
    o && t.setAttribute("srsName", o);
    const l = e.getPolygons();
    dt(
      { node: t, hasZ: s, srsName: o, surface: a },
      this.SURFACEORPOLYGONMEMBER_SERIALIZERS,
      this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,
      l,
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/MultiPoint.js").default} geometry MultiPoint geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeMultiPoint(t, e, i) {
    const n = i[i.length - 1], s = n.srsName, o = n.hasZ;
    s && t.setAttribute("srsName", s);
    const a = e.getPoints();
    dt(
      { node: t, hasZ: o, srsName: s },
      this.POINTMEMBER_SERIALIZERS,
      Ut("pointMember"),
      a,
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {MultiLineString} geometry MultiLineString geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeMultiCurveOrLineString(t, e, i) {
    const n = i[i.length - 1], s = n.hasZ, o = n.srsName, a = n.curve;
    o && t.setAttribute("srsName", o);
    const l = e.getLineStrings();
    dt(
      { node: t, hasZ: s, srsName: o, curve: a },
      this.LINESTRINGORCURVEMEMBER_SERIALIZERS,
      this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_,
      l,
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/LinearRing.js").default} ring LinearRing geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeRing(t, e, i) {
    const n = D(t.namespaceURI, "LinearRing");
    t.appendChild(n), this.writeLinearRing(n, e, i);
  }
  /**
   * @param {Node} node Node.
   * @param {Polygon} polygon Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeSurfaceOrPolygonMember(t, e, i) {
    const n = this.GEOMETRY_NODE_FACTORY_(e, i);
    n && (t.appendChild(n), this.writeSurfaceOrPolygon(n, e, i));
  }
  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} point Point geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writePointMember(t, e, i) {
    const n = D(t.namespaceURI, "Point");
    t.appendChild(n), this.writePoint(n, e, i);
  }
  /**
   * @param {Node} node Node.
   * @param {LineString} line LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeLineStringOrCurveMember(t, e, i) {
    const n = this.GEOMETRY_NODE_FACTORY_(e, i);
    n && (t.appendChild(n), this.writeCurveOrLineString(n, e, i));
  }
  /**
   * @param {Element} node Node.
   * @param {Polygon} polygon Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writeSurfacePatches_(t, e, i) {
    const n = D(t.namespaceURI, "PolygonPatch");
    t.appendChild(n), this.writeSurfaceOrPolygon(n, e, i);
  }
  /**
   * @param {Element} node Node.
   * @param {LineString} line LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writeCurveSegments_(t, e, i) {
    const n = D(t.namespaceURI, "LineStringSegment");
    t.appendChild(n), this.writeCurveOrLineString(n, e, i);
  }
  /**
   * @param {Node} node Node.
   * @param {import("../geom/Geometry.js").default|import("../extent.js").Extent} geometry Geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  writeGeometryElement(t, e, i) {
    const n = (
      /** @type {import("./Feature.js").WriteOptions} */
      i[i.length - 1]
    ), s = Object.assign({}, n);
    s.node = t;
    let o;
    Array.isArray(e) ? o = Oo(
      /** @type {import("../extent.js").Extent} */
      e,
      n
    ) : o = $e(
      /** @type {import("../geom/Geometry.js").default} */
      e,
      !0,
      n
    ), dt(
      /** @type {import("../xml.js").NodeStackItem} */
      s,
      this.GEOMETRY_SERIALIZERS,
      this.GEOMETRY_NODE_FACTORY_,
      [o],
      i,
      void 0,
      this
    );
  }
  /**
   * @param {Element} node Node.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {Array<*>} objectStack Node stack.
   */
  writeFeatureElement(t, e, i) {
    const n = e.getId();
    n && t.setAttribute(
      "fid",
      /** @type {string} */
      n
    );
    const s = (
      /** @type {Object} */
      i[i.length - 1]
    ), o = s.featureNS, a = e.getGeometryName();
    s.serializers || (s.serializers = {}, s.serializers[o] = {});
    const l = [], c = [];
    if (e.hasProperties()) {
      const u = e.getProperties();
      for (const d in u) {
        const f = u[d];
        f != null && (l.push(d), c.push(f), d == a || typeof /** @type {?} */
        f.getSimplifiedGeometry == "function" ? d in s.serializers[o] || (s.serializers[o][d] = E(
          this.writeGeometryElement,
          this
        )) : d in s.serializers[o] || (s.serializers[o][d] = E(mt)));
      }
    }
    const h = Object.assign({}, s);
    h.node = t, dt(
      /** @type {import("../xml.js").NodeStackItem} */
      h,
      s.serializers,
      Ut(void 0, o),
      c,
      i,
      l
    );
  }
  /**
   * @param {Node} node Node.
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  writeFeatureMembers_(t, e, i) {
    const n = (
      /** @type {Object} */
      i[i.length - 1]
    ), s = n.featureType, o = n.featureNS, a = {};
    a[o] = {}, a[o][s] = E(
      this.writeFeatureElement,
      this
    );
    const l = Object.assign({}, n);
    l.node = t, dt(
      /** @type {import("../xml.js").NodeStackItem} */
      l,
      a,
      Ut(s, o),
      e,
      i
    );
  }
  /**
   * @const
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string} [nodeName] Node name.
   * @return {Node|undefined} Node.
   * @private
   */
  MULTIGEOMETRY_MEMBER_NODE_FACTORY_(t, e, i) {
    const n = e[e.length - 1].node;
    return D(
      this.namespace,
      Hg[n.nodeName]
    );
  }
  /**
   * @const
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string} [nodeName] Node name.
   * @return {Element|undefined} Node.
   * @private
   */
  GEOMETRY_NODE_FACTORY_(t, e, i) {
    const n = e[e.length - 1], s = n.multiSurface, o = n.surface, a = n.curve, l = n.multiCurve;
    return Array.isArray(t) ? i = "Envelope" : (i = /** @type {import("../geom/Geometry.js").default} */
    t.getType(), i === "MultiPolygon" && s === !0 ? i = "MultiSurface" : i === "Polygon" && o === !0 ? i = "Surface" : i === "LineString" && a === !0 ? i = "Curve" : i === "MultiLineString" && l === !0 && (i = "MultiCurve")), D(this.namespace, i);
  }
  /**
   * Encode a geometry in GML 3.1.1 Simple Features.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Node} Node.
   * @api
   * @override
   */
  writeGeometryNode(t, e) {
    e = this.adaptOptions(e);
    const i = D(this.namespace, "geom"), n = {
      node: i,
      hasZ: this.hasZ,
      srsName: this.srsName,
      curve: this.curve_,
      surface: this.surface_,
      multiSurface: this.multiSurface_,
      multiCurve: this.multiCurve_
    };
    return e && Object.assign(n, e), this.writeGeometryElement(i, t, [n]), i;
  }
  /**
   * Encode an array of features in the GML 3.1.1 format as an XML node.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Options.
   * @return {Element} Node.
   * @api
   * @override
   */
  writeFeaturesNode(t, e) {
    e = this.adaptOptions(e);
    const i = D(this.namespace, "featureMembers");
    i.setAttributeNS(
      js,
      "xsi:schemaLocation",
      this.schemaLocation
    );
    const n = {
      srsName: this.srsName,
      hasZ: this.hasZ,
      curve: this.curve_,
      surface: this.surface_,
      multiSurface: this.multiSurface_,
      multiCurve: this.multiCurve_,
      featureNS: this.featureNS,
      featureType: this.featureType
    };
    return e && Object.assign(n, e), this.writeFeatureMembers_(i, t, [n]), i;
  }
}
x.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  "http://www.opengis.net/gml": {
    pos: O(x.prototype.readFlatPos),
    posList: O(x.prototype.readFlatPosList),
    coordinates: O(W.prototype.readFlatCoordinates)
  }
};
x.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  "http://www.opengis.net/gml": {
    interior: x.prototype.interiorParser,
    exterior: x.prototype.exteriorParser
  }
};
x.prototype.GEOMETRY_PARSERS = {
  "http://www.opengis.net/gml": {
    Point: O(v.prototype.readPoint),
    MultiPoint: O(v.prototype.readMultiPoint),
    LineString: O(v.prototype.readLineString),
    MultiLineString: O(v.prototype.readMultiLineString),
    LinearRing: O(v.prototype.readLinearRing),
    Polygon: O(v.prototype.readPolygon),
    MultiPolygon: O(v.prototype.readMultiPolygon),
    Surface: O(x.prototype.readSurface),
    MultiSurface: O(x.prototype.readMultiSurface),
    Curve: O(x.prototype.readCurve),
    MultiCurve: O(x.prototype.readMultiCurve),
    Envelope: O(x.prototype.readEnvelope)
  }
};
x.prototype.MULTICURVE_PARSERS = {
  "http://www.opengis.net/gml": {
    curveMember: k(x.prototype.curveMemberParser),
    curveMembers: k(x.prototype.curveMemberParser)
  }
};
x.prototype.MULTISURFACE_PARSERS = {
  "http://www.opengis.net/gml": {
    surfaceMember: k(x.prototype.surfaceMemberParser),
    surfaceMembers: k(x.prototype.surfaceMemberParser)
  }
};
x.prototype.CURVEMEMBER_PARSERS = {
  "http://www.opengis.net/gml": {
    LineString: k(v.prototype.readLineString),
    Curve: k(x.prototype.readCurve)
  }
};
x.prototype.SURFACEMEMBER_PARSERS = {
  "http://www.opengis.net/gml": {
    Polygon: k(v.prototype.readPolygon),
    Surface: k(x.prototype.readSurface)
  }
};
x.prototype.SURFACE_PARSERS = {
  "http://www.opengis.net/gml": {
    patches: O(x.prototype.readPatch)
  }
};
x.prototype.CURVE_PARSERS = {
  "http://www.opengis.net/gml": {
    segments: O(x.prototype.readSegment)
  }
};
x.prototype.ENVELOPE_PARSERS = {
  "http://www.opengis.net/gml": {
    lowerCorner: k(x.prototype.readFlatPosList),
    upperCorner: k(x.prototype.readFlatPosList)
  }
};
x.prototype.PATCHES_PARSERS = {
  "http://www.opengis.net/gml": {
    PolygonPatch: O(x.prototype.readPolygonPatch)
  }
};
x.prototype.SEGMENTS_PARSERS = {
  "http://www.opengis.net/gml": {
    LineStringSegment: Xh(
      x.prototype.readLineStringSegment
    )
  }
};
v.prototype.RING_PARSERS = {
  "http://www.opengis.net/gml": {
    LinearRing: O(v.prototype.readFlatLinearRing),
    Ring: O(x.prototype.readFlatCurveRing)
  }
};
x.prototype.writeFeatures;
x.prototype.RING_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    exterior: E(x.prototype.writeRing),
    interior: E(x.prototype.writeRing)
  }
};
x.prototype.ENVELOPE_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    lowerCorner: E(mt),
    upperCorner: E(mt)
  }
};
x.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    surfaceMember: E(
      x.prototype.writeSurfaceOrPolygonMember
    ),
    polygonMember: E(
      x.prototype.writeSurfaceOrPolygonMember
    )
  }
};
x.prototype.POINTMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    pointMember: E(x.prototype.writePointMember)
  }
};
x.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    lineStringMember: E(
      x.prototype.writeLineStringOrCurveMember
    ),
    curveMember: E(
      x.prototype.writeLineStringOrCurveMember
    )
  }
};
x.prototype.GEOMETRY_SERIALIZERS = {
  "http://www.opengis.net/gml": {
    Curve: E(x.prototype.writeCurveOrLineString),
    MultiCurve: E(x.prototype.writeMultiCurveOrLineString),
    Point: E(x.prototype.writePoint),
    MultiPoint: E(x.prototype.writeMultiPoint),
    LineString: E(x.prototype.writeCurveOrLineString),
    MultiLineString: E(
      x.prototype.writeMultiCurveOrLineString
    ),
    LinearRing: E(x.prototype.writeLinearRing),
    Polygon: E(x.prototype.writeSurfaceOrPolygon),
    MultiPolygon: E(
      x.prototype.writeMultiSurfaceOrPolygon
    ),
    Surface: E(x.prototype.writeSurfaceOrPolygon),
    MultiSurface: E(
      x.prototype.writeMultiSurfaceOrPolygon
    ),
    Envelope: E(x.prototype.writeEnvelope)
  }
};
class H extends x {
  /**
   * @param {import("./GMLBase.js").Options} [options] Optional configuration object.
   */
  constructor(t) {
    t = t || {}, super(t), this.schemaLocation = t.schemaLocation ? t.schemaLocation : this.namespace + " http://schemas.opengis.net/gml/3.2.1/gml.xsd";
  }
  /**
   * @param {Node} node Node.
   * @param {import("../geom/Geometry.js").default|import("../extent.js").Extent} geometry Geometry.
   * @param {Array<*>} objectStack Node stack.
   * @override
   */
  writeGeometryElement(t, e, i) {
    const n = i[i.length - 1];
    i[i.length - 1] = Object.assign(
      { multiCurve: !0, multiSurface: !0 },
      n
    ), super.writeGeometryElement(t, e, i);
  }
}
H.prototype.namespace = "http://www.opengis.net/gml/3.2";
H.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    pos: O(x.prototype.readFlatPos),
    posList: O(x.prototype.readFlatPosList),
    coordinates: O(W.prototype.readFlatCoordinates)
  }
};
H.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    interior: x.prototype.interiorParser,
    exterior: x.prototype.exteriorParser
  }
};
H.prototype.GEOMETRY_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    Point: O(v.prototype.readPoint),
    MultiPoint: O(v.prototype.readMultiPoint),
    LineString: O(v.prototype.readLineString),
    MultiLineString: O(v.prototype.readMultiLineString),
    LinearRing: O(v.prototype.readLinearRing),
    Polygon: O(v.prototype.readPolygon),
    MultiPolygon: O(v.prototype.readMultiPolygon),
    Surface: O(H.prototype.readSurface),
    MultiSurface: O(x.prototype.readMultiSurface),
    Curve: O(H.prototype.readCurve),
    MultiCurve: O(x.prototype.readMultiCurve),
    Envelope: O(H.prototype.readEnvelope)
  }
};
H.prototype.MULTICURVE_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    curveMember: k(x.prototype.curveMemberParser),
    curveMembers: k(x.prototype.curveMemberParser)
  }
};
H.prototype.MULTISURFACE_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    surfaceMember: k(x.prototype.surfaceMemberParser),
    surfaceMembers: k(x.prototype.surfaceMemberParser)
  }
};
H.prototype.CURVEMEMBER_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    LineString: k(v.prototype.readLineString),
    Curve: k(x.prototype.readCurve)
  }
};
H.prototype.SURFACEMEMBER_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    Polygon: k(v.prototype.readPolygon),
    Surface: k(x.prototype.readSurface)
  }
};
H.prototype.SURFACE_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    patches: O(x.prototype.readPatch)
  }
};
H.prototype.CURVE_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    segments: O(x.prototype.readSegment)
  }
};
H.prototype.ENVELOPE_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    lowerCorner: k(x.prototype.readFlatPosList),
    upperCorner: k(x.prototype.readFlatPosList)
  }
};
H.prototype.PATCHES_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    PolygonPatch: O(x.prototype.readPolygonPatch)
  }
};
H.prototype.SEGMENTS_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    LineStringSegment: Xh(
      x.prototype.readLineStringSegment
    )
  }
};
H.prototype.MULTIPOINT_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    pointMember: k(v.prototype.pointMemberParser),
    pointMembers: k(v.prototype.pointMemberParser)
  }
};
H.prototype.MULTILINESTRING_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    lineStringMember: k(
      v.prototype.lineStringMemberParser
    ),
    lineStringMembers: k(
      v.prototype.lineStringMemberParser
    )
  }
};
H.prototype.MULTIPOLYGON_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    polygonMember: k(v.prototype.polygonMemberParser),
    polygonMembers: k(v.prototype.polygonMemberParser)
  }
};
H.prototype.POINTMEMBER_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    Point: k(v.prototype.readFlatCoordinatesFromNode)
  }
};
H.prototype.LINESTRINGMEMBER_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    LineString: k(v.prototype.readLineString)
  }
};
H.prototype.POLYGONMEMBER_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    Polygon: k(v.prototype.readPolygon)
  }
};
H.prototype.RING_PARSERS = {
  "http://www.opengis.net/gml/3.2": {
    LinearRing: O(v.prototype.readFlatLinearRing),
    Ring: O(H.prototype.readFlatCurveRing)
  }
};
H.prototype.RING_SERIALIZERS = {
  "http://www.opengis.net/gml/3.2": {
    exterior: E(x.prototype.writeRing),
    interior: E(x.prototype.writeRing)
  }
};
H.prototype.ENVELOPE_SERIALIZERS = {
  "http://www.opengis.net/gml/3.2": {
    lowerCorner: E(mt),
    upperCorner: E(mt)
  }
};
H.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml/3.2": {
    surfaceMember: E(
      x.prototype.writeSurfaceOrPolygonMember
    ),
    polygonMember: E(
      x.prototype.writeSurfaceOrPolygonMember
    )
  }
};
H.prototype.POINTMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml/3.2": {
    pointMember: E(x.prototype.writePointMember)
  }
};
H.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS = {
  "http://www.opengis.net/gml/3.2": {
    lineStringMember: E(
      x.prototype.writeLineStringOrCurveMember
    ),
    curveMember: E(
      x.prototype.writeLineStringOrCurveMember
    )
  }
};
H.prototype.GEOMETRY_SERIALIZERS = {
  "http://www.opengis.net/gml/3.2": {
    Curve: E(x.prototype.writeCurveOrLineString),
    MultiCurve: E(x.prototype.writeMultiCurveOrLineString),
    Point: E(H.prototype.writePoint),
    MultiPoint: E(x.prototype.writeMultiPoint),
    LineString: E(x.prototype.writeCurveOrLineString),
    MultiLineString: E(
      x.prototype.writeMultiCurveOrLineString
    ),
    LinearRing: E(x.prototype.writeLinearRing),
    Polygon: E(x.prototype.writeSurfaceOrPolygon),
    MultiPolygon: E(
      x.prototype.writeMultiSurfaceOrPolygon
    ),
    Surface: E(x.prototype.writeSurfaceOrPolygon),
    MultiSurface: E(
      x.prototype.writeMultiSurfaceOrPolygon
    ),
    Envelope: E(x.prototype.writeEnvelope)
  }
};
class Vh {
  /**
   * @param {!string} tagName The XML tag name for this filter.
   */
  constructor(t) {
    this.tagName_ = t;
  }
  /**
   * The XML tag name for a filter.
   * @return {!string} Name.
   */
  getTagName() {
    return this.tagName_;
  }
}
class qg extends Vh {
  /**
   * @param {!string} tagName The XML tag name for this filter.
   * @param {Array<import("./Filter.js").default>} conditions Conditions.
   */
  constructor(t, e) {
    super(t), this.conditions = e, at(this.conditions.length >= 2, "At least 2 conditions are required");
  }
}
class Jg extends qg {
  /**
   * @param {...import("./Filter.js").default} conditions Conditions.
   */
  constructor(t) {
    super("And", Array.prototype.slice.call(arguments));
  }
}
class Qg extends Vh {
  /**
   * @param {!string} geometryName Geometry name to use.
   * @param {!import("../../extent.js").Extent} extent Extent.
   * @param {string} [srsName] SRS name. No srsName attribute will be set
   * on geometries when this is not provided.
   */
  constructor(t, e, i) {
    if (super("BBOX"), this.geometryName = t, this.extent = e, e.length !== 4)
      throw new Error(
        "Expected an extent with four values ([minX, minY, maxX, maxY])"
      );
    this.srsName = i;
  }
}
function tm(r) {
  const t = [null].concat(Array.prototype.slice.call(arguments));
  return new (Function.prototype.bind.apply(Jg, t))();
}
function em(r, t, e) {
  return new Qg(r, t, e);
}
const il = {
  "http://www.opengis.net/gml": {
    boundedBy: te(
      v.prototype.readExtentElement,
      "bounds"
    )
  },
  "http://www.opengis.net/wfs/2.0": {
    member: k(v.prototype.readFeaturesInternal)
  }
}, im = {
  "http://www.opengis.net/wfs": {
    totalInserted: te(Mi),
    totalUpdated: te(Mi),
    totalDeleted: te(Mi)
  },
  "http://www.opengis.net/wfs/2.0": {
    totalInserted: te(Mi),
    totalUpdated: te(Mi),
    totalDeleted: te(Mi)
  }
}, nm = {
  "http://www.opengis.net/wfs": {
    TransactionSummary: te(
      sl,
      "transactionSummary"
    ),
    InsertResults: te(al, "insertIds")
  },
  "http://www.opengis.net/wfs/2.0": {
    TransactionSummary: te(
      sl,
      "transactionSummary"
    ),
    InsertResults: te(al, "insertIds")
  }
}, rm = {
  "http://www.opengis.net/wfs": {
    PropertyName: E(mt)
  },
  "http://www.opengis.net/wfs/2.0": {
    PropertyName: E(mt)
  }
}, jh = {
  "http://www.opengis.net/wfs": {
    Insert: E(ll),
    Update: E(cl),
    Delete: E(hl),
    Property: E(ul),
    Native: E(dl)
  },
  "http://www.opengis.net/wfs/2.0": {
    Insert: E(ll),
    Update: E(cl),
    Delete: E(hl),
    Property: E(ul),
    Native: E(dl)
  }
}, $h = "feature", Wo = "http://www.w3.org/2000/xmlns/", Yo = {
  "2.0.0": "http://www.opengis.net/ogc/1.1",
  "1.1.0": "http://www.opengis.net/ogc",
  "1.0.0": "http://www.opengis.net/ogc"
}, $s = {
  "2.0.0": "http://www.opengis.net/wfs/2.0",
  "1.1.0": "http://www.opengis.net/wfs",
  "1.0.0": "http://www.opengis.net/wfs"
}, Bo = {
  "2.0.0": "http://www.opengis.net/fes/2.0",
  "1.1.0": "http://www.opengis.net/fes",
  "1.0.0": "http://www.opengis.net/fes"
}, nl = {
  "2.0.0": "http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd",
  "1.1.0": "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd",
  "1.0.0": "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd"
}, Xo = {
  "2.0.0": H,
  "1.1.0": x,
  "1.0.0": W
}, sm = "1.1.0";
class rl extends Zh {
  /**
   * @param {Options} [options] Optional configuration object.
   */
  constructor(t) {
    super(), t = t || {}, this.version_ = t.version ? t.version : sm, this.featureType_ = t.featureType, this.featureNS_ = t.featureNS, this.gmlFormat_ = t.gmlFormat ? t.gmlFormat : new Xo[this.version_](), this.schemaLocation_ = t.schemaLocation ? t.schemaLocation : nl[this.version_];
  }
  /**
   * @return {Array<string>|string|undefined} featureType
   */
  getFeatureType() {
    return this.featureType_;
  }
  /**
   * @param {Array<string>|string|undefined} featureType Feature type(s) to parse.
   */
  setFeatureType(t) {
    this.featureType_ = t;
  }
  /**
   * @protected
   * @param {Element} node Node.
   * @param {import("./Feature.js").ReadOptions} [options] Options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @override
   */
  readFeaturesFromNode(t, e) {
    const i = {
      node: t
    };
    Object.assign(i, {
      featureType: this.featureType_,
      featureNS: this.featureNS_
    }), Object.assign(i, this.getReadOptions(t, e || {}));
    const n = [i];
    let s;
    this.version_ === "2.0.0" ? s = il : s = this.gmlFormat_.FEATURE_COLLECTION_PARSERS;
    let o = it(
      [],
      s,
      t,
      n,
      this.gmlFormat_
    );
    return o || (o = []), o;
  }
  /**
   * Read transaction response of the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {TransactionResponse|undefined} Transaction response.
   * @api
   */
  readTransactionResponse(t) {
    if (t) {
      if (typeof t == "string") {
        const e = bi(t);
        return this.readTransactionResponseFromDocument(e);
      }
      return Oi(t) ? this.readTransactionResponseFromDocument(
        /** @type {Document} */
        t
      ) : this.readTransactionResponseFromNode(
        /** @type {Element} */
        t
      );
    }
  }
  /**
   * Read feature collection metadata of the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {FeatureCollectionMetadata|undefined}
   *     FeatureCollection metadata.
   * @api
   */
  readFeatureCollectionMetadata(t) {
    if (t) {
      if (typeof t == "string") {
        const e = bi(t);
        return this.readFeatureCollectionMetadataFromDocument(e);
      }
      return Oi(t) ? this.readFeatureCollectionMetadataFromDocument(
        /** @type {Document} */
        t
      ) : this.readFeatureCollectionMetadataFromNode(
        /** @type {Element} */
        t
      );
    }
  }
  /**
   * @param {Document} doc Document.
   * @return {FeatureCollectionMetadata|undefined}
   *     FeatureCollection metadata.
   */
  readFeatureCollectionMetadataFromDocument(t) {
    for (let e = (
      /** @type {Node} */
      t.firstChild
    ); e; e = e.nextSibling)
      if (e.nodeType == Node.ELEMENT_NODE)
        return this.readFeatureCollectionMetadataFromNode(
          /** @type {Element} */
          e
        );
  }
  /**
   * @param {Element} node Node.
   * @return {FeatureCollectionMetadata|undefined}
   *     FeatureCollection metadata.
   */
  readFeatureCollectionMetadataFromNode(t) {
    const e = {}, i = Ni(
      t.getAttribute("numberOfFeatures")
    );
    return e.numberOfFeatures = i, it(
      /** @type {FeatureCollectionMetadata} */
      e,
      il,
      t,
      [],
      this.gmlFormat_
    );
  }
  /**
   * @param {Document} doc Document.
   * @return {TransactionResponse|undefined} Transaction response.
   */
  readTransactionResponseFromDocument(t) {
    for (let e = (
      /** @type {Node} */
      t.firstChild
    ); e; e = e.nextSibling)
      if (e.nodeType == Node.ELEMENT_NODE)
        return this.readTransactionResponseFromNode(
          /** @type {Element} */
          e
        );
  }
  /**
   * @param {Element} node Node.
   * @return {TransactionResponse|undefined} Transaction response.
   */
  readTransactionResponseFromNode(t) {
    return it(
      /** @type {TransactionResponse} */
      {},
      nm,
      t,
      []
    );
  }
  /**
   * Encode format as WFS `GetFeature` and return the Node.
   *
   * @param {WriteGetFeatureOptions} options Options.
   * @return {Node} Result.
   * @api
   */
  writeGetFeature(t) {
    const e = D($s[this.version_], "GetFeature");
    e.setAttribute("service", "WFS"), e.setAttribute("version", this.version_), t.handle && e.setAttribute("handle", t.handle), t.outputFormat && e.setAttribute("outputFormat", t.outputFormat), t.maxFeatures !== void 0 && e.setAttribute("maxFeatures", String(t.maxFeatures)), t.resultType && e.setAttribute("resultType", t.resultType), t.startIndex !== void 0 && e.setAttribute("startIndex", String(t.startIndex)), t.count !== void 0 && e.setAttribute("count", String(t.count)), t.viewParams !== void 0 && e.setAttribute("viewParams", t.viewParams), e.setAttributeNS(
      js,
      "xsi:schemaLocation",
      this.schemaLocation_
    );
    const i = {
      node: e
    };
    if (Object.assign(i, {
      version: this.version_,
      srsName: t.srsName,
      featureNS: t.featureNS ? t.featureNS : this.featureNS_,
      featurePrefix: t.featurePrefix,
      propertyNames: t.propertyNames ? t.propertyNames : []
    }), at(
      Array.isArray(t.featureTypes),
      "`options.featureTypes` must be an Array"
    ), typeof t.featureTypes[0] == "string") {
      let n = t.filter;
      t.bbox && (at(
        t.geometryName,
        "`options.geometryName` must also be provided when `options.bbox` is set"
      ), n = this.combineBboxAndFilter(
        t.geometryName,
        t.bbox,
        t.srsName,
        n
      )), Object.assign(i, {
        geometryName: t.geometryName,
        filter: n
      }), Sl(
        e,
        /** @type {!Array<string>} */
        t.featureTypes,
        [i]
      );
    } else
      t.featureTypes.forEach((n) => {
        const s = this.combineBboxAndFilter(
          n.geometryName,
          n.bbox,
          t.srsName,
          t.filter
        );
        Object.assign(i, {
          geometryName: n.geometryName,
          filter: s
        }), Sl(e, [n.name], [i]);
      });
    return e;
  }
  /**
   * Create a bbox filter and combine it with another optional filter.
   *
   * @param {!string} geometryName Geometry name to use.
   * @param {!import("../extent.js").Extent} extent Extent.
   * @param {string} [srsName] SRS name. No srsName attribute will be
   *    set on geometries when this is not provided.
   * @param {import("./filter/Filter.js").default} [filter] Filter condition.
   * @return {import("./filter/Filter.js").default} The filter.
   */
  combineBboxAndFilter(t, e, i, n) {
    const s = em(t, e, i);
    return n ? tm(n, s) : s;
  }
  /**
   * Encode format as WFS `Transaction` and return the Node.
   *
   * @param {Array<import("../Feature.js").default>} inserts The features to insert.
   * @param {Array<import("../Feature.js").default>} updates The features to update.
   * @param {Array<import("../Feature.js").default>} deletes The features to delete.
   * @param {WriteTransactionOptions} options Write options.
   * @return {Node} Result.
   * @api
   */
  writeTransaction(t, e, i, n) {
    const s = [], o = n.version ? n.version : this.version_, a = D($s[o], "Transaction");
    a.setAttribute("service", "WFS"), a.setAttribute("version", o);
    let l;
    n && (l = n.gmlOptions ? n.gmlOptions : {}, n.handle && a.setAttribute("handle", n.handle)), a.setAttributeNS(
      js,
      "xsi:schemaLocation",
      nl[o]
    );
    const c = om(a, l, o, n);
    return t && rr("Insert", t, s, c), e && rr("Update", e, s, c), i && rr("Delete", i, s, c), n.nativeElements && rr(
      "Native",
      n.nativeElements,
      s,
      c
    ), a;
  }
  /**
   * @param {Document} doc Document.
   * @return {import("../proj/Projection.js").default} Projection.
   * @override
   */
  readProjectionFromDocument(t) {
    for (let e = t.firstChild; e; e = e.nextSibling)
      if (e.nodeType == Node.ELEMENT_NODE)
        return this.readProjectionFromNode(
          /** @type {Element} */
          e
        );
    return null;
  }
  /**
   * @param {Element} node Node.
   * @return {import("../proj/Projection.js").default} Projection.
   * @override
   */
  readProjectionFromNode(t) {
    if (t.firstElementChild && t.firstElementChild.firstElementChild) {
      t = t.firstElementChild.firstElementChild;
      for (let e = t.firstElementChild; e; e = e.nextElementSibling)
        if (!(e.childNodes.length === 0 || e.childNodes.length === 1 && e.firstChild.nodeType === 3)) {
          const i = [{}];
          return this.gmlFormat_.readGeometryElement(e, i), rt(i.pop().srsName);
        }
    }
    return null;
  }
}
function om(r, t, e, i) {
  const n = i.featurePrefix ? i.featurePrefix : $h;
  let s;
  return e === "1.0.0" ? s = 2 : e === "1.1.0" ? s = 3 : e === "2.0.0" && (s = 3.2), Object.assign(
    { node: r },
    {
      version: e,
      featureNS: i.featureNS,
      featureType: i.featureType,
      featurePrefix: n,
      gmlVersion: s,
      hasZ: i.hasZ,
      srsName: i.srsName
    },
    t
  );
}
function rr(r, t, e, i) {
  dt(
    i,
    jh,
    Ut(r),
    t,
    e
  );
}
function sl(r, t) {
  return it({}, im, r, t);
}
const am = {
  "http://www.opengis.net/ogc": {
    FeatureId: k(function(r, t) {
      return r.getAttribute("fid");
    })
  },
  "http://www.opengis.net/ogc/1.1": {
    FeatureId: k(function(r, t) {
      return r.getAttribute("fid");
    })
  }
};
function ol(r, t) {
  ai(am, r, t);
}
const lm = {
  "http://www.opengis.net/wfs": {
    Feature: ol
  },
  "http://www.opengis.net/wfs/2.0": {
    Feature: ol
  }
};
function al(r, t) {
  return it([], lm, r, t);
}
function ll(r, t, e) {
  const i = e[e.length - 1], n = i.featureType, s = i.featureNS, o = i.gmlVersion, a = D(s, n);
  r.appendChild(a), o === 2 ? W.prototype.writeFeatureElement(a, t, e) : o === 3 ? x.prototype.writeFeatureElement(a, t, e) : H.prototype.writeFeatureElement(a, t, e);
}
function Kh(r, t, e) {
  const n = e[e.length - 1].version, s = Yo[n], o = D(s, "Filter"), a = D(s, "FeatureId");
  o.appendChild(a), a.setAttribute(
    "fid",
    /** @type {string} */
    t
  ), r.appendChild(o);
}
function zo(r, t) {
  r = r || $h;
  const e = r + ":";
  return t.startsWith(e) ? t : e + t;
}
function hl(r, t, e) {
  const i = e[e.length - 1];
  at(t.getId() !== void 0, "Features must have an id set");
  const n = i.featureType, s = i.featurePrefix, o = i.featureNS, a = zo(s, n);
  r.setAttribute("typeName", a), r.setAttributeNS(Wo, "xmlns:" + s, o);
  const l = t.getId();
  l !== void 0 && Kh(r, l, e);
}
function cl(r, t, e) {
  const i = e[e.length - 1];
  at(t.getId() !== void 0, "Features must have an id set");
  const n = i.version, s = i.featureType, o = i.featurePrefix, a = i.featureNS, l = zo(o, s), c = t.getGeometryName();
  r.setAttribute("typeName", l), r.setAttributeNS(Wo, "xmlns:" + o, a);
  const h = t.getId();
  if (h !== void 0) {
    const u = t.getKeys(), d = [];
    for (let f = 0, g = u.length; f < g; f++) {
      const m = t.get(u[f]);
      if (m !== void 0) {
        let _ = u[f];
        m && typeof /** @type {?} */
        m.getSimplifiedGeometry == "function" && (_ = c), d.push({ name: _, value: m });
      }
    }
    dt(
      /** @type {import("../xml.js").NodeStackItem} */
      {
        version: n,
        gmlVersion: i.gmlVersion,
        node: r,
        hasZ: i.hasZ,
        srsName: i.srsName
      },
      jh,
      Ut("Property"),
      d,
      e
    ), Kh(r, h, e);
  }
}
function ul(r, t, e) {
  const i = e[e.length - 1], n = i.version, s = $s[n], a = D(s, n === "2.0.0" ? "ValueReference" : "Name"), l = i.gmlVersion;
  if (r.appendChild(a), mt(a, t.name), t.value !== void 0 && t.value !== null) {
    const c = D(s, "Value");
    r.appendChild(c), t.value && typeof /** @type {?} */
    t.value.getSimplifiedGeometry == "function" ? l === 2 ? W.prototype.writeGeometryElement(c, t.value, e) : l === 3 ? x.prototype.writeGeometryElement(c, t.value, e) : H.prototype.writeGeometryElement(c, t.value, e) : mt(c, t.value);
  }
}
function dl(r, t, e) {
  t.vendorId && r.setAttribute("vendorId", t.vendorId), t.safeToIgnore !== void 0 && r.setAttribute("safeToIgnore", String(t.safeToIgnore)), t.value !== void 0 && mt(r, t.value);
}
const Kr = {
  "http://www.opengis.net/wfs": {
    Query: E(fl)
  },
  "http://www.opengis.net/wfs/2.0": {
    Query: E(fl)
  },
  "http://www.opengis.net/ogc": {
    During: E(_l),
    And: E(sr),
    Or: E(sr),
    Not: E(pl),
    BBOX: E(gl),
    Contains: E(Ye),
    Intersects: E(Ye),
    Within: E(Ye),
    DWithin: E(ml),
    PropertyIsEqualTo: E(Xt),
    PropertyIsNotEqualTo: E(Xt),
    PropertyIsLessThan: E(Xt),
    PropertyIsLessThanOrEqualTo: E(Xt),
    PropertyIsGreaterThan: E(Xt),
    PropertyIsGreaterThanOrEqualTo: E(Xt),
    PropertyIsNull: E(yl),
    PropertyIsBetween: E(wl),
    PropertyIsLike: E(El)
  },
  "http://www.opengis.net/fes/2.0": {
    During: E(_l),
    And: E(sr),
    Or: E(sr),
    Not: E(pl),
    BBOX: E(gl),
    Contains: E(Ye),
    Disjoint: E(Ye),
    Intersects: E(Ye),
    ResourceId: E(cm),
    Within: E(Ye),
    DWithin: E(ml),
    PropertyIsEqualTo: E(Xt),
    PropertyIsNotEqualTo: E(Xt),
    PropertyIsLessThan: E(Xt),
    PropertyIsLessThanOrEqualTo: E(Xt),
    PropertyIsGreaterThan: E(Xt),
    PropertyIsGreaterThanOrEqualTo: E(Xt),
    PropertyIsNull: E(yl),
    PropertyIsBetween: E(wl),
    PropertyIsLike: E(El)
  }
};
function fl(r, t, e) {
  const i = (
    /** @type {Object} */
    e[e.length - 1]
  ), n = i.version, s = i.featurePrefix, o = i.featureNS, a = i.propertyNames, l = i.srsName;
  let c;
  s ? c = zo(s, t) : c = t;
  let h;
  n === "2.0.0" ? h = "typeNames" : h = "typeName", r.setAttribute(h, c), l && r.setAttribute("srsName", l), o && r.setAttributeNS(Wo, "xmlns:" + s, o);
  const u = (
    /** @type {import("../xml.js").NodeStackItem} */
    Object.assign({}, i)
  );
  u.node = r, dt(
    u,
    rm,
    Ut("PropertyName"),
    a,
    e
  );
  const d = i.filter;
  if (d) {
    const f = D(Hr(n), "Filter");
    r.appendChild(f), hm(f, d, e);
  }
}
function hm(r, t, e) {
  const i = (
    /** @type {Object} */
    e[e.length - 1]
  ), n = { node: r };
  Object.assign(n, { context: i }), dt(
    n,
    Kr,
    Ut(t.getTagName()),
    [t],
    e
  );
}
function gl(r, t, e) {
  const i = (
    /** @type {Object} */
    e[e.length - 1]
  ), s = i.context.version;
  i.srsName = t.srsName;
  const o = Xo[s];
  Ki(s, r, t.geometryName), o.prototype.writeGeometryElement(r, t.extent, e);
}
function cm(r, t, e) {
  r.setAttribute(
    "rid",
    /** @type {string} */
    t.rid
  );
}
function Ye(r, t, e) {
  const i = (
    /** @type {Object} */
    e[e.length - 1]
  ), s = i.context.version;
  i.srsName = t.srsName;
  const o = Xo[s];
  Ki(s, r, t.geometryName), o.prototype.writeGeometryElement(r, t.geometry, e);
}
function ml(r, t, e) {
  const s = /** @type {Object} */ e[e.length - 1].context.version;
  Ye(r, t, e);
  const o = D(Hr(s), "Distance");
  mt(o, t.distance.toString()), s === "2.0.0" ? o.setAttribute("uom", t.unit) : o.setAttribute("units", t.unit), r.appendChild(o);
}
function _l(r, t, e) {
  const s = /** @type {Object} */ e[e.length - 1].context.version;
  vr(Bo[s], "ValueReference", r, t.propertyName);
  const o = D(Te, "TimePeriod");
  r.appendChild(o);
  const a = D(Te, "begin");
  o.appendChild(a), Cl(a, t.begin);
  const l = D(Te, "end");
  o.appendChild(l), Cl(l, t.end);
}
function sr(r, t, e) {
  const n = /** @type {Object} */ e[e.length - 1].context, s = { node: r };
  Object.assign(s, { context: n });
  const o = t.conditions;
  for (let a = 0, l = o.length; a < l; ++a) {
    const c = o[a];
    dt(
      s,
      Kr,
      Ut(c.getTagName()),
      [c],
      e
    );
  }
}
function pl(r, t, e) {
  const n = /** @type {Object} */ e[e.length - 1].context, s = { node: r };
  Object.assign(s, { context: n });
  const o = t.condition;
  dt(
    s,
    Kr,
    Ut(o.getTagName()),
    [o],
    e
  );
}
function Xt(r, t, e) {
  const s = /** @type {Object} */ e[e.length - 1].context.version;
  t.matchCase !== void 0 && r.setAttribute("matchCase", t.matchCase.toString()), Ki(s, r, t.propertyName), Ar(s, r, "" + t.expression);
}
function yl(r, t, e) {
  const s = /** @type {Object} */ e[e.length - 1].context.version;
  Ki(s, r, t.propertyName);
}
function wl(r, t, e) {
  const s = /** @type {Object} */ e[e.length - 1].context.version, o = Hr(s);
  Ki(s, r, t.propertyName);
  const a = D(o, "LowerBoundary");
  r.appendChild(a), Ar(s, a, "" + t.lowerBoundary);
  const l = D(o, "UpperBoundary");
  r.appendChild(l), Ar(s, l, "" + t.upperBoundary);
}
function El(r, t, e) {
  const s = /** @type {Object} */ e[e.length - 1].context.version;
  r.setAttribute("wildCard", t.wildCard), r.setAttribute("singleChar", t.singleChar), r.setAttribute("escapeChar", t.escapeChar), t.matchCase !== void 0 && r.setAttribute("matchCase", t.matchCase.toString()), Ki(s, r, t.propertyName), Ar(s, r, "" + t.pattern);
}
function vr(r, t, e, i) {
  const n = D(r, t);
  mt(n, i), e.appendChild(n);
}
function Ar(r, t, e) {
  vr(Hr(r), "Literal", t, e);
}
function Ki(r, t, e) {
  r === "2.0.0" ? vr(Bo[r], "ValueReference", t, e) : vr(Yo[r], "PropertyName", t, e);
}
function Cl(r, t) {
  const e = D(Te, "TimeInstant");
  r.appendChild(e);
  const i = D(Te, "timePosition");
  e.appendChild(i), mt(i, t);
}
function Sl(r, t, e) {
  const i = (
    /** @type {Object} */
    e[e.length - 1]
  ), n = (
    /** @type {import("../xml.js").NodeStackItem} */
    Object.assign({}, i)
  );
  n.node = r, dt(
    n,
    Kr,
    Ut("Query"),
    t,
    e
  );
}
function Hr(r) {
  let t;
  return r === "2.0.0" ? t = Bo[r] : t = Yo[r], t;
}
const um = new Do(), xl = /* @__PURE__ */ new Set([
  "service",
  "request",
  "version",
  "typenames",
  "typename",
  "srsname",
  "bbox",
  "count",
  "maxfeatures"
]), or = /* @__PURE__ */ new Set(["cql_filter", "filter"]);
class Lr extends Wn {
  constructor(t, e) {
    const i = Lr._computeWFSSourceOptions(t, e);
    super(i), this.localProperties = {}, this.requestProperties = {}, this._tileLoading = 0, this._done = !1, this.localProperties = i.computedLocalProperties, this._initWFSSource(t);
  }
  /**
   * Compute VectorSource options from WFS options
   */
  static _computeWFSSourceOptions(t, e) {
    const i = t || {}, n = {
      tiled: !1,
      layerExtraParams: []
    };
    let s = i.strategy;
    if (!s && i.tileZoom) {
      const o = i.tileZoom ?? i.minZoom ?? er.MIN_ZOOM_INCREASE, a = bh({
        tileSize: i.tileSize || er.TILE_SIZE,
        minZoom: o,
        maxZoom: o
      });
      s = Ah(a), n.tileGrid = a, n.table = i.table, n.tiled = !0, n.maxReload = i.maxReload;
    } else s || (s = vh);
    return e && e.loadCache && (n.loadCache = e.loadCache), e && e.saveCache && (n.saveCache = e.saveCache), e && e.loadFeatures && e.saveFeatures && (n.featureCache = e), n.useCacheWhenOnline = i.useCacheWhenOnline !== !1, {
      computedLocalProperties: n,
      strategy: s,
      features: new We(),
      attributions: i.attribution,
      useSpatialIndex: !0,
      wrapX: i.wrapX
    };
  }
  /**
   * Completes WFS-specific initialization after VectorSource setup
   */
  _initWFSSource(t) {
    var a;
    const e = t || {}, i = e.geoservice || {};
    this.localProperties.proxy = e.proxy, this.localProperties.featureFilter = e.filter;
    const n = this._parseLayerSpec(i.layers || ""), s = this._resolveInitialTypeNames(i, n.typeNames);
    this.localProperties.layerExtraParams = n.extraParams;
    const o = i.url || "";
    this.set("url", o), this.set("cache", `${um.getEscapedDomainFromURL(o)}/${i.layers || ""}`), this.set("once", e.once), this.set("typename", s || i.layers || ""), this.set("version", i.version || "2.0.0"), this.set("projection", e.srs || er.SRS_NAME), this.set("id", ((a = i.input_mask) == null ? void 0 : a.id) ?? -1), this.set("maxFeatures", e.maxFeatures), this.set("format", i.format || "GeoJSON"), this.setAuthentication(e.username, e.password, e.accessToken, e.tokenType), this._configureLoader();
  }
  _configureLoader() {
    this.setLoader((t, e, i, n, s) => {
      this._loaderFn(t, e, i, n, s);
    });
  }
  async _loaderFn(t, e, i, n, s) {
    if (this._done && this.get("once")) {
      n && n([]);
      return;
    }
    this._done = !0;
    const o = this._projectionToCode(i), a = String(this.get("projection") || er.SRS_NAME), l = go(t, o, a), c = this.localProperties.tileGrid ? this.localProperties.tileGrid.getTileCoordForCoordAndResolution(t, e) : null;
    this.dispatchEvent({ type: "loadstart", remains: ++this._tileLoading });
    try {
      let h, u = !1;
      this.localProperties.useCacheWhenOnline !== !1 && (h = await this._loadFromCache(l, e, c)), h === void 0 && (h = await this._loadFromService(l, a), u = !0, this.localProperties.saveCache && await Promise.resolve(this.localProperties.saveCache(h, l, e, c)));
      const f = this._readWFSResponse(h, a, o);
      u && await this._saveFeaturesToFeatureCache(l, e, c, f), f.length && this.addFeatures(f), this.dispatchEvent({ type: "loadend", remains: --this._tileLoading }), n && n(f);
    } catch (h) {
      const u = (h == null ? void 0 : h.name) === "AbortError" ? "abort" : "error";
      this._handleWFSLoadError(u, h), s && s();
    }
  }
  async _loadFromCache(t, e, i) {
    const n = {
      tileCoord: i,
      extent: t,
      resolution: e
    };
    if (this.localProperties.loadCache)
      try {
        const a = await this.localProperties.loadCache(n);
        if (a !== void 0)
          return a;
      } catch (a) {
        if (a === "obsolete")
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
    const s = this.localProperties.featureCache;
    if (!s)
      return;
    const o = this._buildFeatureCacheKey(t, e, i);
    try {
      const a = await s.loadFeatures(o);
      if (Array.isArray(a) && a.length > 0)
        return a;
    } catch {
    }
  }
  async _saveFeaturesToFeatureCache(t, e, i, n) {
    const s = this.localProperties.featureCache;
    if (!s || n.length === 0)
      return;
    const o = this._buildFeatureCacheKey(t, e, i);
    try {
      await s.saveFeatures(o, n);
    } catch {
    }
  }
  async _loadFromService(t, e) {
    const i = this._buildCurrentGeoservice(), n = this.localProperties.layerExtraParams || [], s = this._isGeoJSONFormat(), o = this._hasFilterParams(i, n, this.localProperties.featureFilter);
    let a = String(this.get("typename") || ""), l = await this._tryLoadWithTypeNames(
      a,
      i,
      n,
      t,
      e,
      s,
      o
    );
    if (!l.payload && l.error) {
      const c = this._extractUnknownFeatureTypeName(l.error.message);
      if (c) {
        const h = await this._resolveUnknownTypeNames(i, c);
        h && h !== a && (console.warn(
          `[WFSSource] Resolved unknown feature type "${c}" to "${h}".`
        ), a = h, l = await this._tryLoadWithTypeNames(
          a,
          i,
          n,
          t,
          e,
          s,
          o
        ));
      }
    }
    if (!l.payload)
      throw l.error || new Error("WFS request failed");
    return l.payload;
  }
  async _tryLoadWithTypeNames(t, e, i, n, s, o, a) {
    const l = this._getWfsRequestVariants(o, a), c = /* @__PURE__ */ new Set();
    let h;
    for (const u of l) {
      const f = this._buildWfsGetFeatureUrl(
        e,
        t,
        i,
        s,
        n,
        u
      ).toString();
      if (!c.has(f)) {
        c.add(f);
        try {
          return { payload: await this._fetchWfsPayload(f) };
        } catch (g) {
          h = g instanceof Error ? g : new Error(String(g));
        }
      }
    }
    return {
      error: h || new Error("WFS request failed")
    };
  }
  async _fetchWfsPayload(t) {
    const e = new AbortController(), i = setTimeout(() => e.abort(), 3 * 60 * 1e3);
    try {
      const n = await fetch(t, {
        method: "GET",
        headers: this._getAuthHeaders(),
        cache: "no-cache",
        signal: e.signal
      }), s = await n.text(), o = this._getWfsExceptionMessage(s);
      if (!n.ok)
        throw new Error(`WFS ${n.status}: ${o || n.statusText}`);
      if (o)
        throw new Error(`WFS Exception: ${o}`);
      return s;
    } finally {
      clearTimeout(i);
    }
  }
  _getAuthHeaders() {
    const t = {
      "cache-control": "no-cache"
    }, { authorization: e, username: i, password: n } = this.requestProperties;
    return e ? t.Authorization = String(e) : i && n && (t.Authorization = `Basic ${btoa(`${i}:${n}`)}`), t;
  }
  /**
   * Read WFS response and return features to add
   */
  _readWFSResponse(t, e, i) {
    if (this._isFeatureArray(t))
      return t;
    const n = this._parseFeaturesFromPayload(t, e, i);
    if (!n.length)
      return [];
    const s = [], o = typeof this.get("id") == "string" && this.get("id") ? String(this.get("id")) : void 0, a = this.getFeatures(), l = /* @__PURE__ */ new Set();
    if (o)
      for (const h of a) {
        const u = h.get(o);
        u != null && l.add(String(u));
      }
    const c = /* @__PURE__ */ new Set();
    for (const h of a) {
      const u = h.getId();
      u != null && c.add(String(u));
    }
    for (const h of n) {
      const u = h.getGeometry();
      if (!u)
        continue;
      const d = u.getExtent();
      if (!Number.isFinite(d[0]) || !Number.isFinite(d[1]) || !Number.isFinite(d[2]) || !Number.isFinite(d[3]))
        continue;
      if (o) {
        const g = h.get(o);
        if (g != null) {
          const m = String(g);
          if (l.has(m))
            continue;
          l.add(m);
        }
      }
      const f = h.getId();
      if (f != null) {
        const g = String(f);
        if (c.has(g))
          continue;
        c.add(g);
      }
      s.push(h);
    }
    return s;
  }
  _parseFeaturesFromPayload(t, e, i) {
    var c, h, u;
    const n = this._isGeoJSONFormat();
    if (t == null)
      return [];
    if (typeof t == "object" && t !== null && !(t instanceof Document) && (n || this._looksLikeGeoJSONPayload(t)))
      return new An().readFeatures(t, {
        dataProjection: e,
        featureProjection: i
      });
    const o = (typeof t == "string" ? t : String(t)).trim();
    if (!o)
      return [];
    const a = this._getWfsExceptionMessage(o);
    if (a)
      throw new Error(`WFS Exception: ${a}`);
    if (this._isLikelyJsonPayload(o))
      try {
        const d = JSON.parse(o);
        return new An().readFeatures(d, {
          dataProjection: e,
          featureProjection: i
        });
      } catch {
      }
    let l = new rl({ gmlFormat: new x() }).readFeatures(o, {
      dataProjection: e,
      featureProjection: i
    });
    return l.length && (!((c = l[0]) != null && c.getGeometry()) || !((u = (h = l[0]) == null ? void 0 : h.getGeometry()) != null && u.getExtent())) && (l = new rl({ gmlFormat: new W() }).readFeatures(o, {
      dataProjection: e,
      featureProjection: i
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
  _isFeatureArray(t) {
    return Array.isArray(t) && t.every((e) => e instanceof yn);
  }
  _buildFeatureCacheKey(t, e, i) {
    const s = String(this.get("cache") || this.get("typename") || "wfs").replace(/[^a-zA-Z0-9._-]+/g, "_");
    if (i && i.length > 0)
      return `wfs:${s}:tile:${i.join("-")}`;
    const o = t.map((l) => this._normalizeCacheNumber(l)).join("_"), a = this._normalizeCacheNumber(e);
    return `wfs:${s}:bbox:${o}:res:${a}`;
  }
  _normalizeCacheNumber(t) {
    return Number.isFinite(t) ? t.toFixed(2) : "0";
  }
  _buildWfsGetFeatureUrl(t, e, i, n, s, o) {
    const a = new URL(t.url), l = new URL(`${a.origin}${a.pathname}`), c = /* @__PURE__ */ new Map(), h = (d, f) => {
      const g = d.toLowerCase();
      if (xl.has(g) || g === "outputformat" || !o.includeFilters && or.has(g)) return;
      const m = c.get(g);
      m ? m.values.push(f) : c.set(g, { key: d, values: [f] });
    };
    a.searchParams.forEach((d, f) => {
      h(f, d);
    });
    for (const [d, f] of i)
      h(d, f);
    if (o.includeFilters) {
      const d = this._serializeFeatureFilter();
      d && !c.has(d.key.toLowerCase()) && c.set(d.key.toLowerCase(), {
        key: d.key,
        values: [d.value]
      });
    }
    for (const { key: d, values: f } of c.values())
      for (const g of f)
        l.searchParams.append(d, g);
    l.searchParams.set("service", "WFS"), l.searchParams.set("version", t.version || "2.0.0"), l.searchParams.set("request", "GetFeature"), l.searchParams.set("typeNames", e), l.searchParams.set("srsName", n), o.includeBbox && l.searchParams.set("bbox", `${s.join(",")},${n}`);
    const u = Number(this.get("maxFeatures"));
    return Number.isFinite(u) && u > 0 && (l.searchParams.set("count", String(u)), l.searchParams.set("maxFeatures", String(u))), this._isGeoJSONFormat() && o.includeOutputFormat && l.searchParams.set("outputFormat", "application/json"), l;
  }
  _serializeFeatureFilter() {
    const t = this.localProperties.featureFilter;
    if (typeof t == "string") {
      const i = t.trim();
      return i ? { key: "cql_filter", value: i } : void 0;
    }
    if (!t || typeof t != "object")
      return;
    const e = [];
    for (const [i, n] of Object.entries(t))
      n !== void 0 && (n === null ? e.push(`${i} IS NULL`) : e.push(`${i}=${this._toCqlLiteral(n)}`));
    if (e.length)
      return {
        key: "cql_filter",
        value: e.join(" AND ")
      };
  }
  _toCqlLiteral(t) {
    return typeof t == "number" && Number.isFinite(t) ? String(t) : typeof t == "boolean" ? t ? "TRUE" : "FALSE" : `'${String(t).replace(/'/g, "''")}'`;
  }
  _getWfsRequestVariants(t, e) {
    const i = [];
    return e ? (i.push({
      name: "filter-no-bbox",
      includeOutputFormat: t,
      includeFilters: !0,
      includeBbox: !1
    }), t && i.push({
      name: "filter-no-bbox-no-output-format",
      includeOutputFormat: !1,
      includeFilters: !0,
      includeBbox: !1
    }), i.push({
      name: "no-filter-with-bbox",
      includeOutputFormat: t,
      includeFilters: !1,
      includeBbox: !0
    }), t && i.push({
      name: "no-filter-with-bbox-no-output-format",
      includeOutputFormat: !1,
      includeFilters: !1,
      includeBbox: !0
    }), i.push({
      name: "no-filter-no-bbox",
      includeOutputFormat: t,
      includeFilters: !1,
      includeBbox: !1
    }), t && i.push({
      name: "no-output-format-no-filter",
      includeOutputFormat: !1,
      includeFilters: !1,
      includeBbox: !1
    })) : (i.push({
      name: "default",
      includeOutputFormat: t,
      includeFilters: !0,
      includeBbox: !0
    }), t && i.push({
      name: "no-output-format",
      includeOutputFormat: !1,
      includeFilters: !0,
      includeBbox: !0
    })), i;
  }
  _hasFilterParams(t, e, i) {
    let n = !1;
    new URL(t.url).searchParams.forEach((o, a) => {
      or.has(String(a).toLowerCase()) && (n = !0);
    });
    const s = e.some(
      ([o]) => or.has(o.toLowerCase())
    );
    return n || s ? !0 : typeof i == "string" ? i.trim().length > 0 : i && typeof i == "object" ? Object.keys(i).length > 0 : !1;
  }
  _projectionToCode(t) {
    return typeof t == "string" ? t : t && typeof t.getCode == "function" ? t.getCode() : Zs;
  }
  _isGeoJSONFormat() {
    return String(this.get("format") || "").toLowerCase().includes("json");
  }
  _isLikelyJsonPayload(t) {
    const e = t.trim();
    return e.startsWith("{") || e.startsWith("[");
  }
  _looksLikeGeoJSONPayload(t) {
    if (!t || typeof t != "object")
      return !1;
    const e = t;
    return e.type === "FeatureCollection" || e.type === "Feature" || Array.isArray(e.features);
  }
  _getWfsExceptionMessage(t) {
    var i;
    const e = t.trim();
    if (e.startsWith("<"))
      try {
        const n = new DOMParser().parseFromString(e, "application/xml");
        if (n.querySelector("parsererror"))
          return;
        const s = n.getElementsByTagNameNS("*", "ExceptionText")[0] || n.getElementsByTagNameNS("*", "ServiceException")[0] || n.getElementsByTagNameNS("*", "Exception")[0];
        return ((i = s == null ? void 0 : s.textContent) == null ? void 0 : i.trim()) || void 0;
      } catch {
        return;
      }
  }
  _parseLayerSpec(t) {
    const e = t.trim();
    if (!e)
      return { typeNames: "", extraParams: [] };
    let i = e, n = "";
    if (i.includes("?")) {
      const [o, ...a] = i.split("?");
      i = o, n = a.join("?");
    }
    if (i.includes("&")) {
      const [o, ...a] = i.split("&");
      i = o, n = [n, a.join("&")].filter(Boolean).join("&");
    }
    const s = [];
    return new URLSearchParams(n).forEach((o, a) => {
      s.push([a, o]);
    }), {
      typeNames: i.trim(),
      extraParams: s
    };
  }
  _resolveInitialTypeNames(t, e) {
    var n;
    const i = (n = this._getTypeNamesFromGeoserviceUrl(t)) == null ? void 0 : n.trim();
    return e ? !e.includes(":") && (i != null && i.includes(":")) ? i : e : i || t.layers || "";
  }
  _getTypeNamesFromGeoserviceUrl(t) {
    const e = new URL(t.url);
    return this._getQueryParamCaseInsensitive(e.searchParams, "typeNames") || this._getQueryParamCaseInsensitive(e.searchParams, "typeName") || void 0;
  }
  _getQueryParamCaseInsensitive(t, e) {
    const i = e.toLowerCase();
    let n = null;
    return t.forEach((s, o) => {
      n === null && String(o).toLowerCase() === i && (n = s);
    }), n;
  }
  _extractUnknownFeatureTypeName(t) {
    const e = t.match(/Feature type\s*:?\s*([^\s]+)\s+unknown/i);
    return e == null ? void 0 : e[1];
  }
  async _resolveUnknownTypeNames(t, e) {
    try {
      const i = this._buildWfsGetCapabilitiesUrl(t), n = await fetch(i.toString(), {
        headers: this._getAuthHeaders()
      });
      if (!n.ok)
        return;
      const s = await n.text(), o = this._parseWfsFeatureTypeNamesFromCapabilities(s);
      return this._selectFallbackTypeNames(e, o);
    } catch {
      return;
    }
  }
  _buildWfsGetCapabilitiesUrl(t) {
    const e = new URL(t.url), i = new URL(`${e.origin}${e.pathname}`);
    return e.searchParams.forEach((n, s) => {
      const o = String(s).toLowerCase();
      xl.has(o) || or.has(o) || o !== "outputformat" && i.searchParams.append(s, n);
    }), i.searchParams.set("service", "WFS"), i.searchParams.set("version", t.version || "2.0.0"), i.searchParams.set("request", "GetCapabilities"), i;
  }
  _parseWfsFeatureTypeNamesFromCapabilities(t) {
    const e = t.trim();
    if (!e.startsWith("<"))
      return [];
    const i = new DOMParser().parseFromString(e, "application/xml");
    if (i.querySelector("parsererror"))
      return [];
    const s = Array.from(i.getElementsByTagNameNS("*", "FeatureType")).map((o) => {
      var a, l;
      return ((l = (a = o.getElementsByTagNameNS("*", "Name")[0]) == null ? void 0 : a.textContent) == null ? void 0 : l.trim()) || "";
    }).filter((o) => o.length > 0);
    return Array.from(new Set(s));
  }
  _selectFallbackTypeNames(t, e) {
    if (t.includes(","))
      return;
    const i = e.find((o) => o === t);
    if (i)
      return i;
    if (t.includes(":")) {
      const o = t.split(":").pop();
      return o ? e.find((l) => l.endsWith(`:${o}`)) : void 0;
    }
    const n = e.filter(
      (o) => o.startsWith(`${t}:`) || o.endsWith(`:${t}`)
    );
    return n.length === 0 ? void 0 : n.length === 1 ? n[0] : n.find((o) => o.toLowerCase().endsWith(":epci")) || n[0];
  }
  setAuthentication(t, e, i, n = "Bearer") {
    const s = i == null ? void 0 : i.trim();
    if (s) {
      const o = (n == null ? void 0 : n.trim()) || "Bearer";
      this.requestProperties.authorization = `${o} ${s}`, delete this.requestProperties.username, delete this.requestProperties.password;
      return;
    }
    if (delete this.requestProperties.authorization, !t || !e) {
      delete this.requestProperties.username, delete this.requestProperties.password;
      return;
    }
    this.requestProperties.username = t, this.requestProperties.password = e;
  }
  getCachePath() {
    return String(this.get("cache") || "");
  }
  /**
   * Load features from cache (or service as fallback)
   */
  async loadFromCache(t, e, i) {
    await this._loaderFn(t, e, i);
  }
  /**
   * Handle WFS load error
   */
  _handleWFSLoadError(t, e) {
    const i = Math.max(0, --this._tileLoading);
    t !== "abort" ? this.dispatchEvent({ type: "loadend", error: e, status: t, remains: i }) : this.dispatchEvent({ type: "loadend", remains: i });
  }
  /**
   * Get the file cache name
   */
  getFileCacheName() {
    return this.get("once") ? `${this.get("cache")}.cache` : "";
  }
}
class Bm {
  constructor(t) {
    this._cluster = [], this._apiClient = t.client, this._eventManager = new On(), this._cluster = [], this._cache = t.cache, this._communityId = t.communityId, this._loadClosed = t.loadClosed ?? !1;
  }
  /**
   *
   * @param feature - The feature to get the status style for
   * @returns The status style for the feature
   */
  getStatusStyle(t) {
    var e;
    if (t.get("status"))
      return Ei[t.get("status")] || new X({});
    if (t.get("features")) {
      const i = t.get("features").length;
      return i < 2 ? this.getStatusStyle(t.get("features")[0]) : (!this._cluster[i] && Ei[qe.Cluster] && (this._cluster[i] = Ei[qe.Cluster].clone(), (e = Ei[qe.Cluster].getImage()) == null || e.setRadius(Math.min(10, i / 2) + Fi), this._cluster[i] = Ei[qe.Cluster].clone()), this._cluster[i]);
    } else
      return Ei[qe.Pending] || new X({});
  }
  /**
   * Gets the cache key for reports based on community ID
   * @returns Cache key string
   */
  getCacheKey() {
    return `reports:${this._communityId || "default"}`;
  }
  /**
   * Saves reports to cache
   * @param reports - Reports to cache
   */
  async saveToCache(t) {
    if (this._cache)
      try {
        const e = t.map((n) => {
          const s = new yn();
          return s.setProperties(n), s;
        }), i = this.getCacheKey();
        await this._cache.saveFeatures(i, e);
      } catch (e) {
        console.error("Failed to save reports to cache:", e);
      }
  }
  /**
   * Loads reports from cache
   * @returns Cached reports or empty array
   */
  async loadFromCache() {
    if (!this._cache) return [];
    try {
      const t = this.getCacheKey();
      return (await this._cache.loadFeatures(t)).map((i) => i.getProperties());
    } catch (t) {
      return console.error("Failed to load reports from cache:", t), [];
    }
  }
  /**
   * Load features from a WKT string
   *
   * @param features - The features to load
   * @param projection - The projection to use
   * @returns The loaded features
   */
  async loadFeatures(t, e) {
    if (t.length === 0)
      return [];
    const i = [];
    let n = new Fr();
    return t.forEach((s) => {
      const o = n.readFeature(s.get("geometry"), {
        dataProjection: "EPSG:4326",
        featureProjection: e
      });
      o.setProperties({ report: s }), i.push(o);
    }), i.length === 100 && this._eventManager.emit("overload"), i;
  }
  /**
   * Load reports from the server
   *
   * @param extent - The extent to load reports for
   * @param page - The page number to load
   * @param loadClosedReports - Whether to load closed reports (defaults to instance setting)
   * @returns The reports
   */
  async loadReports(t, e = 1, i) {
    var n;
    try {
      const s = await this._apiClient.getUser(), o = s == null ? void 0 : s.data, l = (n = (Array.isArray(o == null ? void 0 : o.communities) ? o.communities : []).find((_) => _.active === !0)) == null ? void 0 : n.id, c = i ?? this._loadClosed;
      !this._communityId && l && (this._communityId = l);
      const h = this._communityId ?? l, u = {
        box: t.join(","),
        limit: 100,
        page: e
      };
      typeof h == "number" && (u.communities = [h]);
      let d = Object.values(qe);
      if (!c) {
        const _ = Object.values(Ul);
        d = d.filter((p) => !_.includes(p));
      }
      const f = await this._apiClient.getReports(u);
      let g = f.headers["content-range"].split("/"), m = g[0].split("-");
      if (f.status == 200 || f.status == 206 && m[1] === g[1]) {
        const _ = f.data;
        return await this.saveToCache(_), _;
      } else if (f.status == 206) {
        e = e + 1;
        const p = (await this.loadReports(t, e, c)).concat(f.data);
        return await this.saveToCache(p), p;
      } else
        return console.warn("Failed to load reports from server, loading from cache"), await this.loadFromCache();
    } catch (s) {
      return console.error("Error loading reports:", s), await this.loadFromCache();
    }
  }
  async getReport(t) {
    throw new Error("Not implemented");
  }
}
const dm = {
  COLLAB_VECTOR_RENDER_MODE: "image"
}, zt = {
  FILL_COLOR: "rgba(255,255,255,0.4)",
  STROKE_COLOR: "#3399CC",
  STROKE_WIDTH: 1.25,
  CIRCLE_RADIUS: 5,
  LABEL_COLOR: "#000",
  LABEL_STROKE_COLOR: "#fff",
  LABEL_SIZE: 10,
  LABEL_STROKE_WIDTH: 4
};
var Wi = class extends $ {
  constructor(t) {
    super(), t = t || {};
    var e, i = this.canvas_ = document.createElement("canvas"), n = Number(t.scale) > 0 ? Number(t.scale) : 1, s = n * aa || aa, o = i.getContext("2d");
    if (t.image) {
      t.image.load();
      var a, l = t.image.getImage();
      if (l.width)
        i.width = Math.round(l.width * s), i.height = Math.round(l.height * s), o.globalAlpha = typeof t.opacity == "number" ? t.opacity : 1, o.drawImage(l, 0, 0, l.width, l.height, 0, 0, i.width, i.height), e = o.createPattern(i, "repeat");
      else {
        var c = this;
        e = [0, 0, 0, 0], l.onload = function() {
          i.width = Math.round(l.width * s), i.height = Math.round(l.height * s), o.globalAlpha = typeof t.opacity == "number" ? t.opacity : 1, o.drawImage(l, 0, 0, l.width, l.height, 0, 0, i.width, i.height), e = o.createPattern(i, "repeat"), c.setColor(e);
        };
      }
    } else {
      var h = this.getPattern_(t);
      if (i.width = Math.round(h.width * s), i.height = Math.round(h.height * s), o.beginPath(), t.fill && (o.fillStyle = Qt(t.fill.getColor()), o.fillRect(0, 0, i.width, i.height)), o.scale(s, s), o.lineCap = "round", o.lineWidth = h.stroke || 1, o.fillStyle = Qt(t.color || "#000"), o.strokeStyle = Qt(t.color || "#000"), h.circles)
        for (a = 0; a < h.circles.length; a++) {
          var u = h.circles[a];
          o.beginPath(), o.arc(u[0], u[1], u[2], 0, 2 * Math.PI), h.fill && o.fill(), h.stroke && o.stroke();
        }
      if (h.repeat || (h.repeat = [[0, 0]]), h.char && (o.font = h.font || h.width + "px Arial", o.textAlign = "center", o.textBaseline = "middle", h.angle ? (o.fillText(h.char, h.width / 4, h.height / 4), o.fillText(h.char, 5 * h.width / 4, 5 * h.height / 4), o.fillText(h.char, h.width / 4, 5 * h.height / 4), o.fillText(h.char, 5 * h.width / 4, h.height / 4), o.fillText(h.char, 3 * h.width / 4, 3 * h.height / 4), o.fillText(h.char, -h.width / 4, -h.height / 4), o.fillText(h.char, 3 * h.width / 4, -h.height / 4), o.fillText(h.char, -h.width / 4, 3 * h.height / 4)) : o.fillText(h.char, h.width / 2, h.height / 2)), h.lines)
        for (a = 0; a < h.lines.length; a++)
          for (var d = 0; d < h.repeat.length; d++) {
            var f = h.lines[a];
            o.beginPath(), o.moveTo(f[0] + h.repeat[d][0], f[1] + h.repeat[d][1]);
            for (var g = 2; g < f.length; g += 2)
              o.lineTo(f[g] + h.repeat[d][0], f[g + 1] + h.repeat[d][1]);
            h.fill && o.fill(), h.stroke && o.stroke(), o.save(), o.strokeStyle = "red", o.strokeWidth = 0.1, o.restore();
          }
      if (e = o.createPattern(i, "repeat"), t.offset) {
        var m = t.offset;
        if (typeof m == "number" && (m = [m, m]), m instanceof Array) {
          var _ = Math.round(m[0] * s), p = Math.round(m[1] * s);
          o.scale(1 / s, 1 / s), o.clearRect(0, 0, i.width, i.height), o.translate(_, p), o.fillStyle = e, o.fillRect(-_, -p, i.width, i.height), e = o.createPattern(i, "repeat");
        }
      }
    }
    this.setColor(e);
  }
  /** Static fuction to add char patterns
   * @param {title}
   * @param {object} options
   *  @param {integer} [options.size=10] default 10
   *  @param {integer} [options. width=10] default 10
   *  @param {integer} [options.height=10] default 10
   *  @param {Array<circles>} [options.circles]
   *  @param {Array<pointlist>} [options.lines]
   *  @param {integer} [options.stroke]
   *  @param {bool} [options.fill]
   *  @param {char} [option.char]
   *  @param {string} [font="10px Arial"]
   */
  static addPattern(t, e) {
    e || (e = {}), Wi.patterns[t || e.char] = {
      width: e.width || e.size || 10,
      height: e.height || e.size || 10,
      font: e.font,
      char: e.char,
      circles: e.circles,
      lines: e.lines,
      repeat: e.repeat,
      stroke: e.stroke,
      angle: e.angle,
      fill: e.fill
    };
  }
  /**
   * Clones the style.
   * @return {ol_style_FillPattern}
   */
  clone() {
    var t = super.clone();
    return t.canvas_ = this.canvas_, t;
  }
  /** Get canvas used as pattern
  *	@return {canvas}
  */
  getImage() {
    return this.canvas_;
  }
  /** Get pattern
  *	@param {olx.style.FillPatternOption}
  */
  getPattern_(t) {
    var e = Wi.patterns[t.pattern] || Wi.patterns.dot, i = Math.round(t.spacing) || 10, n;
    switch (t.pattern) {
      case "dot":
      case "circle": {
        n = t.size === 0 ? 0 : t.size / 2 || 2, t.angle ? (i = e.width = e.height = Math.round(i * 1.4), e.circles = [[i / 4, i / 4, n], [3 * i / 4, 3 * i / 4, n]], t.pattern == "circle" && (e.circles = e.circles.concat([
          [i / 4 + i, i / 4, n],
          [i / 4, i / 4 + i, n],
          [3 * i / 4 - i, 3 * i / 4, n],
          [3 * i / 4, 3 * i / 4 - i, n],
          [i / 4 + i, i / 4 + i, n],
          [3 * i / 4 - i, 3 * i / 4 - i, n]
        ]))) : (e.width = e.height = i, e.circles = [[i / 2, i / 2, n]], t.pattern == "circle" && (e.circles = e.circles.concat([
          [i / 2 + i, i / 2, n],
          [i / 2 - i, i / 2, n],
          [i / 2, i / 2 + i, n],
          [i / 2, i / 2 - i, n],
          [i / 2 + i, i / 2 + i, n],
          [i / 2 + i, i / 2 - i, n],
          [i / 2 - i, i / 2 + i, n],
          [i / 2 - i, i / 2 - i, n]
        ])));
        break;
      }
      case "tile":
      case "square": {
        n = t.size === 0 ? 0 : t.size / 2 || 2, t.angle ? (e.width = e.height = i, e.lines = [[i / 2 - n, i / 2, i / 2, i / 2 - n, i / 2 + n, i / 2, i / 2, i / 2 + n, i / 2 - n, i / 2]]) : (e.width = e.height = i, e.lines = [[i / 2 - n, i / 2 - n, i / 2 + n, i / 2 - n, i / 2 + n, i / 2 + n, i / 2 - n, i / 2 + n, i / 2 - n, i / 2 - n]]), t.pattern == "square" && (e.repeat = [[0, 0], [0, i], [i, 0], [0, -i], [-i, 0], [-i, -i], [i, i], [-i, i], [i, -i]]);
        break;
      }
      case "cross":
        t.angle && (t.angle = 45);
      case "hatch": {
        var s = Math.round(((t.angle || 0) - 90) % 360);
        s > 180 && (s -= 360), s *= Math.PI / 180;
        var o = Math.cos(s), a = Math.sin(s);
        if (Math.abs(a) < 1e-4)
          e.width = e.height = i, e.lines = [[0, 0.5, i, 0.5]], e.repeat = [[0, 0], [0, i]];
        else if (Math.abs(o) < 1e-4)
          e.width = e.height = i, e.lines = [[0.5, 0, 0.5, i]], e.repeat = [[0, 0], [i, 0]], t.pattern == "cross" && (e.lines.push([0, 0.5, i, 0.5]), e.repeat.push([0, i]));
        else {
          var l = e.width = Math.round(Math.abs(i / a)) || 1, c = e.height = Math.round(Math.abs(i / o)) || 1;
          t.pattern == "cross" ? (e.lines = [[-l, -c, 2 * l, 2 * c], [2 * l, -c, -l, 2 * c]], e.repeat = [[0, 0]]) : o * a > 0 ? (e.lines = [[-l, -c, 2 * l, 2 * c]], e.repeat = [[0, 0], [l, 0], [0, c]]) : (e.lines = [[2 * l, -c, -l, 2 * c]], e.repeat = [[0, 0], [-l, 0], [0, c]]);
        }
        e.stroke = t.size === 0 ? 0 : t.size || 4;
        break;
      }
    }
    return e;
  }
};
Wi.patterns = {
  hatch: {
    width: 5,
    height: 5,
    lines: [[0, 2.5, 5, 2.5]],
    stroke: 1
  },
  cross: {
    width: 7,
    height: 7,
    lines: [[0, 3, 10, 3], [3, 0, 3, 10]],
    stroke: 1
  },
  dot: {
    width: 8,
    height: 8,
    circles: [[5, 5, 2]],
    stroke: !1,
    fill: !0
  },
  circle: {
    width: 10,
    height: 10,
    circles: [[5, 5, 2]],
    stroke: 1,
    fill: !1
  },
  square: {
    width: 10,
    height: 10,
    lines: [[3, 3, 3, 8, 8, 8, 8, 3, 3, 3]],
    stroke: 1,
    fill: !1
  },
  tile: {
    width: 10,
    height: 10,
    lines: [[3, 3, 3, 8, 8, 8, 8, 3, 3, 3]],
    fill: !0
  },
  woven: {
    width: 12,
    height: 12,
    lines: [[3, 3, 9, 9], [0, 12, 3, 9], [9, 3, 12, 0], [-1, 1, 1, -1], [13, 11, 11, 13]],
    stroke: 1
  },
  crosses: {
    width: 8,
    height: 8,
    lines: [[2, 2, 6, 6], [2, 6, 6, 2]],
    stroke: 1
  },
  caps: {
    width: 8,
    height: 8,
    lines: [[2, 6, 4, 2, 6, 6]],
    stroke: 1
  },
  nylon: {
    width: 20,
    height: 20,
    //		lines: [[ 0,5, 0,0, 5,0 ],[ 5,10, 10,10, 10,5 ], [ 10,15, 10,20, 15,20 ],[ 15,10, 20,10, 20,15 ]],
    //		repeat: [[0,0], [20,0], [0,20], [-20,0], [0,-20], [-20,-20]],
    lines: [[1, 6, 1, 1, 6, 1], [6, 11, 11, 11, 11, 6], [11, 16, 11, 21, 16, 21], [16, 11, 21, 11, 21, 16]],
    repeat: [[0, 0], [-20, 0], [0, -20]],
    stroke: 1
  },
  hexagon: {
    width: 20,
    height: 12,
    lines: [[0, 10, 4, 4, 10, 4, 14, 10, 10, 16, 4, 16, 0, 10]],
    stroke: 1,
    repeat: [[0, 0], [10, 6], [10, -6], [-10, -6]]
  },
  cemetry: {
    width: 15,
    height: 19,
    lines: [
      [0, 3.5, 7, 3.5],
      [3.5, 0, 3.5, 10]
      //[7,12.5,14,12.5],[10.5,9,10.5,19]
    ],
    stroke: 1,
    repeat: [[0, 0], [7, 9]]
  },
  sand: {
    width: 20,
    height: 20,
    circles: [
      [1, 2, 1],
      [9, 3, 1],
      [2, 16, 1],
      [7, 8, 1],
      [6, 14, 1],
      [4, 19, 1],
      [14, 2, 1],
      [12, 10, 1],
      [14, 18, 1],
      [18, 8, 1],
      [18, 14, 1]
    ],
    fill: 1
  },
  conglomerate: {
    width: 60,
    height: 40,
    circles: [[2, 4, 1], [17, 3, 1], [26, 18, 1], [12, 17, 1], [5, 17, 2], [28, 11, 2]],
    lines: [
      [7, 5, 6, 7, 9, 9, 11, 8, 11, 6, 9, 5, 7, 5],
      [16, 10, 15, 13, 16, 14, 19, 15, 21, 13, 22, 9, 20, 8, 19, 8, 16, 10],
      [24, 6, 26, 7, 27, 5, 26, 4, 24, 4, 24, 6]
    ],
    repeat: [[30, 0], [-15, 20], [15, 20], [45, 20]],
    stroke: 1
  },
  conglomerate2: {
    width: 60,
    height: 40,
    circles: [[2, 4, 1], [17, 3, 1], [26, 18, 1], [12, 17, 1], [5, 17, 2], [28, 11, 2]],
    lines: [
      [7, 5, 6, 7, 9, 9, 11, 8, 11, 6, 9, 5, 7, 5],
      [16, 10, 15, 13, 16, 14, 19, 15, 21, 13, 22, 9, 20, 8, 19, 8, 16, 10],
      [24, 6, 26, 7, 27, 5, 26, 4, 24, 4, 24, 6]
    ],
    repeat: [[30, 0], [-15, 20], [15, 20], [45, 20]],
    fill: 1
  },
  gravel: {
    width: 15,
    height: 10,
    circles: [[4, 2, 1], [5, 9, 1], [1, 7, 1]],
    //[9,9,1],,[15,2,1]],
    lines: [[7, 5, 6, 6, 7, 7, 8, 7, 9, 7, 10, 5, 9, 4, 7, 5], [11, 2, 14, 4, 14, 1, 12, 1, 11, 2]],
    stroke: 1
  },
  brick: {
    width: 18,
    height: 16,
    lines: [[0, 1, 18, 1], [0, 10, 18, 10], [6, 1, 6, 10], [12, 10, 12, 18], [12, 0, 12, 1]],
    stroke: 1
  },
  dolomite: {
    width: 20,
    height: 16,
    lines: [[0, 1, 20, 1], [0, 9, 20, 9], [1, 9, 6, 1], [11, 9, 14, 16], [14, 0, 14.4, 1]],
    stroke: 1
  },
  coal: {
    width: 20,
    height: 16,
    lines: [[1, 5, 7, 1, 7, 7], [11, 10, 12, 5, 18, 9], [5, 10, 2, 15, 9, 15], [15, 16, 15, 13, 20, 16], [15, 0, 15, 2, 20, 0]],
    fill: 1
  },
  breccia: {
    width: 20,
    height: 16,
    lines: [[1, 5, 7, 1, 7, 7, 1, 5], [11, 10, 12, 5, 18, 9, 11, 10], [5, 10, 2, 15, 9, 15, 5, 10], [15, 16, 15, 13, 22, 18], [15, 0, 15, 2, 20, 0]],
    stroke: 1
  },
  clay: {
    width: 20,
    height: 20,
    lines: [[0, 0, 3, 11, 0, 20], [11, 0, 10, 3, 13, 13, 11, 20], [0, 0, 10, 3, 20, 0], [0, 12, 3, 11, 13, 13, 20, 12]],
    stroke: 1
  },
  flooded: {
    width: 15,
    height: 10,
    lines: [[0, 1, 10, 1], [0, 6, 5, 6], [10, 6, 15, 6]],
    stroke: 1
  },
  chaos: {
    width: 40,
    height: 40,
    lines: [
      [40, 2, 40, 0, 38, 0, 40, 2],
      [
        4,
        0,
        3,
        2,
        2,
        5,
        0,
        0,
        0,
        3,
        2,
        7,
        5,
        6,
        7,
        7,
        8,
        10,
        9,
        12,
        9,
        13,
        9,
        14,
        8,
        14,
        6,
        15,
        2,
        15,
        0,
        20,
        0,
        22,
        2,
        20,
        5,
        19,
        8,
        15,
        10,
        14,
        11,
        12.25,
        10,
        12,
        10,
        10,
        12,
        9,
        13,
        7,
        12,
        6,
        13,
        4,
        16,
        7,
        17,
        4,
        20,
        0,
        18,
        0,
        15,
        3,
        14,
        2,
        14,
        0,
        12,
        1,
        11,
        0,
        10,
        1,
        11,
        4,
        10,
        7,
        9,
        8,
        8,
        5,
        6,
        4,
        5,
        3,
        5,
        1,
        5,
        0,
        4,
        0
      ],
      [7, 1, 7, 3, 8, 3, 8, 2, 7, 1],
      [4, 3, 5, 5, 4, 5, 4, 3],
      [34, 5, 33, 7, 38, 10, 38, 8, 36, 5, 34, 5],
      [27, 0, 23, 2, 21, 8, 30, 0, 27, 0],
      [
        25,
        8,
        26,
        12,
        26,
        16,
        22.71875,
        15.375,
        20,
        13,
        18,
        15,
        17,
        18,
        13,
        22,
        17,
        21,
        19,
        22,
        21,
        20,
        19,
        18,
        22,
        17,
        30,
        25,
        26,
        26,
        24,
        28,
        21.75,
        33.34375,
        20,
        36,
        18,
        40,
        20,
        40,
        24,
        37,
        25,
        32,
        27,
        31,
        26,
        38,
        27,
        37,
        30,
        32,
        32,
        35,
        36,
        37,
        38,
        40,
        38,
        39,
        40,
        40,
        37,
        36,
        34,
        32,
        37,
        31,
        36,
        29,
        33,
        27,
        34,
        24,
        39,
        21,
        40,
        21,
        40,
        16,
        37,
        20,
        31,
        22,
        32,
        25,
        27,
        20,
        29,
        15,
        30,
        20,
        32,
        20,
        34,
        18,
        33,
        12,
        31,
        11,
        29,
        14,
        26,
        9,
        25,
        8
      ],
      [39, 24, 37, 26, 40, 28, 39, 24],
      [13, 15, 9, 19, 14, 18, 13, 15],
      [18, 23, 14, 27, 16, 27, 17, 25, 20, 26, 18, 23],
      [6, 24, 2, 26, 1, 28, 2, 30, 5, 28, 12, 30, 16, 32, 18, 30, 15, 30, 12, 28, 9, 25, 7, 27, 6, 24],
      [29, 27, 32, 28, 33, 31, 30, 29, 27, 28, 29, 27],
      [5, 35, 1, 33, 3, 36, 13, 38, 15, 35, 10, 36, 5, 35]
    ],
    fill: 1
  },
  grass: {
    width: 27,
    height: 22,
    lines: [[0, 10.5, 13, 10.5], [2.5, 10, 1.5, 7], [4.5, 10, 4.5, 5, 3.5, 4], [7, 10, 7.5, 6, 8.5, 3], [10, 10, 11, 6]],
    repeat: [[0, 0], [14, 10]],
    stroke: 1
  },
  swamp: {
    width: 24,
    height: 23,
    lines: [[0, 10.5, 9.5, 10.5], [2.5, 10, 2.5, 7], [4.5, 10, 4.5, 4], [6.5, 10, 6.5, 6], [3, 12.5, 7, 12.5]],
    repeat: [[0, 0], [14, 10]],
    stroke: 1
  },
  reed: {
    width: 26,
    height: 23,
    lines: [
      [2.5, 10, 2, 7],
      [4.5, 10, 4.2, 4],
      [6.5, 10, 6.8, 4],
      [8.5, 10, 9, 6],
      [3.7, 4, 3.7, 2.5],
      [4.7, 4, 4.7, 2.5],
      [6.3, 4, 6.3, 2.5],
      [7.3, 4, 7.3, 2.5]
    ],
    circles: [[4.2, 2.5, 0.5], [18.2, 12.5, 0.5], [6.8, 2.5, 0.5], [20.8, 12.5, 0.5], [9, 6, 0.5], [23, 16, 0.5]],
    repeat: [[0, 0], [14, 10]],
    stroke: 1
  },
  wave: {
    width: 10,
    height: 8,
    lines: [[0, 0, 5, 4, 10, 0]],
    stroke: 1
  },
  vine: {
    width: 13,
    height: 13,
    lines: [[3, 0, 3, 6], [9, 7, 9, 13]],
    stroke: 1
  },
  forest: {
    width: 55,
    height: 30,
    circles: [[7, 7, 3.5], [20, 20, 1.5], [42, 22, 3.5], [35, 5, 1.5]],
    stroke: 1
  },
  forest2: {
    width: 55,
    height: 30,
    circles: [[7, 7, 3.5], [20, 20, 1.5], [42, 22, 3.5], [35, 5, 1.5]],
    fill: 1,
    stroke: 1
  },
  scrub: {
    width: 26,
    height: 20,
    lines: [[1, 4, 4, 8, 6, 4]],
    circles: [[20, 13, 1.5]],
    stroke: 1
  },
  tree: {
    width: 30,
    height: 30,
    lines: [[7.78, 10.61, 4.95, 10.61, 4.95, 7.78, 3.54, 7.78, 2.12, 6.36, 0.71, 6.36, 0, 4.24, 0.71, 2.12, 4.24, 0, 7.78, 0.71, 9.19, 3.54, 7.78, 4.95, 7.07, 7.07, 4.95, 7.78]],
    repeat: [[3, 1], [18, 16]],
    stroke: 1
  },
  tree2: {
    width: 30,
    height: 30,
    lines: [[7.78, 10.61, 4.95, 10.61, 4.95, 7.78, 3.54, 7.78, 2.12, 6.36, 0.71, 6.36, 0, 4.24, 0.71, 2.12, 4.24, 0, 7.78, 0.71, 9.19, 3.54, 7.78, 4.95, 7.07, 7.07, 4.95, 7.78, 4.95, 10.61, 7.78, 10.61]],
    repeat: [[3, 1], [18, 16]],
    fill: 1,
    stroke: 1
  },
  pine: {
    width: 30,
    height: 30,
    lines: [[5.66, 11.31, 2.83, 11.31, 2.83, 8.49, 0, 8.49, 2.83, 0, 5.66, 8.49, 2.83, 8.49]],
    repeat: [[3, 1], [18, 16]],
    stroke: 1
  },
  pine2: {
    width: 30,
    height: 30,
    lines: [[5.66, 11.31, 2.83, 11.31, 2.83, 8.49, 0, 8.49, 2.83, 0, 5.66, 8.49, 2.83, 8.49, 2.83, 11.31, 5.66, 11.31]],
    repeat: [[3, 1], [18, 16]],
    fill: 1,
    stroke: 1
  },
  mixtree: {
    width: 30,
    height: 30,
    lines: [
      [7.78, 10.61, 4.95, 10.61, 4.95, 7.78, 3.54, 7.78, 2.12, 6.36, 0.71, 6.36, 0, 4.24, 0.71, 2.12, 4.24, 0, 7.78, 0.71, 9.19, 3.54, 7.78, 4.95, 7.07, 7.07, 4.95, 7.78, 4.95, 10.61, 7.78, 10.61],
      [23.66, 27.31, 20.83, 27.31, 20.83, 24.49, 18, 24.49, 20.83, 16, 23.66, 24.49, 20.83, 24.49, 20.83, 27.31, 23.66, 27.31]
    ],
    repeat: [[3, 1]],
    stroke: 1
  },
  mixtree2: {
    width: 30,
    height: 30,
    lines: [
      [7.78, 10.61, 4.95, 10.61, 4.95, 7.78, 3.54, 7.78, 2.12, 6.36, 0.71, 6.36, 0, 4.24, 0.71, 2.12, 4.24, 0, 7.78, 0.71, 9.19, 3.54, 7.78, 4.95, 7.07, 7.07, 4.95, 7.78, 4.95, 10.61, 7.78, 10.61],
      [23.66, 27.31, 20.83, 27.31, 20.83, 24.49, 18, 24.49, 20.83, 16, 23.66, 24.49, 20.83, 24.49, 20.83, 27.31, 23.66, 27.31]
    ],
    repeat: [[3, 1]],
    fill: 1,
    stroke: 1
  },
  pines: {
    width: 22,
    height: 20,
    lines: [[1, 4, 3.5, 1, 6, 4], [1, 8, 3.5, 5, 6, 8], [3.5, 1, 3.5, 11], [12, 14.5, 14.5, 14, 17, 14.5], [12, 18, 17, 18], [14.5, 12, 14.5, 18]],
    repeat: [[2, 1]],
    stroke: 1
  },
  rock: {
    width: 20,
    height: 20,
    lines: [
      [1, 0, 1, 9],
      [4, 0, 4, 9],
      [7, 0, 7, 9],
      [10, 1, 19, 1],
      [10, 4, 19, 4],
      [10, 7, 19, 7],
      [0, 11, 9, 11],
      [0, 14, 9, 14],
      [0, 17, 9, 17],
      [12, 10, 12, 19],
      [15, 10, 15, 19],
      [18, 10, 18, 19]
    ],
    repeat: [[0.5, 0.5]],
    stroke: 1
  },
  rocks: {
    width: 20,
    height: 20,
    lines: [
      [
        5,
        0,
        3,
        0,
        5,
        4,
        4,
        6,
        0,
        3,
        0,
        5,
        3,
        6,
        5,
        9,
        3.75,
        10,
        2.5,
        10,
        0,
        9,
        0,
        10,
        4,
        11,
        5,
        14,
        4,
        15,
        0,
        13,
        0,
        13,
        0,
        13,
        0,
        14,
        0,
        14,
        5,
        16,
        5,
        18,
        3,
        19,
        0,
        19,
        -0.25,
        19.9375,
        5,
        20,
        10,
        19,
        10,
        20,
        11,
        20,
        12,
        19,
        14,
        20,
        15,
        20,
        17,
        19,
        20,
        20,
        20,
        19,
        19,
        16,
        20,
        15,
        20,
        11,
        20,
        10,
        19,
        8,
        20,
        5,
        20,
        0,
        19,
        0,
        20,
        2,
        19,
        4,
        17,
        4,
        16,
        3,
        15,
        0,
        14,
        0,
        15,
        4,
        11,
        5,
        10,
        4,
        11,
        0,
        10,
        0,
        9,
        4,
        6,
        5,
        5,
        0
      ],
      [18, 5, 19, 6, 18, 10, 16, 10, 14, 9, 16, 5, 18, 5],
      [5, 6, 9, 5, 10, 6, 10, 9, 6, 10, 5, 6],
      [14, 5, 14, 8, 13, 9, 12, 9, 11, 7, 12, 5, 14, 5],
      [5, 11, 8, 10, 9, 11, 10, 14, 6, 15, 6, 15, 5, 11],
      [13, 10, 14, 11, 15, 14, 15, 14, 15, 14, 11, 15, 10, 11, 11, 10, 13, 10],
      [15, 12, 16, 11, 19, 11, 19, 15, 16, 14, 16, 14, 15, 12],
      [6, 16, 9, 15, 10, 18, 5, 19, 6, 16],
      [10, 16, 14, 16, 14, 18, 13, 19, 11, 18, 10, 16],
      [15, 15, 18, 16, 18, 18, 16, 19, 15, 18, 15, 15]
    ],
    stroke: 1
  }
};
var we = class extends Pe {
  constructor(t) {
    t = t || {};
    var e = 0;
    t.stroke && (e = t.stroke.getWidth()), t.displacement || (t.displacement = [t.offsetX || 0, -t.offsetY || 0]), super({
      radius: t.radius,
      fill: t.fill,
      scale: t.scale,
      rotation: t.rotation,
      displacement: t.displacement,
      rotateWithView: t.rotateWithView,
      declutterMode: t.declutterMode
    }), typeof t.opacity == "number" && this.setOpacity(t.opacity), this._color = t.color, this._fontSize = t.fontSize || 1, this._fontStyle = t.fontStyle || "", this._stroke = t.stroke, this._fill = t.fill, this._radius = t.radius - e, this._form = t.form || "none", this._gradient = t.gradient, this._offset = [t.offsetX ? t.offsetX : 0, t.offsetY ? t.offsetY : 0], t.glyph ? this._glyph = this.getGlyph(t.glyph) : this._glyph = this.getTextGlyph(t.text || "", t.font), this.getDisplacement || this.getImage(), this.render();
  }
  /** Static function : add new font defs
   * @param {String|Object} font the font name or a description ({ font: font_name, name: font_name, copyright: '', prefix })
   * @param {Object} glyphs a key / value list of glyph definitions.
   * 		Each key is the name of the glyph,
   * 		the value is an object that code the font, the caracter code,
   * 		the name and a search string for the glyph.
   *    { char: the char, code: the char code (if no char), theme: a theme for search puposes, name: the symbol name, search: a search string (separated with ',') }
   */
  static addDefs(t, e) {
    var i = t;
    if (typeof t == "string" && (i = { font: t, name: t, copyright: "" }), !i.font || typeof i.font != "string") {
      console.log("bad font def");
      return;
    }
    var n = i.font;
    we.defs.fonts[n] = i;
    for (var s in e) {
      var o = e[s];
      typeof o == "string" && (o.length == 1 || o.length == 2) && (o = { char: o }), we.defs.glyphs[s] = {
        font: i.font,
        char: o.char || "" + String.fromCodePoint(o.code) || "",
        theme: o.theme || i.name,
        name: o.name || s,
        search: o.search || ""
      };
    }
  }
  /** Clones the style.
   * @return {ol_style_FontSymbol}
   */
  clone() {
    var t = new we({
      //glyph: this._glyph,
      text: this._glyph.char,
      font: this._glyph.font,
      color: this._color,
      fontSize: this._fontSize,
      fontStyle: this._fontStyle,
      stroke: this._stroke,
      fill: this._fill,
      radius: this._radius + (this._stroke ? this._stroke.getWidth() : 0),
      form: this._form,
      gradient: this._gradient,
      offsetX: this._offset[0],
      offsetY: this._offset[1],
      opacity: this.getOpacity(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      declutterMode: this.getDeclutterMode ? this.getDeclutterMode() : null
    });
    return t.setScale(this.getScale()), t;
  }
  /** Get the fill style for the symbol.
   * @return {ol_style_Fill} Fill style.
   * @api
   */
  getFill() {
    return this._fill;
  }
  /** Get the stroke style for the symbol.
   * @return {_ol_style_Stroke_} Stroke style.
   * @api
   */
  getStroke() {
    return this._stroke;
  }
  /** Get the glyph definition for the symbol.
   * @param {string|undefined} name a glyph name to get the definition, default return the glyph definition for the style.
   * @return {*}
   * @api
   */
  getGlyph(t) {
    return t ? we.defs.glyphs[t] || { font: "sans-serif", char: t.charAt(0), theme: "none", name: "none", search: "" } : this._glyph;
  }
  /** Get glyph definition given a text and a font
   * @param {string|undefined} text
   * @param {string} [font] the font for the text
   * @return {*}
   * @api
   */
  getTextGlyph(t, e) {
    return { font: e || "sans-serif", char: String(t), theme: "none", name: "none", search: "" };
  }
  /**
   * Get the glyph name.
   * @return {string} the name
   * @api
   */
  getGlyphName() {
    for (var t in we.defs.glyphs)
      if (we.defs.glyphs[t] === this._glyph)
        return t;
    return "";
  }
  /**
   * Get the stroke style for the symbol.
   * @return {_ol_style_Stroke_} Stroke style.
   * @api
   */
  getFontInfo(t) {
    return we.defs.fonts[t.font];
  }
  /**
   * @return {RenderOptions}  The render options
   */
  createRenderOptions() {
    var t = super.createRenderOptions(), e = "none";
    return this._stroke && (e = [
      Qt(this._stroke.getColor() || "#000"),
      this._stroke.getWidth() || 0,
      this._stroke.getLineDash(),
      this._stroke.getLineDashOffset() || 0,
      this._stroke.getLineJoin(),
      this._stroke.getLineCap(),
      this._stroke.getMiterLimit()
    ].join("-")), t.fontsymbolOptions = [
      "font-symbol",
      this._color,
      this._fontSize,
      this._fontStyle,
      e,
      this._fill ? Qt(this._fill.getColor() || "") : "",
      this._radius,
      this._form,
      this._gradient,
      (this._offset || []).join(","),
      Object.values(this._glyph || []).join(",")
    ].join("-"), t;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLCanvasElement} Image or Canvas element.
   * @api
   */
  getImage(t) {
    t = t || 1;
    var e = super.getImage(t), i, n = 0;
    this._stroke && (i = Qt(this._stroke.getColor()), n = this._stroke.getWidth());
    var s = {
      strokeStyle: i,
      strokeWidth: n,
      size: e.width / t
    }, o = e.getContext("2d");
    if (o.clearRect(0, 0, e.width, e.height), this.drawMarker_(s, o, 0, 0, t), !this.getDisplacement) {
      var a = this.getAnchor();
      a[0] = e.width / 2 - this._offset[0], a[1] = e.width / 2 - this._offset[1];
    }
    return e;
  }
  /**
   * @private
   * @param {ol_style_FontSymbol.RenderOptions} renderOptions
   * @param {CanvasRenderingContext2D} context
   */
  drawPath_(t, e) {
    var i = 2 * this._radius + t.strokeWidth, n = t.strokeWidth / 2, s = t.size / 2, o = { fac: 1, posX: t.size / 2, posY: t.size / 2 };
    switch (e.lineJoin = "round", e.lineCap = "round", e.beginPath(), this._form) {
      case "none": {
        o.fac = 1;
        break;
      }
      case "circle":
      case "ban": {
        e.arc(s, s, i / 2, 0, 2 * Math.PI, !0);
        break;
      }
      case "poi": {
        e.arc(s, s - 0.4 * this._radius, 0.6 * this._radius, 0.15 * Math.PI, 0.85 * Math.PI, !0), e.lineTo(s - 0.89 * 0.05 * i, (0.95 + 0.45 * 0.05) * i + n), e.arc(s, 0.95 * i + n, 0.05 * i, 0.85 * Math.PI, 0.15 * Math.PI, !0), o = { fac: 0.45, posX: s, posY: s - 0.35 * this._radius };
        break;
      }
      case "bubble": {
        e.arc(s, s - 0.2 * this._radius, 0.8 * this._radius, 0.4 * Math.PI, 0.6 * Math.PI, !0), e.lineTo(0.5 * i + n, i + n), o = { fac: 0.7, posX: s, posY: s - 0.2 * this._radius };
        break;
      }
      case "marker": {
        e.arc(s, s - 0.2 * this._radius, 0.8 * this._radius, 0.25 * Math.PI, 0.75 * Math.PI, !0), e.lineTo(0.5 * i + n, i + n), o = { fac: 0.7, posX: s, posY: s - 0.2 * this._radius };
        break;
      }
      case "coma": {
        e.moveTo(s + 0.8 * this._radius, s - 0.2 * this._radius), e.quadraticCurveTo(0.95 * i + n, 0.75 * i + n, 0.5 * i + n, i + n), e.arc(s, s - 0.2 * this._radius, 0.8 * this._radius, 0.45 * Math.PI, 0, !1), o = { fac: 0.7, posX: s, posY: s - 0.2 * this._radius };
        break;
      }
      default: {
        var a;
        switch (this._form) {
          case "shield": {
            a = [0.05, 0, 0.95, 0, 0.95, 0.8, 0.5, 1, 0.05, 0.8, 0.05, 0], o.posY = 0.45 * i + n;
            break;
          }
          case "blazon": {
            a = [0.1, 0, 0.9, 0, 0.9, 0.8, 0.6, 0.8, 0.5, 1, 0.4, 0.8, 0.1, 0.8, 0.1, 0], o.fac = 0.8, o.posY = 0.4 * i + n;
            break;
          }
          case "bookmark": {
            a = [0.05, 0, 0.95, 0, 0.95, 1, 0.5, 0.8, 0.05, 1, 0.05, 0], o.fac = 0.9, o.posY = 0.4 * i + n;
            break;
          }
          case "hexagon": {
            a = [0.05, 0.2, 0.5, 0, 0.95, 0.2, 0.95, 0.8, 0.5, 1, 0.05, 0.8, 0.05, 0.2], o.fac = 0.9, o.posY = 0.5 * i + n;
            break;
          }
          case "diamond": {
            a = [0.25, 0, 0.75, 0, 1, 0.2, 1, 0.4, 0.5, 1, 0, 0.4, 0, 0.2, 0.25, 0], o.fac = 0.75, o.posY = 0.35 * i + n;
            break;
          }
          case "triangle": {
            a = [0, 0, 1, 0, 0.5, 1, 0, 0], o.fac = 0.6, o.posY = 0.3 * i + n;
            break;
          }
          case "sign": {
            a = [0.5, 0.05, 1, 0.95, 0, 0.95, 0.5, 0.05], o.fac = 0.7, o.posY = 0.65 * i + n;
            break;
          }
          case "lozenge": {
            a = [0.5, 0, 1, 0.5, 0.5, 1, 0, 0.5, 0.5, 0], o.fac = 0.7;
            break;
          }
          case "square":
          default: {
            a = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0];
            break;
          }
        }
        for (var l = 0; l < a.length; l += 2)
          e.lineTo(a[l] * i + n, a[l + 1] * i + n);
      }
    }
    return e.closePath(), o;
  }
  /**
   * @private
   * @param {ol_style_FontSymbol.RenderOptions} renderOptions
   * @param {CanvasRenderingContext2D} context
   * @param {number} x The origin for the symbol (x).
   * @param {number} y The origin for the symbol (y).
   */
  drawMarker_(t, e, i, n, s) {
    var o = this._fill ? this._fill.getColor() : "#000", a = this._stroke ? this._stroke.getColor() : "#000";
    this._form == "none" && this._stroke && this._fill && (a = this._fill.getColor(), o = this._stroke.getColor()), e.setTransform(s, 0, 0, s, 0, 0), e.translate(i, n);
    var l = this.drawPath_(t, e, s);
    if (this._fill) {
      if (this._gradient && this._form != "none") {
        var c = e.createLinearGradient(0, 0, t.size / 2, t.size);
        c.addColorStop(1, Qt(o)), c.addColorStop(0, Qt(a)), e.fillStyle = c;
      } else
        e.fillStyle = Qt(o);
      e.fill();
    }
    if (this._stroke && t.strokeWidth && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, e.stroke()), this._glyph.char) {
      e.font = this._fontStyle + " " + 2 * l.fac * this._radius * this._fontSize + "px " + this._glyph.font, e.strokeStyle = e.fillStyle, e.lineWidth = t.strokeWidth * (this._form == "none" ? 2 : 1), e.fillStyle = Qt(this._color || a), e.textAlign = "center", e.textBaseline = "middle";
      var h = this._glyph.char;
      t.strokeWidth && a != "transparent" && e.strokeText(h, l.posX, l.posY), e.fillText(h, l.posX, l.posY);
    }
    if (this._form == "ban" && this._stroke && t.strokeWidth) {
      e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth;
      var u = this._radius + t.strokeWidth, d = this._radius * Math.cos(Math.PI / 4);
      e.moveTo(u + d, u - d), e.lineTo(u - d, u + d), e.stroke();
    }
  }
  /**
   * @inheritDoc
   */
  getChecksum() {
    var t = this._stroke !== null ? this._stroke.getChecksum() : "-", e = this._fill !== null ? this._fill.getChecksum() : "-", i = this.checksums_ === null || t != this.checksums_[1] || e != this.checksums_[2] || this._radius != this.checksums_[3] || this._form + "-" + this.glyphs_ != this.checksums_[4];
    if (i) {
      var n = "c" + t + e + (this._radius !== void 0 ? this._radius.toString() : "-") + this._form + "-" + this.glyphs_;
      this.checksums_ = [n, t, e, this._radius, this._form + "-" + this.glyphs_];
    }
    return this.checksums_[0];
  }
};
we.defs = { fonts: {}, glyphs: {} };
var Hh;
(function() {
  var r = [255, 255, 255, 1], t = [0, 153, 255, 1], e = 3, i = [
    new X({
      stroke: new K({ color: r, width: e + 2 })
    }),
    new X({
      image: new Et({
        radius: e * 2,
        fill: new $({ color: t }),
        stroke: new K({ color: r, width: e / 2 })
      }),
      stroke: new K({ color: t, width: e }),
      fill: new $({
        color: [255, 255, 255, 0.5]
      })
    })
  ];
  Hh = function(n) {
    if (n === !0)
      return i;
    n = n || {};
    var s = new $({
      color: n.fillColor || "rgba(255,255,255,0.4)"
    }), o = new K({
      color: n.color || "#3399CC",
      width: 1.25
    }), a = new X({
      image: new Et({
        fill: s,
        stroke: o,
        radius: 5
      }),
      fill: s,
      stroke: o
    });
    return [a];
  };
})();
const fm = Hh;
var Ks;
(function() {
  var r = {}, t = 0;
  function e(a) {
    var l = function(m) {
      if (a.vert && m.get("itineraire_vert"))
        return m.get("position_par_rapport_au_sol") < 0 ? [0, 128, 0, 0.7] : m.get("position_par_rapport_au_sol") > 0 ? [0, 100, 0, 1] : [0, 128, 0, 1];
      if (!m.get("importance")) return "magenta";
      if (m.get("nature") === "Piste cyclable")
        return [27, 177, 27, 0.5];
      if (m.get("position_par_rapport_au_sol") != "0") {
        var _;
        switch (m.get("importance")) {
          case "1":
            _ = [177, 27, 177, 1];
            break;
          case "2":
            _ = [177, 27, 27, 1];
            break;
          case "3":
            _ = [217, 119, 0, 1];
            break;
          case "4":
            _ = [255, 225, 0, 1];
            break;
          case "5":
            _ = [204, 204, 204, 1];
            break;
          default:
            _ = [211, 211, 211, 1];
            break;
        }
        return m.get("position_par_rapport_au_sol") < 0 && (_[3] = 0.7), _;
      } else
        switch (m.get("importance")) {
          case "1":
            return [255, 0, 255, 1];
          case "2":
            return [255, 0, 0, 1];
          case "3":
            return [255, 165, 0, 1];
          case "4":
            return [255, 255, 0, 1];
          case "5":
            return [255, 255, 255, 1];
          default:
            return [211, 211, 211, 1];
        }
    }, c = function(m) {
      return Math.max(m.get("largeur_de_chaussee") || 2, 2);
    }, h = function(m) {
      if (!m.get("position_par_rapport_au_sol")) return 100;
      var _ = Number(m.get("position_par_rapport_au_sol"));
      return _ > 0 ? 10 + _ * 10 - (Number(m.get("importance")) || 10) : _ < 0 ? Math.max(4 + _, 0) : 10 - (Number(m.get("importance")) || 10);
    }, u = function(m) {
      for (var _ = m.getCoordinates(), p, y, S = 0, C = m.getLength(), R = 0; R < _.length - 1 && (p = _[R + 1][0] - _[R][0], y = _[R + 1][1] - _[R][1], S += Math.sqrt(p * p + y * y), !(S >= C / 2)); R++)
        ;
      return -Math.atan2(y, p);
    }, d = function(m) {
      return a.sens && !/double|sans/i.test(m.get("sens_de_circulation")) ? new Kt({
        text: m.get("sens_de_circulation") == "Sens direct" ? "→" : "←",
        font: "bold 12px sans-serif",
        placement: "point",
        textAlign: "center",
        fill: new $({ color: [0, 0, 0, 0.3] }),
        stroke: new K({ color: [0, 0, 0, 0.3], width: 1.5 }),
        rotateWithView: !0
      }) : null;
    }, f = function(m) {
      switch (m.get("nature")) {
        case "Escalier":
          return [1, 4];
        case "Sentier":
          return [8, 10];
      }
    }, g = "ROUT-" + t++ + "-";
    return function(m, _) {
      var p = a.sens === !0 || _ < a.sens, y = g + m.get("nature") + "-" + m.get("position_par_rapport_au_sol") + "-" + (p ? m.get("sens_de_circulation") : "Sans objet") + "-" + m.get("position_par_rapport_au_sol") + "-" + m.get("importance") + "-" + m.get("largeur_de_chaussee") + "-" + m.get("itineraire_vert"), S = r[y];
      return S || (S = r[y] = [
        new X({
          text: p ? d(m) : null,
          stroke: new K({
            color: l(m),
            width: c(m),
            lineDash: f(m)
          }),
          zIndex: h(m) - 100
        })
      ]), S[0].getText() && S[0].getText().setRotation(u(m.getGeometry())), S;
    };
  }
  function i(a) {
    var l = function(u) {
      switch (u.get("nature")) {
        case "Industriel, agricole ou commercial":
          return [51, 102, 153, 1];
        case "Remarquable":
          return [0, 192, 0, 1];
        default:
          switch (u.get("usage_1")) {
            case "Résidentiel":
            case "Indifférencié":
              return [128, 128, 128, 1];
            case "Industriel":
            case "Commercial et services":
              return [51, 102, 153, 1];
            case "Sportif":
              return [51, 153, 102, 1];
            case "Religieux":
              return [153, 102, 51, 1];
            default:
              return [153, 51, 51, 1];
          }
      }
    }, c = function(u) {
      switch (u.get("usage_1")) {
        case "Commercial et services":
          return "";
        case "Sportif":
          return "";
        default:
          return null;
      }
    }, h = "BATI-" + t++ + "-";
    return function(u) {
      if (u.get("detruit")) return [];
      var d = h + u.get("usage_1") + "-" + u.get("nature") + "-" + u.get("etat_de_l_objet"), f = r[d];
      if (!f) {
        var g = l(u), m = [g[0], g[1], g[1], 0.5], _ = !/en service/i.test(u.get("etat_de_l_objet"));
        _ && (m[3] = 0.1);
        var p = a.symbol ? c(u) : null;
        return [
          new X({
            text: p ? new Kt({
              text: p,
              font: "12px FontAwesome",
              fill: new $({
                color: [0, 0, 0, 0.6]
                //col
              })
            }) : null,
            fill: new $({
              color: m
            }),
            stroke: new K({
              color: g,
              width: 1.5,
              lineDash: _ ? [5, 5] : null
            })
          })
        ];
      }
      return f;
    };
  }
  function n(a) {
    var l = new X({
      text: new Kt({
        text: "0000",
        font: "bold 12px sans-serif",
        fill: new $({
          color: [100, 0, 255, 1]
        }),
        stroke: new K({
          color: [255, 255, 255, 0.8],
          width: 3
        })
      }),
      stroke: new K({
        color: [255, 165, 0, 1],
        width: 1.5
      }),
      fill: new $({
        color: [100, 0, 255, 0.1]
      })
    });
    return function(c, h) {
      return h < 0.8 ? l.getText().setFont("bold 12px sans-serif") : l.getText().setFont("bold 10px sans-serif"), a.section ? l.getText().setText(c.get("section") + "-" + (c.get("numero") || "").replace(/^0*/, "")) : l.getText().setText((c.get("numero") || "").replace(/^0*/, "")), l;
    };
  }
  var s = {
    111: { color: [230, 0, 77, 255], title: "Continuous urban fabric" },
    112: { color: [255, 0, 0, 255], title: "Discontinuous urban fabric" },
    121: { color: [204, 77, 242, 255], title: "Industrial or commercial units" },
    122: { color: [204, 0, 0, 255], title: "Road and rail networks and associated land" },
    123: { color: [230, 204, 204, 255], title: "Port areas" },
    124: { color: [230, 204, 230, 255], title: "Airports" },
    131: { color: [166, 0, 204, 255], title: "Mineral extraction sites" },
    132: { color: [166, 77, 0, 255], title: "Dump sites" },
    133: { color: [255, 77, 255, 255], title: "Construction sites" },
    141: { color: [255, 166, 255, 255], title: "Green urban areas" },
    142: { color: [255, 230, 255, 255], title: "Sport and leisure facilities" },
    211: { color: [255, 255, 168, 255], title: "Non-irrigated arable land" },
    212: { color: [255, 255, 0, 255], title: "Permanently irrigated land" },
    213: { color: [230, 230, 0, 255], title: "Rice fields" },
    221: { color: [230, 128, 0, 255], title: "Vineyards" },
    222: { color: [242, 166, 77, 255], title: "Fruit trees and berry plantations" },
    223: { color: [230, 166, 0, 255], title: "Olive groves" },
    231: { color: [230, 230, 77, 255], title: "Pastures" },
    241: { color: [255, 230, 166, 255], title: "Annual crops associated with permanent crops" },
    242: { color: [255, 230, 77, 255], title: "Complex cultivation patterns" },
    243: { color: [230, 204, 77, 255], title: "Land principally occupied by agriculture with significant areas of natural vegetation" },
    244: { color: [242, 204, 166, 255], title: "Agro-forestry areas" },
    311: { color: [128, 255, 0, 255], title: "Broad-leaved forest" },
    312: { color: [0, 166, 0, 255], title: "Coniferous forest" },
    313: { color: [77, 255, 0, 255], title: "Mixed forest" },
    321: { color: [204, 242, 77, 255], title: "Natural grasslands" },
    322: { color: [166, 255, 128, 255], title: "Moors and heathland" },
    323: { color: [166, 230, 77, 255], title: "Sclerophyllous vegetation" },
    324: { color: [166, 242, 0, 255], title: "Transitional woodland-shrub" },
    331: { color: [230, 230, 230, 255], title: "Beaches dunes sands" },
    332: { color: [204, 204, 204, 255], title: "Bare rocks" },
    333: { color: [204, 255, 204, 255], title: "Sparsely vegetated areas" },
    334: { color: [0, 0, 0, 255], title: "Burnt areas" },
    335: { color: [166, 230, 204, 255], title: "Glaciers and perpetual snow" },
    411: { color: [166, 166, 255, 255], title: "Inland marshes" },
    412: { color: [77, 77, 255, 255], title: "Peat bogs" },
    421: { color: [204, 204, 255, 255], title: "Salt marshes" },
    422: { color: [230, 230, 255, 255], title: "Salines" },
    423: { color: [166, 166, 230, 255], title: "Intertidal flats" },
    511: { color: [0, 204, 242, 255], title: "Water courses" },
    512: { color: [128, 242, 230, 255], title: "Water bodies" },
    521: { color: [0, 255, 166, 255], title: "Coastal lagoons" },
    522: { color: [166, 255, 230, 255], title: "Estuaries" },
    523: { color: [230, 242, 255, 255], title: "Sea and ocean" }
  };
  function o(a) {
    return function(l) {
      var c = l.get("code_" + a.date), h = r["CLC-" + c];
      if (!h) {
        var u = s[c].color.slice();
        u[3] = a.opacity || 1, h = r["CLC-" + c] = new X({
          fill: new $({
            color: u || [255, 255, 255, 0.5]
          })
        });
      }
      return h;
    };
  }
  Ks = function(a, l) {
    switch (l = l || {}, a) {
      case "BDTOPO_V3:troncon_de_route":
        return e(l);
      case "BDTOPO_V3:batiment":
        return i(l);
      case "CADASTRALPARCELS.PARCELLAIRE_EXPRESS:parcelle":
        return n(l);
      default:
        return /LANDCOVER/.test(a) ? (l.date = a.replace(/[^\d]*(\d*).*/, "$1"), o(l)) : (console.warn("[ol/style/geoportailStyle] no style defined for type: " + a), fm());
    }
  }, Ks.clcColors = JSON.parse(JSON.stringify(s));
})();
const gm = Ks;
class mm {
  constructor(t) {
    this.styler = t;
  }
  zombie() {
    function t(e, i) {
      return e.get("detruit") ? [255, 0, 0, i] : [0, 0, 255, i];
    }
    return (e) => {
      const i = {
        strokeColor: t(e, 1),
        strokeWidth: 2,
        fillColor: t(e, 0.5)
      }, n = new X({
        text: this.styler.text(i),
        fill: this.styler.fill(i),
        stroke: this.styler.stroke(i)
      });
      return this.styler.setImage(n, i, e), [n];
    };
  }
  detruit() {
    return (t) => {
      if (!t.get("detruit")) return [];
      const e = {
        strokeWidth: 2,
        strokeColor: [255, 0, 0, 0.5]
      }, i = new X({
        text: this.styler.text(e),
        fill: this.styler.fill(e),
        stroke: this.styler.stroke(e)
      });
      return this.styler.setImage(i, e, t), [i];
    };
  }
  vivant() {
    return (t) => {
      if (t.get("detruit")) return [];
      const e = {
        strokeWidth: 2,
        strokeColor: [0, 0, 255, 0.5]
      }, i = new X({
        text: this.styler.text(e),
        fill: this.styler.fill(e),
        stroke: this.styler.stroke(e)
      });
      return this.styler.setImage(i, e, t), [i];
    };
  }
  combine(t) {
    const e = Array.isArray(t) ? t : [t];
    return (i, n) => {
      const s = [];
      for (const o of e) {
        const a = o(i, n), l = Array.isArray(a) ? a : [a];
        s.push(...l);
      }
      return s;
    };
  }
  troncon_de_route(t) {
    return t = t || {}, gm("BDTOPO_V3:troncon_de_route", { sens: t.sens || !0 });
  }
  sens(t) {
    t || (t = {
      attribute: "sens_de_circulation",
      glyph: "›",
      // '>',
      size: "20px",
      direct: "Sens direct",
      inverse: "Sens inverse"
    });
    const e = (n) => n == t.direct || n == t.inverse ? t.glyph : "", i = (n, s) => {
      if (n != t.direct && n != t.inverse) return 0;
      let o = s.getCoordinates(), a = 0, l = 0, c = 0, h = s.getLength();
      for (var u = 0; u < o.length - 1 && (a = o[u + 1][0] - o[u][0], l = o[u + 1][1] - o[u][1], c += Math.sqrt(a * a + l * l), !(c >= h / 2)); u++)
        ;
      return n == t.direct ? -Math.atan2(l, a) : Math.PI - Math.atan2(l, a);
    };
    return (n) => {
      const s = n.get(t.attribute), o = {
        label: e(s),
        fontWeight: "bold",
        fontSize: t.size,
        labelRotation: i(s, n.getGeometry())
        // we have to cast to LineString | MultiLineString because getGeometry() can return undefined
      };
      return [
        new X({
          text: this.styler.text(o)
        })
      ];
    };
  }
  toponyme(t) {
    return t || (t = {
      attribute: "nom",
      size: "12px"
    }), t.minResolution || (t.minResolution = 0), t.maxResolution || (t.maxResolution = 2), (e, i) => {
      if (i > t.maxResolution || i < t.minResolution) return [];
      const n = {
        label: e.get(t.attribute),
        fontWeight: t.weight,
        fontSize: t.size
      };
      return [new X({
        text: this.styler.text(n)
      })];
    };
  }
  batiment(t) {
    t || (t = {});
    const e = (i, n) => {
      switch (i.get("nature")) {
        case "Industriel, agricole ou commercial":
          return [51, 102, 153, n];
        case "Remarquable":
          return [0, 192, 0, n];
        default:
          switch (i.get("fonction")) {
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
    return (i) => {
      if (i.get("detruit")) return [];
      const n = {
        strokeColor: e(i, 1),
        fillColor: e(i, 0.5)
      };
      return /en service/i.test(i.get("etat_de_l_objet")) || (n.strokeLineDash = [10, 5], n.fillColor = [0, 0, 0, 0]), t.symbol && (n.label = this.getSymbol(i), n.fontFamily = "Fontawesome", n.fontColor = t.color || "magenta"), n.label ? [
        new X({
          text: this.styler.text(n),
          stroke: this.styler.stroke(n),
          fill: this.styler.fill(n)
        })
      ] : [
        new X({
          stroke: this.styler.stroke(n),
          fill: this.styler.fill(n)
        })
      ];
    };
  }
  getSymbol(t) {
    switch (t.get("fonction")) {
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
const ar = {};
class Zo {
  constructor(t) {
    this._symbolCache = {}, this._cacheLoading = [], this._userManager = t, this.presets = new mm(this), this.defaultStyleFn = this.getFeatureStyleFn();
  }
  /**
   * Format properties with feature context
   * @param format The format configuration
   * @param _feature The feature to format properties for (unused for now)
   * @returns Formatted property value
   */
  formatProperties(t, e) {
    if (!t || !t.replace || !e) return t;
    const i = t.replace(/.*\$\{([^}]*)\}.*/, "$1");
    return i === t ? t : this.formatProperties(t.replace("${" + i + "}", e.get(i)), e);
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
  static getFeatureStyleFunction(t, e, i) {
    const n = i == null ? void 0 : i.userManager;
    return new Zo(n).getFeatureStyleFn(t, e, i);
  }
  /**
   * Format feature style by processing all style properties
   * @param fstyle The feature style configuration
   * @param feature The feature to style
   * @returns Formatted feature style object
   */
  formatFeatureStyle(t, e) {
    if (!t) return {};
    const i = {};
    for (const n in t)
      i[n] = this.formatProperties(t[n], e);
    return i;
  }
  /**
   * Get stroke LineDash style from featureType.style
   * @param fstyle The feature style configuration
   * @returns Line dash array or undefined
   */
  strokeLineDash(t) {
    var e = Number(t.strokeWidth) || 2;
    switch (t.strokeDashstyle) {
      case "dot":
        return [1, 2 * e];
      case "dash":
        return [2 * e, 2 * e];
      case "dashdot":
        return [2 * e, 4 * e, 1, 4 * e];
      case "longdash":
        return [4 * e, 2 * e];
      case "longdashdot":
        return [4 * e, 4 * e, 1, 4 * e];
      default:
        return;
    }
  }
  /**
   * Create a Stroke style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Stroke object or undefined
   */
  stroke(t) {
    if (t.strokeOpacity === 0) return;
    const e = this.strokeLineDash(t), i = new K({
      color: t.strokeColor || "#00f",
      width: Number(t.strokeWidth) || 1,
      lineDash: e,
      lineCap: t.strokeLinecap || "round"
    });
    if (t.strokeOpacity !== void 0 && t.strokeOpacity < 1) {
      const n = Ve(i.getColor());
      n.length && (n[4] = t.strokeOpacity, i.setColor(n));
    }
    return i;
  }
  /**
   * Create a Fill style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Fill or FillPattern object or undefined
   */
  fill(t) {
    if (t.fillOpacity === 0) return;
    let e = new $({
      color: t.fillColor || "rgba(255,255,255,0.5)"
    });
    if (t.fillOpacity !== void 0 && t.fillOpacity < 1) {
      const i = Ve(e.getColor());
      i.length && (i[3] = Number(t.fillOpacity), e.setColor(i));
    }
    return t.fillPattern && (e = new Wi({
      fill: e,
      pattern: t.fillPattern,
      color: t.patternColor,
      angle: 45
    })), e;
  }
  /**
   * Get default circle image for point features
   * @returns OpenLayers Circle style
   */
  getDefaultCircleImage() {
    return new Et({
      radius: 10,
      fill: new $({ color: "rgba(255,0,0,.5)" }),
      stroke: new K({ color: "#fff", width: 1.5 })
    });
  }
  /**
   * Set image on a style based on feature style configuration
   * Creates point symbols from images, circles, or font icons
   * @param olStyle The OpenLayers style to modify
   * @param fstyle The feature style configuration
   * @param feature The feature being styled (unused for now)
   */
  setImage(t, e, i) {
    let n, s;
    if (e.img ? s = e.img : e.externalGraphic && e.externalGraphic !== "undefined" && (s = e.uri + "?width=" + e.graphicWidth + "&height=" + e.graphicWidth), s)
      if (ar[s])
        n = ar[s];
      else {
        const o = new Image();
        o.addEventListener("load", () => {
          ar[s] = new mi({ src: s }), t.setImage(ar[s]), i.changed();
        }), o.src = s, n = this.getDefaultCircleImage();
      }
    else {
      const o = Number(e.pointRadius) || 5, a = {
        cross: [4, o, 0, 0],
        square: [4, o, void 0, Math.PI / 4],
        triangle: [3, o, void 0, 0],
        star: [5, o, o / 2, 0],
        x: [4, o, 0, Math.PI / 4],
        rectangle: [4, o, void 0, Math.PI / 4]
        // added
      };
      switch (e.graphicName) {
        case "cross":
        case "star":
        case "rectangle":
        case "square":
        case "triangle":
        case "x": {
          const l = a[e.graphicName] || a.square;
          if (n = new Pe({
            points: l[0],
            radius: l[1],
            radius2: l[2],
            rotation: l[3],
            stroke: this.stroke(e),
            fill: this.fill(e)
          }), e.graphicName === "rectangle") {
            const c = n.getImage(1), h = document.createElement("canvas");
            h.width = c.width, h.height = c.height;
            const u = h.getContext("2d"), d = c.getContext("2d");
            u && d && (u.drawImage(c, 0, 0, c.width, c.height, c.width / 4, 0, c.width / 2, c.height), d.clearRect(0, 0, c.width, c.height), d.drawImage(h, 0, 0));
          }
          break;
        }
        case "lightning":
        case "church":
          n = new we({
            glyph: this.getGlyph(e.graphicName),
            radius: o,
            rotation: Math.PI,
            stroke: this.stroke(e),
            fill: this.fill(e)
          });
          break;
        default:
          n = new Et({
            radius: o,
            stroke: this.stroke(e),
            fill: this.fill(e)
          });
          break;
      }
    }
    n && t.setImage(n);
  }
  /**
   * Create a Text style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Text object or undefined
   */
  text(t) {
    if (!t.label) return;
    const e = {
      font: (t.fontWeight || "") + " " + (t.fontSize || "12") + "px " + (t.fontFamily || "Sans-serif"),
      text: t.label || "",
      rotation: t.labelRotation || 0,
      textAlign: "left",
      textBaseline: "middle",
      offsetX: t.labelXOffset || 0,
      offsetY: -(t.labelYOffset || 0),
      stroke: new K({
        color: t.labelOutlineColor || "#fff",
        width: Number(t.labelOutlineWidth) || 2
      }),
      fill: new $({
        color: t.fontColor || "#000"
      })
    };
    return new Kt(e);
  }
  /**
   * This function was using Cordova to load symbols from the file system.
   * Instead of calling Capacitor here (we want to separate the logic)
   * We're passing the directory list as parameter
   * 
   * To understand more about that, see the ol/style/Collaboratif.js file, line 263
   * @param entries Array of symbol cache entries with name and nativeURL
   */
  loadSymbolCache(t) {
    this._cacheLoading = [];
    for (let e = 0, i; i = t[e]; e++)
      this._symbolCache[i.name] = i.nativeURL;
  }
  /** Get ol style function as defined in featureType
   * 
   * @param featureType Feature type configuration with style rules
   * @param cache Cache configuration (unused for now)
   * @param options Additional options including directoryList for symbol cache
   * @returns A style function that takes (feature, resolution) and returns Style or Style[]
   */
  getFeatureStyleFn(t, e, i) {
    t = t || {};
    const n = new X({
      text: new Kt({
        text: "›",
        font: "bold 25px Arial"
      })
    });
    return (s, o) => {
      var g, m, _;
      if (i != null && i.directoryList && this.loadSymbolCache(i.directoryList), !t.style && t.name) {
        const p = t.name;
        if (typeof this.presets[p] == "function") {
          const y = this.presets[p](t);
          if (typeof y == "function")
            return y(s);
        }
      }
      let a = t.style;
      if ((g = t.style) != null && g.children) {
        const p = s.getProperties();
        delete p.geometry;
        for (let y = 0; y < t.style.children.length; y++) {
          const S = t.style.children[y];
          if (S.mongo && S.mongo.matches && S.mongo.matches(p)) {
            a = S;
            break;
          }
        }
      }
      const l = this.formatFeatureStyle(a || {}, s);
      a != null && a.name && (t.symbo_attribute ? (l.radius = 5, l.img = this.getSymbolURI(
        t,
        a.name + "/" + s.get(t.symbo_attribute.name),
        a.graphicWidth || 16,
        a.graphicHeight || 16,
        s
      )) : a.externalGraphic && (l.radius = 5, l.img = this.getSymbolURI(
        t,
        a.externalGraphic,
        a.graphicWidth || 16,
        a.graphicHeight || 16,
        s
      )));
      const c = new X({}), h = this.text(l);
      h && c.setText(h), this.setImage(c, l, s);
      const u = this.fill(l);
      u && c.setFill(u);
      const d = this.stroke(l);
      d && c.setStroke(d);
      let f;
      if ((m = t.style) != null && m.directionField)
        try {
          f = JSON.parse(t.style.directionField);
        } catch {
          f = null, console.log("bad json direction field for style " + t.style.name);
        }
      if (o < 2 && f && typeof f == "object" && "attribute" in f && "sensDirect" in f && "sensInverse" in f) {
        const p = f.sensDirect, y = f.sensInverse, S = (R, I) => {
          if (R !== p && R !== y) return 0;
          let F = I;
          I instanceof se && (F = I.getLineString(0));
          const P = F.getCoordinates();
          let M = 0, A = 0, z = 0;
          const Z = F.getLength();
          for (let V = 0; V < P.length - 1 && (M = P[V + 1][0] - P[V][0], A = P[V + 1][1] - P[V][1], z += Math.sqrt(M * M + A * A), !(z >= Z / 2)); V++)
            ;
          return R === p ? -Math.atan2(A, M) : Math.PI - Math.atan2(A, M);
        }, C = s.get(f.attribute);
        if (C === p || C === y) {
          const R = s.getGeometry();
          if (R && (R instanceof bt || R instanceof se)) {
            const I = S(C, R);
            return (_ = n.getText()) == null || _.setRotation(I), [c, n];
          }
        }
      }
      return c;
    };
  }
  /**
   * Return the urls of the symbols used for a feature type
   * @param featureType the feature type configuration
   * @returns Record mapping symbol names to their URIs
   */
  getUrls(t) {
    const e = {};
    if (!t.styles) return e;
    for (const i in t.styles) {
      const n = t.styles[i];
      if (n.externalGraphic && n.uri && (e[n.externalGraphic] = n.uri), n.children)
        for (const s in n.children) {
          const o = n.children[s];
          o.externalGraphic && o.uri && (e[o.externalGraphic] = o.uri);
        }
    }
    return e;
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
   * @returns Symbol URI from cache, or null if not yet loaded
   */
  getSymbolURI(t, e, i, n, s) {
    const o = e.replace(/\//g, "_") + "_" + i + "x" + n;
    if (this._symbolCache[o])
      return this._symbolCache[o];
    const a = this.getUrls(t);
    if (!a[e])
      return console.warn("Symbol not found in feature type styles:", e), null;
    if (this._cacheLoading.indexOf(o) !== -1) return null;
    if (!this._userManager || !this._userManager.apiClient)
      return console.warn("UserManager not initialized - cannot load symbol from API"), null;
    const l = a[e] + "?width=" + i + "&height=" + n;
    return this._cacheLoading.push(o), this._userManager.apiClient.getDocument(l).then((c) => {
      s.changed();
    }), null;
  }
  /**
   * Get the glyph for a graphic
   * @param graphicName the name of the graphic
   * @returns the glyph for the graphic
   */
  getGlyph(t) {
    switch (t) {
      case "lightning":
        return "fa-bolt";
      case "church":
        return "fa-venus";
      default:
        return null;
    }
  }
}
class qh extends $i {
  constructor(t, e) {
    e = e || {};
    const i = qh._computeCollabVectorLayerOptions(t);
    super(i), this.set("name", `${t.database}:${t.name}`), e.client = t.client, t.cacheUrl && (e.cacheUrl = t.cacheUrl, e.online = e.online != null ? e.online : !1, this.set("cache", !0)), this.createSource(t, e, t.table);
  }
  /**
   * Computes the options for the CollabVector layer
   */
  static _computeCollabVectorLayerOptions(t) {
    return {
      database: t.database,
      name: t.name,
      url: t.url,
      renderMode: t.renderMode || dm.COLLAB_VECTOR_RENDER_MODE
    };
  }
  /**
   * Creates the source for the CollabVector layer
   */
  createSource(t, e, i) {
    const n = {
      ...e,
      table: i,
      client: e.client || t.client
    };
    t.checkSourceOptions && t.checkSourceOptions(this, n, i);
    const s = new Go(n);
    this.setSource(s), this.set("title", i.title);
    const o = new Ml(), a = i, l = a.maxZoomLevel ?? a.max_zoom_level, c = a.minZoomLevel ?? a.min_zoom_level;
    if (l && l < 20 && (o.setZoom(l), this.setMinResolution(o.getResolution() ?? 0)), (c || c === 0) && (o.setZoom(Math.max(c, 4)), this.setMaxResolution((o.getResolution() ?? 0) + 1)), i.style && i.style.children) {
      for (const h of i.style.children)
        if (typeof h.condition == "string")
          try {
            h.condition = JSON.parse(h.condition);
          } catch {
          }
    }
    if (i.styles && i.styles.length) {
      let h = !1;
      i.styles.forEach((u) => {
        i.style && u.id === i.style.id && (h = !0), u.children && u.children.forEach((d) => {
          if (typeof d.condition == "string")
            try {
              d.condition = JSON.parse(d.condition);
            } catch {
            }
        });
      }), !h && i.style && i.styles.unshift(i.style);
    }
    if (!t.style) {
      const h = Zo.getFeatureStyleFunction(i, t.cacheUrl ?? "", n);
      this.setStyle(h);
    }
    this.dispatchEvent({ type: "ready", source: s });
  }
  /**
   * Get the table for the CollabVector layer
   */
  getTable() {
    const t = this.getSource();
    if (this.isReady() && t) return t.table;
  }
  /**
   * Get the style for features in this layer
   */
  getFeatureStyle() {
    const t = this.getSource();
    if (this.isReady() && t) return t.table.style;
  }
  /**
   * Check if the layer is ready (has a source with a table)
   */
  isReady() {
    const t = this.getSource();
    return t !== null && t.table !== void 0;
  }
  /**
   * Set the online/offline mode for the layer
   */
  setOnline(t) {
    const e = this.getSource();
    e && (e.localProperties.online = t, typeof e.reload == "function" ? e.reload() : e.refresh());
  }
}
const _m = new Do();
class Hs extends $i {
  constructor(t, e) {
    var l;
    t = t || {}, t.geoservice || (t.geoservice = {}), t.geoservice.input_mask || (t.geoservice.input_mask = {});
    const i = Hs._computeWFSLayerOptions(t);
    if (super(i), !((l = t.geoservice) != null && l.url)) {
      console.error("WFSLayer: geoservice.url is required");
      return;
    }
    this.cache = e, this.layerOptions = t, this.set("authentication", t.username), t.getCapabilities !== !1 ? this.getCapabilities(t) : this.createSource(t, this.cache);
    const n = new Ml(), s = t.geoservice, o = s.maxZoom ?? s.max_zoom, a = s.minZoom ?? s.min_zoom;
    o && o < 20 && (n.setZoom(o), this.setMinResolution(n.getResolution() ?? 0)), (a || a === 0) && (n.setZoom(a), this.setMaxResolution(n.getResolution() ?? 0));
  }
  /**
   * Compute the options to pass to the super constructor of VectorLayer
   */
  static _computeWFSLayerOptions(t) {
    const e = _m.getEscapedDomainFromURL(t.geoservice.url), i = t.geoservice.input_mask ? t.geoservice.input_mask.attributes : null;
    return {
      title: t.geoservice.title,
      description: t.geoservice.description,
      visible: t.visibility,
      opacity: t.opacity,
      name: `${e}:${t.geoservice.layers}`,
      style: t.style || Hs._createWFSStyle(i ?? {}),
      search: t.geoservice.input_mask ? t.geoservice.input_mask.searchAttribute : null,
      logo: t.logo
    };
  }
  async getCapabilities(t) {
    var l;
    const e = (l = this.layerOptions) == null ? void 0 : l.authentication, i = new URL(t.geoservice.url);
    i.searchParams.append("service", "WFS"), i.searchParams.append("request", "GetCapabilities");
    const n = {}, s = this.getAuthorizationHeader(t);
    s && (n.Authorization = s);
    const o = new AbortController(), a = setTimeout(() => o.abort(), 1e4);
    try {
      const c = await fetch(i.toString(), {
        headers: n,
        signal: o.signal
      });
      if (clearTimeout(a), !c.ok) {
        this.handleGetCapabilitiesError(
          c.status,
          new Error(`HTTP ${c.status}: ${c.statusText}`),
          c.statusText,
          t,
          e
        );
        return;
      }
      this.createSource(t, this.cache);
    } catch (c) {
      clearTimeout(a);
      const h = 0, u = c.name === "AbortError" ? "timeout" : "error";
      this.handleGetCapabilitiesError(
        h,
        c,
        u,
        t,
        e
      );
    }
  }
  getAuthorizationHeader(t) {
    var i, n;
    const e = (i = t.accessToken) == null ? void 0 : i.trim();
    if (e)
      return `${((n = t.tokenType) == null ? void 0 : n.trim()) || "Bearer"} ${e}`;
    if (t.username && t.password)
      return `Basic ${btoa(`${t.username}:${t.password}`)}`;
  }
  /**
   * Handle errors from getCapabilities request
   */
  handleGetCapabilitiesError(t, e, i, n, s) {
    var l;
    const o = !!(n.username && n.password);
    if (!!!((l = n.accessToken) != null && l.trim()) && (t === 0 && !o || t === 401 || t === 500) && typeof s == "function") {
      s(this, (c, h) => {
        c ? (n.username = c, this.set("authentication", n.username), n.password = h, this.getCapabilities(n)) : (this.createSource(n, this.cache), this.dispatchEvent({ type: "error", error: e, status: t, statusText: i }));
      });
      return;
    }
    if (this.cache)
      switch (t) {
        case 403:
        case 404:
        case 500:
        case 503:
          this.dispatchEvent({ type: "error", error: e, status: t, statusText: i });
          return;
      }
    console.warn("[WFSLayer] GetCapabilities failed, fallback to direct GetFeature loader:", e.message), this.createSource(n, this.cache), this.dispatchEvent({ type: "error", error: e, status: t, statusText: i });
  }
  createSource(t, e) {
    var n;
    const i = new Lr(t, e);
    i.localProperties.table = {
      attributes: ((n = t.geoservice.input_mask) == null ? void 0 : n.attributes) ?? {}
    }, this.setSource(i), setTimeout(() => this.dispatchEvent({ type: "ready", source: i }), 100), i.on("addfeature", (s) => {
      s.feature._layer = this;
    });
  }
  /**
   * Get the table for the WFS layer
   */
  getTable() {
    const t = this.getSource();
    if (t && t instanceof Lr) return t.localProperties.table;
  }
  /**
   * Create a WFS style function based on feature attributes
   */
  static _createWFSStyle(t) {
    const e = new $({
      color: zt.FILL_COLOR
    }), i = new K({
      color: zt.STROKE_COLOR,
      width: zt.STROKE_WIDTH
    }), n = [
      new X({
        image: new Et({
          fill: e,
          stroke: i,
          radius: zt.CIRCLE_RADIUS
        }),
        fill: e,
        stroke: i
      })
    ];
    if (!t || Object.keys(t).length === 0)
      return n;
    const s = {};
    for (const a in t)
      t[a].title && /^symb@/.test(t[a].title) && (s[t[a].title] = a);
    const o = (a) => s[a] || a;
    return (a) => {
      const l = a.wfsStyle;
      if (l)
        return l;
      if (!a.get(o("symb@sColor")))
        return n;
      const h = a.get(o("symb@fColor")) || zt.FILL_COLOR, u = a.get(o("symb@fPattern"));
      let d;
      if (u) {
        const R = a.get(o("symb@pAngle")), I = a.get(o("symb@pWidth")), F = a.get(o("symb@pSpace")), P = a.get(o("symb@pColor"));
        d = new Wi({
          pattern: u,
          color: P || "transparent",
          fill: new $({
            color: h
          }),
          size: I || 2,
          spacing: F || 5,
          angle: R
        });
      } else
        d = new $({ color: h });
      let f;
      const g = a.get(o("symb@label"));
      if (g) {
        const R = a.get(o("symb@lColor")) || zt.LABEL_COLOR, I = a.get(o("symb@lsColor")) || zt.LABEL_STROKE_COLOR, F = a.get(o("symb@lSize")) || zt.LABEL_SIZE;
        f = new Kt({
          text: String(g),
          stroke: new K({
            color: I,
            width: zt.LABEL_STROKE_WIDTH
          }),
          fill: new $({
            color: R
          }),
          overflow: !1,
          font: `${F}px sans-serif`
        });
      }
      const m = a.get(o("symb@sColor")) || zt.STROKE_COLOR, _ = a.get(o("symb@sWidth")) || zt.STROKE_WIDTH, p = a.get(o("symb@sDash")), y = p ? p.split(",").map((R) => parseFloat(R)) : void 0, S = new K({
        color: m,
        width: _,
        lineDash: y && y.length > 1 ? y : void 0
      }), C = [
        new X({
          image: new Et({
            fill: e,
            stroke: i,
            radius: zt.CIRCLE_RADIUS
          }),
          text: f,
          fill: d,
          stroke: S
        })
      ];
      return a.wfsStyle = C, C;
    };
  }
}
class Zm {
  constructor(t) {
    this.apiClient = t.apiClient, this.storage = t.storage, this._eventManager = new On();
  }
  /**
   * Event subscription methods
   */
  on(t, e) {
    this._eventManager.on(t, e);
  }
  off(t, e) {
    this._eventManager.off(t, e);
  }
  once(t, e) {
    this._eventManager.once(t, e);
  }
  emit(t, e) {
    this._eventManager.emit(t, e);
  }
  async login(t, e) {
    try {
      const i = await this.apiClient.login(t, e);
      if (!i.data)
        throw new Error("Login failed");
      const n = i.data;
      return this.emit("user:connect", { user: n }), n;
    } catch (i) {
      throw this.emit("user:error", { error: i, code: "LOGIN_FAILED" }), i;
    }
  }
  async initialize() {
    try {
      const t = await this.storage.getCredentials();
      if (t && t.username && t.password) {
        const e = await this.login(t.username, t.password);
        await this.storage.saveUser(e);
      }
    } catch (t) {
      throw this.emit("user:error", { error: t, code: "INIT_FAILED" }), t;
    }
  }
  async logout() {
    try {
      await this.apiClient.disconnect(), await this.storage.clearUser(), await this.storage.clearCredentials(), this.emit("user:disconnect", {});
    } catch (t) {
      throw this.emit("user:error", { error: t, code: "LOGOUT_FAILED" }), t;
    }
  }
  /**
   * Get a user
   * Call getCommunity for each community in the user's communities_member array
   * and return the user with the communities
   * @returns User
   */
  async getUser() {
    let e = (await this.apiClient.getUser()).data;
    e.communities_member = e.communities_member || [];
    const i = (await this.apiClient.getCommunities()).data;
    return e.communities_member.map(
      (n) => this.apiClient.getCommunity(n.community_id)
    ), e.communities = i.map((n, s) => {
      var o, a;
      return {
        ...n,
        profile: (a = (o = e.communities_member) == null ? void 0 : o[s]) == null ? void 0 : a.profile
        // profile is a key
      };
    }), e;
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
    return (await this.getUser()).communities.find((e) => e.active === !0) || null;
  }
  /**
   * Get the layers info for a given community
   * @param communityId - The ID of the community to get the layers info for
   * @returns CommunityLayer[]
   */
  async getLayersInfo(t) {
    if (!this.apiClient.username)
      throw new Error("Unauthorized");
    const i = (await this.apiClient.getLayers(t, { limit: 100 })).data, n = i.map((l) => this._fetchLayerData(l)), s = this._getUniqueDatabaseIds(i), o = await this._fetchDatabaseExtents(s), a = await Promise.all(n);
    return this._enrichLayers(i, a, o), i;
  }
  /**
   * Fetch geoservice or table data for a single layer
   */
  async _fetchLayerData(t) {
    const e = t;
    return e.geoservice ? this.apiClient.getGeoservice(e.geoservice.id) : e.table && e.database ? this.apiClient.getTable(e.database, e.table) : null;
  }
  /**
   * Extract unique database IDs from layers
   */
  _getUniqueDatabaseIds(t) {
    const e = /* @__PURE__ */ new Set();
    for (const i of t) {
      const n = i;
      n.table && n.database && e.add(n.database);
    }
    return Array.from(e);
  }
  /**
   * Fetch database extents for all database IDs
   */
  async _fetchDatabaseExtents(t) {
    if (t.length === 0)
      return {};
    const e = t.map(
      (s) => this.apiClient.getDatabase(s, { fields: "extent,id" })
    ), i = await Promise.all(e), n = {};
    for (const s of i)
      n[s.data.id] = s.data.extent;
    return n;
  }
  /**
   * Enrich layers with fetched geoservice/table data and database extents
   * (UserManager.js lines 276-290)
   */
  _enrichLayers(t, e, i) {
    for (let n = 0; n < t.length; n++) {
      const s = t[n], o = e[n];
      if (o) {
        if (s.geoservice)
          s.geoservice = o.data;
        else if (s.table && s.database) {
          const a = o.data;
          a.columns = Object.values(a.columns), s.table = a, s.extent = i[s.database].split(",");
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
  async setActiveCommunity(t) {
    try {
      const e = await this.getGroupById(t);
      if (!e)
        throw new Error("Community not found");
      await this.storage.setActiveCommunity(t);
      const i = await this.storage.getParam();
      i.offline = e.offline_allowed, e.layers || (e.layers = await this.getLayersInfo(t), await this.storage.saveParam(i)), this.emit("community:change", { community: e });
    } catch (e) {
      throw this.emit("user:error", { error: e, code: "SET_COMMUNITY_FAILED" }), e;
    }
  }
  /**
  * Get the community with its ID
  * @param {number} id - The ID of the community to get
  * @returns {Community | null} - The community or null if not found
  */
  async getGroupById(t) {
    return (await this.getUser()).communities.find((i) => i.id === t) || null;
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
  async setServiceUrl(t) {
    t !== await this.apiClient.getBaseUrl() && (await this.logout(), await this.apiClient.setBaseUrl(t));
  }
}
class Vm {
  constructor(t) {
    this.apiClient = t;
  }
  /**
   * Upload a document to a specified URI
   * @param uri - The URI endpoint for upload
   * @param file - The file blob to upload
   * @param filename - The name of the file
   * @param metadata - Optional metadata to attach to the upload
   * @returns The URL of the uploaded document
   */
  async uploadDocument(t, e, i, n) {
    const s = new FormData();
    if (s.append("file", e, i), n)
      for (const [a, l] of Object.entries(n))
        s.append(a, String(l));
    const o = await this.apiClient.uploadFile(t, s);
    return o.data.url || o.data.path;
  }
  /**
   * Delete a document by its ID
   * @param documentId - The ID of the document to delete
   */
  async deleteDocument(t) {
    await this.apiClient.deleteDocument(t);
  }
  /**
   * Get the URL of a document by its ID
   * @param documentId - The ID of the document
   * @returns The URL of the document
   */
  async getDocumentUrl(t) {
    return (await this.apiClient.getDocument(t.toString())).data.url;
  }
}
const Ue = {
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
class jm {
  constructor(t, e, i = {}) {
    this._defaultParams = {
      georems: {},
      protocol: "georem",
      version: "1.0",
      territory: "fr",
      theme: "",
      themes: "",
      insee: ""
    }, this._apiClient = t, this._storage = e, this._eventManager = new On(), this.options = i;
    const n = this._storage.loadParams("report");
    this.params = {
      ...this._defaultParams,
      ...i.defaultParams,
      ...n
    }, i.communityId && (this.params.communityId = i.communityId), i.themeId && (this.params.themeId = i.themeId);
  }
  /**
   * Event subscription methods
   */
  on(t, e) {
    this._eventManager.on(t, e);
  }
  off(t, e) {
    this._eventManager.off(t, e);
  }
  once(t, e) {
    this._eventManager.once(t, e);
  }
  emit(t, e) {
    this._eventManager.emit(t, e);
  }
  /**
   * Create a new report *locally*
   * equivalent to postGeorem of ReportForm.js
   * @param report 
   * 
   * TODO: see the difference between the local and server report creation
   */
  async createReport(t, e = !1) {
    if (!this.params || !this.params.geometry || !this.params.lon && !this.params.lat)
      throw Error("BADREM: neither geometry, lon or lat exists");
    const i = {
      comment: t.comment,
      geometry: this.params.geometry || `POINT(${this.params.lon} ${this.params.lat})`
    };
    if (t.sketch ? i.sketch = t.sketch : t.features && (i.sketch = this.feature2sketch(t.features, this.params.proj)), i.community = t.communityId > 0 ? t.communityId : "-1", t.themes) {
      let s = t.themes.split("::");
      var n = parseInt(s[0]);
      i.attributes = JSON.stringify({
        community: n,
        theme: t.theme,
        attributes: t.attributes ? JSON.parse(t.attributes) : {}
      });
    }
    try {
      const s = await this._apiClient.addReport(i), o = s.data.id, a = s.data;
      return t.photos && t.photos.length && (t.photosToSend = !0), await this.uploadAttachements(o, t), this.emit("report:created", { report: a }), e && this.emit("report:submitted", { report: a, serverId: o }), a;
    } catch (s) {
      throw this.emit("report:error", {
        error: s,
        message: s.message || "Failed to create report"
      }), s;
    }
  }
  /**
   * Submit a report to the server
   * @param _reportId 
   */
  async submitReport(t) {
    throw new Error("Not implemented");
  }
  /**
   * See if the type is correct
   * equivalent to postPhotosPending of ReportForm.js
   * @param file: File to upload
   */
  async uploadAttachements(t, e) {
    var o;
    if (!e.photos || !((o = e.photos) != null && o.length) || !e.photosToSend) return;
    const i = (/* @__PURE__ */ new Date()).getTime();
    this.params.georems || (this.params.georems = {}), this.params.georems[i] || (this.params.georems[i] = {}), this.params.georems[i].photosToSend = !1, delete this.params.georems[i].error;
    const n = e.photos, s = [];
    for (const a in n)
      s.push(this._storage.getBlob(n[a]));
    this.emit("attachment:uploading", { reportId: t, progress: 0 }), Promise.all(s).then((a) => {
      const l = {};
      for (const c in a)
        l["photo" + c] = a[c];
      this._apiClient.addAttachments(t, l).then(() => {
        setTimeout(() => {
          this._storage.saveParam(this.params), this.emit("attachment:uploaded", { reportId: t, attachmentId: i });
        }, 300);
      }).catch(() => {
        this.params.georems && this.params.georems[i] && (this.params.georems[i].photosToSend = !0, this.params.georems[i].error = "Echec d'envoi des images"), this._storage.saveParam(this.params), this.emit("report:error", {
          error: new Error("Echec d'envoi des images"),
          message: "Echec d'envoi des images"
        });
      });
    }).catch((a) => {
      this.params.georems && this.params.georems[i] && (this.params.georems[i].photosToSend = !0, this.params.georems[i].error = a), this._storage.saveParam(this.params), this.emit("report:error", {
        error: a,
        message: a.message || "Failed to upload attachments"
      });
    });
  }
  /**
   * Update a report locally
   * Note: Once submitted, the report is no longer editable
   * @param _report 
   */
  async updateReport(t) {
    throw new Error("Not implemented");
  }
  /**
   * Delete a report
   * @param _reportId 
   */
  async deleteReport(t) {
    throw new Error("Not implemented");
  }
  /**
   * Get a report
   * @param _reportId 
   * @param _fromServer
   */
  async getReport(t, e = !0) {
    throw new Error("Not implemented");
  }
  /**
   * List reports
   * @param _filter 
   * @param _fromServer
   */
  async listReports(t, e = !0) {
    throw new Error("Not implemented");
  }
  /** Write feature(s) to sketch
     * @param {ol.feature|Array<ol.feature>} the feature(s) to write
     * @param {ol.proj.ProjectionLike} projection of the features (optional, defaults to WGS84)
     * @return {Object} the sketch in json format
     */
  feature2sketch(t, e) {
    var l, c, h, u;
    if (!t) return "";
    t instanceof Array || (t = [t]);
    const i = new Fr(), n = new An();
    let s;
    const o = (l = t[0]) == null ? void 0 : l.getGeometry();
    o instanceof Le ? s = o.getFirstCoordinate() : o && (s = Fe(o.getExtent())), s && e && (s = Gu(s, e, Ue.FEATURE2SKETCH.TRANSFORM_PROJECTION));
    const a = {
      context: {
        ...Ue.FEATURE2SKETCH.SKETCH_CONTEXT,
        lon: ((c = s == null ? void 0 : s[0]) == null ? void 0 : c.toFixed(7)) || Ue.FEATURE2SKETCH.SKETCH_CONTEXT.lon,
        lat: ((h = s == null ? void 0 : s[1]) == null ? void 0 : h.toFixed(7)) || Ue.FEATURE2SKETCH.SKETCH_CONTEXT.lat
      },
      objects: []
    };
    for (const d of t) {
      const f = { style: Ue.FEATURE2SKETCH.SKETCH_STYLE }, g = (u = d.getGeometry()) == null ? void 0 : u.clone(), m = d.getProperties();
      switch (delete m.geometry, e && (g == null || g.transform(e, Ue.FEATURE2SKETCH.TRANSFORM_PROJECTION)), (g == null ? void 0 : g.getLayout()) === "XYZM" && (m.geom = n.writeGeometry(g)), f.name = "", f.attributes = m, f.geometry = i.writeGeometry(g), g == null ? void 0 : g.getType()) {
        case "Point":
          f.type = "Point";
          break;
        case "LineString":
          f.type = "LineString";
          break;
        case "Polygon":
        case "MultiPolygon":
          f.type = "Polygone";
          break;
      }
      a.objects.push(f);
    }
    return JSON.stringify(a);
  }
  /** Get feature(s) from sketch
    * @param sketch the sketch in json
    * @param proj projection of the features, default `EPSG:3857`
    * @return the feature(s)
    */
  sketch2feature(t, e) {
    typeof t == "string" && (t = JSON.parse(t));
    const i = [], n = new Fr(), s = t.objects;
    for (const o of s) {
      const a = o.attributes ? o.attributes : {};
      a.geometry = n.readGeometry(o.geometry), a.geometry.transform(Ue.SKETCH2FEATURE.TRANSFORM_PROJECTION, e || Ue.SKETCH2FEATURE.TRANSFORM_PROJECTION_FALLBACK), i.push(new Ct(a));
    }
    return i;
  }
}
function pm(r) {
  return r instanceof Date && !isNaN(r.getTime());
}
class $m {
  /**
   * Validate a report
   * Return type might be something more complex with errors and such
   * @param report 
   * @returns 
   */
  static validate(t) {
    if (!t.geometry)
      return { valid: !1, error: "This field is required" };
    if (!t.comment)
      return { valid: !1, error: "This field is required" };
    if (!t.attributes)
      return { valid: !1, error: "This field is required" };
    if (t.attributes)
      for (const [e, i] of Object.entries(t.attributes)) {
        const n = t.attributes[e], s = this.validateAttribute(e, i, n);
        if (!s.valid)
          return { valid: !1, error: s.error };
      }
    return { valid: !0 };
  }
  static validateAttribute(t, e, i) {
    var n;
    return i.required && !e ? { valid: !1, error: `The field ${t} is required` } : i.type === "number" && isNaN(e) ? { valid: !1, error: `The field ${t} must be a number` } : i.type === "select" && !((n = i.options) != null && n.includes(e)) ? { valid: !1, error: `The field ${t} must be a valid option` } : i.type === "date" && !pm(e) ? { valid: !1, error: `The field ${t} must be a valid date` } : { valid: !0 };
  }
}
class ym extends fe {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {?import("./Map.js").FrameState} [frameState] Frame state.
   */
  constructor(t, e, i) {
    super(t), this.map = e, this.frameState = i !== void 0 ? i : null;
  }
}
class wm extends ym {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {EVENT} originalEvent Original event.
   * @param {boolean} [dragging] Is the map currently being dragged?
   * @param {import("./Map.js").FrameState} [frameState] Frame state.
   * @param {Array<PointerEvent>} [activePointers] Active pointers.
   */
  constructor(t, e, i, n, s, o) {
    super(t, e, s), this.originalEvent = i, this.pixel_ = null, this.coordinate_ = null, this.dragging = n !== void 0 ? n : !1, this.activePointers = o;
  }
  /**
   * The map pixel relative to the viewport corresponding to the original event.
   * @type {import("./pixel.js").Pixel}
   * @api
   */
  get pixel() {
    return this.pixel_ || (this.pixel_ = this.map.getEventPixel(this.originalEvent)), this.pixel_;
  }
  set pixel(t) {
    this.pixel_ = t;
  }
  /**
   * The coordinate corresponding to the original browser event.  This will be in the user
   * projection if one is set.  Otherwise it will be in the view projection.
   * @type {import("./coordinate.js").Coordinate}
   * @api
   */
  get coordinate() {
    return this.coordinate_ || (this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel)), this.coordinate_;
  }
  set coordinate(t) {
    this.coordinate_ = t;
  }
  /**
   * Prevents the default browser action.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault.
   * @api
   * @override
   */
  preventDefault() {
    super.preventDefault(), "preventDefault" in this.originalEvent && this.originalEvent.preventDefault();
  }
  /**
   * Prevents further propagation of the current event.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation.
   * @api
   * @override
   */
  stopPropagation() {
    super.stopPropagation(), "stopPropagation" in this.originalEvent && this.originalEvent.stopPropagation();
  }
}
const wt = {
  /**
   * A true single click with no dragging and no double click. Note that this
   * event is delayed by 250 ms to ensure that it is not a double click.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#singleclick
   * @api
   */
  SINGLECLICK: "singleclick",
  /**
   * A click with no dragging. A double click will fire two of this.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#click
   * @api
   */
  CLICK: Rt.CLICK,
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Rt.DBLCLICK,
  /**
   * Triggered when a pointer is dragged.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointerdrag
   * @api
   */
  POINTERDRAG: "pointerdrag",
  /**
   * Triggered when a pointer is moved. Note that on touch devices this is
   * triggered when the map is panned, so is not the same as mousemove.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointermove
   * @api
   */
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup"
}, Em = function(r) {
  const t = r.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, Or = hi, Cm = function(r) {
  return r.type == wt.CLICK;
}, qs = vl, Jh = function(r) {
  return r.type == wt.SINGLECLICK;
}, Sm = function(r) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    r.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, Qh = function(r) {
  const t = r.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, xm = function(r) {
  const t = r.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
}, br = {
  ACTIVE: "active"
};
class tc extends Ae {
  /**
   * @param {InteractionOptions} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t && t.handleEvent && (this.handleEvent = t.handleEvent), this.map_ = null, this.setActive(!0);
  }
  /**
   * Return whether the interaction is currently active.
   * @return {boolean} `true` if the interaction is active, `false` otherwise.
   * @observable
   * @api
   */
  getActive() {
    return (
      /** @type {boolean} */
      this.get(br.ACTIVE)
    );
  }
  /**
   * Get the map associated with this interaction.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event}.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(t) {
    return !0;
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  setActive(t) {
    this.set(br.ACTIVE, t);
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    this.map_ = t;
  }
}
class Vo extends tc {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent), t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent), t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent), t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent), t.stopDown && (this.stopDown = t.stopDown), this.handlingDownUpSequence = !1, this.targetPointers = [];
  }
  /**
   * Returns the current number of pointers involved in the interaction,
   * e.g. `2` when two fingers are used.
   * @return {number} The number of pointers.
   * @api
   */
  getPointerCount() {
    return this.targetPointers.length;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleDownEvent(t) {
    return !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleDragEvent(t) {
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may call into
   * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
   * detected.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   * @override
   */
  handleEvent(t) {
    if (!t.originalEvent)
      return !0;
    let e = !1;
    if (this.updateTrackedPointers_(t), this.handlingDownUpSequence) {
      if (t.type == wt.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == wt.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == wt.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      this.handlingDownUpSequence = i, e = this.stopDown(i);
    } else t.type == wt.POINTERMOVE && this.handleMoveEvent(t);
    return !e;
  }
  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleMoveEvent(t) {
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleUpEvent(t) {
    return !1;
  }
  /**
   * This function is used to determine if "down" events should be propagated
   * to other interactions or should be stopped.
   * @param {boolean} handled Was the event handled by the interaction?
   * @return {boolean} Should the `down` event be stopped?
   */
  stopDown(t) {
    return t;
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @private
   */
  updateTrackedPointers_(t) {
    t.activePointers && (this.targetPointers = t.activePointers);
  }
}
const lr = {
  /**
   * Triggered upon feature draw start
   * @event DrawEvent#drawstart
   * @api
   */
  DRAWSTART: "drawstart",
  /**
   * Triggered upon feature draw end
   * @event DrawEvent#drawend
   * @api
   */
  DRAWEND: "drawend",
  /**
   * Triggered upon feature draw abortion
   * @event DrawEvent#drawabort
   * @api
   */
  DRAWABORT: "drawabort"
};
class hr extends fe {
  /**
   * @param {DrawEventType} type Type.
   * @param {Feature} feature The feature drawn.
   */
  constructor(t, e) {
    super(t), this.feature = e;
  }
}
function Rm(r, t) {
  const e = [];
  for (let i = 0; i < t.length; ++i) {
    const s = t[i].getGeometry();
    ec(r, s, e);
  }
  return e;
}
function cr(r, t) {
  return Ce(r[0], r[1], t[0], t[1]);
}
function ki(r, t) {
  const e = r.length;
  return t < 0 ? r[t + e] : t >= e ? r[t - e] : r[t];
}
function ur(r, t, e) {
  let i, n;
  t < e ? (i = t, n = e) : (i = e, n = t);
  const s = Math.ceil(i), o = Math.floor(n);
  if (s > o) {
    const l = Di(r, i), c = Di(r, n);
    return cr(l, c);
  }
  let a = 0;
  if (i < s) {
    const l = Di(r, i), c = ki(r, s);
    a += cr(l, c);
  }
  if (o < n) {
    const l = ki(r, o), c = Di(r, n);
    a += cr(l, c);
  }
  for (let l = s; l < o - 1; ++l) {
    const c = ki(r, l), h = ki(r, l + 1);
    a += cr(c, h);
  }
  return a;
}
function ec(r, t, e) {
  if (t instanceof bt) {
    dr(r, t.getCoordinates(), !1, e);
    return;
  }
  if (t instanceof se) {
    const i = t.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n)
      dr(r, i[n], !1, e);
    return;
  }
  if (t instanceof qt) {
    const i = t.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n)
      dr(r, i[n], !0, e);
    return;
  }
  if (t instanceof ve) {
    const i = t.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n) {
      const o = i[n];
      for (let a = 0, l = o.length; a < l; ++a)
        dr(r, o[a], !0, e);
    }
    return;
  }
  if (t instanceof je) {
    const i = t.getGeometries();
    for (let n = 0; n < i.length; ++n)
      ec(r, i[n], e);
    return;
  }
}
const Rs = { index: -1, endIndex: NaN };
function Im(r, t, e, i) {
  const n = r[0], s = r[1];
  let o = 1 / 0, a = -1, l = NaN;
  for (let u = 0; u < t.targets.length; ++u) {
    const d = t.targets[u], f = d.coordinates;
    let g = 1 / 0, m;
    for (let _ = 0; _ < f.length - 1; ++_) {
      const p = f[_], y = f[_ + 1], S = ic(n, s, p, y);
      S.squaredDistance < g && (g = S.squaredDistance, m = _ + S.along);
    }
    g < o && (o = g, d.ring && t.targetIndex === u && (d.endIndex > d.startIndex ? m < d.startIndex && (m += f.length) : d.endIndex < d.startIndex && m > d.startIndex && (m -= f.length)), l = m, a = u);
  }
  const c = t.targets[a];
  let h = c.ring;
  if (t.targetIndex === a && h) {
    const u = Di(
      c.coordinates,
      l
    ), d = e.getPixelFromCoordinate(u);
    wr(d, t.startPx) > i && (h = !1);
  }
  if (h) {
    const u = c.coordinates, d = u.length, f = c.startIndex, g = l;
    if (f < g) {
      const m = ur(
        u,
        f,
        g
      );
      ur(
        u,
        f,
        g - d
      ) < m && (l -= d);
    } else {
      const m = ur(
        u,
        f,
        g
      );
      ur(
        u,
        f,
        g + d
      ) < m && (l += d);
    }
  }
  return Rs.index = a, Rs.endIndex = l, Rs;
}
function dr(r, t, e, i) {
  const n = r[0], s = r[1];
  for (let o = 0, a = t.length - 1; o < a; ++o) {
    const l = t[o], c = t[o + 1], h = ic(n, s, l, c);
    if (h.squaredDistance === 0) {
      const u = o + h.along;
      i.push({
        coordinates: t,
        ring: e,
        startIndex: u,
        endIndex: u
      });
      return;
    }
  }
}
const Is = { along: 0, squaredDistance: 0 };
function ic(r, t, e, i) {
  const n = e[0], s = e[1], o = i[0], a = i[1], l = o - n, c = a - s;
  let h = 0, u = n, d = s;
  return (l !== 0 || c !== 0) && (h = ht(((r - n) * l + (t - s) * c) / (l * l + c * c), 0, 1), u += l * h, d += c * h), Is.along = h, Is.squaredDistance = bn(Ce(r, t, u, d), 10), Is;
}
function Di(r, t) {
  const e = r.length;
  let i = Math.floor(t);
  const n = t - i;
  i >= e ? i -= e : i < 0 && (i += e);
  let s = i + 1;
  s >= e && (s -= e);
  const o = r[i], a = o[0], l = o[1], c = r[s], h = c[0] - a, u = c[1] - l;
  return [a + h * n, l + u * n];
}
class Tm extends Vo {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = vl), super(e), this.on, this.once, this.un, this.shouldHandle_ = !1, this.downPx_ = null, this.downTimeout_, this.lastDragTime_, this.pointerType_, this.freehand_ = !1, this.source_ = t.source ? t.source : null, this.features_ = t.features ? t.features : null, this.snapTolerance_ = t.snapTolerance ? t.snapTolerance : 12, this.type_ = /** @type {import("../geom/Geometry.js").Type} */
    t.type, this.mode_ = Mm(this.type_), this.stopClick_ = !!t.stopClick, this.minPoints_ = t.minPoints ? t.minPoints : this.mode_ === "Polygon" ? 3 : 2, this.maxPoints_ = this.mode_ === "Circle" ? 2 : t.maxPoints ? t.maxPoints : 1 / 0, this.finishCondition_ = t.finishCondition ? t.finishCondition : hi, this.geometryLayout_ = t.geometryLayout ? t.geometryLayout : "XY";
    let i = t.geometryFunction;
    if (!i) {
      const n = this.mode_;
      if (n === "Circle")
        i = (s, o, a) => {
          const l = o || new $r([NaN, NaN]), c = lt(s[0]), h = zi(
            c,
            lt(s[s.length - 1])
          );
          return l.setCenterAndRadius(
            c,
            Math.sqrt(h),
            this.geometryLayout_
          ), l;
        };
      else {
        let s;
        n === "Point" ? s = Gt : n === "LineString" ? s = bt : n === "Polygon" && (s = qt), i = (o, a, l) => (a ? n === "Polygon" ? o[0].length ? a.setCoordinates(
          [o[0].concat([o[0][0]])],
          this.geometryLayout_
        ) : a.setCoordinates([], this.geometryLayout_) : a.setCoordinates(o, this.geometryLayout_) : a = new s(o, this.geometryLayout_), a);
      }
    }
    this.geometryFunction_ = i, this.dragVertexDelay_ = t.dragVertexDelay !== void 0 ? t.dragVertexDelay : 500, this.finishCoordinate_ = null, this.sketchFeature_ = null, this.sketchPoint_ = null, this.sketchCoords_ = null, this.sketchLine_ = null, this.sketchLineCoords_ = null, this.squaredClickTolerance_ = t.clickTolerance ? t.clickTolerance * t.clickTolerance : 36, this.overlay_ = new $i({
      source: new Wn({
        useSpatialIndex: !1,
        wrapX: t.wrapX ? t.wrapX : !1
      }),
      style: t.style ? t.style : Pm(),
      updateWhileInteracting: !0
    }), this.geometryName_ = t.geometryName, this.condition_ = t.condition ? t.condition : Sm, this.freehandCondition_, t.freehand ? this.freehandCondition_ = Or : this.freehandCondition_ = t.freehandCondition ? t.freehandCondition : Qh, this.traceCondition_, this.setTrace(t.trace || !1), this.traceState_ = { active: !1 }, this.traceSource_ = t.traceSource || t.source || null, this.addChangeListener(br.ACTIVE, this.updateState_);
  }
  /**
   * Toggle tracing mode or set a tracing condition.
   *
   * @param {boolean|import("../events/condition.js").Condition} trace A boolean to toggle tracing mode or an event
   *     condition that will be checked when a feature is clicked to determine if tracing should be active.
   */
  setTrace(t) {
    let e;
    t ? t === !0 ? e = Or : e = t : e = qs, this.traceCondition_ = e;
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default} map Map.
   * @override
   */
  setMap(t) {
    super.setMap(t), this.updateState_();
  }
  /**
   * Get the overlay layer that this interaction renders sketch features to.
   * @return {VectorLayer} Overlay layer.
   * @api
   */
  getOverlay() {
    return this.overlay_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may actually draw or finish the drawing.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   * @override
   */
  handleEvent(t) {
    t.originalEvent.type === Rt.CONTEXTMENU && t.originalEvent.preventDefault(), this.freehand_ = this.mode_ !== "Point" && this.freehandCondition_(t);
    let e = t.type === wt.POINTERMOVE, i = !0;
    return !this.freehand_ && this.lastDragTime_ && t.type === wt.POINTERDRAG && (Date.now() - this.lastDragTime_ >= this.dragVertexDelay_ ? (this.downPx_ = t.pixel, this.shouldHandle_ = !this.freehand_, e = !0) : this.lastDragTime_ = void 0, this.shouldHandle_ && this.downTimeout_ !== void 0 && (clearTimeout(this.downTimeout_), this.downTimeout_ = void 0)), this.freehand_ && t.type === wt.POINTERDRAG && this.sketchFeature_ !== null ? (this.addToDrawing_(t.coordinate), i = !1) : this.freehand_ && t.type === wt.POINTERDOWN ? i = !1 : e && this.getPointerCount() < 2 ? (i = t.type === wt.POINTERMOVE, i && this.freehand_ ? (this.handlePointerMove_(t), this.shouldHandle_ && t.originalEvent.preventDefault()) : (t.originalEvent.pointerType === "mouse" || t.type === wt.POINTERDRAG && this.downTimeout_ === void 0) && this.handlePointerMove_(t)) : t.type === wt.DBLCLICK && (i = !1), super.handleEvent(t) && i;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return this.shouldHandle_ = !this.freehand_, this.freehand_ ? (this.downPx_ = t.pixel, this.finishCoordinate_ || this.startDrawing_(t.coordinate), !0) : this.condition_(t) ? (this.lastDragTime_ = Date.now(), this.downTimeout_ = setTimeout(() => {
      this.handlePointerMove_(
        new wm(
          wt.POINTERMOVE,
          t.map,
          t.originalEvent,
          !1,
          t.frameState
        )
      );
    }, this.dragVertexDelay_), this.downPx_ = t.pixel, !0) : (this.lastDragTime_ = void 0, !1);
  }
  /**
   * @private
   */
  deactivateTrace_() {
    this.traceState_ = { active: !1 };
  }
  /**
   * Activate or deactivate trace state based on a browser event.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @private
   */
  toggleTraceState_(t) {
    if (!this.traceSource_ || !this.traceCondition_(t))
      return;
    if (this.traceState_.active) {
      this.deactivateTrace_();
      return;
    }
    const e = this.getMap(), i = e.getCoordinateFromPixel([
      t.pixel[0] - this.snapTolerance_,
      t.pixel[1] + this.snapTolerance_
    ]), n = e.getCoordinateFromPixel([
      t.pixel[0] + this.snapTolerance_,
      t.pixel[1] - this.snapTolerance_
    ]), s = Zt([i, n]), o = this.traceSource_.getFeaturesInExtent(s);
    if (o.length === 0)
      return;
    const a = Rm(t.coordinate, o);
    a.length && (this.traceState_ = {
      active: !0,
      startPx: t.pixel.slice(),
      targets: a,
      targetIndex: -1
    });
  }
  /**
   * @param {TraceTarget} target The trace target.
   * @param {number} endIndex The new end index of the trace.
   * @private
   */
  addOrRemoveTracedCoordinates_(t, e) {
    const i = t.startIndex <= t.endIndex, n = t.startIndex <= e;
    i === n ? i && e > t.endIndex || !i && e < t.endIndex ? this.addTracedCoordinates_(t, t.endIndex, e) : (i && e < t.endIndex || !i && e > t.endIndex) && this.removeTracedCoordinates_(e, t.endIndex) : (this.removeTracedCoordinates_(t.startIndex, t.endIndex), this.addTracedCoordinates_(t, t.startIndex, e));
  }
  /**
   * @param {number} fromIndex The start index.
   * @param {number} toIndex The end index.
   * @private
   */
  removeTracedCoordinates_(t, e) {
    if (t === e)
      return;
    let i = 0;
    if (t < e) {
      const n = Math.ceil(t);
      let s = Math.floor(e);
      s === e && (s -= 1), i = s - n + 1;
    } else {
      const n = Math.floor(t);
      let s = Math.ceil(e);
      s === e && (s += 1), i = n - s + 1;
    }
    i > 0 && this.removeLastPoints_(i);
  }
  /**
   * @param {TraceTarget} target The trace target.
   * @param {number} fromIndex The start index.
   * @param {number} toIndex The end index.
   * @private
   */
  addTracedCoordinates_(t, e, i) {
    if (e === i)
      return;
    const n = [];
    if (e < i) {
      const s = Math.ceil(e);
      let o = Math.floor(i);
      o === i && (o -= 1);
      for (let a = s; a <= o; ++a)
        n.push(ki(t.coordinates, a));
    } else {
      const s = Math.floor(e);
      let o = Math.ceil(i);
      o === i && (o += 1);
      for (let a = s; a >= o; --a)
        n.push(ki(t.coordinates, a));
    }
    n.length && this.appendCoordinates(n);
  }
  /**
   * Update the trace.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @private
   */
  updateTrace_(t) {
    const e = this.traceState_;
    if (!e.active || e.targetIndex === -1 && wr(e.startPx, t.pixel) < this.snapTolerance_)
      return;
    const i = Im(
      t.coordinate,
      e,
      this.getMap(),
      this.snapTolerance_
    );
    if (e.targetIndex !== i.index) {
      if (e.targetIndex !== -1) {
        const l = e.targets[e.targetIndex];
        this.removeTracedCoordinates_(l.startIndex, l.endIndex);
      }
      const a = e.targets[i.index];
      this.addTracedCoordinates_(
        a,
        a.startIndex,
        i.endIndex
      );
    } else {
      const a = e.targets[e.targetIndex];
      this.addOrRemoveTracedCoordinates_(a, i.endIndex);
    }
    e.targetIndex = i.index;
    const n = e.targets[e.targetIndex];
    n.endIndex = i.endIndex;
    const s = Di(
      n.coordinates,
      n.endIndex
    ), o = this.getMap().getPixelFromCoordinate(s);
    t.coordinate = s, t.pixel = [Math.round(o[0]), Math.round(o[1])];
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    let e = !0;
    if (this.getPointerCount() === 0) {
      this.downTimeout_ && (clearTimeout(this.downTimeout_), this.downTimeout_ = void 0), this.handlePointerMove_(t);
      const i = this.traceState_.active;
      if (this.toggleTraceState_(t), this.shouldHandle_) {
        const n = !this.finishCoordinate_;
        n && this.startDrawing_(t.coordinate), !n && this.freehand_ ? this.finishDrawing() : !this.freehand_ && (!n || this.mode_ === "Point") && (this.atFinish_(t.pixel, i) ? this.finishCondition_(t) && this.finishDrawing() : this.addToDrawing_(t.coordinate)), e = !1;
      } else this.freehand_ && this.abortDrawing();
    }
    return !e && this.stopClick_ && t.preventDefault(), e;
  }
  /**
   * Handle move events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event A move event.
   * @private
   */
  handlePointerMove_(t) {
    if (this.pointerType_ = t.originalEvent.pointerType, this.downPx_ && (!this.freehand_ && this.shouldHandle_ || this.freehand_ && !this.shouldHandle_)) {
      const e = this.downPx_, i = t.pixel, n = e[0] - i[0], s = e[1] - i[1], o = n * n + s * s;
      if (this.shouldHandle_ = this.freehand_ ? o > this.squaredClickTolerance_ : o <= this.squaredClickTolerance_, !this.shouldHandle_)
        return;
    }
    if (!this.finishCoordinate_) {
      this.createOrUpdateSketchPoint_(t.coordinate.slice());
      return;
    }
    this.updateTrace_(t), this.modifyDrawing_(t.coordinate);
  }
  /**
   * Determine if an event is within the snapping tolerance of the start coord.
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @param {boolean} [tracing] Drawing in trace mode (only stop if at the starting point).
   * @return {boolean} The event is within the snapping tolerance of the start.
   * @private
   */
  atFinish_(t, e) {
    let i = !1;
    if (this.sketchFeature_) {
      let n = !1, s = [this.finishCoordinate_];
      const o = this.mode_;
      if (o === "Point")
        i = !0;
      else if (o === "Circle")
        i = this.sketchCoords_.length === 2;
      else if (o === "LineString")
        n = !e && this.sketchCoords_.length > this.minPoints_;
      else if (o === "Polygon") {
        const a = (
          /** @type {PolyCoordType} */
          this.sketchCoords_
        );
        n = a[0].length > this.minPoints_, s = [
          a[0][0],
          a[0][a[0].length - 2]
        ], e ? s = [a[0][0]] : s = [
          a[0][0],
          a[0][a[0].length - 2]
        ];
      }
      if (n) {
        const a = this.getMap();
        for (let l = 0, c = s.length; l < c; l++) {
          const h = s[l], u = a.getPixelFromCoordinate(h), d = t[0] - u[0], f = t[1] - u[1], g = this.freehand_ ? 1 : this.snapTolerance_;
          if (i = Math.sqrt(d * d + f * f) <= g, i) {
            this.finishCoordinate_ = h;
            break;
          }
        }
      }
    }
    return i;
  }
  /**
   * @param {import("../coordinate").Coordinate} coordinates Coordinate.
   * @private
   */
  createOrUpdateSketchPoint_(t) {
    this.sketchPoint_ ? this.sketchPoint_.getGeometry().setCoordinates(t) : (this.sketchPoint_ = new Ct(new Gt(t)), this.updateSketchFeatures_());
  }
  /**
   * @param {import("../geom/Polygon.js").default} geometry Polygon geometry.
   * @private
   */
  createOrUpdateCustomSketchLine_(t) {
    this.sketchLine_ || (this.sketchLine_ = new Ct());
    const e = t.getLinearRing(0);
    let i = this.sketchLine_.getGeometry();
    i ? (i.setFlatCoordinates(
      e.getLayout(),
      e.getFlatCoordinates()
    ), i.changed()) : (i = new bt(
      e.getFlatCoordinates(),
      e.getLayout()
    ), this.sketchLine_.setGeometry(i));
  }
  /**
   * Start the drawing.
   * @param {import("../coordinate.js").Coordinate} start Start coordinate.
   * @private
   */
  startDrawing_(t) {
    const e = this.getMap().getView().getProjection(), i = Rr(this.geometryLayout_);
    for (; t.length < i; )
      t.push(0);
    this.finishCoordinate_ = t, this.mode_ === "Point" ? this.sketchCoords_ = t.slice() : this.mode_ === "Polygon" ? (this.sketchCoords_ = [[t.slice(), t.slice()]], this.sketchLineCoords_ = this.sketchCoords_[0]) : this.sketchCoords_ = [t.slice(), t.slice()], this.sketchLineCoords_ && (this.sketchLine_ = new Ct(new bt(this.sketchLineCoords_)));
    const n = this.geometryFunction_(
      this.sketchCoords_,
      void 0,
      e
    );
    this.sketchFeature_ = new Ct(), this.geometryName_ && this.sketchFeature_.setGeometryName(this.geometryName_), this.sketchFeature_.setGeometry(n), this.updateSketchFeatures_(), this.dispatchEvent(
      new hr(lr.DRAWSTART, this.sketchFeature_)
    );
  }
  /**
   * Modify the drawing.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @private
   */
  modifyDrawing_(t) {
    const e = this.getMap(), i = this.sketchFeature_.getGeometry(), n = e.getView().getProjection(), s = Rr(this.geometryLayout_);
    let o, a;
    for (; t.length < s; )
      t.push(0);
    this.mode_ === "Point" ? a = this.sketchCoords_ : this.mode_ === "Polygon" ? (o = /** @type {PolyCoordType} */
    this.sketchCoords_[0], a = o[o.length - 1], this.atFinish_(e.getPixelFromCoordinate(t)) && (t = this.finishCoordinate_.slice())) : (o = this.sketchCoords_, a = o[o.length - 1]), a[0] = t[0], a[1] = t[1], this.geometryFunction_(
      /** @type {!LineCoordType} */
      this.sketchCoords_,
      i,
      n
    ), this.sketchPoint_ && this.sketchPoint_.getGeometry().setCoordinates(t), i.getType() === "Polygon" && this.mode_ !== "Polygon" ? this.createOrUpdateCustomSketchLine_(
      /** @type {Polygon} */
      i
    ) : this.sketchLineCoords_ && this.sketchLine_.getGeometry().setCoordinates(this.sketchLineCoords_), this.updateSketchFeatures_();
  }
  /**
   * Add a new coordinate to the drawing.
   * @param {!PointCoordType} coordinate Coordinate
   * @return {Feature<import("../geom/SimpleGeometry.js").default>} The sketch feature.
   * @private
   */
  addToDrawing_(t) {
    const e = this.sketchFeature_.getGeometry(), i = this.getMap().getView().getProjection();
    let n, s;
    const o = this.mode_;
    return o === "LineString" || o === "Circle" ? (this.finishCoordinate_ = t.slice(), s = /** @type {LineCoordType} */
    this.sketchCoords_, s.length >= this.maxPoints_ && (this.freehand_ ? s.pop() : n = !0), s.push(t.slice()), this.geometryFunction_(s, e, i)) : o === "Polygon" && (s = /** @type {PolyCoordType} */
    this.sketchCoords_[0], s.length >= this.maxPoints_ && (this.freehand_ ? s.pop() : n = !0), s.push(t.slice()), n && (this.finishCoordinate_ = s[0]), this.geometryFunction_(this.sketchCoords_, e, i)), this.createOrUpdateSketchPoint_(t.slice()), this.updateSketchFeatures_(), n ? this.finishDrawing() : this.sketchFeature_;
  }
  /**
   * @param {number} n The number of points to remove.
   */
  removeLastPoints_(t) {
    if (!this.sketchFeature_)
      return;
    const e = this.sketchFeature_.getGeometry(), i = this.getMap().getView().getProjection(), n = this.mode_;
    for (let s = 0; s < t; ++s) {
      let o;
      if (n === "LineString" || n === "Circle") {
        if (o = /** @type {LineCoordType} */
        this.sketchCoords_, o.splice(-2, 1), o.length >= 2) {
          this.finishCoordinate_ = o[o.length - 2].slice();
          const a = this.finishCoordinate_.slice();
          o[o.length - 1] = a, this.createOrUpdateSketchPoint_(a);
        }
        this.geometryFunction_(o, e, i), e.getType() === "Polygon" && this.sketchLine_ && this.createOrUpdateCustomSketchLine_(
          /** @type {Polygon} */
          e
        );
      } else if (n === "Polygon") {
        o = /** @type {PolyCoordType} */
        this.sketchCoords_[0], o.splice(-2, 1);
        const a = this.sketchLine_.getGeometry();
        if (o.length >= 2) {
          const l = o[o.length - 2].slice();
          o[o.length - 1] = l, this.createOrUpdateSketchPoint_(l);
        }
        a.setCoordinates(o), this.geometryFunction_(this.sketchCoords_, e, i);
      }
      if (o.length === 1) {
        this.abortDrawing();
        break;
      }
    }
    this.updateSketchFeatures_();
  }
  /**
   * Remove last point of the feature currently being drawn. Does not do anything when
   * drawing POINT or MULTI_POINT geometries.
   * @api
   */
  removeLastPoint() {
    this.removeLastPoints_(1);
  }
  /**
   * Stop drawing and add the sketch feature to the target layer.
   * The {@link module:ol/interaction/Draw~DrawEventType.DRAWEND} event is
   * dispatched before inserting the feature.
   * @return {Feature<import("../geom/SimpleGeometry.js").default>|null} The drawn feature.
   * @api
   */
  finishDrawing() {
    const t = this.abortDrawing_();
    if (!t)
      return null;
    let e = this.sketchCoords_;
    const i = t.getGeometry(), n = this.getMap().getView().getProjection();
    return this.mode_ === "LineString" ? (e.pop(), this.geometryFunction_(e, i, n)) : this.mode_ === "Polygon" && (e[0].pop(), this.geometryFunction_(e, i, n), e = i.getCoordinates()), this.type_ === "MultiPoint" ? t.setGeometry(
      new wi([
        /** @type {PointCoordType} */
        e
      ])
    ) : this.type_ === "MultiLineString" ? t.setGeometry(
      new se([
        /** @type {LineCoordType} */
        e
      ])
    ) : this.type_ === "MultiPolygon" && t.setGeometry(
      new ve([
        /** @type {PolyCoordType} */
        e
      ])
    ), this.dispatchEvent(new hr(lr.DRAWEND, t)), this.features_ && this.features_.push(t), this.source_ && this.source_.addFeature(t), t;
  }
  /**
   * Stop drawing without adding the sketch feature to the target layer.
   * @return {Feature<import("../geom/SimpleGeometry.js").default>|null} The sketch feature (or null if none).
   * @private
   */
  abortDrawing_() {
    this.finishCoordinate_ = null;
    const t = this.sketchFeature_;
    return this.sketchFeature_ = null, this.sketchPoint_ = null, this.sketchLine_ = null, this.overlay_.getSource().clear(!0), this.deactivateTrace_(), t;
  }
  /**
   * Stop drawing without adding the sketch feature to the target layer.
   * @api
   */
  abortDrawing() {
    const t = this.abortDrawing_();
    t && this.dispatchEvent(new hr(lr.DRAWABORT, t));
  }
  /**
   * Append coordinates to the end of the geometry that is currently being drawn.
   * This can be used when drawing LineStrings or Polygons. Coordinates will
   * either be appended to the current LineString or the outer ring of the current
   * Polygon. If no geometry is being drawn, a new one will be created.
   * @param {!LineCoordType} coordinates Linear coordinates to be appended to
   * the coordinate array.
   * @api
   */
  appendCoordinates(t) {
    const e = this.mode_, i = !this.sketchFeature_;
    i && this.startDrawing_(t[0]);
    let n;
    if (e === "LineString" || e === "Circle")
      n = /** @type {LineCoordType} */
      this.sketchCoords_;
    else if (e === "Polygon")
      n = this.sketchCoords_ && this.sketchCoords_.length ? (
        /** @type {PolyCoordType} */
        this.sketchCoords_[0]
      ) : [];
    else
      return;
    i && n.shift(), n.pop();
    for (let o = 0; o < t.length; o++)
      this.addToDrawing_(t[o]);
    const s = t[t.length - 1];
    this.sketchFeature_ = this.addToDrawing_(s), this.modifyDrawing_(s);
  }
  /**
   * Initiate draw mode by starting from an existing geometry which will
   * receive new additional points. This only works on features with
   * `LineString` geometries, where the interaction will extend lines by adding
   * points to the end of the coordinates array.
   * This will change the original feature, instead of drawing a copy.
   *
   * The function will dispatch a `drawstart` event.
   *
   * @param {!Feature<LineString>} feature Feature to be extended.
   * @api
   */
  extend(t) {
    const i = t.getGeometry();
    this.sketchFeature_ = t, this.sketchCoords_ = i.getCoordinates();
    const n = this.sketchCoords_[this.sketchCoords_.length - 1];
    this.finishCoordinate_ = n.slice(), this.sketchCoords_.push(n.slice()), this.sketchPoint_ = new Ct(new Gt(n)), this.updateSketchFeatures_(), this.dispatchEvent(
      new hr(lr.DRAWSTART, this.sketchFeature_)
    );
  }
  /**
   * Redraw the sketch features.
   * @private
   */
  updateSketchFeatures_() {
    const t = [];
    this.sketchFeature_ && t.push(this.sketchFeature_), this.sketchLine_ && t.push(this.sketchLine_), this.sketchPoint_ && t.push(this.sketchPoint_);
    const e = this.overlay_.getSource();
    e.clear(!0), e.addFeatures(t);
  }
  /**
   * @private
   */
  updateState_() {
    const t = this.getMap(), e = this.getActive();
    (!t || !e) && this.abortDrawing(), this.overlay_.setMap(e ? t : null);
  }
}
function Pm() {
  const r = ro();
  return function(t, e) {
    return r[t.getGeometry().getType()];
  };
}
function Mm(r) {
  switch (r) {
    case "Point":
    case "MultiPoint":
      return "Point";
    case "LineString":
    case "MultiLineString":
      return "LineString";
    case "Polygon":
    case "MultiPolygon":
      return "Polygon";
    case "Circle":
      return "Circle";
    default:
      throw new Error("Invalid type: " + r);
  }
}
const Rl = 0, Sn = 1, Il = [0, 0, 0, 0], Yi = [], Ts = {
  /**
   * Triggered upon feature modification start
   * @event ModifyEvent#modifystart
   * @api
   */
  MODIFYSTART: "modifystart",
  /**
   * Triggered upon feature modification end
   * @event ModifyEvent#modifyend
   * @api
   */
  MODIFYEND: "modifyend"
};
class Ps extends fe {
  /**
   * @param {ModifyEventType} type Type.
   * @param {Collection<Feature>} features
   * The features modified.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent
   * Associated {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   */
  constructor(t, e, i) {
    super(t), this.features = e, this.mapBrowserEvent = i;
  }
}
class Fm extends Vo {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.on, this.once, this.un, this.boundHandleFeatureChange_ = this.handleFeatureChange_.bind(this), this.condition_ = t.condition ? t.condition : xm, this.defaultDeleteCondition_ = function(i) {
      return Em(i) && Jh(i);
    }, this.deleteCondition_ = t.deleteCondition ? t.deleteCondition : this.defaultDeleteCondition_, this.insertVertexCondition_ = t.insertVertexCondition ? t.insertVertexCondition : Or, this.vertexFeature_ = null, this.vertexSegments_ = null, this.lastPixel_ = [0, 0], this.ignoreNextSingleClick_ = !1, this.featuresBeingModified_ = null, this.rBush_ = new zs(), this.pixelTolerance_ = t.pixelTolerance !== void 0 ? t.pixelTolerance : 10, this.snappedToVertex_ = !1, this.changingFeature_ = !1, this.dragSegments_ = [], this.overlay_ = new $i({
      source: new Wn({
        useSpatialIndex: !1,
        wrapX: !!t.wrapX
      }),
      style: t.style ? t.style : Am(),
      updateWhileAnimating: !0,
      updateWhileInteracting: !0
    }), this.SEGMENT_WRITERS_ = {
      Point: this.writePointGeometry_.bind(this),
      LineString: this.writeLineStringGeometry_.bind(this),
      LinearRing: this.writeLineStringGeometry_.bind(this),
      Polygon: this.writePolygonGeometry_.bind(this),
      MultiPoint: this.writeMultiPointGeometry_.bind(this),
      MultiLineString: this.writeMultiLineStringGeometry_.bind(this),
      MultiPolygon: this.writeMultiPolygonGeometry_.bind(this),
      Circle: this.writeCircleGeometry_.bind(this),
      GeometryCollection: this.writeGeometryCollectionGeometry_.bind(this)
    }, this.source_ = null, this.hitDetection_ = null;
    let e;
    if (t.features ? e = t.features : t.source && (this.source_ = t.source, e = new oi(this.source_.getFeatures()), this.source_.addEventListener(
      vt.ADDFEATURE,
      this.handleSourceAdd_.bind(this)
    ), this.source_.addEventListener(
      vt.REMOVEFEATURE,
      this.handleSourceRemove_.bind(this)
    )), !e)
      throw new Error(
        "The modify interaction requires features, a source or a layer"
      );
    t.hitDetection && (this.hitDetection_ = t.hitDetection), this.features_ = e, this.features_.forEach(this.addFeature_.bind(this)), this.features_.addEventListener(
      $t.ADD,
      this.handleFeatureAdd_.bind(this)
    ), this.features_.addEventListener(
      $t.REMOVE,
      this.handleFeatureRemove_.bind(this)
    ), this.lastPointerEvent_ = null, this.delta_ = [0, 0], this.snapToPointer_ = t.snapToPointer === void 0 ? !this.hitDetection_ : t.snapToPointer;
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  addFeature_(t) {
    const e = t.getGeometry();
    if (e) {
      const n = this.SEGMENT_WRITERS_[e.getType()];
      n && n(t, e);
    }
    const i = this.getMap();
    i && i.isRendered() && this.getActive() && this.handlePointerAtPixel_(i.getCoordinateFromPixel(this.lastPixel_)), t.addEventListener(Rt.CHANGE, this.boundHandleFeatureChange_);
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} evt Map browser event.
   * @param {Array<SegmentData>} segments The segments subject to modification.
   * @private
   */
  willModifyFeatures_(t, e) {
    if (!this.featuresBeingModified_) {
      this.featuresBeingModified_ = new oi();
      const i = this.featuresBeingModified_.getArray();
      for (let n = 0, s = e.length; n < s; ++n) {
        const o = e[n].feature;
        o && !i.includes(o) && this.featuresBeingModified_.push(o);
      }
      this.featuresBeingModified_.getLength() === 0 ? this.featuresBeingModified_ = null : this.dispatchEvent(
        new Ps(
          Ts.MODIFYSTART,
          this.featuresBeingModified_,
          t
        )
      );
    }
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  removeFeature_(t) {
    this.removeFeatureSegmentData_(t), this.vertexFeature_ && this.features_.getLength() === 0 && (this.overlay_.getSource().removeFeature(this.vertexFeature_), this.vertexFeature_ = null), t.removeEventListener(
      Rt.CHANGE,
      this.boundHandleFeatureChange_
    );
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  removeFeatureSegmentData_(t) {
    const e = this.rBush_, i = [];
    e.forEach(
      /**
       * @param {SegmentData} node RTree node.
       */
      function(n) {
        t === n.feature && i.push(n);
      }
    );
    for (let n = i.length - 1; n >= 0; --n) {
      const s = i[n];
      for (let o = this.dragSegments_.length - 1; o >= 0; --o)
        this.dragSegments_[o][0] === s && this.dragSegments_.splice(o, 1);
      e.remove(s);
    }
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   * @override
   */
  setActive(t) {
    this.vertexFeature_ && !t && (this.overlay_.getSource().removeFeature(this.vertexFeature_), this.vertexFeature_ = null), super.setActive(t);
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default} map Map.
   * @override
   */
  setMap(t) {
    this.overlay_.setMap(t), super.setMap(t);
  }
  /**
   * Get the overlay layer that this interaction renders the modification point or vertex to.
   * @return {VectorLayer} Overlay layer.
   * @api
   */
  getOverlay() {
    return this.overlay_;
  }
  /**
   * @param {import("../source/Vector.js").VectorSourceEvent} event Event.
   * @private
   */
  handleSourceAdd_(t) {
    t.feature && this.features_.push(t.feature);
  }
  /**
   * @param {import("../source/Vector.js").VectorSourceEvent} event Event.
   * @private
   */
  handleSourceRemove_(t) {
    t.feature && this.features_.remove(t.feature);
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  handleFeatureAdd_(t) {
    this.addFeature_(t.element);
  }
  /**
   * @param {import("../events/Event.js").default} evt Event.
   * @private
   */
  handleFeatureChange_(t) {
    if (!this.changingFeature_) {
      const e = (
        /** @type {Feature} */
        t.target
      );
      this.removeFeature_(e), this.addFeature_(e);
    }
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  handleFeatureRemove_(t) {
    this.removeFeature_(t.element);
  }
  /**
   * @param {Feature} feature Feature
   * @param {Point} geometry Geometry.
   * @private
   */
  writePointGeometry_(t, e) {
    const i = e.getCoordinates(), n = {
      feature: t,
      geometry: e,
      segment: [i, i]
    };
    this.rBush_.insert(e.getExtent(), n);
  }
  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/MultiPoint.js").default} geometry Geometry.
   * @private
   */
  writeMultiPointGeometry_(t, e) {
    const i = e.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n) {
      const o = i[n], a = {
        feature: t,
        geometry: e,
        depth: [n],
        index: n,
        segment: [o, o]
      };
      this.rBush_.insert(e.getExtent(), a);
    }
  }
  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/LineString.js").default} geometry Geometry.
   * @private
   */
  writeLineStringGeometry_(t, e) {
    const i = e.getCoordinates();
    for (let n = 0, s = i.length - 1; n < s; ++n) {
      const o = i.slice(n, n + 2), a = {
        feature: t,
        geometry: e,
        index: n,
        segment: o
      };
      this.rBush_.insert(Zt(o), a);
    }
  }
  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/MultiLineString.js").default} geometry Geometry.
   * @private
   */
  writeMultiLineStringGeometry_(t, e) {
    const i = e.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n) {
      const o = i[n];
      for (let a = 0, l = o.length - 1; a < l; ++a) {
        const c = o.slice(a, a + 2), h = {
          feature: t,
          geometry: e,
          depth: [n],
          index: a,
          segment: c
        };
        this.rBush_.insert(Zt(c), h);
      }
    }
  }
  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/Polygon.js").default} geometry Geometry.
   * @private
   */
  writePolygonGeometry_(t, e) {
    const i = e.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n) {
      const o = i[n];
      for (let a = 0, l = o.length - 1; a < l; ++a) {
        const c = o.slice(a, a + 2), h = {
          feature: t,
          geometry: e,
          depth: [n],
          index: a,
          segment: c
        };
        this.rBush_.insert(Zt(c), h);
      }
    }
  }
  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
   * @private
   */
  writeMultiPolygonGeometry_(t, e) {
    const i = e.getCoordinates();
    for (let n = 0, s = i.length; n < s; ++n) {
      const o = i[n];
      for (let a = 0, l = o.length; a < l; ++a) {
        const c = o[a];
        for (let h = 0, u = c.length - 1; h < u; ++h) {
          const d = c.slice(h, h + 2), f = {
            feature: t,
            geometry: e,
            depth: [a, n],
            index: h,
            segment: d
          };
          this.rBush_.insert(Zt(d), f);
        }
      }
    }
  }
  /**
   * We convert a circle into two segments.  The segment at index
   * {@link CIRCLE_CENTER_INDEX} is the
   * circle's center (a point).  The segment at index
   * {@link CIRCLE_CIRCUMFERENCE_INDEX} is
   * the circumference, and is not a line segment.
   *
   * @param {Feature} feature Feature.
   * @param {import("../geom/Circle.js").default} geometry Geometry.
   * @private
   */
  writeCircleGeometry_(t, e) {
    const i = e.getCenter(), n = {
      feature: t,
      geometry: e,
      index: Rl,
      segment: [i, i]
    }, s = {
      feature: t,
      geometry: e,
      index: Sn,
      segment: [i, i]
    }, o = [n, s];
    n.featureSegments = o, s.featureSegments = o, this.rBush_.insert(Cn(i), n);
    let a = (
      /** @type {import("../geom/Geometry.js").default} */
      e
    );
    this.rBush_.insert(a.getExtent(), s);
  }
  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
   * @private
   */
  writeGeometryCollectionGeometry_(t, e) {
    const i = e.getGeometriesArray();
    for (let n = 0; n < i.length; ++n) {
      const s = i[n], o = this.SEGMENT_WRITERS_[s.getType()];
      o(t, s);
    }
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {Array<Feature>} features The features being modified.
   * @param {Array<import("../geom/SimpleGeometry.js").default>} geometries The geometries being modified.
   * @param {boolean} existing The vertex represents an existing vertex.
   * @return {Feature} Vertex feature.
   * @private
   */
  createOrUpdateVertexFeature_(t, e, i, n) {
    let s = this.vertexFeature_;
    return s ? s.getGeometry().setCoordinates(t) : (s = new Ct(new Gt(t)), this.vertexFeature_ = s, this.overlay_.getSource().addFeature(s)), s.set("features", e), s.set("geometries", i), s.set("existing", n), s;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may modify the geometry.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    if (!t.originalEvent)
      return !0;
    this.lastPointerEvent_ = t;
    let e;
    return !t.map.getView().getInteracting() && t.type == wt.POINTERMOVE && !this.handlingDownUpSequence && this.handlePointerMove_(t), this.vertexFeature_ && this.deleteCondition_(t) && (t.type != wt.SINGLECLICK || !this.ignoreNextSingleClick_ ? e = this.removePoint() : e = !0), t.type == wt.SINGLECLICK && (this.ignoreNextSingleClick_ = !1), super.handleEvent(t) && !e;
  }
  findInsertVerticesAndUpdateDragSegments_(t) {
    this.handlePointerAtPixel_(t), this.dragSegments_.length = 0, this.featuresBeingModified_ = null;
    const e = this.vertexFeature_;
    if (!e)
      return;
    this.getMap().getView().getProjection();
    const i = [], n = e.getGeometry().getCoordinates(), s = Zt([n]), o = this.rBush_.getInExtent(s), a = {};
    o.sort(vm);
    for (let l = 0, c = o.length; l < c; ++l) {
      const h = o[l], u = h.segment;
      let d = nt(h.geometry);
      const f = h.depth;
      if (f && (d += "-" + f.join("-")), a[d] || (a[d] = new Array(2)), h.geometry.getType() === "Circle" && h.index === Sn) {
        const g = Pl(
          t,
          h
        );
        Pt(g, n) && !a[d][0] && (this.dragSegments_.push([h, 0]), a[d][0] = h);
        continue;
      }
      if (Pt(u[0], n) && !a[d][0]) {
        this.dragSegments_.push([h, 0]), a[d][0] = h;
        continue;
      }
      if (Pt(u[1], n) && !a[d][1]) {
        if (a[d][0] && a[d][0].index === 0) {
          let g = h.geometry.getCoordinates();
          switch (h.geometry.getType()) {
            case "LineString":
            case "MultiLineString":
              continue;
            case "MultiPolygon":
              g = g[f[1]];
            case "Polygon":
              if (h.index !== g[f[0]].length - 2)
                continue;
              break;
          }
        }
        this.dragSegments_.push([h, 1]), a[d][1] = h;
        continue;
      }
      nt(u) in this.vertexSegments_ && !a[d][0] && !a[d][1] && i.push(h);
    }
    return i;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} evt Event.
   * @override
   */
  handleDragEvent(t) {
    this.ignoreNextSingleClick_ = !1, this.willModifyFeatures_(
      t,
      this.dragSegments_.map(([s]) => s)
    );
    const e = [
      t.coordinate[0] + this.delta_[0],
      t.coordinate[1] + this.delta_[1]
    ], i = [], n = [];
    for (let s = 0, o = this.dragSegments_.length; s < o; ++s) {
      const a = this.dragSegments_[s], l = a[0], c = l.feature;
      i.includes(c) || i.push(c);
      const h = l.geometry;
      n.includes(h) || n.push(h);
      const u = l.depth;
      let d;
      const f = l.segment, g = a[1];
      for (; e.length < h.getStride(); )
        e.push(f[g][e.length]);
      switch (h.getType()) {
        case "Point":
          d = e, f[0] = e, f[1] = e;
          break;
        case "MultiPoint":
          d = h.getCoordinates(), d[l.index] = e, f[0] = e, f[1] = e;
          break;
        case "LineString":
          d = h.getCoordinates(), d[l.index + g] = e, f[g] = e;
          break;
        case "MultiLineString":
          d = h.getCoordinates(), d[u[0]][l.index + g] = e, f[g] = e;
          break;
        case "Polygon":
          d = h.getCoordinates(), d[u[0]][l.index + g] = e, f[g] = e;
          break;
        case "MultiPolygon":
          d = h.getCoordinates(), d[u[1]][u[0]][l.index + g] = e, f[g] = e;
          break;
        case "Circle":
          const m = (
            /** @type {import("../geom/Circle.js").default} */
            h
          );
          if (f[0] = e, f[1] = e, l.index === Rl)
            this.changingFeature_ = !0, m.setCenter(e), this.changingFeature_ = !1;
          else {
            this.changingFeature_ = !0, t.map.getView().getProjection();
            let _ = wr(
              lt(m.getCenter()),
              lt(e)
            );
            m.setRadius(_), this.changingFeature_ = !1;
          }
          break;
      }
      d && this.setGeometryCoordinates_(h, d);
    }
    this.createOrUpdateVertexFeature_(e, i, n, !0);
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} evt Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (!this.condition_(t))
      return !1;
    const e = t.coordinate, i = this.findInsertVerticesAndUpdateDragSegments_(e);
    if (i != null && i.length && this.insertVertexCondition_(t) && (this.willModifyFeatures_(t, i), this.vertexFeature_)) {
      const n = this.vertexFeature_.getGeometry().getCoordinates();
      for (let s = i.length - 1; s >= 0; --s)
        this.insertVertex_(i[s], n);
      this.ignoreNextSingleClick_ = !0;
    }
    return !!this.vertexFeature_;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} evt Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    for (let e = this.dragSegments_.length - 1; e >= 0; --e) {
      const i = this.dragSegments_[e][0], n = i.geometry;
      if (n.getType() === "Circle") {
        const s = (
          /** @type {import("../geom/Circle.js").default} */
          n
        ), o = s.getCenter(), a = i.featureSegments[0], l = i.featureSegments[1];
        a.segment[0] = o, a.segment[1] = o, l.segment[0] = o, l.segment[1] = o, this.rBush_.update(Cn(o), a);
        let c = s;
        this.rBush_.update(
          c.getExtent(),
          l
        );
      } else
        this.rBush_.update(Zt(i.segment), i);
    }
    return this.featuresBeingModified_ && (this.dispatchEvent(
      new Ps(
        Ts.MODIFYEND,
        this.featuresBeingModified_,
        t
      )
    ), this.featuresBeingModified_ = null), !1;
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} evt Event.
   * @private
   */
  handlePointerMove_(t) {
    this.lastPixel_ = t.pixel, this.handlePointerAtPixel_(t.coordinate);
  }
  /**
   * @param {import("../coordinate.js").Coordinate} pixelCoordinate The pixel Coordinate.
   * @private
   */
  handlePointerAtPixel_(t) {
    const e = this.getMap(), i = e.getPixelFromCoordinate(t);
    e.getView().getProjection();
    const n = function(a, l) {
      return Tl(t, a) - Tl(t, l);
    };
    let s, o;
    if (this.hitDetection_) {
      const a = typeof this.hitDetection_ == "object" ? (l) => l === this.hitDetection_ : void 0;
      e.forEachFeatureAtPixel(
        i,
        (l, c, h) => {
          h && h.getType() === "Point" && (h = new Gt(
            Vi(h.getCoordinates())
          ));
          const u = h || l.getGeometry();
          if (u && u.getType() === "Point" && l instanceof Ct && this.features_.getArray().includes(l)) {
            o = /** @type {Point} */
            u;
            const d = (
              /** @type {Point} */
              l.getGeometry().getFlatCoordinates().slice(0, 2)
            );
            s = [
              {
                feature: l,
                geometry: o,
                segment: [d, d]
              }
            ];
          }
          return !0;
        },
        { layerFilter: a }
      );
    }
    if (!s) {
      const a = ii(
        Cn(t, Il)
      ), l = e.getView().getResolution() * this.pixelTolerance_, c = Br(
        Dr(a, l, Il)
      );
      s = this.rBush_.getInExtent(c);
    }
    if (s && s.length > 0) {
      const a = s.sort(n)[0], l = a.segment;
      let c = Pl(t, a);
      const h = e.getPixelFromCoordinate(c);
      let u = wr(i, h);
      if (o || u <= this.pixelTolerance_) {
        const d = {};
        if (d[nt(l)] = !0, this.snapToPointer_ || (this.delta_[0] = c[0] - t[0], this.delta_[1] = c[1] - t[1]), a.geometry.getType() === "Circle" && a.index === Sn)
          this.snappedToVertex_ = !0, this.createOrUpdateVertexFeature_(
            c,
            [a.feature],
            [a.geometry],
            this.snappedToVertex_
          );
        else {
          const f = e.getPixelFromCoordinate(l[0]), g = e.getPixelFromCoordinate(l[1]), m = zi(h, f), _ = zi(h, g);
          if (u = Math.sqrt(Math.min(m, _)), this.snappedToVertex_ = u <= this.pixelTolerance_, !this.snappedToVertex_ && !this.insertVertexCondition_(this.lastPointerEvent_)) {
            this.vertexFeature_ && (this.overlay_.getSource().removeFeature(this.vertexFeature_), this.vertexFeature_ = null);
            return;
          }
          this.snappedToVertex_ && (c = m > _ ? l[1] : l[0]), this.createOrUpdateVertexFeature_(
            c,
            [a.feature],
            [a.geometry],
            this.snappedToVertex_
          );
          const p = {};
          p[nt(a.geometry)] = !0;
          for (let y = 1, S = s.length; y < S; ++y) {
            const C = s[y].segment;
            if (Pt(l[0], C[0]) && Pt(l[1], C[1]) || Pt(l[0], C[1]) && Pt(l[1], C[0])) {
              const R = nt(s[y].geometry);
              R in p || (p[R] = !0, d[nt(C)] = !0);
            } else
              break;
          }
        }
        this.vertexSegments_ = d;
        return;
      }
    }
    this.vertexFeature_ && (this.overlay_.getSource().removeFeature(this.vertexFeature_), this.vertexFeature_ = null);
  }
  /**
   * @param {SegmentData} segmentData Segment data.
   * @param {import("../coordinate.js").Coordinate} vertex Vertex.
   * @return {boolean} A vertex was inserted.
   * @private
   */
  insertVertex_(t, e) {
    const i = t.segment, n = t.feature, s = t.geometry, o = t.depth, a = t.index;
    let l;
    for (; e.length < s.getStride(); )
      e.push(0);
    switch (s.getType()) {
      case "MultiLineString":
        l = s.getCoordinates(), l[o[0]].splice(a + 1, 0, e);
        break;
      case "Polygon":
        l = s.getCoordinates(), l[o[0]].splice(a + 1, 0, e);
        break;
      case "MultiPolygon":
        l = s.getCoordinates(), l[o[1]][o[0]].splice(a + 1, 0, e);
        break;
      case "LineString":
        l = s.getCoordinates(), l.splice(a + 1, 0, e);
        break;
      default:
        return !1;
    }
    this.setGeometryCoordinates_(s, l);
    const c = this.rBush_;
    c.remove(t), this.updateSegmentIndices_(s, a, o, 1);
    const h = {
      segment: [i[0], e],
      feature: n,
      geometry: s,
      depth: o,
      index: a
    };
    c.insert(Zt(h.segment), h), this.dragSegments_.push([h, 1]);
    const u = {
      segment: [e, i[1]],
      feature: n,
      geometry: s,
      depth: o,
      index: a + 1
    };
    return c.insert(Zt(u.segment), u), this.dragSegments_.push([u, 0]), !0;
  }
  updatePointer_(t) {
    var e;
    return t && this.findInsertVerticesAndUpdateDragSegments_(t), (e = this.vertexFeature_) == null ? void 0 : e.getGeometry().getCoordinates();
  }
  /**
   * Get the current pointer position.
   * @return {import("../coordinate.js").Coordinate | null} The current pointer coordinate.
   */
  getPoint() {
    var e;
    const t = (e = this.vertexFeature_) == null ? void 0 : e.getGeometry().getCoordinates();
    return t ? Vi(
      t,
      this.getMap().getView().getProjection()
    ) : null;
  }
  /**
   * Check if a point can be removed from the current linestring or polygon at the current
   * pointer position.
   * @return {boolean} A point can be deleted at the current pointer position.
   * @api
   */
  canRemovePoint() {
    if (!this.vertexFeature_ || this.vertexFeature_.get("geometries").every(
      (i) => i.getType() === "Circle" || i.getType().endsWith("Point")
    ))
      return !1;
    const t = this.vertexFeature_.getGeometry().getCoordinates();
    return this.rBush_.getInExtent(Zt([t])).some(
      ({ segment: i }) => Pt(i[0], t) || Pt(i[1], t)
    );
  }
  /**
   * Removes the vertex currently being pointed from the current linestring or polygon.
   * @param {import('../coordinate.js').Coordinate} [coordinate] If provided, the pointer
   * will be set to the provided coordinate. If not, the current pointer coordinate will be used.
   * @return {boolean} True when a vertex was removed.
   * @api
   */
  removePoint(t) {
    if (t && (t = lt(
      t,
      this.getMap().getView().getProjection()
    ), this.updatePointer_(t)), !this.lastPointerEvent_ || this.lastPointerEvent_ && this.lastPointerEvent_.type != wt.POINTERDRAG) {
      const e = this.lastPointerEvent_;
      this.willModifyFeatures_(
        e,
        this.dragSegments_.map(([n]) => n)
      );
      const i = this.removeVertex_();
      return this.featuresBeingModified_ && this.dispatchEvent(
        new Ps(
          Ts.MODIFYEND,
          this.featuresBeingModified_,
          e
        )
      ), this.featuresBeingModified_ = null, i;
    }
    return !1;
  }
  /**
   * Removes a vertex from all matching features.
   * @return {boolean} True when a vertex was removed.
   * @private
   */
  removeVertex_() {
    const t = this.dragSegments_, e = {};
    let i = !1, n, s, o, a, l, c, h, u, d, f, g;
    for (l = t.length - 1; l >= 0; --l)
      o = t[l], f = o[0], g = nt(f.feature), f.depth && (g += "-" + f.depth.join("-")), g in e || (e[g] = {}), o[1] === 0 ? (e[g].right = f, e[g].index = f.index) : o[1] == 1 && (e[g].left = f, e[g].index = f.index + 1);
    for (g in e) {
      switch (d = e[g].right, h = e[g].left, c = e[g].index, u = c - 1, h !== void 0 ? f = h : f = d, u < 0 && (u = 0), a = f.geometry, s = a.getCoordinates(), n = s, i = !1, a.getType()) {
        case "MultiLineString":
          s[f.depth[0]].length > 2 && (s[f.depth[0]].splice(c, 1), i = !0);
          break;
        case "LineString":
          s.length > 2 && (s.splice(c, 1), i = !0);
          break;
        case "MultiPolygon":
          n = n[f.depth[1]];
        case "Polygon":
          n = n[f.depth[0]], n.length > 4 && (c == n.length - 1 && (c = 0), n.splice(c, 1), i = !0, c === 0 && (n.pop(), n.push(n[0]), u = n.length - 1));
          break;
      }
      if (i) {
        this.setGeometryCoordinates_(a, s);
        const m = [];
        if (h !== void 0 && (this.rBush_.remove(h), m.push(h.segment[0])), d !== void 0 && (this.rBush_.remove(d), m.push(d.segment[1])), h !== void 0 && d !== void 0) {
          const _ = {
            depth: f.depth,
            feature: f.feature,
            geometry: f.geometry,
            index: u,
            segment: m
          };
          this.rBush_.insert(
            Zt(_.segment),
            _
          );
        }
        this.updateSegmentIndices_(a, c, f.depth, -1), this.vertexFeature_ && (this.overlay_.getSource().removeFeature(this.vertexFeature_), this.vertexFeature_ = null), t.length = 0;
      }
    }
    return i;
  }
  /**
   * Check if a point can be inserted to the current linestring or polygon at the current
   * pointer position.
   * @return {boolean} A point can be inserted at the current pointer position.
   * @api
   */
  canInsertPoint() {
    if (!this.vertexFeature_ || this.vertexFeature_.get("geometries").every(
      (i) => i.getType() === "Circle" || i.getType().endsWith("Point")
    ))
      return !1;
    const t = this.vertexFeature_.getGeometry().getCoordinates();
    return this.rBush_.getInExtent(Zt([t])).some(
      ({ segment: i }) => !(Pt(i[0], t) || Pt(i[1], t))
    );
  }
  /**
   * Inserts the vertex currently being pointed to the current linestring or polygon.
   * @param {import('../coordinate.js').Coordinate} [coordinate] If provided, the pointer
   * will be set to the provided coordinate. If not, the current pointer coordinate will be used.
   * @return {boolean} A vertex was inserted.
   * @api
   */
  insertPoint(t) {
    var n;
    const e = t ? lt(t, this.getMap().getView().getProjection()) : (n = this.vertexFeature_) == null ? void 0 : n.getGeometry().getCoordinates();
    return e ? this.findInsertVerticesAndUpdateDragSegments_(e).reduce(
      (s, o) => s || this.insertVertex_(o, e),
      !1
    ) : !1;
  }
  /**
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {Array} coordinates Coordinates.
   * @private
   */
  setGeometryCoordinates_(t, e) {
    this.changingFeature_ = !0, t.setCoordinates(e), this.changingFeature_ = !1;
  }
  /**
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {number} index Index.
   * @param {Array<number>|undefined} depth Depth.
   * @param {number} delta Delta (1 or -1).
   * @private
   */
  updateSegmentIndices_(t, e, i, n) {
    this.rBush_.forEachInExtent(
      t.getExtent(),
      function(s) {
        s.geometry === t && (i === void 0 || s.depth === void 0 || gi(s.depth, i)) && s.index > e && (s.index += n);
      }
    );
  }
}
function vm(r, t) {
  return r.index - t.index;
}
function Tl(r, t, e) {
  const i = t.geometry;
  if (i.getType() === "Circle") {
    let s = (
      /** @type {import("../geom/Circle.js").default} */
      i
    );
    if (t.index === Sn) {
      const o = zi(
        s.getCenter(),
        lt(r)
      ), a = Math.sqrt(o) - s.getRadius();
      return a * a;
    }
  }
  const n = lt(r);
  return Yi[0] = lt(t.segment[0]), Yi[1] = lt(t.segment[1]), lu(n, Yi);
}
function Pl(r, t, e) {
  const i = t.geometry;
  if (i.getType() === "Circle" && t.index === Sn)
    return Vi(
      /** @type {import("../geom/Circle.js").default} */
      i.getClosestPoint(
        lt(r)
      )
    );
  const n = lt(r);
  return Yi[0] = lt(t.segment[0]), Yi[1] = lt(t.segment[1]), Vi(
    Kl(n, Yi)
  );
}
function Am() {
  const r = ro();
  return function(t, e) {
    return r.Point;
  };
}
const Lm = {
  /**
   * Triggered when feature(s) has been (de)selected.
   * @event SelectEvent#select
   * @api
   */
  SELECT: "select"
};
class Om extends fe {
  /**
   * @param {SelectEventType} type The event type.
   * @param {Array<import("../Feature.js").default>} selected Selected features.
   * @param {Array<import("../Feature.js").default>} deselected Deselected features.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Associated
   *     {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   */
  constructor(t, e, i, n) {
    super(t), this.selected = e, this.deselected = i, this.mapBrowserEvent = n;
  }
}
const fr = {};
class jo extends tc {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t || {}, this.boundAddFeature_ = this.addFeature_.bind(this), this.boundRemoveFeature_ = this.removeFeature_.bind(this), this.condition_ = t.condition ? t.condition : Jh, this.addCondition_ = t.addCondition ? t.addCondition : qs, this.removeCondition_ = t.removeCondition ? t.removeCondition : qs, this.toggleCondition_ = t.toggleCondition ? t.toggleCondition : Qh, this.multi_ = t.multi ? t.multi : !1, this.filter_ = t.filter ? t.filter : hi, this.hitTolerance_ = t.hitTolerance ? t.hitTolerance : 0, this.style_ = t.style !== void 0 ? t.style : bm(), this.features_ = t.features || new oi();
    let e;
    if (t.layers)
      if (typeof t.layers == "function")
        e = t.layers;
      else {
        const i = t.layers;
        e = function(n) {
          return i.includes(n);
        };
      }
    else
      e = hi;
    this.layerFilter_ = e, this.featureLayerAssociation_ = {};
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("../layer/Layer.js").default} layer Layer.
   * @private
   */
  addFeatureLayerAssociation_(t, e) {
    this.featureLayerAssociation_[nt(t)] = e;
  }
  /**
   * Get the selected features.
   * @return {Collection<Feature>} Features collection.
   * @api
   */
  getFeatures() {
    return this.features_;
  }
  /**
   * Returns the Hit-detection tolerance.
   * @return {number} Hit tolerance in pixels.
   * @api
   */
  getHitTolerance() {
    return this.hitTolerance_;
  }
  /**
   * Returns the associated {@link module:ol/layer/Vector~VectorLayer vector layer} of
   * a selected feature.
   * @param {import("../Feature.js").default} feature Feature
   * @return {import('../layer/Vector.js').default} Layer.
   * @api
   */
  getLayer(t) {
    return (
      /** @type {import('../layer/Vector.js').default} */
      this.featureLayerAssociation_[nt(t)]
    );
  }
  /**
   * Hit-detection tolerance. Pixels inside the radius around the given position
   * will be checked for features.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @api
   */
  setHitTolerance(t) {
    this.hitTolerance_ = t;
  }
  /**
   * Remove the interaction from its current map, if any,  and attach it to a new
   * map, if any. Pass `null` to just remove the interaction from the current map.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   * @override
   */
  setMap(t) {
    this.getMap() && this.style_ && this.features_.forEach(this.restorePreviousStyle_.bind(this)), super.setMap(t), t ? (this.features_.addEventListener(
      $t.ADD,
      this.boundAddFeature_
    ), this.features_.addEventListener(
      $t.REMOVE,
      this.boundRemoveFeature_
    ), this.style_ && this.features_.forEach(this.applySelectedStyle_.bind(this))) : (this.features_.removeEventListener(
      $t.ADD,
      this.boundAddFeature_
    ), this.features_.removeEventListener(
      $t.REMOVE,
      this.boundRemoveFeature_
    ));
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  addFeature_(t) {
    const e = t.element;
    if (this.style_ && this.applySelectedStyle_(e), !this.getLayer(e)) {
      const i = (
        /** @type {VectorLayer} */
        this.getMap().getAllLayers().find(function(n) {
          if (n instanceof $i && n.getSource() && n.getSource().hasFeature(e))
            return n;
        })
      );
      i && this.addFeatureLayerAssociation_(e, i);
    }
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  removeFeature_(t) {
    this.style_ && this.restorePreviousStyle_(t.element);
  }
  /**
   * @return {import("../style/Style.js").StyleLike|null} Select style.
   */
  getStyle() {
    return this.style_;
  }
  /**
   * @param {Feature} feature Feature
   * @private
   */
  applySelectedStyle_(t) {
    const e = nt(t);
    e in fr || (fr[e] = t.getStyle()), t.setStyle(this.style_);
  }
  /**
   * @param {Feature} feature Feature
   * @private
   */
  restorePreviousStyle_(t) {
    const e = this.getMap().getInteractions().getArray();
    for (let n = e.length - 1; n >= 0; --n) {
      const s = e[n];
      if (s !== this && s instanceof jo && s.getStyle() && s.getFeatures().getArray().lastIndexOf(t) !== -1) {
        t.setStyle(s.getStyle());
        return;
      }
    }
    const i = nt(t);
    t.setStyle(fr[i]), delete fr[i];
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  removeFeatureLayerAssociation_(t) {
    delete this.featureLayerAssociation_[nt(t)];
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may change the
   * selected state of features.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    if (!this.condition_(t))
      return !0;
    const e = this.addCondition_(t), i = this.removeCondition_(t), n = this.toggleCondition_(t), s = !e && !i && !n, o = t.map, a = this.getFeatures(), l = [], c = [];
    if (s) {
      Nr(this.featureLayerAssociation_), o.forEachFeatureAtPixel(
        t.pixel,
        /**
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         * @param {import("../layer/Layer.js").default} layer Layer.
         * @return {boolean|undefined} Continue to iterate over the features.
         */
        (h, u) => {
          if (!(!(h instanceof Ct) || !this.filter_(h, u)))
            return this.addFeatureLayerAssociation_(h, u), c.push(h), !this.multi_;
        },
        {
          layerFilter: this.layerFilter_,
          hitTolerance: this.hitTolerance_
        }
      );
      for (let h = a.getLength() - 1; h >= 0; --h) {
        const u = a.item(h), d = c.indexOf(u);
        d > -1 ? c.splice(d, 1) : (a.remove(u), l.push(u));
      }
      c.length !== 0 && a.extend(c);
    } else {
      o.forEachFeatureAtPixel(
        t.pixel,
        /**
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         * @param {import("../layer/Layer.js").default} layer Layer.
         * @return {boolean|undefined} Continue to iterate over the features.
         */
        (h, u) => {
          if (!(!(h instanceof Ct) || !this.filter_(h, u)))
            return (e || n) && !a.getArray().includes(h) ? (this.addFeatureLayerAssociation_(h, u), c.push(h)) : (i || n) && a.getArray().includes(h) && (l.push(h), this.removeFeatureLayerAssociation_(h)), !this.multi_;
        },
        {
          layerFilter: this.layerFilter_,
          hitTolerance: this.hitTolerance_
        }
      );
      for (let h = l.length - 1; h >= 0; --h)
        a.remove(l[h]);
      a.extend(c);
    }
    return (c.length > 0 || l.length > 0) && this.dispatchEvent(
      new Om(
        Lm.SELECT,
        c,
        l,
        t
      )
    ), !0;
  }
}
function bm() {
  const r = ro();
  return It(r.Polygon, r.LineString), It(r.GeometryCollection, r.LineString), function(t) {
    return t.getGeometry() ? r[t.getGeometry().getType()] : null;
  };
}
const Ms = {
  /**
   * Triggered upon feature translation start.
   * @event TranslateEvent#translatestart
   * @api
   */
  TRANSLATESTART: "translatestart",
  /**
   * Triggered upon feature translation.
   * @event TranslateEvent#translating
   * @api
   */
  TRANSLATING: "translating",
  /**
   * Triggered upon feature translation end.
   * @event TranslateEvent#translateend
   * @api
   */
  TRANSLATEEND: "translateend"
};
class Fs extends fe {
  /**
   * @param {TranslateEventType} type Type.
   * @param {Collection<Feature>} features The features translated.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../coordinate.js").Coordinate} startCoordinate The original coordinates before.translation started
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   */
  constructor(t, e, i, n, s) {
    super(t), this.features = e, this.coordinate = i, this.startCoordinate = n, this.mapBrowserEvent = s;
  }
}
class Nm extends Vo {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.on, this.once, this.un, this.lastCoordinate_ = null, this.startCoordinate_ = null, this.features_ = t.features !== void 0 ? t.features : null;
    let e;
    if (t.layers && !this.features_)
      if (typeof t.layers == "function")
        e = t.layers;
      else {
        const i = t.layers;
        e = function(n) {
          return i.includes(n);
        };
      }
    else
      e = hi;
    this.layerFilter_ = e, this.filter_ = t.filter && !this.features_ ? t.filter : hi, this.hitTolerance_ = t.hitTolerance ? t.hitTolerance : 0, this.condition_ = t.condition ? t.condition : Or, this.lastFeature_ = null, this.addChangeListener(
      br.ACTIVE,
      this.handleActiveChanged_
    );
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (!t.originalEvent || !this.condition_(t))
      return !1;
    if (this.lastFeature_ = this.featuresAtPixel_(t.pixel, t.map), !this.lastCoordinate_ && this.lastFeature_) {
      this.startCoordinate_ = t.coordinate, this.lastCoordinate_ = t.coordinate, this.handleMoveEvent(t);
      const e = this.features_ || new oi([this.lastFeature_]);
      return this.dispatchEvent(
        new Fs(
          Ms.TRANSLATESTART,
          e,
          t.coordinate,
          this.startCoordinate_,
          t
        )
      ), !0;
    }
    return !1;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (this.lastCoordinate_) {
      this.lastCoordinate_ = null, this.handleMoveEvent(t);
      const e = this.features_ || new oi([this.lastFeature_]);
      return this.dispatchEvent(
        new Fs(
          Ms.TRANSLATEEND,
          e,
          t.coordinate,
          this.startCoordinate_,
          t
        )
      ), this.startCoordinate_ = null, !0;
    }
    return !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @override
   */
  handleDragEvent(t) {
    if (this.lastCoordinate_) {
      const e = t.coordinate;
      t.map.getView().getProjection();
      const i = lt(e), n = lt(
        this.lastCoordinate_
      ), s = i[0] - n[0], o = i[1] - n[1], a = this.features_ || new oi([this.lastFeature_]);
      a.forEach(function(l) {
        const c = l.getGeometry();
        c.translate(s, o), l.setGeometry(c);
      }), this.lastCoordinate_ = e, this.dispatchEvent(
        new Fs(
          Ms.TRANSLATING,
          a,
          e,
          this.startCoordinate_,
          t
        )
      );
    }
  }
  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @override
   */
  handleMoveEvent(t) {
    const e = t.map.getViewport();
    this.featuresAtPixel_(t.pixel, t.map) ? (e.classList.remove(this.lastCoordinate_ ? "ol-grab" : "ol-grabbing"), e.classList.add(this.lastCoordinate_ ? "ol-grabbing" : "ol-grab")) : e.classList.remove("ol-grab", "ol-grabbing");
  }
  /**
   * Tests to see if the given coordinates intersects any of our selected
   * features.
   * @param {import("../pixel.js").Pixel} pixel Pixel coordinate to test for intersection.
   * @param {import("../Map.js").default} map Map to test the intersection on.
   * @return {Feature} Returns the feature found at the specified pixel
   * coordinates.
   * @private
   */
  featuresAtPixel_(t, e) {
    return e.forEachFeatureAtPixel(
      t,
      (i, n) => {
        if (!(!(i instanceof Ct) || !this.filter_(i, n)) && !(this.features_ && !this.features_.getArray().includes(i)))
          return i;
      },
      {
        layerFilter: this.layerFilter_,
        hitTolerance: this.hitTolerance_
      }
    );
  }
  /**
   * Returns the Hit-detection tolerance.
   * @return {number} Hit tolerance in pixels.
   * @api
   */
  getHitTolerance() {
    return this.hitTolerance_;
  }
  /**
   * Hit-detection tolerance. Pixels inside the radius around the given position
   * will be checked for features.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @api
   */
  setHitTolerance(t) {
    this.hitTolerance_ = t;
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default} map Map.
   * @override
   */
  setMap(t) {
    const e = this.getMap();
    super.setMap(t), this.updateState_(e);
  }
  /**
   * @private
   */
  handleActiveChanged_() {
    this.updateState_(null);
  }
  /**
   * @param {import("../Map.js").default} oldMap Old map.
   * @private
   */
  updateState_(t) {
    let e = this.getMap();
    const i = this.getActive();
    (!e || !i) && (e = e || t, e && e.getViewport().classList.remove("ol-grab", "ol-grabbing"));
  }
}
class Km extends Ae {
  /**
   * Creates a new SketchManager instance
   */
  constructor(t) {
    var e, i, n, s, o, a, l, c, h, u, d, f, g, m, _;
    if (super(), this.currentMode = null, this.undoStack = [], this.drawInteraction = null, this.boundHandlers = new globalThis.Map(), this.eventManager = new On(), !t.map)
      throw new Error("SketchManager requires a map instance");
    if (!t.source)
      throw new Error("SketchManager requires a vector source");
    this.map = t.map, this.source = t.source, this.layerFilter = t.layerFilter, this.enableUndo = t.enableUndo ?? !0, this.maxUndoStackSize = t.maxUndoStackSize ?? 50, this.buttons = {
      back: ((e = t.buttons) == null ? void 0 : e.back) ?? null,
      drawPoint: ((i = t.buttons) == null ? void 0 : i.drawPoint) ?? null,
      drawLine: ((n = t.buttons) == null ? void 0 : n.drawLine) ?? null,
      drawPolygon: ((s = t.buttons) == null ? void 0 : s.drawPolygon) ?? null,
      drawCircle: ((o = t.buttons) == null ? void 0 : o.drawCircle) ?? null,
      modify: ((a = t.buttons) == null ? void 0 : a.modify) ?? null,
      select: ((l = t.buttons) == null ? void 0 : l.select) ?? null,
      delete: ((c = t.buttons) == null ? void 0 : c.delete) ?? null,
      undo: ((h = t.buttons) == null ? void 0 : h.undo) ?? null
    }, this.callbacks = {
      onBack: ((u = t.callbacks) == null ? void 0 : u.onBack) ?? (() => {
      }),
      onFeatureAdded: ((d = t.callbacks) == null ? void 0 : d.onFeatureAdded) ?? (() => {
      }),
      onFeatureModified: ((f = t.callbacks) == null ? void 0 : f.onFeatureModified) ?? (() => {
      }),
      onFeatureDeleted: ((g = t.callbacks) == null ? void 0 : g.onFeatureDeleted) ?? (() => {
      }),
      onActiveChange: ((m = t.callbacks) == null ? void 0 : m.onActiveChange) ?? (() => {
      }),
      onModeChange: ((_ = t.callbacks) == null ? void 0 : _.onModeChange) ?? (() => {
      })
    }, this.initializeInteractions(), t.autoBindUI !== !1 && this.bindUIElements(), this.setActive(!1);
  }
  /**
   * Initialize all OpenLayers interactions
   */
  initializeInteractions() {
    this.modifyInteraction = new Fm({
      source: this.source
    }), this.modifyInteraction.setActive(!1), this.map.addInteraction(this.modifyInteraction), this.selectInteraction = new jo({
      condition: Cm,
      layers: this.layerFilter ? this.layerFilter : void 0
    }), this.selectInteraction.setActive(!1), this.map.addInteraction(this.selectInteraction), this.translateInteraction = new Nm({
      features: this.selectInteraction.getFeatures()
    }), this.translateInteraction.setActive(!1), this.map.addInteraction(this.translateInteraction), this.setupEventListeners();
  }
  /**
   * Set up event listeners for interactions
   * Notify callbacks and emit events when features are modified or moved
   */
  setupEventListeners() {
    this.modifyInteraction.on("modifyend", (t) => {
      t.features.getArray().forEach((i) => {
        this.callbacks.onFeatureModified(i), this.eventManager.emit("featuremodified", {
          type: "featuremodified",
          feature: i
        });
      });
    }), this.translateInteraction.on("translateend", (t) => {
      t.features.forEach((e) => {
        this.callbacks.onFeatureModified(e), this.eventManager.emit("featuremodified", {
          type: "featuremodified",
          feature: e
        });
      });
    });
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
    ].forEach(([e, i]) => {
      const n = this.buttons[e];
      n && this.bindElement(n, i);
    });
  }
  /**
   * Bind a single element to a handler
   */
  bindElement(t, e) {
    document.querySelectorAll(t).forEach((n) => {
      const s = e.bind(this);
      n.addEventListener("click", s), this.boundHandlers.set(`${t}:${e.name}`, s);
    });
  }
  /**
   * Unbind all UI elements
   */
  unbindUIElements() {
    this.boundHandlers.forEach((t, e) => {
      const [i] = e.split(":");
      document.querySelectorAll(i).forEach((s) => {
        s.removeEventListener("click", t);
      });
    }), this.boundHandlers.clear();
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
  triggerAction(t) {
    switch (t) {
      case "back":
        this.handleBack();
        break;
      case "drawPoint":
        this.activateDraw("Point");
        break;
      case "drawLine":
        this.activateDraw("LineString");
        break;
      case "drawPolygon":
        this.activateDraw("Polygon");
        break;
      case "drawCircle":
        this.activateDraw("Circle");
        break;
      case "modify":
        this.activateModify();
        break;
      case "select":
        this.activateSelect();
        break;
      case "delete":
        this.deleteSelected();
        break;
      case "undo":
        this.undo();
        break;
      default:
        console.warn(`Unknown action: ${t}`);
    }
  }
  /**
   * Deactivate all interactions
   */
  deactivateAll() {
    this.drawInteraction && (this.drawInteraction.setActive(!1), this.map.removeInteraction(this.drawInteraction), this.drawInteraction = null), this.modifyInteraction.setActive(!1), this.selectInteraction.setActive(!1), this.translateInteraction.setActive(!1), this.currentMode = null, this.notifyModeChange();
  }
  /**
   * Activate draw mode with specified geometry type
   */
  activateDraw(t) {
    this.deactivateAll(), this.drawInteraction = new Tm({
      source: this.source,
      type: t
    }), this.drawInteraction.on("drawend", (e) => {
      const i = e.feature;
      this.enableUndo && this.addToUndoStack({
        type: "add",
        feature: i
      }), this.callbacks.onFeatureAdded(i), this.eventManager.emit("featureadded", {
        type: "featureadded",
        feature: i
      }), this.eventManager.emit("drawend", {
        type: "drawend",
        feature: i,
        valid: !0
      });
    }), this.map.addInteraction(this.drawInteraction), this.drawInteraction.setActive(!0), this.currentMode = `draw-${t.toLowerCase()}`, this.notifyModeChange();
  }
  /**
   * Activate modify mode for editing geometries
   */
  activateModify() {
    this.deactivateAll(), this.modifyInteraction.setActive(!0), this.currentMode = "modify", this.notifyModeChange();
  }
  /**
   * Activate select/translate mode for selecting and moving features
   */
  activateSelect() {
    this.deactivateAll(), this.selectInteraction.setActive(!0), this.translateInteraction.setActive(!0), this.currentMode = "select", this.notifyModeChange();
  }
  /**
   * Delete currently selected feature
   */
  deleteSelected() {
    const t = this.selectInteraction.getFeatures();
    if (t.getLength() > 0) {
      const e = t.item(0);
      this.enableUndo && this.addToUndoStack({
        type: "delete",
        feature: e.clone()
      }), this.source.removeFeature(e), t.clear(), this.callbacks.onFeatureDeleted(e), this.eventManager.emit("featuredeleted", {
        type: "featuredeleted",
        feature: e
      });
    }
  }
  /**
   * Undo last action
   */
  undo() {
    if (!this.enableUndo || this.undoStack.length === 0)
      return;
    const t = this.undoStack.pop();
    if (t)
      switch (t.type) {
        case "add":
          this.source.removeFeature(t.feature);
          break;
        case "delete":
          this.source.addFeature(t.feature);
          break;
        case "modify":
          t.previousGeometry && t.feature.setGeometry(t.previousGeometry);
          break;
      }
  }
  /**
   * Add action to undo stack
   */
  addToUndoStack(t) {
    this.undoStack.push(t), this.undoStack.length > this.maxUndoStackSize && this.undoStack.shift();
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
  setActive(t) {
    t || this.deactivateAll(), this.callbacks.onActiveChange(t), this.eventManager.emit("change:active", {
      type: "change:active",
      active: t
    });
  }
  /**
   * Get current active state
   */
  getActive() {
    return this.currentMode !== null;
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
    const t = this.selectInteraction.getFeatures();
    return t.getLength() > 0 ? t.item(0) : null;
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
    this.selectInteraction.getFeatures().clear();
  }
  /**
   * Notify external app of mode change
   */
  notifyModeChange() {
    this.callbacks.onModeChange(this.currentMode), this.eventManager.emit("change:mode", {
      type: "change:mode",
      mode: this.currentMode
    });
  }
  /**
   * Update button selectors (for dynamically loaded UI)
   */
  updateButtons(t) {
    this.unbindUIElements(), Object.assign(this.buttons, t), this.bindUIElements();
  }
  /**
   * Clean up and remove all interactions
   */
  destroy() {
    this.unbindUIElements(), this.deactivateAll(), this.map.removeInteraction(this.modifyInteraction), this.map.removeInteraction(this.selectInteraction), this.map.removeInteraction(this.translateInteraction), this.clearUndoStack();
  }
}
const J = {
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
}, km = {
  fill: new $({
    color: J.FILL_COLOR
  }),
  stroke: new K({
    color: J.STROKE_COLOR,
    width: J.STROKE_WIDTH,
    lineCap: "round"
  }),
  circle: new Et({
    radius: J.RADIUS,
    fill: new $({
      color: J.CIRCLE_FILL_COLOR
    }),
    stroke: new K({
      color: J.CIRCLE_STROKE_COLOR,
      width: J.CIRCLE_STROKE_WIDTH
    })
  }),
  text: new Kt({
    font: `${J.LABEL_SIZE}px Arial`,
    textAlign: "left",
    textBaseline: "middle",
    text: "",
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scale: 1,
    stroke: new K({
      color: J.LABEL_STROKE_COLOR,
      width: J.LABEL_STROKE_WIDTH
    }),
    fill: new $({
      color: J.LABEL_COLOR
    })
  }),
  icon: new mi({
    src: "icon.png",
    size: [J.ICON_SIZE, J.ICON_SIZE]
  }),
  regularShape: new Pe({
    points: 3,
    radius: J.REGULAR_SHAPE_RADIUS,
    fill: new $({
      color: J.REGULAR_SHAPE_FILL_COLOR
    })
  })
};
class Hm {
  constructor() {
    this.defaultStyle = km;
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
  createStyle(t) {
    const e = {};
    if (t.fillColor) {
      const i = this.applyOpacity(t.fillColor, t.opacity);
      e.fill = new $({
        color: i
      });
    }
    if (t.strokeColor || t.strokeWidth) {
      const i = t.strokeColor || J.STROKE_COLOR, n = t.strokeWidth || J.STROKE_WIDTH, s = this.applyOpacity(i, t.opacity);
      e.stroke = new K({
        color: s,
        width: n
      });
    }
    if (t.icon) {
      const i = t.iconSize || J.ICON_SIZE;
      e.image = new mi({
        src: t.icon,
        scale: i / J.ICON_SIZE
        // Scale relative to base icon size
      });
    } else if (t.symbol === "circle" || !t.icon && t.color) {
      const i = t.color || t.fillColor || J.CIRCLE_FILL_COLOR, n = this.applyOpacity(i, t.opacity), s = t.iconSize || J.RADIUS;
      e.image = new Et({
        radius: s,
        fill: new $({
          color: n
        }),
        stroke: t.strokeColor ? new K({
          color: this.applyOpacity(t.strokeColor, t.opacity),
          width: t.strokeWidth || J.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    } else if (t.symbol === "square") {
      const i = t.color || t.fillColor || J.CIRCLE_FILL_COLOR, n = this.applyOpacity(i, t.opacity), s = t.iconSize || J.RADIUS;
      e.image = new Pe({
        points: 4,
        radius: s,
        angle: Math.PI / 4,
        fill: new $({
          color: n
        }),
        stroke: t.strokeColor ? new K({
          color: this.applyOpacity(t.strokeColor, t.opacity),
          width: t.strokeWidth || J.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    } else if (t.symbol === "triangle") {
      const i = t.color || t.fillColor || J.CIRCLE_FILL_COLOR, n = this.applyOpacity(i, t.opacity), s = t.iconSize || J.RADIUS;
      e.image = new Pe({
        points: 3,
        radius: s,
        fill: new $({
          color: n
        }),
        stroke: t.strokeColor ? new K({
          color: this.applyOpacity(t.strokeColor, t.opacity),
          width: t.strokeWidth || J.CIRCLE_STROKE_WIDTH
        }) : void 0
      });
    }
    if (t.label) {
      const i = t.labelColor || J.LABEL_COLOR, n = t.labelSize || J.LABEL_SIZE;
      e.text = new Kt({
        text: t.label,
        font: `${n}px Arial`,
        fill: new $({
          color: i
        }),
        stroke: new K({
          color: J.LABEL_STROKE_COLOR,
          width: J.LABEL_STROKE_WIDTH
        })
      });
    }
    return new X(e);
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
  applyOpacity(t, e) {
    if (e === void 0 || e === 1)
      return Array.isArray(t) ? `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${t[3] || 1})` : t;
    if (Array.isArray(t))
      return `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${e})`;
    if (t.startsWith("#")) {
      const i = t.replace("#", ""), n = parseInt(i.substring(0, 2), 16), s = parseInt(i.substring(2, 4), 16), o = parseInt(i.substring(4, 6), 16);
      return `rgba(${n}, ${s}, ${o}, ${e})`;
    }
    if (t.startsWith("rgb")) {
      const i = t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (i)
        return `rgba(${i[1]}, ${i[2]}, ${i[3]}, ${e})`;
    }
    return t;
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
    return new X({
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
  createStyleFromMobileCoreStyle(t) {
    return new X({
      fill: t.fill,
      stroke: t.stroke,
      image: t.circle,
      text: t.text
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
  applyStyleToFeature(t, e) {
    const i = this.createStyle(e);
    t.setStyle(i);
  }
}
export {
  Ii as COLLAB_VECTOR_DEFAULT_VALUES,
  Ul as ClosedReportStatus,
  mm as CollabStylePresets,
  Zo as CollabStyler,
  qh as CollabVectorLayer,
  Go as CollabVectorSource,
  km as DEFAULT_STYLE,
  J as DEFAULT_STYLE_VALUES,
  Vm as DocumentManager,
  su as ExtentManager,
  Ym as RasterCacheManager,
  jm as ReportManager,
  Bm as ReportSource,
  qe as ReportStatus,
  $m as ReportValidator,
  pn as SOURCE_ERROR_CODES,
  Km as SketchManager,
  Hm as StyleManager,
  Zm as UserManager,
  Hs as WFSLayer,
  Lr as WFSSource,
  er as WFS_DEFAULT_VALUES
};
//# sourceMappingURL=index.js.map
