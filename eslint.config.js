// @ts-check

import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import jestPlugin from 'eslint-plugin-jest';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
      'packages/*/{es,lib,dist}/**',
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

  // ts files linting
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
  // test file linting
  //
  {
    files: ['test/**/*.spec.ts', 'packages/*/__tests__/**/*.spec.ts'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {},
  },

  //
  // examples linting
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
  // website linting
  //
  {
    files: ['website/**/*.{js,ts,tsx}'],
    rules: {},
    ignores: [
      'website/dist/*',
      'website/.dumi/tmp/*',
      'website/.dumi/tmp-production/*',
      'website/dist/*',
      'website/public/*',
      'website/public_site/*',
    ],
  },

  // after all eslint plugins configs to override, see https://github.com/prettier/eslint-config-prettier
  prettierConfig,
);
