#!/bin/bash

# Test script for Docker build and run
# This helps verify everything works before deploying to Railway

echo "🐳 Building Docker image..."
docker build -t bankin-scraper-test .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    echo ""
    echo "🧪 To test the container locally, run:"
    echo "docker run --rm -e BANKIN_EMAIL='your-email@example.com' -e BANKIN_PASSWORD='your-password' -e HEADLESS='true' bankin-scraper-test"
    echo ""
    echo "⚠️  Remember to replace the email and password with your actual credentials"
    echo ""
    echo "🚂 Ready for Railway deployment!"
else
    echo "❌ Docker build failed. Check the errors above."
    exit 1
fi
