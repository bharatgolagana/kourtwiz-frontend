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

# Handle the secrets file
ARG SECRETS_FILE=secrets.env
COPY ${SECRETS_FILE} /tmp/secrets.env

# Fallback logic to ensure /tmp/secrets.env exists and is not empty
RUN [ -f /tmp/secrets.env ] || echo "" > /tmp/secrets.env

# Generate .env.prod and build the app
RUN grep -v '^#' /tmp/secrets.env > src/environments/.env.prod && npm run build:prod

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