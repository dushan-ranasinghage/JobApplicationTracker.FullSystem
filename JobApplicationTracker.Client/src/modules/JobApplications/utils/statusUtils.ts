/**
 * @file statusUtils.ts
 * @description Utility functions for job application status handling
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import type { JobApplicationStatus } from '../../../redux/types/jobApplications';
import { JobApplicationStatusEnum } from '../../../redux/types/jobApplications';

export const getStatusNumber = (status: string | number): number => {
    if (typeof status === 'number') {
        return status;
    }
    switch (status) {
        case 'Applied':
            return JobApplicationStatusEnum.Applied;
        case 'Interview':
            return JobApplicationStatusEnum.Interview;
        case 'Offer':
            return JobApplicationStatusEnum.Offer;
        case 'Accepted':
            return JobApplicationStatusEnum.Accepted;
        case 'Rejected':
            return JobApplicationStatusEnum.Rejected;
        default:
            return 0;
    }
};

export const getStatusString = (status: string | number): JobApplicationStatus => {
    if (typeof status === 'string') {
        // Validate that it's a valid status string
        const validStatuses: JobApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Accepted', 'Rejected'];
        if (validStatuses.includes(status as JobApplicationStatus)) {
            return status as JobApplicationStatus;
        }
        return 'Applied'; // Default fallback
    }
    switch (status) {
        case JobApplicationStatusEnum.Applied:
            return 'Applied';
        case JobApplicationStatusEnum.Interview:
            return 'Interview';
        case JobApplicationStatusEnum.Offer:
            return 'Offer';
        case JobApplicationStatusEnum.Accepted:
            return 'Accepted';
        case JobApplicationStatusEnum.Rejected:
            return 'Rejected';
        default:
            return 'Applied';
    }
};

export const getStatusColor = (status: string | number) => {
    const statusValue =
        typeof status === 'number' ? status : getStatusNumber(status);
    switch (statusValue) {
        case JobApplicationStatusEnum.Applied:
            return 'default';
        case JobApplicationStatusEnum.Interview:
            return 'info';
        case JobApplicationStatusEnum.Offer:
            return 'success';
        case JobApplicationStatusEnum.Accepted:
            return 'success';
        case JobApplicationStatusEnum.Rejected:
            return 'error';
        default:
            return 'default';
    }
};

export const getStatusDisplayName = (status: string | number) => {
    const statusValue =
        typeof status === 'number' ? status : getStatusNumber(status);
    switch (statusValue) {
        case JobApplicationStatusEnum.Applied:
            return 'Application Submitted';
        case JobApplicationStatusEnum.Interview:
            return 'Interview Scheduled';
        case JobApplicationStatusEnum.Offer:
            return 'Offer Received';
        case JobApplicationStatusEnum.Accepted:
            return 'Offer Accepted';
        case JobApplicationStatusEnum.Rejected:
            return 'Application Rejected';
        default:
            return String(status);
    }
};
