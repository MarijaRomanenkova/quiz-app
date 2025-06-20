// Use the correct API URL based on the platform
export const API_URL = 'http://localhost:3000/api';

// For Expo web development with Docker
export const CONFIG = {
  API_URL: 'http://localhost:3000/api',  // This points to your Docker backend container
} as const; 
