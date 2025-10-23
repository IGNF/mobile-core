/**
 * Tile cache implementation for raster tiles
 * @migrated from ol/cache/CacheTile.js
 */

import OlObject from 'ol/Object';
import View from 'ol/View';

import { Extent, getCenter } from 'ol/extent'
import Layer from 'ol/layer/Layer';
import Projection from 'ol/proj/Projection';
import TileImage from 'ol/source/TileImage';



export class TileCache extends OlObject {

  private _layer: Layer;
  private _source: TileImage;
  private _tileGridMinZoom: number;
  private _tileGridMaxZoom: number;

  private _minZoom: number;
  private _maxZoom: number;

  private _read: any;
  private _authentication: any;

  private _view: View;

  private _baseUrl: string;
  private _extent: Extent;

  private _estimate: boolean;
  private _length: number;
  // options to type
  constructor(layer: Layer, options: any) {
    options = options || {};

    super();

    this._layer = layer;
    this._source = layer.getSource() as TileImage;

    this._tileGridMinZoom = this._source?.getTileGrid()?.getMinZoom() ?? 0;
    this._tileGridMaxZoom = this._source?.getTileGrid()?.getMaxZoom() ?? 22;
    this._minZoom = 0;
    this._maxZoom = 22;

    this._read = options.read || null;
    this._authentication = options.authentication || null;
    this._view = new View(options);
    this._baseUrl = "";
    this._extent = [];

    this._estimate = options.estimate ?? false;

    this._length = 0;

  }

  // Note: the previous code had the following here:
  // ol_ext_inherits(CacheTile, ol_Object);
  // Can't find any matching function in ol-ext

  public writeTile(id: string, url: string): void {
    this.dispatchEvent({ type: 'save', id: id, url: url } as any);
  }

  /**
   * Save the tiles for a given extent and resolution
   * @param e - Extent
   * @param res - Resolution
   */
  public saveResolution(e: Extent, res: number): void {
    const tileCoordTopLeft = this._source?.getTileGrid()?.getTileCoordForCoordAndResolution([e[0], e[1]], res) ?? [];
    const tileCoordBottomRight = this._source?.getTileGrid()?.getTileCoordForCoordAndResolution([e[2], e[3]], res) ?? [];
    const zoom = tileCoordTopLeft[0];
    const row1 = Math.min(tileCoordTopLeft[1], tileCoordBottomRight[1]);
    const row2 = Math.max(tileCoordTopLeft[1], tileCoordBottomRight[1]);
    const col1 = Math.min(tileCoordTopLeft[2], tileCoordBottomRight[2]);
    const col2 = Math.max(tileCoordTopLeft[2], tileCoordBottomRight[2]);
    const tileUrlFunction = this._source?.getTileUrlFunction() ?? null;
    for (let col = col1; col <= col2; col++) {
      for (let row = row1; row <= row2; row++) {
        const url = tileUrlFunction?.call(this._source, [zoom, row, col], 1, this._source?.getProjection() as Projection) ?? null;
        if (!this._estimate && url) this.writeTile(zoom + "-" + col + "-" + row, url);
        this._length++;
      }
    }
  }

  /**
   * Get a list of image url to save in cache, use estimateSize to estimate the size before
   * Use the event to get 
   * - savestart : start saving
   * - save : get the current tile to save
   * - saveend : end saving
   * @param {Number} minZoom
   * @param {Number} maxZoom
   * @param {ol.extent} extent
   */
  async saveTile(minZoom: number, maxZoom: number, extent: Extent): Promise<void> {
    if (typeof (minZoom) == 'undefined') return;
    if (!this._estimate) {
      this._minZoom = Math.min(minZoom, this._tileGridMinZoom);
      this._maxZoom = Math.max(maxZoom, this._tileGridMaxZoom);
      this._extent = extent;
      this.dispatchEvent({ type: 'savestart' } as any);
    }

    // in OpenLayers 10, TileGrid is immutable, so we can't set the minZoom and maxZoom
    // this.source.getTileGrid().minZoom = this._tileGridMinZoom;
    // this.source.getTileGrid().maxZoom = this._tileGridMaxZoom;
    this.asyncTileLoad(); // to implement

    // Calculate 
    this._view.setZoom(minZoom);
    // Base url
    const coord = this._source?.getTileGrid()?.getTileCoordForCoordAndResolution(getCenter(extent), this._view.getResolution() ?? 0) ?? [];
    const fn = this._source?.getTileUrlFunction() ?? null;
    this._baseUrl = fn?.call(this._source, coord, 1, this._source?.getProjection() as Projection) ?? "";

    this._length = 0;

    // Get urls
    for (let z = minZoom; z <= maxZoom; z++) {
      this._view.setZoom(z);
      const r = this._view.getResolution() ?? 0;
      this.saveResolution(extent, r);
    }

    if (!this._estimate) this.dispatchEvent({ type: 'saveend', length: this._length } as any);
  }

  public asyncTileLoad(): void {
    // to implement
  }
}