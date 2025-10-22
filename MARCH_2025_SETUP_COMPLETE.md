# March 2025 Cohort Setup - Complete! ✅

## Summary

Successfully set up Lookbook for the March 2025 cohort members from the `segundo-db` database.

## What Was Done

1. **Database Connection**: Connected to existing `segundo-db` PostgreSQL database
2. **Schema Migration**: Added custom Lookbook schema adapted for existing `users` table structure
3. **Data Cleanup**: Removed all dummy/test data
4. **Cohort Setup**: Created profiles for 60 active March 2025 cohort members

## Database Details

### Connection String
```
DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db
```

### Tables Added
- `lookbook_profiles` (60 profiles created)
- `lookbook_experience`
- `lookbook_projects`
- `lookbook_project_participants`
- `lookbook_sharepack_events`

### Cohort Statistics
- **Total Active Users in March 2025**: 60
- **Profiles Created**: 60
- **Profiles with Photos**: 0 (will use GitHub avatars if connected)

### Sample Profiles Created
- Luna Aizarani (luna@pursuit.org)
- Gabo Arora (gabo@lightshed.io)
- Lee Aulder (lee.aulder@pursuit.org)
- Robert Bailey (robert9272@gmail.com)
- Stefano Barros (stefano@pursuit.org)
- ... and 55 more

## Files Created

1. `database/schema-segundo.sql` - Custom schema adapted for segundo-db users table
2. `database/setup-march-2025-cohort.sql` - Migration to populate March 2025 cohort
3. `EXISTING_DATABASE_SETUP.md` - Guide for using existing database
4. `RENDER_DEPLOYMENT.md` - Complete deployment guide for Render
5. `RENDER_CHECKLIST.md` - Quick deployment checklist
6. `render.yaml` - Blueprint for automated Render deployment

## Schema Customizations

The schema was customized to work with your existing `users` table:
- Uses `user_id` instead of `id`
- Combines `first_name` and `last_name` for display names
- References `users(user_id)` in foreign keys

## Next Steps for Deployment

### 1. Backend Deployment to Render

1. Create a Web Service on Render
2. Set environment variables:
   ```
   NODE_ENV=production
   PORT=4002
   DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db
   FRONTEND_URL=[your frontend URL after step 2]
   ```
3. Build command: `npm install`
4. Start command: `node server.js`
5. Root directory: `backend`

### 2. Frontend Deployment (Vercel Recommended)

```bash
cd frontend
vercel
vercel env add VITE_API_URL production
# Enter: https://your-backend.onrender.com/api
vercel --prod
```

### 3. Update Backend CORS

After frontend is deployed, update `FRONTEND_URL` in Render backend environment variables.

### 4. Database Firewall

Ensure your database allows connections from Render's IP addresses (or allow 0.0.0.0/0 with SSL).

## Local Development

To run locally with the March 2025 cohort data:

```bash
# Backend (create backend/.env file first - not tracked in git)
cd backend
echo "DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db" > .env
npm run dev

# Frontend
cd frontend
npm run dev
```

## Migration Scripts

### Re-run March 2025 Setup
```bash
psql "postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db" \\
  -f database/setup-march-2025-cohort.sql
```

### Verify Setup
```sql
SELECT COUNT(*) FROM lookbook_profiles;
-- Should return: 60

SELECT COUNT(*) FROM lookbook_profiles p
JOIN users u ON p.user_id = u.user_id
WHERE u.cohort = 'March 2025';
-- Should return: 60
```

## Notes

- All profiles are set to `open_to_work = true` by default
- Default title: "Software Engineer"
- Default industry: "Technology"
- Skills arrays are empty by default (can be populated via admin interface)
- Slugs are auto-generated from names (e.g., "luna-aizarani")

## Filtering Options

You mentioned wanting 33-34 profiles instead of 60. If you want to filter down:

```sql
-- Example: Keep only first 34 alphabetically
DELETE FROM lookbook_profiles
WHERE profile_id NOT IN (
  SELECT p.profile_id 
  FROM lookbook_profiles p
  JOIN users u ON p.user_id = u.user_id
  WHERE u.cohort = 'March 2025'
  ORDER BY u.last_name, u.first_name
  LIMIT 34
);
```

## Support

- Full deployment guide: `RENDER_DEPLOYMENT.md`
- Quick checklist: `RENDER_CHECKLIST.md`
- Existing database guide: `EXISTING_DATABASE_SETUP.md`

---

**Setup Date**: October 22, 2025  
**Database**: segundo-db  
**Cohort**: March 2025 (60 active members)

