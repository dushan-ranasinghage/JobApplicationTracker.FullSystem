/**
 * @file preferences.ts
 * @description Reducer for user preferences
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { PreferencesState } from '../../types/preferences';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SIDEBAR_OPEN = true;
const DEFAULT_CURRENT_PAGE = 1;

const INITIAL_STATE: PreferencesState = {
  pageSize: DEFAULT_PAGE_SIZE,
  sidebarOpen: DEFAULT_SIDEBAR_OPEN,
  currentPage: DEFAULT_CURRENT_PAGE,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: INITIAL_STATE,
  reducers: {
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetPreferences: (state) => {
      state.pageSize = DEFAULT_PAGE_SIZE;
      state.sidebarOpen = DEFAULT_SIDEBAR_OPEN;
      state.currentPage = DEFAULT_CURRENT_PAGE;
    },
  },
});

export const { setPageSize, setSidebarOpen, setCurrentPage, resetPreferences } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
