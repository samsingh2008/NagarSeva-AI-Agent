/**
 * Validation utilities for complaint form
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates that an image file exists and is valid
 */
export const validateImage = (file: File | null): ValidationError | null => {
  if (!file) {
    return {
      field: 'image',
      message: 'Please select an image file',
    };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      field: 'image',
      message: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      field: 'image',
      message: 'Image size must be less than 5MB',
    };
  }

  return null;
};

/**
 * Validates that GPS location has been obtained
 */
export const validateLocation = (
  latitude: number | null,
  longitude: number | null
): ValidationError | null => {
  if (latitude === null || longitude === null) {
    return {
      field: 'location',
      message: 'GPS location is required. Please enable location access.',
    };
  }

  // Validate reasonable coordinates
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return {
      field: 'location',
      message: 'Invalid GPS coordinates received',
    };
  }

  return null;
};

/**
 * Validates optional description
 */
export const validateDescription = (description: string): ValidationError | null => {
  if (description && description.length > 1000) {
    return {
      field: 'description',
      message: 'Description must be less than 1000 characters',
    };
  }

  return null;
};

/**
 * Validates all form fields
 */
export const validateComplaintForm = (
  image: File | null,
  latitude: number | null,
  longitude: number | null,
  description: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const imageError = validateImage(image);
  if (imageError) errors.push(imageError);

  const locationError = validateLocation(latitude, longitude);
  if (locationError) errors.push(locationError);

  const descriptionError = validateDescription(description);
  if (descriptionError) errors.push(descriptionError);

  return errors;
};
