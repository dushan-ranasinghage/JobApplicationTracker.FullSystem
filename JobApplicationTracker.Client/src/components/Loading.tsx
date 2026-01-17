/**
 * @file Loading.tsx
 * @description Loading component
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
      <CircularProgress />
      <Typography variant="body1">Loading job applications...</Typography>
    </Box>
  );
};

export default Loading;
