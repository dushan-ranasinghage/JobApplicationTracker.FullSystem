/**
 * @file apiUtils.ts
 * @description Utility functions for API operations
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

/**
 * Builds a query string from an object of parameters
 * @param params - Object with query parameters
 * @returns Query string (without leading ?) or empty string
 */
export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });
  
  return queryParams.toString();
}

/**
 * Builds a full URL with query parameters
 * @param basePath - Base path (e.g., '/job-applications')
 * @param params - Query parameters object
 * @returns Full URL with query string
 */
export function buildUrlWithParams(
  basePath: string,
  params: Record<string, string | number | undefined> = {}
): string {
  const queryString = buildQueryString(params);
  return queryString ? `${basePath}?${queryString}` : basePath;
}
