import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Base configuration for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 2021,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        Buffer: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'simple-import-sort': simpleImportSort,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,

      // TypeScript ESLint recommended rules
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-type-checked'].rules,
      ...tseslint.configs.stylistic.rules,

      // Prettier integration
      ...prettier.rules,

      // Simple import sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // React rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // Override specific rules to be warnings instead of errors
      '@typescript-eslint/no-unused-expressions': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

      // Additional TypeScript ESLint rules
      '@typescript-eslint/no-restricted-imports': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-extraneous-class': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // Additional ESLint rules
      'no-console': 'warn',
      'array-callback-return': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-assignment': 'error',
      'block-scoped-var': 'error',
      'consistent-return': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'smart'],
      'new-cap': ['error', { capIsNew: false }],
      'no-caller': 'error',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-implicit-coercion': 'error',
      'no-invalid-this': 'error',
      'no-lonely-if': 'error',
      'no-multi-spaces': 'error',
      'no-param-reassign': 'error',
      'no-return-assign': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      'prefer-template': 'error',
      'require-await': 'warn',
      yoda: 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React-specific rules
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/jsx-uses-react': 'off', // Not needed with React 17+ JSX transform
      'react/jsx-uses-vars': 'warn',
      'react/jsx-key': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-undef': 'warn',
      'react/jsx-pascal-case': 'warn',
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-find-dom-node': 'warn',
      'react/no-is-mounted': 'warn',
      'react/no-render-return-value': 'warn',
      'react/no-string-refs': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'warn',
      'react/require-render-return': 'warn',
      'react/self-closing-comp': 'warn',
      'react/display-name': 'warn',

      // Disabled rules from previous config
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
      'no-await-in-loop': 'off',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // TODO good rules, require work to fix and were skipped over in eslint v9 upgrade
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/unbound-method': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-empty': 'warn',
      'no-undef': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      'eslint.config.js',
      'eslint.config.mjs',
      'public/**',
      'build/**',
    ],
  },
]
