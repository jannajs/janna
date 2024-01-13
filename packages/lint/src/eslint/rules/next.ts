import type { Linter } from 'eslint'

import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export interface GetNextFlatConfigsOptions {
  /**
   * 支持 @next/eslint-plugin-next
   *
   * 如果是 monorepo 可通过 dirs 配置相关目录，例如：
   *
   * dirs: ["demos/with-nextjs"]
   */
  next?: boolean | {
    dirs: string[]
  }
}

export function getNextFlatConfigs(
  options: GetNextFlatConfigsOptions = {},
) {
  const { next } = options

  const rules: Linter.FlatConfig[] = []

  if (!next) {
    return rules
  }

  if (typeof next === 'object') {
    // 使用 compat.config('next') 报错
    rules.push(...compat.plugins('@next/next').map((item) => {
      const dirs = next.dirs.filter(Boolean)
      return {
        ...item,
        files: dirs.map((dirItem) => {
          return `${dirItem}/**/*.{js?(x),ts?(x)}`
        }),
        // Customized from https://unpkg.com/@next/eslint-plugin-next@14.0.4/dist/index.js
        rules: {
          // warnings
          '@next/next/google-font-display': 'warn',
          '@next/next/google-font-preconnect': 'warn',
          '@next/next/next-script-for-ga': 'warn',
          '@next/next/no-async-client-component': 'warn',
          '@next/next/no-before-interactive-script-outside-document': 'warn',
          '@next/next/no-css-tags': 'warn',
          '@next/next/no-head-element': 'warn',
          // '@next/next/no-html-link-for-pages': 'warn',
          '@next/next/no-img-element': 'warn',
          '@next/next/no-page-custom-font': 'warn',
          '@next/next/no-styled-jsx-in-document': 'warn',
          // '@next/next/no-sync-scripts': 'warn',
          '@next/next/no-title-in-document-head': 'warn',
          '@next/next/no-typos': 'warn',
          '@next/next/no-unwanted-polyfillio': 'warn',
          // errors
          '@next/next/inline-script-id': 'error',
          '@next/next/no-assign-module-variable': 'error',
          '@next/next/no-document-import-in-page': 'error',
          '@next/next/no-duplicate-head': 'error',
          '@next/next/no-head-import-in-document': 'error',
          '@next/next/no-script-component-in-head': 'error',
          // next/core-web-vitals
          '@next/next/no-html-link-for-pages': ['error', dirs],
          '@next/next/no-sync-scripts': 'error',

          // Next.js 规范可以导出多个对象
          'react-refresh/only-export-components': 'off',
        } satisfies Linter.RulesRecord,
      }
    }))
    return rules
  }

  return getNextFlatConfigs({
    next: {
      dirs: ['.'],
    },
  })
}
