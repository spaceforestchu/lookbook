# Deploy Taxonomy System to Production

## Problem
The taxonomy system works locally but not in production because the database tables haven't been created yet.

## Solution
Run the taxonomy migration on your production database (segundo-db).

## Step 1: Verify Backend is Deployed
Check that your backend is running on Render with the latest code:
- Go to your Render dashboard
- Find your `lookbook-api` service
- Check that the latest commit is deployed
- Verify the service is "Live"

## Step 2: Run the Database Migration

### Option A: Using psql (Recommended)
```bash
# From your local machine, run the migration on production database
PGPASSWORD='Lookbook123!' psql -h 34.57.101.141 -U lookbook_user -d segundo-db \
  -f database/add-taxonomy-tables.sql
```

This will:
- Create `lookbook_skills` and `lookbook_industries` tables
- Insert 42 pre-defined skills
- Insert 20 pre-defined industries
- Grant permissions to `lookbook_user`

### Option B: Copy/Paste SQL (Alternative)
If psql doesn't work, you can:

1. Connect to database directly:
```bash
PGPASSWORD='Lookbook123!' psql -h 34.57.101.141 -U lookbook_user -d segundo-db
```

2. Copy and paste the contents of `database/add-taxonomy-tables.sql`

## Step 3: Verify the Migration

### Check Tables Were Created
```sql
-- List taxonomy tables
\dt lookbook_skills
\dt lookbook_industries

-- Check record counts
SELECT COUNT(*) FROM lookbook_skills;    -- Should be 42
SELECT COUNT(*) FROM lookbook_industries; -- Should be 20
```

### Test from Production API
After the migration, test your production API:
```bash
# Replace with your actual backend URL
curl https://your-backend-url.onrender.com/api/taxonomy/skills
curl https://your-backend-url.onrender.com/api/taxonomy/industries
```

## Step 4: Test Production Frontend
Once the backend is working:
1. Go to your production frontend URL
2. Login to admin: `/admin`
3. Navigate to "Skills & Industries"
4. Try adding a new skill or industry

## Troubleshooting

### Error: "relation lookbook_skills does not exist"
- **Cause**: Migration hasn't been run yet
- **Fix**: Run the migration (Step 2)

### Error: "permission denied for table"
- **Cause**: Using wrong database user
- **Fix**: Make sure you're using `lookbook_user`, not `readonly_user`

### Error: "Failed to fetch skills/industries"
- **Cause**: Backend can't connect to database
- **Fix**: 
  1. Check Render environment variables
  2. Ensure `DATABASE_URL` is set correctly
  3. Check backend logs on Render dashboard

### Tables Created But Empty
If tables exist but have no data:
```sql
-- Check if data exists
SELECT COUNT(*) FROM lookbook_skills;
SELECT COUNT(*) FROM lookbook_industries;

-- If empty, re-run just the INSERT statements from add-taxonomy-tables.sql
```

## Environment Variables Checklist

### Backend (Render)
Make sure these are set:
- ✅ `DATABASE_URL=postgresql://lookbook_user:Lookbook123!@34.57.101.141:5432/segundo-db`
- ✅ `NODE_ENV=production`
- ✅ `PORT=4002` (or whatever Render assigns)
- ✅ `FRONTEND_URL=https://your-frontend-url.onrender.com`
- ✅ `ADMIN_USERNAME=admin`
- ✅ `ADMIN_PASSWORD_HASH=your-hash`

### Frontend (Render)
- ✅ `VITE_API_URL=https://your-backend-url.onrender.com/api`

## Quick Verification Script

Run this locally to verify production database has taxonomy:
```bash
PGPASSWORD='Lookbook123!' psql -h 34.57.101.141 -U lookbook_user -d segundo-db -c "
SELECT 
  (SELECT COUNT(*) FROM lookbook_skills) as skills_count,
  (SELECT COUNT(*) FROM lookbook_industries) as industries_count;
"
```

Expected output:
```
 skills_count | industries_count 
--------------+------------------
           42 |               20
```

## After Migration is Complete

Your production site should now have:
- ✅ Admin taxonomy management at `/admin/taxonomy`
- ✅ Person edit forms use standardized skills/industries
- ✅ Public people page filters use taxonomy skills
- ✅ 42 skills available
- ✅ 20 industries available

## Need Help?

If you get stuck:
1. Check backend logs on Render dashboard
2. Verify database connection with the verification script above
3. Ensure `DATABASE_URL` environment variable is correct
4. Check that migration ran successfully (tables should have 42 and 20 records)

