/**
 * @file JobApplicationsMain.tsx
 * @description Job Applications main component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

import type { JobApplication } from '../../redux/types/jobApplications';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

interface JobApplicationsMainProps {
  applications: JobApplication[];
  isLoading: boolean;
  error: string | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Applied':
      return 'default';
    case 'Interview':
      return 'info';
    case 'Offer':
      return 'success';
    case 'Accepted':
      return 'success';
    case 'Rejected':
      return 'error';
    default:
      return 'default';
  }
};

const JobApplicationsMain = ({
  applications,
  isLoading,
  error,
}: JobApplicationsMainProps) => {
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Application Tracker
        </Typography>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Application Tracker
        </Typography>
        <Error message={error} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Application Tracker
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Job Applications ({applications.length})
      </Typography>
      {applications.length === 0 ? (
        <Box sx={{ py: 4 }}>
          <Typography variant="body1">No job applications found.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Applied</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>{app.companyName}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status}
                      color={getStatusColor(app.status) as 'default' | 'info' | 'success' | 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {app.updatedAt
                      ? new Date(app.updatedAt).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default JobApplicationsMain;
