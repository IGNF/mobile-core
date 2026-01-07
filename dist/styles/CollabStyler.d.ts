/**
 * Styling system for collaborative layers
 * Migrated from: ol/style/Collaboratif.js (749 LOC)
 *
 * Note:
 * A lot of values are hardcoded here, we could probably create default values for them
 */
import { Feature } from "ol";
import { Circle, Style, Text } from "ol/style";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";
import FillPattern from "ol-ext/style/FillPattern";
import { StyleRule } from "./MobileCoreStyle";
import { UserManager } from "../collaborative/UserManager";
import { CollabStylePresets } from "./CollabStylePresets";
/**
 * Symbol cache entry information
 */
export interface SymbolCacheEntry {
    name: string;
    nativeURL: string;
}
/**
 * Feature type configuration
 */
export interface FeatureTypeConfig {
    name?: string;
    style?: StyleRule & {
        children?: StyleRule[];
        directionField?: string;
    };
    styles?: StyleRule[];
    symbo_attribute?: {
        name: string;
    };
}
export declare class CollabStyler {
    private _userManager?;
    private _symbolCache;
    private _cacheLoading;
    defaultStyleFn: (feature: Feature, resolution: number) => Style | Style[];
    presets: CollabStylePresets;
    constructor(userManager?: UserManager);
    /**
     * Format properties with feature context
     * @param format The format configuration
     * @param _feature The feature to format properties for (unused for now)
     * @returns Formatted property value
     */
    formatProperties(format: any, feature: Feature): any;
    /**
     * Static factory method to get a style function for a collaborative layer
     * Creates a CollabStyler instance and returns its style function
     *
     * @param table The table configuration
     * @param cacheUrl The cache URL for resources
     * @param sourceOptions Additional source options (can include userManager for symbol loading)
     * @returns Style function compatible with OpenLayers StyleLike
     */
    static getFeatureStyleFunction(table: any, cacheUrl: string, sourceOptions: any): (feature: Feature, resolution: number) => Style | Style[];
    /**
     * Format feature style by processing all style properties
     * @param fstyle The feature style configuration
     * @param feature The feature to style
     * @returns Formatted feature style object
     */
    formatFeatureStyle(fstyle: StyleRule, feature: Feature): Record<string, any>;
    /**
     * Get stroke LineDash style from featureType.style
     * @param fstyle The feature style configuration
     * @returns Line dash array or undefined
     */
    strokeLineDash(fstyle: StyleRule): number[] | undefined;
    /**
     * Create a Stroke style from feature style configuration
     * @param fstyle The feature style configuration
     * @returns OpenLayers Stroke object or undefined
     */
    stroke(fstyle: StyleRule): Stroke | undefined;
    /**
     * Create a Fill style from feature style configuration
     * @param fstyle The feature style configuration
     * @returns OpenLayers Fill or FillPattern object or undefined
     */
    fill(fstyle: StyleRule): Fill | FillPattern | undefined;
    /**
     * Get default circle image for point features
     * @returns OpenLayers Circle style
     */
    getDefaultCircleImage(): Circle;
    /**
     * Set image on a style based on feature style configuration
     * Creates point symbols from images, circles, or font icons
     * @param olStyle The OpenLayers style to modify
     * @param fstyle The feature style configuration
     * @param feature The feature being styled (unused for now)
     */
    setImage(olStyle: Style, fstyle: StyleRule, feature: Feature): void;
    /**
     * Create a Text style from feature style configuration
     * @param fstyle The feature style configuration
     * @returns OpenLayers Text object or undefined
     */
    text(fstyle: StyleRule): Text | undefined;
    /**
     * This function was using Cordova to load symbols from the file system.
     * Instead of calling Capacitor here (we want to separate the logic)
     * We're passing the directory list as parameter
     *
     * To understand more about that, see the ol/style/Collaboratif.js file, line 263
     * @param entries Array of symbol cache entries with name and nativeURL
     */
    loadSymbolCache(entries: SymbolCacheEntry[]): void;
    /** Get ol style function as defined in featureType
     *
     * @param featureType Feature type configuration with style rules
     * @param cache Cache configuration (unused for now)
     * @param options Additional options including directoryList for symbol cache
     * @returns A style function that takes (feature, resolution) and returns Style or Style[]
     */
    getFeatureStyleFn(featureType?: FeatureTypeConfig, _cache?: any, options?: {
        directoryList?: SymbolCacheEntry[];
    }): (feature: Feature, resolution: number) => Style | Style[];
    /**
     * Return the urls of the symbols used for a feature type
     * @param featureType the feature type configuration
     * @returns Record mapping symbol names to their URIs
     */
    getUrls(featureType: FeatureTypeConfig): Record<string, string>;
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
    getSymbolURI(featureType: FeatureTypeConfig, name: string, width: number, height: number, feature: Feature): string | null;
    /**
     * Get the glyph for a graphic
     * @param graphicName the name of the graphic
     * @returns the glyph for the graphic
     */
    getGlyph(graphicName: string): string | null;
}
//# sourceMappingURL=CollabStyler.d.ts.map