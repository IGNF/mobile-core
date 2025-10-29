/**
 * Check if a date is valid
 * @param date: any
 * @returns boolean
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}