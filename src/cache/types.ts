import { Extent } from 'ol/extent';

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