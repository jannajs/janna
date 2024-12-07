import process from 'node:process'

import { program } from '@commander-js/extra-typings'
import consola from 'consola'

import { loadJannaGitConfig } from '../config/load'
import { mergeGuards } from '../merge-guards'

program.command('merge-guards').requiredOption('-m, --message <msg>').action(async (options) => {
  const gitConfig = await loadJannaGitConfig()

  try {
    await mergeGuards(options.message, gitConfig.mergeGuards)
  } catch (err) {
    consola.error(err)
    consola.info('╭──────────────────────────────────────')
    consola.info(`│ You should clean your workspace with:`)
    consola.info(`│     \`git merge --abort\``)
    consola.info(`│ And enure merge from branch correctly`)
    consola.info('╰──────────────────────────────────────')
    process.exit(1)
  }
})

export default program
