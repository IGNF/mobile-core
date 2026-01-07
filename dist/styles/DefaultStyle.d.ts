/**
 * Definition of default style to apply to the map by default
 */
import { MobileCoreStyle } from './MobileCoreStyle';
/**
 * Default values for style properties
 * These values are used both as fallback values when creating styles from StyleRules
 * and as the base values for the DEFAULT_STYLE configuration
 */
export declare const DEFAULT_STYLE_VALUES: {
    readonly STROKE_COLOR: "#00f";
    readonly STROKE_WIDTH: 1;
    readonly FILL_COLOR: "rgba(255, 255, 255, 0.5)";
    readonly RADIUS: 8;
    readonly CIRCLE_FILL_COLOR: "rgba(255,0,0,.5)";
    readonly CIRCLE_STROKE_COLOR: "#fff";
    readonly CIRCLE_STROKE_WIDTH: 1.5;
    readonly ICON_SIZE: 16;
    readonly LABEL_COLOR: "#fff";
    readonly LABEL_SIZE: 12;
    readonly LABEL_STROKE_COLOR: "#000";
    readonly LABEL_STROKE_WIDTH: 2;
    readonly REGULAR_SHAPE_RADIUS: 10;
    readonly REGULAR_SHAPE_FILL_COLOR: "rgba(0, 0, 0, 0.5)";
    readonly OPACITY: 1;
};
/**
 * Default MobileCoreStyle configuration with all style components
 * Uses DEFAULT_STYLE_VALUES as the single source of truth for default values
 */
export declare const DEFAULT_STYLE: MobileCoreStyle;
//# sourceMappingURL=DefaultStyle.d.ts.map