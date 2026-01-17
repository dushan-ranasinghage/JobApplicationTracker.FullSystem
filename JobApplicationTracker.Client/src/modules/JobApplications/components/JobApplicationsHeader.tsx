/**
 * @file JobApplicationsHeader.tsx
 * @description Header component for Job Applications with title and Add button
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface JobApplicationsHeaderProps {
  totalCount: number;
  onAddClick: () => void;
}

const JobApplicationsHeader = ({
  totalCount,
  onAddClick,
}: JobApplicationsHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Typography variant="h6" component="h2">
        No of Job Applications ({totalCount})
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddClick}
      >
        Add Job Application
      </Button>
    </Box>
  );
};

export default JobApplicationsHeader;
