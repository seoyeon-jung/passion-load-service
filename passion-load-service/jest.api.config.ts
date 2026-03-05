import type { Config } from 'jest';

const config: Config = {
  displayName: 'passion-load-service-api',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/test/**/*.api.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.app.json' }],
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
};

export default config;
