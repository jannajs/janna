import path from 'node:path'
import { fileURLToPath } from 'node:url'

import janna from '@jannajs/lint/eslint'

import '@antfu/eslint-config'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const config = janna({
  next: {
    rootDir: [
      'demos/with-nextjs',
    ],
    cwd: __dirname,
  },
  tailwind: {
    dirs: [
      'demos/with-nextjs',
    ],
  },
  react: false,
  ignores: [
    'bin',
    'dist',
  ],
})

export default config
