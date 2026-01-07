/**
 * Check if a date is valid
 * @param date: any
 * @returns boolean
 */
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
//# sourceMappingURL=AttributesHelper.js.map