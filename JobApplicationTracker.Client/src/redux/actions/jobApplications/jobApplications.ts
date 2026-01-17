/**
 * @file jobApplications.ts
 * @description Actions for job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { JobApplicationTrackerClient } from '../../../clients/JobApplicationTrackerClient';
import type { JobApplication, JobApplicationStatus, PaginatedJobApplicationsResponse } from '../../types/jobApplications';
import { getStatusNumber, getStatusString } from '../../../modules/JobApplications/utils/statusUtils';

export interface CreateJobApplicationData {
  companyName: string;
  position: string;
  status: JobApplicationStatus;
}

export interface UpdateJobApplicationData {
  companyName: string;
  position: string;
  status: JobApplicationStatus;
}

// Payload types for API (status as number)
interface CreateJobApplicationPayload {
  companyName: string;
  position: string;
  status: number;
}

interface UpdateJobApplicationPayload {
  companyName: string;
  position: string;
  status: number;
}

export interface FetchJobApplicationsParams {
  pageNumber?: number;
  pageSize?: number;
}

async function fetchJobApplicationsData(
  params: FetchJobApplicationsParams = {}
) {
  const { pageNumber, pageSize } = params;
  const queryParams = new URLSearchParams();

  if (pageNumber !== undefined) {
    queryParams.append('pageNumber', pageNumber.toString());
  }
  if (pageSize !== undefined) {
    queryParams.append('pageSize', pageSize.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/job-applications?${queryString}` : '/job-applications';

  const response = await JobApplicationTrackerClient.get<PaginatedJobApplicationsResponse>(
    url
  );

  // Handle cases where response.data might be undefined or have different structure
  if (!response || !response.data) {
    console.error('Invalid response from server:', response);
    throw new Error('Invalid response from server');
  }

  const responseData = response.data;
  
  // Handle both nested data structure (response.data.data) and flat structure (response.data)
  // Check if data exists, if not, it might be an empty response or different structure
  let dataArray: JobApplication[] = [];
  
  if (Array.isArray(responseData.data)) {
    // Standard structure: { data: [...], pageNumber, pageSize, etc. }
    dataArray = responseData.data;
  } else if (Array.isArray(responseData)) {
    // Response is directly an array
    dataArray = responseData as unknown as JobApplication[];
  } else if (!responseData.data) {
    // No data property - might be empty or different structure
    console.warn('Response data structure is invalid. Expected data property:', responseData);
    dataArray = [];
  }

  // Convert status from number to string if needed
  const applications = dataArray.map((app) => ({
    ...app,
    status: getStatusString(app.status as number | string),
  }));

  // Calculate totalCount from data array if not provided by API
  // Use response pageSize if available, otherwise use the requested pageSize, otherwise default to 5
  const responsePageSize = responseData.pageSize ?? pageSize ?? 5;
  const totalCount = responseData.totalCount ?? dataArray.length;
  const totalPages = responseData.totalPages ?? Math.ceil(totalCount / responsePageSize);

  return {
    applications,
    pagination: {
      pageNumber: responseData.pageNumber ?? 1,
      pageSize: responsePageSize,
      totalCount: totalCount,
      totalPages: totalPages,
    },
  };
}

export const fetchAllJobApplications = createAsyncThunk(
  'jobApplications/fetchAll',
  async (params: FetchJobApplicationsParams = {}, { rejectWithValue }) => {
    try {
      return await fetchJobApplicationsData(params);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch job applications';
        console.error('Error fetching job applications:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch job applications';
      console.error('Error fetching job applications:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshJobApplications = createAsyncThunk(
  'jobApplications/refresh',
  async (params: FetchJobApplicationsParams = {}, { rejectWithValue }) => {
    try {
      return await fetchJobApplicationsData(params);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to refresh job applications';
        console.error('Error refreshing job applications:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to refresh job applications';
      console.error('Error refreshing job applications:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createJobApplication = createAsyncThunk(
  'jobApplications/create',
  async (data: CreateJobApplicationData, { rejectWithValue }) => {
    try {
      // Convert status from string to number for API
      const payload: CreateJobApplicationPayload = {
        companyName: data.companyName,
        position: data.position,
        status: getStatusNumber(data.status),
      };
      const response = await JobApplicationTrackerClient.post<JobApplication>(
        '/job-applications',
        payload
      );
      // Convert status from number to string
      return {
        ...response.data,
        status: getStatusString(response.data.status as number | string),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to create job application';
        console.error('Error creating job application:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create job application';
      console.error('Error creating job application:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateJobApplication = createAsyncThunk(
  'jobApplications/update',
  async (
    { id, data }: { id: number; data: UpdateJobApplicationData },
    { rejectWithValue }
  ) => {
    try {
      // Convert status from string to number for API
      const payload: UpdateJobApplicationPayload = {
        companyName: data.companyName,
        position: data.position,
        status: getStatusNumber(data.status),
      };
      const response = await JobApplicationTrackerClient.put<JobApplication>(
        `/job-applications/${id}`,
        payload
      );

      // Handle 204 No Content or empty response
      const hasNoContent =
        !response.data ||
        (typeof response.data === 'object' &&
          response.data !== null &&
          Object.keys(response.data).length === 0);

      if (hasNoContent) {
        return {
          ...data,
          id,
        };
      }

      // Convert status from number to string if response has data
      return {
        ...response.data,
        status: getStatusString(response.data.status as number | string),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to update job application';
        console.error('Error updating job application:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update job application';
      console.error('Error updating job application:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteJobApplication = createAsyncThunk(
  'jobApplications/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await JobApplicationTrackerClient.delete(`/job-applications/${id}`);
      return id;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to delete job application';
        console.error('Error deleting job application:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete job application';
      console.error('Error deleting job application:', error);
      return rejectWithValue(errorMessage);
    }
  }
);
