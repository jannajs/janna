import { path } from 'zx'

import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import type { UserConfig } from 'vite'
import baseConfig from './vite.base.config'

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [dts({
    exclude: 'src/templates/**',
  })],
  build: {
    minify: false,
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.ts'),
        path.resolve(__dirname, 'src/bin/index.ts'),
        path.resolve(__dirname, 'src/eslint/index.ts'),
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
          entryFileNames: '[name].js',
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
      external: [/node_modules/, /^node:.*$/],
    },
    target: 'esnext',
  },
} as UserConfig)
