#!/bin/bash

# Dasa - Build & Deploy Script
# This script automates the build and restart process for the Monorepo.

# 1. Load environment variables
if [ -f .env ]; then
  export $(echo $(grep -v '^#' .env | xargs) | envsubst)
fi

echo "🚀 Starting Deployment..."

# 2. Build CMS
echo "📦 Checking CMS..."
cd dasa-cms
# Only install if package.json is newer than node_modules
if [ package.json -nt node_modules ]; then
  npm ci
fi
npm run build
cd ..

# 3. Build Frontend
echo "🌐 Checking Frontend..."
cd dasa-frontend
# Only install if package.json is newer than node_modules
if [ package.json -nt node_modules ]; then
  npm ci
fi
npm run build
cd ..

# 4. Restart Services with PM2
echo "♻️  Restarting Services..."
pm2 restart ecosystem.config.cjs

echo "✅ Deployment Complete!"
pm2 status
