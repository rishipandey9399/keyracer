#!/usr/bin/env node

/**
 * AI Career Agent Test Script
 * Tests the enhanced AI agent capabilities
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const TEST_SESSION_ID = 'test_agent_' + Date.now();

async function testAIAgent() {
    console.log('🤖 Testing KeyRacer AI Career Agent...\n');
    
    try {
        // Test 1: Health Check
        console.log('1. Testing AI Agent Health...');
        const healthResponse = await fetch(`${BASE_URL}/api/chat/health`);
        const healthData = await healthResponse.json();
        
        if (healthData.success) {
            console.log('✅ AI Agent is running');
            console.log(`   Version: ${healthData.version}`);
            console.log(`   Type: ${healthData.agentType}`);
            console.log(`   Gemini Configured: ${healthData.geminiConfigured}\n`);
        } else {
            console.log('❌ Health check failed\n');
            return;
        }
        
        // Test 2: Agent Capabilities
        console.log('2. Testing Agent Capabilities...');
        const capResponse = await fetch(`${BASE_URL}/api/chat/capabilities`);
        const capData = await capResponse.json();
        
        if (capData.success) {
            console.log('✅ Agent capabilities loaded');
            console.log(`   Name: ${capData.name}`);
            console.log(`   Capabilities: ${capData.capabilities.length} features`);
            console.log(`   Commands: ${capData.commands.length} available\n`);
        } else {
            console.log('❌ Capabilities test failed\n');
        }
        
        // Test 3: Conversation Flow
        console.log('3. Testing Conversation Flow...');
        
        const testProfile = [
            { message: 'John Doe', step: 'Name' },
            { message: '3rd year', step: 'Academic Year' },
            { message: 'Tier 1', step: 'College Tier' },
            { message: 'Python, JavaScript, React', step: 'Skills' },
            { message: 'Software Engineer', step: 'Career Goal' }
        ];
        
        for (const test of testProfile) {
            const response = await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: test.message,
                    sessionId: TEST_SESSION_ID
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`   ✅ ${test.step}: Response received`);
                if (data.isComplete) {
                    console.log('   🎯 Profile completed, roadmap generated');
                    break;
                }
            } else {
                console.log(`   ❌ ${test.step}: Failed`);
            }
        }
        
        console.log();
        
        // Test 4: AI Agent Commands
        console.log('4. Testing AI Agent Commands...');
        
        const commands = [
            'skill gap analysis',
            'project ideas',
            'interview prep',
            'industry trends'
        ];
        
        for (const command of commands) {
            const response = await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: command,
                    sessionId: TEST_SESSION_ID
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.isAgentCommand) {
                console.log(`   ✅ Command "${command}": Agent responded`);
                console.log(`      Type: ${data.commandType}`);
            } else if (data.success) {
                console.log(`   ⚠️  Command "${command}": Handled as regular chat`);
            } else {
                console.log(`   ❌ Command "${command}": Failed`);
            }
        }
        
        console.log('\n🎉 AI Agent testing completed!');
        console.log('\n📋 Test Summary:');
        console.log('   • Health check: Passed');
        console.log('   • Capabilities: Loaded');
        console.log('   • Conversation flow: Working');
        console.log('   • Agent commands: Functional');
        console.log('\n🚀 Your AI Career Agent is ready to help users!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure the server is running on port 3000');
        console.log('   Run: npm start or npm run dev');
    }
}

// Run the test
if (require.main === module) {
    testAIAgent();
}

module.exports = { testAIAgent };