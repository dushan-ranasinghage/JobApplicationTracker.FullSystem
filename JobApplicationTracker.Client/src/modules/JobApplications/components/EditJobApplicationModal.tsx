/**
 * @file EditJobApplicationModal.tsx
 * @description Modal component for editing job applications
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

import type {
    JobApplication,
    JobApplicationStatus,
} from '../../../redux/types/jobApplications';
import { JobApplicationStatusValues } from '../../../redux/types/jobApplications';
import type { UpdateJobApplicationData } from '../../../redux/actions/jobApplications/jobApplications';
import { getStatusDisplayName } from '../utils/statusUtils';

interface EditJobApplicationModalProps {
    open: boolean;
    application: JobApplication | null;
    onClose: () => void;
    onSave: (id: number, data: UpdateJobApplicationData) => Promise<void>;
}

const EditJobApplicationModal = ({
    open,
    application,
    onClose,
    onSave,
}: EditJobApplicationModalProps) => {
    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        status: 'Applied' as JobApplicationStatus,
        dateApplied: '',
    });

    useEffect(() => {
        if (application) {
            setFormData({
                companyName: application.companyName,
                position: application.position,
                status: application.status,
                dateApplied: application.dateApplied.split('T')[0], // Format date for input
            });
        }
    }, [application]);

    const handleChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (application) {
            await onSave(application.id, {
                ...formData,
                dateApplied: new Date(formData.dateApplied).toISOString(),
            });
        }
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
            <DialogTitle>Edit Job Application</DialogTitle>
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
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditJobApplicationModal;
