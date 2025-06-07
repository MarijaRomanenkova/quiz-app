FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Install Expo CLI globally
RUN npm install -g expo-cli

# Expose ports
EXPOSE 19000 19001 19002 8081

# Set environment variables for Metro bundler
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
ENV EXPO_PACKAGER_PROXY_URL=http://0.0.0.0:8081
ENV NODE_ENV=development
ENV EXPO_DEBUG=true

# Start the app
CMD ["npx", "expo", "start", "--host", "0.0.0.0"] 
