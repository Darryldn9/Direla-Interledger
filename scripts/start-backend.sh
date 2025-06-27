#!/bin/bash

echo "🚀 Starting Dinela Backend Server..."

# Check if we're in the right directory
if [ ! -f "private.key" ]; then
    echo "❌ Error: private.key not found in current directory"
    echo "Please run this script from the Dinela root directory"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

echo "🔧 Starting Open Payments backend on port 3001..."
echo "📱 Make sure your mobile app is running on the same network"
echo ""

# Start the backend server
cd backend && npm start 