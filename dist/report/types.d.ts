import { Fill, Style } from 'ol/style';
import { Feature } from 'ol';
import type { Projection } from 'ol/proj';
/**
 * Report (georep/georem) definition
 */
export interface Report {
    id: number;
    communityId: number;
    themeId: number;
    geometry: string;
    comment: string;
    attributes?: Record<string, any>;
    photos?: ReportPhoto[];
    sketch?: string;
    features?: Feature[];
    status: ReportStatus;
    createdAt: Date;
    modifiedAt?: Date;
    userId?: number;
    author?: {
        id: number;
        username: string;
    };
    closingDate?: Date;
    validator?: {
        id: number;
        username: string;
    };
    commune?: Record<string, any>;
    departement?: Record<string, any>;
    territory?: Record<string, any>;
    deviceVersion?: string;
    inputDevice?: string;
    sketchXml?: string;
    replies?: Record<string, any>;
    attachments?: Record<string, any>;
}
export interface ReportPostParams {
    communityId: number;
    themeId: number;
    geometry: string;
    comment: string;
    attributes?: string;
    photos?: ReportPhoto[];
    photosToSend?: boolean;
    sketch?: string;
    lon?: number;
    lat?: number;
    territory?: string;
    features?: Feature[];
    proj?: Projection;
    insee?: string;
    protocol?: string;
    theme?: string;
    themes?: string;
    version?: string;
}
/**
 * Report photo
 */
export interface ReportPhoto {
    id?: number;
    localPath?: string;
    remotePath?: string;
    uploaded?: boolean;
    thumbnail?: string;
}
/**
 * Report status
 */
export declare enum ReportStatus {
    Draft = "draft",
    Cluster = "cluster",
    Submit = "submit",
    Pending = "pending",
    Pending_Qualification = "pending0",
    Pending_Entry = "pending1",
    Pending_Validation = "pending2",
    Valid = "valid",
    Valid_Already_Treated = "valid0",
    Reject = "reject",
    Reject_Irrelevant = "reject0"
}
export declare enum ClosedReportStatus {
    Valid = "valid",
    Valid_Already_Treated = "valid0",
    Reject = "reject",
    Reject_Irrelevant = "reject0"
}
export declare const BASE_RADIUS = 8;
export declare const baseCircleFill: Fill;
export declare const STATUS_STYLES: Partial<Record<ReportStatus, Style>>;
/**
 * Report attribute definition
 */
export interface ReportAttribute {
    name: string;
    title: string;
    type: 'text' | 'number' | 'select' | 'date' | 'boolean';
    required?: boolean;
    options?: string[];
    defaultValue?: any;
}
/**
 * Report Manager configuration options
 */
export interface ReportManagerOptions {
    communityId?: number;
    themeId?: number;
    projection?: string;
    defaultParams?: Partial<ReportManagerParams>;
}
/**
 * Report Manager internal parameters
 */
export interface ReportManagerParams {
    communityId?: number;
    themeId?: number;
    geometry?: string;
    lon?: number;
    lat?: number;
    territory?: string;
    insee?: string;
    protocol?: string;
    theme?: string;
    themes?: string;
    version?: string;
    proj?: Projection;
    georems?: Record<number, any>;
}
/**
 * Report Manager events
 */
export interface ReportManagerEvents {
    'report:created': {
        report: Report;
    };
    'report:updated': {
        report: Report;
    };
    'report:deleted': {
        reportId: number;
    };
    'report:submitted': {
        report: Report;
        serverId: number;
    };
    'report:error': {
        error: Error;
        message: string;
    };
    'attachment:uploading': {
        reportId: number;
        progress: number;
    };
    'attachment:uploaded': {
        reportId: number;
        attachmentId: number;
    };
}
//# sourceMappingURL=types.d.ts.map