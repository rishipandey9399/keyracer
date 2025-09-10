// Debug script for participant issues
// Run this in the browser console on the organizer dashboard

function debugParticipants() {
    console.log('=== PARTICIPANT DEBUG REPORT ===');
    
    // 1. Show all localStorage keys
    const allKeys = Object.keys(localStorage);
    console.log('1. All localStorage keys:', allKeys);
    
    // 2. Show hackathon-related keys
    const hackathonKeys = allKeys.filter(k => k.includes('_hackathons'));
    const participantKeys = allKeys.filter(k => k.includes('_participants'));
    
    console.log('2. Hackathon keys:', hackathonKeys);
    console.log('3. Participant keys:', participantKeys);
    
    // 3. Show current organizer info
    const currentOrganizerId = localStorage.getItem('currentOrganizerId');
    const currentOrganizerCode = localStorage.getItem('currentOrganizerCode');
    
    console.log('4. Current organizer ID:', currentOrganizerId);
    console.log('5. Current organizer code:', currentOrganizerCode);
    
    // 4. Show all hackathons
    console.log('6. All hackathons:');
    hackathonKeys.forEach(key => {
        try {
            const hackathons = JSON.parse(localStorage.getItem(key));
            console.log(`   ${key}:`, hackathons);
        } catch (e) {
            console.log(`   ${key}: ERROR -`, e.message);
        }
    });
    
    // 5. Show all participants
    console.log('7. All participants:');
    participantKeys.forEach(key => {
        try {
            const participants = JSON.parse(localStorage.getItem(key));
            console.log(`   ${key}:`, participants);
        } catch (e) {
            console.log(`   ${key}: ERROR -`, e.message);
        }
    });
    
    // 6. Test participant lookup for current organizer
    if (currentOrganizerId) {
        console.log('8. Testing participant lookup for current organizer:');
        
        const hackathonsKey = `${currentOrganizerId}_hackathons`;
        const hackathons = JSON.parse(localStorage.getItem(hackathonsKey)) || [];
        const hackathonIds = hackathons.map(h => h.id);
        
        console.log('   Organizer hackathons:', hackathons);
        console.log('   Hackathon IDs:', hackathonIds);
        
        let allParticipants = [];
        participantKeys.forEach(key => {
            try {
                const participants = JSON.parse(localStorage.getItem(key));
                const relevantParticipants = participants.filter(p => hackathonIds.includes(p.hackathonId));
                if (relevantParticipants.length > 0) {
                    console.log(`   Found ${relevantParticipants.length} participants in ${key}:`, relevantParticipants);
                }
                allParticipants = allParticipants.concat(relevantParticipants);
            } catch (e) {
                console.log(`   Error reading ${key}:`, e.message);
            }
        });
        
        console.log('   Total relevant participants:', allParticipants);
    }
    
    console.log('=== END DEBUG REPORT ===');
    
    return {
        allKeys,
        hackathonKeys,
        participantKeys,
        currentOrganizerId,
        currentOrganizerCode
    };
}

// Function to create test data
function createTestData() {
    console.log('Creating test data...');
    
    // Create test organizer and hackathon
    const organizerId = 'ORG_TEST_' + Date.now();
    const hackathonId = 'HK_TEST_' + Date.now();
    const organizerCode = 'TEST' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const hackathon = {
        id: hackathonId,
        organizerCode: organizerCode,
        organizerId: organizerId,
        title: 'Test Hackathon',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        status: 'active',
        participants: []
    };
    
    // Store hackathon
    const hackathonsKey = `${organizerId}_hackathons`;
    localStorage.setItem(hackathonsKey, JSON.stringify([hackathon]));
    
    // Create test participant
    const participant = {
        id: 'PART_TEST_' + Date.now(),
        name: 'Test Participant',
        email: 'test@example.com',
        hackathonId: hackathonId,
        joinedAt: new Date().toISOString(),
        status: 'active',
        submissions: []
    };
    
    // Store participant
    const participantsKey = `${organizerId}_participants`;
    localStorage.setItem(participantsKey, JSON.stringify([participant]));
    
    // Set current organizer
    localStorage.setItem('currentOrganizerId', organizerId);
    localStorage.setItem('currentOrganizerCode', organizerCode);
    
    console.log('Test data created:');
    console.log('Organizer ID:', organizerId);
    console.log('Hackathon ID:', hackathonId);
    console.log('Organizer Code:', organizerCode);
    console.log('Participant:', participant);
    
    return { organizerId, hackathonId, organizerCode, participant };
}

// Function to clean test data
function cleanTestData() {
    const keys = Object.keys(localStorage);
    const testKeys = keys.filter(k => k.includes('TEST'));
    
    testKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log('Removed:', key);
    });
    
    console.log(`Cleaned ${testKeys.length} test keys`);
}

// Export functions to window for console access
if (typeof window !== 'undefined') {
    window.debugParticipants = debugParticipants;
    window.createTestData = createTestData;
    window.cleanTestData = cleanTestData;
}

console.log('Debug functions loaded. Use:');
console.log('- debugParticipants() to see current state');
console.log('- createTestData() to create test data');
console.log('- cleanTestData() to remove test data');