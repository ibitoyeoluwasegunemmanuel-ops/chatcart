#!/bin/bash
echo "Starting ChatCart backend..."
echo "Current directory: $(pwd)"
echo "Contents: $(ls)"

# Install backend deps
if [ -d "backend" ]; then
  echo "Found backend/ folder"
  cd backend
  npm install --legacy-peer-deps
  node src/server.js
else
  echo "No backend folder - running from current dir"
  npm install --legacy-peer-deps  
  node src/server.js
fi
