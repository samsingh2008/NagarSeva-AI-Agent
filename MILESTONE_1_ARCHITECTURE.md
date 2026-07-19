# Milestone 1 - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │             /complaint Page Route                      │ │
│  │        (client/app/complaint/page.tsx)                │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         ComplaintForm Component                 │ │ │
│  │  │    (client/components/ComplaintForm.tsx)        │ │ │
│  │  │                                                  │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │  Form UI Elements:                         │ │ │ │
│  │  │  │  - Image Upload Section                   │ │ │ │
│  │  │  │  - GPS Location Section                   │ │ │ │
│  │  │  │  - Description Textarea                   │ │ │ │
│  │  │  │  - Submit Button                          │ │ │ │
│  │  │  │  - Error/Success Messages                 │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  │                       ↓                          │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │    useComplaintForm Hook                  │ │ │ │
│  │  │  │  (client/hooks/useComplaintForm.ts)       │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  State Management:                        │ │ │ │
│  │  │  │  ├─ image: File | null                   │ │ │ │
│  │  │  │  ├─ latitude: number | null              │ │ │ │
│  │  │  │  ├─ longitude: number | null             │ │ │ │
│  │  │  │  ├─ description: string                  │ │ │ │
│  │  │  │  ├─ isLoadingLocation: boolean           │ │ │ │
│  │  │  │  ├─ isSubmitting: boolean                │ │ │ │
│  │  │  │  ├─ errors: ValidationError[]            │ │ │ │
│  │  │  │  └─ messages (success/error)             │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  Methods:                                 │ │ │ │
│  │  │  │  ├─ handleImageChange()                  │ │ │ │
│  │  │  │  ├─ handleDescriptionChange()            │ │ │ │
│  │  │  │  ├─ fetchLocation()  ─────┐              │ │ │ │
│  │  │  │  ├─ validateForm()        │              │ │ │ │
│  │  │  │  ├─ handleSubmit()        │              │ │ │ │
│  │  │  │  ├─ resetForm()           │              │ │ │ │
│  │  │  │  └─ clearMessages()       │              │ │ │ │
│  │  │  └────────────────────────────┼──────────────┘ │ │ │
│  │  │                                ↓                 │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │   Validation Utilities                     │ │ │ │
│  │  │  │  (client/utils/validation.ts)             │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  ├─ validateImage()                       │ │ │ │
│  │  │  │  ├─ validateLocation()                    │ │ │ │
│  │  │  │  ├─ validateDescription()                 │ │ │ │
│  │  │  │  └─ validateComplaintForm()               │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  Returns: ValidationError[] or null       │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Browser APIs Used                             │ │
│  │                                                        │ │
│  │  ├─ Geolocation API  (GPS location detection)        │ │
│  │  ├─ FileReader API   (Image preview)                 │ │
│  │  ├─ Fetch API        (HTTP requests)                 │ │
│  │  └─ FormData API     (File upload encoding)          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                    POST /api/complaints
                    (multipart/form-data)
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server                           │
│              (To be implemented)                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  POST /api/complaints                                       │
│  ├─ Accept image file                                      │
│  ├─ Accept latitude/longitude                             │
│  ├─ Accept description (optional)                         │
│  ├─ Validate data                                         │
│  ├─ Store image (cloud storage)                           │
│  ├─ Save complaint to MongoDB                             │
│  └─ Return success/error response                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User Action                    Hook Method              Validation               Backend
─────────────────────────────────────────────────────────────────────────────────────

User selects image
      │
      └──→ fileInputRef.onChange()
            └──→ handleImageChange(file)
                 └─→ setState(image: File)


User clicks "Detect Location"
      │
      └──→ onClick handler
            └──→ fetchLocation()
                 ├─→ setState(isLoadingLocation: true)
                 ├─→ navigator.geolocation.getCurrentPosition()
                 │   ├─ Success: setState(latitude, longitude)
                 │   └─ Error: setState(errorMessage)
                 └─→ setState(isLoadingLocation: false)


User types description
      │
      └──→ onChange handler
            └──→ handleDescriptionChange(text)
                 └─→ setState(description: string)


User clicks "Submit Complaint"
      │
      └──→ onFormSubmit(e)
            ├─→ e.preventDefault()
            ├─→ clearMessages()
            └─→ handleSubmit(async () => {
                  ├─→ validateForm()
                  │   ├─→ validateImage(image)
                  │   ├─→ validateLocation(lat, lon)
                  │   ├─→ validateDescription(description)
                  │   └─→ setState(errors) if any
                  │
                  ├─→ setState(isSubmitting: true)
                  │
                  ├─→ Create FormData
                  │   ├─→ append('image', image)
                  │   ├─→ append('latitude', latitude)
                  │   ├─→ append('longitude', longitude)
                  │   └─→ append('description', description)
                  │
                  ├─→ fetch('/api/complaints', {
                  │     method: 'POST',
                  │     body: formData
                  │   })
                  │       │
                  │       └──────────────────────→ [Backend Processing]
                  │                                     │
                  │                                     ├─ Validate data
                  │                                     ├─ Save image
                  │                                     ├─ Save to DB
                  │                                     └─ Return response
                  │                                     │
                  ├─ Response received ←──────────────┘
                  │
                  ├─→ Check response.ok
                  │
                  ├─ If success:
                  │   ├─→ resetForm()
                  │   ├─→ setPreview(null)
                  │   ├─→ Clear file input
                  │   ├─→ setState(successMessage)
                  │   └─→ setState(isSubmitting: false)
                  │
                  └─ If error:
                      ├─→ Parse error message
                      ├─→ setState(errorMessage)
                      └─→ setState(isSubmitting: false)
```

---

## Component Hierarchy

```
ComplaintForm.tsx
├── File Input (hidden)
│   └── handles: handleFileChange()
│
├── Image Preview Section
│   ├── Preview Image (conditional)
│   └── Remove Button (conditional)
│
├── GPS Location Section
│   ├── Detect Location Button
│   │   └── onClick: fetchLocation()
│   │       └── uses: navigator.geolocation
│   │
│   └── Location Display (conditional)
│       └── Shows: latitude, longitude
│
├── Description Section
│   ├── Textarea Input
│   │   └── onChange: handleDescriptionChange()
│   │
│   └── Character Counter
│       └── Shows: current/max chars
│
├── Error Messages Section
│   ├── Success Banner (conditional)
│   ├── Error Banner (conditional)
│   └── Field-level Errors (conditional)
│
└── Submit Button
    └── onClick: onFormSubmit()
```

---

## State Machine Diagram

```
Initial State
      │
      ├─→ [User Selects Image]
      │        ↓
      │   Image State Updated
      │
      ├─→ [User Clicks Detect Location]
      │        ↓
      │   isLoadingLocation = true
      │        ↓
      │   [Geolocation API Call]
      │        ├─ Success → latitude/longitude set, isLoadingLocation = false
      │        └─ Error → errorMessage set, isLoadingLocation = false
      │
      ├─→ [User Enters Description]
      │        ↓
      │   Description State Updated
      │
      └─→ [User Clicks Submit]
               ↓
          [Validate All Fields]
               ├─ Invalid → errors displayed, form stays open
               └─ Valid → proceed
               ↓
          isSubmitting = true
               ↓
          [POST to /api/complaints]
               ├─ Success → resetForm(), successMessage = "Submitted!"
               └─ Error → errorMessage = "Failed to submit"
               ↓
          isSubmitting = false
```

---

## Validation Flow

```
Form Submission
      │
      └─→ validateComplaintForm()
           │
           ├─→ validateImage(image)
           │    ├─ Check: image exists
           │    ├─ Check: MIME type (JPEG/PNG/WebP)
           │    └─ Check: size ≤ 5MB
           │         └─ Return: ValidationError | null
           │
           ├─→ validateLocation(latitude, longitude)
           │    ├─ Check: both values exist
           │    ├─ Check: latitude in [-90, 90]
           │    └─ Check: longitude in [-180, 180]
           │         └─ Return: ValidationError | null
           │
           ├─→ validateDescription(description)
           │    └─ Check: length ≤ 1000
           │         └─ Return: ValidationError | null
           │
           └─ Return: ValidationError[] array
                └─ Empty = valid, Non-empty = show errors
```

---

## File Dependencies

```
complaint/page.tsx
    └─ depends on → ComplaintForm.tsx
                        └─ depends on → useComplaintForm.ts
                                            └─ depends on → validation.ts
                                                                └─ exports: ValidationError interface
                                                                            + validation functions
```

---

## TypeScript Type Definitions

```typescript
// From validation.ts
interface ValidationError {
  field: 'image' | 'location' | 'description';
  message: string;
}

// From useComplaintForm.ts
interface ComplaintFormState {
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

// Form submission data
interface ComplaintFormData {
  image: File;
  latitude: number;
  longitude: number;
  description: string;
}
```

---

## Error Handling Paths

```
Image Upload
├─ No file selected → "Please select an image file"
├─ Invalid type → "Only JPEG, PNG, and WebP images are allowed"
└─ Size too large → "Image size must be less than 5MB"

GPS Location
├─ Permission denied → "Location permission denied. Please enable..."
├─ Position unavailable → "Location information is unavailable"
├─ Timeout → "Location request timed out"
├─ Not supported → "Geolocation is not supported by your browser"
└─ Invalid coords → "Invalid GPS coordinates received"

Description
└─ Too long → "Description must be less than 1000 characters"

Form Submission
├─ Network error → "Failed to submit complaint"
├─ Server error (4xx/5xx) → Backend error message
└─ Success → "Complaint submitted successfully!"
```

---

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Reusable validation logic
- ✅ Centralized state management
- ✅ Proper error handling
- ✅ TypeScript type safety
- ✅ Modern React patterns (hooks)
- ✅ Browser API integration
- ✅ RESTful backend integration
