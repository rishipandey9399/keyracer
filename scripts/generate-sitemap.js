/**
 * KeyRacer Sitemap Generator
 * 
 * This Node.js script generates a comprehensive sitemap.xml file
 * for better search engine indexing of the KeyRacer website.
 */

const fs = require('fs');
const path = require('path');

// Base URL of the website
const baseUrl = 'https://keyracer.in';

// Directory to scan for HTML files
const rootDir = path.resolve(__dirname, '..');

// Output file path
const outputFile = path.join(rootDir, 'sitemap.xml');

// Page priority configuration
const pagePriorities = {
    'index.html': 1.0,
    'typing-test.html': 0.9,
    'code-racer.html': 0.9,
    'challenges.html': 0.8,
    'pro-skills.html': 0.8,
    'leaderboard.html': 0.7,
    'about.html': 0.7,
    // Default priority for other pages
    'default': 0.5
};

// Change frequency configuration
const changeFrequencies = {
    'index.html': 'daily',
    'typing-test.html': 'weekly',
    'code-racer.html': 'weekly',
    'challenges.html': 'weekly',
    'leaderboard.html': 'daily',
    // Default change frequency for other pages
    'default': 'monthly'
};

// Function to get the relative URL from the file path
function getRelativeUrl(filePath) {
    return filePath.replace(rootDir, '').replace(/\\/g, '/').replace(/^\//, '');
}

// Function to get the priority for a page
function getPriority(relativeUrl) {
    return pagePriorities[relativeUrl] || pagePriorities['default'];
}

// Function to get the change frequency for a page
function getChangeFrequency(relativeUrl) {
    return changeFrequencies[relativeUrl] || changeFrequencies['default'];
}

// Function to get the last modification date
function getLastMod(filePath) {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Function to collect all HTML files
function collectHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && 
            !filePath.includes('node_modules') && 
            !filePath.includes('admin') && 
            !filePath.includes('private')) {
            // Recursively scan subdirectories
            collectHtmlFiles(filePath, fileList);
        } else if (stat.isFile() && file.endsWith('.html')) {
            // Add HTML files to the list
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to generate the sitemap XML content
function generateSitemapXml(htmlFiles) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    htmlFiles.forEach(filePath => {
        const relativeUrl = getRelativeUrl(filePath);
        const fullUrl = `${baseUrl}/${relativeUrl}`;
        const priority = getPriority(relativeUrl);
        const changeFreq = getChangeFrequency(relativeUrl);
        const lastMod = getLastMod(filePath);
        
        xml += '  <url>\n';
        xml += `    <loc>${fullUrl}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>${changeFreq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
}

// Main function to generate the sitemap
function generateSitemap() {
    console.log('Starting sitemap generation...');
    
    try {
        // Collect all HTML files
        const htmlFiles = collectHtmlFiles(rootDir);
        console.log(`Found ${htmlFiles.length} HTML files`);
        
        // Generate the sitemap XML
        const sitemapXml = generateSitemapXml(htmlFiles);
        
        // Write the sitemap to file
        fs.writeFileSync(outputFile, sitemapXml, 'utf8');
        console.log(`Sitemap generated successfully: ${outputFile}`);
    } catch (error) {
        console.error(`Error generating sitemap: ${error.message}`);
    }
}

// Run the sitemap generator
generateSitemap();