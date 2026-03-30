import { W as e } from "./index-11sxuTfr.js";
class o extends e {
  constructor() {
    super(), this._lastWindow = null;
  }
  async open(s) {
    this._lastWindow = window.open(s.url, s.windowName || "_blank");
  }
  async close() {
    return new Promise((s, n) => {
      this._lastWindow != null ? (this._lastWindow.close(), this._lastWindow = null, s()) : n("No active window to close!");
    });
  }
}
new o();
export {
  o as BrowserWeb
};
//# sourceMappingURL=web-C4_6aRve.js.map
