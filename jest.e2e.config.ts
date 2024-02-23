import type { Config } from 'jest';

const sharedConfig = {
  transform: {
    // use typescript to convert from esm to cjs
    '[.](m|c)?(ts|js)(x)?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: 'tsconfig.json',
      },
    ],
    '^.+.(glsl)$': 'jest-text-transformer',
    // '\\.[jt]sx?$': 'esbuild-jest',
  },
  // any tests that operate on dist files shouldn't compile them again.

  transformIgnorePatterns: ['<rootDir>/dist', '^.+\\.js$'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '@antv/l7-(.+)$': '<rootDir>packages/$1/src',
    '^.+.(css)$': 'jest-text-transformer',
  },
} as Partial<Config>;

const config: Config = {
  testTimeout: 100000,
  globalSetup: './scripts/jest/setup.js',
  globalTeardown: './scripts/jest/teardown.js',
  testEnvironment: './scripts/jest/environment.js',
  testMatch: ['<rootDir>/__tests_e2e__/e2e/*.spec.ts'],
  coverageReporters: ['html', 'lcov', 'clover'],
  coveragePathIgnorePatterns: ['/node_modules/', '/iconfont/'],
  coverageThreshold: {
    global: {
      branches: 9,
      functions: 11.5,
      lines: 15,
      statements: 15,
    },
  },
  ...sharedConfig,
};

export default config;
