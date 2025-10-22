# Render Deployment Guide

Complete guide to deploying Lookbook to Render.

## Overview

- **Database**: Render PostgreSQL (managed)
- **Backend**: Render Web Service (Node.js)
- **Frontend**: Render Static Site or Vercel

## Step-by-Step Deployment

### 1. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy deployments)
3. Connect your GitHub repository

### 2. Deploy Database FIRST

**This is the most important step - do this before anything else.**

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `lookbook-db`
   - **Database**: `lookbook`
   - **User**: `lookbook_user` (auto-generated)
   - **Region**: Choose closest to your users
   - **Plan**: 
     - **Free** for testing (expires after 90 days)
     - **Starter ($7/mo)** for production (recommended)
3. Click **"Create Database"**
4. **IMPORTANT**: Save these credentials (shown once):
   - Internal Database URL
   - External Database URL
   - PSQL Command

### 3. Initialize Database Schema

Once your database is created, you need to load the schema:

**Option A: Using Render Shell** (Recommended)

1. In your database dashboard, click **"Connect"**
2. Copy the **PSQL Command** (looks like: `PGPASSWORD=xxx psql -h xxx -U lookbook_user lookbook`)
3. Run it in your local terminal
4. Once connected, run:
   ```sql
   \i database/schema.sql
   ```
5. Optionally load sample data:
   ```sql
   \i database/sample-data.sql
   ```
6. Verify tables were created:
   ```sql
   \dt
   SELECT COUNT(*) FROM lookbook_profiles;
   ```

**Option B: Using Render Web Interface**

1. Go to your database in Render
2. Click on **"Connect"** tab
3. Use the web-based psql client
4. Copy and paste contents of `database/schema.sql`
5. Execute it

### 4. Deploy Backend

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Select your GitHub repository
3. Configure:
   - **Name**: `lookbook-api`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (NOT `npm start` - nodemon won't work in production)
   - **Plan**: 
     - **Free** for testing
     - **Starter ($7/mo)** for production
4. **Environment Variables** - Click "Advanced" and add:
   ```
   NODE_ENV=production
   PORT=4002
   DATABASE_URL=[Your Internal Database URL from step 2]
   FRONTEND_URL=[Will add after frontend is deployed]
   ```
5. Click **"Create Web Service"**
6. Wait for deployment (takes 2-3 minutes)
7. **Save your backend URL**: `https://lookbook-api.onrender.com`

### 5. Deploy Frontend

**Option A: Render Static Site** (All-in-one on Render)

1. From Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your GitHub repository
3. Configure:
   - **Name**: `lookbook`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://lookbook-api.onrender.com/api
   ```
5. Click **"Create Static Site"**
6. Wait for deployment
7. **Save your frontend URL**: `https://lookbook.onrender.com`

**Option B: Vercel** (Faster, better CDN - Recommended for frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Navigate to frontend:
   ```bash
   cd frontend
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Follow prompts:
   - **Set up and deploy**: Yes
   - **Project name**: lookbook
   - **Directory**: `./` (already in frontend)
   - **Override settings**: No
5. Add environment variable:
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://lookbook-api.onrender.com/api
   ```
6. Deploy to production:
   ```bash
   vercel --prod
   ```
7. **Save your Vercel URL**: `https://lookbook.vercel.app`

### 6. Update Environment Variables

Now that you have all URLs, update them:

**Backend (Render)**:
1. Go to your backend service in Render
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL`:
   - If using Render Static Site: `https://lookbook.onrender.com`
   - If using Vercel: `https://lookbook.vercel.app`
4. Click **"Save Changes"** (will trigger redeploy)

**Optional Environment Variables**:
```
OPENAI_API_KEY=sk-...  # For AI features
JWT_SECRET=your-random-secret-here  # For authentication
```

### 7. Test Your Deployment

1. Visit your frontend URL
2. Check if data loads
3. Try filtering
4. View a profile
5. View a project
6. Check browser console for errors

**Health checks**:
- Backend health: `https://lookbook-api.onrender.com/api/health`
- Database health: `https://lookbook-api.onrender.com/api/health/db`

## Important Notes

### Free Tier Limitations

**Render Free Tier**:
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- Database free tier expires after 90 days
- **Solution**: Upgrade to Starter plan ($7/mo each) for production

**Vercel Free Tier**:
- No cold starts
- Excellent CDN
- Perfect for static frontend

### Database Connection

- **Always use Internal Database URL** in your backend (faster, free bandwidth)
- External URL is for connecting from your local machine
- Render services in the same region can use internal URLs

### CORS Configuration

Your backend is already configured to accept requests from `process.env.FRONTEND_URL`, so once you set that environment variable, CORS will work automatically.

### Auto-Deploy

Both Render and Vercel support auto-deploy:
- **Push to `main` branch** → Automatic deployment
- **Pull requests** → Preview deployments (Vercel)

### Custom Domains

**Render**:
1. Go to your service → **"Settings"** → **"Custom Domain"**
2. Add your domain (e.g., `api.yourdomain.com`, `lookbook.yourdomain.com`)
3. Update DNS records as shown
4. SSL certificate auto-generated

**Vercel**:
1. Project settings → **"Domains"**
2. Add your domain
3. Update DNS records
4. SSL certificate auto-generated

## Deployment Commands

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys
```

### Update Frontend (if using Vercel)
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Manual Deploy (if auto-deploy disabled)
```bash
# Backend: Trigger from Render Dashboard → Manual Deploy
# Frontend (Vercel): Run `vercel --prod` in frontend directory
```

## Monitoring & Logs

### Backend Logs
1. Go to your backend service in Render
2. Click **"Logs"** tab
3. Real-time logs show all requests and errors

### Database Metrics
1. Go to your database in Render
2. Click **"Metrics"** tab
3. View connection count, storage, query performance

### Frontend (Vercel)
1. Go to your project in Vercel
2. Click on deployment
3. View deployment logs and runtime logs

## Backup & Maintenance

### Database Backups

**Render automatic backups** (Starter plan and above):
- Daily automatic backups
- Point-in-time recovery
- 7-day retention

**Manual backup**:
```bash
# Using the PSQL command from Render
pg_dump -h [host] -U lookbook_user -d lookbook > backup-$(date +%Y%m%d).sql
```

**Restore from backup**:
```bash
psql [Your Database URL] < backup-20241022.sql
```

### Updating Dependencies
```bash
cd backend
npm update
npm audit fix

cd ../frontend
npm update
npm audit fix

git add .
git commit -m "Update dependencies"
git push
```

## Cost Estimate

### Development/Testing (Free)
- Backend: Free (with cold starts)
- Frontend: Free (Vercel) or Free (Render)
- Database: Free for 90 days
- **Total**: $0/month

### Production (Recommended)
- Backend: $7/month (Starter)
- Frontend: $0/month (Vercel Free) or $7/month (Render Starter)
- Database: $7/month (Starter)
- **Total**: $14-21/month

### Scale-up (High Traffic)
- Backend: $25+/month (Standard, auto-scaling)
- Frontend: $20/month (Vercel Pro)
- Database: $25+/month (Standard)
- **Total**: $70+/month

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is set correctly in backend environment
- Make sure you're using the **Internal Database URL**
- Verify database is running in Render dashboard

### "Service not responding"
- Check backend logs in Render
- Verify build completed successfully
- Check if service is running (Status indicator)

### "CORS Error"
- Verify FRONTEND_URL is set in backend environment
- Make sure it matches your actual frontend URL
- Check CORS settings in `backend/server.js`

### "Cold start is slow"
- This is normal on free tier
- Upgrade to Starter plan for always-on
- Or use a cron job to ping your backend every 14 minutes

### Frontend shows "Cannot reach API"
- Check VITE_API_URL is set correctly
- Verify backend is running and accessible
- Check browser console for specific error

## Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Update FRONTEND_URL to production URL
- [ ] Enable Render's built-in DDoS protection
- [ ] Review database access logs periodically
- [ ] Keep dependencies updated
- [ ] Monitor error logs for suspicious activity

## Next Steps After Deployment

1. **Add your custom domain** (optional but recommended)
2. **Set up monitoring** (UptimeRobot for health checks)
3. **Enable backups** (upgrade to Starter plan)
4. **Add error tracking** (Sentry integration)
5. **Set up analytics** (Google Analytics or Plausible)
6. **Create admin authentication** (if needed)
7. **Add rate limiting** (for API protection)

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Your app logs**: Check Render dashboard for real-time debugging

---

**Ready to deploy!** Start with the database (step 2), then backend (step 4), then frontend (step 5).

