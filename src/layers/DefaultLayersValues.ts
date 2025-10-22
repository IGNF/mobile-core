export const DEFAULT_LAYERS_VALUES = {
  COLLAB_VECTOR_RENDER_MODE: 'image',
}

/**
 * Default style values for WFS layers
 * These values are used when creating WFS feature styles
 */
export const WFS_STYLE_DEFAULTS = {
  FILL_COLOR: 'rgba(255,255,255,0.4)',
  STROKE_COLOR: '#3399CC',
  STROKE_WIDTH: 1.25,
  CIRCLE_RADIUS: 5,
  LABEL_COLOR: '#000',
  LABEL_STROKE_COLOR: '#fff',
  LABEL_SIZE: 10,
  LABEL_STROKE_WIDTH: 4,
} as const;