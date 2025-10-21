# Bulk Upload Feature

Complete CSV-based bulk upload functionality for adding multiple people or projects at once.

## Features

### Two Upload Types
- **People Upload**: Bulk add team members with all their profile information
- **Projects Upload**: Bulk add projects with all their details

### CSV Templates
- Downloadable CSV templates with example data
- Clear format guidelines and instructions
- Column headers match database fields

### Upload Process
1. Select upload type (People or Projects)
2. Download the CSV template
3. Fill in your data following the format guide
4. Upload the completed CSV file
5. View results with success/error breakdown

### Data Format

#### People CSV Columns:
- `name` - Full name (required)
- `title` - Job title/role (required)
- `slug` - URL slug (required, unique)
- `bio` - Biography text
- `photo_url` - Profile photo URL
- `linkedin_url` - LinkedIn profile URL
- `x_url` - X/Twitter profile URL
- `website_url` - Personal website URL
- `skills` - Comma-separated list (e.g., "JavaScript,React,Node.js")
- `industry_expertise` - Comma-separated list (e.g., "Technology,Finance")
- `highlights` - Pipe-separated list (e.g., "Achievement 1|Achievement 2")
- `open_to_work` - true/false

#### Projects CSV Columns:
- `title` - Project name (required)
- `slug` - URL slug (required, unique)
- `summary` - Long description
- `short_description` - Brief 1-2 sentence description
- `main_image_url` - Screenshot/image URL
- `demo_video_url` - Vimeo/YouTube embed URL
- `github_url` - GitHub repository URL
- `live_url` - Live site URL
- `skills` - Comma-separated technologies (e.g., "React,Node.js,PostgreSQL")
- `sectors` - Comma-separated industries (e.g., "B2B,Technology")

### Special Formatting Rules

**People:**
- Multiple skills: Use commas (e.g., "JavaScript,React,Node.js")
- Multiple industries: Use commas (e.g., "Finance,Healthcare")
- Multiple highlights: Use pipe | character (e.g., "Achievement 1|Achievement 2")
- Open to work: Use "true" or "false" (case-sensitive)
- Slug: Must be unique and URL-friendly (lowercase, hyphens, no spaces)

**Projects:**
- Multiple technologies: Use commas (e.g., "React,Node.js,PostgreSQL")
- Multiple sectors: Use commas (e.g., "B2B,Fintech,Consumer")
- Suggested sectors: B2B, Fintech, Consumer, Education, Healthcare, Real Estate and Construction, Industrials, Government
- Slug: Must be unique and URL-friendly (lowercase, hyphens, no spaces)
- URLs: Include full URL with https://

### Results Display

After upload, you'll see:
- **Total Rows**: Number of rows processed from CSV
- **Successful**: Number of successfully created records (green)
- **Failed**: Number of failed records (red)

Failed records show:
- Row number
- Name/title from that row
- Specific error message (e.g., "duplicate slug", "missing required field")

### Error Handling

The system will:
- Continue processing even if some rows fail
- Show detailed error messages for failed rows
- Successfully create records that pass validation
- Handle duplicate slugs gracefully

Common errors:
- Duplicate slug (already exists in database)
- Missing required fields (name, title, slug)
- Invalid data format
- Malformed CSV structure

### Navigation

Access bulk upload from:
- Admin sidebar: "Bulk Upload" link
- Located at `/admin/bulk-upload`

After successful upload:
- "View People/Projects" button - Navigate to list page
- "Upload More" button - Reset form for another upload

## Technical Details

### Frontend
- Uses `papaparse` library for CSV parsing
- Client-side parsing and validation
- Sequential API calls for each row
- Real-time progress and error tracking

### Backend
- Uses existing POST `/api/profiles` and `/api/projects` endpoints
- No special bulk endpoint needed
- Standard validation rules apply
- Each record created independently

### File Requirements
- File type: CSV (.csv)
- Encoding: UTF-8
- Format: Standard CSV with header row
- Size: No strict limit (but large files may take longer)

## Usage Tips

1. **Start with Template**: Always download and use the provided template
2. **Test with Small Batches**: Upload 2-3 records first to verify format
3. **Unique Slugs**: Ensure all slugs are unique across your entire dataset
4. **URL Format**: Always include `https://` in URLs
5. **Special Characters**: Avoid special characters in slugs
6. **Backup Data**: Keep a copy of your CSV file before uploading

## Examples

### People CSV Example:
```csv
name,title,slug,bio,skills,industry_expertise,open_to_work
John Doe,Software Engineer,john-doe,Experienced developer,"JavaScript,React,Node.js","Technology,Finance",true
Jane Smith,Product Manager,jane-smith,10 years experience,"Product Management,Agile","Healthcare,Education",false
```

### Projects CSV Example:
```csv
title,slug,summary,short_description,skills,sectors
My Web App,my-web-app,A comprehensive platform for managing tasks,A task management platform,"React,Node.js,PostgreSQL","B2B,Productivity"
Mobile App,mobile-app,Cross-platform mobile application,Native mobile app,"React Native,Firebase","Consumer,Technology"
```

## Access
- Route: `/admin/bulk-upload`
- Navigation: Admin sidebar → "Bulk Upload"
- Permissions: None (same as other admin pages)

