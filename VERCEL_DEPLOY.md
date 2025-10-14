# Vercel Deployment Guide

## ⚠️ IMPORTANT: Environment Variables Must Be Set

The build will fail if required environment variables are not set in Vercel **before deployment**.

## Required Environment Variables

Set these in **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

**IMPORTANT**: Add for **all three** environments (Production, Preview, Development):

### Core (Required)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-from-sanity
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=0
REVALIDATE_SECRET=your-long-random-secret-string
```

### Optional Features

#### AI Intake (Step 12)
```
ANTHROPIC_API_KEY=sk-ant-...
```

#### Semantic Search (Step 14)
```
DATABASE_URL=postgres://USER:PASS@HOST:PORT/DB
OPENAI_API_KEY=sk-...
INDEX_SECRET=another-random-secret
```

#### Share Pack + CRM (Step 15)
```
CRM_WEBHOOK_URL=https://hooks.zapier.com/...
CRM_WEBHOOK_AUTH=Bearer xyz
```

## How to Get Sanity Values

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to **Settings** → **API**
4. Find your **Project ID**
5. Use `production` for dataset (or your custom dataset name)

## Deployment Steps

1. **Push to GitHub**: Commit and push your code
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**:
   - Before clicking "Deploy", add all required variables
   - Or add them in Settings after deployment and redeploy

4. **Deploy**: Click "Deploy" button

## Troubleshooting

### Build fails with "Cannot read properties of undefined"
- Check that all `NEXT_PUBLIC_*` variables are set in Vercel
- Make sure `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct

### Studio doesn't load at `/studio`
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are correct
- Check Sanity dashboard for correct values

### Search returns no results
- If using keyword mode (default): No additional setup needed
- If using semantic mode: Ensure `DATABASE_URL` and `OPENAI_API_KEY` are set

### Pages show stale content
- Set up Sanity webhook (see README "Webhook Setup" section)
- Make sure `REVALIDATE_SECRET` matches between Vercel and Sanity webhook

## After Deployment

### Enable Sanity Studio Access
1. Go to Sanity Dashboard → API → CORS Origins
2. Add your Vercel deployment URL:
   - `https://your-app.vercel.app`
   - Enable "Allow credentials"
3. Save

### Set Up Webhook (Optional but Recommended)
1. Vercel Dashboard → Your Project → Settings → Domains
2. Copy your production domain
3. Follow README "Webhook Setup" section to configure Sanity webhook
4. Use: `https://your-domain.vercel.app/api/revalidate`

## Quick Deploy Checklist

- [ ] All `NEXT_PUBLIC_*` environment variables set in Vercel
- [ ] `REVALIDATE_SECRET` set in Vercel
- [ ] Code pushed to GitHub
- [ ] Imported to Vercel
- [ ] First deployment successful
- [ ] Sanity CORS configured for your domain
- [ ] Sanity webhook configured (optional)
- [ ] Test `/studio` page loads
- [ ] Test `/people` and `/projects` pages load
- [ ] Test `/search` works

## Upgrade to Optional Features Later

To enable semantic search:
1. Set up Postgres with pgvector (e.g., Neon.tech)
2. Add `DATABASE_URL` and `OPENAI_API_KEY` to Vercel
3. Change `NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=1`
4. Redeploy
5. Run indexing: `curl -X POST https://your-app.vercel.app/api/search/index -H "x-index-secret: YOUR_SECRET"`
