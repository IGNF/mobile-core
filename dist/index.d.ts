/**
 * @ign/mobile-core
 * Core library for IGN mobile applications
 */
export * from './utils/EventManager';
export { ReportStatus, ClosedReportStatus } from './report/types';
export type { Report, ReportPhoto, ReportPostParams, ReportAttribute, ReportManagerOptions, ReportManagerParams, ReportManagerEvents } from './report/types';
export type { ReportFilter } from './sources/types';
export type { MobileCoreStyle, StyleRule } from './styles/MobileCoreStyle';
export type { ICacheStorage } from './abstracts/ICacheStorage';
export type { IReportStorage } from './abstracts/IReportStorage';
export type { CacheMetadata, RasterCacheConfig, RasterCacheOptions, VectorCacheConfig, CacheProgress } from './cache/types';
export { default as ExtentManager } from './cache/ExtentManager';
export { default as RasterCacheManager } from './cache/RasterCacheManager';
export { default as CollabVectorSource } from './sources/CollabVectorSource';
export { default as WFSSource } from './sources/WFSSource';
export { default as ReportSource } from './sources/ReportSource';
export type { SourceOptions, CollabVectorSourceOptions, WFSSourceOptions, ReportSourceOptions, ReportFilter as SourceReportFilter } from './sources/types';
export { COLLAB_VECTOR_DEFAULT_VALUES, WFS_DEFAULT_VALUES } from './sources/DefaultSourceValues';
export { SOURCE_ERROR_CODES } from './sources/ErrorCodes';
export { CollabVectorLayer } from './layers/CollabVectorLayer';
export { WFSLayer } from './layers/WFSLayer';
export type { CollabVectorLayerOptions, WFSLayerOptions } from './layers/types';
export { UserManager } from './collaborative/UserManager';
export { DocumentManager } from './collaborative/DocumentManager';
export type { CollaborativeDocumentDraft, CollaborativeDocumentDraftFile, } from './collaborative/DocumentManager';
export type { User, Community, CommunityMember, CommunityLayer, Table, TableColumn, Geoservice, LayerStyle, UserManagerConfig, UserManagerEvents } from './collaborative/types';
export type { IUserStorage } from './abstracts/IUserStorage';
export { ReportManager } from './report/ReportManager';
export { ReportValidator } from './report/ReportValidator';
export { SketchManager } from './report/SketchManager';
export type { SketchManagerOptions, SketchAction, InteractionMode, DrawGeometryType, ModifyInteractionScope, ButtonConfig, SketchManagerCallbacks } from './report/SketchManager';
export { CollabStyler } from './styles/CollabStyler';
export type { SymbolCacheEntry, FeatureTypeConfig } from './styles/CollabStyler';
export { CollabStylePresets } from './styles/CollabStylePresets';
export { StyleManager } from './styles/StyleManager';
export { DEFAULT_STYLE, DEFAULT_STYLE_VALUES } from './styles/DefaultStyle';
export { AuthManager } from './auth/AuthManager';
export type { AuthManagerConfig, AuthResult, AuthTokens, LogoutResult, RefreshResult, RevokeTokenResult, TokenExchangeResult } from './auth/type';
//# sourceMappingURL=index.d.ts.map