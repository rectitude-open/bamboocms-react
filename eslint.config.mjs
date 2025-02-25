import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  ...fixupConfigRules(
    compat.extends('next/core-web-vitals', 'plugin:import/recommended', 'plugin:import/typescript', 'prettier')
  ),
  {
    plugins: {
      'import': fixupPluginRules(_import),
      'react-hooks': fixupPluginRules(reactHooks),
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],

          'pathGroups': [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
            {
              pattern: '*.{css,scss}',
              group: 'object',

              patternOptions: {
                matchBase: true,
              },
            },
          ],

          'newlines-between': 'always',

          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },

          'warnOnUnassignedImports': true,
        },
      ],
    },
  },
];

export default eslintConfig;
