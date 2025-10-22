# Lookbook - Talent & Project Showcase

A full-stack application for showcasing team member profiles and projects, built with React, Express, and PostgreSQL.

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables

Create `backend/.env`:
```env
DATABASE_URL=your_database_connection_string
PORT=4002
FRONTEND_URL=http://localhost:5175
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_hashed_password
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:4002/api
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5175
- **Admin Portal**: http://localhost:5175/admin
- **Backend API**: http://localhost:4002/api

## Documentation

Detailed documentation is available in the `private-docs/` folder (not tracked in git):
- Setup guides
- Database configuration
- Deployment instructions
- Feature documentation

## Project Structure

```
lookbook/
├── frontend/           # Vite React application
├── backend/            # Express API server
├── database/           # SQL schema files
└── private-docs/       # Documentation (gitignored)
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL

## Security

- Never commit `.env` files
- Store sensitive documentation in `private-docs/`
- Use environment variables for all credentials

## License

MIT
