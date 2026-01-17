/**
 * @file jobApplications.ts
 * @description Reducer for job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createSlice } from '@reduxjs/toolkit';

import type { JobApplicationsState } from '../../types/jobApplications';
import { fetchAllJobApplications } from '../../actions/jobApplications/jobApplications';

const INITIAL_STATE: JobApplicationsState = {
  applications: [],
  status: 'idle',
  error: null,
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
      .addCase(fetchAllJobApplications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllJobApplications.fulfilled, (state, action) => {
        state.status = 'finished';
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(fetchAllJobApplications.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string || 'Failed to fetch job applications';
      });
  },
});

export const { clearJobApplications } = jobApplicationsSlice.actions;
export default jobApplicationsSlice.reducer;
