import consola from 'consola'

import type { ConsolaInstance } from 'consola'

let TAG = 'janna:lint'

export function setLoggerTag(tag: string) {
  TAG = tag
}

let logger: ConsolaInstance | null = null

export function getLogger() {
  logger ??= consola.withTag(TAG).withDefaults({
  // ref: https://github.com/unjs/consola#log-level
    level: 3,
  })

  return logger
}
