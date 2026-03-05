import type { Config } from 'jest';

const config: Config = {
  displayName: 'passion-load-service',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/modules/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/test/'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.app.json' }],
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
};

export default config;
