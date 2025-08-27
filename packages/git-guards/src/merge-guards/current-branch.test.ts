import { describe, expect, it, vi } from 'vitest'

import * as gitHelpers from '../helpers/git'
import { guardFromCurrentBranch } from './current-branch'

describe('guardFromCurrentBranch', () => {
  it('should throw error when merging from current branch', async () => {
    const currentBranch = 'main'
    const gitMsg = `Merge branch '${currentBranch}'`
    vi.spyOn(gitHelpers, 'ensureCurrentBranch').mockResolvedValue(currentBranch)
    vi.spyOn(gitHelpers, 'ensureMergeFromBranch').mockReturnValue(currentBranch)
    await expect(guardFromCurrentBranch(gitMsg)).rejects.toThrow('Unexpected merge from the branch: main')
  })

  it('should throw error when merging from origin current branch', async () => {
    const currentBranch = 'main'
    const gitMsg = `Merge branch 'origin/${currentBranch}'`
    vi.spyOn(gitHelpers, 'ensureCurrentBranch').mockResolvedValue(currentBranch)
    vi.spyOn(gitHelpers, 'ensureMergeFromBranch').mockReturnValue(`origin/${currentBranch}`)
    await expect(guardFromCurrentBranch(gitMsg)).rejects.toThrow('Unexpected merge from the branch: origin/main')
  })

  it('should not throw error when merging from other branch', async () => {
    const currentBranch = 'main'
    const mergeFromBranch = 'feature-1'
    const gitMsg = `Merge branch '${mergeFromBranch}'`
    vi.spyOn(gitHelpers, 'ensureCurrentBranch').mockResolvedValue(currentBranch)
    vi.spyOn(gitHelpers, 'ensureMergeFromBranch').mockReturnValue(mergeFromBranch)
    await expect(guardFromCurrentBranch(gitMsg)).resolves.toBeUndefined()
  })
})
