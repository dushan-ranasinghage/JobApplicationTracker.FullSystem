/**
 * @file AppRoutes.tsx
 * @description Application routes
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';

const JobApplicationsModuleLoader = lazy(
  () => import('../modules/JobApplications/ModuleLoader')
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/job-applications" replace />} />
      <Route
        path="/job-applications"
        element={
          <MainLayout>
            <Suspense fallback={<Loading />}>
              <JobApplicationsModuleLoader />
            </Suspense>
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
