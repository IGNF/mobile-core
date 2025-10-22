/**
 * Styling system for collaborative layers
 * Migrated from: ol/style/Collaboratif.js (749 LOC)
 */
import { Feature } from "ol";
import { Table } from "../collaborative/types";
import { Circle, Style, Text, Icon, RegularShape } from "ol/style";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";
import FillPattern from "ol-ext/style/FillPattern";
import { asArray, Color } from "ol/color";
import { StyleRule } from "./MobileCoreStyle";

/**
 * NOTE:
 * 2 fonctions vont posser problème ici, du à leur utilisation de Cordova.
 * - getSymbolURI (ligne 412 de l'ancienne classe)
 * - loadSymbolCache (ligne 263 de l'ancienne classe)
 * 
 * For the moment, we implemented what was possible
 * We'll see how to deal with that depending on how it has to be used
 */

/**
 * Cache for loaded images to avoid redundant downloads
 */
const imageCache: Record<string, Icon> = {};

export class CollabStyler {

  private _symbolCache: any;
  public defaultStyle: Style;

  constructor() {

    this._symbolCache = {};
    this.defaultStyle = this.getFeatureStyleFn();

  }

  /**
   * Format properties with feature context
   * @param format The format configuration
   * @param _feature The feature to format properties for (unused for now)
   * @returns Formatted property value
   */
  public formatProperties(format: any, feature: Feature): any {
    if (!format || !format.replace || !feature) return format;

    // Extract the property name from the format string (example: "Hello ${name} world" => "name")
    const propertyName = format.replace(/.*\$\{([^}]*)\}.*/, "$1");

    if (propertyName === format) {
      return format;
    }
    else {
      return this.formatProperties(format.replace("${" + propertyName + "}", feature.get(propertyName)), feature);
    }
  }

  /**
   * Get the style function for features in a collaborative layer
   * @param _table The table configuration (unused for now)
   * @param _cacheUrl The cache URL for resources (unused for now)
   * @param _sourceOptions Additional source options (unused for now)
   * @returns OpenLayers Style object
   */
  // public static getFeatureStyleFunction(_table: Table, _cacheUrl: string, _sourceOptions: any): Style {
  //   // TODO: Implement proper style function based on table configuration
  //   return new Style({
  //     fill: new Fill({ color: '#ff0000' }),
  //     stroke: new Stroke({ color: '#000000', width: 1 }),
  //   });
  // }

  /**
   * Format feature style by processing all style properties
   * @param fstyle The feature style configuration
   * @param feature The feature to style
   * @returns Formatted feature style object
   */
  public formatFeatureStyle(fstyle: StyleRule, feature: Feature): Record<string, any> {
    if (!fstyle) return {};
    const fs: Record<string, any> = {};
    for (const i in fstyle) {
      fs[i] = this.formatProperties((fstyle as any)[i], feature);
    }
    return fs;
  }

  /**
   * Get stroke LineDash style from featureType.style
   * @param fstyle The feature style configuration
   * @returns Line dash array or undefined
   */
  public strokeLineDash(fstyle: StyleRule): number[] | undefined {
    var width = Number(fstyle.strokeWidth) || 2;
    switch (fstyle.strokeDashstyle) {
      case 'dot': return [1, 2 * width];
      case 'dash': return [2 * width, 2 * width];
      case 'dashdot': return [2 * width, 4 * width, 1, 4 * width];
      case 'longdash': return [4 * width, 2 * width];
      case 'longdashdot': return [4 * width, 4 * width, 1, 4 * width];
      default: return undefined;
    }
  }

  /**
   * Create a Stroke style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Stroke object or undefined
   */
  public stroke(fstyle: StyleRule): Stroke | undefined {
    if (fstyle.strokeOpacity === 0) return undefined;
    const lineDash = this.strokeLineDash(fstyle);
    const stroke = new Stroke({
      color: fstyle.strokeColor || "#00f",
      width: Number(fstyle.strokeWidth) || 1,
      lineDash: lineDash,
      lineCap: fstyle.strokeLinecap || "round"
    });
    if (fstyle.strokeOpacity !== undefined && fstyle.strokeOpacity < 1) {
      const a = asArray(stroke.getColor() as Color);
      if (a.length) {
        a[4] = fstyle.strokeOpacity;
        stroke.setColor(a);
      }
    }
    return stroke;
  }

  /**
   * Create a Fill style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Fill or FillPattern object or undefined
   */
  public fill(fstyle: StyleRule): Fill | FillPattern | undefined {
    if (fstyle.fillOpacity === 0) return;
    let fill: Fill | FillPattern = new Fill({
      color: fstyle.fillColor || "rgba(255,255,255,0.5)",
    });
    if (fstyle.fillOpacity !== undefined && fstyle.fillOpacity < 1) {
      const a = asArray(fill.getColor() as Color);
      if (a.length) {
        a[3] = Number(fstyle.fillOpacity);
        fill.setColor(a);
      }
    }
    if (fstyle.fillPattern) {
      fill = new FillPattern({
        fill: fill,
        pattern: fstyle.fillPattern,
        color: fstyle.patternColor,
        angle: 45
      });
    }
    return fill;
  }


  /**
   * Get default circle image for point features
   * @returns OpenLayers Circle style
   */
  public getDefaultCircleImage(): Circle {
    return new Circle({
      radius: 10,
      fill: new Fill({ color: 'rgba(255,0,0,.5)' }),
      stroke: new Stroke({ color: '#fff', width: 1.5 }),
    });
  }

  /**
   * Set image on a style based on feature style configuration
   * @param olStyle The OpenLayers style to modify
   * @param fstyle The feature style configuration
   * @param _feature The feature being styled (unused for now)
   */
  public setImage(olStyle: Style, fstyle: StyleRule, _feature: Feature): void {
    // old code - needs refactoring for modern usage:
    let image: Circle | Icon | RegularShape | undefined;
    let img: string | undefined;
    if (fstyle.img) {
      img = fstyle.img
    } else if (fstyle.externalGraphic && fstyle.externalGraphic !== 'undefined') {
      img = fstyle.uri + '?width=' + fstyle.graphicWidth + '&height=' + fstyle.graphicWidth;
    }
    if (img) {
      if (imageCache[img]) {
        image = imageCache[img];
      } else {
        // Test download
        const i = new Image();
        // Save cache Image
        i.addEventListener('load', () => {
          imageCache[img!] = new Icon({ src: img! });
          olStyle.setImage(imageCache[img!]);
          // Note: feature.layer doesn't exist in OpenLayers 10+
          // Layer refresh should be handled externally
        });
        i.src = img;
        // Use default circle while image loads
        image = this.getDefaultCircleImage();
      }
    } else {
      const radius = Number(fstyle.pointRadius) || 5;

      type GraphicConfig = [number, number, number | undefined, number];
      const graphic: Record<string, GraphicConfig> = {
        cross: [4, radius, 0, 0],
        square: [4, radius, undefined, Math.PI / 4],
        triangle: [3, radius, undefined, 0],
        star: [5, radius, radius / 2, 0],
        x: [4, radius, 0, Math.PI / 4],
        rectangle: [4, radius, undefined, Math.PI / 4]
      };

      switch (fstyle.graphicName) {
        case "cross":
        case "star":
        case "rectangle":
        case "square":
        case "triangle":
        case "x": {
          const g = graphic[fstyle.graphicName] || graphic.square;
          image = new RegularShape({
            points: g[0],
            radius: g[1],
            radius2: g[2],
            rotation: g[3],
            stroke: this.stroke(fstyle),
            fill: this.fill(fstyle)
          });
          if (fstyle.graphicName === 'rectangle') {
            const canvas = image.getImage(1) as HTMLCanvasElement;
            const newCanvas = document.createElement('canvas');
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height;
            const newCtx = newCanvas.getContext("2d");
            const canvasCtx = canvas.getContext("2d");
            if (newCtx && canvasCtx) {
              newCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, canvas.width / 4, 0, canvas.width / 2, canvas.height);
              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
              canvasCtx.drawImage(newCanvas, 0, 0);
            }
          }
          break;
        }
        case 'lightning':
        case 'church':
          // TODO: FontSymbol from ol-ext is not available in standard OpenLayers
          // These would require ol-ext/style/FontSymbol import
          // For now, fall back to circle
          console.warn(`GraphicName '${fstyle.graphicName}' requires ol-ext FontSymbol, falling back to circle`);
          image = new Circle({
            radius: radius,
            stroke: this.stroke(fstyle),
            fill: this.fill(fstyle)
          });
          break;
        default:
          image = new Circle({
            radius: radius,
            stroke: this.stroke(fstyle),
            fill: this.fill(fstyle)
          });
          break;
      }
    }
    if (image) {
      olStyle.setImage(image);
    }
  }

  /**
   * Create a Text style from feature style configuration
   * @param fstyle The feature style configuration
   * @returns OpenLayers Text object or undefined
   */
  public text(fstyle: StyleRule): Text | undefined {
    if (!fstyle.label) return undefined;
    const textOptions = {
      font: (fstyle.fontWeight || '')
        + " "
        + (fstyle.fontSize || '12') + 'px'
        + " "
        + (fstyle.fontFamily || 'Sans-serif'),
      text: fstyle.label || '',
      rotation: (fstyle.labelRotation || 0),
      textAlign: 'left' as CanvasTextAlign,
      textBaseline: 'middle' as CanvasTextBaseline,
      offsetX: fstyle.labelXOffset || 0,
      offsetY: -(fstyle.labelYOffset || 0),
      stroke: new Stroke({
        color: fstyle.labelOutlineColor || '#fff',
        width: Number(fstyle.labelOutlineWidth) || 2
      }),
      fill: new Fill({
        color: fstyle.fontColor || '#000'
      })
    };
    return new Text(textOptions);
  }

  public loadSymbolCache() {
    // here we had some cordova code. For the moment, we skip that
    return {};

    /**
     * Old code:
      if (!this.symbolCache && window.cordova) {
        this.symbolCache = {}
        this.cacheLoading = [];
        CordovApp.File.listDirectory(
          'FILE/cache/symbols', 
          function(entries){
            for (var i=0, e; e=entries[i]; i++) {
              ol_style_Collaboratif.symbolCache[e.name] = e.nativeURL;
            }
          }
        );
      }
     */
  }

  public getFeatureStyleFn(featureType?: any, cache?: any, options?: any): Style {
    featureType = featureType || {};

    const directionStyle = new Style({
      text: new Text({
        text: '\u203A',
        font: "bold 25px Arial",
      })
    });

    this.loadSymbolCache();

    const style = featureType.style;

  }

  public getUrls(featureType: any): string[] {
    let urls: string[] = [];

    for (let i in featureType.styles) {
      if (featureType.style.externalGraphic) {
        urls[featureType.styles[i].externalGraphic] = featureType.styles[i].uri
      }
      for (let j in featureType.styles[i].children) {
        let child = featureType.styles[i].children[j];
        if (child.externalGraphic) {
          urls[child.externalGraphic] = child.uri;
        }
      }
    }

    return urls;
  }

  public getSymbolURI(featureType: any, name: string, width: number, height: number, feature: Feature): string {
    // var img;
    // var cacheName = name.replace(/\//g,'_')+'_'+width+'x'+height;

    // // Allready in cache
    // if (this.symbolCache && this.symbolCache[cacheName]) {
    //   img = this.symbolCache[cacheName];
    //   return img
    // } else {
    //   // Load Image from server
    //   let stylePictos = this.getUrls(featureType);

    //   if (!stylePictos[name]) {
    //     console.log("Une erreur s'est produite au chargement du pictogramme");
    //     return;
    //   }

    //   if (this.cacheLoading.indexOf(cacheName) != -1) return null;

    //   img = stylePictos[name]
    //     +'?width='+width
    //     +'&height='+height;
    //   // Save symbol if not yet
    //   if (wapp && !this.symbolCache[cacheName]) {
    //     this.cacheLoading.push(cacheName);
    //     wapp.userManager.apiClient.getDocument(img).then((response) => {
    //       CordovApp.File.saveData(response.data, 'FILE/cache/symbols/'+cacheName, (e) => {
    //         // Update symbol cache
    //         ol_style_Collaboratif.symbolCache[e.name] = e.nativeURL;
    //         // Force layer redraw
    //         feature.layer.changed();
    //       });

    //     });
    //   }
    // }
    // return null;
  }

  ///////////////////////
  // CODE BELOW MIGHT NEED TO BE PUT IN A SEPARATE FILE //
  ///////////////////////

  public zombie() {

  }

  public detruit() {

  }

  public vivant() {

  }

  public combine() {

  }

  public troncon_de_route() {

  }

  public sens() {

  }

  public toponyme() {

  }

  public batiment() {

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