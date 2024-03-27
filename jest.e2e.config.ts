import type { Config } from 'jest';

const sharedConfig: Partial<Config> = {
  transform: {
    // use typescript to convert from esm to cjs
    '[.](m|c)?(ts|js)(x)?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
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
};

const config: Config = {
  testTimeout: 100000,
  globalSetup: './__tests__/integration/preset/setup.js',
  globalTeardown: './__tests__/integration/preset/teardown.js',
  testEnvironment: './__tests__/integration/preset/environment.js',
  testMatch: ['<rootDir>/__tests__/integration/*.spec.ts'],
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
