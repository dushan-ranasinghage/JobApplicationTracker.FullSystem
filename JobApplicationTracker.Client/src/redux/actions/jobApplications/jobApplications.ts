/**
 * @file jobApplications.ts
 * @description Actions for job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { JobApplication } from '../../types/jobApplications';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7223/api';

/**
 * Fetch all job applications
 */
export const fetchAllJobApplications = createAsyncThunk(
  'jobApplications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<JobApplication[]>(`${API_BASE_URL}/job-applications`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message 
          || error.message 
          || 'Failed to fetch job applications';
        console.error('Error fetching job applications:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch job applications';
      console.error('Error fetching job applications:', error);
      return rejectWithValue(errorMessage);
    }
  }
);
