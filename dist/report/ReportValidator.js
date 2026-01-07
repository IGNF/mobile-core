import { isValidDate } from '../utils/AttributesHelper';
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
    static validate(report) {
        if (!report.geometry) {
            return { valid: false, error: 'This field is required' };
        }
        if (!report.comment) {
            return { valid: false, error: 'This field is required' };
        }
        if (!report.attributes) {
            return { valid: false, error: 'This field is required' };
        }
        if (report.attributes) {
            for (const [name, value] of Object.entries(report.attributes)) {
                const attribute = report.attributes[name];
                const validation = this.validateAttribute(name, value, attribute);
                if (!validation.valid) {
                    return { valid: false, error: validation.error };
                }
            }
        }
        return { valid: true };
    }
    static validateAttribute(name, value, attribute) {
        if (attribute.required && !value) {
            return { valid: false, error: `The field ${name} is required` };
        }
        if (attribute.type === 'number' && isNaN(value)) {
            return { valid: false, error: `The field ${name} must be a number` };
        }
        if (attribute.type === 'select' && !attribute.options?.includes(value)) {
            return { valid: false, error: `The field ${name} must be a valid option` };
        }
        if (attribute.type === 'date' && !isValidDate(value)) {
            return { valid: false, error: `The field ${name} must be a valid date` };
        }
        return { valid: true };
    }
}
//# sourceMappingURL=ReportValidator.js.map