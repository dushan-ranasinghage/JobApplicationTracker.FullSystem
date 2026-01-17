/**
 * @file AppRoutes.tsx
 * @description Application routes
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import JobApplicationsModuleLoader from '../modules/JobApplications/ModuleLoader';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading module...</div>}>
      <Routes>
        <Route path="/" element={<JobApplicationsModuleLoader />} />
        <Route path="/job-applications" element={<JobApplicationsModuleLoader />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
