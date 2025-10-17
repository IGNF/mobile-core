/**
 * This class manages the styles for the map
 */

// import type { FeatureLike } from 'ol/Feature';
import { Style, Fill, Stroke, Circle, Text, Icon, RegularShape } from 'ol/style';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import { DEFAULT_STYLE, DEFAULT_STYLE_VALUES } from './DefaultStyle';
import { MobileCoreStyle, StyleRule } from './MobileCoreStyle';

export class StyleManager {
  private defaultStyle: MobileCoreStyle;

  constructor() {
    this.defaultStyle = DEFAULT_STYLE;
  }

  /**
   * Get the default mobile core style configuration
   * 
   * @returns {MobileCoreStyle} The default MobileCoreStyle object containing fill, stroke, circle, text, icon, and regularShape components
   */
  getDefaultMobileCoreStyle(): MobileCoreStyle {
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
  createStyle(styleRule: StyleRule): Style {
    const styleOptions: any = {};

    // Handle fill color
    if (styleRule.fillColor) {
      const fillColor = this.applyOpacity(styleRule.fillColor, styleRule.opacity);
      styleOptions.fill = new Fill({
        color: fillColor,
      });
    }

    // Handle stroke
    if (styleRule.strokeColor || styleRule.strokeWidth) {
      const strokeColor = styleRule.strokeColor || DEFAULT_STYLE_VALUES.STROKE_COLOR;
      const strokeWidth = styleRule.strokeWidth || DEFAULT_STYLE_VALUES.STROKE_WIDTH;
      const strokeColorWithOpacity = this.applyOpacity(strokeColor, styleRule.opacity);
      
      styleOptions.stroke = new Stroke({
        color: strokeColorWithOpacity,
        width: strokeWidth,
      });
    }

    // Handle image (icon or circle)
    if (styleRule.icon) {
      const iconSize = styleRule.iconSize || DEFAULT_STYLE_VALUES.ICON_SIZE;
      styleOptions.image = new Icon({
        src: styleRule.icon,
        scale: iconSize / DEFAULT_STYLE_VALUES.ICON_SIZE, // Scale relative to base icon size
      });
    } else if (styleRule.symbol === 'circle' || (!styleRule.icon && styleRule.color)) {
      const color = styleRule.color || styleRule.fillColor || DEFAULT_STYLE_VALUES.CIRCLE_FILL_COLOR;
      const colorWithOpacity = this.applyOpacity(color, styleRule.opacity);
      const radius = styleRule.iconSize || DEFAULT_STYLE_VALUES.RADIUS;
      
      styleOptions.image = new Circle({
        radius: radius,
        fill: new Fill({
          color: colorWithOpacity,
        }),
        stroke: styleRule.strokeColor ? new Stroke({
          color: this.applyOpacity(styleRule.strokeColor, styleRule.opacity),
          width: styleRule.strokeWidth || DEFAULT_STYLE_VALUES.CIRCLE_STROKE_WIDTH,
        }) : undefined,
      });
    } else if (styleRule.symbol === 'square') {
      const color = styleRule.color || styleRule.fillColor || DEFAULT_STYLE_VALUES.CIRCLE_FILL_COLOR;
      const colorWithOpacity = this.applyOpacity(color, styleRule.opacity);
      const size = styleRule.iconSize || DEFAULT_STYLE_VALUES.RADIUS;
      
      styleOptions.image = new RegularShape({
        points: 4,
        radius: size,
        angle: Math.PI / 4,
        fill: new Fill({
          color: colorWithOpacity,
        }),
        stroke: styleRule.strokeColor ? new Stroke({
          color: this.applyOpacity(styleRule.strokeColor, styleRule.opacity),
          width: styleRule.strokeWidth || DEFAULT_STYLE_VALUES.CIRCLE_STROKE_WIDTH,
        }) : undefined,
      });
    } else if (styleRule.symbol === 'triangle') {
      const color = styleRule.color || styleRule.fillColor || DEFAULT_STYLE_VALUES.CIRCLE_FILL_COLOR;
      const colorWithOpacity = this.applyOpacity(color, styleRule.opacity);
      const size = styleRule.iconSize || DEFAULT_STYLE_VALUES.RADIUS;
      
      styleOptions.image = new RegularShape({
        points: 3,
        radius: size,
        fill: new Fill({
          color: colorWithOpacity,
        }),
        stroke: styleRule.strokeColor ? new Stroke({
          color: this.applyOpacity(styleRule.strokeColor, styleRule.opacity),
          width: styleRule.strokeWidth || DEFAULT_STYLE_VALUES.CIRCLE_STROKE_WIDTH,
        }) : undefined,
      });
    }

    // Handle text/label
    if (styleRule.label) {
      const labelColor = styleRule.labelColor || DEFAULT_STYLE_VALUES.LABEL_COLOR;
      const labelSize = styleRule.labelSize || DEFAULT_STYLE_VALUES.LABEL_SIZE;
      
      styleOptions.text = new Text({
        text: styleRule.label,
        font: `${labelSize}px Arial`,
        fill: new Fill({
          color: labelColor,
        }),
        stroke: new Stroke({
          color: DEFAULT_STYLE_VALUES.LABEL_STROKE_COLOR,
          width: DEFAULT_STYLE_VALUES.LABEL_STROKE_WIDTH,
        }),
      });
    }

    return new Style(styleOptions);
  }

  /**
   * Apply opacity to a color string
   * 
   * Converts hex or rgb colors to rgba format with the specified opacity.
   * If opacity is not specified or is 1, returns the original color unchanged.
   * 
   * @private
   * @param {string} color - The color to modify (in formats hex, rgb, rgba)
   * @param {number} [opacity] - Opacity value from 0 (transparent) to 1 (opaque).
   *   If undefined or 1, the original color is returned
   * 
   * @returns {string} The color in rgba format with applied opacity, or the original color if opacity is not applicable
   * 
   * @example
   * applyOpacity('#ff0000', 0.5) // returns 'rgba(255, 0, 0, 0.5)'
   * applyOpacity('rgb(255, 0, 0)', 0.7) // returns 'rgba(255, 0, 0, 0.7)'
   * applyOpacity('#ff0000', 1) // returns '#ff0000'
   */
  private applyOpacity(color: string, opacity?: number): string {
    if (opacity === undefined || opacity === 1) {
      return color;
    }

    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (rgbaMatch) {
        return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
      }
    }

    return color;
  }

  /**
   * Get the default OpenLayers style
   * 
   * Creates an OpenLayers Style object from the default MobileCoreStyle configuration.
   * This style is used as a fallback when no matching style rules are found.
   * 
   * @returns {Style} An OpenLayers Style instance with default fill, stroke, and image (circle) properties
   */
  getDefaultStyle(): Style {
    return new Style({
      fill: this.defaultStyle.fill,
      stroke: this.defaultStyle.stroke,
      image: this.defaultStyle.circle,
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
  createStyleFromMobileCoreStyle(mobileCoreStyle: MobileCoreStyle): Style {
    return new Style({
      fill: mobileCoreStyle.fill,
      stroke: mobileCoreStyle.stroke,
      image: mobileCoreStyle.circle,
      text: mobileCoreStyle.text,
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
  applyStyleToFeature(feature: Feature<Geometry>, styleRule: StyleRule): void {
    const style = this.createStyle(styleRule);
    feature.setStyle(style);
  }
}