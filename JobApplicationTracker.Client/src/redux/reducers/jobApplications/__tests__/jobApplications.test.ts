/**
 * @file jobApplications.test.ts
 * @description Unit tests for job applications reducer
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { configureStore } from '@reduxjs/toolkit';

import {
  fetchAllJobApplications,
  refreshJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../../../actions/jobApplications/jobApplications';
import jobApplicationsReducer, {
  clearJobApplications,
} from '../jobApplications';
import type { TestStore } from '../../../../testUtils';

describe('jobApplications reducer test suite', () => {
  let store: TestStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        jobApplications: jobApplicationsReducer,
      },
    }) as TestStore;
  });

  it('should return initial state', () => {
    const state = (store.getState() as any).jobApplications;
    expect(state).toEqual({
      applications: [],
      status: 'idle',
      error: null,
      pagination: null,
    });
  });

  describe('test clearJobApplications reducer', () => {
    it('should clear job applications', () => {
      store.dispatch({
        type: 'jobApplications/fetchAll/fulfilled',
        payload: {
          applications: [
            {
              id: 1,
              companyName: 'Company A',
              position: 'Developer',
              status: 'Applied',
              dateApplied: '2024-01-01',
              createdAt: '2024-01-01',
              updatedAt: null,
            },
          ],
          pagination: {
            pageNumber: 1,
            pageSize: 10,
            totalCount: 1,
            totalPages: 1,
          },
        },
      });

      store.dispatch(clearJobApplications());

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toEqual([]);
      expect(state.status).toBe('idle');
      expect(state.error).toBeNull();
    });
  });

  describe('test fetchAllJobApplications reducer', () => {
    it('should handle pending state', () => {
      store.dispatch({ type: fetchAllJobApplications.pending.type });

      const state = (store.getState() as any).jobApplications;
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const payload = {
        applications: [
          {
            id: 1,
            companyName: 'Company A',
            position: 'Developer',
            status: 'Applied',
            dateApplied: '2024-01-01',
            createdAt: '2024-01-01',
            updatedAt: null,
          },
        ],
        pagination: {
          pageNumber: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
        },
      };

      store.dispatch({
        type: fetchAllJobApplications.fulfilled.type,
        payload,
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.status).toBe('finished');
      expect(state.applications).toEqual(payload.applications);
      expect(state.pagination).toEqual(payload.pagination);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      store.dispatch({
        type: fetchAllJobApplications.rejected.type,
        payload: 'Error message',
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.status).toBe('error');
      expect(state.error).toBe('Error message');
    });
  });

  describe('test refreshJobApplications reducer', () => {
    it('should handle fulfilled state', () => {
      const payload = {
        applications: [
          {
            id: 1,
            companyName: 'Company A',
            position: 'Developer',
            status: 'Applied',
            dateApplied: '2024-01-01',
            createdAt: '2024-01-01',
            updatedAt: null,
          },
        ],
        pagination: {
          pageNumber: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
        },
      };

      store.dispatch({
        type: refreshJobApplications.fulfilled.type,
        payload,
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toEqual(payload.applications);
      expect(state.pagination).toEqual(payload.pagination);
    });
  });

  describe('test createJobApplication reducer', () => {
    it('should handle fulfilled state', () => {
      const payload = {
        id: 1,
        companyName: 'Company A',
        position: 'Developer',
        status: 'Applied',
        dateApplied: '2024-01-01',
        createdAt: '2024-01-01',
        updatedAt: null,
      };

      store.dispatch({
        type: createJobApplication.fulfilled.type,
        payload,
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toHaveLength(1);
      expect(state.applications[0]).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      store.dispatch({
        type: createJobApplication.rejected.type,
        payload: 'Creation failed',
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBe('Creation failed');
    });
  });

  describe('test updateJobApplication reducer', () => {
    beforeEach(() => {
      store.dispatch({
        type: 'jobApplications/fetchAll/fulfilled',
        payload: {
          applications: [
            {
              id: 1,
              companyName: 'Company A',
              position: 'Developer',
              status: 'Applied',
              dateApplied: '2024-01-01',
              createdAt: '2024-01-01',
              updatedAt: null,
            },
          ],
          pagination: {
            pageNumber: 1,
            pageSize: 10,
            totalCount: 1,
            totalPages: 1,
          },
        },
      });
    });

    it('should handle fulfilled state', () => {
      const payload = {
        id: 1,
        companyName: 'Company B',
        position: 'Senior Developer',
        status: 'Interview',
        dateApplied: '2024-01-01',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      store.dispatch({
        type: updateJobApplication.fulfilled.type,
        payload,
        meta: {
          arg: {
            id: 1,
            data: {
              companyName: 'Company B',
              position: 'Senior Developer',
              status: 'Interview',
            },
          },
        },
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.applications[0].companyName).toBe('Company B');
      expect(state.applications[0].position).toBe('Senior Developer');
      expect(state.applications[0].status).toBe('Interview');
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      store.dispatch({
        type: updateJobApplication.rejected.type,
        payload: 'Update failed',
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBe('Update failed');
    });
  });

  describe('test deleteJobApplication reducer', () => {
    beforeEach(() => {
      store.dispatch({
        type: 'jobApplications/fetchAll/fulfilled',
        payload: {
          applications: [
            {
              id: 1,
              companyName: 'Company A',
              position: 'Developer',
              status: 'Applied',
              dateApplied: '2024-01-01',
              createdAt: '2024-01-01',
              updatedAt: null,
            },
          ],
          pagination: {
            pageNumber: 1,
            pageSize: 10,
            totalCount: 1,
            totalPages: 1,
          },
        },
      });
    });

    it('should handle fulfilled state', () => {
      store.dispatch({
        type: deleteJobApplication.fulfilled.type,
        payload: 1,
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toHaveLength(0);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      store.dispatch({
        type: deleteJobApplication.rejected.type,
        payload: 'Delete failed',
      });

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBe('Delete failed');
    });
  });
});
