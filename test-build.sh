#!/bin/bash

# Test script for build process
# This helps verify everything compiles correctly before deploying to Railway

echo "🔧 Testing TypeScript compilation..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ TypeScript build successful!"
    echo ""
    echo "📁 Generated files in dist/:"
    ls -la dist/
    echo ""
    echo "🧪 To test the compiled code locally, run:"
    echo "BANKIN_EMAIL='your-email@example.com' BANKIN_PASSWORD='your-password' HEADLESS='true' npm run start:prod"
    echo ""
    echo "⚠️  Remember to replace the email and password with your actual credentials"
    echo ""
    echo "🚂 Ready for Railway deployment!"
else
    echo "❌ TypeScript build failed. Check the errors above."
    exit 1
fi
