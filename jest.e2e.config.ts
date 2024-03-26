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
  globalSetup: './test/integration/environment/setup.js',
  globalTeardown: './test/integration/environment/teardown.js',
  testEnvironment: './test/integration/environment/environment.js',
  testMatch: ['<rootDir>/test/integration/*.spec.ts'],
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
