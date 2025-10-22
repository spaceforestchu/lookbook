# Deploy Lookbook to Render - Quick Guide

## ✅ Prerequisites Complete
- [x] Render account created
- [x] Database ready (segundo-db has lookbook tables)
- [x] GitHub repository connected

## 🚀 Deploy Now - Two Options

### Option A: One-Click Blueprint Deploy (Recommended)

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Blueprint"
3. **Select**: Your GitHub repository (lookbook)
4. **Branch**: main
5. **Review**: Render will show 2 services to create
6. **Set Environment Variables**:
   
   **Backend (`lookbook-api`)**:
   ```
   DATABASE_URL=postgresql://[WRITE_USER]:[PASSWORD]@34.57.101.141:5432/segundo-db
   FRONTEND_URL=https://lookbook-frontend.onrender.com
   ```
   
   **Frontend (`lookbook-frontend`)**:
   ```
   VITE_API_URL=https://lookbook-api.onrender.com/api
   ```

7. **Click**: "Apply"
8. **Wait**: 5-10 minutes for both services to deploy

### Option B: Manual Step-by-Step Deploy

#### Step 1: Deploy Backend

1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - **Name**: `lookbook-api`
   - **Region**: Oregon (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or Starter if you want no cold starts)

5. **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=4002
   DATABASE_URL=postgresql://[WRITE_USER]:[PASSWORD]@34.57.101.141:5432/segundo-db
   FRONTEND_URL=[will update after frontend deploys]
   ```

6. Click "Create Web Service"
7. Wait for deploy (3-5 minutes)
8. **Save your backend URL**: `https://lookbook-api.onrender.com`

#### Step 2: Deploy Frontend

1. Go to: https://dashboard.render.com
2. Click "New +" → "Static Site"
3. Select your GitHub repository
4. Configure:
   - **Name**: `lookbook-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

5. **Environment Variable**:
   ```
   VITE_API_URL=https://lookbook-api.onrender.com/api
   ```

6. Click "Create Static Site"
7. Wait for deploy (3-5 minutes)
8. **Save your frontend URL**: `https://lookbook-frontend.onrender.com`

#### Step 3: Update Backend CORS

1. Go to your `lookbook-api` service in Render
2. Go to "Environment" tab
3. Update `FRONTEND_URL` to: `https://lookbook-frontend.onrender.com`
4. Click "Save Changes" (will trigger redeploy)

## 🧪 Test Your Deployment

Once both services are deployed:

1. **Visit**: https://lookbook-frontend.onrender.com
2. **Check health**: https://lookbook-api.onrender.com/api/health
3. **Check database**: https://lookbook-api.onrender.com/api/health/db

Should show:
- Frontend loads without errors
- Data displays correctly
- Filtering works
- Profile pages load

## ⚠️ Important Notes

### Database Connection String

You need a **write-enabled user** for your database (not readonly_user). The connection string should look like:

```
postgresql://lookbook_user:[PASSWORD]@34.57.101.141:5432/segundo-db
```

If you don't have this, you'll need to:
1. Connect to your database with an admin user
2. Create a write-enabled user for Lookbook
3. Grant permissions on lookbook_* tables

### Firewall Rules

Make sure your database firewall allows connections from Render. Options:
- Add Render's IP ranges (see: https://render.com/docs/static-outbound-ip-addresses)
- OR allow all IPs (0.0.0.0/0) if your database uses SSL (recommended)

### First Load Delay (Free Tier)

On the free tier:
- Backend spins down after 15 minutes of inactivity
- First request takes 30-60 seconds (cold start)
- Upgrade to Starter plan ($7/month) for always-on

## 📝 URLs to Save

After deployment, save these:

```
Backend:  https://lookbook-api.onrender.com
Frontend: https://lookbook-frontend.onrender.com
Health:   https://lookbook-api.onrender.com/api/health
Database: postgresql://[USER]:[PASS]@34.57.101.141:5432/segundo-db
```

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct in backend environment
- Verify firewall allows Render connections
- Try adding `?sslmode=require` to connection string

### "CORS Error"
- Make sure FRONTEND_URL in backend matches actual frontend URL
- Check browser console for exact error

### "502 Bad Gateway"
- Check backend logs in Render dashboard
- Verify build completed successfully
- Check that PORT is set to 4002

### "Data not loading"
- Check browser console for API errors
- Verify VITE_API_URL is correct in frontend
- Test backend health endpoint directly

## 🎉 Next Steps

After successful deployment:
1. ✅ Test all features
2. ✅ Set up custom domain (optional)
3. ✅ Enable monitoring (UptimeRobot)
4. ✅ Consider upgrading to Starter plan for production
5. ✅ Set up database backups

---

**Need help?** Check the backend logs in Render dashboard for errors.

