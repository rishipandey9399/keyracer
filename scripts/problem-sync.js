// Problem Synchronization - Makes problems visible to participants
class ProblemSync {
    constructor() {
        this.init();
    }

    init() {
        // Listen for storage changes to sync problems across tabs
        window.addEventListener('storage', (event) => {
            if (event.key === 'problems') {
                this.handleProblemsUpdate();
            }
        });

        // Broadcast problems to participants
        this.broadcastProblems();
    }

    // Broadcast problems to all participants
    broadcastProblems() {
        const problems = JSON.parse(localStorage.getItem('problems')) || [];
        const hackathons = JSON.parse(localStorage.getItem('hackathons')) || [];
        
        // Create participant-visible problems data
        const participantProblems = problems.map(problem => {
            const hackathon = hackathons.find(h => h.id === problem.hackathonId);
            return {
                id: problem.id,
                title: problem.title,
                difficulty: problem.difficulty,
                category: problem.category,
                hackathonId: problem.hackathonId,
                hackathonName: hackathon ? hackathon.title : 'Unknown',
                description: problem.description,
                constraints: problem.constraints,
                timeLimit: problem.timeLimit,
                memoryLimit: problem.memoryLimit,
                sampleInput: problem.sampleInput,
                sampleOutput: problem.sampleOutput,
                status: problem.status
            };
        });

        // Store for participants to access
        localStorage.setItem('participantProblems', JSON.stringify(participantProblems));
        
        // Trigger custom event for real-time updates
        window.dispatchEvent(new CustomEvent('problemsUpdated', {
            detail: participantProblems
        }));
    }

    handleProblemsUpdate() {
        console.log('[ProblemSync] Problems updated, broadcasting to participants...');
        this.broadcastProblems();
    }

    // Get problems for a specific hackathon (for participants)
    static getProblemsForHackathon(hackathonId) {
        const participantProblems = JSON.parse(localStorage.getItem('participantProblems')) || [];
        return participantProblems.filter(problem => problem.hackathonId === hackathonId);
    }

    // Get all available problems (for participants)
    static getAllProblems() {
        return JSON.parse(localStorage.getItem('participantProblems')) || [];
    }
}

// Initialize problem sync
if (typeof window !== 'undefined') {
    window.problemSync = new ProblemSync();
}

// Global function to trigger problem updates
window.triggerProblemUpdate = function() {
    if (window.problemSync) {
        window.problemSync.broadcastProblems();
    }
};