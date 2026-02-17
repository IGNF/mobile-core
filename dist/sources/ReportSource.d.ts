/**
 * Report source for displaying georep reports on the map
 * Migrated from: ol/source/Report.js
 */
import { ReportSourceOptions } from './types';
import { Feature } from 'ol';
import { Report } from '../report/types';
import { Style } from 'ol/style';
import { Extent } from 'ol/extent';
import Projection from 'ol/proj/Projection';
export default class ReportSource {
    private _cluster;
    private _apiClient;
    private _eventManager;
    private _cache?;
    private _communityId?;
    private _loadClosed;
    constructor(options: ReportSourceOptions);
    /**
     *
     * @param feature - The feature to get the status style for
     * @returns The status style for the feature
     */
    getStatusStyle(feature: Feature): Style;
    /**
     * Gets the cache key for reports based on community ID
     * @returns Cache key string
     */
    private getCacheKey;
    /**
     * Builds a transport feature that keeps report.geometry as WKT text.
     * OpenLayers expects the feature geometry property to be an actual Geometry instance.
     */
    private createTransportFeature;
    private normalizeReportEntry;
    /**
     * Saves reports to cache
     * @param reports - Reports to cache
     */
    private saveToCache;
    /**
     * Loads reports from cache
     * @returns Cached reports or empty array
     */
    private loadFromCache;
    /**
     * Load features from a WKT string
     *
     * @param entries - The features or reports to load
     * @param projection - The projection to use
     * @returns The loaded features
     */
    loadFeatures(features: Feature[], projection: Projection): Promise<Feature[]>;
    loadFeatures(reports: Report[], projection: Projection): Promise<Feature[]>;
    /**
     * Load reports from the server
     *
     * @param extent - The extent to load reports for
     * @param page - The page number to load
     * @param loadClosedReports - Whether to load closed reports (defaults to instance setting)
     * @returns The reports
     */
    loadReports(extent: Extent, page?: number, loadClosedReports?: boolean): Promise<Report[]>;
    getReport(_reportId: number): Promise<Report | null>;
}
//# sourceMappingURL=ReportSource.d.ts.map