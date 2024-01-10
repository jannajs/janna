import type { Linter } from 'eslint'

const config: Linter.Config = {
  rules: {
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-this-alias.md
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        // Disallow `const { props, state } = this`; true by default
        allowDestructuring: false,
        // Allow `const self = this`; `[]` by default
        allowedNames: ['self'],
      },
    ],
    // https://typescript-eslint.io/rules/ban-types/
    '@typescript-eslint/ban-types': 'error',
    // https://eslint.org/docs/latest/rules/curly
    'curly': ['error', 'all'],
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': [1, 'always'],
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
    'react/self-closing-comp': 1,
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    'react/no-unknown-property': 1,
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md
    'unicorn/custom-error-definition': 1,
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md
    'unicorn/no-lonely-if': 1,
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/template-indent.md
    // https://github.com/prettier/prettier/issues/8207
    'unicorn/template-indent': [
      1,
      { tags: [], functions: [], selectors: ['TemplateLiteral'] },
    ],
  },
}

export default config
