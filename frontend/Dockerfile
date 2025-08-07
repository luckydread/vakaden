# Stage 1: Build the frontend
FROM node:18-alpine AS build

WORKDIR /frontend

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend files from the previous stage
COPY --from=build /frontend/dist/ /usr/share/nginx/html

# Copy favicon.ico if it exists
COPY --from=build /frontend/public/favicon.ico /usr/share/nginx/html/favicon.ico

# Copy your custom nginx config if you have one
# COPY nginx/vakaden.com.conf /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
