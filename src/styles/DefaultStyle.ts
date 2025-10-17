/**
 * Definition of default style to apply to the map by default
 */

import { Fill, Stroke, Circle, Text, Icon, RegularShape } from 'ol/style';

import { MobileCoreStyle } from './MobileCoreStyle';

/**
 * Default values for style properties
 * These values are used both as fallback values when creating styles from StyleRules
 * and as the base values for the DEFAULT_STYLE configuration
 */
export const DEFAULT_STYLE_VALUES = {
  STROKE_COLOR: '#00f',
  STROKE_WIDTH: 1,
  FILL_COLOR: 'rgba(255, 255, 255, 0.5)',
  RADIUS: 8,
  CIRCLE_FILL_COLOR: 'rgba(255,0,0,.5)',
  CIRCLE_STROKE_COLOR: '#fff',
  CIRCLE_STROKE_WIDTH: 1.5,
  ICON_SIZE: 16,
  LABEL_COLOR: '#fff',
  LABEL_SIZE: 12,
  LABEL_STROKE_COLOR: '#000',
  LABEL_STROKE_WIDTH: 2,
  REGULAR_SHAPE_RADIUS: 10,
  REGULAR_SHAPE_FILL_COLOR: 'rgba(0, 0, 0, 0.5)',
  OPACITY: 1,
} as const;

/**
 * Default MobileCoreStyle configuration with all style components
 * Uses DEFAULT_STYLE_VALUES as the single source of truth for default values
 */
export const DEFAULT_STYLE: MobileCoreStyle = {
  fill: new Fill({
    color: DEFAULT_STYLE_VALUES.FILL_COLOR,
  }),
  stroke: new Stroke({
    color: DEFAULT_STYLE_VALUES.STROKE_COLOR,
    width: DEFAULT_STYLE_VALUES.STROKE_WIDTH,
    lineCap: 'round',
  }),
  circle: new Circle({
    radius: DEFAULT_STYLE_VALUES.RADIUS,
    fill: new Fill({
      color: DEFAULT_STYLE_VALUES.CIRCLE_FILL_COLOR,
    }),
    stroke: new Stroke({
      color: DEFAULT_STYLE_VALUES.CIRCLE_STROKE_COLOR,
      width: DEFAULT_STYLE_VALUES.CIRCLE_STROKE_WIDTH,
    }),
  }),
  text: new Text({
    font: `${DEFAULT_STYLE_VALUES.LABEL_SIZE}px Arial`,
    textAlign: 'left',
    textBaseline: 'middle',
    text: '',
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scale: 1,
    stroke: new Stroke({
      color: DEFAULT_STYLE_VALUES.LABEL_STROKE_COLOR,
      width: DEFAULT_STYLE_VALUES.LABEL_STROKE_WIDTH,
    }),
    fill: new Fill({
      color: DEFAULT_STYLE_VALUES.LABEL_COLOR,
    }),
  }),
  icon: new Icon({
    src: 'icon.png',
    size: [DEFAULT_STYLE_VALUES.ICON_SIZE, DEFAULT_STYLE_VALUES.ICON_SIZE],
  }),
  regularShape: new RegularShape({
    points: 3,
    radius: DEFAULT_STYLE_VALUES.REGULAR_SHAPE_RADIUS,
    fill: new Fill({
      color: DEFAULT_STYLE_VALUES.REGULAR_SHAPE_FILL_COLOR,
    }),
  }),
}