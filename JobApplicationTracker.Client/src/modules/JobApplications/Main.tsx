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
import { getStatusColor, getStatusDisplayName } from './utils/statusUtils';

interface JobApplicationsMainProps {
  applications: JobApplication[];
  isLoading: boolean;
  error: string | null;
}

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
      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
        No of Job Applications ({applications.length})
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
                <TableCell>Company Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Applied</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>{app.companyName}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusDisplayName(app.status)}
                      color={
                        getStatusColor(app.status) as
                          | 'default'
                          | 'info'
                          | 'success'
                          | 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(app.dateApplied).toLocaleString()}
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
