import { loadConfig } from 'c12'
import { z } from 'zod'

import { mergeGuardsSchema } from '../merge-guards'

export type BranchRules = (string | RegExp)[]

export const jannaGitSchema = z.object({
  mergeGuards: mergeGuardsSchema,
})

export type JannaGitConfigInput = z.input<typeof jannaGitSchema>
export type JannaGitConfigOutput = z.output<typeof jannaGitSchema>

export async function loadJannaGitConfig() {
  const { config } = await loadConfig<JannaGitConfigOutput>({
    name: 'git-guards',
    rcFile: false,
  })

  return config
}
