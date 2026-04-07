/**
 * This class is responsible for managing the vector cache
 * @migrated from: ol/cache/CacheVector.js
 */
import LayerGroup from "ol/layer/Group";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { createXYZ } from "ol/tilegrid";
import { CollabVectorLayer } from "../layers/CollabVectorLayer";
import { createEmpty } from "ol/extent";
import { COLLAB_VECTOR_DEFAULT_VALUES } from "../sources/DefaultSourceValues";
import PathUtils from "../utils/PathUtils";
const pathUtils = new PathUtils();
export class VectorCacheManager {
    constructor(storage, apiClient) {
        this.storage = storage;
        this.apiClient = apiClient;
        this.CACHE_PREFIX = 'vector:cache:';
    }
    getLayerCacheNamespace(cache, layer) {
        const explicitNamespace = layer.cacheNamespace?.trim();
        if (explicitNamespace) {
            return pathUtils.sanitizeFileName(explicitNamespace);
        }
        return pathUtils.sanitizeFileName(`vector-cache-${cache.id_guichet}-${cache.id}-${layer.database}-${layer.name}`);
    }
    getLayerFeatureCacheKeys(cache, layer) {
        const explicitNamespace = layer.cacheNamespace?.trim();
        const namespaces = explicitNamespace
            ? [this.getLayerCacheNamespace(cache, layer)]
            : [`${layer.database}:${layer.name}`];
        const extents = this.getCacheExtents(cache);
        const tileZoom = Number(layer.table?.tileZoomLevel);
        if (!Number.isFinite(tileZoom) || extents.length === 0) {
            return namespaces;
        }
        const tileGrid = createXYZ({
            tileSize: COLLAB_VECTOR_DEFAULT_VALUES.TILE_SIZE,
            minZoom: tileZoom,
            maxZoom: tileZoom,
        });
        const keys = new Set();
        for (const namespace of namespaces) {
            keys.add(namespace);
        }
        for (const extent of extents) {
            const [minX, minY, maxX, maxY] = extent;
            const minTileCoord = tileGrid.getTileCoordForCoordAndZ([minX, minY], tileZoom);
            const maxTileCoord = tileGrid.getTileCoordForCoordAndZ([maxX, maxY], tileZoom);
            const xMin = Math.min(minTileCoord[1], maxTileCoord[1]);
            const xMax = Math.max(minTileCoord[1], maxTileCoord[1]);
            const yMin = Math.min(minTileCoord[2], maxTileCoord[2]);
            const yMax = Math.max(minTileCoord[2], maxTileCoord[2]);
            for (let x = xMin; x <= xMax; x++) {
                for (let y = yMin; y <= yMax; y++) {
                    for (const namespace of namespaces) {
                        keys.add(`${namespace}:${[tileZoom, x, y].join('-')}`);
                    }
                }
            }
        }
        return Array.from(keys);
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
                    const layerKeys = this.getLayerFeatureCacheKeys(cacheMetadata, layer);
                    for (const layerKey of layerKeys) {
                        await this.storage.deleteFeatures(layerKey);
                    }
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
        const cacheId = String(maxId + 1);
        const normalizedLayers = layers.map((layer) => ({
            ...layer,
            cacheNamespace: this.getLayerCacheNamespace({ id: cacheId, id_guichet: guichet.id }, layer),
        }));
        const now = new Date();
        const cache = {
            id: cacheId,
            name: name,
            type: 'vector',
            created: now,
            modified: now,
            size: 0,
            id_guichet: guichet.id,
            nom: name,
            layers: normalizedLayers,
            extent: createEmpty(),
            projection: 'EPSG:3857' // see if it's correct
        };
        await this.storage.saveMetadata(this.CACHE_PREFIX + cache.id, cache);
    }
    getCacheExtents(cache) {
        if (Array.isArray(cache.extents) && cache.extents.length > 0) {
            return cache.extents.filter((extent) => this.isValidExtent(extent));
        }
        return cache.extent && this.isValidExtent(cache.extent) ? [cache.extent] : [];
    }
    isValidExtent(extent) {
        return extent.every(Number.isFinite) && extent[0] <= extent[2] && extent[1] <= extent[3];
    }
}
//# sourceMappingURL=VectorCacheManager.js.map