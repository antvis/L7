import type { Config } from 'jest';

const sharedConfig = {
    transform: {
        // use typescript to convert from esm to cjs
        '[.](m|c)?(ts|js)(x)?$': ['ts-jest', {
            'isolatedModules': true,
            'tsconfig': 'tsconfig.json'
        },
        
    ],
    "^.+.(glsl)$":"jest-text-transformer"
    // '\\.[jt]sx?$': 'esbuild-jest',
    },
    // any tests that operate on dist files shouldn't compile them again.

    transformIgnorePatterns: ['<rootDir>/dist','^.+\\.js$'],
    modulePathIgnorePatterns: ['<rootDir>/dist'],
    moduleNameMapper: {
        '@antv/l7-(.+)$': '<rootDir>packages/$1/src',
        "^.+.(css)$": "jest-text-transformer"
    },
} as Partial<Config>;

const config: Config = {
    testEnvironment: 'jsdom',
    setupFiles: [
        'jest-canvas-mock',
    ],
    setupFilesAfterEnv: [ '<rootDir>jest/setupTests.ts' ],
    testMatch: [
        '**/__tests__/*.spec.+(ts|tsx|js)',
        '**/*.test.+(ts|tsx|js)',
        '**/__tests__/*/*.spec.+(ts|tsx|js)',
    ],
    coverageReporters: ['html', 'lcov', 'clover'],
    coveragePathIgnorePatterns: ['/node_modules/', '/iconfont/'],
    coverageThreshold: {
      global: {
        branches: 30,
        functions: 44,
        lines: 56,
        statements: 55,
      },
    },
    ...sharedConfig

};

export default config;