/**
 * @file index.ts
 * @description 
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import jobApplicationsReducer from './jobApplications/jobApplications';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['jobApplications'], // Don't persist jobApplications
};

const appReducer = combineReducers({
  jobApplications: jobApplicationsReducer
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: { type: string }) => {
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;

