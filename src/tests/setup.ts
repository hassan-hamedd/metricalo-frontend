import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";

// Mock ResizeObserver for Recharts components
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock;

// Mock global fetch if needed
// global.fetch = vi.fn();

// Reset any mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
});

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});
