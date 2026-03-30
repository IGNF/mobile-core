/**
 * @ign/mobile-core
 * Core library for IGN mobile applications
 */

// Utilities
export * from './utils/EventManager';

// Types - enums (runtime values)
export {
  ReportStatus,
  ClosedReportStatus
} from './report/types';

// Types - interfaces (type-only)
export type {
  Report,
  ReportPhoto,
  ReportPostParams,
  ReportAttribute,
  ReportManagerOptions,
  ReportManagerParams,
  ReportManagerEvents
} from './report/types';
export type { ReportFilter } from './sources/types';

export type { MobileCoreStyle, StyleRule } from './styles/MobileCoreStyle';
export type { ICacheStorage } from './abstracts/ICacheStorage';
export type { IReportStorage } from './abstracts/IReportStorage';

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
  SourceOptions,
  CollabVectorSourceOptions,
  WFSSourceOptions,
  ReportSourceOptions,
  ReportFilter as SourceReportFilter
} from './sources/types';

// Source constants and error codes
export { COLLAB_VECTOR_DEFAULT_VALUES, WFS_DEFAULT_VALUES } from './sources/DefaultSourceValues';
export { SOURCE_ERROR_CODES } from './sources/ErrorCodes';

// Layers
export { CollabVectorLayer } from './layers/CollabVectorLayer';
export { WFSLayer } from './layers/WFSLayer';
export type {
  CollabVectorLayerOptions,
  WFSLayerOptions
} from './layers/types';

// Collaborative
export { UserManager } from './collaborative/UserManager';
export { DocumentManager } from './collaborative/DocumentManager';
export type {
  CollaborativeDocumentDraft,
  CollaborativeDocumentDraftFile,
} from './collaborative/DocumentManager';
export type {
  User,
  Community,
  CommunityMember,
  CommunityLayer,
  Table,
  TableColumn,
  Geoservice,
  LayerStyle,
  UserManagerConfig,
  UserManagerEvents
} from './collaborative/types';
export type { IUserStorage } from './abstracts/IUserStorage';

// Report
export { ReportManager } from './report/ReportManager';
export { ReportValidator } from './report/ReportValidator';
export { SketchManager } from './report/SketchManager';
export type {
  SketchManagerOptions,
  SketchAction,
  InteractionMode,
  DrawGeometryType,
  ModifyInteractionScope,
  ButtonConfig,
  SketchManagerCallbacks
} from './report/SketchManager';

// Styles
export { CollabStyler } from './styles/CollabStyler';
export type { SymbolCacheEntry, FeatureTypeConfig } from './styles/CollabStyler';
export { CollabStylePresets } from './styles/CollabStylePresets';
export { StyleManager } from './styles/StyleManager';
export { DEFAULT_STYLE, DEFAULT_STYLE_VALUES } from './styles/DefaultStyle';

// Auth
export { AuthManager } from './auth/AuthManager';
export type {
  AuthManagerConfig,
  AuthResult,
  AuthTokens,
  LogoutResult,
  Platform,
  RefreshResult,
  RevokeTokenResult,
  TokenExchangeResult
} from './auth/type';