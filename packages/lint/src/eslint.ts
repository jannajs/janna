import type { Linter } from 'eslint'

const config: Linter.Config = {
  extends: ['@antfu', 'prettier'],
  rules: {
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        // Disallow `const { props, state } = this`; true by default
        allowDestructuring: false,
        // Allow `const self = this`; `[]` by default
        allowedNames: ['self'],
      },
    ],

    /** Override */

    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    // https://github.com/import-js/eslint-plugin-import/issues/1639
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
      },
    ],
    'curly': ['error', 'all'],
  },
}

module.exports = config
