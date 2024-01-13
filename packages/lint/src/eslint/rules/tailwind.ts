import type { Linter } from 'eslint'

import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export interface GetTailwindFlatConfigsOptions {
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
          // html 格式需要等到 @angular-eslint/template-parser 适配
          return `${dirItem}/**/*.{js?(x),ts?(x)}`
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
