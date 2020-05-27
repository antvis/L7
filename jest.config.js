module.exports = {
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [ 'text', 'clover' ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  // globals: {
  //   'ts-jest': {
  //     // @see https://github.com/kulshekhar/ts-jest/issues/933#issuecomment-479821844
  //     babelConfig: require('./babel.config.js'),
  //   },
  // },
  moduleFileExtensions: [ 'ts', 'tsx', 'js' ],
  modulePathIgnorePatterns: [ 'dist' ],
  moduleNameMapper: {
    '@antv/l7-(.+)$': '<rootDir>packages/$1/src'
  },
  notify: true,
  notifyMode: 'always',
  roots: [ '<rootDir>packages' ],
  testMatch: [ '**/__tests__/*.spec.+(ts|tsx|js)', '**/*.test.+(ts|tsx|js)', '**/__tests__/*/*.spec.+(ts|tsx|js)' ],
  transform: {
    // '^.+\\.(ts|tsx)$': 'ts-jest',
    // @see https://github.com/kulshekhar/ts-jest/issues/1130
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  setupFilesAfterEnv: [ '<rootDir>jest/setupTests.ts' ],
  snapshotSerializers: [ 'enzyme-to-json/serializer' ]
};
