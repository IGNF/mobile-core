import { Extent } from 'ol/extent';
import { CollabVectorLayerOptions } from '../layers/types';

export interface CacheMetadata {
  id: string;
  name: string;
  type: 'raster' | 'vector';
  created: Date;
  modified: Date;
  size: number; // bytes
  extent?: Extent; // OpenLayers extent [minX, minY, maxX, maxY]
  zoom?: {
    min: number;
    max: number;
  };
  tileCount?: number;
  featureCount?: number;
  projection?: string;
  extra?: Record<string, any>; // Extensible metadata
}

export interface VectorCacheMetadata extends CacheMetadata {
  id_guichet: number;
  nom: string;
  layers: CollabVectorLayerOptions[];
  date?: string;
  extents?: Extent[];
  extentNames?: string[];
  loaded?: boolean;
}

/**
 * Raster cache configuration
 */
export interface RasterCacheConfig {
  id: string;
  name: string;
  layer: string; // Geoportail layer name
  extent: Extent;
  minZoom: number;
  maxZoom: number;
  apiKey?: string;
  authentication?: string;
  projection?: string;
}

/**
 * Raster cache options
 */
export interface RasterCacheOptions {
  apiKey?: string;
  authentication?: string;
  dirName?: string; // Directory name for cache storage (default: "geoportail")
  cacheRoot?: string; // Root path for cache storage
  silentErrors?: boolean; // Don't emit error events (default: false)
}

/**
 * Vector cache configuration
 */
export interface VectorCacheConfig {
  id: string;
  name: string;
  tableId: number;
  extent: Extent;
  projection?: string;
  filter?: Record<string, any>;
}

/**
 * Cache download progress
 */
export interface CacheProgress {
  id: string;
  type: 'raster' | 'vector';
  total: number;
  current: number;
  percent: number;
  status: 'downloading' | 'processing' | 'complete' | 'error' | 'cancelled';
  error?: string;
  bytesDownloaded?: number;
  bytesTotal?: number;
}
