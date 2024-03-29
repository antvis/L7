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
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>__tests__/unit/preset/environment.ts'],
  testMatch: [
    '<rootDir>/packages/*/__tests__/*.spec.+(ts|tsx|js)',
    '<rootDir>/packages/*/__tests__/**/*/*.spec.+(ts|tsx|js)',
    '<rootDir>/__tests__/unit/*.spec.+(ts|tsx|js)',
    '<rootDir>/__tests__/unit/**/*/*.spec.+(ts|tsx|js)',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/iconfont/', '/__test__/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 40,
      lines: 50,
      statements: 50,
    },
  },
  ...sharedConfig,
};

export default config;
