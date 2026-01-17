/**
 * @file JobApplicationCard.tsx
 * @description Job Application Card component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Card, CardContent, Typography, Box } from '@mui/material';

import type { JobApplication } from '../../../redux/types/jobApplications';

interface JobApplicationCardProps {
  application: JobApplication;
}

const JobApplicationCard = ({ application }: JobApplicationCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {application.position} at {application.companyName}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Status:</strong> {application.status}
          </Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Applied:</strong>{' '}
            {new Date(application.dateApplied).toLocaleDateString()}
          </Typography>
        </Box>
        {application.updatedAt && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong>{' '}
              {new Date(application.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(application.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobApplicationCard;
