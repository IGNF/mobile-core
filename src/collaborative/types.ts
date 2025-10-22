/**
 * Define here the types for the collaborative features
 */

import { StyleRule } from "../styles/MobileCoreStyle";

export interface LayerStyle {
  id?: number;
  name?: string;
  children?: StyleRule[];
}

/**
 * User information
 */
export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  communities: Community[];
  communities_member?: CommunityMember[];
}

export interface CommunityMember {
  id: number;
  community_id: number;
  profile?: any;
}

/**
 * Community (group) information
 */
export interface Community {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  layers?: CommunityLayer[];
  isActive?: boolean;
  profile?: any;
}

/**
 * Community layer definition
 */
export interface CommunityLayer {
  id: number;
  title: string;
  visible?: boolean;
  opacity?: number;
}

/**
 * Table definition
 * TO verify
 */
export interface Table {
  id: number;
  database: string;
  databaseId: number;
  name: string;
  title: string;
  description?: string;
  wfs: string; // WFS endpoint
  geometryName: string;
  projection?: string;
  columns: Record<string, TableColumn>;
  style?: LayerStyle;
  styles?: LayerStyle[]; // Multiple styles
  minZoomLevel?: number;
  maxZoomLevel?: number;
  searchable?: boolean;
  editable?: boolean;
  docURI?: string; // Document upload endpoint
}

/**
 * Table column definition
 * To verify
 */
export interface TableColumn {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'geometry';
  title?: string;
  required?: boolean;
  editable?: boolean;
  searchable?: boolean;
  crs?: string;
  defaultValue?: any;
}

/**
 * Geoservice definition (WFS/WMS)
 */
export interface Geoservice {
  id: number;
  title: string;
  description?: string;
  url: string;
  type: 'WFS' | 'WMS';
  layers: string;
  version?: string;
  format?: string;
  authentication?: boolean;
  input_mask?: {
    id?: number;
    attributes?: Record<string, any>;
    searchAttribute?: string;
  };
  minZoom?: number;
  maxZoom?: number;
}