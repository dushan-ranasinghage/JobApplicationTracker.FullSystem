/**
 * @file useJobApplicationModals.ts
 * @description Custom hook for managing job application modals
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useState } from 'react';

import type {
  JobApplication,
  JobApplicationStatus,
} from '../../../redux/types/jobApplications';
import { useAppDispatch } from '../../../redux/store';
import {
  refreshJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  type CreateJobApplicationData,
  type UpdateJobApplicationData,
} from '../../../redux/actions/jobApplications/jobApplications';
import EditJobApplicationModal from '../components/Modals/EditJobApplicationModal';
import DeleteConfirmationDialog from '../components/Modals/DeleteConfirmationDialog';
import CreateJobApplicationModal from '../components/Modals/CreateJobApplicationModal';
import { useSelector } from 'react-redux';
import {
  selectCurrentPage,
  selectPageSize,
} from '../../../redux/selectors/preferences';

interface UseJobApplicationModalsProps {
  applications: JobApplication[];
}

export const useJobApplicationModals = ({
  applications,
}: UseJobApplicationModalsProps) => {
  const dispatch = useAppDispatch();

  const pageSize = useSelector(selectPageSize);
  const pageNumber = useSelector(selectCurrentPage);

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
    dispatch(refreshJobApplications({ pageNumber, pageSize }));
  };

  const handleCreate = async (data: CreateJobApplicationData) => {
    await dispatch(createJobApplication(data)).unwrap();
    dispatch(refreshJobApplications({ pageNumber, pageSize }));
    setCreateModalOpen(false);
  };

  const handleEditSave = async (id: number, data: UpdateJobApplicationData) => {
    await dispatch(updateJobApplication({ id, data })).unwrap();
    setEditModalOpen(false);
    setSelectedApplication(null);
  };

  const handleStatusChange = async (
    id: number,
    newStatus: JobApplicationStatus
  ) => {
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
        dispatch(refreshJobApplications({ pageNumber, pageSize }));
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

  const modals = (
    <>
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
    </>
  );

  return {
    modals,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleCreate: () => setCreateModalOpen(true),
  };
};
