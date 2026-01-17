/**
 * @file jobApplications.ts
 * @description Types for job applications - matches backend DTO
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

export interface JobApplication {
  id: number;
  companyName: string;
  position: string;
  status: JobApplicationStatus;
  dateApplied: string; 
  createdAt: string;
  updatedAt: string | null;
}

export type JobApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Accepted';

export const JobApplicationStatusValues = {
  APPLIED: 'Applied' as const,
  INTERVIEW: 'Interview' as const,
  OFFER: 'Offer' as const,
  REJECTED: 'Rejected' as const,
  ACCEPTED: 'Accepted' as const,
} as const;

export const JobApplicationStatusEnum = {
  Applied: 1,
  Interview: 2,
  Offer: 3,
  Rejected: 4,
  Accepted: 5,
} as const;

export interface JobApplicationsState {
  applications: JobApplication[];
  status: 'idle' | 'loading' | 'finished' | 'error';
  error: string | null;
}
