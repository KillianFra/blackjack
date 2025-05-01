import { browser } from '$app/environment';
import { setupMockApi } from './mock';

// Initialize API mocking in development mode
if (browser && import.meta.env.DEV) {
	setupMockApi();
}

// Re-export API client
export * from './client';
export * from './auth';
