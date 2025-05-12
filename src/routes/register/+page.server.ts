import { fail, redirect } from '@sveltejs/kit';
import { register } from '$lib/services/auth';
import type { Actions } from './$types';
import type { RegisterFormData } from '$lib/types/types';
import { ErrorCodes, ErrorMessages } from '$lib/utils/error-handler';

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		const fieldErrors: Record<string, string> = {};

		// Field validation
		if (!username) {
			fieldErrors.username = 'Username is required';
		} else if (username.length < 3) {
			fieldErrors.username = 'Username must be at least 3 characters';
		}

		if (!password) {
			fieldErrors.password = 'Password is required';
		} else if (password.length < 6) {
			fieldErrors.password = 'Password must be at least 6 characters';
		}

		if (!confirmPassword) {
			fieldErrors.confirmPassword = 'Please confirm your password';
		} else if (password !== confirmPassword) {
			fieldErrors.confirmPassword = ErrorMessages[ErrorCodes.VALIDATION.PASSWORD_MISMATCH];
		}

		// Return early if there are field errors
		if (Object.keys(fieldErrors).length > 0) {
			return fail(400, {
				error: 'Please correct the errors below',
				fieldErrors,
				username
			});
		}

		try {
			// Register the user
			const user = await register({ username, password, confirmPwd: confirmPassword });

			// Create session cookie after registration
			cookies.set('session', user.token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 // 24h
			});

			// Redirect to login page after successful registration
			throw redirect(303, '/login');
		} catch (error: any) {
			// Check if this is a redirect thrown by our code
			if (error.status === 303) {
				throw error; // Re-throw the redirect
			}

			console.error('Registration error:', error);

			// Handle specific error codes from the API
			if (error.code) {
				return fail(error.status || 400, {
					error: ErrorMessages[error.code] || error.message,
					username
				});
			}

			return fail(500, {
				error: ErrorMessages[ErrorCodes.SERVER.INTERNAL_ERROR],
				username
			});
		}
	}
};
