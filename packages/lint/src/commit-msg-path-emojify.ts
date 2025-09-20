import _isIgnored from '@commitlint/is-ignored'
import { fs } from 'zx'

import { getLogger } from './log'

/** ref: https://github.com/vitejs/vite-plugin-react-pages/issues/64#issuecomment-1222089552 */
const isIgnored = ((_isIgnored as any).default
  || _isIgnored) as typeof _isIgnored

/** Inspired by https://gitmoji.dev/ and https://github.com/folke/devmoji */
const emojiMap = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '🎨',
  refactor: '♻️',
  perf: '⚡️',
  test: '✅',
  build: '🏗️',
  ci: '👷',
  chore: '🔧',
}

export function commitMsgPathEmojify(msgPath: string) {
  const msg = fs.readFileSync(msgPath, 'utf-8').trim()

  if (isIgnored(msg)) {
    return
  }

  const logger = getLogger()

  // Simplified commit message pattern
  // Supported: type: | emoji type: | type(scope):
  const prefixPattern = /^([^\w\s]{1,2})?\s*(\w+)(?:\([^)]+\))?:/
  const match = msg.match(prefixPattern)

  if (!match) {
    logger.warn(`Unrecognized commit message format, skipping emojify.`)
    return
  }

  const [, existingEmoji, type] = match

  // Check if type is supported
  if (!(type in emojiMap)) {
    logger.warn(`Unsupported type: ${type}`)
    return
  }

  const correctEmoji = emojiMap[type as keyof typeof emojiMap]

  let newMsg: string

  if (existingEmoji) {
    if (existingEmoji === correctEmoji) {
      return
    } else {
      logger.warn(`Emoji is incorrect: ${existingEmoji} -> ${correctEmoji} ${type}`)
      const remainder = msg.slice(existingEmoji.length).trimStart()
      newMsg = `${correctEmoji} ${remainder}`
    }
  } else {
    logger.info(`Adding emoji: ${correctEmoji} ${type}`)
    newMsg = `${correctEmoji} ${msg}`
  }

  fs.writeFileSync(msgPath, newMsg)
}
