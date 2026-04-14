import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

const mockReadFile = vi.fn().mockResolvedValue('Merge branch \'feature\'')

vi.mock('zx', () => ({
  fs: { readFile: mockReadFile },
  path,
}))

vi.mock('../config/load', () => ({
  loadJannaGitConfig: vi.fn().mockResolvedValue({
    mergeGuards: {
      remotes: ['origin'],
      extraExtractRules: [],
      blacklist: ['test', 'origin/test'],
      disabledFromCurrentBranch: true,
      whitelist: [],
    },
  }),
}))

vi.mock('../merge-guards', async (importOriginal) => {
  const original = await importOriginal<typeof import('../merge-guards')>()
  return {
    ...original,
    mergeGuards: vi.fn(),
  }
})

describe('merge command file resolution', () => {
  afterEach(() => {
    mockReadFile.mockClear()
  })

  it('should resolve absolute path correctly (worktree scenario)', async () => {
    const absolutePath = '/home/user/.git/worktrees/feature/MERGE_MSG'
    const program = (await import('./commands')).default
    await program.parseAsync(['node', 'git-guards', 'merge', '-f', absolutePath])

    expect(mockReadFile).toHaveBeenCalledWith(absolutePath, 'utf-8')
  })

  it('should resolve relative path from cwd', async () => {
    const relativePath = '.git/MERGE_MSG'
    const program = (await import('./commands')).default
    await program.parseAsync(['node', 'git-guards', 'merge', '-f', relativePath])

    expect(mockReadFile).toHaveBeenCalledWith(path.resolve(relativePath), 'utf-8')
  })
})
