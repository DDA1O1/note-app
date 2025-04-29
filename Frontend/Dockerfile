# Frontend/Dockerfile

# ---- Build Stage ----
    FROM node:20-alpine AS build

    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy the rest of the application source code
    COPY . .
    
    # --- IMPORTANT: Handle Build-time Environment Variables ---
    # If VITE_API_BASE_URL is needed at build time:
    # 1. Declare the ARG
    ARG VITE_API_BASE_URL
    # 2. Set it as an environment variable for the build process
    ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
    
    # Build the React app for production
    RUN npm run build # This creates the static files in the 'dist' folder
    
    # ---- Production Stage ----
    FROM nginx:stable-alpine AS production
    
    # Copy the production build output from the 'build' stage
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Optional: Copy a custom Nginx configuration if needed
    # COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port 80 (Nginx default)
    EXPOSE 80
    
    # Default command to start Nginx
    CMD ["nginx", "-g", "daemon off;"]