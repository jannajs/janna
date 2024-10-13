declare module 'eslint-plugin-tailwindcss' {
  import type { ESLint, Linter } from 'eslint'

  declare const eslintPluginTailwindCSS: ESLint.Plugin & {
    configs: {
      'flat/recommended': Linter.Config[]
      'recommended': Linter.LegacyConfig
    }
  }

  export = eslintPluginTailwindCSS
}

declare module '@next/eslint-plugin-next' {
  import type { ESLint, Linter } from 'eslint'

  declare const eslintPluginNext: ESLint.Plugin & {
    configs: {
      'recommended': Linter.Config
      'core-web-vitals': Linter.Config
    }
  }

  export = eslintPluginNext
}
