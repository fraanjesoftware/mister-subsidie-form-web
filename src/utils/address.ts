/**
 * Address formatting utilities
 * Following DRY principle - single source of truth for address formatting
 */

/**
 * Combines street and house number into a single address line
 * @param straat - Street name
 * @param huisnummer - House number (can include letters/suffixes)
 * @returns Formatted address string
 */
export const formatAddress = (straat: string, huisnummer: string): string => {
  return `${straat} ${huisnummer}`.trim();
};
