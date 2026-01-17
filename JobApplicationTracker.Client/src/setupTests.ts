/**
 * @file setupTests.ts
 * @description Jest setup file with common mocks for all tests
 * @author Dushan Ranasinghage
 * @copyright Copyright 2026 - JobApplicationTracker.Client All Rights Reserved.
 */

jest.mock('./clients/JobApplicationTrackerClient', () => {
  const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    getInstance: jest.fn(),
  };
  return {
    JobApplicationTrackerClient: mockClient,
  };
});

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
  default: {
    isAxiosError: jest.fn(),
  },
}));
