import type { Config } from 'jest';

const sharedConfig: Partial<Config> = {
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
};

const config: Config = {
  testTimeout: 100000,
  globalSetup: './test/integration/lib/setup.js',
  globalTeardown: './test/integration/lib/teardown.js',
  testEnvironment: './test/integration/lib/environment.js',
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
