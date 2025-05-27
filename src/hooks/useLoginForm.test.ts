import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from './useLoginForm';
import type { LoginRequest } from '../types/auth';

// Mock the useAuth hook
const mockLogin = vi.fn();
vi.mock('./useAuth', () => ({
  default: () => ({
    login: mockLogin,
  }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.email).toBe('demo@example.com');
    expect(result.current.password).toBe('metricalo');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should update email when setEmail is called', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setEmail('test@example.com');
    });

    expect(result.current.email).toBe('test@example.com');
  });

  it('should update password when setPassword is called', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setPassword('newpassword');
    });

    expect(result.current.password).toBe('newpassword');
  });

  it('should handle successful form submission', async () => {
    mockLogin.mockResolvedValue(true);

    const { result } = renderHook(() => useLoginForm());

    // Create a mock form event
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'demo@example.com',
      password: 'metricalo',
    } as LoginRequest);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(result.current.error).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle failed login with false return', async () => {
    mockLogin.mockResolvedValue(false);

    const { result } = renderHook(() => useLoginForm());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'demo@example.com',
      password: 'metricalo',
    } as LoginRequest);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Invalid email or password');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle login exception', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLoginForm());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('An error occurred. Please try again.');
    expect(result.current.isSubmitting).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should validate empty email', async () => {
    const { result } = renderHook(() => useLoginForm());

    // Set empty email
    act(() => {
      result.current.setEmail('');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.error).toBe('Please enter both email and password');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should validate empty password', async () => {
    const { result } = renderHook(() => useLoginForm());

    // Set empty password
    act(() => {
      result.current.setPassword('');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Please enter both email and password');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should validate whitespace-only email', async () => {
    const { result } = renderHook(() => useLoginForm());

    // Set whitespace-only email
    act(() => {
      result.current.setEmail('   ');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Please enter both email and password');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should validate whitespace-only password', async () => {
    const { result } = renderHook(() => useLoginForm());

    // Set whitespace-only password
    act(() => {
      result.current.setPassword('   ');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Please enter both email and password');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should set isSubmitting to true during submission', async () => {
    // Create a promise that we can control
    let resolveLogin: (value: boolean) => void;
    const loginPromise = new Promise<boolean>((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useLoginForm());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    // Start the submission but don't await it yet
    let submitPromise: Promise<void>;
    act(() => {
      submitPromise = result.current.handleSubmit(mockEvent);
    });

    // Check that isSubmitting is true during submission
    expect(result.current.isSubmitting).toBe(true);

    // Now resolve the login promise and wait for completion
    await act(async () => {
      resolveLogin!(true);
      await submitPromise!;
    });

    // Check that isSubmitting is false after submission
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should clear error when starting new submission', async () => {
    const { result } = renderHook(() => useLoginForm());

    // First, set an error by submitting with empty fields
    act(() => {
      result.current.setEmail('');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Please enter both email and password');

    // Now set valid fields and submit again
    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password');
    });

    mockLogin.mockResolvedValue(true);

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('');
  });

  it('should use custom email and password values in submission', async () => {
    mockLogin.mockResolvedValue(true);

    const { result } = renderHook(() => useLoginForm());

    // Set custom values
    act(() => {
      result.current.setEmail('custom@example.com');
      result.current.setPassword('custompassword');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'custom@example.com',
      password: 'custompassword',
    } as LoginRequest);
  });
}); 