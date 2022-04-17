import chalk from 'chalk'

import { name, version } from '../package.json'

import {
  generateEditorConfig,
  generatePrettierConfig,
  generateESLintConfig,
  checkESLintDeps,
} from './config'

function start() {
  generateEditorConfig()
  console.log(
    chalk.green(
      '[janna:lint] Generate editor config `.editorconfig` successful.',
    ),
  )
  generatePrettierConfig()
  console.log(
    chalk.green(
      '[janna:lint] Generate prettier config `.prettierrc.yaml` successful.',
    ),
  )
  checkESLintDeps()
  generateESLintConfig()
  console.log(
    chalk.green(
      '[janna:lint] Generate eslint config `.eslintrc.yaml` successful.',
    ),
  )

  console.log(chalk.bold(`${name} v${version}`))
}

start()
