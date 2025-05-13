/**
 * Google OAuth Setup Helper
 * 
 * This script helps you set up your Google OAuth credentials.
 * It checks for a .env file and guides you through the necessary steps.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Check for .env file in server directory
const serverEnvPath = path.join(__dirname, 'server', '.env');
const rootEnvPath = path.join(__dirname, '.env');

console.log('=== Google OAuth Setup ===');
console.log('This script will help you set up Google OAuth for your typing test app.\n');

// Check if we can create .env files
const checkEnvFiles = () => {
    let envFileExists = false;
    
    if (fs.existsSync(serverEnvPath)) {
        console.log('Found .env file in server directory.');
        envFileExists = true;
    } else if (fs.existsSync(rootEnvPath)) {
        console.log('Found .env file in root directory.');
        envFileExists = true;
    }
    
    if (envFileExists) {
        console.log('\nYou already have an .env file. Would you like to recreate it?');
        rl.question('Enter y/n: ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                promptForCredentials();
            } else {
                console.log('\nKeeping existing .env file. Make sure it has the required Google OAuth credentials.');
                showManualInstructions();
                rl.close();
            }
        });
    } else {
        console.log('No .env file found. Let\'s create one.');
        promptForCredentials();
    }
};

// Prompt user for Google OAuth credentials
const promptForCredentials = () => {
    console.log('\n=== Google OAuth Credentials ===');
    console.log('You need to obtain these from the Google Cloud Console:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a new project or select an existing one');
    console.log('3. Navigate to "APIs & Services" > "Credentials"');
    console.log('4. Click "Create Credentials" and select "OAuth client ID"');
    console.log('5. Set up the OAuth consent screen if prompted');
    console.log('6. For "Application type" select "Web application"');
    console.log('7. Add authorized JavaScript origins (e.g., http://localhost:3000)');
    console.log('8. Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/google/callback)');
    console.log('9. Copy the Client ID and Client Secret\n');
    
    rl.question('Do you have your Google OAuth credentials? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            rl.question('\nEnter your Google Client ID: ', (clientId) => {
                rl.question('Enter your Google Client Secret: ', (clientSecret) => {
                    createEnvFile(clientId, clientSecret);
                });
            });
        } else {
            console.log('\nYou need to obtain Google OAuth credentials to use the Google Sign-In feature.');
            showManualInstructions();
            rl.close();
        }
    });
};

// Create .env file with provided credentials
const createEnvFile = (clientId, clientSecret) => {
    const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Google OAuth Credentials
GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
BASE_URL=http://localhost:3000

# Email Service (Brevo SMTP)
EMAIL_FROM=customerkeyracer@gmail.com
EMAIL_FROM_NAME=Key Racer
`;

    try {
        // Try to create .env file in server directory first
        fs.writeFileSync(serverEnvPath, envContent);
        console.log('\n.env file created successfully in server directory!');
    } catch (serverError) {
        try {
            // If server directory fails, try root directory
            fs.writeFileSync(rootEnvPath, envContent);
            console.log('\n.env file created successfully in root directory!');
        } catch (rootError) {
            console.error('\nError creating .env file:', rootError.message);
            console.log('\nYou will need to manually create a .env file with the following content:');
            console.log('\n' + envContent);
        }
    }
    
    console.log('\n=== Next Steps ===');
    console.log('1. Start your server using: node server/server.js');
    console.log('2. Access your app at: http://localhost:3000');
    console.log('\nYour Google Sign-In should now work correctly.\n');
    
    rl.close();
};

// Show manual setup instructions
const showManualInstructions = () => {
    console.log('\n=== Manual Setup Instructions ===');
    console.log('1. Create a .env file in your server directory');
    console.log('2. Add the following content (replace with your credentials):');
    console.log(`
# Server Configuration
PORT=3000
NODE_ENV=development

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BASE_URL=http://localhost:3000

# Email Service (Brevo SMTP)
EMAIL_FROM=customerkeyracer@gmail.com
EMAIL_FROM_NAME=Key Racer
`);
    console.log('3. Start your server using: node server/server.js');
    console.log('4. Access your app at: http://localhost:3000');
};

// Start the setup process
checkEnvFiles(); 