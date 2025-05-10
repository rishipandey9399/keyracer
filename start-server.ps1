# This script starts the server with Google OAuth configuration

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path ".\server\node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    Set-Location -Path ".\server"
    npm install
    Set-Location -Path ".."
}

# Check if .env file exists, if not run the setup script
$serverEnvPath = Join-Path -Path ".\server" -ChildPath ".env"
$rootEnvPath = Join-Path -Path "." -ChildPath ".env"

$envExists = $false
$envPath = $null

if (Test-Path $serverEnvPath) {
    $envExists = $true
    $envPath = $serverEnvPath
    Write-Host "Found .env file in server directory." -ForegroundColor Green
} elseif (Test-Path $rootEnvPath) {
    $envExists = $true
    $envPath = $rootEnvPath
    Write-Host "Found .env file in root directory." -ForegroundColor Green
}

if (-not $envExists) {
    Write-Host "No .env file found. Running setup script..." -ForegroundColor Yellow
    node setup-google-auth.js
} else {
    # Check if Google OAuth credentials are properly configured
    $envContent = Get-Content -Path $envPath -Raw
    $hasClientId = $envContent -match "GOOGLE_CLIENT_ID=" -and $envContent -notmatch "GOOGLE_CLIENT_ID=your-google-client-id"
    $hasClientSecret = $envContent -match "GOOGLE_CLIENT_SECRET=" -and $envContent -notmatch "GOOGLE_CLIENT_SECRET=your-google-client-secret"
    
    if (-not $hasClientId -or -not $hasClientSecret) {
        Write-Host "Google OAuth credentials not properly configured in .env file." -ForegroundColor Yellow
        Write-Host "Running setup script..." -ForegroundColor Yellow
        node setup-google-auth.js
    } else {
        Write-Host "Google OAuth credentials properly configured." -ForegroundColor Green
    }
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Cyan
Set-Location -Path ".\server"
node server.js 