#!/bin/bash

# Dasa - Build & Deploy Script
# This script automates the build and restart process for the Monorepo.

# 1. Load environment variables
if [ -f .env ]; then
  export $(echo $(grep -v '^#' .env | xargs) | envsubst)
fi

echo "🚀 Starting Deployment..."

# 2. Build CMS
echo "📦 Building CMS..."
cd dasa-cms
npm install
npm run build
cd ..

# 3. Build Frontend
echo "🌐 Building Frontend..."
cd dasa-frontend
npm install
npm run build
cd ..

# 4. Restart Services with PM2
echo "♻️  Restarting Services..."
pm2 restart ecosystem.config.cjs

echo "✅ Deployment Complete!"
pm2 status
