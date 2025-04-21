# Use the official Node.js image as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Use .env.development file during build
COPY src/environments/.env.development src/environments/.env.dev

# Build the app
RUN npm run build:dev

# Serve the build with an HTTP server
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000 for the NGINX server
EXPOSE 3000

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
