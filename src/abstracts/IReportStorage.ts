import { Report, ReportPhoto } from "../report/types";

/**
 * Storage abstraction for report operations
 * Implementation provided by consuming app
 * Necessary to remove the dependency to Cordova/Capacitor Storage from the core library
 */
export interface IReportStorage {
  // Synchronous methods for initialization
  loadParams(key: string): any;

  // Report CRUD operations
  saveReport(report: Report): Promise<void>;
  getReport(reportId: number): Promise<Report | null>;
  deleteReport(reportId: number): Promise<void>;
  listReports(): Promise<Report[]>;

  // Photo operations
  getBlob(photo: ReportPhoto): Promise<Blob>;

  // Parameter operations
  saveParam(param: any): void;
  getParam(): any;
  clearParam(): void;
}