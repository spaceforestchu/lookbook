# Render Deployment Checklist

Quick checklist for deploying Lookbook to Render. See `RENDER_DEPLOYMENT.md` for detailed instructions.

## Prerequisites
- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] Local development tested and working

## Deployment Steps

### 1. Database Setup (FIRST!)

#### Option A: Using Existing Database (Simpler!)
- [ ] Have your existing database connection string ready
- [ ] Connect to your database: `psql "your-connection-string"`
- [ ] Run `\i database/schema.sql` to add Lookbook tables
- [ ] Verify tables: `\dt lookbook_*`
- [ ] Optionally load sample data: `\i database/sample-data.sql`
- [ ] Update database firewall to allow Render connections (if needed)
- [ ] See `EXISTING_DATABASE_SETUP.md` for detailed instructions

#### Option B: Create New Render PostgreSQL Database
- [ ] Create PostgreSQL database on Render
- [ ] Save the Internal Database URL
- [ ] Save the External Database URL
- [ ] Connect via psql using the PSQL Command
- [ ] Run `\i database/schema.sql` to create tables
- [ ] Verify tables: `\dt` and check count: `SELECT COUNT(*) FROM lookbook_profiles;`
- [ ] Optionally load sample data: `\i database/sample-data.sql`

### 2. Backend Deployment
- [ ] Create Web Service on Render
- [ ] Configure:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `node server.js`
- [ ] Add environment variables:
  - `NODE_ENV=production`
  - `PORT=4002`
  - `DATABASE_URL=[Your existing connection string OR Internal Database URL from step 1]`
  - `FRONTEND_URL=[Will update after frontend deployment]`
- [ ] Deploy and wait for completion
- [ ] Test health check: `https://your-api.onrender.com/api/health`
- [ ] Save backend URL

### 3. Frontend Deployment

#### Option A: Render Static Site
- [ ] Create Static Site on Render
- [ ] Configure:
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `frontend/dist`
- [ ] Add environment variable:
  - `VITE_API_URL=https://your-api.onrender.com/api`
- [ ] Deploy and wait for completion
- [ ] Save frontend URL

#### Option B: Vercel (Recommended for frontend)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Navigate to frontend: `cd frontend`
- [ ] Deploy: `vercel`
- [ ] Add env: `vercel env add VITE_API_URL production`
  - Enter: `https://your-api.onrender.com/api`
- [ ] Deploy to prod: `vercel --prod`
- [ ] Save Vercel URL

### 4. Update Backend CORS
- [ ] Go to backend service in Render
- [ ] Update `FRONTEND_URL` environment variable with actual frontend URL
- [ ] Save (will trigger redeploy)

### 5. Test Deployment
- [ ] Visit frontend URL
- [ ] Check if data loads
- [ ] Test filtering
- [ ] View a profile page
- [ ] View a project page
- [ ] Check browser console for errors
- [ ] Test on mobile device

### 6. Custom Domain (Optional)
- [ ] Add custom domain in Render/Vercel settings
- [ ] Update DNS records
- [ ] Wait for SSL certificate
- [ ] Update FRONTEND_URL if using custom domain

### 7. Post-Deployment
- [ ] Set up monitoring (UptimeRobot)
- [ ] Enable database backups (Starter plan)
- [ ] Add error tracking (Sentry - optional)
- [ ] Document production URLs in team docs
- [ ] Update README with production URL

## Environment Variables Quick Reference

### Backend (Render Web Service)
```
NODE_ENV=production
PORT=4002
DATABASE_URL=[from database]
FRONTEND_URL=[your frontend URL]
```

### Frontend (Render Static Site or Vercel)
```
VITE_API_URL=https://your-api.onrender.com/api
```

## Troubleshooting Quick Fixes

**Cannot connect to database:**
- Use Internal Database URL, not External

**CORS error:**
- Set FRONTEND_URL in backend to match actual frontend

**502 Bad Gateway:**
- Check backend logs in Render dashboard

**Slow first load (30-60 seconds):**
- Normal on Free tier (cold start)
- Upgrade to Starter plan for always-on

## Cost Summary

### Free Tier (Testing)
- Backend: Free (with cold starts)
- Frontend: Free
- Database: Free (90 days)
- **Total: $0/month**

### Production (Recommended)
- Backend: $7/month
- Frontend: $0/month (Vercel)
- Database: $7/month
- **Total: $14/month**

## Support Resources
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check service logs in Render dashboard

---

**Start with the database, then backend, then frontend!**

