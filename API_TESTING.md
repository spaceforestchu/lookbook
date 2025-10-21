# API Testing Guide

Quick reference for testing all Lookbook API endpoints using `curl`.

## Setup

Make sure your backend is running:
```bash
cd backend && npm run dev
```

## Health Checks

```bash
# Basic health check
curl http://localhost:4002/api/health

# Database connection check
curl http://localhost:4002/api/health/db
```

## Profiles (People)

### Get all profiles
```bash
curl http://localhost:4002/api/profiles
```

### Get profiles with filters
```bash
# Search by text
curl "http://localhost:4002/api/profiles?search=developer"

# Filter by skills
curl "http://localhost:4002/api/profiles?skills=React&skills=Node.js"

# Filter open to work
curl "http://localhost:4002/api/profiles?openToWork=true"

# Pagination
curl "http://localhost:4002/api/profiles?page=1&limit=10"

# Combined filters
curl "http://localhost:4002/api/profiles?search=developer&openToWork=true&skills=React"
```

### Get single profile
```bash
curl http://localhost:4002/api/profiles/jane-doe
```

### Get filter options
```bash
curl http://localhost:4002/api/profiles/filters
```

### Create profile
```bash
curl -X POST http://localhost:4002/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "slug": "test-user",
    "title": "Software Engineer",
    "bio": "Test bio",
    "skills": ["JavaScript", "React"],
    "openToWork": true
  }'
```

### Update profile
```bash
curl -X PUT http://localhost:4002/api/profiles/test-user \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "openToWork": false
  }'
```

### Delete profile
```bash
curl -X DELETE http://localhost:4002/api/profiles/test-user
```

### Add experience
```bash
curl -X POST http://localhost:4002/api/profiles/jane-doe/experience \
  -H "Content-Type: application/json" \
  -d '{
    "org": "Tech Company",
    "role": "Developer",
    "dateFrom": "2020",
    "dateTo": "Present",
    "summary": "Building great products"
  }'
```

## Projects

### Get all projects
```bash
curl http://localhost:4002/api/projects
```

### Get projects with filters
```bash
# Search
curl "http://localhost:4002/api/projects?search=platform"

# Filter by skills
curl "http://localhost:4002/api/projects?skills=React&skills=Node.js"

# Filter by sectors
curl "http://localhost:4002/api/projects?sectors=FinTech"

# Filter by cohort
curl "http://localhost:4002/api/projects?cohort=2024"

# Filter by demo video
curl "http://localhost:4002/api/projects?hasDemoVideo=true"

# Combined
curl "http://localhost:4002/api/projects?search=fintech&cohort=2024&skills=React"
```

### Get single project
```bash
curl http://localhost:4002/api/projects/fintech-platform
```

### Get filter options
```bash
curl http://localhost:4002/api/projects/filters
```

### Create project
```bash
curl -X POST http://localhost:4002/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-project",
    "title": "Test Project",
    "summary": "A test project",
    "skills": ["JavaScript", "React"],
    "sectors": ["Technology"],
    "cohort": "2024"
  }'
```

### Update project
```bash
curl -X PUT http://localhost:4002/api/projects/test-project \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Updated summary",
    "skills": ["JavaScript", "React", "TypeScript"]
  }'
```

### Add participant
```bash
curl -X POST http://localhost:4002/api/projects/test-project/participants \
  -H "Content-Type: application/json" \
  -d '{
    "profileSlug": "jane-doe",
    "role": "Lead Developer",
    "displayOrder": 0
  }'
```

### Remove participant
```bash
curl -X DELETE http://localhost:4002/api/projects/test-project/participants/jane-doe
```

### Delete project
```bash
curl -X DELETE http://localhost:4002/api/projects/test-project
```

## Search

### Unified search
```bash
# Search all
curl -X POST http://localhost:4002/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "q": "developer",
    "type": "all",
    "limit": 20
  }'

# Search only people
curl -X POST http://localhost:4002/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "q": "react engineer",
    "type": "people"
  }'

# Search only projects
curl -X POST http://localhost:4002/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "q": "fintech platform",
    "type": "projects"
  }'

# With filters
curl -X POST http://localhost:4002/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "q": "developer",
    "type": "people",
    "skills": ["React", "TypeScript"],
    "openToWork": true
  }'
```

### Search suggestions
```bash
curl "http://localhost:4002/api/search/suggestions?q=react"
```

## Sharepack (PDF)

### Generate PDF
```bash
curl -X POST http://localhost:4002/api/sharepack \
  -H "Content-Type: application/json" \
  -d '{
    "peopleSlugs": ["jane-doe", "john-smith"],
    "projectSlugs": ["fintech-platform"],
    "requesterEmail": "recruiter@company.com"
  }' \
  --output sharepack.pdf

# Check the generated PDF
open sharepack.pdf  # macOS
# or: xdg-open sharepack.pdf  # Linux
# or: start sharepack.pdf     # Windows
```

### Log lead
```bash
curl -X POST http://localhost:4002/api/sharepack/lead \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "note": "Interested in fintech developers",
    "peopleSlugs": ["jane-doe"],
    "projectSlugs": ["fintech-platform"]
  }'
```

### Get insights
```bash
curl http://localhost:4002/api/sharepack/insights
```

## AI Features

### Extract profile from text
```bash
curl -X POST http://localhost:4002/api/ai/extract \
  -H "Content-Type: application/json" \
  -d '{
    "sourceText": "John Doe is a Full Stack Developer with 5 years of experience in React, Node.js, and PostgreSQL. He has worked at TechCorp and StartupXYZ. He is currently seeking new opportunities."
  }'
```

### Sanitize profile data
```bash
curl -X POST http://localhost:4002/api/ai/sanitize \
  -H "Content-Type: application/json" \
  -d '{
    "profileData": {
      "name": "John Doe",
      "title": "Full Stack Developer",
      "skills": ["react", "nodejs", "React", "Node.js", "postgresql", "Extra Skill 1", "Extra Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9"]
    }
  }'
```

## Testing Tips

### Using jq for pretty output
```bash
curl http://localhost:4002/api/profiles | jq .
```

### Save response to file
```bash
curl http://localhost:4002/api/profiles > profiles.json
```

### Check response headers
```bash
curl -I http://localhost:4002/api/health
```

### Test with authentication (when added)
```bash
curl http://localhost:4002/api/profiles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Measure response time
```bash
time curl http://localhost:4002/api/profiles > /dev/null
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* your data */ }
}
```

### Success with Pagination
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "page": 1,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Expected Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error
- `503` - Service Unavailable (feature not configured)

## Postman Collection

For a better testing experience, import these endpoints into Postman:

1. Create new collection "Lookbook API"
2. Set base URL variable: `{{baseUrl}} = http://localhost:4002/api`
3. Add endpoints from this guide
4. Save and share with your team

## Automated Testing

Create a simple test script:

```bash
#!/bin/bash
# test-api.sh

BASE_URL="http://localhost:4002/api"

echo "Testing health endpoint..."
curl -s $BASE_URL/health | jq .

echo "\nTesting profiles endpoint..."
curl -s $BASE_URL/profiles?limit=5 | jq '.data | length'

echo "\nTesting projects endpoint..."
curl -s $BASE_URL/projects?limit=5 | jq '.data | length'

echo "\nAll tests passed! ✓"
```

Run it:
```bash
chmod +x test-api.sh
./test-api.sh
```


