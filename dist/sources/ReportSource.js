/**
 * Report source for displaying georep reports on the map
 * Migrated from: ol/source/Report.js
 */
import EventManager from '../utils/EventManager';
import { Feature } from 'ol';
import { BASE_RADIUS, ReportStatus, STATUS_STYLES, ClosedReportStatus } from '../report/types';
import { Style } from 'ol/style';
import WKT from 'ol/format/WKT';
const REPORT_TRANSPORT_GEOMETRY_NAME = '__report_transport_geometry__';
export default class ReportSource {
    constructor(options) {
        this._cluster = [];
        this._apiClient = options.client;
        this._eventManager = new EventManager();
        this._cluster = [];
        this._cache = options.cache;
        this._communityId = options.communityId;
        this._loadClosed = options.loadClosed ?? false;
    }
    /**
     *
     * @param feature - The feature to get the status style for
     * @returns The status style for the feature
     */
    getStatusStyle(feature) {
        if (feature.get('status')) {
            return STATUS_STYLES[feature.get('status')] || new Style({});
        }
        else if (feature.get('features')) {
            const featuresLength = feature.get('features').length;
            if (featuresLength < 2) {
                return this.getStatusStyle(feature.get('features')[0]);
            }
            else {
                if (!this._cluster[featuresLength] && STATUS_STYLES[ReportStatus.Cluster]) {
                    this._cluster[featuresLength] = STATUS_STYLES[ReportStatus.Cluster].clone();
                    STATUS_STYLES[ReportStatus.Cluster].getImage()?.setRadius(Math.min(10, featuresLength / 2) + BASE_RADIUS);
                    this._cluster[featuresLength] = STATUS_STYLES[ReportStatus.Cluster].clone();
                }
                return this._cluster[featuresLength];
            }
        }
        else {
            return STATUS_STYLES[ReportStatus.Pending] || new Style({});
        }
    }
    /**
     * Gets the cache key for reports based on community ID
     * @returns Cache key string
     */
    getCacheKey() {
        const communityId = this._communityId || 'default';
        return `reports:${communityId}`;
    }
    /**
     * Builds a transport feature that keeps report.geometry as WKT text.
     * OpenLayers expects the feature geometry property to be an actual Geometry instance.
     */
    createTransportFeature(report) {
        const feature = new Feature();
        feature.setGeometryName(REPORT_TRANSPORT_GEOMETRY_NAME);
        feature.setProperties(report);
        return feature;
    }
    normalizeReportEntry(entry) {
        if (entry instanceof Feature) {
            const properties = entry.getProperties();
            if (typeof properties.geometry !== 'string') {
                throw new TypeError('Report feature must expose a WKT string in the "geometry" property');
            }
            return properties;
        }
        if (typeof entry.geometry !== 'string') {
            throw new TypeError('Report must expose a WKT string in the "geometry" property');
        }
        return entry;
    }
    /**
     * Saves reports to cache
     * @param reports - Reports to cache
     */
    async saveToCache(reports) {
        if (!this._cache)
            return;
        try {
            const features = reports.map(report => this.createTransportFeature(report));
            const cacheKey = this.getCacheKey();
            await this._cache.saveFeatures(cacheKey, features);
        }
        catch (error) {
            console.error('Failed to save reports to cache:', error);
        }
    }
    /**
     * Loads reports from cache
     * @returns Cached reports or empty array
     */
    async loadFromCache() {
        if (!this._cache)
            return [];
        try {
            const cacheKey = this.getCacheKey();
            const features = await this._cache.loadFeatures(cacheKey);
            // Convert features back to reports
            return features.map((feature) => {
                const properties = { ...feature.getProperties() };
                delete properties[REPORT_TRANSPORT_GEOMETRY_NAME];
                return properties;
            });
        }
        catch (error) {
            console.error('Failed to load reports from cache:', error);
            return [];
        }
    }
    async loadFeatures(entries, projection) {
        if (entries.length === 0) {
            return [];
        }
        const loadedFeatures = [];
        const format = new WKT();
        // Convert WKT geometry strings to OpenLayers geometries and reproject to map projection
        entries.forEach(entry => {
            const report = this.normalizeReportEntry(entry);
            const f = format.readFeature(report.geometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: projection
            });
            f.setProperties({ report: this.createTransportFeature(report) });
            loadedFeatures.push(f);
        });
        // where is this implemented?
        // this.addFeatures(loadedFeatures);
        if (loadedFeatures.length === 100) {
            this._eventManager.emit('overload');
        }
        return loadedFeatures;
    }
    /**
     * Load reports from the server
     *
     * @param extent - The extent to load reports for
     * @param page - The page number to load
     * @param loadClosedReports - Whether to load closed reports (defaults to instance setting)
     * @returns The reports
     */
    async loadReports(extent, page = 1, loadClosedReports) {
        try {
            const userResponse = await this._apiClient.getUser();
            const user = userResponse?.data;
            const communities = Array.isArray(user?.communities) ? user.communities : [];
            const activeCommunity = communities.find((community) => community.active === true)?.id;
            // Use instance setting if not explicitly provided
            const shouldLoadClosed = loadClosedReports ?? this._loadClosed;
            // Update community ID if not set
            if (!this._communityId && activeCommunity) {
                this._communityId = activeCommunity;
            }
            const targetCommunityId = this._communityId ?? activeCommunity;
            const params = {
                box: extent.join(','),
                limit: 100,
                page: page
            };
            if (typeof targetCommunityId === 'number') {
                params.communities = [targetCommunityId];
            }
            let reportStatus = Object.values(ReportStatus);
            if (!shouldLoadClosed) {
                const closedStatus = Object.values(ClosedReportStatus);
                reportStatus = reportStatus.filter(status => !closedStatus.includes(status));
            }
            const reportsResponse = await this._apiClient.getReports(params);
            let contentRangeParts = reportsResponse.headers["content-range"].split('/');
            let range = contentRangeParts[0].split('-');
            if (reportsResponse.status == 200 || (reportsResponse.status == 206 && range[1] === contentRangeParts[1])) {
                // Successfully loaded all reports - save to cache
                const reports = reportsResponse.data;
                await this.saveToCache(reports);
                return reports;
            }
            else if (reportsResponse.status == 206) {
                // Partial content - load next page recursively
                page = page + 1;
                const nextResult = await this.loadReports(extent, page, shouldLoadClosed);
                const allReports = nextResult.concat(reportsResponse.data);
                // Save complete result to cache
                await this.saveToCache(allReports);
                return allReports;
            }
            else {
                // Request failed - load from cache
                console.warn('Failed to load reports from server, loading from cache');
                return await this.loadFromCache();
            }
        }
        catch (error) {
            // On error, try to load from cache
            console.error('Error loading reports:', error);
            return await this.loadFromCache();
        }
    }
    async getReport(_reportId) {
        throw new Error('Not implemented');
    }
}
//# sourceMappingURL=ReportSource.js.map