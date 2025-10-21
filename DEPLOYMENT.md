# Deployment Guide

Guide for deploying Lookbook to production.

## Deployment Options

### Option 1: Separate Services (Recommended for Standalone)

Deploy backend and frontend as separate services.

**Pros:**
- Independent scaling
- Easier to update individually
- Can use different hosting providers

**Cons:**
- Need to manage CORS
- Two deployments to maintain

### Option 2: Integrated (Recommended for Merge)

Merge into your existing test-pilot-server and pilot-client.

**Pros:**
- Single deployment
- Share authentication
- Unified codebase

**Cons:**
- More complex initial setup
- Tied to existing deployment process

## Deployment Checklist

### Pre-Deployment

- [ ] Run tests locally
- [ ] Check all environment variables are set
- [ ] Review database migrations
- [ ] Update CORS settings
- [ ] Set up error logging
- [ ] Configure rate limiting (optional)
- [ ] Set up monitoring (optional)

### Backend Deployment

#### Environment Variables

Required:
```env
NODE_ENV=production
PORT=4002
DATABASE_URL=postgresql://user:pass@host:5432/lookbook
FRONTEND_URL=https://your-frontend.com
```

Optional:
```env
OPENAI_API_KEY=sk-...
CRM_WEBHOOK_URL=https://crm.com/api
CRM_WEBHOOK_AUTH=Bearer token
JWT_SECRET=your-secret-key
```

#### Platforms

##### Railway

1. Create new project on Railway.app
2. Connect your Git repository
3. Set environment variables in Railway dashboard
4. Railway auto-detects Node.js and deploys
5. Get your backend URL: `https://lookbook-backend.railway.app`

```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Set environment variables
railway variables set DATABASE_URL=postgresql://...

# Deploy
railway up
```

##### Heroku

```bash
# Login
heroku login

# Create app
heroku create lookbook-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git subtree push --prefix backend heroku main
```

##### Render

1. Create new Web Service on Render.com
2. Connect your Git repository
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables
7. Click "Create Web Service"

##### DigitalOcean App Platform

1. Create new app
2. Select your repository
3. Detect Node.js app in `backend/`
4. Set environment variables
5. Deploy

##### AWS (EC2)

```bash
# SSH into EC2 instance
ssh ec2-user@your-instance

# Clone repository
git clone https://github.com/yourusername/lookbook.git
cd lookbook/backend

# Install dependencies
npm install --production

# Set up PM2
npm install -g pm2
pm2 start server.js --name lookbook-backend
pm2 startup
pm2 save

# Set up Nginx reverse proxy
sudo nano /etc/nginx/sites-available/lookbook
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

#### Build for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized static files.

#### Environment Variables

```env
VITE_API_URL=https://your-backend-url.com/api
```

#### Platforms

##### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
```

Or connect via Vercel dashboard:
1. Import Git repository
2. Set root directory to `frontend`
3. Framework preset: Vite
4. Add environment variable: `VITE_API_URL`
5. Deploy

##### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Or use Netlify dashboard:
1. New site from Git
2. Build command: `npm run build`
3. Publish directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL`

##### Static Hosting (S3, CloudFlare Pages, GitHub Pages)

After building (`npm run build`), upload `frontend/dist/` contents to your static host.

### Database Setup

#### Production PostgreSQL

Options:
- **Railway** - Integrated with deployment
- **Heroku Postgres** - Add-on
- **Neon** - Serverless Postgres
- **Supabase** - Postgres + extras
- **AWS RDS** - Managed Postgres
- **DigitalOcean Managed Databases**

#### Run Migrations

```bash
# Connect to production database
psql $DATABASE_URL

# Run schema
\i database/schema.sql

# Optional: Load sample data
\i database/sample-data.sql

# Verify
\dt
SELECT COUNT(*) FROM lookbook_profiles;
```

### SSL/HTTPS

Most platforms (Vercel, Netlify, Railway, Render) provide automatic HTTPS.

For custom domains:
1. Add custom domain in platform dashboard
2. Update DNS records
3. SSL certificate is auto-generated

### CORS Configuration

Update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Health Checks

Set up health check endpoints for monitoring:

**Uptime monitoring** (UptimeRobot, Pingdom):
- Monitor: `https://your-api.com/api/health`
- Check every 5 minutes

**Database connection**:
- Monitor: `https://your-api.com/api/health/db`

### Logging

#### Option 1: Built-in Console (Simple)

Already configured. Logs go to platform's log viewer.

#### Option 2: Winston (Recommended)

```bash
cd backend
npm install winston
```

Create `backend/utils/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### Option 3: External Service

- **Logtail** (formerly Timber.io)
- **Papertrail**
- **Datadog**
- **New Relic**

### Error Tracking

#### Sentry (Recommended)

```bash
cd backend
npm install @sentry/node
```

Add to `backend/server.js`:
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

### Performance Monitoring

#### Backend
- **New Relic APM**
- **Datadog APM**
- **AppSignal**

#### Frontend
- **Vercel Analytics** (if using Vercel)
- **Google Analytics**
- **Plausible** (privacy-friendly)

### Backup Strategy

#### Database Backups

**Automated** (Platform-dependent):
- Railway: Automatic backups
- Heroku: Continuous Protection add-on
- AWS RDS: Automated backups

**Manual**:
```bash
# Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240120.sql
```

**Scheduled** (cron):
```bash
# Add to crontab
0 2 * * * pg_dump $DATABASE_URL > /backups/db-$(date +\%Y\%m\%d).sql
```

### CI/CD

#### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install and build
        run: cd frontend && npm ci && npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

### Post-Deployment

- [ ] Test all endpoints
- [ ] Verify database connection
- [ ] Check error logs
- [ ] Test PDF generation
- [ ] Verify CORS works
- [ ] Test from mobile device
- [ ] Set up monitoring alerts
- [ ] Update documentation with production URLs

### Scaling

#### Backend Scaling
- **Horizontal**: Add more instances (Railway, Heroku, Render auto-scale)
- **Database**: Connection pooling (already configured)
- **Caching**: Add Redis for frequently accessed data

#### Frontend Scaling
- Static files are automatically CDN-distributed on Vercel/Netlify
- No additional scaling needed

### Cost Estimates

#### Small Scale (< 1000 users)
- **Backend**: Railway Starter ($5/mo) or Render Free
- **Frontend**: Vercel Free or Netlify Free
- **Database**: Railway Postgres ($5/mo) or Neon Free
- **Total**: $10-20/month

#### Medium Scale (1000-10000 users)
- **Backend**: Railway Pro ($20/mo) or Render Standard ($25/mo)
- **Frontend**: Vercel Pro ($20/mo)
- **Database**: Railway Postgres Pro ($20/mo) or AWS RDS ($50/mo)
- **Total**: $60-95/month

#### Large Scale (10000+ users)
- **Backend**: Multiple instances ($100+/mo)
- **Frontend**: Vercel Enterprise (Custom)
- **Database**: AWS RDS Multi-AZ ($200+/mo)
- **CDN**: CloudFront ($50+/mo)
- **Total**: $350+/month

### Security Checklist

- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Add authentication to admin routes
- [ ] Validate all inputs
- [ ] Use parameterized queries (already done)
- [ ] Keep dependencies updated
- [ ] Set up security headers
- [ ] Enable CORS only for your domain
- [ ] Regular security audits

### Troubleshooting Deployment

**"Cannot connect to database"**
- Check DATABASE_URL is set correctly
- Verify database allows connections from your backend IP
- Check SSL settings if required

**"CORS error"**
- Add frontend URL to CORS whitelist
- Check if credentials are properly set

**"Build failed"**
- Check Node.js version matches
- Verify all dependencies in package.json
- Check build logs for specific errors

**"502 Bad Gateway"**
- Backend might not be running
- Check health endpoint
- Verify port configuration

### Maintenance

Weekly:
- Check error logs
- Review performance metrics
- Check database size

Monthly:
- Update dependencies
- Review and optimize slow queries
- Check backup integrity

Quarterly:
- Security audit
- Performance review
- Cost optimization

---

Need help? Check the platform-specific documentation or open an issue!


