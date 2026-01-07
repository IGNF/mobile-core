/**
 * OpenLayers layer for WFS
 * Migrated from: ol/layer/WFS.js
 */
import VectorLayer from "ol/layer/Vector";
import { Style, Fill, Stroke, Circle, Text } from "ol/style";
import { View } from "ol";
import FillPattern from "ol-ext/style/FillPattern";
import { WFS_STYLE_DEFAULTS } from "./DefaultLayersValues";
import PathUtils from "../utils/PathUtils";
import WFSSource from "../sources/WFSSource";
const pathUtils = new PathUtils();
export class WFSLayer extends VectorLayer {
    constructor(options, cache) {
        options = options || {};
        if (!options.geoservice) {
            options.geoservice = {}; // Provide minimal geoservice to prevent errors
        }
        if (!options.geoservice.input_mask) {
            options.geoservice.input_mask = {};
        }
        const superOptions = WFSLayer._computeWFSLayerOptions(options);
        super(superOptions);
        if (!options.geoservice?.url) {
            console.error('WFSLayer: geoservice.url is required');
            return;
        }
        this.cache = cache;
        this.layerOptions = options;
        this.set("authentication", options.username);
        // TODO, in the old code, we seem to use the options for both the layer and the source, which doesn't make sense
        // once implemented, test and find a solution
        if (options.getCapabilities !== false) {
            this.getCapabilities(options);
        }
        else {
            this.createSource(options);
        }
        // Zoom level
        const view = new View();
        let maxZoom = options.geoservice.maxZoom;
        let minZoom = options.geoservice.minZoom;
        if (maxZoom && maxZoom < 20) {
            view.setZoom(maxZoom);
            this.setMinResolution(view.getResolution() ?? 0);
        }
        if (minZoom) {
            view.setZoom(minZoom);
            this.setMaxResolution(view.getResolution() ?? 0);
        }
    }
    /**
     * Compute the options to pass to the super constructor of VectorLayer
     * @param options WFS layer options
     * @returns Options to pass to the super constructor of VectorLayer
     */
    static _computeWFSLayerOptions(options) {
        const cachedir = pathUtils.getEscapedDomainFromURL(options.geoservice.url);
        let attributes = options.geoservice.input_mask ? options.geoservice.input_mask.attributes : null;
        return {
            title: options.geoservice.title,
            description: options.geoservice.description,
            visible: options.visibility,
            opacity: options.opacity,
            name: cachedir + ':' + options.geoservice.layers,
            style: options.style || WFSLayer._createWFSStyle(attributes ?? {}),
            search: options.geoservice.input_mask ? options.geoservice.input_mask.searchAttribute : null,
            logo: options.logo
        };
    }
    async getCapabilities(options) {
        const authenticationFn = this.layerOptions?.authentication;
        // Build WFS GetCapabilities request URL
        const url = new URL(options.geoservice.url);
        url.searchParams.append('service', 'WFS');
        url.searchParams.append('request', 'GetCapabilities');
        // Setup Basic authentication if credentials provided
        const headers = {};
        if (options.username && options.password) {
            const credentials = btoa(`${options.username}:${options.password}`);
            headers['Authorization'] = `Basic ${credentials}`;
        }
        // Setup 10-second timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
            const response = await fetch(url.toString(), {
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                // Handle HTTP errors
                this.handleGetCapabilitiesError(response.status, new Error(`HTTP ${response.status}: ${response.statusText}`), response.statusText, options, authenticationFn);
                return;
            }
            // Success: create source
            this.createSource(options, this.cache);
        }
        catch (error) {
            clearTimeout(timeoutId);
            // Handle network errors and timeouts
            const status = error.name === 'AbortError' ? 0 : 0;
            const statusText = error.name === 'AbortError' ? 'timeout' : 'error';
            this.handleGetCapabilitiesError(status, error, statusText, options, authenticationFn);
        }
    }
    /**
     * Handle errors from getCapabilities request
     */
    handleGetCapabilitiesError(status, error, statusText, options, authenticationFn) {
        // Unauthorized - try authentication
        if (((status === 0 && !options.username) || status === 401 || status === 500) && typeof authenticationFn === 'function') {
            authenticationFn(this, (login, pwd) => {
                if (login) {
                    options.username = login;
                    this.set('authentication', options.username);
                    options.password = pwd;
                    // Retry getCapabilities
                    this.getCapabilities(options);
                }
                else {
                    this.dispatchEvent({ type: "error", error, status, statusText });
                }
            });
        }
        else if (this.cache) {
            // Cache exists - handle specific error codes
            switch (status) {
                case 403:
                case 404:
                case 500:
                case 503:
                    this.dispatchEvent({ type: "error", error, status, statusText });
                    break;
                default:
                    // Try to load cache anyway
                    this.createSource(options, this.cache);
                    break;
            }
        }
        else {
            // No cache or authentication - dispatch error
            this.dispatchEvent({ type: "error", error, status, statusText });
        }
    }
    createSource(options, cache) {
        const source = new WFSSource(options, cache);
        // this seems strange because table doesn't have an attributes property
        source.localProperties.table = {
            attributes: options.geoservice.input_mask?.attributes ?? {}
        };
        this.setSource(source);
        setTimeout(() => this.dispatchEvent({ type: "ready", source: source }), 100);
        source.on('addfeature', (e) => {
            e.feature._layer = this;
        });
    }
    /**
     * Get the table for the WFS layer
     * @returns The table for the WFS layer, or undefined if not ready
     */
    getTable() {
        const source = this.getSource();
        if (source && source instanceof WFSSource)
            return source.localProperties.table;
        return undefined;
    }
    /**
     * Create a WFS style function based on feature attributes
     * Returns a style function that reads symbology from feature properties
     * @param attributes Attribute configuration mapping titles to property names
     * @returns Style function or default styles
     */
    static _createWFSStyle(attributes) {
        // Default styles for WFS features
        const defaultFill = new Fill({
            color: WFS_STYLE_DEFAULTS.FILL_COLOR
        });
        const defaultStroke = new Stroke({
            color: WFS_STYLE_DEFAULTS.STROKE_COLOR,
            width: WFS_STYLE_DEFAULTS.STROKE_WIDTH
        });
        const defaultStyles = [
            new Style({
                image: new Circle({
                    fill: defaultFill,
                    stroke: defaultStroke,
                    radius: WFS_STYLE_DEFAULTS.CIRCLE_RADIUS
                }),
                fill: defaultFill,
                stroke: defaultStroke
            })
        ];
        // If no attributes, return default styles
        if (!attributes || Object.keys(attributes).length === 0) {
            return defaultStyles;
        }
        // Build lookup table for symbology attributes (symb@*)
        const lut = {};
        for (const key in attributes) {
            if (attributes[key].title && /^symb@/.test(attributes[key].title)) {
                lut[attributes[key].title] = key;
            }
        }
        // Helper function to get attribute name from symbolic name
        const getAttr = (name) => {
            return lut[name] || name;
        };
        // Return style function that reads feature properties
        return (feature) => {
            // Check if style is already cached on feature
            const cachedStyle = feature.wfsStyle;
            if (cachedStyle) {
                return cachedStyle;
            }
            // Check if feature has symbology color defined
            const symbColor = feature.get(getAttr('symb@sColor'));
            if (!symbColor) {
                return defaultStyles;
            }
            // Build dynamic style from feature properties
            const fillColor = feature.get(getAttr('symb@fColor')) || WFS_STYLE_DEFAULTS.FILL_COLOR;
            const patternType = feature.get(getAttr('symb@fPattern'));
            // Build fill with optional pattern
            let fill;
            if (patternType) {
                // Extract pattern properties
                const patternAngle = feature.get(getAttr('symb@pAngle'));
                const patternSize = feature.get(getAttr('symb@pWidth'));
                const patternSpacing = feature.get(getAttr('symb@pSpace'));
                const patternColor = feature.get(getAttr('symb@pColor'));
                fill = new FillPattern({
                    pattern: patternType,
                    color: patternColor || 'transparent',
                    fill: new Fill({
                        color: fillColor
                    }),
                    size: patternSize || 2,
                    spacing: patternSpacing || 5,
                    angle: patternAngle
                });
            }
            else {
                fill = new Fill({ color: fillColor });
            }
            // Build text/label if defined
            let text;
            const label = feature.get(getAttr('symb@label'));
            if (label) {
                const labelColor = feature.get(getAttr('symb@lColor')) || WFS_STYLE_DEFAULTS.LABEL_COLOR;
                const labelStrokeColor = feature.get(getAttr('symb@lsColor')) || WFS_STYLE_DEFAULTS.LABEL_STROKE_COLOR;
                const labelSize = feature.get(getAttr('symb@lSize')) || WFS_STYLE_DEFAULTS.LABEL_SIZE;
                text = new Text({
                    text: String(label),
                    stroke: new Stroke({
                        color: labelStrokeColor,
                        width: WFS_STYLE_DEFAULTS.LABEL_STROKE_WIDTH
                    }),
                    fill: new Fill({
                        color: labelColor
                    }),
                    overflow: false,
                    font: `${labelSize}px sans-serif`
                });
            }
            // Build stroke with optional dash pattern
            const strokeColor = feature.get(getAttr('symb@sColor')) || WFS_STYLE_DEFAULTS.STROKE_COLOR;
            const strokeWidth = feature.get(getAttr('symb@sWidth')) || WFS_STYLE_DEFAULTS.STROKE_WIDTH;
            const dashString = feature.get(getAttr('symb@sDash'));
            const lineDash = dashString ? dashString.split(',').map((n) => parseFloat(n)) : undefined;
            const stroke = new Stroke({
                color: strokeColor,
                width: strokeWidth,
                lineDash: lineDash && lineDash.length > 1 ? lineDash : undefined
            });
            // Create final style
            const wfsStyle = [
                new Style({
                    image: new Circle({
                        fill: defaultFill,
                        stroke: defaultStroke,
                        radius: WFS_STYLE_DEFAULTS.CIRCLE_RADIUS
                    }),
                    text: text,
                    fill: fill,
                    stroke: stroke
                })
            ];
            // Cache style on feature for performance
            feature.wfsStyle = wfsStyle;
            return wfsStyle;
        };
    }
}
//# sourceMappingURL=WFSLayer.js.map