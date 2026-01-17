/**
 * @file CreateJobApplicationModal.tsx
 * @description Modal component for creating new job applications
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useEffect } from 'react';

import type { JobApplicationStatus } from '../../../redux/types/jobApplications';
import { JobApplicationStatusValues } from '../../../redux/types/jobApplications';
import type { CreateJobApplicationData } from '../../../redux/actions/jobApplications/jobApplications';
import { getStatusDisplayName } from '../utils/statusUtils';
import { useJobApplicationForm } from '../hooks/useJobApplicationForm';

interface CreateJobApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateJobApplicationData) => void | Promise<void>;
}

const CreateJobApplicationModal = ({
  open,
  onClose,
  onCreate,
}: CreateJobApplicationModalProps) => {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleBlur,
    handleSubmit,
    reset,
    clearError,
  } = useJobApplicationForm({
    onSubmit: onCreate,
    onSuccess: onClose,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateField(field as keyof typeof formData, event.target.value);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const statusOptions: JobApplicationStatus[] = [
    JobApplicationStatusValues.APPLIED,
    JobApplicationStatusValues.INTERVIEW,
    JobApplicationStatusValues.OFFER,
    JobApplicationStatusValues.REJECTED,
    JobApplicationStatusValues.ACCEPTED,
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Job Application</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {errors.submit && (
            <Alert
              severity="error"
              onClose={() => clearError('submit')}
            >
              {errors.submit}
            </Alert>
          )}
          <TextField
            label="Company Name"
            value={formData.companyName}
            onChange={handleChange('companyName')}
            onBlur={handleBlur('companyName')}
            fullWidth
            required
            error={!!errors.companyName}
            helperText={errors.companyName}
            disabled={isSubmitting}
          />
          <TextField
            label="Position"
            value={formData.position}
            onChange={handleChange('position')}
            onBlur={handleBlur('position')}
            fullWidth
            required
            error={!!errors.position}
            helperText={errors.position}
            disabled={isSubmitting}
          />
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={handleChange('status')}
            fullWidth
            required
            disabled={isSubmitting}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {getStatusDisplayName(status)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date Applied"
            type="date"
            value={formData.dateApplied}
            onChange={handleChange('dateApplied')}
            onBlur={handleBlur('dateApplied')}
            fullWidth
            required
            error={!!errors.dateApplied}
            helperText={errors.dateApplied}
            disabled={isSubmitting}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateJobApplicationModal;
