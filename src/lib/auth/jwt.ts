import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from './types';

const TOKEN_KEY = 'auth_token';
/**
 * Parse and extract the payload from a JWT token
 * @param token The JWT token string
 * @returns The decoded payload or null if invalid
 */
export function getTokenPayload(token: string): JwtPayload | null {
  if (!token) return null;
  
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
}
/**
 * Check if a JWT token is expired
 * @param token The JWT token to check
 * @returns True if the token is expired or invalid, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  
  return payload.exp <= currentTime + 10;
}

/**
 * Get the stored token from localStorage
 * @returns The stored token or null if not found
 */
export function getStoredToken(): string | null {
  if (!browser) return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store a token in localStorage
 * @param token The JWT token to store
 */
export function setStoredToken(token: string): void {
  if (!browser) return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the token from localStorage
 */
export function removeStoredToken(): void {
  if (!browser) return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if a user has a specific role
 * @param roles User roles array
 * @param requiredRole The required role to check
 * @returns True if the user has the required role, false otherwise
 */
export function hasRole(roles: string[] | undefined, requiredRole: string): boolean {
  if (!roles || roles.length === 0) return false;
  return roles.includes(requiredRole);
}

/**
 * Check if a user has any of the specified roles
 * @param roles User roles array
 * @param requiredRoles Array of roles to check against
 * @returns True if the user has any of the required roles, false otherwise
 */
export function hasAnyRole(roles: string[] | undefined, requiredRoles: string[]): boolean {
  if (!roles || roles.length === 0) return false;
  return requiredRoles.some(role => roles.includes(role));
}