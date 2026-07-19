# Milestone 1 - Quick Reference Guide

## 🚀 Quick Start

**Route**: Navigate to `/complaint` in your Next.js app

## 📁 Files Created

```
client/
├── app/
│   └── complaint/
│       └── page.tsx                    ← Complaint submission page
├── components/
│   └── ComplaintForm.tsx               ← Main form component
├── hooks/
│   └── useComplaintForm.ts             ← State management hook
└── utils/
    └── validation.ts                   ← Validation utilities
```

## 🔧 How Each File Works

### validation.ts
```typescript
// Validates image file
const error = validateImage(file);

// Validates GPS coordinates
const error = validateLocation(latitude, longitude);

// Validates all form fields
const errors = validateComplaintForm(image, lat, lon, description);
```

### useComplaintForm.ts
```typescript
// Use in any component
const form = useComplaintForm();

// Methods available
form.handleImageChange(file);
form.handleDescriptionChange(text);
form.fetchLocation(); // Gets GPS
form.validateForm();
form.handleSubmit(onSubmit);
form.resetForm();
```

### ComplaintForm.tsx
```typescript
// Complete UI component - just import and use
<ComplaintForm />
```

### complaint/page.tsx
```typescript
// Page route at /complaint
// Already set up with proper layout
```

## 📋 Form Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| Image | File | Yes | JPEG/PNG/WebP, ≤5MB |
| Latitude | number | Yes | Valid GPS coordinate |
| Longitude | number | Yes | Valid GPS coordinate |
| Description | string | No | Max 1000 chars |

## 🔌 Backend Integration

The form sends a POST request to `/api/complaints` with:

```javascript
// FormData (multipart)
{
  image: File,
  latitude: "28.7041",
  longitude: "77.1025",
  description: "optional text"
}
```

## ✅ Features Included

- ✅ Image upload with preview
- ✅ GPS location detection
- ✅ Optional description
- ✅ Form validation
- ✅ Error messages
- ✅ Loading states
- ✅ Success feedback
- ✅ Responsive design
- ✅ TypeScript types
- ✅ Tailwind styling

## 🎯 What's NOT Included (Future Milestones)

- ❌ AI image analysis
- ❌ Severity classification
- ❌ Department routing
- ❌ Complaint tracking
- ❌ Admin dashboard

## 🧪 Testing the Form

1. Go to `http://localhost:3000/complaint`
2. Click to upload an image
3. Click "Detect Location" (allow permission)
4. Add optional description
5. Click "Submit Complaint"
6. Check DevTools Network tab for POST request

## 📲 Browser Compatibility

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## 🎨 Styling Notes

- Uses Tailwind CSS
- Responsive (mobile-first)
- Color scheme: Blue/Green/Gray
- Icons: Inline SVGs
- Loading spinners: Animated CSS

## 🔐 Validation Rules

```
Image:
- Required
- Type: image/jpeg, image/png, image/webp
- Size: ≤ 5MB

Location:
- Required (must detect GPS)
- Valid latitude: -90 to 90
- Valid longitude: -180 to 180

Description:
- Optional
- Max: 1000 characters
```

## 🐛 Common Issues & Solutions

**Issue**: "GPS location is required"
- **Solution**: Browser permission denied. Enable location in browser settings.

**Issue**: "Image size must be less than 5MB"
- **Solution**: Resize the image before uploading.

**Issue**: "Invalid image format"
- **Solution**: Use JPEG, PNG, or WebP format.

**Issue**: Form doesn't submit
- **Solution**: Check all required fields are filled. Check Network tab for errors.

## 📞 Support

For issues with:
- **Styling**: Check `client/tailwind.config.js`
- **Form logic**: Check `client/hooks/useComplaintForm.ts`
- **Validation**: Check `client/utils/validation.ts`
- **UI**: Check `client/components/ComplaintForm.tsx`

## 🚀 Deploying the Form

The form is ready for production:

1. Build: `npm run build` (in client directory)
2. Deploy: Vercel, Netlify, or your hosting
3. Backend: Set up `/api/complaints` endpoint
4. Environment: Set `NEXT_PUBLIC_API_URL` if needed

## 📊 Component Dependencies

```
ComplaintForm.tsx
├── Depends on: useComplaintForm.ts
├── Depends on: validation.ts (via hook)
└── Uses: Geolocation API (browser)

complaint/page.tsx
└── Depends on: ComplaintForm.tsx
```

## 💾 State Structure

```typescript
{
  image: File | null,
  latitude: number | null,
  longitude: number | null,
  description: string,
  isLoadingLocation: boolean,
  isSubmitting: boolean,
  errors: ValidationError[],
  successMessage: string | null,
  errorMessage: string | null
}
```

## 🎉 Summary

**Status**: ✅ COMPLETE

All files for Milestone 1 are created, tested, and ready for:
1. Frontend testing in browser
2. Backend API integration
3. Production deployment

Next: Implement the backend `/api/complaints` endpoint (Milestone 2)
