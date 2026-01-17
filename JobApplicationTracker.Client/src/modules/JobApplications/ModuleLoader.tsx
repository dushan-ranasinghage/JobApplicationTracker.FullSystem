/**
 * @file ModuleLoader.tsx
 * @description Module loader component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import JobApplicationsMain from './Main';
import { useAppDispatch } from '../../redux/store';
import { fetchAllJobApplications } from '../../redux/actions/jobApplications/jobApplications';
import {
  selectAllJobApplications,
  selectIsJobApplicationsLoading,
  selectJobApplicationsError,
  selectJobApplicationsPagination,
} from '../../redux/selectors/jobApplications';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NUMBER = 1;

const JobApplicationsModuleLoader = () => {
  const dispatch = useAppDispatch();
  const applications = useSelector(selectAllJobApplications);
  const isLoading = useSelector(selectIsJobApplicationsLoading);
  const error = useSelector(selectJobApplicationsError);
  const pagination = useSelector(selectJobApplicationsPagination);
  
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    dispatch(fetchAllJobApplications({ pageNumber, pageSize }));

    // Every minute, fetch the latest job applications
    const intervalId = setInterval(() => {
      dispatch(fetchAllJobApplications({ pageNumber, pageSize }));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch, pageNumber, pageSize]);

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page when page size changes
  };

  const handleRefetch = () => {
    dispatch(fetchAllJobApplications({ pageNumber, pageSize }));
  };

  return (
    <JobApplicationsMain
      applications={applications}
      isLoading={isLoading}
      error={error}
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onRefetch={handleRefetch}
    />
  );
};

export default JobApplicationsModuleLoader;
