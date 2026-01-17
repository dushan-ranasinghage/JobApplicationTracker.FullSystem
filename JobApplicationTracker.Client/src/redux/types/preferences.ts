/**
 * @file preferences.ts
 * @description Types for user preferences
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

export interface PreferencesState {
    pageSize: number;
    sidebarOpen: boolean;
    currentPage: number;
}
