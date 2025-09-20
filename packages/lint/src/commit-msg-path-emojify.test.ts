import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock fs and logger before importing the module under test
vi.mock('zx', () => ({
  fs: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}))
vi.mock('./log', () => ({
  getLogger: () => ({ warn: vi.fn(), info: vi.fn() }),
}))
vi.mock('@commitlint/is-ignored', () => ({ default: vi.fn() }))

// import after mocks (top-level await is fine in ESM test runner)
const { commitMsgPathEmojify } = await import('./commit-msg-path-emojify')
const mockedFs = vi.mocked((await import('zx')).fs)
const mockedIsIgnored = vi.mocked((await import('@commitlint/is-ignored')).default)

describe('commitMsgPathEmojify - usability tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds emoji to a simple type: message', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('feat: new feature')
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(path, '✨ feat: new feature')
  })

  it('adds emoji to a scoped type message', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('fix(auth): fix login')
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(path, '🐛 fix(auth): fix login')
  })

  it('keeps correct emoji', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('✨ feat: already emoji')
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).not.toHaveBeenCalled()
  })

  it('replaces incorrect emoji with correct one', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('🐛 feat: wrong emoji')
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(path, '✨ feat: wrong emoji')
  })

  it('skips unsupported types', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('unknown: something')
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).not.toHaveBeenCalled()
  })

  it('skips messages without colon prefix', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('feat add new')
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).not.toHaveBeenCalled()
  })

  it('respects ignored messages', () => {
    const path = '/tmp/msg'
    mockedFs.readFileSync.mockReturnValue('feat: skip me')
    mockedIsIgnored.mockReturnValue(true)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).not.toHaveBeenCalled()
  })

  it('handles multi-line messages preserving body', () => {
    const path = '/tmp/msg'
    const original = 'feat: header\n\nbody line'
    mockedFs.readFileSync.mockReturnValue(original)
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(path, '✨ feat: header\n\nbody line')
  })

  it('handles very long subject', () => {
    const path = '/tmp/msg'
    const long = 'a'.repeat(500)
    mockedFs.readFileSync.mockReturnValue(`feat: ${long}`)
    mockedIsIgnored.mockReturnValue(false)

    commitMsgPathEmojify(path)

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(path, `✨ feat: ${long}`)
  })
})
