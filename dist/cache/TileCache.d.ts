/**
 * Tile cache implementation for raster tiles
 * @migrated from ol/cache/CacheTile.js
 */
import OlObject from 'ol/Object';
import { Extent } from 'ol/extent';
import Layer from 'ol/layer/Layer';
export declare class TileCache extends OlObject {
    private _layer;
    private _source;
    private _tileGridMinZoom;
    private _tileGridMaxZoom;
    private _minZoom;
    private _maxZoom;
    private _read;
    private _authentication;
    /**
     * Get minimum zoom level
     * @returns The minimum zoom level for this cache
     */
    getMinZoom(): number;
    /**
     * Get maximum zoom level
     * @returns The maximum zoom level for this cache
     */
    getMaxZoom(): number;
    /**
     * Check if cache is in read-only mode
     * @returns True if cache is read-only
     * @todo Implement read-only mode logic
     */
    isReadOnly(): boolean;
    private _view;
    private _baseUrl;
    private _extent;
    private _estimate;
    private _length;
    constructor(layer: Layer, options: any);
    /**
     * Write a tile to cache by dispatching a 'save' event
     * @param id - Unique tile identifier (format: "zoom-col-row")
     * @param url - URL of the tile to save
     */
    writeTile(id: string, url: string): void;
    /**
     * Save the tiles for a given extent and resolution
     * Calculates which tiles cover the extent and iterates through them
     * @param e - Extent
     * @param res - Resolution
     */
    saveResolution(e: Extent, res: number): void;
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
    saveTile(minZoom: number, maxZoom: number, extent: Extent): Promise<void>;
    /**
     * Restore the cache to the original state
     * Resets the layer extent and resolution, and refreshes the source
     *
     * @param minZoom - Minimum zoom level to restore
     * @param extent - Geographic extent to restore
     * @note In OpenLayers 10, TileGrid is immutable, so we can't modify minZoom/maxZoom directly
     */
    restore(minZoom: number, extent: Extent): void;
    /**
     * Sets up async tile loading function
     *
     * @param asyncLoadFn - Optional callback for custom tile loading logic
     *   - tile: Object with id and url properties
     *   - callback: Function to call with the loaded URL
     */
    asyncTileLoad(_asyncLoadFn?: (tile: {
        id: string;
        url: string;
    }, callback: (url: string) => void) => void): void;
    /**
     * Get the current cache extent
     * @returns The geographic extent being cached
     */
    getExtent(): Extent;
    /**
     * Get the number of tiles in the current cache operation
     * @returns The total number of tiles
     */
    getLength(): number;
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
    estimateSize(minZoom: number, maxZoom: number, extent: Extent): Promise<{
        length: number;
        size: number;
        time?: number;
    }>;
}
//# sourceMappingURL=TileCache.d.ts.map