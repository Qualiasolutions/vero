#!/bin/bash

echo "🚀 Starting Veromodels Production Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
bun install

echo "🔧 Running linting..."
bun lint

echo "🏗️ Building for production..."
bun run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"