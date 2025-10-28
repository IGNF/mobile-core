import { Feature } from "ol";
import { CacheMetadata, VectorCacheMetadata } from "../cache/types";

/**
 * Storage abstraction for cache operations
 * Implementation provided by consuming app
 * 
 * This interface was created to replace the original wapp.param.cacheStorage, which is not possible anymore (no wapp)
 */
export interface ICacheStorage {
  // Tile operations
  saveTile(key: string, data: Blob): Promise<void>;
  getTile(key: string): Promise<Blob | null>;
  deleteTile(key: string): Promise<void>;
  listTiles(prefix: string): Promise<string[]>;

  // Metadata operations
  saveMetadata(key: string, data: CacheMetadata): Promise<void>;
  getMetadata(key: string): Promise<CacheMetadata | null>;
  deleteMetadata(key: string): Promise<void>;
  listMetadata(prefix: string): Promise<VectorCacheMetadata[] | CacheMetadata[]>;

  // Vector feature operations
  saveFeatures(layerId: string, features: Feature[]): Promise<void>;
  loadFeatures(layerId: string): Promise<Feature[]>;
  deleteFeatures(layerId: string): Promise<void>;

  // Bulk operations
  clear(): Promise<void>;
  getUsedSpace(): Promise<number>; // bytes
  getFreeSpace(): Promise<number>; // bytes
}