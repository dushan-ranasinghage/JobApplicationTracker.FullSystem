/**
 * @file JobApplicationsMain.tsx
 * @description Job Applications main component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Container } from '@mui/material';
import { useState } from 'react';

import type { JobApplication, PaginationMetadata, JobApplicationStatus } from '../../redux/types/jobApplications';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import EditJobApplicationModal from './components/Modals/EditJobApplicationModal';
import DeleteConfirmationDialog from './components/Modals/DeleteConfirmationDialog';
import CreateJobApplicationModal from './components/Modals/CreateJobApplicationModal';
import JobApplicationsHeader from './components/JobApplicationsHeader';
import JobApplicationsTable from './components/Table/JobApplicationsTable';
import JobApplicationsPagination from './components/Table/JobApplicationsPagination';
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
  };

  const handleEditSave = async (id: number, data: UpdateJobApplicationData) => {
    await dispatch(updateJobApplication({ id, data })).unwrap();
    setEditModalOpen(false);
    setSelectedApplication(null);
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
      <JobApplicationsHeader
        totalCount={pagination?.totalCount ?? applications.length}
        onAddClick={() => setCreateModalOpen(true)}
      />
      <JobApplicationsTable
        applications={applications}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {pagination && (
        <JobApplicationsPagination
          pagination={pagination}
          applicationsCount={applications.length}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
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
