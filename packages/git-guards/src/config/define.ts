import { jannaGitSchema } from './load'

import type { JannaGitConfigInput } from './load'

export function defineConfig(config: JannaGitConfigInput) {
  const result = jannaGitSchema.parse(config)
  return result
}
