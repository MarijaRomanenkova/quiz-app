/**
 * @fileoverview Application configuration and constants
 * 
 * This module contains configuration settings for the mobile application,
 * including API endpoints and environment-specific settings. The configuration
 * is designed to work across different platforms (iOS, Android, Web) and
 * development environments.
 * 
 * The module exports both individual constants and a configuration object
 * for easy access to all settings in one place.
 * 
 * @module config
 */

/**
 * Base API URL for backend communication
 * 
 * Points to the local development server running on port 3000.
 * This URL is used for all API requests to the backend service.
 * 
 * @type {string}
 * @example
 * ```tsx
 * import { API_URL } from '../config';
 * 
 * fetch(`${API_URL}/auth/login`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(credentials)
 * });
 * ```
 */
export const API_URL = 'http://localhost:3000/api';

/**
 * Application configuration object
 * 
 * Contains all configuration settings in a single object for easy
 * access and management. The object is marked as const to prevent
 * accidental modifications.
 * 
 * @type {Object}
 * @property {string} API_URL - Base API URL for backend communication
 * 
 * @example
 * ```tsx
 * import { CONFIG } from '../config';
 * 
 * // Access API URL
 * const apiUrl = CONFIG.API_URL;
 * 
 * // Use in fetch requests
 * fetch(`${CONFIG.API_URL}/questions`, {
 *   method: 'GET',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * ```
 */
export const CONFIG = {
  API_URL: 'http://localhost:3000/api',  // This points to your Docker backend container
} as const; 
