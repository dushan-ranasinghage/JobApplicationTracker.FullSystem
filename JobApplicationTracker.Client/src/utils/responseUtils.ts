/**
 * @file responseUtils.ts
 * @description Utility functions for API response handling
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import type { JobApplication } from '../redux/types/jobApplications';
import { getStatusString } from '../modules/JobApplications/utils/statusUtils';

/**
 * Extracts data array from various response structures
 * @param responseData - Response data that may have different structures
 * @returns Array of job applications
 */
export function extractDataArray<T = JobApplication>(
  responseData: unknown
): T[] {
  if (!responseData) {
    return [];
  }

  // Handle nested structure: { data: [...], ... }
  if (
    typeof responseData === 'object' &&
    responseData !== null &&
    'data' in responseData &&
    Array.isArray((responseData as { data: unknown }).data)
  ) {
    return (responseData as { data: T[] }).data;
  }

  // Handle direct array structure
  if (Array.isArray(responseData)) {
    return responseData as T[];
  }

  // Invalid structure
  console.warn('Response data structure is invalid. Expected data property:', responseData);
  return [];
}

/**
 * Normalizes job applications by converting status from number to string
 * @param applications - Array of job applications with potentially numeric status
 * @returns Array of job applications with string status
 */
export function normalizeJobApplications(
  applications: Array<Partial<JobApplication> & { status: number | string }>
): JobApplication[] {
  return applications.map((app) => ({
    ...app,
    status: getStatusString(app.status as number | string),
  })) as JobApplication[];
}

/**
 * Extracts and calculates pagination metadata from response
 * @param responseData - Response data containing pagination info
 * @param requestedPageSize - Page size that was requested
 * @param dataLength - Length of the data array
 * @returns Pagination metadata
 */
export function extractPaginationMetadata(
  responseData: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  },
  requestedPageSize?: number,
  dataLength: number = 0
) {
  const DEFAULT_PAGE_SIZE = 5;
  const pageSize = responseData.pageSize ?? requestedPageSize ?? DEFAULT_PAGE_SIZE;
  const totalCount = responseData.totalCount ?? dataLength;
  const totalPages = responseData.totalPages ?? Math.ceil(totalCount / pageSize);

  return {
    pageNumber: responseData.pageNumber ?? 1,
    pageSize,
    totalCount,
    totalPages,
  };
}
