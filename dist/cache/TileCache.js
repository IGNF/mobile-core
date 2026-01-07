/**
 * Tile cache implementation for raster tiles
 * @migrated from ol/cache/CacheTile.js
 */
import OlObject from 'ol/Object';
import View from 'ol/View';
import { getCenter } from 'ol/extent';
export class TileCache extends OlObject {
    /**
     * Get minimum zoom level
     * @returns The minimum zoom level for this cache
     */
    getMinZoom() {
        return this._minZoom;
    }
    /**
     * Get maximum zoom level
     * @returns The maximum zoom level for this cache
     */
    getMaxZoom() {
        return this._maxZoom;
    }
    /**
     * Check if cache is in read-only mode
     * @returns True if cache is read-only
     * @todo Implement read-only mode logic
     */
    isReadOnly() {
        return !!this._read;
    }
    // options to type
    constructor(layer, options) {
        options = options || {};
        super();
        this._layer = layer;
        this._source = layer.getSource();
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
    /**
     * Write a tile to cache by dispatching a 'save' event
     * @param id - Unique tile identifier (format: "zoom-col-row")
     * @param url - URL of the tile to save
     */
    writeTile(id, url) {
        this.dispatchEvent({ type: 'save', id: id, url: url });
    }
    /**
     * Save the tiles for a given extent and resolution
     * Calculates which tiles cover the extent and iterates through them
     * @param e - Extent
     * @param res - Resolution
     */
    saveResolution(e, res) {
        // Convert extent corners to tile coordinates (top-left and bottom-right)
        const tileCoordTopLeft = this._source?.getTileGrid()?.getTileCoordForCoordAndResolution([e[0], e[1]], res) ?? [];
        const tileCoordBottomRight = this._source?.getTileGrid()?.getTileCoordForCoordAndResolution([e[2], e[3]], res) ?? [];
        const zoom = tileCoordTopLeft[0];
        const row1 = Math.min(tileCoordTopLeft[1], tileCoordBottomRight[1]);
        const row2 = Math.max(tileCoordTopLeft[1], tileCoordBottomRight[1]);
        const col1 = Math.min(tileCoordTopLeft[2], tileCoordBottomRight[2]);
        const col2 = Math.max(tileCoordTopLeft[2], tileCoordBottomRight[2]);
        const tileUrlFunction = this._source?.getTileUrlFunction() ?? null;
        // Iterate through all tiles in the extent
        for (let col = col1; col <= col2; col++) {
            for (let row = row1; row <= row2; row++) {
                const url = tileUrlFunction?.call(this._source, [zoom, row, col], 1, this._source?.getProjection()) ?? null;
                if (!this._estimate && url)
                    this.writeTile(zoom + "-" + col + "-" + row, url);
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
    async saveTile(minZoom, maxZoom, extent) {
        if (typeof (minZoom) == 'undefined')
            return;
        if (!this._estimate) {
            this._minZoom = Math.min(minZoom, this._tileGridMinZoom);
            this._maxZoom = Math.max(maxZoom, this._tileGridMaxZoom);
            this._extent = extent;
            this.dispatchEvent({ type: 'savestart' });
        }
        // in OpenLayers 10, TileGrid is immutable, so we can't set the minZoom and maxZoom
        // this.source.getTileGrid().minZoom = this._tileGridMinZoom;
        // this.source.getTileGrid().maxZoom = this._tileGridMaxZoom;
        await this.asyncTileLoad(); // to implement
        // Calculate 
        this._view.setZoom(minZoom);
        // Base url
        const coord = this._source?.getTileGrid()?.getTileCoordForCoordAndResolution(getCenter(extent), this._view.getResolution() ?? 0) ?? [];
        const fn = this._source?.getTileUrlFunction() ?? null;
        this._baseUrl = fn?.call(this._source, coord, 1, this._source?.getProjection()) ?? "";
        this._length = 0;
        // Get urls
        for (let z = minZoom; z <= maxZoom; z++) {
            this._view.setZoom(z);
            const r = this._view.getResolution() ?? 0;
            this.saveResolution(extent, r);
        }
        if (!this._estimate)
            this.dispatchEvent({ type: 'saveend', length: this._length });
    }
    /**
     * Restore the cache to the original state
     * Resets the layer extent and resolution, and refreshes the source
     *
     * @param minZoom - Minimum zoom level to restore
     * @param extent - Geographic extent to restore
     * @note In OpenLayers 10, TileGrid is immutable, so we can't modify minZoom/maxZoom directly
     */
    restore(minZoom, extent) {
        this.asyncTileLoad(() => { });
        this._layer.setExtent(extent);
        this._layer.setMaxResolution(this._source?.getTileGrid()?.getResolution(minZoom - 3) || Infinity);
        // Force refresh
        this._source?.refresh();
    }
    /**
     * Sets up async tile loading function
     *
     * @param asyncLoadFn - Optional callback for custom tile loading logic
     *   - tile: Object with id and url properties
     *   - callback: Function to call with the loaded URL
     */
    asyncTileLoad(_asyncLoadFn) {
        // TODO: Implement async tile loading
        // This method will use the provided callback to load tiles asynchronously
        /**
         * Old code:
         *
         *  // Change tileloadFunction to load async images //this.getTileLoadFunction();
      var _tileLoadFunction = function(imageTile, src) {
        imageTile.getImage().src = src;
      };
      var source = this.source;
      // TileLoad
      if (!asyncLoadFn) {
        source.setTileLoadFunction (_tileLoadFunction);
      } else {
        source.setTileLoadFunction (function(imageTile, src) {
          var tilecoord = imageTile.getTileCoord();
          var id = tilecoord[0]+"-"+tilecoord[2]+"-"+tilecoord[1];
          asyncLoadFn({ id:id, url:src }, function(url) {
            _tileLoadFunction(imageTile, url||src);
            //img.crossOrigin = null;
            //self.changed();
          });
        });
      }
         */
    }
    /**
     * Get the current cache extent
     * @returns The geographic extent being cached
     */
    getExtent() {
        return this._extent;
    }
    /**
     * Get the number of tiles in the current cache operation
     * @returns The total number of tiles
     */
    getLength() {
        return this._length;
    }
    /**
     * Estimate the total size of tiles to cache for a given extent and zoom range
     * Performs a sample fetch to determine average tile size and calculates total cache size
     *
     * @param minZoom - Minimum zoom level to cache
     * @param maxZoom - Maximum zoom level to cache
     * @param extent - Geographic extent to cache tiles for
     * @returns Promise resolving to an object containing:
     *   - length: Number of tiles to cache
     *   - size: Estimated total size in MB
     *   - time: Estimated total download time in milliseconds (optional)
     */
    async estimateSize(minZoom, maxZoom, extent) {
        // Save current state to restore later
        const tileLoadFunction = this._source?.getTileLoadFunction() ?? null;
        const nb0 = this._length;
        this._estimate = true;
        // Calculate the number of tiles needed for the given extent and zoom range
        // This populates this._length with the total tile count
        await this.saveTile(minZoom, maxZoom, extent);
        const nb = this._length;
        const authentication = this._authentication;
        if (!nb) {
            return { length: 0, size: 0 };
        }
        const time = (new Date()).getTime();
        try {
            // Prepare authentication headers if needed
            const headers = {};
            if (authentication) {
                headers['Authorization'] = `Basic ${authentication}`;
            }
            // Fetch a sample tile to estimate the average tile size
            const response = await fetch(this._baseUrl + "&dtime=" + time, {
                method: 'GET',
                headers
            });
            if (!response.ok) {
                return { length: nb, size: 0 };
            }
            // Get tile size from Content-Length header or response body length
            const contentLength = response.headers.get('Content-Length');
            const responseText = await response.text();
            const size = contentLength ? parseInt(contentLength, 10) : responseText.length;
            // Calculate total estimated size in MB and estimated download time
            return {
                length: nb,
                size: Math.round(10 * nb * size / 1024 / 1024) / 10,
                time: nb * ((new Date()).getTime() - time)
            };
        }
        catch (error) {
            return { length: nb, size: 0 };
        }
        finally {
            // Restore original state after estimation
            if (this._estimate) {
                this._estimate = false;
                this._length = nb0;
                if (tileLoadFunction) {
                    this._source?.setTileLoadFunction(tileLoadFunction);
                }
            }
        }
    }
}
//# sourceMappingURL=TileCache.js.map