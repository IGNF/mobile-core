/**
 * Definition of the style interface for the map
 */

import { Color } from 'ol/color';
import { Fill, Stroke, Circle, Text, Icon, RegularShape } from 'ol/style';

export interface MobileCoreStyle {
  fill: Fill;
  stroke: Stroke;
  circle: Circle;
  text: Text;
  icon: Icon;
  regularShape: RegularShape;
}

/**
 * Comprehensive style rule for feature styling
 * 
 * This interface combines modern simplified properties with legacy detailed properties
 * to support both basic and advanced styling use cases.
 * All properties are optional, allowing for flexible style configurations.
 */
export interface StyleRule {
  // Basic properties
  name?: string;
  condition?: Record<string, any>; // Filter condition
  symbol?: string;
  color?: string;

  // Fill properties
  fillColor?: Color | string;
  fillOpacity?: number; // More granular than opacity
  fillPattern?: string;
  patternColor?: string;

  // Stroke properties
  strokeColor?: Color | string;
  strokeWidth?: number;
  strokeDashstyle?: 'dot' | 'dash' | 'dashdot' | 'longdash' | 'longdashdot';
  strokeOpacity?: number; // More granular than opacity
  strokeLinecap?: 'round' | 'square';
  strokeLineDash?: number[];

  // General opacity (can be overridden by fillOpacity/strokeOpacity)
  opacity?: number;

  // Pattern
  pattern?: string;

  // Icon/Image properties
  icon?: string;
  iconSize?: number;
  img?: string; // Legacy: direct image source
  externalGraphic?: string; // Legacy: external graphic URL
  uri?: string; // Legacy: base URI for graphics
  graphicWidth?: number;
  graphicHeight?: number;
  pointRadius?: number;
  graphicName?: 'circle' | 'cross' | 'star' | 'rectangle' | 'square' | 'triangle' | 'x' | 'lightning' | 'church';

  // Label/Text properties (basic)
  label?: string;
  labelColor?: string;
  labelSize?: number;

  // Label/Text properties (detailed)
  fontWeight?: string;
  fontSize?: number | string;
  fontFamily?: string;
  fontColor?: string;
  labelRotation?: number;
  labelXOffset?: number;
  labelYOffset?: number;
  labelOutlineColor?: string;
  labelOutlineWidth?: number;
}