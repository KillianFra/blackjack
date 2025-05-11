import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { login, register, logout, getUser } from '$lib/api/auth';
import { verifyToken } from '$lib/auth/jwt';

export const POST: RequestHandler = async ({ request, params }) => {
	try {
		const body = await request.json();
		let response;

		if (params.endpoint === 'login') {
			response = await login(body.username, body.password);
			if (!response) {
				return json({ error: "User Don't exist" }, { status: 401 });
			}
		} else if (params.endpoint === 'register') {
			response = await register({
				username: body.username,
				password: body.password,
				confirmPwd: body.confirmPwd
			});
		} else if (params.endpoint === 'logout') {
			const token = request.headers.get('Authorization')?.replace('Bearer ', '');
			if (!token) {
				return json({ error: 'Token required' }, { status: 401 });
			}
			await logout(token);
			response = { message: 'Logged out' };
		}

		if (response) {
			return json(response);
		}

		return json({ error: 'Unknown endpoint' }, { status: 404 });
	} catch (error: any) {
		console.error('Erreur:', error);
		return json({ error: error.message || 'Request failed' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ request, params }) => {
	try {
		if (params.endpoint === 'me') {
			const token = request.headers.get('Authorization')?.replace('Bearer ', '');
			if (!token) {
				return json({ error: 'Token required' }, { status: 401 });
			}

			const decoded = verifyToken(token);

			if (!decoded) {
				return json({ error: 'Invalid token' }, { status: 401 });
			}

			const user = await getUser(decoded.sub as string);
			return json(user);
		}

		return json({ error: 'Unknown endpoint' }, { status: 404 });
	} catch (error: any) {
		console.error('Erreur:', error);
		return json({ error: error.message || 'Authentication failed' }, { status: 401 });
	}
};
