#!/bin/bash

set -e

# Always run from this script's directory so relative paths work
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Deploy sample-site to SIT environment only
# Usage:
#   ./deploy.sh
#   ./deploy.sh skip-build

# Load SIT env vars for build-time
if [ -f "./.env.sit" ]; then
  set -a
  . "./.env.sit"
  set +a
  echo "✅ Loaded env from .env.sit"
else
  echo "⚠️ .env.sit not found; using current shell env"
fi

# Fixed environment
branch="rc-sit"
host='39.105.136.238'
user="kuban"
remote_base="/home/kuban/apps/verse-app/sample-site"
remote_standalone="$remote_base/.next/standalone"
remote_static="$remote_base/.next/static"

# Check branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "$branch" ]; then
  echo "❌ Branch mismatch detected!"
  echo "📍 Current branch: $current_branch"
  echo "🎯 Expected branch: $branch"
  echo "📝 Please switch to the correct branch before deploying:"
  echo "   git checkout $branch"
  exit 1
fi

echo "🚀 Deploying sample-site in SIT mode..."
echo "📍 Branch: $branch ✅"
echo "🖥️  Host: $host"
echo ""

echo "🔄 Pulling latest changes from $branch branch..."
git pull origin $branch

echo "📦 Installing dependencies (root + sample-site)..."
pnpm i

if [ "$1" = "skip-build" ]; then
  echo "⏭️ Skipping build process"
else
  echo "🏗️ Building sample-site (Next.js standalone)..."
  pnpm --filter @versepen/sample-site build
  
  if [ ! -d "./.next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
  fi
  if [ ! -d "./.next/standalone" ] || [ ! -d "./.next/static" ]; then
    echo "❌ Standalone build not found. Ensure next.config.js has output: 'standalone'"
    exit 1
  fi
  echo "📊 Build output size: $(du -sh ./.next | cut -f1)"
fi

echo "🚀 Deploying to remote server..."
# Ensure remote destination directories exist
ssh $user@$host "mkdir -p '$remote_standalone' '$remote_static'"
# Sync standalone server and static assets
rsync -avz --delete ./.next/standalone/ $user@$host:$remote_standalone
rsync -avz --delete ./.next/static/ $user@$host:$remote_static

# Upload .env.sit for runtime env injection
if [ -f "./.env.sit" ]; then
  rsync -avz ./.env.sit $user@$host:$remote_base/.env.sit
fi

echo "🔁 Restarting remote process (PM2 if available)..."
ssh $user@$host "\
  if command -v pm2 >/dev/null 2>&1; then \
    [ -f '$remote_base/.env.sit' ] && . '$remote_base/.env.sit'; \
    if pm2 describe sample-site >/dev/null 2>&1; then \
      pm2 restart sample-site --update-env; \
    else \
      PORT=3001 NODE_ENV=production pm2 start server.js --name sample-site --cwd '$remote_standalone/sample-site' --interpreter node; \
    fi; \
    pm2 save; \
  else \
    echo 'PM2 not found. Start manually:'; \
    echo 'cd $remote_standalone && PORT=3001 NODE_ENV=production node server.js &'; \
  fi"

echo "✅ Deployment [SIT] complete!"


