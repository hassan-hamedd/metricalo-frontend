import { describe, it, expect, vi, beforeEach } from "vitest";
import apiClient from "./apiClient";

// Mock axios properly with default export
vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        }
      })),
    },
    // Make sure all properties/methods used in the implementation are mocked
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      }
    })),
  };
});

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

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("apiClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
  });

  it("should be defined", () => {
    // This test just ensures apiClient is imported and used
    expect(apiClient).toBeDefined();
  });
});
