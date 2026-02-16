/**
 * Styling system for collaborative layers
 * Migrated from: ol/style/Collaboratif.js (749 LOC)
 * 
 * Note:
 * A lot of values are hardcoded here, we could probably create default values for them
 */
import { Feature } from "ol";
import { Circle, Style, Text, Icon, RegularShape } from "ol/style";
import { Fill } from "ol/style";
import { Stroke } from "ol/style";
import { asArray, Color } from "ol/color";
import FillPattern from "ol-ext/style/FillPattern";

import { StyleRule } from "./MobileCoreStyle";

import FontSymbol from "ol-ext/style/FontSymbol";
import { LineString, MultiLineString } from "ol/geom";

import { CollabStylePresets } from "./CollabStylePresets";

type FeatureProperties = Record<string, unknown>;

interface MongoLikeMatcher {
  matches: (properties: FeatureProperties) => boolean;
}

interface StyleRuleWithMatcher extends Omit<StyleRule, 'condition'> {
  condition?: StyleRule['condition'] | string;
  mongo?: MongoLikeMatcher;
  children?: StyleRuleWithMatcher[];
}

interface UserManagerLike {
  apiClient?: {
    getDocument?: (url: string) => Promise<unknown>;
  };
}

function getValueByPath(source: FeatureProperties, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = source;

  for (const key of keys) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = (current as FeatureProperties)[key];
  }

  return current;
}

function areValuesEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let index = 0; index < a.length; index++) {
      if (!areValuesEqual(a[index], b[index])) {
        return false;
      }
    }
    return true;
  }

  return a === b;
}

function evaluateMongoOperator(
  operator: string,
  actualValue: unknown,
  expectedValue: unknown,
  allOperators: FeatureProperties
): boolean {
  switch (operator) {
    case '$eq':
      return areValuesEqual(actualValue, expectedValue);
    case '$ne':
      return !areValuesEqual(actualValue, expectedValue);
    case '$gt':
      return Number(actualValue) > Number(expectedValue);
    case '$gte':
      return Number(actualValue) >= Number(expectedValue);
    case '$lt':
      return Number(actualValue) < Number(expectedValue);
    case '$lte':
      return Number(actualValue) <= Number(expectedValue);
    case '$in': {
      if (!Array.isArray(expectedValue)) return false;
      if (Array.isArray(actualValue)) {
        return actualValue.some((value) =>
          expectedValue.some((candidate) => areValuesEqual(value, candidate))
        );
      }
      return expectedValue.some((candidate) => areValuesEqual(actualValue, candidate));
    }
    case '$nin': {
      if (!Array.isArray(expectedValue)) return false;
      if (Array.isArray(actualValue)) {
        return actualValue.every(
          (value) =>
            !expectedValue.some((candidate) => areValuesEqual(value, candidate))
        );
      }
      return !expectedValue.some((candidate) => areValuesEqual(actualValue, candidate));
    }
    case '$exists':
      return expectedValue ? actualValue !== undefined : actualValue === undefined;
    case '$regex': {
      if (typeof actualValue !== 'string') return false;

      const options =
        typeof allOperators.$options === 'string' ? allOperators.$options : '';
      const regex =
        expectedValue instanceof RegExp
          ? expectedValue
          : new RegExp(String(expectedValue), options);
      return regex.test(actualValue);
    }
    case '$options':
      return true;
    default:
      return false;
  }
}

function evaluateFieldCondition(actualValue: unknown, expectedCondition: unknown): boolean {
  const conditionObject =
    expectedCondition && typeof expectedCondition === 'object'
      ? (expectedCondition as FeatureProperties)
      : null;

  if (!conditionObject) {
    return areValuesEqual(actualValue, expectedCondition);
  }

  const operatorKeys = Object.keys(conditionObject).filter((key) => key.startsWith('$'));
  if (operatorKeys.length === 0) {
    return areValuesEqual(actualValue, expectedCondition);
  }

  for (const operatorKey of operatorKeys) {
    if (
      !evaluateMongoOperator(
        operatorKey,
        actualValue,
        conditionObject[operatorKey],
        conditionObject
      )
    ) {
      return false;
    }
  }

  return true;
}

function evaluateMongoCondition(
  condition: FeatureProperties,
  properties: FeatureProperties
): boolean {
  for (const [key, value] of Object.entries(condition)) {
    if (key === '$and') {
      if (!Array.isArray(value)) return false;
      if (
        !value.every((item) => {
          if (!item || typeof item !== 'object') return false;
          return evaluateMongoCondition(item as FeatureProperties, properties);
        })
      ) {
        return false;
      }
      continue;
    }

    if (key === '$or') {
      if (!Array.isArray(value)) return false;
      if (
        !value.some((item) => {
          if (!item || typeof item !== 'object') return false;
          return evaluateMongoCondition(item as FeatureProperties, properties);
        })
      ) {
        return false;
      }
      continue;
    }

    if (key === '$nor') {
      if (!Array.isArray(value)) return false;
      if (
        value.some((item) => {
          if (!item || typeof item !== 'object') return false;
          return evaluateMongoCondition(item as FeatureProperties, properties);
        })
      ) {
        return false;
      }
      continue;
    }

    if (key === '$not') {
      if (!value || typeof value !== 'object') return false;
      if (evaluateMongoCondition(value as FeatureProperties, properties)) {
        return false;
      }
      continue;
    }

    const actualValue = getValueByPath(properties, key);
    if (!evaluateFieldCondition(actualValue, value)) {
      return false;
    }
  }

  return true;
}

function createMongoMatcher(condition: unknown): MongoLikeMatcher | undefined {
  let normalizedCondition = condition;

  if (typeof normalizedCondition === 'string') {
    try {
      normalizedCondition = JSON.parse(normalizedCondition);
    } catch {
      return undefined;
    }
  }

  if (!normalizedCondition || typeof normalizedCondition !== 'object') {
    return undefined;
  }

  const conditionObject = normalizedCondition as FeatureProperties;
  return {
    matches: (properties: FeatureProperties) =>
      evaluateMongoCondition(conditionObject, properties),
  };
}

function ensureStyleMatcher(styleRule: StyleRuleWithMatcher): void {
  if (styleRule.mongo?.matches) {
    return;
  }

  const matcher = createMongoMatcher(styleRule.condition);
  if (matcher) {
    styleRule.mongo = matcher;
  }
}

function getResponseContentType(headers: unknown): string {
  if (!headers || typeof headers !== 'object') {
    return 'image/png';
  }

  const record = headers as Record<string, unknown>;
  const value = record['content-type'] ?? record['Content-Type'];
  return typeof value === 'string' && value.length > 0 ? value : 'image/png';
}

function createObjectUrlFromResponse(response: unknown): string | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const httpResponse = response as {
    data?: unknown;
    headers?: unknown;
  };

  if (httpResponse.data instanceof Blob) {
    return URL.createObjectURL(httpResponse.data);
  }

  if (httpResponse.data instanceof ArrayBuffer) {
    const blob = new Blob([httpResponse.data], {
      type: getResponseContentType(httpResponse.headers),
    });
    return URL.createObjectURL(blob);
  }

  return null;
}

/**
 * NOTE:
 * 2 functions may cause issues here due to their use of Cordova:
 * - getSymbolURI (line 412 of the original class)
 * - loadSymbolCache (line 263 of the original class)
 * 
 * For the moment, we implemented what was possible
 * We'll see how to deal with that depending on how it has to be used
 */

/**
 * Cache for loaded images to avoid redundant downloads
 */
const imageCache: Record<string, Icon> = {};

/**
 * Symbol cache entry information
 */
export interface SymbolCacheEntry {
  name: string;
  nativeURL: string;
}

/**
 * Feature type configuration
 */
export interface FeatureTypeConfig {
  name?: string;
  style?: StyleRule & { children?: StyleRule[]; directionField?: string };
  styles?: StyleRule[];
  symbo_attribute?: { name: string };
}

export class CollabStyler {

  private _userManager?: UserManagerLike;
  private _symbolCache: Record<string, string> = {};
  private _cacheLoading: string[] = [];
  public defaultStyleFn: (feature: Feature, resolution: number) => Style | Style[];
  public presets: CollabStylePresets;

  constructor(userManager?: UserManagerLike) {
    // UserManager is optional - only needed for symbol loading from API
    // If not provided, external graphic features will fall back to default styling
    this._userManager = userManager;
    this.presets = new CollabStylePresets(this);
    this.defaultStyleFn = this.getFeatureStyleFn();
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
   * Static factory method to get a style function for a collaborative layer
   * Creates a CollabStyler instance and returns its style function
   * 
   * @param table The table configuration
   * @param cacheUrl The cache URL for resources
   * @param sourceOptions Additional source options (can include userManager for symbol loading)
   * @returns Style function compatible with OpenLayers StyleLike
   */
  public static getFeatureStyleFunction(table: any, cacheUrl: string, sourceOptions: any): (feature: Feature, resolution: number) => Style | Style[] {
    const userManager = sourceOptions?.userManager;
    const styler = new CollabStyler(userManager);
    return styler.getFeatureStyleFn(table, cacheUrl, sourceOptions);
  }

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
      const colorArray: Color = asArray(fill.getColor() as Color);
      if (colorArray.length) {
        colorArray[3] = Number(fstyle.fillOpacity); // fourth element is the opacity
        fill.setColor(colorArray);
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
   * Creates point symbols from images, circles, or font icons
   * @param olStyle The OpenLayers style to modify
   * @param fstyle The feature style configuration
   * @param feature The feature being styled (unused for now)
   */
  public setImage(olStyle: Style, fstyle: StyleRule, feature: Feature): void {
    // old code - needs refactoring for modern usage:
    let image: Circle | Icon | RegularShape | undefined;
    let img: string | undefined;
    // TODO: .img seems to be a legacy property, see if it's still the way to use it
    if (fstyle.img) {
      img = fstyle.img
    } else if (fstyle.externalGraphic && fstyle.externalGraphic !== 'undefined') {
      img = fstyle.uri + '?width=' + fstyle.graphicWidth + '&height=' + fstyle.graphicWidth;
    }
    if (img) {
      if (imageCache[img]) { // TODO: see where this is loaded, for the moment it's not
        image = imageCache[img];
      } else {
        // Test download
        const i = new Image();
        // Save cache Image
        i.addEventListener('load', () => {
          imageCache[img!] = new Icon({ src: img! });
          olStyle.setImage(imageCache[img!]);
          // Note: feature.layer doesn't exist in OpenLayers 10+
          // We replaced 'feature.layer.changed();' with 'feature.changed();'
          // see if it's still correct of if it creates issues
          feature.changed();
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
        rectangle: [4, radius, undefined, Math.PI / 4] // added
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
          image = new FontSymbol({
            glyph: this.getGlyph(fstyle.graphicName),
            radius: radius,
            rotation: Math.PI,
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

  /**
   * This function was using Cordova to load symbols from the file system.
   * Instead of calling Capacitor here (we want to separate the logic)
   * We're passing the directory list as parameter
   * 
   * To understand more about that, see the ol/style/Collaboratif.js file, line 263
   * @param entries Array of symbol cache entries with name and nativeURL
   */
  public loadSymbolCache(entries: SymbolCacheEntry[]): void {
    this._cacheLoading = [];
    for (let i = 0, entry; entry = entries[i]; i++) {
      this._symbolCache[entry.name] = entry.nativeURL;
    }
  }

  /** Get ol style function as defined in featureType
   * 
   * @param featureType Feature type configuration with style rules
   * @param cache Cache configuration (unused for now)
   * @param options Additional options including directoryList for symbol cache
   * @returns A style function that takes (feature, resolution) and returns Style or Style[]
   */
  public getFeatureStyleFn(featureType?: FeatureTypeConfig, _cache?: any, options?: { directoryList?: SymbolCacheEntry[] }): (feature: Feature, resolution: number) => Style | Style[] {
    featureType = featureType || {};

    // Direction style for showing circulation arrows on roads
    const directionStyle = new Style({
      text: new Text({
        text: '\u203A',
        font: "bold 25px Arial",
      })
    });

    return (feature: Feature, res: number): Style | Style[] => {
      // so, here should pass in parameter the directory list fetched from capacitor
      if (options?.directoryList) {
        this.loadSymbolCache(options.directoryList);
      }

      // Check if this feature type has a custom style method (e.g., zombie, vivant, etc.)
      if (!featureType.style && featureType.name) {
        // Try to call a named method on presets (e.g., this.presets.zombie, this.presets.vivant)
        const methodName = featureType.name as keyof CollabStylePresets;
        if (typeof this.presets[methodName] === 'function') {
          // Call the custom style method which should return a style function
          const customFn = (this.presets[methodName] as any)(featureType);
          if (typeof customFn === 'function') {
            return customFn(feature);
          }
        }
      }

      // Handle conditional styles with children (e.g., style roads differently based on speed limit)
      let style = featureType.style as StyleRuleWithMatcher | undefined;
      if (featureType.style?.children) {
        const props = feature.getProperties();
        delete props.geometry;

        // Find the first matching child style based on feature property conditions
        for (let i = 0; i < featureType.style.children.length; i++) {
          const child = featureType.style.children[i] as StyleRuleWithMatcher;

          ensureStyleMatcher(child);
          if (child.mongo?.matches && child.mongo.matches(props as FeatureProperties)) {
            style = child;
            break;
          }
        }
      }

      // Format the style with feature properties
      const fstyle = this.formatFeatureStyle((style || {}) as StyleRule, feature);

      // Handle symbol libraries
      if (style?.name) {
        const defaultIconSize = 16; // Default icon size
        if (featureType.symbo_attribute) {
          fstyle.radius = 5;
          fstyle.img = this.getSymbolURI(
            featureType,
            style.name + '/' + feature.get(featureType.symbo_attribute.name),
            style.graphicWidth || defaultIconSize,
            style.graphicHeight || defaultIconSize,
            feature
          );
        } else if (style.externalGraphic) {
          fstyle.radius = 5;
          fstyle.img = this.getSymbolURI(
            featureType,
            style.externalGraphic,
            style.graphicWidth || defaultIconSize,
            style.graphicHeight || defaultIconSize,
            feature
          );
        }
      }

      // Create the OpenLayers style
      const olStyle = new Style({});
      const textStyle = this.text(fstyle);
      if (textStyle) olStyle.setText(textStyle);

      this.setImage(olStyle, fstyle, feature);

      const fillStyle = this.fill(fstyle);
      if (fillStyle) olStyle.setFill(fillStyle);

      const strokeStyle = this.stroke(fstyle);
      if (strokeStyle) olStyle.setStroke(strokeStyle);

      // Add direction arrows for linear features at high zoom levels
      let directionField: any;
      if (featureType.style?.directionField) {
        try {
          directionField = JSON.parse(featureType.style.directionField);
        } catch (e) {
          directionField = null;
          console.log("bad json direction field for style " + featureType.style.name);
        }
      }

      // Only show direction at high zoom (res < 2)
      if (res < 2 && directionField && typeof directionField === 'object') {
        if ('attribute' in directionField && 'sensDirect' in directionField && 'sensInverse' in directionField) {
          const direct: string = directionField.sensDirect;
          const inverse: string = directionField.sensInverse;

          // Calculate rotation angle for direction arrow based on line geometry
          // Arrow points along the line at its midpoint
          const lrot = (sens: string, geom: LineString | MultiLineString): number => {
            if (sens !== direct && sens !== inverse) return 0;

            let geometry: LineString | MultiLineString = geom;
            if (geom instanceof MultiLineString) {
              geometry = geom.getLineString(0);
            }

            const coords = geometry.getCoordinates();
            let x: number = 0, y: number = 0, dl: number = 0;
            const length = geometry.getLength();

            // Walk along segments until we reach the middle of the line
            for (let i = 0; i < coords.length - 1; i++) {
              x = (coords[i + 1][0] as number) - (coords[i][0] as number);
              y = (coords[i + 1][1] as number) - (coords[i][1] as number);
              dl += Math.sqrt(x * x + y * y);
              if (dl >= length / 2) break;
            }

            // Return rotation angle based on direction (direct vs inverse)
            if (sens === direct) {
              return -Math.atan2(y, x);
            } else {
              return Math.PI - Math.atan2(y, x);
            }
          };

          const sens = feature.get(directionField.attribute);
          if (sens === direct || sens === inverse) {
            const geom = feature.getGeometry();
            if (geom && (geom instanceof LineString || geom instanceof MultiLineString)) {
              const rotation = lrot(sens, geom);
              directionStyle.getText()?.setRotation(rotation);
              return [olStyle, directionStyle];
            }
          }
        }
      }

      return olStyle;
    };
  }

  /**
   * Return the urls of the symbols used for a feature type
   * @param featureType the feature type configuration
   * @returns Record mapping symbol names to their URIs
   */
  public getUrls(featureType: FeatureTypeConfig): Record<string, string> {
    const urls: Record<string, string> = {};

    if (!featureType.styles) return urls;

    for (const i in featureType.styles) {
      const style = featureType.styles[i] as any;
      if (style.externalGraphic && style.uri) {
        urls[style.externalGraphic] = style.uri;
      }
      if (style.children) {
        for (const j in style.children) {
          const child = style.children[j];
          if (child.externalGraphic && child.uri) {
            urls[child.externalGraphic] = child.uri;
          }
        }
      }
    }

    return urls;
  }
  /** 
   * Get image uri and save to cache if not already done
   * 
   * Note: This method requires a properly initialized UserManager to load symbols from API.
   * If UserManager is not provided, it will return null and features will use fallback styling.
   * 
   * @param featureType Feature type configuration
   * @param name Symbol name
   * @param width Symbol width
   * @param height Symbol height
   * @param feature The feature being styled
   * @returns Symbol URI from cache, or null if not yet loaded
   */
  public getSymbolURI(featureType: FeatureTypeConfig, name: string, width: number, height: number, feature: Feature): string | null {
    const cacheName = name.replace(/\//g, '_') + '_' + width + 'x' + height;

    // Already in cache
    if (this._symbolCache[cacheName]) {
      return this._symbolCache[cacheName];
    }

    const stylePictos = this.getUrls(featureType);

    if (!stylePictos[name]) {
      console.warn("Symbol not found in feature type styles:", name);
      return null;
    }

    if (this._cacheLoading.indexOf(cacheName) !== -1) return null;

    // Check if UserManager is available for API calls
    const getDocument = this._userManager?.apiClient?.getDocument;
    if (typeof getDocument !== 'function') {
      console.warn("UserManager not initialized - cannot load symbol from API");
      return null;
    }

    const img = stylePictos[name] + '?width=' + width + '&height=' + height;

    this._cacheLoading.push(cacheName);

    getDocument(img)
      .then((response) => {
        const objectUrl = createObjectUrlFromResponse(response);
        if (!objectUrl) {
          return;
        }

        this._symbolCache[cacheName] = objectUrl;
        feature.changed();
      })
      .catch((error) => {
        console.warn('Failed to load symbol from API', error);
      })
      .finally(() => {
        const index = this._cacheLoading.indexOf(cacheName);
        if (index !== -1) {
          this._cacheLoading.splice(index, 1);
        }
      });

    return null;
  }

  /**
   * Get the glyph for a graphic
   * @param graphicName the name of the graphic
   * @returns the glyph for the graphic
   */
  public getGlyph(graphicName: string): string | null {
    switch (graphicName) {
      case "lightning": return "fa-bolt";
      case "church": return "fa-venus";
      default: return null;
    }
  }

}
