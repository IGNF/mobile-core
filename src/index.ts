/**
 * @ign/mobile-core
 * Core library for IGN mobile applications
 */

// Utilities
export * from './utils/EventManager';

// Types
export { Report, ReportPhoto, ReportStatus, ReportFilter } from './types/report';
export { MobileCoreStyle, StyleRule } from './styles/MobileCoreStyle';
export type { ICacheStorage } from './abstracts/ICacheStorage';

// Cache Types
export type {
  CacheMetadata,
  RasterCacheConfig,
  RasterCacheOptions,
  VectorCacheConfig,
  CacheProgress
} from './cache/types';

// Cache Management
export { default as ExtentManager } from './cache/ExtentManager';
export { default as RasterCacheManager } from './cache/RasterCacheManager';

// Sources
export { default as CollabVectorSource } from './sources/CollabVectorSource';
export { default as WFSSource } from './sources/WFSSource';
export { default as ReportSource } from './sources/ReportSource';
export type {
  CollabVectorSourceOptions,
  WFSSourceOptions,
  ReportSourceOptions,
  ReportFilter as SourceReportFilter
} from './sources/types';

// Layers
export { CollabVectorLayer } from './layers/CollabVectorLayer';
export { WFSLayer } from './layers/WFSLayer';
export type {
  CollabVectorLayerOptions,
  WFSLayerOptions
} from './layers/types';

// Report
export { ReportManager } from './report/ReportManager';
export { ReportValidator } from './report/ReportValidator';

// Styles
export { CollabStyler } from './styles/CollabStyler';
export { CollabStylePresets } from './styles/CollabStylePresets';
export { StyleManager } from './styles/StyleManager';