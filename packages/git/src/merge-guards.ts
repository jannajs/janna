import consola from 'consola'
import { z } from 'zod'

import { checkBranch, ensureCurrentBranch, ensureMergeFromBranch, execMergeGitMsg } from './helpers/git'

export const mergeGuardsSchema = z.object({
  /** 禁止从符合该规则的分支合并 */
  blacklist: z.array(z.string().or(
    // ref: https://github.com/colinhacks/zod/issues/2735#issuecomment-1729976740
    z.instanceof(RegExp),
  )).default([]),
  disabledFromCurrentBranch: z.boolean().default(true),
  /** 符合该规则的分支不受合并守卫限制 */
  whitelist: z.array(z.string().or(
    // ref: https://github.com/colinhacks/zod/issues/2735#issuecomment-1729976740
    z.instanceof(RegExp),
  )).default([]),
})

export type MergeGuardsOptions = z.output<typeof mergeGuardsSchema>

export async function mergeGuards(gitMsg: string, options: MergeGuardsOptions) {
  if (!execMergeGitMsg(gitMsg)) {
    return
  }

  consola.log(`Merge commit message: ${gitMsg}`)

  const currentBranch = await ensureCurrentBranch()
  if (checkBranch(options.whitelist, currentBranch)) {
    consola.log(`Current branch: $currentBranch} in whitelist`)
    return
  }

  const mergeFromBranch = ensureMergeFromBranch(gitMsg)
  consola.log(`Parsed merge from branch: ${mergeFromBranch}`)

  if (checkBranch(options.blacklist, mergeFromBranch)) {
    throw new Error(`Unexpected merge from the brach: ${mergeFromBranch}`)
  }
}
