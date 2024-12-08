// 实现参考：https://github.com/unjs/changelogen/blob/main/src/config.ts

import { loadConfig } from 'c12'
import { z } from 'zod'

import { mergeGuardsSchema } from '../merge-guards'

export type BranchRules = (string | RegExp)[]

const jannaGitSchema = z.object({
  mergeGuards: mergeGuardsSchema,
})

export type JannaGitConfigInput = z.input<typeof jannaGitSchema>
export type JannaGitConfigOutput = z.output<typeof jannaGitSchema>

function getDefaultConfig() {
  return jannaGitSchema.parse({})
}

export async function loadJannaGitConfig() {
  const defaults = getDefaultConfig()
  const { config } = await loadConfig({
    name: 'git-guards',
    defaults,
    rcFile: false,
  })

  return jannaGitSchema.parse(config)
}
