# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the client and server
RUN npm run build

# Expose the port (Railway will map it)
EXPOSE 5000

# Start the server
CMD ["node", "dist/server/index.mjs"]
