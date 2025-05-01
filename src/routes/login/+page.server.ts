import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { login } from '$lib/api/auth';
import type { Actions } from './$types';
import { ErrorCodes, ErrorMessages } from '$lib/utils/error-handler';

export const actions: Actions = {
	login: async ({ request, cookies }: RequestEvent) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		// Field validation
		if (!username) {
			return fail(400, {
				error: ErrorMessages[ErrorCodes.VALIDATION.MISSING_FIELDS],
				username: ''
			});
		}

		if (!password) {
			return fail(400, {
				error: ErrorMessages[ErrorCodes.VALIDATION.MISSING_FIELDS],
				username
			});
		}

		try {
			// Attempt login
			const loginResult = await login(username, password);

			if (loginResult?.token && loginResult?.user) {
				// Set session cookie
				cookies.set('session', loginResult.token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					path: '/',
					maxAge: 60 * 60 // 1 hour
				});

				// Use throw redirect instead of return
				throw redirect(303, '/');
			} else {
				return fail(401, {
					error: ErrorMessages[ErrorCodes.AUTH.INVALID_CREDENTIALS],
					username
				});
			}
		} catch (error: any) {
			// Check if this is a redirect (should be re-thrown)
			if (error.status === 303) {
				throw error;
			}

			console.error('Login error:', error);

			// Handle specific error codes from the API
			if (error.code) {
				return fail(error.status || 401, {
					error: ErrorMessages[error.code] || error.message,
					username
				});
			}

			// Generic error message
			return fail(500, {
				error: ErrorMessages[ErrorCodes.SERVER.INTERNAL_ERROR],
				username
			});
		}
	}
};
