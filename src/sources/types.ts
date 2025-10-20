import { ApiClient } from "collaboratif-client-api";
import { Collection, Feature } from "ol";
import { Geoservice, Table } from "../collaborative/types";
import { ReportStatus } from "../types/report";

import { LoadingStrategy } from "ol/source/Vector";

export interface SourceOptions {
  maxReload?: number;
  tileSize?: number;
  wrapX?: boolean;
  attribution?: string;
  filter?: Record<string, any>; // redefine type maybe
  strategy: LoadingStrategy; // redefine type maybe
  tileZoom?: number;
  maxFeatures?: number;
}

/**
 * CollabVector source options
 */
export interface CollabVectorSourceOptions extends SourceOptions {
  table: Table;
  client: ApiClient;
  cacheUrl?: string;
  online?: boolean;
  outputFormat?: 'CSV' | 'JSON';
  preserved?: Collection<Feature>;
  logo?: string;
}

/**
 * WFS source options
 */
export interface WFSSourceOptions extends SourceOptions {
  geoservice: Geoservice;
  username?: string;
  password?: string;
  minZoom?: number;
  proxy: string;
  cache?: string; // Cache directory path
  srs?: string;
  // authentication?: (callback: (username: string, password: string) => void) => void;
  // getCapabilities?: boolean; // Fetch capabilities
}

/**
 * Report filter
 */
export interface ReportFilter {
  themeIds?: number[];
  status?: ReportStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  userId?: number;
}