import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '$lib/auth/types';
import { env } from '$env/dynamic/public';
import prisma from '$lib/prisma';
import { createApiError, ErrorCodes } from '$lib/utils/error-handler';

export async function me(token: string): Promise<User | null> {
	if (!token) {
		console.error('No token provided');
		return null;
	}
	const user = await prisma.user.findUnique({
		where: { id: token }
	});
	if (!user) {
		console.error('User not found');
		return null;
	}
	return user ? { id: user.id, username: user.username } : null;
}

export async function register(registerData: RegisterRequest): Promise<LoginResponse> {
	const { username, password, confirmPwd } = registerData;

	if (password !== confirmPwd) {
		throw createApiError('Passwords do not match', 400, ErrorCodes.VALIDATION.PASSWORD_MISMATCH);
	}

	// Check if username already exists
	const existingUser = await prisma.user.findUnique({
		where: { username }
	});

	if (existingUser) {
		throw createApiError('Username already taken', 400, ErrorCodes.AUTH.USER_EXISTS);
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		// Create user
		const user = await prisma.user.create({
			data: { username, password: hashedPassword }
		});

		const userResponse: User = { id: user.id.toString(), username: user.username };
		const token = jwt.sign({ sub: user.id, username: user.username }, env.PUBLIC_SECRET_TOKEN, {
			expiresIn: '1h'
		});

		return { token, user: userResponse };
	} catch (error) {
		console.error('Registration error:', error);
		throw createApiError('Failed to create user', 500, ErrorCodes.SERVER.DATABASE_ERROR);
	}
}

// User login
export async function login(username: string, password: string): Promise<LoginResponse> {
	// Find user by username
	const userRecord = await prisma.user.findUnique({
		where: { username }
	});

	if (!userRecord) {
		throw createApiError('User not found', 401, ErrorCodes.AUTH.USER_NOT_FOUND);
	}

	// Verify password
	const isPasswordValid = await bcrypt.compare(password, userRecord.password);

	if (!isPasswordValid) {
		throw createApiError('Invalid password', 401, ErrorCodes.AUTH.INVALID_PASSWORD);
	}

	// Create JWT token
	const user: User = { id: userRecord.id.toString(), username: userRecord.username };
	const token = jwt.sign({ sub: user.id, username: user.username }, env.PUBLIC_SECRET_TOKEN, {
		expiresIn: '1h'
	});

	return { token, user };
}

// User logout
export async function logout(token: string): Promise<void> {
	// Token invalidation would happen here if using a token blacklist
	// For client-side auth, we simply remove the cookie on the client side
}
