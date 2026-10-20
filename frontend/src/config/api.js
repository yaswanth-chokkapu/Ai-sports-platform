/**
 * AthleteX Centralized API Configuration
 *
 * Resolves the backend base URL across environments:
 * - Local Development: uses VITE_API_URL if configured, otherwise http://localhost:8000
 * - Production: uses VITE_API_URL if configured, otherwise https://ai-sports-platform.onrender.com
 * Normalizes trailing slashes so constructed endpoint URLs remain valid.
 */

const DEFAULT_DEV_API_URL = "http://localhost:8000";
const DEFAULT_PROD_API_URL = "https://ai-sports-platform.onrender.com";

/**
 * Normalizes a URL string by trimming whitespace and removing trailing slashes.
 * @param {string} url
 * @returns {string}
 */
export function normalizeUrl(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

/**
 * Resolves the effective API base URL based on runtime environment and VITE_API_URL.
 * @returns {string}
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return normalizeUrl(envUrl);
  }

  // Development environment fallback
  if (import.meta.env.DEV) {
    return DEFAULT_DEV_API_URL;
  }

  // Production fallback to deployed Render backend
  return DEFAULT_PROD_API_URL;
}

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/`,
  SESSION: `${API_BASE_URL}/session`,
  COACH: `${API_BASE_URL}/coach`,
};

export default {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: API_ENDPOINTS,
};
