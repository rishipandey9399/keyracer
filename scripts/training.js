/**
 * Training JavaScript - Complete Interactive Training System
 * Handles lesson modal functionality, progress tracking, and interactive typing practice
 */

// Training data structure
const trainingData = {
    beginner: {
        level: 'Beginner',
        description: 'Start your typing journey with basic grammar and vocabulary',
        lessons: [
            {
                id: 'articles',
                title: 'Articles (a, an, the)',
                difficulty: 'Easy',
                duration: '15 min',
                topics: ['Grammar', 'Basic'],
                content: {
                    explanation: `Articles are words that define and introduce nouns. There are three articles in English:

**Indefinite Articles: "a" and "an"**
- Use "a" before words that start with consonant sounds: a cat, a house, a university
- Use "an" before words that start with vowel sounds: an apple, an hour, an umbrella
- They refer to any one item, not a specific one

**Definite Article: "the"**
- Use "the" when referring to a specific item that both speaker and listener know about
- Use "the" with superlatives: the best, the largest
- Use "the" with unique things: the sun, the moon
- Use "the" when something has been mentioned before

**When NOT to use articles:**
- With plural nouns in general: Cats are animals (not "The cats are animals")
- With uncountable nouns in general: Water is essential (not "A water is essential")
- With proper nouns: John lives in Paris (not "The John lives in the Paris")`,
                    examples: [
                        'I saw a cat in the garden. (any cat, specific garden)',
                        'She is an excellent teacher. (any excellent teacher)',
                        'The book on the table is mine. (specific book)',
                        'A student asked an interesting question. (any student, any question)',
                        'The children played in a park near the school. (specific children, any park, specific school)',
                        'An hour passed before the meeting started. (any hour, specific meeting)',
                        'The president gave a speech. (specific president, any speech)',
                        'She bought an umbrella and a hat. (any umbrella, any hat)'
                    ],
                    practice: [
                        'The quick brown fox jumps over a lazy dog.',
                        'An apple a day keeps the doctor away.',
                        'She bought a new car from the dealership.',
                        'The students studied for an important exam.',
                        'A teacher explained the lesson to the class.',
                        'The weather forecast predicts a sunny day.',
                        'An elephant walked through the jungle.',
                        'The computer needs a software update.',
                        'A musician played the piano beautifully.',
                        'The library has an extensive book collection.',
                        'An honest person tells the truth.',
                        'The university offers a degree in engineering.',
                        'She found an old letter in the attic.',
                        'A European country joined the union.',
                        'The moon shines bright on a clear night.'
                    ]
                }
            },
            {
                id: 'pronouns',
                title: 'Personal Pronouns',
                difficulty: 'Easy',
                duration: '20 min',
                topics: ['Grammar', 'Pronouns'],
                content: {
                    explanation: `Personal pronouns replace nouns in sentences to avoid repetition and make speech more natural.

**Subject Pronouns (who does the action):**
- I, you, he, she, it, we, they
- Example: She sings beautifully. (She = the woman)

**Object Pronouns (who receives the action):**
- me, you, him, her, it, us, them  
- Example: John called me. (me receives the action of calling)

**Rules for using pronouns:**
- Use subject pronouns as the subject of a sentence
- Use object pronouns as the object of a verb or preposition
- "You" and "it" are the same in both subject and object forms
- Always capitalize "I" regardless of its position in the sentence

**Common mistakes to avoid:**
- Don't say "Me and John went" - say "John and I went"
- Don't say "between you and I" - say "between you and me"`,
                    examples: [
                        'She went to the store. (subject pronoun)',
                        'They are my friends. (subject pronoun)',
                        'I gave him the book. (subject + object pronouns)',
                        'We visited them yesterday. (subject + object pronouns)',
                        'It belongs to her. (subject + object pronouns)',
                        'You and I should work together. (correct usage)',
                        'The teacher gave us homework. (object pronoun)',
                        'They invited him and me to the party. (correct order)'
                    ],
                    practice: [
                        'I love to read books in my free time.',
                        'She told him about the meeting.',
                        'They visited us during the holidays.',
                        'We invited them to our party.',
                        'You should give it to her.',
                        'He helped me with my homework.',
                        'It belongs to them, not us.',
                        'She asked you to call her.',
                        'We saw him at the restaurant.',
                        'They brought it for me.',
                        'You and I make a great team.',
                        'The manager spoke to us about the project.',
                        'She gave them the instructions.',
                        'It reminds me of my childhood.',
                        'We should help him with his work.'
                    ]
                }
            },
            {
                id: 'present-tense',
                title: 'Present Tense Verbs',
                difficulty: 'Easy',
                duration: '25 min',
                topics: ['Grammar', 'Verbs'],
                content: {
                    explanation: 'Present tense describes actions happening now or regularly. Simple present uses the base form of the verb.',
                    examples: [
                        'I work every day.',
                        'She sings beautifully.',
                        'They play soccer.',
                        'He reads books.',
                        'We study together.'
                    ],
                    practice: [
                        'She works at a hospital every day.',
                        'They play tennis on weekends.',
                        'I study English grammar regularly.',
                        'He writes emails to his clients.',
                        'We cook dinner together.',
                        'The dog runs in the park.',
                        'She teaches mathematics at school.',
                        'They watch movies on Friday nights.',
                        'I exercise in the morning.',
                        'The birds sing in the trees.'
                    ]
                }
            },
            {
                id: 'adjectives',
                title: 'Descriptive Adjectives',
                difficulty: 'Easy',
                duration: '18 min',
                topics: ['Grammar', 'Descriptive'],
                content: {
                    explanation: 'Adjectives describe or modify nouns. They tell us more about the qualities of people, places, or things.',
                    examples: [
                        'The beautiful flower bloomed.',
                        'She has long hair.',
                        'It was a difficult test.',
                        'The old man smiled.',
                        'They live in a small house.'
                    ],
                    practice: [
                        'The beautiful sunset painted the sky orange.',
                        'She wore a bright red dress.',
                        'The small puppy played with a big ball.',
                        'He lives in a modern apartment.',
                        'The delicious cake smelled wonderful.',
                        'She has curly brown hair.',
                        'The expensive car broke down.',
                        'They bought fresh vegetables.',
                        'The tall building cast a long shadow.',
                        'She read an interesting book.'
                    ]
                }
            },
            {
                id: 'questions',
                title: 'Asking Questions',
                difficulty: 'Easy',
                duration: '22 min',
                topics: ['Grammar', 'Questions'],
                content: {
                    explanation: 'Questions can start with question words (who, what, when, where, why, how) or be yes/no questions using do/does/did.',
                    examples: [
                        'What time is it?',
                        'Where do you live?',
                        'Do you like coffee?',
                        'How are you today?',
                        'When does the class start?'
                    ],
                    practice: [
                        'Where do you work every day?',
                        'What time does the meeting start?',
                        'How do you get to school?',
                        'Do you enjoy reading books?',
                        'When will you finish the project?',
                        'Why did she leave early?',
                        'Who is your favorite teacher?',
                        'Which restaurant do you prefer?',
                        'Can you help me with this?',
                        'What did you do yesterday?'
                    ]
                }
            },
            {
                id: 'numbers-time',
                title: 'Numbers and Time',
                difficulty: 'Easy',
                duration: '20 min',
                topics: ['Vocabulary', 'Numbers'],
                content: {
                    explanation: 'Learning to type numbers and time expressions accurately. This includes cardinal numbers, ordinal numbers, and time formats.',
                    examples: [
                        'It is 3:30 in the afternoon.',
                        'She was born on March 15th, 1995.',
                        'The meeting is at 9:00 AM.',
                        'I have 25 books on my shelf.',
                        'The class lasts for 90 minutes.'
                    ],
                    practice: [
                        'The meeting starts at 2:45 PM today.',
                        'She bought 12 apples for $8.50.',
                        'His birthday is on December 31st.',
                        'The flight arrives at 11:20 AM.',
                        'I need 250 pages printed by 5:00.',
                        'The temperature is 75 degrees.',
                        'She scored 98% on her test.',
                        'The project took 6 hours to complete.',
                        'We have 1,500 employees.',
                        'The event is on May 20th at 7:30.'
                    ]
                }
            }
        ]
    },
    intermediate: {
        level: 'Intermediate',
        description: 'Advance your skills with complex grammar and business vocabulary',
        lessons: [
            {
                id: 'perfect-tenses',
                title: 'Perfect Tenses',
                difficulty: 'Medium',
                duration: '30 min',
                topics: ['Grammar', 'Advanced'],
                content: {
                    explanation: 'Perfect tenses show completed actions. Present perfect: have/has + past participle. Past perfect: had + past participle.',
                    examples: [
                        'I have finished my homework.',
                        'She has visited Paris twice.',
                        'They had left before we arrived.',
                        'He has been working here for five years.',
                        'We had never seen such a beautiful sunset.'
                    ],
                    practice: [
                        'She has worked at this company for three years.',
                        'They have traveled to many countries together.',
                        'I had finished dinner before the movie started.',
                        'He has been studying English since childhood.',
                        'We have completed all the requirements.',
                        'She had already left when I called.',
                        'They have built a new shopping center.',
                        'I have never tasted such delicious food.',
                        'He had been waiting for two hours.',
                        'We have received your application.'
                    ]
                }
            },
            {
                id: 'conditionals',
                title: 'Conditional Sentences',
                difficulty: 'Medium',
                duration: '35 min',
                topics: ['Grammar', 'Complex'],
                content: {
                    explanation: 'Conditionals express possibilities and hypothetical situations. First conditional: if + present, will + base form.',
                    examples: [
                        'If it rains, we will stay inside.',
                        'She would travel if she had money.',
                        'If I were you, I would accept the offer.',
                        'We will succeed if we work hard.',
                        'If they had studied, they would have passed.'
                    ],
                    practice: [
                        'If you study hard, you will pass the exam.',
                        'She would buy a car if she had enough money.',
                        'If it rains tomorrow, we will cancel the picnic.',
                        'They would have come if you had invited them.',
                        'If I were the manager, I would change the policy.',
                        'We will finish on time if everyone helps.',
                        'If she had left earlier, she would have caught the train.',
                        'You would understand if you listened carefully.',
                        'If they win the game, they will advance to finals.',
                        'She would be happier if she lived closer to work.'
                    ]
                }
            },
            {
                id: 'passive-voice',
                title: 'Passive Voice',
                difficulty: 'Medium',
                duration: '28 min',
                topics: ['Grammar', 'Voice'],
                content: {
                    explanation: 'Passive voice emphasizes the action rather than the doer. Form: be + past participle. Use when the doer is unknown or unimportant.',
                    examples: [
                        'The letter was written by John.',
                        'The cake is being baked.',
                        'The project will be completed tomorrow.',
                        'The book has been published.',
                        'The meeting was cancelled.'
                    ],
                    practice: [
                        'The report was submitted by the deadline.',
                        'The new policy will be implemented next month.',
                        'The building has been renovated recently.',
                        'The presentation is being prepared by the team.',
                        'The contract was signed yesterday.',
                        'The software will be updated automatically.',
                        'The documents have been reviewed carefully.',
                        'The meeting room is being cleaned.',
                        'The proposal was accepted by the board.',
                        'The system will be maintained regularly.'
                    ]
                }
            },
            {
                id: 'business-vocabulary',
                title: 'Business Vocabulary',
                difficulty: 'Medium',
                duration: '32 min',
                topics: ['Vocabulary', 'Business'],
                content: {
                    explanation: 'Essential business terms and professional vocabulary for workplace communication and correspondence.',
                    examples: [
                        'Please find the quarterly revenue report attached.',
                        'We need to schedule a stakeholder meeting.',
                        'The project deadline has been extended.',
                        'Our team exceeded the sales targets.',
                        'The client approved the proposal.'
                    ],
                    practice: [
                        'The quarterly earnings report shows significant growth.',
                        'We need to schedule a meeting with stakeholders.',
                        'The project manager will coordinate the deliverables.',
                        'Our team exceeded the revenue targets this quarter.',
                        'The client feedback indicates high satisfaction.',
                        'Please review the budget allocation proposal.',
                        'The implementation timeline requires approval.',
                        'We achieved outstanding performance metrics.',
                        'The strategic partnership will enhance productivity.',
                        'The marketing campaign generated excellent results.'
                    ]
                }
            },
            {
                id: 'complex-sentences',
                title: 'Complex Sentences',
                difficulty: 'Medium',
                duration: '25 min',
                topics: ['Grammar', 'Structure'],
                content: {
                    explanation: 'Complex sentences contain independent and dependent clauses joined by subordinating conjunctions like because, although, since, while.',
                    examples: [
                        'Although it was raining, we went for a walk.',
                        'She succeeded because she worked hard.',
                        'While he was studying, his phone rang.',
                        'Since you are here, we can start the meeting.',
                        'Even though she was tired, she finished the work.'
                    ],
                    practice: [
                        'Although the weather was terrible, we enjoyed the trip.',
                        'She achieved success because she never gave up.',
                        'While the team was working, the manager arrived.',
                        'Since the project was urgent, we worked overtime.',
                        'Even though it was expensive, they bought the house.',
                        'Because of her dedication, she received a promotion.',
                        'While studying abroad, she learned three languages.',
                        'Although he was nervous, he gave an excellent presentation.',
                        'Since the deadline was approaching, we prioritized tasks.',
                        'Even though traffic was heavy, we arrived on time.'
                    ]
                }
            },
            {
                id: 'email-writing',
                title: 'Professional Email Writing',
                difficulty: 'Medium',
                duration: '40 min',
                topics: ['Writing', 'Professional'],
                content: {
                    explanation: 'Learn to write clear, professional emails with proper structure, tone, and etiquette for business communication.',
                    examples: [
                        'Dear Mr. Smith, I hope this email finds you well.',
                        'Thank you for your prompt response.',
                        'Please let me know if you need any additional information.',
                        'I look forward to hearing from you soon.',
                        'Best regards, Sarah Johnson'
                    ],
                    practice: [
                        'Dear Ms. Anderson, I am writing to follow up on our meeting.',
                        'Thank you for taking the time to review the proposal.',
                        'I would like to schedule a conference call next week.',
                        'Please find the requested documents attached to this email.',
                        'I apologize for any inconvenience this may have caused.',
                        'Could you please confirm your availability for Thursday?',
                        'We appreciate your continued partnership with our company.',
                        'I look forward to your feedback on the draft contract.',
                        'Please do not hesitate to contact me if you have questions.',
                        'Best regards, and thank you for your time.'
                    ]
                }
            }
        ]
    },
    advanced: {
        level: 'Advanced',
        description: 'Master professional writing and advanced grammar structures',
        lessons: [
            {
                id: 'advanced-punctuation',
                title: 'Advanced Punctuation',
                difficulty: 'Hard',
                duration: '35 min',
                topics: ['Grammar', 'Punctuation'],
                content: {
                    explanation: 'Master complex punctuation including semicolons, colons, dashes, parentheses, and quotation marks in professional writing.',
                    examples: [
                        'The meeting was productive; however, we need more time.',
                        'She had one goal: to excel in her career.',
                        'The report—which took weeks to complete—was excellent.',
                        'He said, "Success requires dedication and persistence."',
                        'The team includes: John (manager), Sarah (analyst), and Mike (developer).'
                    ],
                    practice: [
                        'The conference was informative; nonetheless, attendance was low.',
                        'Our objective is clear: deliver exceptional customer service.',
                        'The project—despite numerous challenges—was completed successfully.',
                        'She emphasized, "Quality should never be compromised for speed."',
                        'The agenda includes: budget review, staff updates, and strategic planning.',
                        'The presentation was comprehensive; furthermore, it was well-received.',
                        'There are three requirements: experience, skills, and dedication.',
                        'The CEO announced, "We will expand to international markets next year."',
                        'The deadline—originally set for Friday—has been moved to Monday.',
                        'The committee consists of: department heads, senior managers, and consultants.'
                    ]
                }
            },
            {
                id: 'technical-writing',
                title: 'Technical Writing',
                difficulty: 'Hard',
                duration: '45 min',
                topics: ['Writing', 'Technical'],
                content: {
                    explanation: 'Learn to write clear, precise technical documentation including procedures, specifications, and instructional content.',
                    examples: [
                        'To initialize the system, execute the startup sequence.',
                        'The algorithm processes data at 99.7% accuracy.',
                        'Configure the server parameters according to specifications.',
                        'The software requires minimum 8GB RAM and 2.5GHz processor.',
                        'Follow these steps to troubleshoot the connectivity issue.'
                    ],
                    practice: [
                        'The application programming interface supports RESTful web services.',
                        'Configure the database connection parameters in the settings file.',
                        'The system generates automated backup files every 24 hours.',
                        'Implement security protocols according to industry standards.',
                        'The software development lifecycle includes six distinct phases.',
                        'Execute the deployment script to update the production environment.',
                        'The user interface design follows responsive web development principles.',
                        'Optimize the search algorithm to improve query performance.',
                        'The cloud infrastructure scales automatically based on demand.',
                        'Document all code changes in the version control system.'
                    ]
                }
            },
            {
                id: 'academic-writing',
                title: 'Academic Writing',
                difficulty: 'Hard',
                duration: '40 min',
                topics: ['Writing', 'Academic'],
                content: {
                    explanation: 'Master formal academic writing style with proper citations, thesis statements, and scholarly language.',
                    examples: [
                        'According to Smith (2023), the research demonstrates significant correlation.',
                        'The hypothesis suggests that increased exposure results in improved outcomes.',
                        'Furthermore, the data indicates a substantial improvement in performance.',
                        'In conclusion, the evidence supports the proposed theoretical framework.',
                        'The methodology employed quantitative analysis of the collected data.'
                    ],
                    practice: [
                        'The research methodology employed both qualitative and quantitative approaches.',
                        'According to the literature review, previous studies indicate mixed results.',
                        'The hypothesis posits that environmental factors influence behavioral patterns.',
                        'Furthermore, the statistical analysis reveals significant correlations.',
                        'The theoretical framework provides a comprehensive understanding of the phenomenon.',
                        'In contrast, alternative perspectives suggest different interpretations.',
                        'The empirical evidence supports the validity of the proposed model.',
                        'Subsequently, the findings contribute to the existing body of knowledge.',
                        'The implications of this research extend beyond the immediate scope.',
                        'In conclusion, the study provides valuable insights for future research.'
                    ]
                }
            },
            {
                id: 'creative-writing',
                title: 'Creative Writing',
                difficulty: 'Hard',
                duration: '38 min',
                topics: ['Writing', 'Creative'],
                content: {
                    explanation: 'Develop creative writing skills with descriptive language, narrative techniques, and stylistic devices.',
                    examples: [
                        'The crimson sunset painted the horizon with ethereal beauty.',
                        'Her laughter echoed through the empty corridors like music.',
                        'Time seemed to stand still in that magical moment.',
                        'The ancient oak tree whispered secrets to the wind.',
                        'His words carried the weight of unspoken emotions.'
                    ],
                    practice: [
                        'The moonlight danced across the tranquil surface of the lake.',
                        'She discovered a hidden pathway leading to an enchanted garden.',
                        'The autumn leaves swirled in a magnificent tapestry of colors.',
                        'His voice resonated with the warmth of a thousand memories.',
                        'The city awakened slowly, stretching its concrete arms toward dawn.',
                        'Her eyes sparkled with the intensity of a thousand stars.',
                        'The old lighthouse stood sentinel against the raging storm.',
                        'Time flowed like honey through the lazy afternoon hours.',
                        'The cathedral bells sang their ancient song across the valley.',
                        'She wove stories from the threads of her imagination.'
                    ]
                }
            },
            {
                id: 'presentations',
                title: 'Presentation Writing',
                difficulty: 'Hard',
                duration: '42 min',
                topics: ['Writing', 'Presentations'],
                content: {
                    explanation: 'Create compelling presentation content with clear structure, persuasive language, and engaging delivery.',
                    examples: [
                        'Today, I will demonstrate how our solution addresses your challenges.',
                        'The key benefits include increased efficiency and reduced costs.',
                        'Let me share three compelling reasons why this approach works.',
                        'As you can see from the data, our performance exceeds expectations.',
                        'In summary, this investment will yield significant returns.'
                    ],
                    practice: [
                        'Good morning, and thank you for joining our presentation today.',
                        'The market research reveals unprecedented opportunities for growth.',
                        'Our innovative approach delivers measurable results within 90 days.',
                        'Let me walk you through the three phases of implementation.',
                        'The return on investment analysis shows compelling financial benefits.',
                        'Customer testimonials consistently highlight our exceptional service quality.',
                        'The competitive analysis demonstrates our distinct market advantages.',
                        'Implementation requires minimal disruption to existing operations.',
                        'Our track record includes successful projects across multiple industries.',
                        'Thank you for your attention, and I welcome your questions.'
                    ]
                }
            },
            {
                id: 'legal-documents',
                title: 'Legal Document Writing',
                difficulty: 'Hard',
                duration: '50 min',
                topics: ['Writing', 'Legal'],
                content: {
                    explanation: 'Learn precise legal writing with proper terminology, formal structure, and contractual language.',
                    examples: [
                        'The parties hereby agree to the terms and conditions set forth below.',
                        'This agreement shall be governed by the laws of the jurisdiction.',
                        'The aforementioned provisions are binding upon all parties involved.',
                        'In witness whereof, the parties have executed this agreement.',
                        'The contract may be terminated with thirty days written notice.'
                    ],
                    practice: [
                        'The parties hereby acknowledge and agree to the following terms.',
                        'This contract shall remain in effect for a period of twelve months.',
                        'The aforementioned obligations are subject to applicable law.',
                        'Each party represents and warrants that it has full authority.',
                        'The agreement may be amended only by written consent of both parties.',
                        'In the event of breach, the non-breaching party may seek remedies.',
                        'The confidentiality provisions shall survive termination of this agreement.',
                        'Force majeure events shall excuse performance under this contract.',
                        'The parties agree to submit disputes to binding arbitration.',
                        'This agreement constitutes the entire understanding between the parties.'
                    ]
                }
            }
        ]
    }
};

// Progress tracking
let trainingProgress = {
    completedLessons: [],
    currentStreak: 0,
    totalTime: 0,
    accuracy: 0,
    wpm: 0,
    achievements: []
};

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('keyracerTrainingProgress');
    if (saved) {
        trainingProgress = { ...trainingProgress, ...JSON.parse(saved) };
    }
    updateProgressDisplay();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('keyracerTrainingProgress', JSON.stringify(trainingProgress));
}

// Initialize training system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Training system initializing...');
    loadProgress();
    initializeEventListeners();
    setupLessonCards();
    updateProgressDisplay();
});

// Initialize event listeners
function initializeEventListeners() {
    // Lesson card click handlers
    document.querySelectorAll('.lesson-card').forEach(card => {
        card.addEventListener('click', function() {
            const lessonId = this.getAttribute('data-lesson');
            const level = this.getAttribute('data-level');
            openLessonModal(level, lessonId);
        });
    });

    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeLessonModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLessonModal();
        }
    });
}

// Setup lesson cards with progress indicators
function setupLessonCards() {
    document.querySelectorAll('.lesson-card').forEach(card => {
        const lessonId = card.getAttribute('data-lesson');
        const isCompleted = trainingProgress.completedLessons.includes(lessonId);
        
        if (isCompleted) {
            card.classList.add('completed');
            const completedBadge = document.createElement('div');
            completedBadge.className = 'completed-badge';
            completedBadge.innerHTML = '<i class="fas fa-check"></i>';
            card.appendChild(completedBadge);
        }
    });
}

// Open lesson modal
function openLessonModal(level, lessonId) {
    const lesson = trainingData[level].lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const modal = createLessonModal(lesson, level);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Initialize typing practice
    setTimeout(() => initializeTypingPractice(lesson), 100);
}

// Create lesson modal
function createLessonModal(lesson, level) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="lesson-modal">
            <div class="modal-header">
                <div class="lesson-info">
                    <h2 class="lesson-title">${lesson.title}</h2>
                    <div class="lesson-meta">
                        <span class="difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                        <span class="duration"><i class="fas fa-clock"></i> ${lesson.duration}</span>
                        <span class="level">${level.charAt(0).toUpperCase() + level.slice(1)}</span>
                    </div>
                </div>
                <button class="close-modal" onclick="closeLessonModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-content">
                <div class="lesson-tabs">
                    <button class="tab-btn active" data-tab="learn">Learn</button>
                    <button class="tab-btn" data-tab="practice">Practice</button>
                    <button class="tab-btn" data-tab="test">Test</button>
                </div>
                
                <div class="tab-content active" id="learn-tab">
                    <div class="explanation-section">
                        <h3>Grammar Rules and Explanation</h3>
                        <div class="explanation-content">
                            ${lesson.content.explanation.split('\n').map(line => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    return `<h4>${line.slice(2, -2)}</h4>`;
                                } else if (line.startsWith('- ')) {
                                    return `<li style="margin-left: 20px;">${line.slice(2)}</li>`;
                                } else if (line.trim() === '') {
                                    return '<br>';
                                } else {
                                    return `<p>${line}</p>`;
                                }
                            }).join('')}
                        </div>
                        
                        <h4>Examples with Explanations:</h4>
                        <ul class="examples-list">
                            ${lesson.content.examples.map(example => `<li>${example}</li>`).join('')}
                        </ul>
                        
                        <div class="topics-tags">
                            ${lesson.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background: rgba(0, 194, 255, 0.1); border-left: 4px solid var(--accent-color); border-radius: 5px;">
                            <p><strong>💡 Tip:</strong> After reading the explanation, move to the Practice tab to type sentences and improve your skills!</p>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="practice-tab">
                    <div class="practice-section">
                        <h3>Practice Typing</h3>
                        <div class="typing-stats">
                            <div class="stat">
                                <span class="stat-label">WPM</span>
                                <span class="stat-value" id="current-wpm">0</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Accuracy</span>
                                <span class="stat-value" id="current-accuracy">100%</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Time</span>
                                <span class="stat-value" id="practice-time">0:00</span>
                            </div>
                        </div>
                        
                        <div class="typing-area">
                            <div class="text-display" id="text-display">
                                Click "Start Practice" to begin
                            </div>
                            <textarea class="typing-input" id="typing-input" 
                                placeholder="Start typing here..." disabled></textarea>
                        </div>
                        
                        <div class="practice-controls">
                            <button class="btn primary" id="start-practice">Start Practice</button>
                            <button class="btn secondary" id="reset-practice">Reset</button>
                            <button class="btn success" id="next-sentence" style="display: none;">Next Sentence</button>
                        </div>
                        
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="lesson-progress"></div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="test-tab">
                    <div class="test-section">
                        <h3>Lesson Test</h3>
                        <p>Complete this typing test to finish the lesson and track your progress.</p>
                        
                        <div class="test-stats">
                            <div class="stat">
                                <span class="stat-label">Final WPM</span>
                                <span class="stat-value" id="final-wpm">-</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Final Accuracy</span>
                                <span class="stat-value" id="final-accuracy">-</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Grade</span>
                                <span class="stat-value" id="final-grade">-</span>
                            </div>
                        </div>
                        
                        <div class="test-area">
                            <div class="test-text" id="test-text">
                                Click "Start Test" to begin your final assessment
                            </div>
                            <textarea class="test-input" id="test-input" 
                                placeholder="Type the text above..." disabled></textarea>
                        </div>
                        
                        <div class="test-controls">
                            <button class="btn primary" id="start-test">Start Test</button>
                            <button class="btn secondary" id="reset-test">Reset Test</button>
                            <button class="btn success" id="complete-lesson" style="display: none;">Complete Lesson</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add tab switching functionality
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const tabContents = modal.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            modal.querySelector(`#${targetTab}-tab`).classList.add('active');
            
            // Initialize test functionality when test tab is clicked
            if (targetTab === 'test') {
                setTimeout(() => initializeTest(lesson), 100);
            }
        });
    });

    return modal;
}

// Close lesson modal
function closeLessonModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Initialize typing practice
function initializeTypingPractice(lesson) {
    let currentSentenceIndex = 0;
    let startTime = null;
    let isTyping = false;
    let practiceTimer = null;

    const textDisplay = document.getElementById('text-display');
    const typingInput = document.getElementById('typing-input');
    const startBtn = document.getElementById('start-practice');
    const resetBtn = document.getElementById('reset-practice');
    const nextBtn = document.getElementById('next-sentence');
    const progressBar = document.getElementById('lesson-progress');

    startBtn.addEventListener('click', startPractice);
    resetBtn.addEventListener('click', resetPractice);
    nextBtn.addEventListener('click', nextSentence);
    typingInput.addEventListener('input', handleTyping);

    function startPractice() {
        currentSentenceIndex = 0;
        showCurrentSentence();
        typingInput.disabled = false;
        typingInput.focus();
        startBtn.style.display = 'none';
        isTyping = true;
        startTime = Date.now();
        
        practiceTimer = setInterval(updateTimer, 100);
    }

    function resetPractice() {
        currentSentenceIndex = 0;
        isTyping = false;
        startTime = null;
        typingInput.value = '';
        typingInput.disabled = true;
        startBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        textDisplay.innerHTML = 'Click "Start Practice" to begin';
        
        if (practiceTimer) {
            clearInterval(practiceTimer);
            practiceTimer = null;
        }
        
        updateStats(0, 100, 0);
        updateProgress(0);
    }

    function nextSentence() {
        if (currentSentenceIndex < lesson.content.practice.length - 1) {
            currentSentenceIndex++;
            showCurrentSentence();
            typingInput.value = '';
            nextBtn.style.display = 'none';
        } else {
            // Practice completed
            completePractice();
        }
    }

    function showCurrentSentence() {
        const sentence = lesson.content.practice[currentSentenceIndex];
        textDisplay.innerHTML = sentence.split('').map(char => 
            `<span class="char">${char}</span>`
        ).join('');
        updateProgress((currentSentenceIndex / lesson.content.practice.length) * 100);
    }

    function handleTyping() {
        if (!isTyping) return;

        const typed = typingInput.value;
        const target = lesson.content.practice[currentSentenceIndex];
        const chars = textDisplay.querySelectorAll('.char');

        let correct = 0;
        let incorrect = 0;

        // Update character highlighting
        for (let i = 0; i < chars.length; i++) {
            if (i < typed.length) {
                if (typed[i] === target[i]) {
                    chars[i].className = 'char correct';
                    correct++;
                } else {
                    chars[i].className = 'char incorrect';
                    incorrect++;
                }
            } else if (i === typed.length) {
                chars[i].className = 'char current';
            } else {
                chars[i].className = 'char';
            }
        }

        // Calculate stats
        const accuracy = typed.length > 0 ? (correct / typed.length) * 100 : 100;
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        const wpm = timeElapsed > 0 ? (typed.length / 5) / timeElapsed : 0;

        updateStats(Math.round(wpm), Math.round(accuracy), Date.now() - startTime);

        // Check if sentence is completed
        if (typed === target) {
            nextBtn.style.display = 'block';
        }
    }

    function updateStats(wpm, accuracy, time) {
        document.getElementById('current-wpm').textContent = wpm;
        document.getElementById('current-accuracy').textContent = accuracy + '%';
        document.getElementById('practice-time').textContent = formatTime(time);
    }

    function updateTimer() {
        if (startTime && isTyping) {
            const elapsed = Date.now() - startTime;
            document.getElementById('practice-time').textContent = formatTime(elapsed);
        }
    }

    function updateProgress(percentage) {
        progressBar.style.width = percentage + '%';
    }

    function completePractice() {
        isTyping = false;
        if (practiceTimer) {
            clearInterval(practiceTimer);
        }
        
        // Switch to test tab
        document.querySelector('[data-tab="test"]').click();
        initializeTest(lesson);
    }
}

// Calculate grade based on WPM and accuracy
function calculateGrade(wpm, accuracy) {
    if (accuracy < 80) return 'F';
    if (accuracy < 90) return wpm > 40 ? 'C' : 'D';
    if (accuracy < 95) return wpm > 50 ? 'B' : 'C';
    return wpm > 60 ? 'A+' : wpm > 50 ? 'A' : 'B+';
}

// Complete lesson
function completeLesson(lesson) {
    if (!trainingProgress.completedLessons.includes(lesson.id)) {
        trainingProgress.completedLessons.push(lesson.id);
        trainingProgress.currentStreak++;
        
        // Check for achievements
        checkAchievements();
        
        saveProgress();
        updateProgressDisplay();
        
        // Update lesson card
        const lessonCard = document.querySelector(`[data-lesson="${lesson.id}"]`);
        if (lessonCard && !lessonCard.classList.contains('completed')) {
            lessonCard.classList.add('completed');
            const completedBadge = document.createElement('div');
            completedBadge.className = 'completed-badge';
            completedBadge.innerHTML = '<i class="fas fa-check"></i>';
            lessonCard.appendChild(completedBadge);
        }
        
        showAchievementToast(`Lesson completed: ${lesson.title}!`);
    }
    
    closeLessonModal();
}

// Check for achievements
function checkAchievements() {
    const achievements = [
        { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', condition: () => trainingProgress.completedLessons.length >= 1 },
        { id: 'streak_5', title: 'On Fire', description: 'Complete 5 lessons in a row', condition: () => trainingProgress.currentStreak >= 5 },
        { id: 'speed_demon', title: 'Speed Demon', description: 'Achieve 60+ WPM', condition: () => trainingProgress.wpm >= 60 },
        { id: 'perfectionist', title: 'Perfectionist', description: 'Achieve 98% accuracy', condition: () => trainingProgress.accuracy >= 98 },
        { id: 'beginner_master', title: 'Beginner Master', description: 'Complete all beginner lessons', condition: () => {
            const beginnerLessons = trainingData.beginner.lessons.map(l => l.id);
            return beginnerLessons.every(id => trainingProgress.completedLessons.includes(id));
        }},
        { id: 'intermediate_master', title: 'Intermediate Master', description: 'Complete all intermediate lessons', condition: () => {
            const intermediateLessons = trainingData.intermediate.lessons.map(l => l.id);
            return intermediateLessons.every(id => trainingProgress.completedLessons.includes(id));
        }},
        { id: 'advanced_master', title: 'Advanced Master', description: 'Complete all advanced lessons', condition: () => {
            const advancedLessons = trainingData.advanced.lessons.map(l => l.id);
            return advancedLessons.every(id => trainingProgress.completedLessons.includes(id));
        }},
        { id: 'grand_master', title: 'Grand Master', description: 'Complete all lessons', condition: () => {
            const allLessons = [
                ...trainingData.beginner.lessons.map(l => l.id),
                ...trainingData.intermediate.lessons.map(l => l.id),
                ...trainingData.advanced.lessons.map(l => l.id)
            ];
            return allLessons.every(id => trainingProgress.completedLessons.includes(id));
        }}
    ];

    achievements.forEach(achievement => {
        if (!trainingProgress.achievements.includes(achievement.id) && achievement.condition()) {
            trainingProgress.achievements.push(achievement.id);
            showAchievementToast(`Achievement Unlocked: ${achievement.title}!`);
        }
    });
}

// Show achievement toast
function showAchievementToast(message) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <i class="fas fa-trophy"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Update progress display
function updateProgressDisplay() {
    const totalLessons = Object.values(trainingData).reduce((sum, level) => sum + level.lessons.length, 0);
    const completedCount = trainingProgress.completedLessons.length;
    const progressPercentage = (completedCount / totalLessons) * 100;

    // Update progress stats
    const lessonsCompletedEl = document.getElementById('lessons-completed');
    const totalLessonsEl = document.getElementById('total-lessons');
    const currentWpmEl = document.getElementById('current-wpm');
    const currentAccuracyEl = document.getElementById('current-accuracy');
    const currentStreakEl = document.getElementById('current-streak');

    if (lessonsCompletedEl) lessonsCompletedEl.textContent = completedCount;
    if (totalLessonsEl) totalLessonsEl.textContent = totalLessons;
    if (currentWpmEl) currentWpmEl.textContent = Math.round(trainingProgress.wpm);
    if (currentAccuracyEl) currentAccuracyEl.textContent = Math.round(trainingProgress.accuracy) + '%';
    if (currentStreakEl) currentStreakEl.textContent = trainingProgress.currentStreak;

    // Update progress bar
    const progressBar = document.querySelector('.overall-progress');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }

    // Update level progress
    updateLevelProgress('beginner');
    updateLevelProgress('intermediate');
    updateLevelProgress('advanced');
}

// Update level progress
function updateLevelProgress(level) {
    const levelLessons = trainingData[level].lessons.map(l => l.id);
    const completedInLevel = levelLessons.filter(id => trainingProgress.completedLessons.includes(id)).length;
    const totalInLevel = levelLessons.length;
    const percentage = (completedInLevel / totalInLevel) * 100;

    const progressElement = document.querySelector(`#${level}-progress .progress-fill`);
    if (progressElement) {
        progressElement.style.width = percentage + '%';
    }

    const countElement = document.querySelector(`#${level}-count`);
    if (countElement) {
        countElement.textContent = `${completedInLevel}/${totalInLevel}`;
    }
}

// Format time helper
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Export functions for global access
window.openLessonModal = openLessonModal;
window.closeLessonModal = closeLessonModal;

/**
 * Start a lesson based on level and lesson number
 * @param {string} level - The difficulty level (beginner, intermediate, advanced)
 * @param {number} lessonNumber - The lesson number within that level
 */
function startLesson(level, lessonNumber) {
    console.log(`Starting lesson: ${level} level, lesson ${lessonNumber}`);
    
    // Get the lesson data
    if (!trainingData[level] || !trainingData[level].lessons[lessonNumber - 1]) {
        console.error(`Lesson not found: ${level} level, lesson ${lessonNumber}`);
        alert('Lesson not found. Please try again.');
        return;
    }
    
    const lesson = trainingData[level].lessons[lessonNumber - 1];
    
    // Open the lesson modal with the correct parameters (level, lessonId)
    openLessonModal(level, lesson.id);
}

// Export startLesson function for global access
window.startLesson = startLesson;