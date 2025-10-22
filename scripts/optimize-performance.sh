#!/bin/bash

# Performance Optimization Script
# Applies database indexes and optimizations for Lookbook

set -e

echo "🚀 Lookbook Performance Optimization Script"
echo "=========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set it in one of these ways:"
  echo "  1. export DATABASE_URL='postgresql://user:pass@host:port/dbname'"
  echo "  2. Create backend/.env with DATABASE_URL=..."
  echo ""
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Ask for confirmation
echo "This script will:"
echo "  - Add performance indexes to lookbook_profiles"
echo "  - Add GIN indexes for array searches"
echo "  - Add full-text search indexes"
echo "  - Run ANALYZE on tables"
echo ""
read -p "Do you want to continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "📦 Applying performance indexes..."
echo ""

# Apply the migration
psql "$DATABASE_URL" -f database/migrations/add-performance-indexes.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Performance indexes applied successfully!"
  echo ""
  echo "📊 Checking indexes..."
  echo ""
  
  # Verify indexes
  psql "$DATABASE_URL" -c "
    SELECT 
      indexname, 
      indexdef 
    FROM pg_indexes 
    WHERE tablename = 'lookbook_profiles' 
    ORDER BY indexname;
  "
  
  echo ""
  echo "✨ Done! Your database is now optimized."
  echo ""
  echo "Next steps:"
  echo "  1. Restart your backend server: cd backend && npm restart"
  echo "  2. Rebuild Next.js: npm run build"
  echo "  3. Test the performance improvement"
  echo ""
else
  echo ""
  echo "❌ Failed to apply indexes"
  echo "Please check the error message above"
  exit 1
fi

