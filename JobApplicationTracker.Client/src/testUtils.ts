/**
 * @file testUtils.ts
 * @description Common test utilities and helpers for Jest tests
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { configureStore } from '@reduxjs/toolkit';
import { JobApplicationTrackerClient } from './clients/JobApplicationTrackerClient';
import jobApplicationsReducer from './redux/reducers/jobApplications/jobApplications';

export const mockGet = (JobApplicationTrackerClient as any).get;
export const mockPost = (JobApplicationTrackerClient as any).post;
export const mockPut = (JobApplicationTrackerClient as any).put;
export const mockDelete = (JobApplicationTrackerClient as any).delete;

export type TestStore = ReturnType<typeof configureStore<{
    jobApplications: ReturnType<typeof jobApplicationsReducer>;
}>>;
