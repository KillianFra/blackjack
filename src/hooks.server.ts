import { error, type Handle } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { verifyToken } from '$lib/utils/jwt';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (!token) {
		if (event.url.pathname.startsWith('/api')) {
			throw error(401, 'Unauthorized');
		}
		return await resolve(event);
	}

	try {
		const decoded = verifyToken(token);
		const user = await prisma.user.findUnique({
			where: { id: decoded.sub as string },
			select: { id: true, username: true }
		});

		if (!user) {
			// remove the session cookie
			event.cookies.delete('session', { path: '/' });
			throw error(401, 'User not found');
		}

		event.locals.user = user;
	} catch (err) {
		if (event.url.pathname.startsWith('/api')) {
			throw error(401, 'Invalid token');
		}
	}

	return await resolve(event);
};
