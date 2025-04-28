import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload, User } from './types';
import jwt from 'jsonwebtoken';
import type { User } from 'lucide-svelte';
import { env } from '$env/dynamic/public';

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

export function verifyToken(token: string) {
  const user = jwt.verify(token, env.PUBLIC_SECRET_TOKEN);
  return user;
}