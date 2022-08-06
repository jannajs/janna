import chalk from 'chalk'
import consola from 'consola'

import { name, version } from '../../package.json'
import {
  configureLintStaged,
  generateESLintConfig,
  generateEditorConfig,
  generatePrettierConfig,
  installEslint,
  installLintStaged,
  installPrettier,
} from '../core'

export default async function init() {
  generateEditorConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate editor config `.editorconfig` done'),
  )

  await installPrettier()
  consola.info(chalk.green('[janna:lint]'), chalk.bold('install prettier done'))

  generatePrettierConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate prettier config `.prettierrc.yaml` done'),
  )

  await installEslint()
  consola.info(chalk.green('[janna:lint]'), chalk.bold('install eslint done'))

  generateESLintConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate eslint config `.eslintrc.yaml` done'),
  )

  await installLintStaged()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('install lint-staged done'),
  )

  configureLintStaged()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('configure lint-stage done'),
  )

  consola.info('\n')
  consola.info(chalk.bold(`${name} v${version}`))
  consola.info('\n')
}
