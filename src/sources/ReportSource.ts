/**
 * Report source for displaying georep reports on the map
 * Migrated from: ol/source/Report.js
 */

import { ApiClient } from 'collaboratif-client-api';

import EventManager from '../utils/EventManager';

import { Community, User } from '../collaborative/types';
import { ReportSourceOptions } from './types';

import { Feature } from 'ol';
import { BASE_RADIUS, ReportStatus, STATUS_STYLES, ClosedReportStatus } from '../report/types';
import { Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Extent } from 'ol/extent';
import WKT from 'ol/format/WKT';
import Projection from 'ol/proj/Projection';

export default class ReportSource {

  private _cluster: Style[] = [];
  private _apiClient: ApiClient;
  private _eventManager: EventManager;
  private _cache?: any; // ICacheStorage - avoiding circular dependency
  private _communityId?: number;
  private _loadClosed: boolean;

  constructor(options: ReportSourceOptions) {
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
  public getStatusStyle(feature: Feature): Style {
    if (feature.get('status')) {
      return STATUS_STYLES[feature.get('status') as ReportStatus] || new Style({});
    }
    else if (feature.get('features')) {
      const featuresLength = feature.get('features').length;
      if (featuresLength < 2) {
        return this.getStatusStyle(feature.get('features')[0]);
      }
      else {
        if (!this._cluster[featuresLength] && STATUS_STYLES[ReportStatus.Cluster]) {
          this._cluster[featuresLength] = STATUS_STYLES[ReportStatus.Cluster].clone();
          (STATUS_STYLES[ReportStatus.Cluster].getImage() as CircleStyle)?.setRadius(Math.min(10, featuresLength / 2) + BASE_RADIUS);
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
  private getCacheKey(): string {
    const communityId = this._communityId || 'default';
    return `reports:${communityId}`;
  }

  /**
   * Saves reports to cache
   * @param reports - Reports to cache
   */
  private async saveToCache(reports: Report[]): Promise<void> {
    if (!this._cache) return;

    try {
      // Convert reports to features for storage
      const features = reports.map(report => {
        const feature = new Feature(report);
        return feature;
      });

      const cacheKey = this.getCacheKey();
      await this._cache.saveFeatures(cacheKey, features);
    } catch (error) {
      console.error('Failed to save reports to cache:', error);
    }
  }

  /**
   * Loads reports from cache
   * @returns Cached reports or empty array
   */
  private async loadFromCache(): Promise<Report[]> {
    if (!this._cache) return [];

    try {
      const cacheKey = this.getCacheKey();
      const features: Feature[] = await this._cache.loadFeatures(cacheKey);
      
      // Convert features back to reports
      return features.map((feature: Feature) => feature.getProperties() as Report);
    } catch (error) {
      console.error('Failed to load reports from cache:', error);
      return [];
    }
  }

  /**
   * Load features from a WKT string
   *
   * @param features - The features to load
   * @param projection - The projection to use
   * @returns The loaded features
   */
  async loadFeatures(features: Feature[], projection: Projection): Promise<Feature[]> {
    if(features.length === 0) {
      return [];
    }
    const loadedFeatures: Feature[] = [];
    let format = new WKT();
    features.forEach(feature => {
      const f = format.readFeature(feature.get('geometry'), {
        dataProjection: 'EPSG:4326',
        featureProjection: projection
      });
      f.setProperties({ report: feature });
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
  async loadReports(extent: Extent, page: number = 1, loadClosedReports?: boolean): Promise<Report[]> {
    try {
      const user: User = (await this._apiClient.getUser()).data;
      const activeCommunity = user.communities.find((community: Community) => community.active === true)?.id;

      // Use instance setting if not explicitly provided
      const shouldLoadClosed = loadClosedReports ?? this._loadClosed;

      // Update community ID if not set
      if (!this._communityId && activeCommunity) {
        this._communityId = activeCommunity;
      }

      let params = {
        box: extent.join(','),
        limit: 100,
        communities: [activeCommunity],
        page: page
      };

      let reportStatus = Object.values(ReportStatus);
      if (!shouldLoadClosed) {
        const closedStatus = Object.values(ClosedReportStatus);
        reportStatus = reportStatus.filter(status => !closedStatus.includes(status as unknown as ClosedReportStatus));
      }

      const reportsResponse = await this._apiClient.getReports(params);

      let contentRangeParts = reportsResponse.headers["content-range"].split('/');
      let range = contentRangeParts[0].split('-');
      
      if (reportsResponse.status == 200 || (reportsResponse.status == 206 && range[1] === contentRangeParts[1])) {
        // Successfully loaded all reports - save to cache
        const reports = reportsResponse.data;
        await this.saveToCache(reports);
        return reports;
      } else if (reportsResponse.status == 206) {
        // Partial content - load next page recursively
        page = page + 1;
        const nextResult = await this.loadReports(extent, page, shouldLoadClosed);
        const allReports = nextResult.concat(reportsResponse.data);
        
        // Save complete result to cache
        await this.saveToCache(allReports);
        return allReports;
      } else {
        // Request failed - load from cache
        console.warn('Failed to load reports from server, loading from cache');
        return await this.loadFromCache();
      }
    } catch (error) {
      // On error, try to load from cache
      console.error('Error loading reports:', error);
      return await this.loadFromCache();
    }
  }

  async getReport(_reportId: number): Promise<Report | null> {
    throw new Error('Not implemented');
  }

}