import chalk from 'chalk'

import { name, version } from '../package.json'

import {
  generateEditorConfig,
  generatePrettierConfig,
  generateESLintConfig,
  installLintStage,
  configureLintStaged,
} from './config'

async function start() {
  generateEditorConfig()
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate editor config `.editorconfig` done'),
  )

  generatePrettierConfig()
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate prettier config `.prettierrc.yaml` done'),
  )

  generateESLintConfig()
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate eslint config `.eslintrc.yaml` done'),
  )

  await installLintStage()
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold('install lint-stage done'),
  )

  configureLintStaged()
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold('configure lint-stage done'),
  )

  console.log('\n')
  console.log(chalk.bold(`${name} v${version}`))
  console.log('\n')
}

start()
