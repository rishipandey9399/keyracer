444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444/**
 * KeyRacer SEO Metadata Application Script
 * 
 * This Node.js script applies the SEO metadata from seo-metadata.json
 * to all HTML files in the project to improve search engine visibility.
 */

const fs = require('fs');
const path = require('path');

// Directory to scan for HTML files
const rootDir = path.resolve(__dirname, '..');

// Load the SEO metadata
const seoMetadataPath = path.join(rootDir, 'seo-metadata.json');
const seoMetadata = JSON.parse(fs.readFileSync(seoMetadataPath, 'utf8'));

// Function to get page-specific metadata
function getPageMetadata(filePath) {
    const relativePath = '/' + path.relative(rootDir, filePath).replace(/\\/g, '/');
    
    // Find the matching page in the metadata
    for (const key in seoMetadata.pages) {
        if (seoMetadata.pages[key].path === relativePath) {
            return seoMetadata.pages[key];
        }
    }
    
    // Return global metadata if no specific page metadata is found
    return {
        title: seoMetadata.global.title,
        description: seoMetadata.global.description,
        keywords: seoMetadata.global.keywords
    };
}

// Function to generate meta tags
function generateMetaTags(pageMetadata) {
    const global = seoMetadata.global;
    const og = seoMetadata.openGraph;
    const twitter = seoMetadata.twitter;
    
    return `
    <!-- SEO Meta Tags -->
    <meta name="description" content="${pageMetadata.description}">
    <meta name="keywords" content="${pageMetadata.keywords}">
    <meta name="author" content="${global.author}">
    <meta name="robots" content="${global.robots}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${og.type}">
    <meta property="og:url" content="${seoMetadata.website.baseUrl}${pageMetadata.path}">
    <meta property="og:title" content="${pageMetadata.title}">
    <meta property="og:description" content="${pageMetadata.description}">
    <meta property="og:image" content="${og.image}">
    <meta property="og:image:width" content="${og.imageWidth}">
    <meta property="og:image:height" content="${og.imageHeight}">
    <meta property="og:image:alt" content="${og.imageAlt}">
    <meta property="og:site_name" content="${og.siteName}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="${twitter.card}">
    <meta property="twitter:url" content="${seoMetadata.website.baseUrl}${pageMetadata.path}">
    <meta property="twitter:title" content="${pageMetadata.title}">
    <meta property="twitter:description" content="${pageMetadata.description}">
    <meta property="twitter:image" content="${og.image}">
    <meta property="twitter:site" content="${twitter.site}">
    <meta property="twitter:creator" content="${twitter.creator}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${global.favicon}">
    <link rel="apple-touch-icon" href="${global.appleTouchIcon}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${seoMetadata.website.baseUrl}${pageMetadata.path}" />
    `;
}

// Function to update the meta tags in an HTML file
function updateMetaTags(filePath, content) {
    // Get page-specific metadata
    const pageMetadata = getPageMetadata(filePath);
    
    // Generate the meta tags
    const metaTags = generateMetaTags(pageMetadata);
    
    // Find the head section
    const headStartIndex = content.indexOf('<head>');
    const headEndIndex = content.indexOf('</head>');
    
    if (headStartIndex === -1 || headEndIndex === -1) {
        console.log(`  - No head section found in ${filePath}, skipping`);
        return content;
    }
    
    // Extract the head content
    const headContent = content.substring(headStartIndex + 6, headEndIndex);
    
    // Remove existing meta tags
    let newHeadContent = headContent;
    const metaTagsToRemove = [
        /<meta\s+name="description"[^>]*>/g,
        /<meta\s+name="keywords"[^>]*>/g,
        /<meta\s+name="author"[^>]*>/g,
        /<meta\s+name="robots"[^>]*>/g,
        /<meta\s+property="og:[^"]*"[^>]*>/g,
        /<meta\s+property="twitter:[^"]*"[^>]*>/g,
        /<link\s+rel="canonical"[^>]*>/g,
        /<link\s+rel="icon"[^>]*>/g,
        /<link\s+rel="apple-touch-icon"[^>]*>/g
    ];
    
    metaTagsToRemove.forEach(regex => {
        newHeadContent = newHeadContent.replace(regex, '');
    });
    
    // Update the title if it exists
    const titleRegex = /<title>[^<]*<\/title>/;
    if (titleRegex.test(newHeadContent)) {
        newHeadContent = newHeadContent.replace(titleRegex, `<title>${pageMetadata.title}</title>`);
    } else {
        // Add title if it doesn't exist
        newHeadContent = `<title>${pageMetadata.title}</title>\n${newHeadContent}`;
    }
    
    // Add the new meta tags
    newHeadContent = `${newHeadContent}\n${metaTags}`;
    
    // Reconstruct the content
    return [
        content.substring(0, headStartIndex + 6),
        newHeadContent,
        content.substring(headEndIndex)
    ].join('');
}

// Function to process a file
function processFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    try {
        // Read the file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Update the meta tags
        const updatedContent = updateMetaTags(filePath, content);
        
        // Write the updated content back to the file
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log('  - Updated successfully');
        } else {
            console.log('  - No changes needed');
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
        
        if (stat.isDirectory() && 
            !filePath.includes('node_modules') && 
            !filePath.includes('admin') && 
            !filePath.includes('private')) {
            // Recursively scan subdirectories
            scanDirectory(filePath);
        } else if (stat.isFile() && file.endsWith('.html')) {
            // Process HTML files
            processFile(filePath);
        }
    });
}

// Start processing
console.log('Starting SEO metadata application...');
scanDirectory(rootDir);
console.log('SEO metadata application complete!');