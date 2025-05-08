# Google OAuth Setup Guide

This guide will walk you through the process of setting up Google OAuth for your KeyRacer application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top of the page and then click "New Project".
3. Enter a name for your project (e.g., "KeyRacer Auth").
4. Click "Create".

## 2. Configure the OAuth Consent Screen

1. In your new project, navigate to "APIs & Services" > "OAuth consent screen" from the side menu.
2. Select "External" as the user type (unless you're using Google Workspace) and click "Create".
3. Fill in the required information:
   - App name: "KeyRacer"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue".
5. On the "Scopes" page, click "Add or Remove Scopes" and add the following scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. Click "Save and Continue".
7. You can add test users if you're still in testing mode, or leave it empty.
8. Click "Save and Continue" to complete the setup.

## 3. Create OAuth 2.0 Credentials

1. Still in "APIs & Services", navigate to "Credentials" from the side menu.
2. Click "Create Credentials" at the top of the page and select "OAuth client ID".
3. Select "Web application" as the application type.
4. Enter a name for the client ID (e.g., "KeyRacer Web Client").
5. Add the following to "Authorized JavaScript origins":
   - `https://keyracer.in` (your production domain)
   - `http://localhost:3000` (for local development)
6. Add the following to "Authorized redirect URIs":
   - `https://keyracer.in/api/auth/google/callback` (production callback)
   - `http://localhost:3000/api/auth/google/callback` (development callback)
7. Click "Create".
8. A popup will appear with your client ID and client secret. Save these credentials.

## 4. Set Up Environment Variables

1. Create a `.env` file in the server directory (or update your existing one).
2. Add the following environment variables:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
JWT_SECRET=a_random_secure_string_for_jwt_signing
```

For production on Netlify, you'll need to add these environment variables in your Netlify dashboard under "Site settings" > "Build & deploy" > "Environment variables".

## 5. Configure Netlify Redirects

1. Ensure you have a `netlify.toml` file in your project root with the following configuration:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-server-url.com/api/:splat"
  status = 200
  force = true
  
[[redirects]]
  from = "/api/auth/google/callback"
  to = "https://your-server-url.com/api/auth/google/callback"
  status = 200
  force = true
```

2. Replace `your-server-url.com` with your actual server's URL.

## 6. Verify the Setup

1. Start your server and frontend application.
2. Navigate to your app and click the "Sign in with Google" button.
3. You should be redirected to Google's consent screen.
4. After granting permission, you should be redirected back to your application and logged in.

## Troubleshooting

If you encounter issues:

1. Check that your redirect URIs exactly match what's in your Google OAuth settings.
2. Ensure environment variables are correctly set.
3. Check server logs for specific error messages.
4. Verify that your domain is correctly set up if in production.
5. If you're getting "invalid_request" errors, check that your request parameters are correctly formatted.

## Security Considerations

1. Always keep your client secret secure and never expose it in client-side code.
2. Use HTTPS for all OAuth redirects in production.
3. Implement proper CSRF protection for the OAuth flow.
4. Validate the JWT token on protected API routes.
5. Set appropriate cookie security options (httpOnly, secure, sameSite). 