module.exports = {
    globals: {
        "AMap": true,
        "L7": true,
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint',"unused-imports"],
    rules: {
        "unused-imports/no-unused-imports": "error",
        '@typescript-eslint/no-loss-of-precision':0,
        '@typescript-eslint/no-inferrable-types': 0,
        'no-constant-condition': 0,
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-empty-function': 0,
        'no-prototype-builtins': 0,
        'no-case-declarations': 0,
        'no-useless-catch': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-explicit-any':0,
        'prefer-rest-params':0,
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
        },
    }
};
