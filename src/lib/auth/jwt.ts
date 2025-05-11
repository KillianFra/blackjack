import { browser } from '$app/environment';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from './types';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/public';

const TOKEN_KEY = 'auth_token';

export function getTokenPayload(token: string): JwtPayload | null {
	if (!token) return null;

	try {
		return jwtDecode<JwtPayload>(token);
	} catch (error) {
		console.error('Failed to parse JWT token:', error);
		return null;
	}
}

export function isTokenExpired(token: string): boolean {
	const payload = getTokenPayload(token);
	if (!payload || !payload.exp) return true;

	const currentTime = Math.floor(Date.now() / 1000);

	return payload.exp <= currentTime + 10;
}

export function getStoredToken(): string | null {
	if (!browser) return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
	if (!browser) return;
	localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
	if (!browser) return;
	localStorage.removeItem(TOKEN_KEY);
}

export function verifyToken(token: string) {
	const user = jwt.verify(token, env.PUBLIC_SECRET_TOKEN);
	return user;
}
