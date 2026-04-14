import { loadConfig } from 'c12'
import { z } from 'zod'

import { mergeGuardsSchema } from '../merge-guards'

import type { MergeGuardsInput, MergeGuardsOptions } from '../merge-guards'

export type BranchRules = (string | RegExp)[]

export interface JannaGitConfigInput {
  mergeGuards?: MergeGuardsInput
}

export interface JannaGitConfigOutput {
  mergeGuards: MergeGuardsOptions
}

export const jannaGitSchema = z.object({
  mergeGuards: mergeGuardsSchema,
}) satisfies z.ZodType<JannaGitConfigOutput, any, JannaGitConfigInput>

export async function loadJannaGitConfig() {
  const { config } = await loadConfig<JannaGitConfigOutput>({
    name: 'git-guards',
    defaultConfig: jannaGitSchema.parse({}),
    rcFile: false,
  })

  return config
}
