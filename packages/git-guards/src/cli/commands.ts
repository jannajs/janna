import process from 'node:process'

import { program } from '@commander-js/extra-typings'
import consola from 'consola'
import { fs, path } from 'zx'

import { loadJannaGitConfig } from '../config/load'
import { mergeGuards } from '../merge-guards'

program.command('merge').requiredOption('-f, --file <file>').action(async (options) => {
  const gitConfig = await loadJannaGitConfig()
  const {
    // .git/COMMIT_EDITMSG
    // .git/MERGE_MSG
    file,
  } = options

  const gitMessage = await fs.readFile(path.join(process.cwd(), file), 'utf-8')

  try {
    await mergeGuards(
      gitMessage,
      gitConfig.mergeGuards,
    )
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
