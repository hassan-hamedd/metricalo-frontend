import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as authApi from '../features/auth/auth.api';
import type { User } from '../types/auth';

// Mock the auth API module
vi.mock('../features/auth/auth.api', () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with loading state', () => {
    // Mock the getCurrentUser to not resolve immediately
    vi.mocked(authApi.getCurrentUser).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should handle error when loading user on initialization', async () => {
    // Setup localStorage with a token
    localStorageMock.setItem('accessToken', 'fake-token');
    
    // Mock the error case
    vi.mocked(authApi.getCurrentUser).mockRejectedValue(new Error('Failed to load user'));

    const { result } = renderHook(() => useAuth());
    
    // Wait for the promise to reject
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Check the error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe('Failed to load user');
  });

  it('should load user on initialization if token exists', async () => {
    // Setup localStorage with a token
    localStorageMock.setItem('accessToken', 'fake-token');
    
    // Mock the user data
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };
    
    // Create a promise that we can resolve manually
    let resolveUserPromise: (value: User) => void;
    const userPromise = new Promise<User>((resolve) => {
      resolveUserPromise = resolve;
    });
    
    vi.mocked(authApi.getCurrentUser).mockReturnValue(userPromise);

    const { result } = renderHook(() => useAuth());
    
    // Initially it should be in loading state
    expect(result.current.isLoading).toBe(true);
    
    // Now resolve the promise inside act
    await act(async () => {
      resolveUserPromise!(mockUser);
      await userPromise;
    });

    // Check the final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle login successfully', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };
    
    const mockLoginResponse = {
      user: mockUser,
      accessToken: 'fake-access-token',
      refreshToken: 'fake-refresh-token',
    };

    vi.mocked(authApi.login).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login({ email: 'test@example.com', password: 'password' });
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe(mockLoginResponse.accessToken);
    expect(result.current.refreshToken).toBe(mockLoginResponse.refreshToken);
  });

  it('should handle login failure', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login({ email: 'wrong@example.com', password: 'wrong' });
      expect(success).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should handle logout successfully', async () => {
    // Setup authenticated state
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };
    
    // Create a promise that we can resolve manually
    let resolveUserPromise: (value: User) => void;
    const userPromise = new Promise<User>((resolve) => {
      resolveUserPromise = resolve;
    });
    
    vi.mocked(authApi.getCurrentUser).mockReturnValue(userPromise);
    
    const { result } = renderHook(() => useAuth());
    
    // Resolve the getCurrentUser promise
    await act(async () => {
      resolveUserPromise!(mockUser);
      await userPromise;
    });
    
    // Verify authenticated state
    expect(result.current.isAuthenticated).toBe(true);
    
    // Mock successful logout
    vi.mocked(authApi.logout).mockResolvedValue(undefined);
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.accessToken).toBe(null);
    expect(result.current.refreshToken).toBe(null);
  });
  
  it('should handle logout failure', async () => {
    // Setup authenticated state
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    };
    
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    // Wait for initial load
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // Mock logout failure
    vi.mocked(authApi.logout).mockRejectedValue(new Error('Logout failed'));
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.error).toBe('Failed to logout');
  });

  it('should update user data', async () => {
    const { result } = renderHook(() => useAuth());
    
    const updatedUser: User = {
      id: '1',
      email: 'updated@example.com',
      firstName: 'Updated',
      lastName: 'User',
      role: 'admin'
    };
    
    act(() => {
      result.current.updateUser(updatedUser);
    });
    
    expect(result.current.user).toEqual(updatedUser);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser));
  });
  
  it('should clear error when requested', async () => {
    // Setup state with an error
    vi.mocked(authApi.login).mockRejectedValue(new Error('Login failed'));
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'wrong' });
    });
    
    expect(result.current.error).toBe('Invalid credentials');
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBe(null);
  });
}); 