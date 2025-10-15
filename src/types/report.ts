import { Feature } from 'ol';

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
}

/**
 * Report photo
 */
export interface ReportPhoto {
  id?: number;
  localPath?: string;
  remotePath?: string;
  uploaded?: boolean;
  thumbnail?: string; // Base64 thumbnail
}

/**
 * Report status
 */
export enum ReportStatus {
  Draft = 'draft',
  Pending = 'pending',
  Submitted = 'submitted',
  Validated = 'validated',
  Rejected = 'rejected'
}

/**
 * Report filter
 */
export interface ReportFilter {
  // to implement
}