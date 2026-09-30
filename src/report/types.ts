import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import Text from 'ol/style/Text';
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
  communityId: number; // Consistent naming with Report interface
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
  thumbnail?: string; // Base64 thumbnail
}

/**
 * Report status
 */
export enum ReportStatus {
  Draft = 'draft',
  Cluster = 'cluster',
  Submit = 'submit',
  Pending = 'pending',
  Pending_Qualification = 'pending0',
  Pending_Entry = 'pending1',
  Pending_Validation = 'pending2',
  Valid = 'valid',
  Valid_Already_Treated = 'valid0',
  Reject = 'reject',
  Reject_Irrelevant = 'reject0',
}

export enum ClosedReportStatus {
  Valid = 'valid',
  Valid_Already_Treated = 'valid0',
  Reject = 'reject',
  Reject_Irrelevant = 'reject0',
}

export const BASE_RADIUS = 8;
export const baseCircleFill = new Fill({ color: [255, 255, 255, 0.8] });

export const STATUS_STYLES: Partial<Record<ReportStatus, Style>> = {
  [ReportStatus.Cluster]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [255, 255, 255], width: 3 }),
      fill: baseCircleFill
    }),
    text: new Text({
      font: 'bold 12px Sans-serif',
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: 1,
      fill: new Fill({ color: [255, 255, 255] })
    })
  }),
  [ReportStatus.Pending]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [255, 128, 0], width: 3 }),
      fill: baseCircleFill
    })
  }),
  [ReportStatus.Submit]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [51, 102, 153], width: 3 }),
      fill: baseCircleFill
    })
  }),
  [ReportStatus.Valid]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [0, 192, 0], width: 3 }),
      fill: baseCircleFill
    })
  }),
  [ReportStatus.Reject]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [255, 0, 0], width: 3 }),
      fill: baseCircleFill
    })
  }),
  [ReportStatus.Draft]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [120, 128, 137], width: 3 }),
      fill: baseCircleFill
    })
  }),
  [ReportStatus.Pending_Qualification]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [255, 128, 0], width: 3 }),
      fill: baseCircleFill,
    }),
  }),
  [ReportStatus.Pending_Entry]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [204, 102, 0], width: 3 }),
      fill: baseCircleFill,
    }),
  }),
  [ReportStatus.Pending_Validation]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [255, 170, 77], width: 3 }),
      fill: baseCircleFill,
    }),
  }),
  [ReportStatus.Valid_Already_Treated]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [0, 140, 0], width: 3 }),
      fill: baseCircleFill,
    }),
  }),
  [ReportStatus.Reject_Irrelevant]: new Style({
    image: new CircleStyle({
      radius: BASE_RADIUS,
      stroke: new Stroke({ color: [180, 0, 0], width: 3 }),
      fill: baseCircleFill,
    }),
  }),
};

/**
 * Report attribute definition
 */
export interface ReportAttribute {
  name: string;
  title: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  required?: boolean;
  options?: string[]; // For select type
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
  proj?: Projection; // Projection for geometry transformations
  georems?: Record<number, any>; // Photo attachments indexed by timestamp
}

/**
 * Report Manager events
 */
export interface ReportManagerEvents {
  'report:created': { report: Report };
  'report:updated': { report: Report };
  'report:deleted': { reportId: number };
  'report:submitted': { report: Report; serverId: number };
  'report:error': { error: Error; message: string };
  'attachment:uploading': { reportId: number; progress: number };
  'attachment:uploaded': { reportId: number; attachmentId: number };
}