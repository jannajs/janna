import { GLOB_SRC, parserPlain } from '@antfu/eslint-config'

import type { OptionsFormatters } from '@antfu/eslint-config'
import type { Linter } from 'eslint'

type PrettierOptions = Required<OptionsFormatters>['prettierOptions']

export interface GetPrettierSrcFlatConfigsOptions {
  /** 是否使用 prettier 代替 https://eslint.style/ */
  prettierSrc?: PrettierOptions | boolean
}

export function getPrettierSrcFlatConfigs(options: GetPrettierSrcFlatConfigsOptions = {}) {
  const { prettierSrc } = options

  if (!prettierSrc) {
    return []
  }

  return {
    files: [GLOB_SRC],
    languageOptions: {
      parser: parserPlain,
    },
    name: 'janna/formatter/src',
    rules: {
      'format/prettier': [
        'error',
        // ref: https://github.com/antfu/eslint-config/blob/main/src/configs/formatters.ts#L43 prettierOptions
        {
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'all',
          endOfLine: 'lf',
          quoteProps: 'consistent',
          jsxSingleQuote: true,
          semi: false,
          useTabs: false,
          ...(typeof prettierSrc === 'boolean' ? {} : prettierSrc),
        } satisfies PrettierOptions,
      ],
    },
  } satisfies Linter.Config
}
