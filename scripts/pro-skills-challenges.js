// Professional Skills Challenges - Interactive Logic
// Populates challenge grids and handles challenge interactions

// Challenge data organized by difficulty levels
const challengeData = {
    beginner: [
        {
            id: 'bg-01',
            title: 'Basic Email Template',
            description: 'Type a simple professional email with proper formatting',
            duration: '3 min',
            wpmTarget: 25,
            difficulty: 'Beginner',
            category: 'Communication',
            icon: 'fas fa-envelope',
            preview: 'Subject: Meeting Request\n\nDear [Name],\n\nI hope this email finds you well...'
        },
        {
            id: 'bg-02',
            title: 'Contact Information',
            description: 'Practice typing personal and professional contact details',
            duration: '2 min',
            wpmTarget: 30,
            difficulty: 'Beginner',
            category: 'Data Entry',
            icon: 'fas fa-address-card',
            preview: 'Name: John Smith\nEmail: john.smith@company.com\nPhone: (555) 123-4567...'
        },
        {
            id: 'bg-03',
            title: 'Simple Meeting Notes',
            description: 'Type basic meeting minutes and action items',
            duration: '4 min',
            wpmTarget: 25,
            difficulty: 'Beginner',
            category: 'Documentation',
            icon: 'fas fa-clipboard',
            preview: 'Meeting Date: March 15, 2024\nAttendees: John, Sarah, Mike\nAgenda Items...'
        },
        {
            id: 'bg-04',
            title: 'Basic Letter Format',
            description: 'Practice formal letter structure and formatting',
            duration: '5 min',
            wpmTarget: 28,
            difficulty: 'Beginner',
            category: 'Correspondence',
            icon: 'fas fa-file-alt',
            preview: '[Date]\n\n[Recipient Name]\n[Address]\n\nDear [Title] [Last Name]...'
        },
        {
            id: 'bg-05',
            title: 'Product Description',
            description: 'Type clear and concise product descriptions',
            duration: '3 min',
            wpmTarget: 30,
            difficulty: 'Beginner',
            category: 'Marketing',
            icon: 'fas fa-shopping-bag',
            preview: 'Product: Wireless Bluetooth Headphones\nFeatures: Noise-cancelling, 20-hour battery...'
        },
        {
            id: 'bg-06',
            title: 'Schedule Template',
            description: 'Create and format a daily or weekly schedule',
            duration: '4 min',
            wpmTarget: 26,
            difficulty: 'Beginner',
            category: 'Organization',
            icon: 'fas fa-calendar',
            preview: 'Monday Schedule:\n9:00 AM - Team Meeting\n10:30 AM - Project Review...'
        }
    ],
    intermediate: [
        {
            id: 'int-01',
            title: 'Business Proposal',
            description: 'Draft a comprehensive business proposal with multiple sections',
            duration: '8 min',
            wpmTarget: 40,
            difficulty: 'Intermediate',
            category: 'Business Writing',
            icon: 'fas fa-briefcase',
            preview: 'BUSINESS PROPOSAL\n\nExecutive Summary\nWe propose to implement a new customer management system...'
        },
        {
            id: 'int-02',
            title: 'Technical Documentation',
            description: 'Write clear technical instructions and procedures',
            duration: '7 min',
            wpmTarget: 38,
            difficulty: 'Intermediate',
            category: 'Technical Writing',
            icon: 'fas fa-cogs',
            preview: 'System Installation Guide\n\nPrerequisites:\n- Windows 10 or later\n- 4GB RAM minimum...'
        },
        {
            id: 'int-03',
            title: 'Project Status Report',
            description: 'Compile detailed project updates and metrics',
            duration: '10 min',
            wpmTarget: 35,
            difficulty: 'Intermediate',
            category: 'Reporting',
            icon: 'fas fa-chart-line',
            preview: 'PROJECT STATUS REPORT\nProject: Website Redesign\nStatus: 75% Complete\nBudget: On Track...'
        },
        {
            id: 'int-04',
            title: 'Client Communication',
            description: 'Handle complex client correspondence and updates',
            duration: '6 min',
            wpmTarget: 42,
            difficulty: 'Intermediate',
            category: 'Client Relations',
            icon: 'fas fa-handshake',
            preview: 'Dear Mr. Johnson,\n\nThank you for your inquiry regarding our premium service package...'
        },
        {
            id: 'int-05',
            title: 'Training Manual Section',
            description: 'Create detailed training materials and guides',
            duration: '9 min',
            wpmTarget: 36,
            difficulty: 'Intermediate',
            category: 'Education',
            icon: 'fas fa-graduation-cap',
            preview: 'Chapter 3: Advanced Features\n\nIn this section, you will learn to configure advanced settings...'
        },
        {
            id: 'int-06',
            title: 'Marketing Campaign Brief',
            description: 'Develop comprehensive marketing strategy documents',
            duration: '8 min',
            wpmTarget: 40,
            difficulty: 'Intermediate',
            category: 'Marketing',
            icon: 'fas fa-bullhorn',
            preview: 'CAMPAIGN BRIEF: Summer Product Launch\n\nObjective: Increase brand awareness by 25%...'
        }
    ],
    advanced: [
        {
            id: 'adv-01',
            title: 'Legal Document Draft',
            description: 'Type complex legal agreements with precise formatting',
            duration: '12 min',
            wpmTarget: 50,
            difficulty: 'Advanced',
            category: 'Legal Writing',
            icon: 'fas fa-gavel',
            preview: 'SERVICE AGREEMENT\n\nThis Agreement is entered into on [Date] between [Party A] and [Party B]...'
        },
        {
            id: 'adv-02',
            title: 'Financial Analysis Report',
            description: 'Create detailed financial reports with data and analysis',
            duration: '15 min',
            wpmTarget: 45,
            difficulty: 'Advanced',
            category: 'Finance',
            icon: 'fas fa-calculator',
            preview: 'QUARTERLY FINANCIAL ANALYSIS\n\nRevenue Growth: 15.3% YoY\nOperating Margin: 22.8%...'
        },
        {
            id: 'adv-03',
            title: 'Research Paper Abstract',
            description: 'Write academic-style abstracts and research summaries',
            duration: '10 min',
            wpmTarget: 48,
            difficulty: 'Advanced',
            category: 'Academic Writing',
            icon: 'fas fa-microscope',
            preview: 'Abstract\n\nThis study examines the impact of machine learning algorithms on predictive analytics...'
        },
        {
            id: 'adv-04',
            title: 'Executive Presentation',
            description: 'Prepare executive-level presentations and talking points',
            duration: '11 min',
            wpmTarget: 46,
            difficulty: 'Advanced',
            category: 'Executive Communication',
            icon: 'fas fa-presentation',
            preview: 'EXECUTIVE BRIEFING\n\nQ4 Performance Overview\n\nKey Achievements:\n• Revenue exceeded targets by 12%...'
        },
        {
            id: 'adv-05',
            title: 'Policy Documentation',
            description: 'Draft comprehensive company policies and procedures',
            duration: '14 min',
            wpmTarget: 44,
            difficulty: 'Advanced',
            category: 'Policy Writing',
            icon: 'fas fa-shield-alt',
            preview: 'COMPANY POLICY: Remote Work Guidelines\n\nEffective Date: January 1, 2025\nScope: All Employees...'
        },
        {
            id: 'adv-06',
            title: 'Strategic Planning Document',
            description: 'Create long-term strategic plans and roadmaps',
            duration: '16 min',
            wpmTarget: 42,
            difficulty: 'Advanced',
            category: 'Strategy',
            icon: 'fas fa-chess',
            preview: 'STRATEGIC PLAN 2025-2027\n\nVision Statement\nTo become the industry leader in innovative solutions...'
        }
    ],
    expert: [
        {
            id: 'exp-01',
            title: 'Complex Contract Negotiation',
            description: 'Type intricate contract terms with legal precision',
            duration: '20 min',
            wpmTarget: 60,
            difficulty: 'Expert',
            category: 'Legal Excellence',
            icon: 'fas fa-balance-scale',
            preview: 'MASTER SERVICE AGREEMENT\n\nWHEREAS, the parties desire to establish terms for ongoing services...'
        },
        {
            id: 'exp-02',
            title: 'Technical Specification',
            description: 'Create detailed technical specifications and requirements',
            duration: '18 min',
            wpmTarget: 55,
            difficulty: 'Expert',
            category: 'Technical Excellence',
            icon: 'fas fa-microchip',
            preview: 'TECHNICAL SPECIFICATION DOCUMENT\n\nSystem Architecture Requirements\n\nDatabase Layer...'
        },
        {
            id: 'exp-03',
            title: 'Medical Report Transcription',
            description: 'Transcribe complex medical terminology and reports',
            duration: '15 min',
            wpmTarget: 58,
            difficulty: 'Expert',
            category: 'Medical Transcription',
            icon: 'fas fa-heartbeat',
            preview: 'PATIENT MEDICAL REPORT\n\nPatient ID: 12345\nDiagnosis: Hypertensive cardiovascular disease...'
        },
        {
            id: 'exp-04',
            title: 'Scientific Research Paper',
            description: 'Type complex scientific content with precise terminology',
            duration: '22 min',
            wpmTarget: 52,
            difficulty: 'Expert',
            category: 'Scientific Writing',
            icon: 'fas fa-atom',
            preview: 'RESEARCH ARTICLE\n\nQuantum Computing Applications in Cryptographic Security\n\nAbstract...'
        },
        {
            id: 'exp-05',
            title: 'International Business Contract',
            description: 'Handle multi-language and complex international agreements',
            duration: '25 min',
            wpmTarget: 50,
            difficulty: 'Expert',
            category: 'International Business',
            icon: 'fas fa-globe',
            preview: 'INTERNATIONAL DISTRIBUTION AGREEMENT\n\nParties: [Company A] (USA) and [Company B] (Germany)...'
        },
        {
            id: 'exp-06',
            title: 'Supreme Court Brief',
            description: 'Type Supreme Court level legal briefs with perfect accuracy',
            duration: '30 min',
            wpmTarget: 48,
            difficulty: 'Expert',
            category: 'Supreme Legal Writing',
            icon: 'fas fa-university',
            preview: 'BRIEF FOR PETITIONER\n\nIN THE SUPREME COURT OF THE UNITED STATES\n\nQUESTIONS PRESENTED...'
        }
    ]
};

// Color schemes for difficulty levels
const difficultyColors = {
    'Beginner': { primary: '#4CAF50', secondary: '#81C784', accent: '#2E7D32' },
    'Intermediate': { primary: '#FF9800', secondary: '#FFB74D', accent: '#F57C00' },
    'Advanced': { primary: '#F44336', secondary: '#E57373', accent: '#D32F2F' },
    'Expert': { primary: '#9C27B0', secondary: '#BA68C8', accent: '#7B1FA2' }
};

// Create challenge card HTML
function createChallengeCard(challenge) {
    const colors = difficultyColors[challenge.difficulty];
    
    return `
        <div class="challenge-card" data-challenge-id="${challenge.id}">
            <div class="challenge-header">
                <div class="challenge-icon" style="color: ${colors.primary};">
                    <i class="${challenge.icon}"></i>
                </div>
                <div class="challenge-meta">
                    <span class="challenge-difficulty" style="background: ${colors.primary};">${challenge.difficulty}</span>
                    <span class="challenge-category">${challenge.category}</span>
                </div>
            </div>
            
            <h3 class="challenge-title">${challenge.title}</h3>
            <p class="challenge-description">${challenge.description}</p>
            
            <div class="challenge-stats">
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>Duration: ${challenge.duration}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Target: ${challenge.wpmTarget} WPM</span>
                </div>
            </div>
            
            <div class="challenge-preview">
                <div class="preview-label">Preview:</div>
                <div class="preview-text">${challenge.preview}</div>
            </div>
            
            <div class="challenge-actions">
                <button class="btn-start-challenge" style="background: ${colors.primary}; border-color: ${colors.primary};" 
                        onclick="startChallenge('${challenge.id}')">
                    <i class="fas fa-play"></i> Start Challenge
                </button>
                <button class="btn-preview" onclick="previewChallenge('${challenge.id}')">
                    <i class="fas fa-eye"></i> Preview
                </button>
            </div>
        </div>
    `;
}

// Populate challenge grids
function populateChallengeGrids() {
    const grids = {
        'beginner-grid': challengeData.beginner,
        'intermediate-grid': challengeData.intermediate,
        'advanced-grid': challengeData.advanced,
        'expert-grid': challengeData.expert
    };

    Object.entries(grids).forEach(([gridId, challenges]) => {
        const gridElement = document.getElementById(gridId);
        if (gridElement) {
            gridElement.innerHTML = challenges.map(challenge => createChallengeCard(challenge)).join('');
            
            // Add animation delay to cards
            const cards = gridElement.querySelectorAll('.challenge-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }
    });
}

// Start a challenge
function startChallenge(challengeId) {
    // Find the challenge data
    const allChallenges = [
        ...challengeData.beginner,
        ...challengeData.intermediate,
        ...challengeData.advanced,
        ...challengeData.expert
    ];
    
    const challenge = allChallenges.find(c => c.id === challengeId);
    if (!challenge) {
        console.error('Challenge not found:', challengeId);
        return;
    }

    // Store challenge data for the typing interface
    localStorage.setItem('currentChallenge', JSON.stringify(challenge));
    
    // Redirect to typing interface (you can customize this URL)
    window.location.href = `typing-test.html?challenge=${challengeId}&mode=professional`;
}

// Preview a challenge
function previewChallenge(challengeId) {
    const allChallenges = [
        ...challengeData.beginner,
        ...challengeData.intermediate,
        ...challengeData.advanced,
        ...challengeData.expert
    ];
    
    const challenge = allChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'challenge-preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="${challenge.icon}"></i> ${challenge.title}</h2>
                <button class="modal-close" onclick="closePreviewModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="challenge-details">
                    <div class="detail-row">
                        <strong>Category:</strong> ${challenge.category}
                    </div>
                    <div class="detail-row">
                        <strong>Difficulty:</strong> ${challenge.difficulty}
                    </div>
                    <div class="detail-row">
                        <strong>Duration:</strong> ${challenge.duration}
                    </div>
                    <div class="detail-row">
                        <strong>WPM Target:</strong> ${challenge.wpmTarget}
                    </div>
                </div>
                <div class="challenge-content">
                    <h4>Content Preview:</h4>
                    <pre class="content-preview">${challenge.preview}</pre>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-start-challenge" onclick="startChallenge('${challenge.id}')">
                    <i class="fas fa-play"></i> Start Challenge
                </button>
                <button class="btn-cancel" onclick="closePreviewModal()">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Add modal styles
    if (!document.getElementById('modal-styles')) {
        addModalStyles();
    }
}

// Close preview modal
function closePreviewModal() {
    const modal = document.querySelector('.challenge-preview-modal');
    if (modal) {
        modal.remove();
    }
}

// Add modal styles
function addModalStyles() {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .challenge-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: var(--secondary-bg, #1a1a2e);
            border-radius: 12px;
            border: 1px solid var(--border-color, #2a2a3e);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color, #2a2a3e);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            color: var(--text-primary, #ffffff);
            font-size: 1.4rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary, #b8b8d4);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            color: var(--text-primary, #ffffff);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .challenge-details {
            margin-bottom: 20px;
        }
        
        .detail-row {
            margin-bottom: 8px;
            color: var(--text-secondary, #b8b8d4);
        }
        
        .detail-row strong {
            color: var(--text-primary, #ffffff);
        }
        
        .challenge-content h4 {
            color: var(--text-primary, #ffffff);
            margin-bottom: 10px;
        }
        
        .content-preview {
            background: var(--primary-bg, #0a0a0f);
            border: 1px solid var(--border-color, #2a2a3e);
            border-radius: 8px;
            padding: 15px;
            color: var(--text-secondary, #b8b8d4);
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid var(--border-color, #2a2a3e);
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .modal-footer button {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-start-challenge {
            background: var(--accent-color, #00c2ff);
            color: white;
        }
        
        .btn-start-challenge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 194, 255, 0.3);
        }
        
        .btn-cancel {
            background: transparent;
            color: var(--text-secondary, #b8b8d4);
            border: 1px solid var(--border-color, #2a2a3e);
        }
        
        .btn-cancel:hover {
            background: var(--border-color, #2a2a3e);
            color: var(--text-primary, #ffffff);
        }
    `;
    document.head.appendChild(style);
}

// Filter challenges by difficulty
function filterChallenges(difficulty) {
    const allSections = document.querySelectorAll('.challenge-section');
    
    if (difficulty === 'all') {
        allSections.forEach(section => section.style.display = 'block');
    } else {
        allSections.forEach(section => {
            const sectionId = section.querySelector('.challenges-grid').id;
            const shouldShow = sectionId.includes(difficulty.toLowerCase());
            section.style.display = shouldShow ? 'block' : 'none';
        });
    }
}

// Search challenges
function searchChallenges(query) {
    const allCards = document.querySelectorAll('.challenge-card');
    
    allCards.forEach(card => {
        const title = card.querySelector('.challenge-title').textContent.toLowerCase();
        const description = card.querySelector('.challenge-description').textContent.toLowerCase();
        const category = card.querySelector('.challenge-category').textContent.toLowerCase();
        
        const matches = title.includes(query.toLowerCase()) || 
                       description.includes(query.toLowerCase()) || 
                       category.includes(query.toLowerCase());
        
        card.style.display = matches ? 'block' : 'none';
    });
}

// Statistics tracking
function trackChallengeStart(challengeId) {
    const stats = JSON.parse(localStorage.getItem('challengeStats') || '{}');
    if (!stats[challengeId]) {
        stats[challengeId] = { attempts: 0, completed: 0, bestWpm: 0 };
    }
    stats[challengeId].attempts++;
    localStorage.setItem('challengeStats', JSON.stringify(stats));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    populateChallengeGrids();
    
    // Add event listeners for filter and search if they exist
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterChallenges(filter);
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    const searchInput = document.querySelector('#challenge-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchChallenges(e.target.value);
        });
    }
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all challenge cards for scroll animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.challenge-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 100);
});
