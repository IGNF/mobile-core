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
    name?: string;
    condition?: Record<string, any>;
    symbol?: string;
    color?: string;
    fillColor?: Color | string;
    fillOpacity?: number;
    fillPattern?: string;
    patternColor?: string;
    strokeColor?: Color | string;
    strokeWidth?: number;
    strokeDashstyle?: 'dot' | 'dash' | 'dashdot' | 'longdash' | 'longdashdot';
    strokeOpacity?: number;
    strokeLinecap?: 'round' | 'square';
    strokeLineDash?: number[];
    opacity?: number;
    pattern?: string;
    icon?: string;
    iconSize?: number;
    img?: string;
    externalGraphic?: string;
    uri?: string;
    graphicWidth?: number;
    graphicHeight?: number;
    pointRadius?: number;
    graphicName?: 'circle' | 'cross' | 'star' | 'rectangle' | 'square' | 'triangle' | 'x' | 'lightning' | 'church';
    label?: string;
    labelColor?: string;
    labelSize?: number;
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
//# sourceMappingURL=MobileCoreStyle.d.ts.map