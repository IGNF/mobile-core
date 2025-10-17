/**
 * This class is responsible for managing the vector cache
 * 
 */

import ol_layer_Group from 'ol/layer/Group'
import LayerGroup from "ol/layer/Group";

export class VectorCacheManager {
  constructor() {
  }

  /**
   * Get the cache layers for a given guichet and cache
   * 
   * @param guichet: Guichet object (to define)
   * @param cache: Cache object (to define)
   * @returns LayerGroup[]
   */
  async getCacheLayers(guichet: any, cache: any): Promise<LayerGroup[]> {
    throw new Error('Not implemented');
    /**
     * Original code
  cache = cache || [];
  var layers = [];
  var self = this;

  for (var i=0, c; c = this.wapp.param.vectorCache[i]; i++) {
    if (c.id_guichet === guichet.id) {
      var g = new ol_layer_Group({
        title: c.nom, 
        name: c.id_guichet+'-'+c.id, 
        vectorCache: c,
        baseLayer: true 
      });
      var l;
      for (var k=0; l=c.layers[k]; k++) if (l.table) {
        cache.push(l);
        l = this.wapp.layerCollabVector(l, this.getCacheFileName(c,k)+'/', c.extent);
        g.getLayers().push(l);
        // Marquer le layer sur l'objet
        l.getSource().on('addfeature', function (e) {
          e.feature.layer = this; 
        }.bind(l));
      }
      // Red border
      if (g.getLayers().getLength()) {
        layers.push(g);
        l = new ol_layer_Vector({ 
          title: 'extent',
          displayInLayerSwitcher: false,
          source: new ol_source_Vector()
        });
        g.getLayers().push(l);
      }
    }
  }
  return layers;
     */
  }

  // Cache management
  // async createCache(community: Community, tables: Table[], extent: Extent): Promise<string>
  // async deleteCache(id: string): Promise<void>
  // async loadCache(id: string): Promise<Feature[]>

  // // Download management
  // async startDownload(id: string): Promise<void>
  // async cancelDownload(id: string): Promise<void>
  // getDownloadProgress(id: string): CacheProgress | null

  // // Layer generation
  // async getCacheLayers(communityId: number): Promise<LayerGroup[]>

}