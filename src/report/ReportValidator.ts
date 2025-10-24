/**
 * Report validator
 * @migrated from: report/ReportForm.js
 * 
 * Note:
 * - The form validation should be done on the app side as much as possible
 */
import { Report } from '../types/report';

/**
 * Report validator
 */
export class ReportValidator {
  /**
   * Validate a report
   * Return type might be something more complex with errors and such
   * @param report 
   * @returns 
   */
  static validate(report: Report): boolean {
    return true;
  }

}