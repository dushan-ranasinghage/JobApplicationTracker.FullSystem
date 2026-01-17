/**
 * @file AppRoutes.tsx
 * @description Application routes
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const JobApplicationsModuleLoader = lazy(() => import('../modules/JobApplications/ModuleLoader'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading module...</div>}>
            <JobApplicationsModuleLoader />
          </Suspense>
        }
      />
      <Route
        path="/job-applications"
        element={
          <Suspense fallback={<div>Loading module...</div>}>
            <JobApplicationsModuleLoader />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
