import { ensureCurrentBranch, ensureMergeFromBranch } from '../helpers/git'

export async function guardFromCurrentBranch(gitMsg: string) {
  const currentBranch = await ensureCurrentBranch()
  const mergeFromBranch = ensureMergeFromBranch(gitMsg)

  if (currentBranch === mergeFromBranch) {
    throw new Error(`Unexpected merge from the brach: ${mergeFromBranch}`)
  }
}
