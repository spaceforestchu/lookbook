# Using Your Existing Database with Lookbook

## Overview

Great news! You can use your existing database. The Lookbook schema is designed to be **additive** - it only creates new tables prefixed with `lookbook_*` and links to your existing `users` table.

## Prerequisites

Your existing database must have a `users` table with at least:
- `id` (integer, primary key)
- `name` (string)
- `email` (string)

Most applications already have this! If your users table has different column names, we'll need to modify the schema slightly.

## Deployment Steps

### 1. Verify Your Users Table

Connect to your existing database and check:

```sql
-- Check if users table exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Should show at least: id, name, email
```

If your table is named differently (like `people`, `accounts`, etc.) or has different column names, let me know and we'll adjust the schema.

### 2. Add Lookbook Schema to Your Database

**Option A: Using psql (command line)**

```bash
# Connect to your database using your existing connection string
psql "your-connection-string"

# Run the Lookbook schema
\i database/schema.sql

# Verify tables were created
\dt lookbook_*

# Should show:
# lookbook_profiles
# lookbook_experience
# lookbook_projects
# lookbook_project_participants
# lookbook_sharepack_events
```

**Option B: Using your database GUI (TablePlus, pgAdmin, etc.)**

1. Open your database management tool
2. Connect to your existing database
3. Open and run `database/schema.sql`
4. Verify the new tables appear

**Option C: Using a database migration tool**

If your app uses migrations (like Prisma, TypeORM, Sequelize):

```bash
# Copy schema.sql to your migrations folder
cp database/schema.sql your-migrations/002_add_lookbook_tables.sql

# Run your migration command
# (depends on your setup)
```

### 3. Optional: Load Sample Data

If you want to test with sample profiles and projects:

```bash
psql "your-connection-string"
\i database/sample-data.sql
```

This will create sample lookbook profiles linked to your existing users (or create test users if they don't exist).

### 4. Update Backend Configuration

**For local development**, update your `backend/.env`:

```bash
# Use your existing database connection string
DATABASE_URL=your-existing-connection-string
```

**For Render deployment**:

1. In Render backend service settings
2. Add environment variable:
   ```
   DATABASE_URL=your-existing-connection-string
   ```
3. **Important**: Make sure your database allows connections from Render's IP addresses
   - Check your database provider's firewall/allowlist settings
   - You may need to allow all IPs (0.0.0.0/0) for Render services

### 5. Deploy Backend

Follow the normal Render deployment process:

1. Create Web Service
2. Set `DATABASE_URL` to your existing connection string
3. Set other environment variables (NODE_ENV, PORT, FRONTEND_URL)
4. Deploy

### 6. Test the Integration

After deploying, test:

```bash
# Check database connection
curl https://your-api.onrender.com/api/health/db

# Should return: {"status":"connected","timestamp":"..."}
```

## Database Connection Security

### If Your Database is on Another Platform:

**Render connecting to external database:**
- **Heroku Postgres**: Add Render IPs to allowlist
- **AWS RDS**: Update security group to allow Render IPs
- **DigitalOcean**: Update firewall rules
- **Supabase**: Add Render to connection pooler allowlist
- **Neon**: Usually allows all connections by default

**Render's IP ranges:**
Check Render docs for current IP ranges: https://render.com/docs/static-outbound-ip-addresses

**Easiest approach**: Allow all IPs (0.0.0.0/0) in your database firewall
- Only do this if your database requires SSL/TLS (most managed databases do)
- This is common practice for managed databases like Heroku Postgres, Supabase, etc.

### Connection String Format

Your connection string should look like:
```
postgresql://username:password@host:5432/database
```

For SSL connections (recommended):
```
postgresql://username:password@host:5432/database?sslmode=require
```

## Backup Your Database First! ⚠️

Before adding the Lookbook schema to production:

```bash
# Create a backup
pg_dump "your-connection-string" > backup-before-lookbook.sql

# Or if you're on a managed platform, use their backup feature
```

This way you can restore if anything goes wrong.

## Potential Issues & Solutions

### Issue: "relation 'users' does not exist"

**Cause**: No users table in your database

**Solution**: Either:
1. Your users table might be named differently (check with `\dt`)
2. Create the users table (see schema.sql comments)
3. Modify the schema to reference your actual table name

### Issue: "column 'name' does not exist"

**Cause**: Your users table has different column names

**Solution**: Update the views in `schema.sql` to match your column names:
```sql
-- Change this:
u.name as user_name
-- To match your column:
u.full_name as user_name
```

### Issue: "permission denied"

**Cause**: Database user doesn't have CREATE TABLE permissions

**Solution**: 
- Use a database admin user to run the schema
- Or grant permissions: `GRANT CREATE ON DATABASE yourdb TO youruser;`

## Advantages of Using Your Existing Database

✅ **Single database** - Easier to manage
✅ **Shared users table** - Lookbook profiles link to your existing users
✅ **No additional database cost**
✅ **Easier backups** - One database to backup
✅ **Potential for integration** - Can join Lookbook data with your app's data

## Migration Path

If you want to separate the databases later:

```bash
# Dump only lookbook tables
pg_dump "your-connection-string" \
  --table='lookbook_*' \
  --table='users' \
  > lookbook-only.sql

# Import to new database
psql "new-database-url" < lookbook-only.sql
```

## Testing Locally

Before deploying, test locally with your database:

```bash
cd backend

# Update .env with your database connection string
echo "DATABASE_URL=your-connection-string" > .env

# Start the server
npm run dev

# Test in another terminal
curl http://localhost:4002/api/health/db
```

## Summary

1. ✅ Use your existing database connection string
2. ✅ Run `database/schema.sql` to add Lookbook tables
3. ✅ Deploy backend with `DATABASE_URL=your-connection-string`
4. ✅ No need to create a separate Render PostgreSQL database
5. ✅ Update firewall rules to allow Render to connect

**This approach is simpler and cheaper than creating a separate database!**

---

Need help with any of these steps? Let me know your database provider (Heroku, Supabase, RDS, etc.) and I can provide specific instructions.

