import consola from 'consola'

import { checkBranch, ensureMergeFromBranch } from '../helpers/git'

import type { MergeGuardsOptions } from '.'

export async function guardFromOtherBranches(gitMsg: string, options: MergeGuardsOptions) {
  const mergeFromBranch = ensureMergeFromBranch(gitMsg)
  consola.log(`Parsed merge from branch: ${mergeFromBranch}`)

  if (checkBranch(options.blacklist, mergeFromBranch)) {
    throw new Error(`Unexpected merge from the branch: ${mergeFromBranch}`)
  }
}
