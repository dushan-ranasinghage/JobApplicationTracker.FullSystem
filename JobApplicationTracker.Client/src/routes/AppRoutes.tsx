/**
 * @file AppRoutes.tsx
 * @description Application routes
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Routes, Route } from 'react-router-dom';

import JobApplications from '../modules/jobApplications/JobApplications';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JobApplications />} />
      <Route path="/job-applications" element={<JobApplications />} />
    </Routes>
  );
};

export default AppRoutes;
