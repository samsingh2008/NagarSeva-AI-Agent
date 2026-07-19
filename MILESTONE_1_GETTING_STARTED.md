# Milestone 1 - Getting Started Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: `http://localhost:3000/complaint`

### 4. Test the Form
- ✅ Click to select an image
- ✅ Click "Detect Location" (allow permission)
- ✅ Add optional description
- ✅ Click "Submit Complaint"

---

## 📁 What Was Created

### Core Implementation Files

#### 1. `client/utils/validation.ts`
**What it does**: Validates form data
```typescript
// Validates image file
validateImage(file)

// Validates GPS coordinates
validateLocation(latitude, longitude)

// Validates description
validateDescription(description)

// Validates everything together
validateComplaintForm(image, lat, lon, description)
```

#### 2. `client/hooks/useComplaintForm.ts`
**What it does**: Manages form state and logic
```typescript
const form = useComplaintForm();

// Form state
form.image              // File | null
form.latitude           // number | null
form.longitude          // number | null
form.description        // string
form.isLoadingLocation  // boolean
form.isSubmitting       // boolean
form.errors             // ValidationError[]

// Methods
form.handleImageChange(file)           // Update image
form.handleDescriptionChange(text)     // Update description
form.fetchLocation()                   // Get GPS
form.validateForm()                    // Validate all
form.handleSubmit(callback)            // Submit form
form.resetForm()                       // Clear form
```

#### 3. `client/components/ComplaintForm.tsx`
**What it does**: Renders the complete form UI
```typescript
<ComplaintForm />
```

Just include this component and it handles:
- Image upload and preview
- GPS location detection
- Description input
- Form validation
- Error messages
- Success messages
- Submit button

#### 4. `client/app/complaint/page.tsx`
**What it does**: Creates the `/complaint` route
- Auto-generated via Next.js file-based routing
- No additional setup needed
- Already includes proper metadata

---

## 🎯 Form Fields Explained

### Image Upload
- **Required**: Yes
- **Allowed types**: JPEG, PNG, WebP
- **Max size**: 5MB
- **Behavior**:
  - Click to browse or upload
  - Shows preview after selection
  - Can clear/remove before submit
  - Shows validation errors

### GPS Location
- **Required**: Yes
- **Source**: Browser's Geolocation API
- **Behavior**:
  - Click "Detect Location" button
  - Shows loading spinner
  - Displays coordinates when detected
  - Shows error if permission denied
  - Auto-validates on successful detection

### Description
- **Required**: No
- **Max length**: 1000 characters
- **Behavior**:
  - Optional field
  - Shows character counter
  - Validates on input
  - Can submit without it

---

## 🧪 Testing Guide

### Test 1: Successful Submission
```
1. Go to /complaint
2. Select a JPEG/PNG image (< 5MB)
3. Click "Detect Location"
4. Allow browser permission
5. Add a description (optional)
6. Click "Submit Complaint"
✓ Form should clear
✓ Success message should appear
✓ Check DevTools Network tab for POST request
```

### Test 2: Image Validation
```
1. Try to submit without selecting image
✓ Error: "Please select an image file"

2. Try to select a non-image file
✓ Error: "Only JPEG, PNG, and WebP images are allowed"

3. Try to select a file > 5MB
✓ Error: "Image size must be less than 5MB"
```

### Test 3: Location Validation
```
1. Skip location detection and try to submit
✓ Error: "GPS location is required"

2. Deny location permission
✓ Error: "Location permission denied. Please enable..."

3. Allow location permission
✓ Coordinates should display
✓ Submit should work
```

### Test 4: Description Validation
```
1. Type > 1000 characters
✓ Error: "Description must be less than 1000 characters"

2. Clear description and submit
✓ Should work (description is optional)
```

### Test 5: Network Request
```
1. Open DevTools (F12)
2. Go to Network tab
3. Fill form and submit
4. Look for POST request to /api/complaints
5. Check request body (should have FormData with image + metadata)
```

---

## 🔧 Backend Integration

The form is ready to send data to your backend. You need to create:

### Endpoint: `POST /api/complaints`

**Request format**: `multipart/form-data`
```
- image: File (the image file)
- latitude: string (e.g., "28.7041")
- longitude: string (e.g., "77.1025")  
- description: string (e.g., "Pothole near main gate")
```

**Expected response (success)**:
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "complaintId": "507f1f77bcf86cd799439011"
}
```

**Expected response (error)**:
```json
{
  "message": "Error description"
}
```

The frontend will:
- ✅ Validate data before sending
- ✅ Show success message
- ✅ Show error message
- ✅ Reset form on success
- ✅ Keep form on error

---

## 🎨 Customization

### Change Colors
Edit `client/tailwind.config.js`:
```javascript
extend: {
  colors: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    accent: '#YOUR_COLOR',
  },
}
```

### Change Validation Rules
Edit `client/utils/validation.ts`:
```typescript
// Change max file size
const maxSize = 10 * 1024 * 1024; // 10MB instead of 5MB

// Change max description length
const maxLength = 2000; // 2000 instead of 1000

// Change allowed file types
const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
```

### Change Form Labels
Edit `client/components/ComplaintForm.tsx`:
```typescript
// Change button text
<button>Your Text Here</button>

// Change placeholder text
<textarea placeholder="Your text..."></textarea>

// Change error messages
// Messages come from validation.ts
```

---

## 🐛 Troubleshooting

### Issue: Form not appearing at `/complaint`
- Check: Did you run `npm run dev`?
- Check: Is development server running?
- Try: Clear browser cache and refresh

### Issue: Image upload button doesn't work
- Check: Browser console for errors (F12)
- Check: File input element is properly focused
- Try: Different browser (Chrome, Firefox)

### Issue: "Location is disabled" error
- Solution: Allow location in browser settings
- Chrome: Click lock icon in address bar → Site settings → Location
- Firefox: Click lock icon → Permissions → Location
- Safari: Safari menu → Settings → Privacy → Location

### Issue: Form submits but no response
- Check: Backend `/api/complaints` endpoint exists
- Check: Backend is running
- Check: CORS is properly configured
- Check: DevTools Network tab for request status

### Issue: Image preview not showing
- Check: Image is valid JPEG/PNG/WebP
- Check: Browser supports FileReader API
- Try: Refresh page

### Issue: Character counter not updating
- Check: Browser console for JavaScript errors
- Try: Different browser

---

## 📊 Files Overview

```
client/
├── app/
│   └── complaint/
│       └── page.tsx              (21 lines) - Page route
│
├── components/
│   └── ComplaintForm.tsx         (350 lines) - Main component
│
├── hooks/
│   └── useComplaintForm.ts       (170 lines) - Form hook
│
├── utils/
│   └── validation.ts             (85 lines) - Validation functions
│
└── tailwind.config.js            (config) - Already configured
```

**Total new code**: ~625 lines

---

## ✅ Verification Checklist

After creating the files, verify:

- [ ] Page loads at `/complaint`
- [ ] Image upload button works
- [ ] Can select and preview image
- [ ] GPS button shows loading spinner
- [ ] Can detect location successfully
- [ ] Description textarea works
- [ ] Form validation shows errors
- [ ] Submit button works
- [ ] Network request sent to backend
- [ ] Success/error messages display

---

## 🚀 Next Steps

### For Frontend
1. Test all form functionality
2. Adjust styling if needed
3. Add more validation if needed

### For Backend
1. Create `/api/complaints` endpoint
2. Set up image storage
3. Connect to MongoDB
4. Add server-side validation

### For Testing
1. Test form with real images
2. Test on different devices
3. Test on different browsers
4. Test with backend integration

---

## 📚 Additional Documentation

- `MILESTONE_1_IMPLEMENTATION.md` - Detailed documentation
- `MILESTONE_1_QUICK_REFERENCE.md` - Quick reference
- `MILESTONE_1_ARCHITECTURE.md` - Architecture diagrams
- `MILESTONE_1_CHECKLIST.md` - Completion checklist

---

## 💡 Key Points

1. **The form validates data before sending** - No invalid requests reach backend
2. **GPS is required** - User must allow location access
3. **Image is required** - File must be JPEG/PNG/WebP under 5MB
4. **Description is optional** - User can skip it
5. **Form resets on success** - File input cleared automatically
6. **Errors stay in form** - User can fix and resubmit

---

## 🎉 You're Ready!

The form is fully functional and ready for:
- ✅ Frontend testing
- ✅ Backend integration
- ✅ Production deployment

Start at `/complaint` and enjoy! 🚀
