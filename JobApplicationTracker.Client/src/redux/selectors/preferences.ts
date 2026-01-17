/**
 * @file preferences.ts
 * @description Selectors for user preferences
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

const selectPreferencesState = (state: RootState) => state.preferences;

export const selectPageSize = createSelector(
    [selectPreferencesState],
    (preferencesState) => preferencesState.pageSize
);

export const selectSidebarOpen = createSelector(
    [selectPreferencesState],
    (preferencesState) => preferencesState.sidebarOpen
);

export const selectCurrentPage = createSelector(
    [selectPreferencesState],
    (preferencesState) => preferencesState.currentPage
);
