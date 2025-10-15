import { ApiClient } from 'collaboratif-client-api';

// Local types
import { Report, ReportFilter } from '../types/report';

/**
 * Report manager
 */

export class ReportManager {
  private _apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this._apiClient = apiClient;
  }

  /**
   * Create a new report *locally*
   * @param report 
   */
  async createReport(report: Report): Promise<Report> {
    throw new Error('Not implemented');
  }

  /**
   * Submit a report to the server
   * @param reportId 
   */
  async submitReport(reportId: number): Promise<void> {
    throw new Error('Not implemented');
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

}