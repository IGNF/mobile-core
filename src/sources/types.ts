import { ApiClient } from "collaboratif-client-api";
import { Collection, Feature } from "ol";
import { Table } from "../collaborative/types";
import { ReportStatus } from "../types/report";

import { LoadingStrategy } from "ol/source/Vector";

/**
 * CollabVector source options
 */
export interface CollabVectorSourceOptions {
  table: Table;
  client: ApiClient;
  cacheUrl?: string;
  online?: boolean;
  maxFeatures?: number;
  maxReload?: number;
  outputFormat?: 'CSV' | 'JSON';
  tileZoom?: number;
  tileSize?: number;
  filter?: Record<string, any>; // redefine type maybe
  preserved?: Collection<Feature>;
  strategy: LoadingStrategy; // redefine type maybe
  logo?: string;
  attribution?: string;
  wrapX?: boolean;
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