/**
 * Main facade for cache operations
 * Coordinates raster and vector cache managers
 */
import { ICacheStorage } from '../abstracts/ICacheStorage';
import RasterCacheManager from './RasterCacheManager';
import { CacheMetadata } from './types';
import { VectorCacheManager } from './VectorCacheManager';
export default class CacheManager {
    private storage;
    private rasterManager;
    private vectorManager;
    private readonly RASTER_PREFIX;
    private readonly VECTOR_PREFIX;
    constructor(storage: ICacheStorage, rasterManager: RasterCacheManager, vectorManager: VectorCacheManager);
    /**
     * Lists all caches (both raster and vector)
     * @returns Array of all cache metadata
     */
    listAllCaches(): Promise<CacheMetadata[]>;
    /**
     * Deletes a cache by ID (automatically detects type)
     * @param id - Cache ID (with or without prefix)
     */
    deleteCache(id: string): Promise<void>;
    /**
     * Gets cache information by ID
     * @param id - Cache ID (with or without prefix)
     * @returns Cache metadata or null if not found
     */
    getCacheInfo(id: string): Promise<CacheMetadata | null>;
    /**
     * Gets storage information (used and free space)
     * @returns Object with used and free space in bytes
     */
    getStorageInfo(): Promise<{
        used: number;
        free: number;
    }>;
    /**
     * Clears all caches (both raster and vector)
     * WARNING: This will delete all cached data
     */
    clearAllCaches(): Promise<void>;
    /**
     * Gets the raster cache manager instance
     * @returns RasterCacheManager instance
     */
    getRasterManager(): RasterCacheManager;
    /**
     * Gets the vector cache manager instance
     * @returns VectorCacheManager instance
     */
    getVectorManager(): VectorCacheManager;
}
//# sourceMappingURL=CacheManager.d.ts.map