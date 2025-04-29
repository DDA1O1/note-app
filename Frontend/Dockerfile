# Frontend/Dockerfile

# Use an official Node.js runtime as a parent image (Alpine for smaller size)
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
# Use --legacy-peer-deps if you encounter peer dependency issues
RUN npm install #--legacy-peer-deps

# Copy the rest of the application code
# Note: We'll mount the source code using docker-compose for development,
# but copying ensures the image can potentially work standalone if needed.
COPY . .

# Vite's default port
EXPOSE 5173

# Command to run the Vite development server
# `--host` makes it accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]