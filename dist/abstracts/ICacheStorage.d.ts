import { Feature } from "ol";
import { CacheMetadata, VectorCacheMetadata } from "../cache/types";
/**
 * Storage abstraction for cache operations
 * Implementation provided by consuming app
 *
 * This interface was created to replace the original wapp.param.cacheStorage, which is not possible anymore (no wapp)
 */
export interface ICacheStorage {
    saveTile(key: string, data: Blob): Promise<void>;
    getTile(key: string): Promise<Blob | null>;
    deleteTile(key: string): Promise<void>;
    listTiles(prefix: string): Promise<string[]>;
    saveMetadata(key: string, data: VectorCacheMetadata | CacheMetadata): Promise<void>;
    getMetadata(key: string): Promise<CacheMetadata | null>;
    deleteMetadata(key: string): Promise<void>;
    listMetadata(prefix: string): Promise<VectorCacheMetadata[] | CacheMetadata[]>;
    saveFeatures(layerId: string, features: Feature[]): Promise<void>;
    loadFeatures(layerId: string): Promise<Feature[]>;
    deleteFeatures(layerId: string): Promise<void>;
    clear(): Promise<void>;
    getUsedSpace(): Promise<number>;
    getFreeSpace(): Promise<number>;
}
//# sourceMappingURL=ICacheStorage.d.ts.map