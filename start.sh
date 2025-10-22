#!/bin/bash

# Lookbook Startup Script
# Run this to verify database and start both servers

echo "🔍 Checking database connection..."
cd backend
node check-db.js

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Database connection failed!"
  echo "📖 Please read DATABASE_CONFIG.md for help"
  exit 1
fi

echo ""
echo "✅ Database OK! Starting servers..."
echo ""

# Start backend
echo "🚀 Starting backend on port 4002..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in a new terminal
echo "🚀 Starting frontend on port 5175..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🎉 Lookbook is starting!                 ║"
echo "║                                            ║"
echo "║  Frontend: http://localhost:5175          ║"
echo "║  Admin:    http://localhost:5175/admin    ║"
echo "║  Backend:  http://localhost:4002          ║"
echo "║                                            ║"
echo "║  Press Ctrl+C to stop both servers        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait

