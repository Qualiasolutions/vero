#!/bin/bash

# Vercel Deployment Script for Veromodels
# This script builds and deploys the application to Vercel

set -e

echo "🚀 Starting Veromodels deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    bun install -g vercel@latest
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "📝 Please login to Vercel:"
    vercel login
fi

# Run type checking
echo "🔍 Running type checking..."
bun run tsgo || {
    echo "❌ Type checking failed. Please fix TypeScript errors before deploying."
    exit 1
}

# Run linting
echo "✨ Running linting..."
bun run lint || {
    echo "⚠️  Linting found issues. Fixing automatically..."
    bun run lint --fix
}

# Build the project
echo "🏗️  Building project..."
bun run build || {
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
}

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo "🌍 Your site is now live on Vercel!"