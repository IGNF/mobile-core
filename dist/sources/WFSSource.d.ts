/**
 * OpenLayers source for WFS (Web Feature Service) layers
 * @migrated from: ol/source/WFS.js of the CordovApp module
 */
import VectorSource from 'ol/source/Vector';
import { WFSSourceOptions } from './types';
import { Projection } from 'ol/proj';
export default class WFSSource extends VectorSource {
    localProperties: Record<string, any>;
    requestProperties: Record<string, any>;
    private _tileLoading;
    private _done;
    constructor(options: WFSSourceOptions, cache?: any);
    /**
     * Compute VectorSource options from WFS options
     */
    private static _computeWFSSourceOptions;
    /**
     * Completes WFS-specific initialization after VectorSource setup
     */
    private _initWFSSource;
    private _configureLoader;
    private _loaderFn;
    private _loadFromCache;
    private _loadFromService;
    private _tryLoadWithTypeNames;
    private _fetchWfsPayload;
    private _getAuthHeaders;
    /**
     * Read WFS response and return features to add
     */
    private _readWFSResponse;
    private _parseFeaturesFromPayload;
    private _buildCurrentGeoservice;
    private _buildWfsGetFeatureUrl;
    private _serializeFeatureFilter;
    private _toCqlLiteral;
    private _getWfsRequestVariants;
    private _hasFilterParams;
    private _projectionToCode;
    private _isGeoJSONFormat;
    private _isLikelyJsonPayload;
    private _looksLikeGeoJSONPayload;
    private _getWfsExceptionMessage;
    private _parseLayerSpec;
    private _resolveInitialTypeNames;
    private _getTypeNamesFromGeoserviceUrl;
    private _getQueryParamCaseInsensitive;
    private _extractUnknownFeatureTypeName;
    private _resolveUnknownTypeNames;
    private _buildWfsGetCapabilitiesUrl;
    private _parseWfsFeatureTypeNamesFromCapabilities;
    private _selectFallbackTypeNames;
    setAuthentication(username?: string, password?: string): void;
    getCachePath(): string;
    /**
     * Load features from cache (or service as fallback)
     */
    loadFromCache(extent0: number[], resolution: number, projection: Projection): Promise<void>;
    /**
     * Handle WFS load error
     */
    private _handleWFSLoadError;
    /**
     * Get the file cache name
     */
    getFileCacheName(): string;
}
//# sourceMappingURL=WFSSource.d.ts.map