/**
 * @ign/mobile-core
 * Core library for IGN mobile applications
 */

// Utilities
export * from './utils/EventManager';

// Types
export { Report, ReportPhoto, ReportStatus, ReportFilter } from './types/report';
export { MobileCoreStyle, StyleRule } from './styles/MobileCoreStyle';
export type { ICacheStorage } from './types/cache';

// Cache Types
export type { 
  CacheMetadata, 
  RasterCacheConfig, 
  VectorCacheConfig, 
  CacheProgress 
} from './cache/types';

// Cache Management
export { default as ExtentManager } from './cache/ExtentManager';
export { default as RasterCacheManager, type RasterCacheOptions } from './cache/RasterCacheManager';

// Report
export { ReportManager } from './report/ReportManager';
export { ReportValidator } from './report/ReportValidator';

// Styles
export { CollabStyler } from './styles/CollabStyler';
export { CollabStylePresets } from './styles/CollabStylePresets';
export { StyleManager } from './styles/StyleManager';