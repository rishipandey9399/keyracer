/**
 * Start Server with Google Auth
 * 
 * This script checks for Google OAuth credentials,
 * and starts the server with everything properly configured.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the server directory and server.js file
const serverDir = path.join(__dirname, 'server');
const serverFile = path.join(serverDir, 'server.js');
const serverEnvPath = path.join(serverDir, '.env');
const rootEnvPath = path.join(__dirname, '.env');

// Check if the environment is configured for Google OAuth
function checkEnvironment() {
  console.log('Checking environment configuration for Google OAuth...');
  
  // Look for .env file in server directory or root directory
  let envPath = null;
  if (fs.existsSync(serverEnvPath)) {
    envPath = serverEnvPath;
    console.log('Found .env file in server directory.');
  } else if (fs.existsSync(rootEnvPath)) {
    envPath = rootEnvPath;
    console.log('Found .env file in root directory.');
  }
  
  if (!envPath) {
    console.log('\n❌ No .env file found.');
    console.log('Running setup-google-auth.js first to configure Google OAuth...');
    
    // Run the Google OAuth setup script
    const setupProcess = spawn('node', ['setup-google-auth.js'], {
      stdio: 'inherit'
    });
    
    setupProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\nSetup completed. Checking environment again...');
        startServer();
      } else {
        console.error('\n❌ Setup failed. Please configure Google OAuth manually.');
        console.log('See README.md for instructions on setting up Google OAuth.');
      }
    });
    
    return false;
  }
  
  // Check if .env file contains Google OAuth credentials
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasClientId = envContent.includes('GOOGLE_CLIENT_ID=') && 
                     !envContent.includes('GOOGLE_CLIENT_ID=your-google-client-id');
  const hasClientSecret = envContent.includes('GOOGLE_CLIENT_SECRET=') && 
                         !envContent.includes('GOOGLE_CLIENT_SECRET=your-google-client-secret');
  
  if (!hasClientId || !hasClientSecret) {
    console.log('\n⚠️ Google OAuth credentials not properly configured in .env file.');
    console.log('Running setup-google-auth.js to configure Google OAuth...');
    
    // Run the Google OAuth setup script
    const setupProcess = spawn('node', ['setup-google-auth.js'], {
      stdio: 'inherit'
    });
    
    setupProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\nSetup completed. Checking environment again...');
        startServer();
      } else {
        console.error('\n❌ Setup failed. Please configure Google OAuth manually.');
        console.log('See README.md for instructions on setting up Google OAuth.');
      }
    });
    
    return false;
  }
  
  return true;
}

// Start the server
function startServer() {
  if (!checkEnvironment()) {
    return;
  }
  
  console.log('\n✅ Environment configured correctly.');
  console.log('Starting server...\n');
  
  // Start the Node.js server
  const serverProcess = spawn('node', ['server/server.js'], {
    stdio: 'inherit'
  });
  
  serverProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`\nServer process exited with code ${code}`);
    }
  });
  
  // Handle termination signals
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Shutting down server...');
    serverProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Shutting down server...');
    serverProcess.kill('SIGTERM');
  });
}

// Start the application
startServer(); 