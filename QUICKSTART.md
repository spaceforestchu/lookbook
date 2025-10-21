# Lookbook Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js installed
- PostgreSQL installed and running
- Terminal/command line access

## 1. Database Setup (2 minutes)

```bash
# Create database
createdb lookbook

# Run schema
psql lookbook < database/schema.sql
```

**Note:** If testing standalone without existing users table, uncomment the sample users section in `schema.sql`.

## 2. Backend Setup (1 minute)

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp env.example .env

# Edit .env with your database info
# (Use your favorite editor)

# Start backend
npm run dev
```

Backend runs on **http://localhost:4002**

## 3. Frontend Setup (1 minute)

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend runs on **http://localhost:5173**

## 4. Open Your Browser

Go to **http://localhost:5173**

You should see the Lookbook homepage!

## Add Sample Data (Optional)

To test with sample data:

```bash
psql lookbook
```

Then paste:

```sql
-- Sample users
INSERT INTO users (name, email) VALUES 
  ('Jane Doe', 'jane@test.com'),
  ('John Smith', 'john@test.com');

-- Sample profiles
INSERT INTO lookbook_profiles (user_id, slug, title, bio, skills, open_to_work)
VALUES 
  (1, 'jane-doe', 'Full Stack Developer', 'Passionate about building great products', 
   ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL'], true),
  (2, 'john-smith', 'UX Designer', 'Creating beautiful and intuitive experiences',
   ARRAY['Figma', 'UI/UX', 'Design Systems'], false);

-- Sample project
INSERT INTO lookbook_projects (slug, title, summary, skills, sectors, cohort)
VALUES 
  ('fintech-app', 'FinTech App', 'Revolutionary financial technology platform',
   ARRAY['React', 'Node.js', 'PostgreSQL'], 
   ARRAY['Finance', 'Technology'], '2024');

-- Link participants
INSERT INTO lookbook_project_participants (project_id, profile_id, role)
VALUES (1, 1, 'Lead Developer'), (1, 2, 'UX Designer');
```

Press `\q` to exit psql.

Refresh your browser and browse People and Projects!

## Troubleshooting

**Database connection error?**
- Check your `.env` file has correct credentials
- Ensure PostgreSQL is running: `pg_isready`

**Port already in use?**
- Backend: Change `PORT` in `.env`
- Frontend: Vite will auto-select another port

**"Profile not found" errors?**
- Make sure you added sample data (see above)
- Check that foreign keys are valid

## Next Steps

- Read `README.md` for full documentation
- Check `INTEGRATION_PLAN.md` for merging with existing app
- Customize the schema and add your own data
- Add authentication to protect admin routes

## Quick Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend  
cd frontend && npm run dev

# View backend health
curl http://localhost:4002/api/health

# View database
psql lookbook
\dt                    # list tables
SELECT * FROM lookbook_profiles;
```

That's it! 🎉

You now have a fully functional lookbook application running locally.


