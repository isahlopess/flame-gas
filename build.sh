#!/bin/bash
# Vercel Build Script

echo "Building for Vercel..."

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# Build frontend assets
npm run build

# Clear and cache Laravel config/routes
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build complete."
