/**
 * OpenLayers source for WFS (Web Feature Service) layers
 * @migrated from: ol/source/WFS.js of the CordovApp module
 */
import VectorSource from "ol/source/Vector";
import { WFSSourceOptions } from "./types";
import { Projection } from "ol/proj";
export default class WFSSource extends VectorSource {
    localProperties: Record<string, any>;
    requestProperties: Record<string, any>;
    private _tileLoading;
    constructor(options: WFSSourceOptions, cache?: any);
    /**
     * TODO: add and implement the cache attribute *IF NEEDED* (see ol/source/WFS.js)
     * @param options
     * @param cache
     * @returns
     */
    private static _computeWFSSourceOptions;
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
    private _initWFSSource;
    setAuthentication(username: string, password: string): void;
    getCachePath(): string;
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
    loadFromCache(extent0: number[], resolution: number, projection: Projection): Promise<void>;
    /**
     * Read WFS response and add features to the source
     *
     * @param response: response from WFS
     * @param projection: projection
     */
    private _readWFSResponse;
    /**
     * Handle WFS load error
     *
     * @param status: status of the load
     * @param error: error object
     */
    private _handleWFSLoadError;
    /**
     * Get the file cache name
     *
     * @returns the file cache name
     */
    getFileCacheName(): string;
}
//# sourceMappingURL=WFSSource.d.ts.map