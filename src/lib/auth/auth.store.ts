import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { AuthState, User } from './types';
import { getTokenPayload, isTokenExpired, getStoredToken, setStoredToken, removeStoredToken } from './jwt';

// Initial state for the auth store
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create the auth store with typed initial state
function createAuthStore() {
  // Get initial token from localStorage if in browser
  const initialToken = browser ? getStoredToken() : null;
  
  // Parse user from token if available
  let initialUser: User | null = null;
  if (initialToken) {
    const payload = getTokenPayload(initialToken);
    if (payload) {
      initialUser = {
        id: payload.sub,
        username: payload.username,
      };
    }
  }
  
  // Create the Svelte store with proper typing
  const { subscribe, set, update }: Writable<AuthState> = writable({
    ...initialState,
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken && !isTokenExpired(initialToken)
  });

  return {
    subscribe,
    
    // Set auth state after successful login
    setAuth: (token: string, user: User) => {
      // Store token in localStorage
      setStoredToken(token);
      
      // Update the store
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    },
    
    // Clear auth state on logout
    clearAuth: () => {
      // Remove token from localStorage
      removeStoredToken();
      
      // Reset the store to initial state
      set(initialState);
    },
    
    // Set loading state
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading }));
    },
    
    // Set error state
    setError: (error: string | null) => {
      update(state => ({ ...state, error }));
    },
    
    // Check if token is valid
    checkAuth: async (): Promise<boolean> => {
      // Only run in browser
      if (!browser) return false;
      
      // Get token from localStorage
      const token = getStoredToken();
      if (!token) {
        set(initialState);
        return false;
      }
      
      // Check if token is expired
      if (isTokenExpired(token)) {
        removeStoredToken();
        set(initialState);
        return false;
      }
      
      // Token is valid, get user from payload
      const payload = getTokenPayload(token);
      if (!payload) {
        removeStoredToken();
        set(initialState);
        return false;
      }
      
      // Update store with valid user and token
      const user: User = {
        id: payload.sub,
        username: payload.username,
      };
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return true;
    },
    
    // Logout and redirect to login page
    logout: () => {
      removeStoredToken();
      set(initialState);
      goto('/login');
    }
  };
}

// Create and export the auth store
export const authStore = createAuthStore();