module.exports = {
  globals: {
    'ts-jest': {
      // @see https://github.com/kulshekhar/ts-jest/issues/933#issuecomment-479821844
      babelConfig: require('./babel.config.js'),
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePathIgnorePatterns: ['dist'],
  moduleNameMapper: {
    '@antv/l7-(.+)$': '<rootDir>packages/$1/src',
  },
  notify: true,
  notifyMode: 'always',
  roots: ['<rootDir>packages'],
  testMatch: [
    '**/__tests__/*.spec.+(ts|tsx|js)',
    '**/*.test.+(ts|tsx|js)',
    '**/__tests__/*/*.spec.+(ts|tsx|js)',
  ],
  transform: {
    // '^.+\\.(ts|tsx)$': 'ts-jest',
    // @see https://github.com/kulshekhar/ts-jest/issues/1130
    '^.+\\.(ts|tsx)$': 'babel-jest',
    screenfull: 'babel-jest',
    '\\.(less|css)$': 'jest-less-loader',
    '\\.png$': 'jest-file-loader',
  },
  setupFilesAfterEnv: [ '<rootDir>jest/setupTests.ts' ],
  snapshotSerializers: [ 'enzyme-to-json/serializer' ],
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
};
