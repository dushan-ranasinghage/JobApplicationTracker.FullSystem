/**
 * @file ModuleLoader.tsx
 * @description Module loader component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useEffect } from 'react';
import { lazy } from 'react';

import { useAppDispatch } from '../../redux/store';
import { fetchAllJobApplications } from '../../redux/actions/jobApplications/jobApplications';

const JobApplicationsMain = lazy(() => import('./Main'));

const JobApplicationsModuleLoader = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllJobApplications());
  }, [dispatch]);

  return <JobApplicationsMain />;
};

export default JobApplicationsModuleLoader;