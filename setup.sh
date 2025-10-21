#!/bin/bash

# Lookbook Setup Script
# Automates the initial setup process

set -e  # Exit on any error

echo "================================================"
echo "   Lookbook Setup Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found:$(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL client not found in PATH${NC}"
    echo "Make sure PostgreSQL is installed and accessible"
else
    echo -e "${GREEN}✓ PostgreSQL found${NC}"
fi

echo ""
echo "================================================"
echo "   Step 1: Database Setup"
echo "================================================"
echo ""

read -p "Do you want to create the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: lookbook): " DB_NAME
    DB_NAME=${DB_NAME:-lookbook}
    
    echo "Creating database: $DB_NAME"
    createdb $DB_NAME || echo -e "${YELLOW}Database might already exist${NC}"
    
    echo "Running schema..."
    psql $DB_NAME < database/schema.sql
    echo -e "${GREEN}✓ Database setup complete${NC}"
else
    echo "Skipping database setup"
fi

echo ""
echo "================================================"
echo "   Step 2: Backend Setup"
echo "================================================"
echo ""

cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo -e "${YELLOW}⚠ Please edit backend/.env with your database credentials${NC}"
else
    echo ".env file already exists"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ..

echo ""
echo "================================================"
echo "   Step 3: Frontend Setup"
echo "================================================"
echo ""

cd frontend

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

cd ..

echo ""
echo "================================================"
echo "   Setup Complete! 🎉"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit backend/.env with your database credentials"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "For more information, see:"
echo "  - QUICKSTART.md for detailed setup"
echo "  - README.md for full documentation"
echo "  - INTEGRATION_PLAN.md for merging with existing app"
echo ""
echo "Happy coding! 🚀"


