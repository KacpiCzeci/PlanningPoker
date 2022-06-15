FROM node:lts-alpine3.10 as builder
RUN apk add g++ make py3-pip
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npm install