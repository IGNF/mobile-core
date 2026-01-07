/**
 * This class is responsible for managing the vector cache
 * @migrated from: ol/cache/CacheVector.js
 */
import LayerGroup from "ol/layer/Group";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { CollabVectorLayer } from "../layers/CollabVectorLayer";
import { createEmpty } from "ol/extent";
export class VectorCacheManager {
    constructor(storage, apiClient) {
        this.storage = storage;
        this.apiClient = apiClient;
        this.CACHE_PREFIX = 'vector:cache:';
    }
    /**
     * Get the cache layers for a given community
     *
     * @migrated from getLayers function
     *
     * @param community: Community object with id
     * @returns LayerGroup[]
     */
    async getCacheLayers(community) {
        const layers = [];
        const cacheMetadataList = await this.storage.listMetadata(this.CACHE_PREFIX);
        for (const cacheMetadata of cacheMetadataList) {
            if (cacheMetadata.id_guichet === community.id) {
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
                            // Source options for the collaborative vector
                            cache: this.storage,
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
    async deleteCache(id) {
        const cacheKey = this.CACHE_PREFIX + id;
        const cacheMetadata = await this.storage.getMetadata(cacheKey);
        if (!cacheMetadata) {
            return;
        }
        // Delete cached features for each layer
        if (cacheMetadata.layers) {
            for (const layer of cacheMetadata.layers) {
                try {
                    const layerId = `${id}:${layer.table?.id || layer.name}`;
                    await this.storage.deleteFeatures(layerId);
                }
                catch (error) {
                    console.error(`Failed to delete features for layer ${layer.name}:`, error);
                }
            }
        }
        // Delete metadata
        await this.storage.deleteMetadata(cacheKey);
    }
    /**
     * Add a map in cache
     * @param name
     * @param layers
     */
    async addCache(name, layers) {
        if (!layers.length)
            return;
        const user = (await this.apiClient.getUser()).data;
        if (!user) {
            throw new Error('User not found');
        }
        const guichet = user.communities.find((community) => community.active === true);
        if (!guichet) {
            throw new Error('Guichet not found');
        }
        const cacheMetadataList = await this.storage.listMetadata(this.CACHE_PREFIX);
        // Generate a new unique ID by finding the maximum existing ID and incrementing
        const maxId = Math.max(0, ...cacheMetadataList.map((cache) => parseInt(cache.id)));
        const now = new Date();
        const cache = {
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
        await this.storage.saveMetadata(this.CACHE_PREFIX + cache.id, cache);
    }
}
//# sourceMappingURL=VectorCacheManager.js.map