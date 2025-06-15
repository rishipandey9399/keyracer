// Very simple test of just the skillTemplates object
try {
    console.log('Testing skillTemplates object creation...');
    
    const skillTemplates = {
        resume: "Simple resume test",
        'cover-letter': "Simple cover letter test",
        email: "Simple email test",
        report: "Simple report test"
    };
    
    console.log('SUCCESS: skillTemplates object created');
    console.log('Available templates:', Object.keys(skillTemplates));
    
    // Test if we can access templates
    console.log('Resume template:', skillTemplates.resume);
    console.log('Cover letter template:', skillTemplates['cover-letter']);
    
} catch (error) {
    console.error('ERROR creating skillTemplates:', error);
}

// Test DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== SIMPLE TEST DOM READY ===');
    
    const skillSelect = document.getElementById('pro-skill-select');
    const startBtn = document.getElementById('start-pro-skill');
    
    console.log('Elements:', { skillSelect: !!skillSelect, startBtn: !!startBtn });
    
    if (skillSelect && startBtn) {
        console.log('SUCCESS: Both elements found');
        
        // Test simple event handlers
        skillSelect.addEventListener('change', function() {
            console.log('*** SIMPLE TEST: Dropdown changed to:', skillSelect.value);
            alert('Simple test: Dropdown changed to: ' + skillSelect.value);
        });
        
        startBtn.addEventListener('click', function() {
            console.log('*** SIMPLE TEST: Start button clicked');
            alert('Simple test: Start button clicked!');
        });
        
        console.log('SUCCESS: Event listeners added');
    } else {
        console.error('FAILED: Missing elements');
    }
});
