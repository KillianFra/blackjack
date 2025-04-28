import { browser } from '$app/environment';
import { getStoredToken } from '$lib/auth/jwt';
import type { ErrorResponse } from '$lib/auth/types';

// API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Interface for fetch options with type enhancements
interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Generic fetch wrapper with authorization and error handling
 * @param endpoint API endpoint to call
 * @param options Fetch options with optional params
 * @returns Promise with the response data
 */
export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  // Build URL with query parameters if needed
  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  // Prepare headers with authentication if available
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add auth token if available
  if (browser) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  // Send the request
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle different content types
    const contentType = response.headers.get('content-type');
    let data: any;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }
    
    // Handle error responses
    if (!response.ok) {
      const error: ErrorResponse = {
        error: data.error || response.statusText || 'Unknown error',
        status: response.status
      };
      
      throw error;
    }
    
    return data as T;
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
}

/**
 * Typed API helper methods for common HTTP verbs
 */
export const api = {
  /**
   * GET request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns Promise with response data
   */
  get: <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    return apiClient<T>(endpoint, { ...options, method: 'GET' });
  },
  
  /**
   * POST request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param options Request options
   * @returns Promise with response data
   */
  post: <T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> => {
    return apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  },
  
  /**
   * PUT request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param options Request options
   * @returns Promise with response data
   */
  put: <T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> => {
    return apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  },
  
  /**
   * PATCH request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param options Request options
   * @returns Promise with response data
   */
  patch: <T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> => {
    return apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  },
  
  /**
   * DELETE request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns Promise with response data
   */
  delete: <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    return apiClient<T>(endpoint, { ...options, method: 'DELETE' });
  }
};