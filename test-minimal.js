// Test if the skillTemplates object can be parsed
console.log('Testing skillTemplates parsing...');

const skillTemplates = {
    resume: `ALEXANDRA CHEN
Senior Product Manager | Digital Innovation Specialist
Email: alexandra.chen@email.com | Phone: (555) 987-6543
LinkedIn: linkedin.com/in/alexandrachen | Portfolio: alexandrachen.dev`,
    
    'cover-letter': `Dear Ms. Rodriguez,

I am writing to express my strong interest in the Senior UX Designer position.`,
    
    email: `Subject: Q2 2025 Product Development Roadmap

Dear Product Development Team,

I hope this message finds you well.`
};

console.log('skillTemplates object created successfully');
console.log('Available templates:', Object.keys(skillTemplates));

// Test DOM ready event
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - test script');
    
    const skillSelect = document.getElementById('pro-skill-select');
    const startBtn = document.getElementById('start-pro-skill');
    
    console.log('Elements in test script:', {
        skillSelect: !!skillSelect,
        startBtn: !!startBtn
    });
    
    if (skillSelect) {
        skillSelect.addEventListener('change', () => {
            console.log('TEST SCRIPT: Dropdown changed to:', skillSelect.value);
            alert('TEST: Dropdown changed to: ' + skillSelect.value);
        });
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('TEST SCRIPT: Start button clicked');
            alert('TEST: Start button clicked!');
        });
    }
});
