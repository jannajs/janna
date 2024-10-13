import { GLOB_SRC } from '@antfu/eslint-config'

import type { Linter } from 'eslint'

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

export async function getTailwindFlatConfigs(
  options: GetTailwindFlatConfigsOptions = {},
) {
  const { tailwind } = options

  const rules: Linter.Config[] = []

  if (!tailwind) {
    return rules
  }

  if (typeof tailwind === 'object') {
    const eslintPluginTailwindCSS = await import('eslint-plugin-tailwindcss')
    const files = tailwind.dirs.filter(Boolean).map((dirItem) => {
      if (dirItem === '.') {
        return GLOB_SRC
      }

      // html 格式需要等到 @angular-eslint/template-parser 适配
      return `${dirItem}/${GLOB_SRC}`
    })

    rules.push(...eslintPluginTailwindCSS.configs['flat/recommended'].map((item) => {
      return {
        ...item,
        files,
      }
    }))
    rules.push({
      name: 'janna/tailwind',
      files,
      rules: {
        'tailwindcss/no-custom-classname': 'off',
      },
    })
    return rules
  }

  return getTailwindFlatConfigs({
    tailwind: {
      dirs: ['.'],
    },
  })
}
