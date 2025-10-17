/**
 * Report source for displaying georep reports on the map
 * Migrated from: ol/source/Report.js
 * 
 * TODO:
 * - Add cache management for reports saving and loading
 * - See the implementation of "addFeatures" in the old code
 */

import { ApiClient } from 'collaboratif-client-api';

import EventManager from '../utils/EventManager';

import { UserManager } from '../collaborative/UserManager';
import { Community, User } from '../collaborative/types';

import { Feature } from 'ol';
import { BASE_RADIUS, ReportStatus, STATUS_STYLES, ClosedReportStatus } from '../types/report';
import { Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Extent } from 'ol/extent';
import WKT from 'ol/format/WKT';
import Projection from 'ol/proj/Projection';

export default class ReportSource {

  private _cluster: Style[] = [];
  private _apiClient: ApiClient;
  private _userManager: UserManager;
  private _eventManager: EventManager;

  constructor() {
    this._apiClient = new ApiClient();
    this._eventManager = new EventManager();
    this._cluster = [];
    this._userManager = new UserManager(this._apiClient);
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
   * @param loadClosedReports - Whether to load closed reports
   * @returns The reports
   */
  async loadReports(extent: Extent, page: number = 1, loadClosedReports: boolean = false): Promise<Report[]> {
    const user: User = await this._userManager.getUser();
    const activeCommunity = user.communities.find((community: Community) => community.isActive === true)?.id;

    // to type
    let params = {
      box: extent.join(','),
      limit: 100,
      communities: [activeCommunity],
      page: page
    };

    let reportStatus = Object.values(ReportStatus);
    if(!loadClosedReports) {
      const closedStatus = Object.values(ClosedReportStatus);
      reportStatus = reportStatus.filter(status => !closedStatus.includes(status as unknown as ClosedReportStatus));
    }

    const reportsResponse = await this._apiClient.getReports(params);

    let contentRangeParts = reportsResponse.headers["content-range"].split('/');
      let range = contentRangeParts[0].split('-');
      if (reportsResponse.status == 200 || (reportsResponse.status == 206 && range[1] === contentRangeParts[1])) {
        return reportsResponse.data;
      } else if (reportsResponse.status == 206) {
        page = page + 1;
        const nextResult = await this.loadReports(extent, page, loadClosedReports);
        const featuresResult = nextResult.concat(reportsResponse.data);
        // add to cache here
        // TODO: add to cache here (call cache manager ?)
        return featuresResult;
      } else {
        // TODO: load cache here (call cache manager ?)
        return [];
      }
  }

  async getReport(reportId: number): Promise<Report | null> {
    throw new Error('Not implemented');
  }

}