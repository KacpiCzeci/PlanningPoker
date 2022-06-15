# PlanningPoker

A planning poker game for TSD labs

Frontend: React.js

Backend: Nest JS

DataBase: Firestore

## Deploy: GoogleCloud

Questions to answer:

- what are the tools needed to develop the application
- how to configure the project on a developer's machine (database, webserver, etc.)
- how to run tests
- how to deploy the application to production

## deploy backend
  `npx nx run build backend`
  `gcloud app deploy ./dist/apps/backend --appyaml=./apps/backend/app.yaml`
## deploy frontend
  `NX_BE_URL=https://planning-poker-347212.lm.r.appspot.com/ npx nx run build client`
  `firebase deploy`

- main page which would display the name of the project and the team members

# Start up

## Installation

`npm i`

## Frontend

`npx nx run client:serve`

## Backend

`npx nx run backend:serve`
