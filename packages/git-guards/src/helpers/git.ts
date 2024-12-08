import { $ } from 'zx'

import type { BranchRules } from 'src/config/load'

export function execMergeMsg(msg: string, extraRules: RegExp[] = []) {
  const rules = [
    /Merge branch '(.+?)'/i,
    /Merge remote-tracking branch '(.+?)'/,
    ...extraRules,
  ]
  for (const rule of rules) {
    const match = rule.exec(msg)
    if (match) {
      return match
    }
  }
}

export function ensureMergeFromBranch(msg: string) {
  const result = execMergeMsg(msg)
  if (!result) {
    throw new Error('Parse merge from branch failed')
  }
  return result[1]
}

export function checkBranch(branches: BranchRules, input: string) {
  return branches.some((item) => {
    if (typeof item === 'string') {
      return item === input
    }
    return item.test(input)
  })
}

export async function ensureCurrentBranch() {
  const currentBranchResult = await $`git rev-parse --abbrev-ref HEAD`
  const currentBranch = currentBranchResult.stdout.trim()

  if (!currentBranch) {
    throw new Error('Parse current branch failed')
  }

  return currentBranch
}
