/**
 * @file common.ts
 * @description Common types and interfaces
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

export type StatusType = 'idle' | 'loading' | 'finished' | 'error';

export type RequestStatus = 'idle' | 'loading' | 'finished' | 'error';

export const RequestStatusValues = {
  IDLE: 'idle' as const,
  LOADING: 'loading' as const,
  FINISHED: 'finished' as const,
  ERROR: 'error' as const,
} as const;
