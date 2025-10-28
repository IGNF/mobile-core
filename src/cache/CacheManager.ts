/**
 * Main facade for cache operations
 * Coordinates raster and vector cache managers
 */

import { ICacheStorage } from '../abstracts/ICacheStorage';
import RasterCacheManager from './RasterCacheManager';
import { CacheMetadata } from './types';
import { VectorCacheManager } from './VectorCacheManager';

export default class CacheManager {
  constructor(private storage: ICacheStorage,
    private rasterManager: RasterCacheManager,
    private vectorManager: VectorCacheManager) {
  }

  async listAllCaches(): Promise<CacheMetadata[]>{
    // to implement
    throw new Error('Not implemented');
  }

  async deleteCache(id: string): Promise<void>{
    // to implement
    throw new Error('Not implemented');
  }

  async getCacheInfo(id: string): Promise<CacheMetadata | null>{
    // to implement
    throw new Error('Not implemented');
  }

  async clearAllCaches(): Promise<void>{
    // to implement
    throw new Error('Not implemented');
  }
}