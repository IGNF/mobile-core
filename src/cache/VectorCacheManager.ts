/**
 * This class is responsible for managing the vector cache
 * @migrated from: ol/cache/CacheVector.js
 */

import LayerGroup from "ol/layer/Group";
import { ICacheStorage } from '../abstracts/ICacheStorage';
import { ApiClient } from 'collaboratif-client-api';
import { VectorCacheMetadata } from "./types";
import { CollabVectorLayer } from "../layers/CollabVectorLayer";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

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
  } catch(error: any) {
    console.error('Error getting cache layers:', error);
    return [];
  }

  async deleteCache(id: string): Promise<void> {
    // console.log('removeCACHE')
    // // Remove in cache list
    // for (var i = this.wapp.param.vectorCache.length - 1; i >= 0; i--) {
    //   if (this.wapp.param.vectorCache[i] === cache) {
    //     this.wapp.param.vectorCache.splice(i, 1);
    //   }
    // }
    // // Remove file on device
    // var dir = this.getCacheFileName(cache);
    // CordovApp.File.getDirectory(dir, function (entry) {
    //   if (entry.isDirectory) entry.removeRecursively();
    // });
    // // Update
    // this.wapp.saveParam();
    // var guichet = this.getCurrentGuichet();
    // if (this.wapp.getIdGuichet() === guichet.id) {
    //   this.wapp.setGuichet(guichet);
    // }
  }

  /**
   * 
   * @param name 
   * @param layers 
   */
  async addCache(name: string, layers: any[]): Promise<void> {
    //   if (!layers.length) return;
    // var guichet = this.getCurrentGuichet();

    // if (!this.wapp.param.vectorCache) this.wapp.param.vectorCache = [];
    // var id = 0;
    // for (var i=0, c; c=this.wapp.param.vectorCache[i]; i++) {
    //   id = Math.max(id, c.id||0);
    // }
    // var cache = {
    //   id: id+1,
    //   id_guichet: guichet.id,
    //   nom: name,
    //   layers: layers,
    //   date: (new Date()).toISODateString(),
    //   extent: ol_extent_createEmpty(),
    //   extents: [],
    //   extentNames: [], // noms de CacheExtent
    //   loaded: false
    // }
    // this.wapp.param.vectorCache.push (cache);
    // this.wapp.saveParam();
  }

}