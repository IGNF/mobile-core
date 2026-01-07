/**
 * Report validator
 * @migrated from: report/ReportForm.js
 *
 * Note:
 * - The form validation should be done on the app side as much as possible
 * - The original files does a lot of manipulations (data, geolocation, photos, etc.)
 *    => Part of this has to be done on the app side
 *      So this class will be fully implemented during the app development
 */
import { Report, ReportAttribute } from './types';
/**
 * Report validator
 */
export declare class ReportValidator {
    /**
     * Validate a report
     * Return type might be something more complex with errors and such
     * @param report
     * @returns
     */
    static validate(report: Report): {
        valid: boolean;
        error?: string;
    };
    static validateAttribute(name: string, value: any, attribute: ReportAttribute): {
        valid: boolean;
        error?: string;
    };
}
//# sourceMappingURL=ReportValidator.d.ts.map