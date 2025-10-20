import { ApiClient } from "collaboratif-client-api";
import { Collection, Feature } from "ol";
import { Table } from "../collaborative/types";
import { ReportStatus } from "../types/report";

import { tile, bbox } from 'ol/loadingstrategy'

/**
 * CollabVector source options
 */
export interface CollabVectorSourceOptions {
  table: Table; // ok
  client: ApiClient; // ok
  cacheUrl?: string; // ok
  online?: boolean; // ok
  maxFeatures?: number; // ok
  maxReload?: number; // Max features before forced reload
  outputFormat?: 'CSV' | 'JSON'; // ok
  tileZoom?: number; // ok
  tileSize?: number; // ok, default 256
  filter?: Record<string, any>; // ok, redefine type maybe
  preserved?: Collection<Feature>; // ok
  strategy: typeof tile | typeof bbox; // ok, redefine type maybe
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