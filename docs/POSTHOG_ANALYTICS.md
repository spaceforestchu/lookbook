# PostHog Analytics Setup Guide

## Overview

PostHog analytics has been integrated into the Lookbook app to track user behavior, page views, and custom events. This guide will help you get it running.

## Features Enabled

### Automatic Tracking
- ✅ **Page views** - Every page visit is tracked
- ✅ **Page leave** - Time on page calculated automatically
- ✅ **Session recordings** - Watch real user sessions (with privacy masking)
- ✅ **Auto-capture** - Clicks and interactions automatically tracked

### Custom Events Tracked
1. **Filter Applied** - When users apply skills/industry/sector filters
2. **Project Viewed** - When a project detail page is viewed
3. **Person Viewed** - When a person profile is viewed
4. **Navigation** - When users click next/previous buttons
5. **Layout Changed** - When users switch between grid/list views

## Setup Instructions

### 1. Create a PostHog Account

1. Go to [posthog.com](https://posthog.com) and sign up (it's free!)
2. Create a new project
3. Copy your **Project API Key** from the dashboard

### 2. Add API Key to Environment

Create a `.env.local` file in the `/frontend` directory:

```bash
cd frontend
touch .env.local
```

Add your PostHog credentials:

```env
VITE_POSTHOG_API_KEY=phc_your_actual_api_key_here
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

**Note:** 
- If you're in the EU, use `https://eu.i.posthog.com`
- If self-hosting, use your own PostHog URL

### 3. Restart the Frontend

```bash
npm run dev
```

You should see `✅ PostHog initialized` in your browser console.

### 4. Verify in PostHog Dashboard

1. Visit your app and navigate around
2. Go to your PostHog dashboard
3. Check "Live Events" to see events coming in real-time
4. Go to "Session Recordings" to watch user sessions

## Privacy Settings

### What's Masked by Default
- ✅ All input fields are masked in session recordings
- ✅ No personal data is captured in events
- ✅ No cookies are used

### To Mask Additional Elements
Add the `sensitive` class to any element you want masked:

```jsx
<div className="sensitive">Secret content here</div>
```

## Custom Events Available

You can track additional events using the analytics utility:

```javascript
import analytics from '../utils/analytics';

// Track a custom event
analytics.track('Button Clicked', {
  button_name: 'Contact',
  page: 'Project Detail'
});

// Track external link clicks
analytics.externalLinkClicked('github', 'https://github.com/...', 'Project Page');

// Track video plays
analytics.videoPlayed(projectSlug, videoUrl);

// Track partner logo clicks
analytics.partnerLogoClicked(projectSlug, partnerName);
```

## Useful PostHog Features

### 1. Session Recordings
- Go to "Session Recordings" in PostHog
- Watch actual users navigate your site
- See where they click, scroll, and get stuck

### 2. Insights
- Go to "Insights" → "Trends"
- See which filters are most popular
- Identify which projects get the most views

### 3. Funnels
- Go to "Insights" → "Funnels"
- Track user journeys like:
  - Landing → Filter Applied → Project Viewed → Contact Clicked

### 4. User Paths
- Go to "Insights" → "Paths"
- Visualize how users navigate through your site

## Common Questions

### Q: Does this slow down my site?
A: No! PostHog loads asynchronously and the script is only ~20KB.

### Q: Is it GDPR compliant?
A: Yes! PostHog is GDPR compliant. Session recordings mask sensitive data, and you can use EU hosting.

### Q: How much does it cost?
A: Free for up to 1 million events/month (more than enough for most portfolios).

### Q: Can I turn it off in development?
A: Yes! Just don't add the API key to `.env.local` in development.

### Q: How do I disable session recordings?
A: In `/frontend/src/utils/analytics.js`, change:
```javascript
session_recording: {
  recordCrossOriginIframes: false,
  maskAllInputs: true,
},
```
to:
```javascript
session_recording: false,
```

## Events Reference

| Event Name | When Triggered | Properties |
|------------|----------------|------------|
| `Filter Applied` | User checks/unchecks a filter | `filter_type`, `filter_value`, `view_mode` |
| `Project Viewed` | Project detail page loads | `project_slug`, `project_title`, `skills`, `sectors` |
| `Person Viewed` | Person profile page loads | `person_slug`, `person_name`, `skills` |
| `Navigation` | Next/Previous clicked | `action`, `from`, `to` |
| `Layout Changed` | Grid/List toggle clicked | `layout`, `view_mode` |

## Troubleshooting

### Events Not Showing Up?
1. Check browser console for `✅ PostHog initialized`
2. Verify your API key in `.env.local`
3. Make sure you restarted the dev server after adding the key
4. Check PostHog dashboard "Live Events" (real-time view)

### Session Recordings Not Working?
1. Check if your plan includes session recordings (free tier does!)
2. Verify `session_recording` is not set to `false` in `analytics.js`
3. Some browser extensions (like ad blockers) can block recordings

## Next Steps

Once analytics are running, you can:
1. ✅ Watch session recordings to see real user behavior
2. ✅ Create dashboards for key metrics
3. ✅ Set up alerts for important events
4. ✅ A/B test new features with feature flags (PostHog has this built-in!)

## Support

- PostHog Docs: https://posthog.com/docs
- PostHog Community: https://posthog.com/questions
- File: `/frontend/src/utils/analytics.js` - All analytics code

