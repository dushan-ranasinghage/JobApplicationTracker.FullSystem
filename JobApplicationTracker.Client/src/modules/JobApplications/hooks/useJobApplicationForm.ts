/**
 * @file useJobApplicationForm.ts
 * @description Custom hook for job application form validation and state management
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

import { useState, useCallback } from 'react';

import type { JobApplicationStatus } from '../../../redux/types/jobApplications';
import {
    validateField,
    validateForm,
    type JobApplicationFormData,
} from '../utils/validationUtils';

export interface JobApplicationFormState extends JobApplicationFormData {
    status: JobApplicationStatus;
}

export interface FormErrors {
    companyName?: string;
    position?: string;
    dateApplied?: string;
    submit?: string;
}

interface UseJobApplicationFormOptions {
    initialData?: Partial<JobApplicationFormState>;
    onSubmit: (data: JobApplicationFormState) => void | Promise<void>;
    onSuccess?: () => void;
}

export const useJobApplicationForm = ({
    initialData,
    onSubmit,
    onSuccess,
}: UseJobApplicationFormOptions) => {
    const [formData, setFormData] = useState<JobApplicationFormState>({
        companyName: initialData?.companyName || '',
        position: initialData?.position || '',
        status: initialData?.status || 'Applied',
        dateApplied:
            initialData?.dateApplied ||
            new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = useCallback(
        (field: keyof JobApplicationFormState, value: string | JobApplicationStatus) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            // Clear error for this field when user starts typing
            if (errors[field as keyof FormErrors]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field as keyof FormErrors];
                    return newErrors;
                });
            }

            // Validate field on blur or after change if already touched
            if (touched[field]) {
                const error = validateField(
                    field as keyof JobApplicationFormData,
                    value as string
                );
                if (error) {
                    setErrors((prev) => ({ ...prev, [field]: error }));
                }
            }
        },
        [errors, touched]
    );

    const handleBlur = useCallback(
        (field: keyof JobApplicationFormData) => () => {
            setTouched((prev) => ({ ...prev, [field]: true }));
            const error = validateField(field, formData[field] as string);
            if (error) {
                setErrors((prev) => ({ ...prev, [field]: error }));
            }
        },
        [formData]
    );

    const handleSubmit = useCallback(async () => {
        // Mark all fields as touched
        setTouched({
            companyName: true,
            position: true,
            dateApplied: true,
        });

        // Validate all fields
        const validationErrors = validateForm({
            companyName: formData.companyName,
            position: formData.position,
            dateApplied: formData.dateApplied,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors((prev) => ({ ...prev, submit: undefined }));

        try {
            await Promise.resolve(
                onSubmit({
                    ...formData,
                    companyName: formData.companyName.trim(),
                    position: formData.position.trim(),
                    dateApplied: new Date(formData.dateApplied).toISOString(),
                })
            );
            onSuccess?.();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to submit form';
            setErrors((prev) => ({ ...prev, submit: errorMessage }));
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, onSubmit, onSuccess]);

    const reset = useCallback((newData?: Partial<JobApplicationFormState>) => {
        setFormData({
            companyName: newData?.companyName || '',
            position: newData?.position || '',
            status: newData?.status || 'Applied',
            dateApplied:
                newData?.dateApplied || new Date().toISOString().split('T')[0],
        });
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, []);

    const setError = useCallback((field: keyof FormErrors, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    }, []);

    const clearError = useCallback((field: keyof FormErrors) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        updateField,
        handleBlur,
        handleSubmit,
        reset,
        setError,
        clearError,
    };
};
