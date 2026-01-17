/**
 * @file index.ts
 * @description 
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { combineReducers } from '@reduxjs/toolkit';

import jobApplicationsReducer from './jobApplications/jobApplications';

const appReducer = combineReducers({
  jobApplications: jobApplicationsReducer
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: { type: string }) => {
  return appReducer(state, action);
};

export default rootReducer;

