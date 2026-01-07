import { ApiClient } from "collaboratif-client-api";
import { Collection, Feature } from "ol";
import { Geoservice, Table } from "../collaborative/types";
import { ReportStatus } from "../report/types";
import { LoadingStrategy } from "ol/source/Vector";
export interface SourceOptions {
    maxReload?: number;
    tileSize?: number;
    wrapX?: boolean;
    attribution?: string;
    filter?: Record<string, any>;
    strategy: LoadingStrategy;
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
    cache?: any;
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
    once?: boolean;
    minZoom?: number;
    proxy: string;
    cache?: string;
    srs?: string;
    table?: Table;
}
/**
 * Report source options
 */
export interface ReportSourceOptions {
    client: ApiClient;
    communityId?: number;
    projection?: string;
    tileZoom?: number;
    filter?: ReportFilter;
    cache?: any;
    loadClosed?: boolean;
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
//# sourceMappingURL=types.d.ts.map