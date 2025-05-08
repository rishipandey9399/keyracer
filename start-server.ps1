# This script starts the server

# Change to the server directory
Set-Location -Path ".\server"

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path ".\node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Start the server
Write-Host "Starting server..."
node server.js 