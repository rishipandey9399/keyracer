/**
 * KeyRacer Structured Data Loader
 * 
 * This script dynamically loads the structured data from structured-data.json
 * and injects it into the head of each page to improve SEO and search engine representation.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fetch the structured data JSON file
    fetch('/structured-data.json')
        .then(response => response.json())
        .then(data => {
            // Create a script element for the structured data
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            
            // Append it to the head section
            document.head.appendChild(script);
            
            console.log('KeyRacer structured data loaded successfully');
        })
        .catch(error => {
            console.error('Error loading KeyRacer structured data:', error);
        });
});