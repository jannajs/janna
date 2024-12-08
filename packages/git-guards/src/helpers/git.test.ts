import { describe, expect, it } from 'vitest'

import { ensureMergeFromBranch } from './git'

describe('ensureMergeFromBranch', () => {
  const examples = [
    { msg: `Merge branch 'test' of ...`, branch: 'test' },
    { msg: `Merge branch 'master' of ...`, branch: 'master' },
    { msg: `Merge remote-tracking branch 'origin/test' into ...`, branch: 'origin/test' },
  ]
  examples.forEach((item) => {
    it(item.msg, () => {
      expect(ensureMergeFromBranch(item.msg)).toBe(item.branch)
    })
  })
})
