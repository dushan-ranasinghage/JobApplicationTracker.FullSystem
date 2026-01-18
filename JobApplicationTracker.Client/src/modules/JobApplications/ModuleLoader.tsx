/**
 * @file ModuleLoader.tsx
 * @description Module loader component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import JobApplicationsMain from './Main';
import { useAppDispatch } from '../../redux/store';
import {
  fetchAllJobApplications,
  refreshJobApplications,
} from '../../redux/actions/jobApplications/jobApplications';
import {
  selectAllJobApplications,
  selectIsJobApplicationsLoading,
  selectJobApplicationsError,
  selectJobApplicationsPagination,
} from '../../redux/selectors/jobApplications';
import {
  selectPageSize,
  selectCurrentPage,
} from '../../redux/selectors/preferences';
import {
  setPageSize,
  setCurrentPage,
} from '../../redux/reducers/preferences/preferences';

const JobApplicationsModuleLoader = () => {
  const dispatch = useAppDispatch();
  const applications = useSelector(selectAllJobApplications);
  const isLoading = useSelector(selectIsJobApplicationsLoading);
  const error = useSelector(selectJobApplicationsError);
  const pagination = useSelector(selectJobApplicationsPagination);
  const pageSize = useSelector(selectPageSize);
  const pageNumber = useSelector(selectCurrentPage);

  useEffect(() => {
    dispatch(fetchAllJobApplications({ pageNumber, pageSize }));

    // Every minute, refresh the latest job applications
    const intervalId = setInterval(() => {
      dispatch(refreshJobApplications({ pageNumber, pageSize }));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch, pageNumber, pageSize]);

  const handlePageChange = (newPageNumber: number) => {
    dispatch(setCurrentPage(newPageNumber));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize));
    dispatch(setCurrentPage(1)); // Reset to first page when page size changes
  };

  return (
    <JobApplicationsMain
      applications={applications}
      isLoading={isLoading}
      error={error}
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default JobApplicationsModuleLoader;
