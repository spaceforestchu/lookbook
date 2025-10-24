# Project Partner Feature

## Overview
Added the ability to associate a partner organization with a project, including the partner's logo and company name. This feature allows projects to showcase their collaboration with external organizations.

## Database Changes

### New Fields
- `has_partner` (BOOLEAN) - Toggle to enable/disable partner display
- `partner_name` (VARCHAR(255)) - Name of the partner organization
- `partner_logo_url` (TEXT) - URL of the partner organization logo

### Migration
The migration file has been created at: `database/migrations/add_project_partner.sql`

To apply the migration, run:
```bash
psql $DATABASE_URL -f database/migrations/add_project_partner.sql
```

Or manually execute:
```sql
ALTER TABLE lookbook_projects 
ADD COLUMN IF NOT EXISTS has_partner BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS partner_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS partner_logo_url TEXT;

COMMENT ON COLUMN lookbook_projects.has_partner IS 'Whether this project has a partner organization';
COMMENT ON COLUMN lookbook_projects.partner_name IS 'Name of the partner organization';
COMMENT ON COLUMN lookbook_projects.partner_logo_url IS 'URL of the partner organization logo';
```

## Backend Changes

### Updated Files
1. **`backend/queries/projectQueries.js`**
   - Added partner fields to `getAllProjects()` SELECT query
   - Added partner fields to `createProject()` function
   - Added partner fields to `updateProject()` allowed fields list

### API Response Format
Projects now include the following additional fields:
```json
{
  "has_partner": true,
  "partner_name": "Acme Corporation",
  "partner_logo_url": "https://example.com/acme-logo.png"
}
```

## Frontend Changes

### Admin Interface (`frontend/src/pages/AdminProjectEditPage.jsx`)

#### New Features
1. **Partner Toggle**: Checkbox to enable/disable partner display
2. **Partner Name Input**: Text field to enter the partner company name
3. **Partner Logo Upload**: 
   - Toggle between URL input and file upload
   - Support for image upload (PNG, JPG, SVG, max 5MB)
   - Base64 conversion for uploaded images
   - Live preview of uploaded/entered logo

#### Usage in Admin
1. Navigate to a project edit page (`/admin/projects/[slug]`)
2. Scroll to the "Project Partner" section (after Project Links)
3. Check "This project has a partner organization"
4. Enter the partner company name
5. Upload or paste a URL for the partner logo
6. Preview appears automatically
7. Save the project

### Project Detail Page (`frontend/src/pages/ProjectDetailPage.jsx`)

#### Display Logic
- Partner information appears directly under the project title
- Only displays if `has_partner` is true AND either `partner_logo_url` or `partner_name` exists
- Logo displays first (if available), constrained to max height of 64px and max width of 200px
- "Project Partner" label appears below the logo
- Partner name appears next to the label (if provided)

#### Visual Layout
```
[Project Title]

[Partner Logo]
Project Partner: [Partner Name]

[Project Summary]
```

## How It Works

### Data Flow
1. Admin enables partner toggle and enters partner information
2. Logo can be uploaded (converted to base64) or entered as URL
3. Data is saved to database via PUT `/api/projects/:slug`
4. Project detail page fetches project data including partner fields
5. If `has_partner` is true, partner section is displayed

### Logo Handling
- **URL Mode**: Direct URL to image hosted elsewhere
- **Upload Mode**: File upload → Base64 conversion → Stored in database
- **Preview**: Real-time preview of logo in admin interface
- **Fallback**: Graceful error handling if logo fails to load

## Testing

### Manual Testing Steps
1. **Apply Migration**: Run the migration SQL file
2. **Start Servers**: Ensure backend and frontend are running
3. **Create/Edit Project**:
   - Go to admin projects page
   - Edit an existing project or create a new one
   - Toggle on "This project has a partner organization"
   - Enter partner name (e.g., "Microsoft")
   - Upload or paste logo URL
   - Verify preview appears
   - Save project
4. **View Project**:
   - Navigate to the project detail page
   - Verify partner logo appears under title
   - Verify "Project Partner: [Name]" appears
   - Check that logo is properly sized

### Edge Cases to Test
- [ ] Partner enabled with only name (no logo)
- [ ] Partner enabled with only logo (no name)
- [ ] Partner enabled with both name and logo
- [ ] Partner disabled (should not display anything)
- [ ] Invalid image URL (should fail gracefully)
- [ ] Large image file (should reject if > 5MB)
- [ ] Toggle partner off and back on (should preserve data)

## Usage Guidelines

### When to Use
- Projects with external organizational partnerships
- Sponsored projects
- Collaborative projects with companies
- Projects built for specific clients (if appropriate)

### Best Practices
- Use high-resolution logos (will be constrained to max 64px height)
- Prefer transparent background PNGs for logos
- Use official company logos with proper permissions
- Keep partner names concise (company name only)
- Test logo appearance on both light and dark backgrounds

## Future Enhancements
- Multiple partners support
- Partner URL/website link
- Partner description/relationship type
- Partner logo in project cards/grid view
- Partner filtering/search capabilities

## Files Modified
1. `database/migrations/add_project_partner.sql` (new)
2. `backend/queries/projectQueries.js`
3. `frontend/src/pages/AdminProjectEditPage.jsx`
4. `frontend/src/pages/ProjectDetailPage.jsx`

## Rollback
To remove this feature:
```sql
ALTER TABLE lookbook_projects 
DROP COLUMN IF EXISTS has_partner,
DROP COLUMN IF EXISTS partner_name,
DROP COLUMN IF EXISTS partner_logo_url;
```

