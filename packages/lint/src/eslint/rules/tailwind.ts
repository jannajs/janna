import { FlatCompat } from '@eslint/eslintrc'

import { ALL_JS } from '../constants'

import type { Linter } from 'eslint'

const compat = new FlatCompat()

export interface GetTailwindFlatConfigsOptions {
  /**
   * Requires installing:
   * - `eslint-plugin-tailwindcss`
   *
   * 常规单仓库单项目直接设置为 true 即可，如果是 monorepo 可通过 dirs 配置相关目录，例如：
   *
   * dirs: ["demos/with-nextjs"]
   */
  tailwind?: boolean | {
    dirs: string[]
  }
}

export function getTailwindFlatConfigs(
  options: GetTailwindFlatConfigsOptions = {},
) {
  const { tailwind } = options

  const rules: Linter.FlatConfig[] = []

  if (!tailwind) {
    return rules
  }

  if (typeof tailwind === 'object') {
    rules.push(...compat.config({
      // eslint-plugin-tailwindcss
      extends: ['plugin:tailwindcss/recommended'],
      rules: {
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/migration-from-tailwind-2': 'off',
      },
    }).map((item) => {
      return {
        ...item,
        files: tailwind.dirs.filter(Boolean).map((dirItem) => {
          if (dirItem === '.') {
            return ALL_JS
          }

          // html 格式需要等到 @angular-eslint/template-parser 适配
          return `${dirItem}/${ALL_JS}`
        }),
      } satisfies Linter.FlatConfig
    }))
    return rules
  }

  return getTailwindFlatConfigs({
    tailwind: {
      dirs: ['.'],
    },
  })
}
