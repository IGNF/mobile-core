/**
 * Collaborative vector layer
 * @migrated from: ol/layer/CollabVector.js
 */
import VectorLayer from 'ol/layer/Vector';

import { DEFAULT_LAYERS_VALUES } from './DefaultLayersValues';
import { CollabVectorLayerOptions } from './types';
import { LayerStyle, Table } from '../collaborative/types';
import CollabVectorSource from '../sources/CollabVectorSource';
import { CollabVectorSourceOptions } from '../sources/types';
import { View } from 'ol';
import { StyleRule } from '../styles/MobileCoreStyle';
import { CollabStyler } from '../styles/CollabStyler';

export class CollabVectorLayer extends VectorLayer<CollabVectorSource> {

  constructor(options: CollabVectorLayerOptions, sourceOptions?: Partial<CollabVectorSourceOptions>) {
    sourceOptions = sourceOptions || {};

    const superOptions = CollabVectorLayer._computeCollabVectorLayerOptions(options);
    super(superOptions);

    this.set('name', `${options.database}:${options.name}`);
    sourceOptions.client = options.client;
    sourceOptions.cacheNamespace = options.cacheNamespace;

    if (options.cacheUrl || options.cacheNamespace) {
      sourceOptions.cacheUrl = options.cacheUrl;
      if (options.cacheUrl && sourceOptions.online == undefined) {
        sourceOptions.online = false;
      }
      this.set('cache', true);
    }

    this.createSource(options, sourceOptions, options.table);
  }

  /**
   * Computes the options for the CollabVector layer
   */
  private static _computeCollabVectorLayerOptions(options: CollabVectorLayerOptions): Record<string, any> {
    return {
      database: options.database,
      name: options.name,
      url: options.url,
      renderMode: options.renderMode || DEFAULT_LAYERS_VALUES.COLLAB_VECTOR_RENDER_MODE,
    };
  }

  /**
   * Creates the source for the CollabVector layer
   */
  public createSource(options: CollabVectorLayerOptions, sourceOptions: Partial<CollabVectorSourceOptions>, table: Table): void {
    const completeSourceOptions: CollabVectorSourceOptions = {
      ...sourceOptions,
      table,
      client: sourceOptions.client || options.client,
    } as CollabVectorSourceOptions;

    const sourceOptionsWithUserManager = completeSourceOptions as CollabVectorSourceOptions & {
      userManager?: { apiClient?: unknown };
    };
    if (!sourceOptionsWithUserManager.userManager && sourceOptionsWithUserManager.client) {
      sourceOptionsWithUserManager.userManager = {
        apiClient: sourceOptionsWithUserManager.client,
      };
    }

    if (options.checkSourceOptions) {
      options.checkSourceOptions(this, completeSourceOptions, table);
    }

    const vectorSource = new CollabVectorSource(completeSourceOptions);
    this.setSource(vectorSource);

    this.set('title', table.title);

    const view = new View();
    const maxZoom = table.maxZoomLevel;
    const minZoom = table.minZoomLevel;

    if (maxZoom && maxZoom < 20) {
      view.setZoom(maxZoom);
      this.setMinResolution(view.getResolution() ?? 0);
    }

    if (minZoom || minZoom === 0) {
      view.setZoom(Math.max(minZoom, 4));
      this.setMaxResolution((view.getResolution() ?? 0) + 1);
    }

    if (table.style && table.style.children) {
      for (const child of table.style.children as StyleRule[]) {
        if (typeof child.condition === 'string') {
          try { child.condition = JSON.parse(child.condition); }
          catch { /* no-op */ }
        }
      }
    }

    if (table.styles && table.styles.length) {
      let found = false;
      table.styles.forEach((st: LayerStyle) => {
        if (table.style && st.id === table.style.id) {
          found = true;
        }
        if (st.children) {
          st.children.forEach((s: StyleRule) => {
            if (typeof s.condition === 'string') {
              try { s.condition = JSON.parse(s.condition); }
              catch { /* no-op */ }
            }
          });
        }
      });

      if (!found && table.style) {
        table.styles.unshift(table.style);
      }
    }

    if (!options.style) {
      const styleFunction = CollabStyler.getFeatureStyleFunction(table, options.cacheUrl ?? '', completeSourceOptions);
      this.setStyle(styleFunction as any);
    }

    this.dispatchEvent({ type: 'ready', source: vectorSource } as any);
  }

  /**
   * Get the table for the CollabVector layer
   */
  public getTable(): Table | undefined {
    const source = this.getSource();
    if (this.isReady() && source) return source.table;
    return undefined;
  }

  /**
   * Get the style for features in this layer
   */
  public getFeatureStyle(): LayerStyle | undefined {
    const source = this.getSource();
    if (this.isReady() && source) return source.table.style;
    return undefined;
  }

  /**
   * Check if the layer is ready (has a source with a table)
   */
  public isReady(): boolean {
    const source = this.getSource();
    return source !== null && source.table !== undefined;
  }

  /**
   * Set the online/offline mode for the layer
   */
  public setOnline(online: boolean): void {
    const source = this.getSource();
    if (!source) return;

    source.localProperties.online = online;

    if (typeof (source as any).reload === 'function') {
      (source as any).reload();
    } else {
      source.refresh();
    }
  }

}
