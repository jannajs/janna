import { parserPlain } from '@antfu/eslint-config'

import { GLOB_SVG } from '../../globs'

import type { Linter } from 'eslint'

export function getSvgFlatConfigs() {
  return {
    files: [GLOB_SVG],
    languageOptions: {
      parser: parserPlain,
    },
    name: 'janna/formatter/svg',
    rules: {
      'format/prettier': [
        'error',
        {
          parser: 'html',
        },
      ],
    },
  }satisfies Linter.Config
}
