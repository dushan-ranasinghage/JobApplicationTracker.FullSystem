/**
 * @file Error.tsx
 * @description Error component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Alert } from '@mui/material';

interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <strong>Error:</strong> {message}
    </Alert>
  );
};

export default Error;
