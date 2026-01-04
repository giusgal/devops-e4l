// Jest setup file
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = {
  pathname: '/',
  hostname: 'localhost',
  reload: jest.fn(),
};

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('Warning:')) return;
  originalWarn.apply(console, args);
};
