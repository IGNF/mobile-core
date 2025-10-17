import { ReportStatus } from "../types/report";

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