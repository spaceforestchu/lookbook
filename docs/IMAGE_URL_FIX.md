# Image URL Fix

## Problem
After migrating base64 images to files, images stopped loading because:
- Database stored relative URLs: `/uploads/profiles/image.jpg`
- Frontend didn't know to prepend backend URL: `http://localhost:4002`
- Result: Browser tried to load from `http://localhost:5175/uploads/...` (wrong server!)

## Solution
Created `getImageUrl()` helper function in `/frontend/src/utils/api.js`:

```javascript
export const getImageUrl = (url) => {
  if (!url) return url;
  
  // Already absolute? Return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Base64? Return as-is
  if (url.startsWith('data:image')) {
    return url;
  }
  
  // Relative /uploads path? Prepend backend URL
  if (url.startsWith('/uploads')) {
    return `${BACKEND_BASE_URL}${url}`;
  }
  
  return url;
};
```

## Implementation
Updated all image `src` attributes in `PersonDetailPage.jsx`:
- Profile photos (5 instances)
- Project main images
- Partner logos  
- Project screenshots in "Select Projects" section

**Before:**
```jsx
<img src={prof.photo_url} alt={prof.name} />
```

**After:**
```jsx
<img src={getImageUrl(prof.photo_url)} alt={prof.name} />
```

## Result
✅ All images now load correctly from backend server
✅ Works in both development and production
✅ Backwards compatible with base64 images (if any remain)
✅ Handles absolute URLs (external images)

## Files Modified
- `/frontend/src/utils/api.js` - Added `getImageUrl()` helper
- `/frontend/src/pages/PersonDetailPage.jsx` - Updated all image src attributes (8 locations)

---

**Completed:** December 2024

