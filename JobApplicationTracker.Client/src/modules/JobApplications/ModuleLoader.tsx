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
import { fetchAllJobApplications } from '../../redux/actions/jobApplications/jobApplications';
import {
  selectAllJobApplications,
  selectIsJobApplicationsLoading,
  selectJobApplicationsError,
} from '../../redux/selectors/jobApplications';

const JobApplicationsModuleLoader = () => {
  const dispatch = useAppDispatch();
  const applications = useSelector(selectAllJobApplications);
  const isLoading = useSelector(selectIsJobApplicationsLoading);
  const error = useSelector(selectJobApplicationsError);

  useEffect(() => {
    dispatch(fetchAllJobApplications());
  }, [dispatch]);

  return (
    <JobApplicationsMain
      applications={applications}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default JobApplicationsModuleLoader;
