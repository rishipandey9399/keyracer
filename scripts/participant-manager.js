// Participant Management System for Hackathon Platform

// Helper function to find hackathon across all organizers
function findHackathonAcrossOrganizers(hackathonId) {
    const allKeys = Object.keys(localStorage);
    console.log('Searching for hackathon ID:', hackathonId);
    console.log('Available keys:', allKeys.filter(k => k.includes('_hackathons')));
    
    for (const key of allKeys) {
        if (key.includes('_hackathons')) {
            try {
                const hackathons = JSON.parse(localStorage.getItem(key));
                console.log(`Checking hackathons in ${key}:`, hackathons.map(h => h.id));
                const hackathon = hackathons.find(h => h.id === hackathonId);
                if (hackathon) {
                    const organizerId = key.split('_hackathons')[0];
                    console.log('Found hackathon in organizer:', organizerId);
                    return { hackathon, organizerId };
                }
            } catch (e) {
                console.log('Error parsing hackathons from key:', key, e);
            }
        }
    }
    console.log('Hackathon not found:', hackathonId);
    return null;
}

// Function to register a new participant
function registerParticipant(participantName, hackathonId, email = '') {
    // Validate inputs
    if (!participantName || !hackathonId) {
        throw new Error('Participant name and hackathon ID are required');
    }
    
    // Check if hackathon exists across all organizers
    const hackathonData = findHackathonAcrossOrganizers(hackathonId);
    
    if (!hackathonData) {
        throw new Error('Invalid hackathon ID');
    }
    
    const { hackathon, organizerId } = hackathonData;
    
    // Generate unique participant ID
    const participantId = 'PART' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    // Create participant object
    const participant = {
        id: participantId,
        name: participantName.trim(),
        email: email.trim(),
        hackathonId: hackathonId,
        joinedAt: new Date().toISOString(),
        status: 'active',
        submissions: [],
        lastActivity: new Date().toISOString()
    };
    
    // Get existing participants for this organizer
    const participantsKey = `${organizerId}_participants`;
    const participants = JSON.parse(localStorage.getItem(participantsKey)) || [];
    
    console.log('Registering participant with key:', participantsKey);
    console.log('Organizer ID:', organizerId);
    console.log('Hackathon ID:', hackathonId);
    console.log('Participant name:', participantName);
    
    // Check if participant already exists for this hackathon
    const existingParticipant = participants.find(p => 
        p.name.toLowerCase() === participantName.toLowerCase().trim() && 
        p.hackathonId === hackathonId
    );
    
    if (existingParticipant) {
        // Update existing participant's last activity
        existingParticipant.lastActivity = new Date().toISOString();
        existingParticipant.status = 'active';
        localStorage.setItem(participantsKey, JSON.stringify(participants));
        console.log('Updated existing participant:', existingParticipant);
        return existingParticipant;
    }
    
    // Add new participant
    participants.push(participant);
    localStorage.setItem(participantsKey, JSON.stringify(participants));
    console.log('Added new participant:', participant);
    console.log('Total participants now:', participants.length);
    
    // Update hackathon participant count
    const hackathonsKey = `${organizerId}_hackathons`;
    const hackathons = JSON.parse(localStorage.getItem(hackathonsKey)) || [];
    const hackathonIndex = hackathons.findIndex(h => h.id === hackathonId);
    if (hackathonIndex !== -1) {
        hackathons[hackathonIndex].participantCount = (hackathons[hackathonIndex].participantCount || 0) + 1;
        localStorage.setItem(hackathonsKey, JSON.stringify(hackathons));
    }
    
    return participant;
}

// Function to update participant activity
function updateParticipantActivity(participantId) {
    // Find participant across all organizers
    const allKeys = Object.keys(localStorage);
    
    for (const key of allKeys) {
        if (key.includes('_participants')) {
            try {
                const participants = JSON.parse(localStorage.getItem(key));
                const participant = participants.find(p => p.id === participantId);
                
                if (participant) {
                    participant.lastActivity = new Date().toISOString();
                    localStorage.setItem(key, JSON.stringify(participants));
                    return;
                }
            } catch (e) {
                // Skip invalid entries
            }
        }
    }
}

// Function to add submission for participant
function addParticipantSubmission(participantId, submissionData) {
    // Find participant across all organizers
    const allKeys = Object.keys(localStorage);
    
    for (const key of allKeys) {
        if (key.includes('_participants')) {
            try {
                const participants = JSON.parse(localStorage.getItem(key));
                const participant = participants.find(p => p.id === participantId);
                
                if (participant) {
                    if (!participant.submissions) {
                        participant.submissions = [];
                    }
                    
                    const submission = {
                        id: 'SUB' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase(),
                        problemId: submissionData.problemId,
                        code: submissionData.code,
                        language: submissionData.language,
                        submittedAt: new Date().toISOString(),
                        status: 'pending'
                    };
                    
                    participant.submissions.push(submission);
                    participant.lastActivity = new Date().toISOString();
                    localStorage.setItem(key, JSON.stringify(participants));
                    
                    return submission;
                }
            } catch (e) {
                // Skip invalid entries
            }
        }
    }
    
    return null;
}

// Function to get participant by ID
function getParticipant(participantId) {
    // Find participant across all organizers
    const allKeys = Object.keys(localStorage);
    
    for (const key of allKeys) {
        if (key.includes('_participants')) {
            try {
                const participants = JSON.parse(localStorage.getItem(key));
                const participant = participants.find(p => p.id === participantId);
                if (participant) {
                    return participant;
                }
            } catch (e) {
                // Skip invalid entries
            }
        }
    }
    
    return null;
}

// Function to get all participants for a hackathon
function getHackathonParticipants(hackathonId) {
    // Find participants across all organizers for this hackathon
    const allKeys = Object.keys(localStorage);
    let allParticipants = [];
    
    for (const key of allKeys) {
        if (key.includes('_participants')) {
            try {
                const participants = JSON.parse(localStorage.getItem(key));
                const hackathonParticipants = participants.filter(p => p.hackathonId === hackathonId);
                allParticipants = allParticipants.concat(hackathonParticipants);
            } catch (e) {
                // Skip invalid entries
            }
        }
    }
    
    return allParticipants;
}

// Function to validate hackathon ID
function validateHackathonId(hackathonId) {
    const hackathonData = findHackathonAcrossOrganizers(hackathonId);
    return hackathonData ? hackathonData.hackathon : null;
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.ParticipantManager = {
        registerParticipant,
        updateParticipantActivity,
        addParticipantSubmission,
        getParticipant,
        getHackathonParticipants,
        validateHackathonId
    };
}