FROM node:18-alpine as build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Output folder will be /app/dist