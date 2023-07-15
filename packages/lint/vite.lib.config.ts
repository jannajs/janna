import path from 'path'

import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { dependencies, peerDependencies } from './package.json'
import baseConfig from './vite.base.config'

import type { UserConfig } from 'vite'

const externalPackages = [dependencies, peerDependencies].flatMap((item) =>
  Object.keys(item || {}),
)

// Creating regexps of the packages to make sure subpaths of the
// packages are also treated as external
const regexpsOfPackages = externalPackages.map(
  (packageName) => new RegExp(`^${packageName}(/.*)?`),
)

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [dts({})],
  build: {
    minify: false,
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.ts'),
        path.resolve(__dirname, 'src/bin/index.ts'),
        path.resolve(__dirname, 'src/eslint.ts'),
      ],
    },
    rollupOptions: {
      // inspired from: https://github.com/vitejs/vite/discussions/1736#discussioncomment-2621441
      // preserveModulesRoot: https://rollupjs.org/guide/en/#outputpreservemodulesroot
      output: [
        {
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs',
          format: 'es',
          dynamicImportInCjs: true,
        },
        {
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          format: 'cjs',
        },
      ],
      external: [...regexpsOfPackages, /^node:.*$/],
    },
    target: 'esnext',
  },
} as UserConfig)