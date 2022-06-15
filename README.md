# PlanningPoker
A planning poker game for TSD labs

Kacper Trzeciak 141330,
Jan Todek 141326,
Maciej Ziobrowski 140340,
Bartłomiej Mumot 141287

#Technology & tools

#Technology
Frontend: React.js
Backend: Nest JS
Host: Firebase
Deploy: GoogleCloud

#Tools
Visual Studio Code
Docker
Firebase
Node
npm
Nx
Jest
Nest JS

# Start up
## Installation
`npm i`
## Frontend
`npx nx run client:serve`
## Backend
`npx nx run backend:serve`
## Tests
`npx nx run client:test`
## Docker
`docker build . -t my-base-image:nx-base`
`docker-compose up`
## Deploy backend
  `npx nx run build backend`
  `gcloud app deploy ./dist/apps/backend --appyaml=./apps/backend/app.yaml`
## Deploy frontend
  `NX_BE_URL=https://planning-poker-347212.lm.r.appspot.com/ npx nx run build client`
  `firebase deploy`

# Availability
## Backend
https://planning-poker-347212.lm.r.appspot.com/api

##Frontend
https://planning-poker-tsd.web.app
