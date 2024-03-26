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
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>test/unit/environment/browser.ts'],
  testMatch: [
    'packages/*/__tests__/**/?(*.).spec.+(ts|tsx|js)',
    'test/unit/**/?(*.)+spec.(ts|tsx|js)',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/iconfont/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 44,
      lines: 55,
      statements: 55,
    },
  },
  ...sharedConfig,
};

export default config;
