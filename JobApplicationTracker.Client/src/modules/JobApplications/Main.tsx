/**
 * @file JobApplicationsMain.tsx
 * @description Job Applications main component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Container } from '@mui/material';

import type {
  JobApplication,
  PaginationMetadata,
} from '../../redux/types/jobApplications';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import JobApplicationsHeader from './components/JobApplicationsHeader';
import JobApplicationsTable from './components/Table/JobApplicationsTable';
import { useJobApplicationModals } from './hooks/useJobApplicationModals';

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
  onPageSizeChange,
}: JobApplicationsMainProps) => {
  const { modals, handleEdit, handleDelete, handleStatusChange, handleCreate } =
    useJobApplicationModals({ applications });

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
        onAddClick={handleCreate}
      />
      <JobApplicationsTable
        applications={applications}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        applicationsCount={applications.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
      {modals}
    </Container>
  );
};

export default JobApplicationsMain;
