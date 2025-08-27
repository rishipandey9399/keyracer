# KeyRacer Backend (Clean Version)

This backend provides:
- User and challenge stats models
- Challenge result submission endpoint
- Leaderboard endpoint

## Endpoints
- POST `/api/coderacer-leaderboard/submit` — Submit challenge result
- GET `/api/coderacer-leaderboard` — Get leaderboard

## Setup
1. Install dependencies: `npm install`
2. Start server: `npm start`
3. MongoDB must be running at `mongodb://localhost:27017/keyracer` (or set `MONGO_URI`)
