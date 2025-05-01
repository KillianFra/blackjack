/**
 * Error handling utilities for the application
 */
import type { ErrorResponse } from '$lib/auth/types';

/**
 * Standardized error response format
 */
export interface ApiError extends Error {
	status?: number;
	code?: string;
	details?: Record<string, any>;
}

/**
 * Create a standardized API error
 */
export function createApiError(
	message: string,
	status = 500,
	code = 'INTERNAL_ERROR',
	details?: Record<string, any>
): ApiError {
	const error = new Error(message) as ApiError;
	error.status = status;
	error.code = code;
	error.details = details;
	return error;
}

/**
 * Format API errors for client consumption
 */
export function formatApiError(error: unknown): ErrorResponse {
	// Handle known API errors
	if (error instanceof Error) {
		const apiError = error as ApiError;

		return {
			error: apiError.message,
			status: apiError.status || 500
		};
	}

	// Handle unknown errors
	return {
		error: 'An unexpected error occurred',
		status: 500
	};
}

/**
 * Common error codes used in the application
 */
export const ErrorCodes = {
	AUTH: {
		INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
		USER_NOT_FOUND: 'USER_NOT_FOUND',
		INVALID_PASSWORD: 'INVALID_PASSWORD',
		USER_EXISTS: 'USER_EXISTS',
		NOT_AUTHENTICATED: 'NOT_AUTHENTICATED'
	},
	VALIDATION: {
		MISSING_FIELDS: 'MISSING_FIELDS',
		INVALID_FORMAT: 'INVALID_FORMAT',
		PASSWORD_MISMATCH: 'PASSWORD_MISMATCH'
	},
	SERVER: {
		INTERNAL_ERROR: 'INTERNAL_ERROR',
		DATABASE_ERROR: 'DATABASE_ERROR'
	}
};

/**
 * Client-friendly error messages for common errors
 */
export const ErrorMessages = {
	[ErrorCodes.AUTH.INVALID_CREDENTIALS]: 'Invalid username or password',
	[ErrorCodes.AUTH.USER_NOT_FOUND]: 'Account not found',
	[ErrorCodes.AUTH.INVALID_PASSWORD]: 'Incorrect password',
	[ErrorCodes.AUTH.USER_EXISTS]: 'Username already taken',
	[ErrorCodes.AUTH.NOT_AUTHENTICATED]: 'You must be logged in to access this resource',
	[ErrorCodes.VALIDATION.MISSING_FIELDS]: 'Please fill in all required fields',
	[ErrorCodes.VALIDATION.INVALID_FORMAT]: 'Invalid format',
	[ErrorCodes.VALIDATION.PASSWORD_MISMATCH]: 'Passwords do not match',
	[ErrorCodes.SERVER.INTERNAL_ERROR]: 'An internal server error occurred',
	[ErrorCodes.SERVER.DATABASE_ERROR]: 'Database error occurred'
};
