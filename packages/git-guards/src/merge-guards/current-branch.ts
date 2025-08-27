import { ensureCurrentBranch, ensureMergeFromBranch } from '../helpers/git'

export async function guardFromCurrentBranch(gitMsg: string, remotes: string[] = ['origin']) {
  const currentBranch = await ensureCurrentBranch()
  const mergeFromBranch = ensureMergeFromBranch(gitMsg)

  if (
    [
      ...remotes.map((item) => {
        return `${item}/${currentBranch}`
      }),
      mergeFromBranch,
    ].includes(currentBranch)) {
    throw new Error(`Unexpected merge from the brach: ${mergeFromBranch}`)
  }
}
