# Project Icon/Logo Feature

## Overview
Added the ability to set a custom icon/logo for each project, separate from the main project screenshots.

## Database Changes

### New Field
- `icon_url` (TEXT) - Stores the URL of the project icon/logo

### Migration
Run this SQL command on your database:
```sql
ALTER TABLE lookbook_projects 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

COMMENT ON COLUMN lookbook_projects.icon_url IS 'Project icon/logo URL (alternative to using main_image_url for icons)';
```

Or use the migration file: `database/migrations/add_project_icon.sql`

## Frontend Changes

The following components now support the `icon_url` field:

1. **Project List View** (`PersonDetailPage.jsx` - lines ~927-949)
   - Shows circular project icons in the list view
   - Uses `icon_url` if available, falls back to `main_image_url`

2. **Featured Projects Carousel** (`PersonDetailPage.jsx` - lines ~1277-1300)
   - Shows project icons in person detail pages
   - Uses `icon_url` if available, falls back to `main_image_url`, then to lucide icons

## How It Works

- If a project has an `icon_url` set, it will be used for the circular icon displays
- If no `icon_url` exists, it falls back to using `main_image_url`
- If neither exists, it shows a fallback (either a generated icon or first letter)

## Admin Interface

To fully implement this feature, you'll need to add an icon upload field in the Admin Project Edit page:

### File to Update: 
`frontend/src/pages/AdminProjectEditPage.jsx`

### Add:
1. A file upload input for `icon_url`
2. Handle the upload similar to how `main_image_url` is handled
3. Display a preview of the current icon
4. Allow clearing/replacing the icon

Example code structure:
```jsx
<div>
  <label>Project Icon/Logo (optional)</label>
  <input 
    type="file" 
    accept="image/*"
    onChange={handleIconUpload}
  />
  {formData.icon_url && (
    <img src={formData.icon_url} alt="Icon preview" className="w-20 h-20" />
  )}
</div>
```

## Usage Guidelines

- **Icon URL**: Use for logos or simplified project representations (ideal for circular displays)
- **Main Image URL**: Continue using for full-size screenshots and hero images

## Notes

- The icon is displayed in a circular container (20x20 in list view, 12x12 in featured projects)
- Images are automatically cropped to fill the circle using `object-cover`
- The feature is backward compatible - projects without icons will continue to work as before

