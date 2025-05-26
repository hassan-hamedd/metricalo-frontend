import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, logout, getCurrentUser } from './auth.api';
import { generateLoginResponse } from '../../lib/mockData';

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

// Mock generateLoginResponse from mockData
vi.mock('../../lib/mockData', () => ({
  generateLoginResponse: vi.fn(),
}));

describe('auth.api', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('login', () => {
    it('should return a login response and store data in localStorage', async () => {
      const mockResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user'
        }
      };
      
      vi.mocked(generateLoginResponse).mockReturnValue(mockResponse);
      
      const loginPromise = login({ email: 'test@example.com', password: 'password' });
      
      // Fast-forward timer to complete the setTimeout
      vi.advanceTimersByTime(800);
      
      const response = await loginPromise;
      
      expect(response).toEqual(mockResponse);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', mockResponse.accessToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', mockResponse.refreshToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
    });
  });

  describe('logout', () => {
    it('should clear auth data from localStorage', async () => {
      // Setup some auth data
      localStorageMock.setItem('accessToken', 'test-token');
      localStorageMock.setItem('refreshToken', 'test-refresh');
      localStorageMock.setItem('user', JSON.stringify({ id: '1' }));
      
      const logoutPromise = logout();
      
      // Fast-forward timer to complete the setTimeout
      vi.advanceTimersByTime(300);
      
      await logoutPromise;
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data from localStorage', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      };
      
      localStorageMock.setItem('user', JSON.stringify(mockUser));
      
      const userPromise = getCurrentUser();
      
      // Fast-forward timer to complete the setTimeout
      vi.advanceTimersByTime(300);
      
      const user = await userPromise;
      
      expect(user).toEqual(mockUser);
    });
    
    it('should return null when no user data exists', async () => {
      const userPromise = getCurrentUser();
      
      // Fast-forward timer to complete the setTimeout
      vi.advanceTimersByTime(300);
      
      const user = await userPromise;
      
      expect(user).toBeNull();
    });
    
    it('should return null and clear data when JSON parsing fails', async () => {
      // Set invalid JSON
      localStorageMock.setItem('user', 'invalid-json');
      
      const userPromise = getCurrentUser();
      
      // Fast-forward timer to complete the setTimeout
      vi.advanceTimersByTime(300);
      
      const user = await userPromise;
      
      expect(user).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });
}); 