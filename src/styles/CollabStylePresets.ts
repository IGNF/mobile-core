/**
 * Domain-specific style presets for collaborative layers
 * Extracted from CollabStyler to separate concerns
 */
import { Feature } from "ol";
import { Style } from "ol/style";
import { Color } from "ol/color";
import { LineString, MultiLineString } from "ol/geom";
// @ts-ignore - ol-ext does not have full type definitions
import ol_style_geoportailStyle from 'ol-ext/style/geoportailStyle';


import { StyleRule } from "./MobileCoreStyle";
import { CollabStyler } from "./CollabStyler";

/**
 * Collection of preset style functions for specific feature types
 * These presets are domain-specific and rely on CollabStyler utilities
 */
export class CollabStylePresets {
  private styler: CollabStyler;

  constructor(styler: CollabStyler) {
    this.styler = styler;
  }

  public zombie() {
    function getColor(feature: Feature, opacity: number): Color {
      return (feature.get('detruit') ? [255, 0, 0, opacity] : [0, 0, 255, opacity]);
    }

    return (feature: Feature): Style[] => {
      const fstyle: StyleRule = {
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

  public detruit() {
    return (feature: Feature): Style[] => {
      if (!feature.get('detruit')) return [];
      const fstyle: StyleRule = {
        strokeWidth: 2,
        strokeColor: [255, 0, 0, 0.5]
      }
      const style = new Style({
        text: this.styler.text(fstyle),
        fill: this.styler.fill(fstyle),
        stroke: this.styler.stroke(fstyle)
      });
      this.styler.setImage(style, fstyle, feature);
      return [style];
    };
  }

  public vivant() {
    return (feature: Feature): Style[] => {
      if (feature.get('detruit')) return [];
      const fstyle: StyleRule = {
        strokeWidth: 2,
        strokeColor: [0, 0, 255, 0.5]
      }
      const style = new Style({
        text: this.styler.text(fstyle),
        fill: this.styler.fill(fstyle),
        stroke: this.styler.stroke(fstyle)
      });
      this.styler.setImage(style, fstyle, feature);
      return [style];
    };
  }

  public combine(styleFns: ((feature: Feature, res: number) => Style | Style[])[] | ((feature: Feature, res: number) => Style | Style[])) {
    const fns = Array.isArray(styleFns) ? styleFns : [styleFns];
    return (feature: Feature, res: number): Style[] => {
      const s0: Style[] = [];
      for (const fn of fns) {
        const result = fn(feature, res);
        const styles = Array.isArray(result) ? result : [result];
        s0.push(...styles);
      }
      return s0;
    };
  }

  public troncon_de_route(options: any) {
    options = options || {};
    return ol_style_geoportailStyle('BDTOPO_V3:troncon_de_route', { sens: options.sens || true });

    // Note: there is quite a lot of commented code in the original version
  }

  public sens(options: any) {
    if (!options) options = {
      attribute: 'sens_de_circulation',
      glyph: '\u203A', // '>',
      size: "20px",
      direct: 'Sens direct',
      inverse: 'Sens inverse'
    };

    const fleche = (sens: string): string => {
      if (sens == options.direct || sens == options.inverse) return options.glyph;
      return '';
    }
    const lrot = (sens: string, geom: LineString | MultiLineString): number => {
      if (sens != options.direct && sens != options.inverse) return 0;
      let geo = geom.getCoordinates();
      let x: number = 0, y: number = 0, dl: number = 0, l = geom.getLength();
      for (var i = 0; i < geo.length - 1; i++) {
        x = (geo[i + 1][0] as number) - (geo[i][0] as number);
        y = (geo[i + 1][1] as number) - (geo[i][1] as number);
        dl += Math.sqrt(x * x + y * y);
        if (dl >= l / 2) break;
      }
      if (sens == options.direct) return -Math.atan2(y, x);
      else return Math.PI - Math.atan2(y, x);
    }

    return (feature: Feature): Style[] => {
      const sens = feature.get(options.attribute)
      const fstyle: StyleRule = {
        label: fleche(sens),
        fontWeight: "bold",
        fontSize: options.size,
        labelRotation: lrot(sens, feature.getGeometry() as LineString | MultiLineString) // we have to cast to LineString | MultiLineString because getGeometry() can return undefined
      }
      const style = new Style({
        text: this.styler.text(fstyle)
      });
      return [
        style
      ];
    };
  }

  public toponyme(options: any) {
    if (!options) options = {
      attribute: 'nom',
      size: "12px"
    };
    if (!options.minResolution) options.minResolution = 0;
    if (!options.maxResolution) options.maxResolution = 2;

    return (feature: any, res: number): Style[] => {
      if (res > options.maxResolution || res < options.minResolution) return [];
      const fstyle: StyleRule = {
        label: feature.get(options.attribute),
        fontWeight: options.weight,
        fontSize: options.size
      }
      const style = new Style({
        text: this.styler.text(fstyle)
      });
      return [style];
    };
  }

  public batiment(options: any) {
    if (!options) options = {};

    const getColor = (feature: any, opacity: number): Color => {
      switch (feature.get('nature') as string) {
        case "Industriel, agricole ou commercial": return [51, 102, 153, opacity];
        case "Remarquable": return [0, 192, 0, opacity];
        default:
          switch (feature.get('fonction') as string) {
            case "Indifférenciée": return [128, 128, 128, opacity];
            case "Sportive": return [51, 153, 102, opacity];
            case "Religieuse": return [153, 102, 51, opacity];
            default: return [153, 51, 51, opacity];
          }
      }
    }

    return (feature: any): Style[] => {
      if (feature.get('detruit')) return [];
      const fstyle: StyleRule = {
        strokeColor: getColor(feature, 1),
        fillColor: getColor(feature, 0.5)
      };
      if (!/en service/i.test(feature.get('etat_de_l_objet') as string)) {
        fstyle.strokeLineDash = [10, 5];
        fstyle.fillColor = [0, 0, 0, 0];
      }
      if (options.symbol) {
        fstyle.label = this.getSymbol(feature as Feature) as string;
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
      } else {
        return [
          new Style({
            stroke: this.styler.stroke(fstyle),
            fill: this.styler.fill(fstyle)
          })
        ];
      }
    };
  }

  public getSymbol(feature: Feature): string | null {
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

