#!/bin/bash
# Helper script for Netlify deployment

# Make script executable
# chmod +x netlify.sh

# Create dist directory
mkdir -p dist

# Copy all necessary files to dist
echo "Copying files to dist directory..."
cp -r index.html styles scripts client assets dist/

# Copy all HTML files
cp -r *.html dist/ 2>/dev/null || echo "No additional HTML files found"

# Copy docs if they exist
if [ -d "docs" ]; then
  cp -r docs dist/
  echo "Docs directory copied"
else
  echo "No docs directory found, skipping"
fi

echo "Build completed successfully. Contents of dist directory:"
ls -la dist/

echo "To deploy manually to Netlify, run:"
echo "  netlify deploy --prod" 