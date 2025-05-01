import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '$lib/auth/types';
import { env } from '$env/dynamic/public';
import { error } from 'console';
import prisma from '../prisma';
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
		throw new Error('Passwords do not match');
	}

	// Hash du mot de passe
	const hashedPassword = await bcrypt.hash(password, 10);

	// Insertion de l'utilisateur
	const user = await prisma.user.create({
		data: { username, password: hashedPassword }
	});

	if (!user) {
		console.error('User not found');
		throw new Error('User insertion failed');
	}
	const userResponse: User = { id: user.id.toString(), username: user.username };
	const token = jwt.sign({ sub: user.id, username: user.username }, env.PUBLIC_SECRET_TOKEN, {
		expiresIn: '1h'
	});

	return { token, user: userResponse };
}

// Connexion d'un utilisateur
export async function login(username: string, password: string): Promise<LoginResponse> {
	const userRecord = await prisma.user.findUnique({
		where: { username }
	});
	if (!userRecord) {
		throw new Error('User not found');
	}

	// Vérifier le mot de passe
	const isPasswordValid = await bcrypt.compare(password, userRecord.password);

	if (!isPasswordValid) {
		throw new Error('Invalid password');
	}

	const user: User = { id: userRecord.id.toString(), username: userRecord.username };
	const token = jwt.sign({ sub: user.id, username: user.username }, env.PUBLIC_SECRET_TOKEN, {
		expiresIn: '1h'
	});

	return { token, user };
}

// Déconnexion d'un utilisateur
export async function logout(token: string): Promise<void> {}
