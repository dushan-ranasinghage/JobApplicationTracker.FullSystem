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
  IconButton,
  Tooltip,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment-timezone';

import { useState } from 'react';

import type { JobApplication, PaginationMetadata, JobApplicationStatus } from '../../redux/types/jobApplications';
import { JobApplicationStatusValues } from '../../redux/types/jobApplications';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { getStatusColor, getStatusDisplayName } from './utils/statusUtils';
import EditJobApplicationModal from './components/EditJobApplicationModal';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import CreateJobApplicationModal from './components/CreateJobApplicationModal';
import { useAppDispatch } from '../../redux/store';
import {
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  type CreateJobApplicationData,
  type UpdateJobApplicationData,
} from '../../redux/actions/jobApplications/jobApplications';

interface JobApplicationsMainProps {
  applications: JobApplication[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMetadata | null;
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const JobApplicationsMain = ({
  applications,
  isLoading,
  error,
  pagination,
  onPageChange,
  onPageSizeChange
}: JobApplicationsMainProps) => {
  const dispatch = useAppDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<JobApplication | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleEdit = (id: number) => {
    const application = applications.find((app) => app.id === id);
    if (application) {
      setSelectedApplication(application);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const application = applications.find((app) => app.id === id);
    if (application) {
      setApplicationToDelete(application);
      setDeleteDialogOpen(true);
    }
  };

  const handleCreate = async (data: CreateJobApplicationData) => {
    await dispatch(createJobApplication(data)).unwrap();
    setCreateModalOpen(false);
    // onRefetch();
  };

  const handleEditSave = async (id: number, data: UpdateJobApplicationData) => {
    await dispatch(updateJobApplication({ id, data })).unwrap();
    setEditModalOpen(false);
    setSelectedApplication(null);
    // onRefetch();
  };

  const handleStatusChange = async (id: number, newStatus: JobApplicationStatus) => {
    const application = applications.find((app) => app.id === id);
    if (application) {
      const updateData: UpdateJobApplicationData = {
        companyName: application.companyName,
        position: application.position,
        status: newStatus,
      };
      try {
        await dispatch(updateJobApplication({ id, data: updateData })).unwrap();
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (applicationToDelete) {
      try {
        await dispatch(deleteJobApplication(applicationToDelete.id)).unwrap();
        setDeleteDialogOpen(false);
        setApplicationToDelete(null);
        // onRefetch();
      } catch (error) {
        console.error('Failed to delete job application:', error);
      }
    }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setApplicationToDelete(null);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Error message={error} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" component="h2">
          No of Job Applications ({pagination?.totalCount ?? applications.length})
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          Add Job Application
        </Button>
      </Box>
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>{app.companyName}</TableCell>
                  <TableCell>{app.position}</TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value as JobApplicationStatus)
                      }
                      size="small"
                      sx={{
                        minWidth: 160,
                        height: 28,
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1.5,
                          backgroundColor: (theme) => {
                            const color = getStatusColor(app.status);
                            if (color === 'success') return theme.palette.success.main;
                            if (color === 'info') return theme.palette.info.main;
                            if (color === 'error') return theme.palette.error.main;
                            return theme.palette.grey[300];
                          },
                          color: (theme) => {
                            const color = getStatusColor(app.status);
                            if (color === 'success' || color === 'info' || color === 'error') {
                              return theme.palette.common.white;
                            }
                            return theme.palette.text.primary;
                          },
                          borderRadius: 1.5,
                          fontWeight: 500,
                          fontSize: '0.8125rem',
                          display: 'flex',
                          alignItems: 'center',
                          '&:focus': {
                            backgroundColor: (theme) => {
                              const color = getStatusColor(app.status);
                              if (color === 'success') return theme.palette.success.main;
                              if (color === 'info') return theme.palette.info.main;
                              if (color === 'error') return theme.palette.error.main;
                              return theme.palette.grey[300];
                            },
                          },
                        },
                        '& .MuiSelect-icon': {
                          color: (theme) => {
                            const color = getStatusColor(app.status);
                            if (color === 'success' || color === 'info' || color === 'error') {
                              return theme.palette.common.white;
                            }
                            return theme.palette.text.primary;
                          },
                          fontSize: '1.2rem',
                        },
                      }}
                    >
                      <MenuItem value={JobApplicationStatusValues.APPLIED}>
                        {getStatusDisplayName(JobApplicationStatusValues.APPLIED)}
                      </MenuItem>
                      <MenuItem value={JobApplicationStatusValues.INTERVIEW}>
                        {getStatusDisplayName(JobApplicationStatusValues.INTERVIEW)}
                      </MenuItem>
                      <MenuItem value={JobApplicationStatusValues.OFFER}>
                        {getStatusDisplayName(JobApplicationStatusValues.OFFER)}
                      </MenuItem>
                      <MenuItem value={JobApplicationStatusValues.ACCEPTED}>
                        {getStatusDisplayName(JobApplicationStatusValues.ACCEPTED)}
                      </MenuItem>
                      <MenuItem value={JobApplicationStatusValues.REJECTED}>
                        {getStatusDisplayName(JobApplicationStatusValues.REJECTED)}
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {moment.utc(app.dateApplied).tz('Pacific/Auckland').format('DD/MM/YYYY, HH:mm')}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(app.id)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(app.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {pagination && (
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
            Showing {applications.length > 0 ? (pagination.pageNumber - 1) * pagination.pageSize + 1 : 0} -{' '}
            {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of{' '}
            {pagination.totalCount}
          </Typography>
        </Box>
      )}
      <EditJobApplicationModal
        open={editModalOpen}
        application={selectedApplication}
        onClose={handleEditModalClose}
        onSave={handleEditSave}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        applicationName={
          applicationToDelete
            ? `${applicationToDelete.position} at ${applicationToDelete.companyName}`
            : ''
        }
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
      />
      <CreateJobApplicationModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </Container>
  );
};

export default JobApplicationsMain;
