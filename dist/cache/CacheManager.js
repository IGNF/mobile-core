/**
 * Main facade for cache operations
 * Coordinates raster and vector cache managers
 */
export default class CacheManager {
    constructor(storage, rasterManager, vectorManager) {
        this.storage = storage;
        this.rasterManager = rasterManager;
        this.vectorManager = vectorManager;
        this.RASTER_PREFIX = 'raster:cache:';
        this.VECTOR_PREFIX = 'vector:cache:';
    }
    /**
     * Lists all caches (both raster and vector)
     * @returns Array of all cache metadata
     */
    async listAllCaches() {
        const [rasterCaches, vectorCaches] = await Promise.all([
            this.storage.listMetadata(this.RASTER_PREFIX),
            this.storage.listMetadata(this.VECTOR_PREFIX)
        ]);
        return [...rasterCaches, ...vectorCaches];
    }
    /**
     * Deletes a cache by ID (automatically detects type)
     * @param id - Cache ID (with or without prefix)
     */
    async deleteCache(id) {
        // Determine cache type by checking metadata with both prefixes
        const rasterKey = id.startsWith(this.RASTER_PREFIX) ? id : this.RASTER_PREFIX + id;
        const vectorKey = id.startsWith(this.VECTOR_PREFIX) ? id : this.VECTOR_PREFIX + id;
        const [rasterMetadata, vectorMetadata] = await Promise.all([
            this.storage.getMetadata(rasterKey),
            this.storage.getMetadata(vectorKey)
        ]);
        if (rasterMetadata) {
            // It's a raster cache - extract the ID without prefix
            const cacheId = rasterKey.replace(this.RASTER_PREFIX, '');
            await this.rasterManager.deleteCache(cacheId);
        }
        else if (vectorMetadata) {
            // It's a vector cache - extract the ID without prefix
            const cacheId = vectorKey.replace(this.VECTOR_PREFIX, '');
            await this.vectorManager.deleteCache(cacheId);
        }
        else {
            throw new Error(`Cache not found: ${id}`);
        }
    }
    /**
     * Gets cache information by ID
     * @param id - Cache ID (with or without prefix)
     * @returns Cache metadata or null if not found
     */
    async getCacheInfo(id) {
        // Try both prefixes
        const rasterKey = id.startsWith(this.RASTER_PREFIX) ? id : this.RASTER_PREFIX + id;
        const vectorKey = id.startsWith(this.VECTOR_PREFIX) ? id : this.VECTOR_PREFIX + id;
        const [rasterMetadata, vectorMetadata] = await Promise.all([
            this.storage.getMetadata(rasterKey),
            this.storage.getMetadata(vectorKey)
        ]);
        return rasterMetadata || vectorMetadata;
    }
    /**
     * Gets storage information (used and free space)
     * @returns Object with used and free space in bytes
     */
    async getStorageInfo() {
        const [used, free] = await Promise.all([
            this.storage.getUsedSpace(),
            this.storage.getFreeSpace()
        ]);
        return { used, free };
    }
    /**
     * Clears all caches (both raster and vector)
     * WARNING: This will delete all cached data
     */
    async clearAllCaches() {
        const allCaches = await this.listAllCaches();
        // Delete all caches
        await Promise.all(allCaches.map(cache => this.deleteCache(cache.id)));
    }
    /**
     * Gets the raster cache manager instance
     * @returns RasterCacheManager instance
     */
    getRasterManager() {
        return this.rasterManager;
    }
    /**
     * Gets the vector cache manager instance
     * @returns VectorCacheManager instance
     */
    getVectorManager() {
        return this.vectorManager;
    }
}
//# sourceMappingURL=CacheManager.js.map