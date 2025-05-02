# Use Node.js as base image
FROM node:20-alpine

# Create app directory
WORKDIR /app/client

# Get npm dependencies
COPY package*.json ./

# Install npm dependencies including TailwindCSS
RUN npm install && \
    npm install -D tailwindcss postcss autoprefixer && \
    npx tailwindcss init -p

# Copy the rest of the application
COPY . .

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app/client

# Use the non-root user
USER appuser

EXPOSE 5173

CMD ["npm", "run", "dev"]