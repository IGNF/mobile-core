import { Style } from "ol/style";
// @ts-ignore - ol-ext does not have full type definitions
import ol_style_geoportailStyle from 'ol-ext/style/geoportailStyle';
/**
 * Collection of preset style functions for specific feature types
 * These presets are domain-specific and rely on CollabStyler utilities
 */
export class CollabStylePresets {
    constructor(styler) {
        this.styler = styler;
    }
    zombie() {
        function getColor(feature, opacity) {
            return (feature.get('detruit') ? [255, 0, 0, opacity] : [0, 0, 255, opacity]);
        }
        return (feature) => {
            const fstyle = {
                strokeColor: getColor(feature, 1),
                strokeWidth: 2,
                fillColor: getColor(feature, 0.5)
            };
            // Note: it seems that the version of this code in CordovApp doesn't work (see line 482, we call a function that doesn't exist)
            const style = new Style({
                text: this.styler.text(fstyle),
                fill: this.styler.fill(fstyle),
                stroke: this.styler.stroke(fstyle)
            });
            this.styler.setImage(style, fstyle, feature);
            return [style];
        };
    }
    detruit() {
        return (feature) => {
            if (!feature.get('detruit'))
                return [];
            const fstyle = {
                strokeWidth: 2,
                strokeColor: [255, 0, 0, 0.5]
            };
            const style = new Style({
                text: this.styler.text(fstyle),
                fill: this.styler.fill(fstyle),
                stroke: this.styler.stroke(fstyle)
            });
            this.styler.setImage(style, fstyle, feature);
            return [style];
        };
    }
    vivant() {
        return (feature) => {
            if (feature.get('detruit'))
                return [];
            const fstyle = {
                strokeWidth: 2,
                strokeColor: [0, 0, 255, 0.5]
            };
            const style = new Style({
                text: this.styler.text(fstyle),
                fill: this.styler.fill(fstyle),
                stroke: this.styler.stroke(fstyle)
            });
            this.styler.setImage(style, fstyle, feature);
            return [style];
        };
    }
    combine(styleFns) {
        const fns = Array.isArray(styleFns) ? styleFns : [styleFns];
        return (feature, res) => {
            const s0 = [];
            for (const fn of fns) {
                const result = fn(feature, res);
                const styles = Array.isArray(result) ? result : [result];
                s0.push(...styles);
            }
            return s0;
        };
    }
    troncon_de_route(options) {
        options = options || {};
        return ol_style_geoportailStyle('BDTOPO_V3:troncon_de_route', { sens: options.sens || true });
        // Note: there is quite a lot of commented code in the original version
    }
    sens(options) {
        if (!options)
            options = {
                attribute: 'sens_de_circulation',
                glyph: '\u203A', // '>',
                size: "20px",
                direct: 'Sens direct',
                inverse: 'Sens inverse'
            };
        const fleche = (sens) => {
            if (sens == options.direct || sens == options.inverse)
                return options.glyph;
            return '';
        };
        const lrot = (sens, geom) => {
            if (sens != options.direct && sens != options.inverse)
                return 0;
            let geo = geom.getCoordinates();
            let x = 0, y = 0, dl = 0, l = geom.getLength();
            for (var i = 0; i < geo.length - 1; i++) {
                x = geo[i + 1][0] - geo[i][0];
                y = geo[i + 1][1] - geo[i][1];
                dl += Math.sqrt(x * x + y * y);
                if (dl >= l / 2)
                    break;
            }
            if (sens == options.direct)
                return -Math.atan2(y, x);
            else
                return Math.PI - Math.atan2(y, x);
        };
        return (feature) => {
            const sens = feature.get(options.attribute);
            const fstyle = {
                label: fleche(sens),
                fontWeight: "bold",
                fontSize: options.size,
                labelRotation: lrot(sens, feature.getGeometry()) // we have to cast to LineString | MultiLineString because getGeometry() can return undefined
            };
            const style = new Style({
                text: this.styler.text(fstyle)
            });
            return [
                style
            ];
        };
    }
    toponyme(options) {
        if (!options)
            options = {
                attribute: 'nom',
                size: "12px"
            };
        if (!options.minResolution)
            options.minResolution = 0;
        if (!options.maxResolution)
            options.maxResolution = 2;
        return (feature, res) => {
            if (res > options.maxResolution || res < options.minResolution)
                return [];
            const fstyle = {
                label: feature.get(options.attribute),
                fontWeight: options.weight,
                fontSize: options.size
            };
            const style = new Style({
                text: this.styler.text(fstyle)
            });
            return [style];
        };
    }
    batiment(options) {
        if (!options)
            options = {};
        const getColor = (feature, opacity) => {
            switch (feature.get('nature')) {
                case "Industriel, agricole ou commercial": return [51, 102, 153, opacity];
                case "Remarquable": return [0, 192, 0, opacity];
                default:
                    switch (feature.get('fonction')) {
                        case "Indifférenciée": return [128, 128, 128, opacity];
                        case "Sportive": return [51, 153, 102, opacity];
                        case "Religieuse": return [153, 102, 51, opacity];
                        default: return [153, 51, 51, opacity];
                    }
            }
        };
        return (feature) => {
            if (feature.get('detruit'))
                return [];
            const fstyle = {
                strokeColor: getColor(feature, 1),
                fillColor: getColor(feature, 0.5)
            };
            if (!/en service/i.test(feature.get('etat_de_l_objet'))) {
                fstyle.strokeLineDash = [10, 5];
                fstyle.fillColor = [0, 0, 0, 0];
            }
            if (options.symbol) {
                fstyle.label = this.getSymbol(feature);
                fstyle.fontFamily = "Fontawesome";
                fstyle.fontColor = options.color || "magenta";
            }
            if (fstyle.label) {
                return [
                    new Style({
                        text: this.styler.text(fstyle),
                        stroke: this.styler.stroke(fstyle),
                        fill: this.styler.fill(fstyle)
                    })
                ];
            }
            else {
                return [
                    new Style({
                        stroke: this.styler.stroke(fstyle),
                        fill: this.styler.fill(fstyle)
                    })
                ];
            }
        };
    }
    getSymbol(feature) {
        switch (feature.get('fonction')) {
            case "Commerciale": return "\uf217";
            case "Sportive": return "\uf1e3";
            case "Mairie": return "\uf19c";
            case "Gare": return "\uf239";
            case "Industrielle": return "\uf275";
            default: return null;
        }
    }
}
//# sourceMappingURL=CollabStylePresets.js.map