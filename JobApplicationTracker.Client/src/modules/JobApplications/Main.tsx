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
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';

import type { JobApplication } from '../../redux/types/jobApplications';
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
}

const JobApplicationsMain = ({
  applications,
  isLoading,
  error,
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
  };

  const handleEditSave = async (id: number, data: UpdateJobApplicationData) => {
    await dispatch(updateJobApplication({ id, data })).unwrap();
    setEditModalOpen(false);
    setSelectedApplication(null);
  };

  const handleDeleteConfirm = async () => {
    if (applicationToDelete) {
      try {
        await dispatch(deleteJobApplication(applicationToDelete.id)).unwrap();
        setDeleteDialogOpen(false);
        setApplicationToDelete(null);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6" component="h2">
          No of Job Applications ({applications.length})
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
