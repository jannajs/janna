import { describe, expect, it } from 'vitest'

import { ensureMergeFromBranch } from './git'

describe('getMergeFromBranch', () => {
  const examples = [
    { msg: 'Merge branch \'test\'', branch: 'test' },
    { msg: 'Merge branch \'master\'', branch: 'master' },
  ]

  examples.forEach((item) => {
    it(item.msg, () => {
      expect(ensureMergeFromBranch(item.msg)).toBe(item.branch)
    })
  })
})
