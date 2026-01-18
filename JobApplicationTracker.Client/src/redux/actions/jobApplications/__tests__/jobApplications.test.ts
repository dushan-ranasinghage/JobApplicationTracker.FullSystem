/**
 * @file jobApplications.test.ts
 * @description Unit tests for job applications actions
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

import {
  fetchAllJobApplications,
  refreshJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../jobApplications';
import jobApplicationsReducer from '../../../reducers/jobApplications/jobApplications';
import { mockGet, mockPost, mockPut, mockDelete } from '../../../../testUtils';
import type { TestStore } from '../../../../testUtils';

describe('jobApplications actions test suite', () => {
  let store: TestStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        jobApplications: jobApplicationsReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('test fetchAllJobApplications action', () => {
    it('should fetch job applications successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              companyName: 'Company A',
              position: 'Developer',
              status: 1,
              dateApplied: '2024-01-01',
              createdAt: '2024-01-01',
              updatedAt: null,
            },
          ],
          pageNumber: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await store.dispatch(
        fetchAllJobApplications({ pageNumber: 1, pageSize: 10 })
      );

      expect(result.type).toBe('jobApplications/fetchAll/fulfilled');
      const state = (store.getState() as any).jobApplications;
      expect(state.status).toBe('finished');
      expect(state.applications).toHaveLength(1);
      expect(state.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      const mockError = {
        response: { data: { message: 'Network error' } },
        message: 'Network error',
      };

      (axios.isAxiosError as any).mockReturnValue(true);
      mockGet.mockRejectedValue(mockError);

      await store.dispatch(fetchAllJobApplications({}));

      const state = (store.getState() as any).jobApplications;
      expect(state.status).toBe('error');
      expect(state.error).toBe('Network error');
    });
  });

  describe('test refreshJobApplications action', () => {
    it('should refresh job applications successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              companyName: 'Company A',
              position: 'Developer',
              status: 1,
              dateApplied: '2024-01-01',
              createdAt: '2024-01-01',
              updatedAt: null,
            },
          ],
          pageNumber: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      await store.dispatch(refreshJobApplications({}));

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toHaveLength(1);
    });
  });

  describe('test createJobApplication action', () => {
    it('should create job application successfully', async () => {
      const mockResponse = {
        data: {
          id: 1,
          companyName: 'Company A',
          position: 'Developer',
          status: 1,
          dateApplied: '2024-01-01',
          createdAt: '2024-01-01',
          updatedAt: null,
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      await store.dispatch(
        createJobApplication({
          companyName: 'Company A',
          position: 'Developer',
          status: 'Applied',
        })
      );

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toHaveLength(1);
      expect(state.error).toBeNull();
    });

    it('should handle create error', async () => {
      const mockError = {
        response: { data: { message: 'Creation failed' } },
        message: 'Creation failed',
      };

      (axios.isAxiosError as any).mockReturnValue(true);
      mockPost.mockRejectedValue(mockError);

      await store.dispatch(
        createJobApplication({
          companyName: 'Company A',
          position: 'Developer',
          status: 'Applied',
        })
      );

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBe('Creation failed');
    });
  });

  describe('test updateJobApplication action', () => {
    it('should update job application successfully', async () => {
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

      const mockResponse = {
        data: {
          id: 1,
          companyName: 'Company B',
          position: 'Senior Developer',
          status: 2,
          dateApplied: '2024-01-01',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
        },
      };

      mockPut.mockResolvedValue(mockResponse);

      await store.dispatch(
        updateJobApplication({
          id: 1,
          data: {
            companyName: 'Company B',
            position: 'Senior Developer',
            status: 'Interview',
          },
        })
      );

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBeNull();
      expect(state.applications[0].companyName).toBe('Company B');
    });

    it('should handle update error', async () => {
      const mockError = {
        response: { data: { message: 'Update failed' } },
        message: 'Update failed',
      };

      (axios.isAxiosError as any).mockReturnValue(true);
      mockPut.mockRejectedValue(mockError);

      await store.dispatch(
        updateJobApplication({
          id: 1,
          data: {
            companyName: 'Company B',
            position: 'Senior Developer',
            status: 'Interview',
          },
        })
      );

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBe('Update failed');
    });
  });

  describe('test deleteJobApplication action', () => {
    it('should delete job application successfully', async () => {
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

      mockDelete.mockResolvedValue({});

      await store.dispatch(deleteJobApplication(1));

      const state = (store.getState() as any).jobApplications;
      expect(state.applications).toHaveLength(0);
      expect(state.error).toBeNull();
    });

    it('should handle delete error', async () => {
      const mockError = {
        response: { data: { message: 'Delete failed' } },
        message: 'Delete failed',
      };

      (axios.isAxiosError as any).mockReturnValue(true);
      mockDelete.mockRejectedValue(mockError);

      await store.dispatch(deleteJobApplication(1));

      const state = (store.getState() as any).jobApplications;
      expect(state.error).toBe('Delete failed');
    });
  });
});
