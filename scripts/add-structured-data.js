/**
 * KeyRacer Structured Data Integration Script
 * 
 * This Node.js script adds the structured-data-loader.js script reference
 * to all HTML files in the project to improve SEO and search engine visibility.
 */

const fs = require('fs');
const path = require('path');

// Directory to scan for HTML files
const rootDir = path.resolve(__dirname, '..');

// Script tag to insert
const scriptTag = '<script src="/scripts/structured-data-loader.js"></script>';

// Function to check if the script is already included
function hasStructuredDataLoader(content) {
    return content.includes('structured-data-loader.js');
}

// Function to add the script tag before the closing head tag
function addScriptToHead(content) {
    if (hasStructuredDataLoader(content)) {
        console.log('  - Script already included, skipping');
        return content;
    }
    
    // Find the closing head tag and insert the script before it
    const headCloseIndex = content.indexOf('</head>');
    if (headCloseIndex === -1) {
        console.log('  - No </head> tag found, skipping');
        return content;
    }
    
    const newContent = [
        content.slice(0, headCloseIndex),
        '    ' + scriptTag,
        content.slice(headCloseIndex)
    ].join('\n');
    
    return newContent;
}

// Function to process a file
function processFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    try {
        // Read the file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Add the script tag
        const updatedContent = addScriptToHead(content);
        
        // Write the updated content back to the file
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log('  - Updated successfully');
        }
    } catch (error) {
        console.error(`  - Error processing file: ${error.message}`);
    }
}

// Function to scan directory recursively
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !filePath.includes('node_modules')) {
            // Recursively scan subdirectories
            scanDirectory(filePath);
        } else if (stat.isFile() && file.endsWith('.html')) {
            // Process HTML files
            processFile(filePath);
        }
    });
}

// Start processing
console.log('Starting structured data integration...');
scanDirectory(rootDir);
console.log('Structured data integration complete!');