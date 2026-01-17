/**
 * @file JobApplicationsTable.tsx
 * @description Table component for displaying job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';

import type { JobApplication, JobApplicationStatus } from '../../../../redux/types/jobApplications';
import JobApplicationTableRow from './JobApplicationTableRow';

interface JobApplicationsTableProps {
  applications: JobApplication[];
  onStatusChange: (id: number, newStatus: JobApplicationStatus) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const JobApplicationsTable = ({
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}: JobApplicationsTableProps) => {
  if (applications.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body1">No job applications found.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company Name</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date Applied</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <JobApplicationTableRow
              key={app.id}
              application={app}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobApplicationsTable;
