/**
 * @file App.tsx
 * @description Main application component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from './redux/store';
import { fetchAllJobApplications } from './redux/actions/jobApplications/jobApplications';
import {
  selectAllJobApplications,
  selectIsJobApplicationsLoading,
  selectJobApplicationsError,
} from './redux/selectors/jobApplications';
import type { JobApplication } from './redux/types/jobApplications';

const App = () => {
  const dispatch = useAppDispatch();
  const applications = useSelector(selectAllJobApplications);
  const isLoading = useSelector(selectIsJobApplicationsLoading);
  const error = useSelector(selectJobApplicationsError);

  useEffect(() => {
    dispatch(fetchAllJobApplications());
  }, [dispatch]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Job Application Tracker</h1>
      
      {isLoading && <p>Loading job applications...</p>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!isLoading && !error && (
        <>
          <h2>Job Applications ({applications.length})</h2>
          {applications.length === 0 ? (
            <p>No job applications found.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {applications.map((app: JobApplication) => (
                <div
                  key={app.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0' }}>
                    {app.position} at {app.companyName}
                  </h3>
                  <p style={{ margin: '4px 0', color: '#666' }}>
                    <strong>Status:</strong> {app.status}
                  </p>
                  <p style={{ margin: '4px 0', color: '#666' }}>
                    <strong>Applied:</strong> {new Date(app.dateApplied).toLocaleDateString()}
                  </p>
                  {app.updatedAt && (
                    <p style={{ margin: '4px 0', color: '#666' }}>
                      <strong>Last Updated:</strong> {new Date(app.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ margin: '4px 0', color: '#999', fontSize: '12px' }}>
                    Created: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
