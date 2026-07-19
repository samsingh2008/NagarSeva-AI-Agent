/**
 * Custom hook for managing complaint form state and logic
 */

import { useState, useCallback } from 'react';
import { apiUrl } from '@/lib/api';
import { ComplaintApiResponse } from '@/lib/complaints';
import { validateComplaintForm, ValidationError } from '@/utils/validation';

export interface ComplaintFormState {
  image: File | null;
  latitude: number | null;
  longitude: number | null;
  description: string;
  isLoadingLocation: boolean;
  isSubmitting: boolean;
  errors: ValidationError[];
  successMessage: string | null;
  errorMessage: string | null;
}

export const useComplaintForm = () => {
  const [state, setState] = useState<ComplaintFormState>({
    image: null,
    latitude: null,
    longitude: null,
    description: '',
    isLoadingLocation: false,
    isSubmitting: false,
    errors: [],
    successMessage: null,
    errorMessage: null,
  });

  /**
   * Handle image file selection
   */
  const handleImageChange = useCallback((file: File | null) => {
    setState((prev) => ({
      ...prev,
      image: file,
      errors: prev.errors.filter((e) => e.field !== 'image'),
    }));
  }, []);

  /**
   * Handle description change
   */
  const handleDescriptionChange = useCallback((description: string) => {
    setState((prev) => ({
      ...prev,
      description,
      errors: prev.errors.filter((e) => e.field !== 'description'),
    }));
  }, []);

  /**
   * Fetch GPS location using browser Geolocation API
   */
  const fetchLocation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoadingLocation: true,
      errorMessage: null,
    }));

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        isLoadingLocation: false,
        errorMessage: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
          isLoadingLocation: false,
          errors: prev.errors.filter((e) => e.field !== 'location'),
        }));
      },
      (error) => {
        let errorMessage = 'Failed to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        setState((prev) => ({
          ...prev,
          isLoadingLocation: false,
          errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  /**
   * Clear all form fields and messages
   */
  const resetForm = useCallback(() => {
    setState({
      image: null,
      latitude: null,
      longitude: null,
      description: '',
      isLoadingLocation: false,
      isSubmitting: false,
      errors: [],
      successMessage: null,
      errorMessage: null,
    });
  }, []);

  /**
   * Clear error messages
   */
  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      successMessage: null,
      errorMessage: null,
    }));
  }, []);

  /**
   * Validate form and return true if valid
   */
  const validateForm = useCallback((): boolean => {
    const errors = validateComplaintForm(
      state.image,
      state.latitude,
      state.longitude,
      state.description
    );

    if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        errors,
      }));
      return false;
    }

    setState((prev) => ({
      ...prev,
      errors: [],
    }));
    return true;
  }, [state.image, state.latitude, state.longitude, state.description]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (onSubmit: () => Promise<void>) => {
      if (!validateForm()) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        await onSubmit();
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          successMessage: 'Complaint submitted successfully!',
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to submit complaint';
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          errorMessage: message,
        }));
      }
    },
    [validateForm]
  );

  const submitComplaint = useCallback(async (payload: { image?: File | null; latitude: number | null; longitude: number | null; description: string }): Promise<ComplaintApiResponse> => {
    const formData = new FormData();
    if (payload.image) {
      formData.append('image', payload.image);
    }
    formData.append('description', payload.description);
    if (payload.latitude !== null) {
      formData.append('latitude', payload.latitude.toString());
    }
    if (payload.longitude !== null) {
      formData.append('longitude', payload.longitude.toString());
    }

    const response = await fetch(apiUrl('/complaints'), {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json().catch(() => ({}))) as ComplaintApiResponse;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit complaint');
    }

    return data;
  }, []);

  return {
    ...state,
    handleImageChange,
    handleDescriptionChange,
    fetchLocation,
    resetForm,
    clearMessages,
    validateForm,
    handleSubmit,
    submitComplaint,
  };
};
