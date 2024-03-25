// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  // basic lint config
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.browser,
        ...globals.node,
        // AMap: true,
        // L7: true,
      },
    },
    rules: {
      'no-unsafe-optional-chaining': 'warn',
      'no-constant-condition': 0,
      'no-prototype-builtins': 0,
      'no-case-declarations': 0,
      'no-useless-catch': 0,
      'prefer-rest-params': 0,
    },
  },

  // lint ts files
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-loss-of-precision': 0,
      '@typescript-eslint/no-inferrable-types': 0,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-duplicate-enum-values': 0,
    },
  },

  // lint react tsx files
  {
    files: ['**/*.{tsx}'],
    ...reactPlugin.configs.recommended,
    plugins: {
      reactHooksPlugin,
    },
    rules: {},
  },

  // jest rules on test files
  {
    files: ['test/**/*.spec.ts', 'packages/*/__tests__/**/*.spec.ts'],
    globals: {
      ...globals.jest,
    },
    ...jestPlugin.configs['flat/recommended'],
    rules: {},
  },
  // after eslint configs to override.
  prettierConfig,

  // loose for examples
  {
    files: ['examples/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'prefer-const': 'warn',
    },
  },
);
