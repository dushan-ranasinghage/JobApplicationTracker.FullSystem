/**
 * @file ModuleLoader.tsx
 * @description Module loader component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useEffect } from 'react';

import  JobApplicationsMain from './Main';
import { useAppDispatch } from '../../redux/store';
import { fetchAllJobApplications } from '../../redux/actions/jobApplications/jobApplications';

const JobApplicationsModuleLoader = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllJobApplications());
  }, [dispatch]);

  return <JobApplicationsMain />;
};

export default JobApplicationsModuleLoader;