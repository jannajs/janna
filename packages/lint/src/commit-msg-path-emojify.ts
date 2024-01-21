import { fs } from 'zx'
import _isIgnored from '@commitlint/is-ignored'

/** ref: https://github.com/vitejs/vite-plugin-react-pages/issues/64#issuecomment-1222089552 */
const isIgnored = ((_isIgnored as any).default
  || _isIgnored) as typeof _isIgnored

const emojiMap = {
  feat: '✨',
  fix: '🐛',
  docs: '📚',
  style: '💎',
  refactor: '📦',
  perf: '🚀',
  test: '🚨',
  build: '🛠',
  ci: '⚙️',
  chore: '♻️',
  revert: '🗑',
}

export function commitMsgPathEmojify(msgPath: string) {
  const msg = fs.readFileSync(msgPath, 'utf-8').trim()

  if (isIgnored(msg)) {
    return
  }

  const key = Object.keys(emojiMap).find((item) => msg.startsWith(item)) as
    | keyof typeof emojiMap
    | undefined

  if (key) {
    fs.writeFileSync(msgPath, `${emojiMap[key]} ${msg}`)
  }
}
