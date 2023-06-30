import fse from 'fs-extra'
import isIgnored from '@commitlint/is-ignored'

const emojiMap = {
  build: '🛠',
  chore: '♻️',
  ci: '⚙️',
  docs: '📚',
  feat: '✨',
  fix: '🐛',
  perf: '🚀',
  refactor: '📦',
  revert: '🗑',
  style: '💎',
  test: '🚨',
  release: '🔖',
}

export function emojify(msgPath: string) {
  const msg = fse.readFileSync(msgPath, 'utf-8').trim()

  if (isIgnored(msg)) {
    return
  }

  const key = Object.keys(emojiMap).find((item) => msg.startsWith(item)) as
    | keyof typeof emojiMap
    | undefined

  if (key) {
    fse.writeFileSync(msgPath, `${emojiMap[key]} ${msg}`)
  }
}
