/**
 * This class is responsible for managing the vector cache
 * @migrated from: ol/cache/CacheVector.js
 */
import LayerGroup from "ol/layer/Group";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import { ApiClient } from 'collaboratif-client-api';

import { ICacheStorage } from '../abstracts/ICacheStorage';
import { VectorCacheMetadata } from "./types";
import { CollabVectorLayer } from "../layers/CollabVectorLayer";
import { Community } from "../collaborative/types";
import { createEmpty } from "ol/extent";

export class VectorCacheManager {
  private readonly CACHE_PREFIX = 'vector:cache:';

  constructor(private storage: ICacheStorage, private apiClient: ApiClient) {

  }

  /**
   * Get the cache layers for a given guichet and cache
   * 
   * @migrated from getLayers function
   * 
   * @param guichet: Guichet object (to define)
   * @param cache: Cache object (to define)
   * @returns LayerGroup[]
   */
  async getCacheLayers(guichet: any, cache: any): Promise<LayerGroup[]> {
    cache = cache || [];
    const layers: LayerGroup[] = [];

    const cacheMetadataList = await this.storage.listMetadata(this.CACHE_PREFIX) as VectorCacheMetadata[];
    for (const cacheMetadata of cacheMetadataList) {
      if (cacheMetadata.id_guichet === guichet.id) {
        const layerGroup = new LayerGroup({
          properties: {
            title: cacheMetadata.nom,
            name: cacheMetadata.id_guichet + '-' + cacheMetadata.id,
            vectorCache: cacheMetadata,
            baseLayer: true
          }
        });

        for (const layer of cacheMetadata.layers) {
          if (layer.table) {
            // see what to do here:
            // l = this.wapp.layerCollabVector(l, this.getCacheFileName(c,k)+'/', c.extent);
            const layerBase = new CollabVectorLayer(layer, {
              properties: {
                name: layer.name,
                tableId: layer.table.id,
                extent: cacheMetadata.extent,
                projection: cacheMetadata.projection
              }
            });
            layerGroup.getLayers().push(layerBase);

            // not implemented from the original code
            // l.getSource().on('addfeature', function (e) {
            //   e.feature.layer = this; 
            // }.bind(l));
          }
        }

        if (layerGroup.getLayers().getLength()) {
          layers.push(layerGroup);
          const extentLayer = new VectorLayer({
            properties: {
              title: 'extent',
              displayInLayerSwitcher: false
            },
            source: new VectorSource()
          });
          layerGroup.getLayers().push(extentLayer);
        }
      }
    }
    return layers;
  }

  /**
   * Delete a cache
   * @migrated from removeCache function
   * 
   * @param id: Cache id
   */
  async deleteCache(id: string): Promise<void> {
    const cacheKey = this.CACHE_PREFIX + id;
    const cacheMetadata = await this.storage.getMetadata(cacheKey) as VectorCacheMetadata;
    if (!cacheMetadata) {
      return;
    }
    await this.storage.deleteMetadata(cacheKey);
  }

  /**
   * Add a map in cache
   * @param name 
   * @param layers 
   */
  async addCache(name: string, layers: any[]): Promise<void> {
    if (!layers.length) return;
    const user = (await this.apiClient.getUser()).data;
    if (!user) {
      throw new Error('User not found');
    }
    const guichet = user.communities.find((community: Community) => community.active === true);
    if (!guichet) {
      throw new Error('Guichet not found');
    }

    const cacheMetadataList = await this.storage.listMetadata(this.CACHE_PREFIX) as VectorCacheMetadata[];
    const maxId = Math.max(0, ...cacheMetadataList.map((cache: VectorCacheMetadata) => parseInt(cache.id)));
    const now = new Date();
    const cache: VectorCacheMetadata = {
      id: String(maxId + 1),
      name: name,
      type: 'vector',
      created: now,
      modified: now,
      size: 0,
      id_guichet: guichet.id,
      nom: name,
      layers: layers,
      extent: createEmpty(),
      projection: 'EPSG:3857' // see if it's correct
    };

    await this.storage.saveMetadata(this.CACHE_PREFIX, cache);
  }

}