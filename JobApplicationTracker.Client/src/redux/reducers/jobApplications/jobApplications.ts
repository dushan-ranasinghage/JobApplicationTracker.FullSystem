/**
 * @file jobApplications.ts
 * @description Reducer for job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createSlice, current } from '@reduxjs/toolkit';

import type { JobApplicationsState } from '../../types/jobApplications';
import {
  fetchAllJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../../actions/jobApplications/jobApplications';

const INITIAL_STATE: JobApplicationsState = {
  applications: [],
  status: 'idle',
  error: null,
  pagination: null,
};

export const jobApplicationsSlice = createSlice({
  name: 'jobApplications',
  initialState: INITIAL_STATE,
  reducers: {
    clearJobApplications: (state) => {
      state.applications = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllJobApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllJobApplications.fulfilled, (state, action) => {
        state.status = 'finished';
        state.applications = action.payload.applications;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAllJobApplications.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to fetch job applications';
      })
      // Create
      .addCase(createJobApplication.pending, (state) => {
        state.error = null;
      })
      .addCase(createJobApplication.fulfilled, (state, action) => {
        state.applications.push(action.payload);
        state.error = null;
      })
      .addCase(createJobApplication.rejected, (state, action) => {
        state.error =
          (action.payload as string) || 'Failed to create job application';
      })
      // Update
      .addCase(updateJobApplication.pending, (state) => {
        state.error = null;
      })
      .addCase(updateJobApplication.fulfilled, (state, action) => {
        const { applications } = current(state);

        const updateId = action.meta.arg.id;
        const updateData = action.meta.arg.data;

        // Handle API returning no content (204) or empty response
        const payload = action.payload
          ? {
            ...action.payload,
            id: updateId,
          }
          : {
            ...updateData,
            id: updateId,
          };

        // Find and update the application
        const index = applications.findIndex((app) => app.id === updateId);
        if (index !== -1) {
          state.applications[index] = { ...applications[index], ...payload };
        }
        state.error = null;
      })
      .addCase(updateJobApplication.rejected, (state, action) => {
        state.error =
          (action.payload as string) || 'Failed to update job application';
      })
      // Delete
      .addCase(deleteJobApplication.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteJobApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteJobApplication.rejected, (state, action) => {
        state.error =
          (action.payload as string) || 'Failed to delete job application';
      });
  },
});

export const { clearJobApplications } = jobApplicationsSlice.actions;
export default jobApplicationsSlice.reducer;
