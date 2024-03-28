// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  // config ignores files, equal `.eslintignore`
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/fixtures/**',
      '**/coverage/**',
      '**/__snapshots__/**',
      '**/coverage/**',
      '**/temp/**',
      '**/.cache/**',
      '**/.history/**',
      '**/.idea/**',

      // Files pakasges of the build
      'packages/*/es/*',
      'packages/*/lib/*',
      'packages/*/dist/*',

      // Website static files
      'site/public/*',
      'site/public_site/*',
    ],
  },

  // extends configs
  eslint.configs.recommended,

  // basic config
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-constant-condition': 'off',
      'no-prototype-builtins': 'off',
      'no-case-declarations': 'off',
      'no-useless-catch': 'off',
      'prefer-rest-params': 'off',
    },
  },

  // ts files linting
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        // OOM when many project configs passed to the parser with multi-package monorepos, see https://github.com/typescript-eslint/typescript-eslint/issues/1192
        // project: [
        //   './tsconfig.eslint.json',
        //   './packages/*/tsconfig.json',
        //   './site/tsconfig.json',
        // ],
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
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

  // react tsx files linting
  {
    files: ['**/*.{tsx}'],
    ...reactPlugin.configs.recommended,
    plugins: {
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {},
  },

  //
  // test jest file linting
  //
  {
    files: ['test/**/*.spec.ts', 'packages/*/__tests__/**/*.spec.ts'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {},
  },

  // after all eslint plugins configs to override, see https://github.com/prettier/eslint-config-prettier
  // @ts-ignore
  prettierConfig,

  //
  // test workspace linting
  //
  {
    files: ['test/**/*.{ts}', 'packages/*/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  //
  // examples workspace linting
  //
  {
    files: ['examples/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'prefer-const': 'warn',
    },
  },

  //
  // website workspace linting
  //
  {
    files: ['site/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['site/**/*.js'],
    languageOptions: {
      globals: { AMap: true },
    },
  },
);
