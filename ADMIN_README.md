# Lookbook Admin Interface

Complete admin interface for managing people and projects in the Lookbook application.

## Features

### Dashboard (`/admin`)
- Overview statistics (total people, projects, open to work count)
- Quick action cards for accessing people and projects management
- Visual stats cards with icons

### People Management (`/admin/people`)
- List view of all people with search functionality
- Stats cards showing:
  - Total people
  - People open to work
  - People with projects
- Table view with:
  - Profile photo and name
  - Top skills (with count indicator)
  - Project count
  - Open to work status
  - Action buttons (View, Edit)
- Search by name or title

### Person Edit Form (`/admin/people/:slug/edit`)
Complete form for editing person profiles:
- **Basic Information**: Name, title, bio, photo URL, slug, open to work status
- **Social Links**: LinkedIn, X (Twitter), website
- **Skills**: Add/remove skill tags dynamically
- **Industry Expertise**: Add/remove industry tags
- **Highlights**: Manage highlight bullet points
- **Experience**: Add/edit/remove work experience entries with role, organization, and dates

### Projects Management (`/admin/projects`)
- List view of all projects with search functionality
- Stats cards showing:
  - Total projects
  - Projects with demo videos
  - Projects with team members
- Table view with:
  - Project title and description
  - Technologies (with count indicator)
  - Industries/sectors
  - Team member count
  - Action buttons (View, Edit)
- Search by project title or description

### Project Edit Form (`/admin/projects/:slug/edit`)
Complete form for editing projects:
- **Basic Information**: Title, slug, short description, long description (with paragraph support)
- **Media**: Main image URL(s), demo video URL(s) - supports JSON arrays for multiple
- **Links**: GitHub URL, live site URL
- **Technologies**: Add/remove technology tags
- **Industries**: Add/remove industry/sector tags (with suggested list)

## Routes

```
/admin                           - Dashboard
/admin/people                    - People list
/admin/people/:slug/edit         - Edit person
/admin/people/new/edit           - Add new person
/admin/projects                  - Projects list
/admin/projects/:slug/edit       - Edit project
/admin/projects/new/edit         - Add new project
```

## API Integration

The admin interface uses the existing backend API endpoints:

### Profiles
- `GET /api/profiles` - List all profiles
- `GET /api/profiles/:slug` - Get single profile
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:slug` - Update profile
- `DELETE /api/profiles/:slug` - Delete profile

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:slug` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:slug` - Update project
- `DELETE /api/projects/:slug` - Delete project

## Components

### AdminLayout
Sidebar layout with navigation for admin pages:
- Dashboard link
- People management link
- Projects management link
- "Back to Public Site" link

### UI Components Used
- Card, CardContent, CardHeader, CardTitle
- Button
- Input
- Label
- Textarea
- Checkbox
- Badge

## Usage

1. Navigate to `/admin` to access the admin dashboard
2. Use the sidebar or dashboard cards to navigate to people or projects management
3. Click "Edit" on any item to modify it, or "Add New" to create a new entry
4. Fill out the form fields and click "Save" to persist changes
5. Use "View" buttons to preview items on the public site in a new tab

## Notes

- All admin routes are currently unprotected (authentication TODO)
- The interface uses the same blue (#4242ea) brand color as the public site
- Forms include validation for required fields
- Unsaved changes will be lost if you navigate away
- Complex fields like experience and highlights can be added/removed dynamically

