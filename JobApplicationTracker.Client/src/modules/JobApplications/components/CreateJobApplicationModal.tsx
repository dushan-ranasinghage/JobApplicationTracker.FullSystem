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
} from '@mui/material';
import { useState, useEffect } from 'react';

import type { JobApplicationStatus } from '../../../redux/types/jobApplications';
import { JobApplicationStatusValues } from '../../../redux/types/jobApplications';
import type { CreateJobApplicationData } from '../../../redux/actions/jobApplications/jobApplications';
import { getStatusDisplayName } from '../utils/statusUtils';

interface CreateJobApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateJobApplicationData) => void;
}

const CreateJobApplicationModal = ({
  open,
  onClose,
  onCreate,
}: CreateJobApplicationModalProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    status: 'Applied' as JobApplicationStatus,
    dateApplied: new Date().toISOString().split('T')[0], // Default to today
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        companyName: '',
        position: '',
        status: 'Applied' as JobApplicationStatus,
        dateApplied: new Date().toISOString().split('T')[0],
      });
    }
  }, [open]);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    onCreate({
      ...formData,
      dateApplied: new Date(formData.dateApplied).toISOString(),
    });
    onClose();
  };

  const handleClose = () => {
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
          <TextField
            label="Company Name"
            value={formData.companyName}
            onChange={handleChange('companyName')}
            fullWidth
            required
          />
          <TextField
            label="Position"
            value={formData.position}
            onChange={handleChange('position')}
            fullWidth
            required
          />
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={handleChange('status')}
            fullWidth
            required
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
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateJobApplicationModal;
