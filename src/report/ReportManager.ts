/**
 * Report manager
 * Manages the creation, submission, and management of reports
 * 
 * @migrated from: report/Report.js
 * 
 * TODO:
 * - See if the functions sketch2feature and feature2sketch are required here, and what they do (see report/Report.js line 131)
 */
import { ApiClient } from 'collaboratif-client-api';

// Local types
import { Report, ReportFilter, ReportPostParams } from '../types/report';
import { IReportStorage } from '../abstracts/IReportStorage';
import Feature from 'ol/Feature';
import { Projection } from 'ol/proj';

/**
 * Report manager
 */

export class ReportManager {
  private _apiClient: ApiClient;
  private _storage: IReportStorage;

  public options: any;
  public params: any;

  private _defaultParams: any = { georems: [], nbrem: 0 };

  constructor(apiClient: ApiClient, storage: IReportStorage, options: any) {
    this.options = options;
    this.params = {};
    this._apiClient = apiClient;
    this._storage = storage;

    this.initialize(options);
  }

  async initialize(options: any): Promise<void> {
    this.params = this._storage.loadParams('report') || this._defaultParams;
  }

  /**
   * Create a new report *locally*
   * equivalent to postGeorem of ReportForm.js
   * @param report 
   * 
   * TODO: see the difference between the local and server report creation
   */
  async createReport(params: ReportPostParams, withSubmit: boolean = false): Promise<Report> {
    if (!this.params || !this.params.geometry || (!this.params.lon && !this.params.lat)) {
      throw Error('BADREM: neither geometry, lon or lat exists');
    }

    const post: any = {
      comment: params.comment,
      geometry: this.params.geometry || `POINT(${this.params.lon} ${this.params.lat})`,
    };

    // Optional attributes => to implement
    if (params.sketch) {
      post.sketch = params.sketch;
    } else if (params.features) {
      post.sketch = this.feature2sketch(params.features, this.params.proj);
    }


    post.community = params.community_id > 0 ? params.community_id : "-1";
    if (params.themes) {
      let th = params.themes.split("::");
      var group = parseInt(th[0]);
      post.attributes = JSON.stringify({
        "community": group,
        "theme": params.theme,
        "attributes": params.attributes ? JSON.parse(params.attributes) : {}
      });
    }

    // if withSubmit?
    const response = await this._apiClient.addReport(post);
    const reportId = response.data.id;

    if (params.photos && params.photos.length) {
      params.photosToSend = true;
    }
    await this.uploadAttachements(reportId, params); // see type here

    return response.data;
  }

  /**
   * Submit a report to the server
   * @param reportId 
   */
  async submitReport(reportId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * See if the type is correct
   * equivalent to postPhotosPending of ReportForm.js
   * @param file: File to upload
   */
  async uploadAttachements(reportId: number, report: ReportPostParams): Promise<void> {
    throw new Error('Not implemented');
    // create postData and use:
    // apiClient.addAttachments(reportId, postData)
  }

  /**
   * Update a report locally
   * Note: Once submitted, the report is no longer editable
   * @param report 
   */
  async updateReport(report: Partial<Report>): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * Delete a report
   * @param reportId 
   */
  async deleteReport(reportId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Get a report
   * @param reportId 
   */
  async getReport(reportId: number, fromServer: boolean = true): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * List reports
   * @param filter 
   */
  async listReports(filter?: ReportFilter, fromServer: boolean = true): Promise<Report[]> {
    throw new Error('Not implemented');
  }

  feature2sketch(features: Feature[], proj: Projection): string {
    throw new Error('Not implemented');
  }

  sketch2feature(sketch: string, proj: Projection): Feature[] {
    throw new Error('Not implemented');
  }

}