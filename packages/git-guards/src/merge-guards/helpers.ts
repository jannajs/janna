import { checkBranch } from '../helpers/git'

import type { MergeGuardsOptions } from '.'

export function inWhitelist(branch: string, whitelist: MergeGuardsOptions['whitelist']) {
  return checkBranch(whitelist, branch)
}
