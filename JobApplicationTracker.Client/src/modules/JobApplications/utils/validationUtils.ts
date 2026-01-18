/**
 * @file validationUtils.ts
 * @description Validation utilities for job application forms
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

export interface JobApplicationFormData {
  companyName: string;
  position: string;
  dateApplied: string;
}

export type ValidationError = string | undefined;

/**
 * Validates company name field
 */
export const validateCompanyName = (value: string): ValidationError => {
  if (!value.trim()) {
    return 'Company name is required';
  }
  if (value.trim().length < 2) {
    return 'Company name must be at least 2 characters';
  }
  if (value.trim().length > 200) {
    return 'Company name must be less than 100 characters';
  }
  return undefined;
};

/**
 * Validates position field
 */
export const validatePosition = (value: string): ValidationError => {
  if (!value.trim()) {
    return 'Position is required';
  }
  if (value.trim().length < 2) {
    return 'Position must be at least 2 characters';
  }
  if (value.trim().length > 200) {
    return 'Position must be less than 100 characters';
  }
  return undefined;
};

/**
 * Validates date applied field
 */
export const validateDateApplied = (value: string): ValidationError => {
  if (!value) {
    return 'Date applied is required';
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return 'Please enter a valid date';
  }
  // Allow dates up to today (not future dates)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) {
    return 'Date applied cannot be in the future';
  }
  return undefined;
};

/**
 * Validates a specific field by name
 */
export const validateField = (
  field: keyof JobApplicationFormData,
  value: string
): ValidationError => {
  switch (field) {
    case 'companyName':
      return validateCompanyName(value);
    case 'position':
      return validatePosition(value);
    case 'dateApplied':
      return validateDateApplied(value);
    default:
      return undefined;
  }
};

/**
 * Validates all fields in the form data
 */
export const validateForm = (
  formData: JobApplicationFormData
): Partial<Record<keyof JobApplicationFormData, string>> => {
  const errors: Partial<Record<keyof JobApplicationFormData, string>> = {};

  const companyNameError = validateCompanyName(formData.companyName);
  if (companyNameError) {
    errors.companyName = companyNameError;
  }

  const positionError = validatePosition(formData.position);
  if (positionError) {
    errors.position = positionError;
  }

  const dateError = validateDateApplied(formData.dateApplied);
  if (dateError) {
    errors.dateApplied = dateError;
  }

  return errors;
};
