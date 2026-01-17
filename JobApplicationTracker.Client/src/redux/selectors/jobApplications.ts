/**
 * @file jobApplications.ts
 * @description Selectors for job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type {
  JobApplication,
  JobApplicationStatus,
  PaginationMetadata,
} from '../types/jobApplications';

const selectJobApplicationsState = (state: RootState) => state.jobApplications;

export const selectAllJobApplications = (state: RootState): JobApplication[] =>
  state.jobApplications.applications;

export const selectJobApplicationsStatus = createSelector(
  [selectJobApplicationsState],
  (jobApplicationsState) => jobApplicationsState.status
);

export const selectJobApplicationsError = createSelector(
  [selectJobApplicationsState],
  (jobApplicationsState) => jobApplicationsState.error
);

export const selectJobApplicationsByStatus = createSelector(
  [
    selectAllJobApplications,
    (_state: RootState, status: JobApplicationStatus) => status,
  ],
  (applications, status): JobApplication[] =>
    applications.filter((app) => app.status === status)
);

export const selectJobApplicationById = createSelector(
  [selectAllJobApplications, (_state: RootState, id: number) => id],
  (applications, id): JobApplication | undefined =>
    applications.find((app) => app.id === id)
);

export const selectIsJobApplicationsLoading = createSelector(
  [selectJobApplicationsStatus],
  (status) => status === 'loading' || status === 'idle'
);

export const selectHasJobApplicationsError = createSelector(
  [selectJobApplicationsError],
  (error) => error !== null
);

export const selectJobApplicationsPagination = createSelector(
  [selectJobApplicationsState],
  (jobApplicationsState): PaginationMetadata | null => jobApplicationsState.pagination
);
