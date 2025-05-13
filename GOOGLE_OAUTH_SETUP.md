# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the typing test application, enabling users to sign in with their Google accounts.

## Implementation Options

This application supports two methods for Google Sign-In:

1. **Google Identity Services (Recommended)** - Uses Google's latest Sign-In API
2. **Traditional OAuth 2.0 Flow** - Uses the server-side OAuth flow

The Google Identity Services method is already configured in the login page and is the recommended approach.

## Prerequisites

1. Node.js installed on your machine
2. A Google account
3. Access to the [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top and click "New Project"
3. Enter a name for your project and click "Create"
4. Wait for the project to be created and then select it

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you're using Google Workspace)
3. Click "Create"
4. Fill in the required fields:
   - App name: "Typing Test App" (or your preferred name)
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Under "Scopes", click "Add or Remove Scopes"
7. Add the following scopes:
   - `userinfo.email`
   - `userinfo.profile`
8. Click "Save and Continue"
9. Under "Test users", you can add your email to test the application
10. Click "Save and Continue"
11. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth 2.0 Client ID

1. In the left sidebar, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name for your client, e.g., "Typing Test Web Client"
5. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000`
   - `http://localhost` (if you're running without a specific port)
6. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/google/callback` (for traditional OAuth flow)
7. Click "Create"
8. A popup will show your client ID and client secret. **Copy these values** - you'll need them for configuration

## Step 4: Configure the Application

### Option 1: Using Google Identity Services (Client-Side Only)

1. The client ID `909422121907-7mpe98sc0rke9l2msklgi69s9fpdvcc5.apps.googleusercontent.com` is already configured in the login page.
2. If you want to use your own client ID, update it in the following files:
   - `client/pages/login.html` - Update the `data-client_id` attribute and the `window.googleSignIn.init()` call
   - No server-side configuration is required for this method

### Option 2: Using Traditional OAuth Flow (Server + Client)

1. Run the setup script from the project root:
   ```
   node setup-google-auth.js
   ```
2. Follow the prompts and enter your Google client ID and client secret when asked
3. The script will create a `.env` file with the proper configuration

### Manual Configuration

1. Create a `.env` file in the `server` directory with the following content:
   ```
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
   ```
2. Replace `your-google-client-id` and `your-google-client-secret` with the values you copied from the Google Cloud Console

## Step 5: Start the Server

1. Start the server with the enhanced start script:
   ```
   node start-with-google-auth.js
   ```
   
   Or using PowerShell:
   ```
   .\start-server.ps1
   ```

2. The script will check if your Google OAuth credentials are properly configured and start the server

## Step 6: Test Google Sign-In

1. Open your browser and navigate to `http://localhost:3000/client/pages/login.html`
2. Click the "Sign in with Google" button
3. You should see the Google Sign-In popup
4. After authentication, you'll be redirected to the application
5. You can view your profile at `http://localhost:3000/client/pages/profile.html`

## How It Works

### Google Identity Services (Client-Side)

1. The Google Identity Services library is loaded from `https://accounts.google.com/gsi/client`
2. When the user clicks the Sign-In button, Google displays a popup for authentication
3. After successful authentication, Google returns an ID token
4. The application verifies and decodes this token client-side
5. User information is stored in localStorage and used throughout the app

### Traditional OAuth Flow (Server-Side)

1. The user is redirected to Google's authorization page
2. After granting permission, Google redirects back to our callback URL with an authorization code
3. The server exchanges this code for access and ID tokens
4. The server verifies the tokens and creates a session for the user
5. A session cookie is set in the user's browser for authentication

## Troubleshooting

If you encounter any issues:

1. **Google Sign-In Button Not Working**:
   - Check the browser console for errors
   - Ensure your client ID is correctly set in the login page
   - Verify the authorized JavaScript origins in Google Cloud Console

2. **"Not a valid origin" Error**:
   - Make sure your domain (e.g., `http://localhost:3000`) is added to the authorized JavaScript origins in Google Cloud Console

3. **"popup_closed_by_user" Error**:
   - This happens when the user closes the Google Sign-In popup
   - No action needed, just inform the user to complete the sign-in process

4. **Server Starting Issues**:
   - Check that all dependencies are installed with `npm install` in the server directory
   - Ensure the server port (3000) is not in use by another application

## Production Deployment

For production deployment, you'll need to:

1. Update the authorized JavaScript origins and redirect URIs in Google Cloud Console to include your production domain
2. Update the client ID in the login page if you're using your own
3. Set `NODE_ENV=production` in your `.env` file if using the server-side flow

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Setting up OAuth 2.0 in Google Cloud Console](https://support.google.com/cloud/answer/6158849) 