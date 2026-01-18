/**
 * @file JobApplicationsPagination.tsx
 * @description Pagination component for job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

import type { PaginationMetadata } from '../../../../redux/types/jobApplications';

interface JobApplicationsPaginationProps {
  pagination: PaginationMetadata;
  applicationsCount: number;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const JobApplicationsPagination = ({
  pagination,
  applicationsCount,
  onPageChange,
  onPageSizeChange,
}: JobApplicationsPaginationProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 3,
        gap: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Page Size</InputLabel>
        <Select
          value={pagination.pageSize}
          label="Page Size"
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      {pagination.totalPages > 0 && (
        <Pagination
          count={pagination.totalPages}
          page={pagination.pageNumber}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          showFirstButton
          showLastButton
        />
      )}
      <Typography variant="body2" sx={{ minWidth: 150, textAlign: 'right' }}>
        Showing{' '}
        {applicationsCount > 0
          ? (pagination.pageNumber - 1) * pagination.pageSize + 1
          : 0}{' '}
        -{' '}
        {Math.min(
          pagination.pageNumber * pagination.pageSize,
          pagination.totalCount
        )}{' '}
        of {pagination.totalCount}
      </Typography>
    </Box>
  );
};

export default JobApplicationsPagination;
