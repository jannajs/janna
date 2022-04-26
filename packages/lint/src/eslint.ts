import type { Linter } from 'eslint'

import { isTsProject } from './eslint-import'

const config: Linter.Config = {
  extends: [
    require.resolve('./eslint-import.js'),
    // https://github.com/umijs/fabric/blob/master/src/eslint.ts
    require.resolve('@umijs/fabric/dist/eslint'),
    // https://prettier.io/docs/en/related-projects.html#eslint-integrations
    // `eslint-config-prettier`, turns off all ESLint rules that are unnecessary or might conflict with Prettier
    'prettier',
  ],
  rules: {
    ...(isTsProject
      ? {
          '@typescript-eslint/no-this-alias': [
            'error',
            {
              // Disallow `const { props, state } = this`; true by default
              allowDestructuring: false,
              // Allow `const self = this`; `[]` by default
              allowedNames: ['self'],
            },
          ],
          '@typescript-eslint/no-empty-interface': [
            0,
            {
              'import/no-named-as-default-member': 0,
            },
          ],
          '@typescript-eslint/consistent-type-imports': [
            1,
            {
              disallowTypeAnnotations: false,
            },
          ],
          '@typescript-eslint/triple-slash-reference': [
            0,
            {
              'no-unused-expressions': 'off',
            },
          ],
        }
      : {}),
  },
}

module.exports = config
