import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { path } from 'zx'

import type { UserConfig } from 'vite'

import baseConfig from './vite.base.config'

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [dts()],
  build: {
    minify: false,
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.ts'),
        path.resolve(__dirname, 'src/cli/index.ts'),
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
      ],
      external: (source, _, isResolved) => !(isResolved || /^[./]/.test(source)),
    },
    target: 'esnext',
  },
} as UserConfig)
