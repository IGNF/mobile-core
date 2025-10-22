/**
 * OpenLayers layer for WFS
 * Migrated from: ol/layer/WFS.js
 */

import VectorLayer from "ol/layer/Vector";
import { WFSLayerOptions } from "./types";

import PathUtils from "../utils/PathUtils";
import { Table } from "../collaborative/types";
import WFSSource from "../sources/WFSSource";
import { WFSSourceOptions } from "../sources/types";
const pathUtils = new PathUtils();

export class WFSLayer extends VectorLayer {

  private cache?: string;
  private layerOptions?: WFSLayerOptions;

  constructor(options?: WFSLayerOptions, cache?: string) {
    options = options || {} as WFSLayerOptions;
    if (!options.geoservice.input_mask) options.geoservice.input_mask = {};

    if (!options.geoservice?.url) return;

    const superOptions = WFSLayer._computeWFSLayerOptions(options);
    super(superOptions);

    this.cache = cache;
    this.layerOptions = options;

    this.set("authentication", options.username);

    // TODO, in the old code, we seem to use the options for both the layer and the source, which doesn't make sense
    // once implemented, test and find a solution
    

    if (options.getCapabilities !== false) {
      this.getCapabilities(options);
    }
    else {
      this.createSource(options as WFSSourceOptions);
    }
  }

  /**
   * Compute the options to pass to the super constructor of VectorLayer
   * @param options WFS layer options
   * @returns Options to pass to the super constructor of VectorLayer
   */
  private static _computeWFSLayerOptions(options: WFSLayerOptions): any {
    const cachedir = pathUtils.getEscapedDomainFromURL(options.geoservice.url);

    let attributes = options.geoservice.input_mask ? options.geoservice.input_mask.attributes : null;

    return {
      title: options.geoservice.title,
      description: options.geoservice.description,
      visible: options.visibility,
      opacity: options.opacity,
      name: cachedir + ':' + options.geoservice.layers,
      style: options.style || WFSLayer._createWFSStyle(attributes ?? {}),
      search: options.geoservice.input_mask ? options.geoservice.input_mask.searchAttribute : null,
      logo: options.logo
    }
  }

  public async getCapabilities(options: WFSLayerOptions): Promise<void> {
    const authenticationFn = this.layerOptions?.authentication;
    
    // Build URL with query parameters
    const url = new URL(options.geoservice.url);
    url.searchParams.append('service', 'WFS');
    url.searchParams.append('request', 'GetCapabilities');
    
    // Setup headers
    const headers: HeadersInit = {};
    if (options.username && options.password) {
      const credentials = btoa(`${options.username}:${options.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }
    
    // Setup timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(url.toString(), {
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Handle HTTP errors
        this.handleGetCapabilitiesError(
          response.status,
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          response.statusText,
          options,
          authenticationFn
        );
        return;
      }
      
      // Success: create source
      this.createSource(options as WFSSourceOptions, this.cache);
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle network errors and timeouts
      const status = error.name === 'AbortError' ? 0 : 0;
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
    // Unauthorized - try authentication
    if (((status === 0 && !options.username) || status === 401 || status === 500) && typeof authenticationFn === 'function') {
      authenticationFn(this, (login: string, pwd: string) => {
        if (login) {
          options.username = login;
          this.set('authentication', options.username);
          options.password = pwd;
          // Retry getCapabilities
          this.getCapabilities(options);
        } else {
          this.dispatchEvent({ type: "error", error, status, statusText } as any);
        }
      });
    } else if (this.cache) {
      // Cache exists - handle specific error codes
      switch (status) {
        case 403:
        case 404:
        case 500:
        case 503:
          this.dispatchEvent({ type: "error", error, status, statusText } as any);
          break;
        default:
          // Try to load cache anyway
          this.createSource(options as WFSSourceOptions, this.cache);
          break;
      }
    } else {
      // No cache or authentication - dispatch error
      this.dispatchEvent({ type: "error", error, status, statusText } as any);
    }
  }

  public createSource(options: WFSSourceOptions, cache?: any) {
    const source = new WFSSource(options, cache);
    // TODO, there is no table property in the source, see why and how to implement it here
    (source as any).table = {
      attributes: options.geoservice.input_mask?.attributes ?? {}
    }
    this.setSource(source);
    setTimeout(() => this.dispatchEvent({ type: "ready", source: source } as any), 100);
    source.on('addfeature', (e: any) => {
      e.feature._layer = this as any;
    });
  }

  /**
   * Get the table for the WFS layer
   * @returns The table for the WFS layer, or undefined if not ready
   * TODO, see TODO in createSource, we have the same issue here
   */
  public getTable(): Table | undefined {
    const source = this.getSource();
    if (source && source instanceof WFSSource) return (source as any).table;
    return undefined;
  }



  private static _createWFSStyle(attributes: Record<string, any>): any {
    if (attributes && Object.keys(attributes).length > 0) {
      return;
    }
    // to implement in the style manager
  }


}