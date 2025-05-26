import { useCallback, useEffect, useState } from "react";
import * as authApi from "../features/auth/auth.api";
import type { AuthState, LoginRequest, User } from "../types/auth";

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);

  // Load user on initial mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authApi.getCurrentUser();

        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to load user",
        }));
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login(credentials);

      setState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Invalid credentials",
      }));

      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authApi.logout();

      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to logout",
      }));
    }
  }, []);

  // Update user data function
  const updateUser = useCallback((user: User) => {
    setState((prev) => ({
      ...prev,
      user,
    }));

    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  // Clear any errors
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
  };
};

export default useAuth;
