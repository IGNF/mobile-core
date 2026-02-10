/**
 * OpenLayers layer for WFS
 * Migrated from: ol/layer/WFS.js
 */

import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';
import { Feature, View } from 'ol';
import { Geometry } from 'ol/geom';
import FillPattern from 'ol-ext/style/FillPattern';
import { WFSLayerOptions } from './types';
import { WFS_STYLE_DEFAULTS } from './DefaultLayersValues';

import PathUtils from '../utils/PathUtils';
import { Table } from '../collaborative/types';
import WFSSource from '../sources/WFSSource';
import { WFSSourceOptions } from '../sources/types';
const pathUtils = new PathUtils();

export class WFSLayer extends VectorLayer {

  private cache?: string;
  private layerOptions?: WFSLayerOptions;

  constructor(options?: WFSLayerOptions, cache?: string) {
    options = options || {} as WFSLayerOptions;
    if (!options.geoservice) {
      options.geoservice = {} as any;
    }
    if (!options.geoservice.input_mask) {
      options.geoservice.input_mask = {};
    }

    const superOptions = WFSLayer._computeWFSLayerOptions(options);
    super(superOptions);

    if (!options.geoservice?.url) {
      console.error('WFSLayer: geoservice.url is required');
      return;
    }

    this.cache = cache;
    this.layerOptions = options;

    this.set('authentication', options.username);

    if (options.getCapabilities !== false) {
      void this.getCapabilities(options);
    }
    else {
      this.createSource(options as WFSSourceOptions, this.cache);
    }

    const view = new View();
    const geoserviceAny = options.geoservice as any;
    const maxZoom = geoserviceAny.maxZoom ?? geoserviceAny.max_zoom;
    const minZoom = geoserviceAny.minZoom ?? geoserviceAny.min_zoom;

    if (maxZoom && maxZoom < 20) {
      view.setZoom(maxZoom);
      this.setMinResolution(view.getResolution() ?? 0);
    }
    if (minZoom || minZoom === 0) {
      view.setZoom(minZoom);
      this.setMaxResolution(view.getResolution() ?? 0);
    }
  }

  /**
   * Compute the options to pass to the super constructor of VectorLayer
   */
  private static _computeWFSLayerOptions(options: WFSLayerOptions): any {
    const cachedir = pathUtils.getEscapedDomainFromURL(options.geoservice.url);

    const attributes = options.geoservice.input_mask ? options.geoservice.input_mask.attributes : null;

    return {
      title: options.geoservice.title,
      description: options.geoservice.description,
      visible: options.visibility,
      opacity: options.opacity,
      name: `${cachedir}:${options.geoservice.layers}`,
      style: options.style || WFSLayer._createWFSStyle(attributes ?? {}),
      search: options.geoservice.input_mask ? options.geoservice.input_mask.searchAttribute : null,
      logo: options.logo
    };
  }

  public async getCapabilities(options: WFSLayerOptions): Promise<void> {
    const authenticationFn = this.layerOptions?.authentication;

    const url = new URL(options.geoservice.url);
    url.searchParams.append('service', 'WFS');
    url.searchParams.append('request', 'GetCapabilities');

    const headers: HeadersInit = {};
    const authorizationHeader = this.getAuthorizationHeader(options);
    if (authorizationHeader) {
      headers['Authorization'] = authorizationHeader;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url.toString(), {
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.handleGetCapabilitiesError(
          response.status,
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          response.statusText,
          options,
          authenticationFn
        );
        return;
      }

      this.createSource(options as WFSSourceOptions, this.cache);

    } catch (error: any) {
      clearTimeout(timeoutId);

      const status = 0;
      const statusText = error.name === 'AbortError' ? 'timeout' : 'error';

      this.handleGetCapabilitiesError(
        status,
        error,
        statusText,
        options,
        authenticationFn
      );
    }
  }

  private getAuthorizationHeader(options: WFSLayerOptions): string | undefined {
    const accessToken = options.accessToken?.trim();
    if (accessToken) {
      const tokenType = options.tokenType?.trim() || 'Bearer';
      return `${tokenType} ${accessToken}`;
    }

    if (options.username && options.password) {
      const credentials = btoa(`${options.username}:${options.password}`);
      return `Basic ${credentials}`;
    }

    return undefined;
  }

  /**
   * Handle errors from getCapabilities request
   */
  private handleGetCapabilitiesError(
    status: number,
    error: Error,
    statusText: string,
    options: WFSLayerOptions,
    authenticationFn?: (layer: any, callback: (login: string, pwd: string) => void) => void
  ): void {
    const hasCredentials = Boolean(options.username && options.password);
    const hasToken = Boolean(options.accessToken?.trim());

    if (
      !hasToken &&
      ((status === 0 && !hasCredentials) || status === 401 || status === 500) &&
      typeof authenticationFn === 'function'
    ) {
      authenticationFn(this, (login: string, pwd: string) => {
        if (login) {
          options.username = login;
          this.set('authentication', options.username);
          options.password = pwd;
          void this.getCapabilities(options);
        } else {
          this.createSource(options as WFSSourceOptions, this.cache);
          this.dispatchEvent({ type: 'error', error, status, statusText } as any);
        }
      });
      return;
    }

    if (this.cache) {
      switch (status) {
        case 403:
        case 404:
        case 500:
        case 503:
          this.dispatchEvent({ type: 'error', error, status, statusText } as any);
          return;
        default:
          break;
      }
    }

    console.warn('[WFSLayer] GetCapabilities failed, fallback to direct GetFeature loader:', error.message);
    this.createSource(options as WFSSourceOptions, this.cache);
    this.dispatchEvent({ type: 'error', error, status, statusText } as any);
  }

  public createSource(options: WFSSourceOptions, cache?: any): void {
    const source = new WFSSource(options, cache);
    source.localProperties.table = {
      attributes: options.geoservice.input_mask?.attributes ?? {}
    };
    this.setSource(source);
    setTimeout(() => this.dispatchEvent({ type: 'ready', source } as any), 100);
    source.on('addfeature', (event: any) => {
      event.feature._layer = this as any;
    });
  }

  /**
   * Get the table for the WFS layer
   */
  public getTable(): Table | undefined {
    const source = this.getSource();
    if (source && source instanceof WFSSource) return source.localProperties.table;
    return undefined;
  }

  /**
   * Create a WFS style function based on feature attributes
   */
  private static _createWFSStyle(attributes: Record<string, any>): Style[] | ((feature: Feature<Geometry>) => Style[]) {
    const defaultFill = new Fill({
      color: WFS_STYLE_DEFAULTS.FILL_COLOR
    });
    const defaultStroke = new Stroke({
      color: WFS_STYLE_DEFAULTS.STROKE_COLOR,
      width: WFS_STYLE_DEFAULTS.STROKE_WIDTH
    });
    const defaultStyles = [
      new Style({
        image: new Circle({
          fill: defaultFill,
          stroke: defaultStroke,
          radius: WFS_STYLE_DEFAULTS.CIRCLE_RADIUS
        }),
        fill: defaultFill,
        stroke: defaultStroke
      })
    ];

    if (!attributes || Object.keys(attributes).length === 0) {
      return defaultStyles;
    }

    const lut: Record<string, string> = {};
    for (const key in attributes) {
      if (attributes[key].title && /^symb@/.test(attributes[key].title)) {
        lut[attributes[key].title] = key;
      }
    }

    const getAttr = (name: string): string => {
      return lut[name] || name;
    };

    return (feature: Feature<Geometry>): Style[] => {
      const cachedStyle = (feature as any).wfsStyle;
      if (cachedStyle) {
        return cachedStyle;
      }

      const symbColor = feature.get(getAttr('symb@sColor'));
      if (!symbColor) {
        return defaultStyles;
      }

      const fillColor = feature.get(getAttr('symb@fColor')) || WFS_STYLE_DEFAULTS.FILL_COLOR;
      const patternType = feature.get(getAttr('symb@fPattern'));

      let fill: Fill | FillPattern;
      if (patternType) {
        const patternAngle = feature.get(getAttr('symb@pAngle'));
        const patternSize = feature.get(getAttr('symb@pWidth'));
        const patternSpacing = feature.get(getAttr('symb@pSpace'));
        const patternColor = feature.get(getAttr('symb@pColor'));

        fill = new FillPattern({
          pattern: patternType,
          color: patternColor || 'transparent',
          fill: new Fill({
            color: fillColor
          }),
          size: patternSize || 2,
          spacing: patternSpacing || 5,
          angle: patternAngle
        });
      } else {
        fill = new Fill({ color: fillColor });
      }

      let text: Text | undefined;
      const label = feature.get(getAttr('symb@label'));
      if (label) {
        const labelColor = feature.get(getAttr('symb@lColor')) || WFS_STYLE_DEFAULTS.LABEL_COLOR;
        const labelStrokeColor = feature.get(getAttr('symb@lsColor')) || WFS_STYLE_DEFAULTS.LABEL_STROKE_COLOR;
        const labelSize = feature.get(getAttr('symb@lSize')) || WFS_STYLE_DEFAULTS.LABEL_SIZE;

        text = new Text({
          text: String(label),
          stroke: new Stroke({
            color: labelStrokeColor,
            width: WFS_STYLE_DEFAULTS.LABEL_STROKE_WIDTH
          }),
          fill: new Fill({
            color: labelColor
          }),
          overflow: false,
          font: `${labelSize}px sans-serif`
        });
      }

      const strokeColor = feature.get(getAttr('symb@sColor')) || WFS_STYLE_DEFAULTS.STROKE_COLOR;
      const strokeWidth = feature.get(getAttr('symb@sWidth')) || WFS_STYLE_DEFAULTS.STROKE_WIDTH;
      const dashString = feature.get(getAttr('symb@sDash'));
      const lineDash = dashString ? dashString.split(',').map((n: string) => parseFloat(n)) : undefined;

      const stroke = new Stroke({
        color: strokeColor,
        width: strokeWidth,
        lineDash: lineDash && lineDash.length > 1 ? lineDash : undefined
      });

      const wfsStyle = [
        new Style({
          image: new Circle({
            fill: defaultFill,
            stroke: defaultStroke,
            radius: WFS_STYLE_DEFAULTS.CIRCLE_RADIUS
          }),
          text,
          fill,
          stroke
        })
      ];

      (feature as any).wfsStyle = wfsStyle;

      return wfsStyle;
    };
  }

}
