/**
 * This class manages the styles for the map
 */
import { Style } from 'ol/style';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { MobileCoreStyle, StyleRule } from './MobileCoreStyle';
export declare class StyleManager {
    private defaultStyle;
    constructor();
    /**
     * Get the default mobile core style configuration
     *
     * @returns {MobileCoreStyle} The default MobileCoreStyle object containing fill, stroke, circle, text, icon, and regularShape components
     */
    getDefaultMobileCoreStyle(): MobileCoreStyle;
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
    createStyle(styleRule: StyleRule): Style;
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
    private applyOpacity;
    /**
     * Get the default OpenLayers style
     *
     * Creates an OpenLayers Style object from the default MobileCoreStyle configuration.
     * This style is used as a fallback when no matching style rules are found.
     *
     * @returns {Style} An OpenLayers Style instance with default fill, stroke, and image (circle) properties
     */
    getDefaultStyle(): Style;
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
    createStyleFromMobileCoreStyle(mobileCoreStyle: MobileCoreStyle): Style;
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
    applyStyleToFeature(feature: Feature<Geometry>, styleRule: StyleRule): void;
}
//# sourceMappingURL=StyleManager.d.ts.map