import tsconfigPaths from 'vite-tsconfig-paths'

import type { UserConfig } from 'vite'

// https://vitejs.dev/config/
const config: UserConfig = {
  plugins: [tsconfigPaths()],
}

export default config
