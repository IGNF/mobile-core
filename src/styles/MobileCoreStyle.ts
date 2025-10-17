/**
 * Definition of the style interface for the map
 */

import { Fill, Stroke, Circle, Text, Icon, RegularShape } from 'ol/style';

export interface MobileCoreStyle {
  fill: Fill;
  stroke: Stroke;
  circle: Circle;
  text: Text;
  icon: Icon;
  regularShape: RegularShape;
}

export interface StyleRule {
  name?: string;
  condition?: Record<string, any>; // Filter condition
  symbol?: string;
  color?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  pattern?: string;
  icon?: string;
  iconSize?: number;
  label?: string;
  labelColor?: string;
  labelSize?: number;
}