// JWT Token payload structure
export interface JwtPayload {
  sub: string;         // Subject (user ID)
  username: string;       // User email
  iat: number;         // Issued at timestamp
  exp: number;         // Expiration timestamp
}

// User structure as used in the auth store
export interface User {
  id: string;
  username: string;
}

// Auth state structure
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login request payload
export interface LoginRequest {
  username: string;
  password: string;
}

// Login response from API
export interface LoginResponse {
  token: string;
  user: User;
}

// Registration request payload
export interface RegisterRequest {
  username: string;
  password: string;
  confirmPwd: string;
}

// Error response from API
export interface ErrorResponse {
  error: string;
  status?: number;
}