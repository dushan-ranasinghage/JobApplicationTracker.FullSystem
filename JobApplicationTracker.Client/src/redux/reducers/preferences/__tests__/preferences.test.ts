/**
 * @file preferences.test.ts
 * @description Unit tests for preferences reducer
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { configureStore } from '@reduxjs/toolkit';

import preferencesReducer, {
    setPageSize,
    setSidebarOpen,
    resetPreferences,
} from '../preferences';

describe('preferences reducer test suite', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                preferences: preferencesReducer,
            },
        });
    });

    it('should return initial state', () => {
        const state = (store.getState() as any).preferences;
        expect(state).toEqual({
            pageSize: 5,
            sidebarOpen: true,
        });
    });

    describe('setPageSize', () => {
        it('should update page size', () => {
            store.dispatch(setPageSize(10));

            const state = (store.getState() as any).preferences;
            expect(state.pageSize).toBe(10);
        });
    });

    describe('setSidebarOpen', () => {
        it('should update sidebar open state', () => {
            store.dispatch(setSidebarOpen(false));

            const state = (store.getState() as any).preferences;
            expect(state.sidebarOpen).toBe(false);
        });
    });

    describe('resetPreferences', () => {
        it('should reset to default values', () => {
            store.dispatch(setPageSize(20));
            store.dispatch(setSidebarOpen(false));

            store.dispatch(resetPreferences());

            const state = (store.getState() as any).preferences;
            expect(state.pageSize).toBe(5);
            expect(state.sidebarOpen).toBe(true);
        });
    });
});
