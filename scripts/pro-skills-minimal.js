// Professional Skills Lab - Minimal Working Version
console.log('=== PRO SKILLS JS LOADING ===');

const skillTemplates = {
    resume: `ALEXANDRA CHEN
Senior Product Manager | Digital Innovation Specialist
Email: alexandra.chen@email.com | Phone: (555) 987-6543

PROFESSIONAL SUMMARY
Results-driven Product Manager with 5+ years of experience leading cross-functional teams to deliver innovative digital solutions. Proven track record of launching 12+ successful products.

CORE COMPETENCIES
• Product Strategy & Roadmap Development
• Cross-functional Team Leadership
• User Research & Market Analysis
• Agile/Scrum Methodologies & Sprint Planning

PROFESSIONAL EXPERIENCE
Senior Product Manager | TechVision Inc. | March 2021 - Present
• Led product development for AI-powered analytics platform serving 50,000+ users
• Increased user engagement by 67% through strategic feature prioritization

EDUCATION
Master of Business Administration (MBA) | Stanford Graduate School of Business | 2019
Bachelor of Science in Computer Science | UC Berkeley | 2017`,

    'cover-letter': `Dear Ms. Rodriguez,

I am writing to express my strong interest in the Senior UX Designer position at InnovateTech Solutions. With over four years of experience designing user-centered digital experiences, I am excited about the opportunity to contribute to your innovative design team.

In my current role as UX Designer at DigitalCraft Studios, I have:
• Led the complete redesign of a B2B SaaS platform
• Conducted comprehensive user research with 200+ participants
• Collaborated closely with product managers and engineering teams

I would welcome the opportunity to discuss how my design expertise can contribute to InnovateTech's continued success.

Best regards,
Sarah Chen`,

    email: `Subject: Q2 2025 Product Development Roadmap

Dear Product Development Team,

I hope this message finds you well. As we transition into the second quarter of 2025, I wanted to reach out regarding our upcoming strategic planning session.

MEETING DETAILS:
Date: Monday, June 23rd, 2025
Time: 2:00 PM - 4:30 PM PST
Location: Innovation Hub Conference Room

Looking forward to a productive planning session!

Best regards,
Jennifer Kim`,

    report: `QUARTERLY BUSINESS PERFORMANCE REPORT
Q1 2025 - TechFlow Solutions

EXECUTIVE SUMMARY
TechFlow Solutions achieved strong performance in Q1 2025, exceeding revenue targets by 12% and maintaining robust operational efficiency.

FINANCIAL PERFORMANCE
• Total Revenue: $2.4M (Target: $2.14M) - 12% above target
• Recurring Revenue: $1.8M (75% of total revenue)
• Year-over-Year Growth: 28% increase from Q1 2024

OPERATIONAL HIGHLIGHTS
• Successfully launched AI-powered analytics dashboard
• Customer Satisfaction Score: 8.7/10
• Customer Retention Rate: 94%

CONCLUSION
Q1 2025 demonstrated TechFlow Solutions' strong market position and operational excellence.`
};

console.log('skillTemplates object created successfully');
console.log('Available templates:', Object.keys(skillTemplates));

// Global variables
let currentTemplate = '';
let startTime = null;
let isTyping = false;

// DOM Elements
let skillSelect, templateArea, proInput, startBtn, resetBtn;

function loadTemplate() {
    console.log('loadTemplate called, selected:', skillSelect?.value);
    
    if (!skillSelect || !templateArea) {
        console.error('Required elements not found');
        return;
    }
    
    const skill = skillSelect.value;
    
    if (!skill) {
        templateArea.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">Select a document type to begin...</div>';
        currentTemplate = '';
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.textContent = 'Start Practice';
        }
        return;
    }
    
    if (skillTemplates[skill]) {
        currentTemplate = skillTemplates[skill];
        templateArea.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; line-height: 1.6;">${currentTemplate}</pre>`;
        
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = 'Start Practice';
        }
        console.log('Template loaded successfully:', skill);
    } else {
        templateArea.innerHTML = `<div style="padding: 20px; color: red;">Template "${skill}" not found</div>`;
        console.error('Template not found:', skill);
    }
}

function startPractice() {
    console.log('startPractice called');
    
    if (!currentTemplate || !proInput) {
        console.error('Cannot start practice - missing template or input');
        return;
    }
    
    // Enable input and focus
    proInput.disabled = false;
    proInput.value = '';
    proInput.focus();
    
    // Update button
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = 'Typing in progress...';
    }
    
    startTime = Date.now();
    isTyping = true;
    
    console.log('Practice started successfully');
}

function resetPractice() {
    console.log('resetPractice called');
    
    if (proInput) {
        proInput.disabled = true;
        proInput.value = '';
    }
    
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = 'Start Practice';
    }
    
    startTime = null;
    isTyping = false;
    
    console.log('Practice reset successfully');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM CONTENT LOADED ===');
    
    // Get DOM elements
    skillSelect = document.getElementById('pro-skill-select');
    templateArea = document.getElementById('template-area');
    proInput = document.getElementById('pro-input');
    startBtn = document.getElementById('start-pro-skill');
    resetBtn = document.getElementById('reset-practice');
    
    console.log('Elements found:', {
        skillSelect: !!skillSelect,
        templateArea: !!templateArea,
        proInput: !!proInput,
        startBtn: !!startBtn,
        resetBtn: !!resetBtn
    });
    
    // Add event listeners
    if (skillSelect) {
        skillSelect.addEventListener('change', function() {
            console.log('Dropdown changed to:', skillSelect.value);
            loadTemplate();
        });
        console.log('Dropdown event listener added');
    } else {
        console.error('skillSelect element not found!');
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('Start button clicked');
            startPractice();
        });
        console.log('Start button event listener added');
    } else {
        console.error('startBtn element not found!');
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked');
            resetPractice();
        });
        console.log('Reset button event listener added');
    } else {
        console.error('resetBtn element not found!');
    }
    
    // Initialize
    loadTemplate();
    
    console.log('=== INITIALIZATION COMPLETE ===');
});

console.log('=== PRO SKILLS JS LOADED ===');
