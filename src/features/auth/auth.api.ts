// Keeping apiClient import for future reference when connecting to real API
// import apiClient from "../../lib/apiClient";
import { generateLoginResponse } from "../../lib/mockData";
import type { LoginRequest, LoginResponse, User } from "./domain/auth-schema";
import { UserSchema, LoginRequestSchema, LoginResponseSchema, AuthStateSchema } from "./domain/auth-schema";

/**
 * Authenticate a user with email and password
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  // In a real app, this would call the API
  // return apiClient.post<LoginResponse>('/auth/login', credentials).then(res => res.data);

  // For now, we'll use mock data
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const response = generateLoginResponse();

      const user = {
        id: response.user.id,
        email: credentials.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
      };

      // Store in localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      resolve(response);
    }, 800);
  });
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<void> => {
  // In a real app, this might call the API to invalidate the token
  // return apiClient.post('/auth/logout').then(() => {
  //   clearAuthData();
  // });

  // For now, we'll just clear local storage
  return new Promise((resolve) => {
    setTimeout(() => {
      clearAuthData();
      resolve();
    }, 300);
  });
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  // In a real app, this would call the API
  // return apiClient.get<User>('/auth/me').then(res => res.data);

  // For now, we'll get from localStorage
  return new Promise((resolve) => {
    const userJson = localStorage.getItem("user");

    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        resolve(user);
      } catch {
        clearAuthData();
        resolve(null);
      }
    } else {
      resolve(null);
    }
  });
};

/**
 * Clear all auth data from localStorage
 */
const clearAuthData = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
