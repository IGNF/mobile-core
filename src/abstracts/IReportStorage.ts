import { Report, ReportPhoto } from "../report/types";

/**
 * Storage abstraction for report operations
 * Implementation provided by consuming app
 * Necessary to remove the dependency to Cordova/Capacitor Storage from the core library
 */
export interface IReportStorage {
  loadParams(key: string): Promise<any>;

  saveReport(report: Report): Promise<void>;
  getReport(reportId: number): Promise<Report | null>;
  deleteReport(reportId: number): Promise<void>;
  listReports(): Promise<Report[]>;

  getBlob(photo: ReportPhoto): Promise<Blob>;

  saveParam(param: any): Promise<void>;
  getParam(): Promise<any>;
  clearParam(): Promise<void>;
}