# Lookbook

A minimal Next.js app for showcasing people and projects with filtering, detail pages, and cross-linking, powered by Sanity CMS.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Sanity CMS

1. Create a free account at [sanity.io](https://www.sanity.io)
2. Create a new Sanity project
3. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
4. Update `.env.local` with your Sanity project credentials:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your project ID from Sanity dashboard
   - `NEXT_PUBLIC_SANITY_DATASET`: Your dataset name (usually "production")
   - `NEXT_PUBLIC_SANITY_API_VERSION`: API version (default: 2025-01-01)

### 3. Configure AI Intake (Optional)

To enable AI-powered profile extraction at `/admin/intake`:

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

**Security Note:** The API key is only used server-side in the `/api/ai/extract` endpoint. It is never exposed to the client.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Sanity Studio

Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to access the Sanity Studio and start creating content.

**Content Types:**
- **Person**: Create profiles with name, title, skills, photos, and "open to work" status
- **Project**: Create projects with title, summary, skills, sectors, GitHub/live URLs, and participant references

## Features

- **People Listing** (`/people`): Browse people with text search, skills filter, and "open to work" toggle
- **Person Detail Pages** (`/people/[slug]`): Individual profiles with SEO metadata and related projects
- **Projects Listing** (`/projects`): Explore projects with text search, skills, and sectors filters
- **Project Detail Pages** (`/projects/[slug]`): Project details with cross-links to contributors
- **ISR (Incremental Static Regeneration)**: Content updates every 5 minutes (300s)
- **Shareable URLs**: All filters sync with URL query parameters
- **On-Demand Revalidation**: Webhook support for instant cache updates
- **AI Intake** (`/admin/intake`): Extract Person profiles from resume/LinkedIn text using Claude AI

## Architecture

- **Framework**: Next.js 15 with App Router
- **CMS**: Sanity with GROQ queries
- **Styling**: Tailwind CSS v4
- **TypeScript**: Strict mode enabled
- **Caching**: ISR with 300-second revalidation

## Webhook Setup (Optional)

Enable on-demand revalidation to instantly update your site when content changes in Sanity.

### 1. Add Revalidate Secret to Environment

Add to `.env.local`:
```
REVALIDATE_SECRET=your-secret-token-here
```

### 2. Configure Sanity Webhook

1. Go to your Sanity project dashboard → API → Webhooks
2. Create a new webhook with:
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type == "person" || _type == "project"`
   - **Projection**:
     ```groq
     {
       "type": _type,
       "slug": select(defined(slug.current) => slug.current, null),
       "personSlugs": select(_type == "project" => participants[]->slug.current, [])
     }
     ```
   - **HTTP Headers**:
     ```
     x-revalidate-secret: your-secret-token-here
     ```
3. Save the webhook

Now when you publish/update content in Sanity Studio, the relevant pages will refresh immediately instead of waiting 5 minutes.

## Analytics & Performance

### Analytics

We use **Vercel Analytics** for page views and custom events, plus **Speed Insights** for Web Vitals monitoring.

**Events Recorded:**

| Event Name | Properties | Description |
|------------|-----------|-------------|
| `people_filter_search` | `{ isEmpty: boolean, length: number }` | Text search in People filter |
| `people_filter_skills` | `{ count: number }` | Skills filter toggle in People |
| `people_filter_open` | `{ value: boolean }` | "Open to work" toggle in People |
| `people_filters_cleared` | `{}` | Clear all filters in People |
| `projects_filter_search` | `{ isEmpty: boolean, length: number }` | Text search in Projects filter |
| `projects_filter_skills` | `{ count: number }` | Skills filter toggle in Projects |
| `projects_filter_sectors` | `{ count: number }` | Sectors filter toggle in Projects |
| `projects_filters_cleared` | `{}` | Clear all filters in Projects |
| `nav_person_card_click` | `{ slug: string }` | Person card clicked |
| `nav_project_card_click` | `{ slug: string }` | Project card clicked |

**Privacy:** We never send raw search terms—only their length and whether they're empty. This preserves user privacy while providing useful analytics.

### Performance Baseline

**Optimization Checklist:**

- ✅ **LCP Images**: Person hero images ≤ 800×800, card images ≤ 320×320 (configured via Sanity image URL builder)
- ✅ **CSS**: Minimal Tailwind bundle with no blocking CSS; custom globals kept lean
- ✅ **Fonts**: Using Next.js `next/font/google` for optimized Geist Sans/Mono with automatic subsetting and `swap` strategy
- ✅ **Images**: Next.js `<Image>` with `placeholder="blur"` using Sanity LQIP; fixed sizes prevent layout shift
- ✅ **JavaScript**: Filter components are lean client components; consider debouncing search if CPU spikes appear
- ✅ **Third-party**: No heavy libraries added to public pages; analytics scripts are minimal and async

**Monitoring:**

- View real-time Web Vitals (LCP, FID, CLS, FCP, TTFB) in Vercel Speed Insights dashboard
- Track custom events and user flows in Vercel Analytics dashboard

## AI Intake (Admin)

### Overview

The `/admin/intake` page provides AI-powered profile extraction for quickly creating Person records:

1. **Paste Source Text**: Copy/paste resume, LinkedIn profile, or bio text
2. **Extract Profile**: Click button to call Claude AI for structured extraction
3. **Review JSON**: See extracted fields (name, title, skills, openToWork)
4. **Compare (Optional)**: Select an existing person to view field-by-field diff
5. **Copy to Clipboard**: Export proposed JSON for manual review/editing

### Features

- **Privacy-First**: Extraction runs server-side only; API key never exposed to client
- **Structured Output**: Returns typed JSON matching Person schema
- **Suggested Slug**: Auto-generates kebab-case slug from name
- **Diff Visualization**: Compare proposed changes against existing records
- **No Auto-Write**: Review-only workflow; no automatic CMS updates

### Security

- **No Authentication**: Currently open for internal use only (add auth before production)
- **Server-Side Only**: API calls to Anthropic happen in `/api/ai/extract` route
- **Environment Variable**: `ANTHROPIC_API_KEY` must be set in `.env.local`

### Normalization & Moderation

**Skill Normalization** (`lib/normalize.ts`):
- Maps common synonyms (e.g., `js` → `JavaScript`, `react.js` → `React`)
- Enforces max 12 skills with ≤ 30 characters each
- De-duplicates and alphabetically sorts skills
- Provides canonical skill names from curated list
- Reports renamed and dropped skills for transparency

**Content Moderation** (`lib/moderation.ts`):
- Detects PII in source text (emails, phone numbers, URLs)
- Flags profanity in name/title fields
- Enforces length limits (name ≤ 80 chars, title ≤ 80 chars)
- Returns structured report with errors, warnings, and PII counts

**Admin Workflow**:
1. Extract profile from raw text using Claude AI
2. Click "Sanitize & Check" to normalize skills and run moderation
3. Review sanitized JSON with rename/drop details
4. Check moderation report for errors/warnings
5. Copy sanitized JSON and manually publish in Sanity Studio

**Configuration**:
- Extend `CANONICAL_SKILLS` in `lib/normalize.ts` as taxonomy grows
- Add synonyms to `SYNONYMS` map for better normalization
- Expand `PROFANITY` list in `lib/moderation.ts` as needed

### Future Enhancements

- Consider adding authentication (e.g., NextAuth.js) for production use
- Rate limiting on the API endpoint to prevent abuse
- Automated CMS write functionality (with human approval)

## Semantic Search (Step 14)
Requires Postgres with pgvector.

### Env
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `INDEX_SECRET`

### Indexing

curl -X POST http://localhost:3000/api/search/index?secret=YOUR_SECRET

or:

curl -X POST http://localhost:3000/api/search/index -H "X-Index-Secret: YOUR_SECRET"

### Query example

curl -X POST http://localhost:3000/api/search -H "Content-Type: application/json" -d '{"q":"fintech react typescript", "type":"all", "skills":["React","TypeScript"], "open":true, "limit":10}'

### Notes
- Uses OpenAI `text-embedding-3-small` (1536 dims) + cosine similarity.
- Filters use **AND** semantics:
  - People: `skills` must contain all selected; `open=true` matches `open_to_work`.
  - Projects: `skills` and `sectors` must contain all selected.
- Public pages (/people, /projects) unchanged; use `/search` to exercise NLQ.
- If `CREATE EXTENSION vector` fails, enable pgvector on your DB or ask your provider.

## Share Pack (Step 15)
Generate a recruiter-ready PDF and capture light insights.

### Env
- Optional:
  - `CRM_WEBHOOK_URL` — if set, `/api/crm/lead` forwards payloads to this URL
  - `CRM_WEBHOOK_AUTH` — optional Authorization header value (e.g., `Bearer <token>`)

### PDF Generation
- Page: `/share` — select People/Projects and click **Generate PDF**.
- API: `POST /api/sharepack`
  ```json
  {
    "peopleSlugs": ["jane-doe","john-smith"],
    "projectSlugs": ["alpha","beta"],
    "requesterEmail": "recruiter@company.com"
  }
  ```
  Returns application/pdf attachment `lookbook-sharepack.pdf`.

### CRM Webhook (optional)
- API: `POST /api/crm/lead`
  ```json
  { "email": "recruiter@company.com", "note": "Interested in fintech", "peopleSlugs": [], "projectSlugs": [] }
  ```
  If `CRM_WEBHOOK_URL` is set, payload is forwarded; otherwise it's just logged in `sharepack_events`.

### Insights
- Page: `/admin/insights` — shows total events, last 30 days, and most requested People/Projects (by slug).
- Backed by Postgres table `sharepack_events` (created automatically in `ensureSchema()`).

### Installation
```bash
npm i pdf-lib
```

### Acceptance Criteria
- `/share` renders lists from Sanity and downloads a PDF with selected items.
- `/api/sharepack` returns a valid PDF; also logs a `sharepack` row in `sharepack_events`.
- `/api/crm/lead` logs a `lead` row; forwards to webhook when configured.
- `/admin/insights` loads without errors and lists top slugs.
- No auth added in this step; keep pages discoverable but add `robots.txt` disallow (done in earlier deploy step).

## Internal Staff Workflow (No Extra Auth)

### Overview
Staff create and edit content in **Sanity Studio** at `/studio` with no extra authentication required. The public site remains read-only. Search functionality automatically switches between semantic (vector) and keyword (GROQ) modes based on configuration.

### Content Management
- **Create/edit candidates**: Navigate to `/studio` and create `person` documents
- **Create/edit projects**: Navigate to `/studio` and create `project` documents
- **Admin hub**: Visit `/admin` for quick links to Studio and Search

### Search Modes
The `/search` page automatically switches between two modes:

**Keyword Mode (Default)**:
- Uses GROQ queries with first-token matching
- AND semantics for skills/sectors/open filters
- Works immediately with no additional setup
- Set `NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=0` (or leave unset)

**Semantic Mode (Optional)**:
- Uses pgvector + OpenAI embeddings for intelligent similarity search
- Requires Postgres with pgvector and OpenAI API key
- Set `NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=1`
- Automatically enabled when all dependencies are configured

### Deploy Now (Minimum Requirements)
Set these environment variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `REVALIDATE_SECRET`
- `NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=0` (keyword mode, works immediately)

### Upgrade to Semantic Search Later
When ready to enable vector search:
1. Set up Postgres with pgvector extension
2. Add `DATABASE_URL` and `OPENAI_API_KEY` to environment
3. Change `NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=1`
4. Run initial indexing: `curl -X POST http://localhost:3000/api/search/index -H "x-index-secret: YOUR_SECRET"`

### What This Gives You Right Away
- `/studio` → Staff can create/edit candidates and projects (no extra auth)
- `/search` → Works immediately via keyword search; auto-upgrades to vector search when DB/OpenAI are configured
- `/admin` → Quick hub for accessing Studio and Search
- No crashy environment dependencies; public pages remain read-only
- Graceful degradation: semantic features are optional, not required
