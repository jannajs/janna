import { defineConfig } from 'tsup'
import fs from 'fs-extra'

fs.rmSync('dist', {
  force: true,
  recursive: true,
})

export default defineConfig({
  entry: [
    'src/eslint.ts',
    'src/eslint-import.ts',
    'src/config.ts',
    'src/configBin.ts',
    'src/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'esno scripts/copy.ts',
})
