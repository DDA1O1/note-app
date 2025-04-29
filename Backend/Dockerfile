# Backend/Dockerfile

# Use an official Node.js runtime as a parent image (Alpine for smaller size)
FROM node:20-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (as defined in server.js or .env)
EXPOSE 5000

# Define the command to run the app using nodemon for development
CMD ["npm", "run", "dev"]