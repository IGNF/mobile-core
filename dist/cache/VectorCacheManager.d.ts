/**
 * This class is responsible for managing the vector cache
 * @migrated from: ol/cache/CacheVector.js
 */
import LayerGroup from "ol/layer/Group";
import { ApiClient } from 'collaboratif-client-api';
import { ICacheStorage } from '../abstracts/ICacheStorage';
import { VectorCacheMetadata } from "./types";
import { Community } from "../collaborative/types";
export declare class VectorCacheManager {
    private storage;
    private apiClient;
    private readonly CACHE_PREFIX;
    constructor(storage: ICacheStorage, apiClient: ApiClient);
    getLayerCacheNamespace(cache: Pick<VectorCacheMetadata, 'id' | 'id_guichet'>, layer: Pick<VectorCacheMetadata['layers'][number], 'database' | 'name' | 'cacheNamespace'>): string;
    getLayerFeatureCacheKeys(cache: Pick<VectorCacheMetadata, 'id' | 'id_guichet' | 'extent' | 'extents'>, layer: VectorCacheMetadata['layers'][number]): string[];
    /**
     * Get the cache layers for a given community
     *
     * @migrated from getLayers function
     *
     * @param community: Community object with id
     * @returns LayerGroup[]
     */
    getCacheLayers(community: Community): Promise<LayerGroup[]>;
    /**
     * Delete a cache
     * @migrated from removeCache function
     *
     * @param id: Cache id
     */
    deleteCache(id: string): Promise<void>;
    /**
     * Add a map in cache
     * @param name
     * @param layers
     */
    addCache(name: string, layers: any[]): Promise<void>;
    private getCacheExtents;
    private isValidExtent;
}
//# sourceMappingURL=VectorCacheManager.d.ts.map