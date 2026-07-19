/**
 * Complaint Form Component
 * Handles image upload, GPS location detection, and complaint submission
 */

'use client';

import { useRef, useState } from 'react';
import AIAnalysis from '@/components/AIAnalysis';
import { useComplaintForm } from '@/hooks/useComplaintForm';
import { ComplaintRecord } from '@/lib/complaints';

export default function ComplaintForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    image,
    latitude,
    longitude,
    description,
    isLoadingLocation,
    isSubmitting,
    errors,
    successMessage,
    errorMessage,
    handleImageChange,
    handleDescriptionChange,
    fetchLocation,
    resetForm,
    clearMessages,
    handleSubmit,
    submitComplaint,
  } = useComplaintForm();

  const [preview, setPreview] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<ComplaintRecord | null>(null);

  /**
   * Handle image file selection with preview
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleImageChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  /**
   * Handle form submission
   */
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setSubmittedComplaint(null);

    await handleSubmit(async () => {
      if (!image || latitude === null || longitude === null) {
        throw new Error('Missing required fields');
      }

      const response = await submitComplaint({ image, latitude, longitude, description });

      console.log("Full response:", response);
      console.log("Response.data:", response.data);

      setSubmittedComplaint(response.data || null);

      // Reset form on successful submission
      resetForm();
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  /**
   * Handle clearing image
   */
  const handleClearImage = () => {
    handleImageChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Get error message for specific field
   */
  const getFieldError = (field: string) => {
    return errors.find((e) => e.field === field)?.message;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Complaint</h1>
      <p className="text-gray-600 mb-8">
        Help us improve your city by reporting issues with photos and location details.
      </p>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{errorMessage}</p>
        </div>
      )}

      {submittedComplaint && <AIAnalysis complaint={submittedComplaint} className="mb-6" />}

      <form onSubmit={onFormSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Photo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {preview ? (
              <div className="space-y-4">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-8 border-2 border-dashed border-blue-300 rounded-lg text-center hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-600 font-medium">Click to upload image</p>
                    <p className="text-gray-500 text-sm">PNG, JPG, WebP up to 5MB</p>
                  </div>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {getFieldError('image') && (
            <p className="mt-2 text-sm text-red-600">{getFieldError('image')}</p>
          )}
          {image && (
            <p className="mt-2 text-sm text-gray-600">
              File selected: <span className="font-medium">{image.name}</span>
            </p>
          )}
        </div>

        {/* GPS Location Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={fetchLocation}
              disabled={isLoadingLocation || isSubmitting}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoadingLocation ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m6.364.636l-.707-.707M21 12h-1m-.636 6.364l-.707.707M12 21v-1m-6.364-.636l.707.707M3 12h1m.636-6.364l.707-.707"
                    />
                  </svg>
                  <span>{isLoadingLocation ? 'Detecting location...' : 'Detect Location'}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Detect Location</span>
                </>
              )}
            </button>

            {/* Location Display */}
            {latitude !== null && longitude !== null && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Location detected:</span> {latitude.toFixed(4)},
                  {longitude.toFixed(4)}
                </p>
              </div>
            )}

            {getFieldError('location') && (
              <p className="text-sm text-red-600">{getFieldError('location')}</p>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
            Description <span className="text-gray-500 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Provide additional details about the issue..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {description.length}/{1000} characters
            </p>
            {getFieldError('description') && (
              <p className="text-sm text-red-600">{getFieldError('description')}</p>
            )}
          </div>
        </div>

        {/* Form Validation Errors */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoadingLocation}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m6.364.636l-.707-.707M21 12h-1m-.636 6.364l-.707.707M12 21v-1m-6.364-.636l.707.707M3 12h1m.636-6.364l.707-.707"
                />
              </svg>
              <span>{image ? 'Uploading evidence...' : 'Submitting...'}</span>
            </>
          ) : (
            <span>Submit Complaint</span>
          )}
        </button>
      </form>
    </div>
  );
}
