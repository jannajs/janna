import antfu from '@antfu/eslint-config'

import { isInEditorEnv } from '../utils'
import { getNextFlatConfigs } from './rules/next'
import { getPrettierSrcFlatConfigs, type GetPrettierSrcFlatConfigsOptions } from './rules/prettier-src'
import { getTailwindFlatConfigs } from './rules/tailwind'

import type { GetNextFlatConfigsOptions } from './rules/next'
import type { GetTailwindFlatConfigsOptions } from './rules/tailwind'

export interface JannaOptions extends GetNextFlatConfigsOptions, GetTailwindFlatConfigsOptions, GetPrettierSrcFlatConfigsOptions {
}

// 基于 @antfu/eslint-config 定制功能
// 旨在使得代码具备更好的交互性
export default async function janna(
  options: Parameters<typeof antfu>[0] & JannaOptions = {},
  ...userConfigs: Parameters<typeof antfu>[1][]
) {
  const { next, tailwind, prettierSrc, ...antfuOptions } = options

  const result = await antfu(
    {
      stylistic: prettierSrc
        ? false
        : {
            overrides: {
              'curly': ['error', 'all'],
              /** 自定义重写 */
              'style/brace-style': ['error', '1tbs'],
              // 总是添加小括号，方便扩展入参，后续不用手动添加小括号
              'style/arrow-parens': ['error', 'always'],
              // 能使用单引号的地方都使用单引号
              'style/jsx-quotes': ['error', 'prefer-single'],
              'style/jsx-self-closing-comp': isInEditorEnv() ? 'off' : 'warn',
            },
          },
      react: {
        overrides: {
          /** 自定义重写 */
          'react/prop-types': 'off',
          // ref: https://github.com/Rel1cx/eslint-react/issues/85
          'react/prefer-destructuring-assignment': 'error',
        },
      },
      vue: false,
      formatters: {
        // 禁用 prettier 内部通过 eslint-plugin-format 格式化 CSS HTML 和 Markdown
        // 同时 VS Code 开启 eslint 校验以下格式，使得保存时能够自动格式化处理
        /**
         * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
         * By default uses Prettier
         */
        css: true,
        /**
         * Format HTML files
         * By default uses Prettier
         */
        html: true,
        svg: true,
        /**
         * Format Markdown files
         * Supports Prettier and dprint
         * By default uses Prettier
         */
        markdown: 'prettier',
        prettierOptions: {
          endOfLine: 'lf',
        },
      },
      ...antfuOptions,
    },
    getNextFlatConfigs({ next }),
    getTailwindFlatConfigs({ tailwind }),
    getPrettierSrcFlatConfigs({ prettierSrc }),
    {
      // 交互优化
      rules: {
        /** 自定义重写 */
        // 关闭变量未使用校验，避免后续使用时还得去除前缀，如果保留前缀来使用也很奇怪
        'unused-imports/no-unused-vars': 'off',
        'perfectionist/sort-imports': ['error', {
          groups: [
            'builtin',
            'external',
            'type',
            ['internal', 'internal-type'],
            ['parent', 'sibling', 'index'],
            ['parent-type', 'sibling-type', 'index-type'],
            'side-effect',
            'object',
            'unknown',
          ],
          newlinesBetween: 'always',
          order: 'asc',
          type: 'natural',
        }],
        /** 自定义新增 */
        // https://github.com/prettier/prettier/issues/8207
        'unicorn/template-indent': ['warn', { tags: [], functions: [], selectors: ['TemplateLiteral'] }],
        'unicorn/no-lonely-if': 'warn',
        'unicorn/custom-error-definition': 'warn',
      },
    },
    ...userConfigs,
  )
  return result
}
