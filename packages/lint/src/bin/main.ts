import path from 'path'

import chalk from 'chalk'
import consola from 'consola'
import fse from 'fs-extra'

import { name } from '../../package.json'
import {
  configureLintStaged,
  generateCommitLintConfig,
  generateESLintConfig,
  generateEditorConfig,
  generatePrettierConfig,
  installPeerDependencies,
} from '../core'

export default async function init() {
  generateEditorConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate editor config `.editorconfig` done'),
  )

  await installPeerDependencies()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('install peer dependencies done'),
  )

  generatePrettierConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate prettier config `.prettierrc.yaml` done'),
  )

  generateESLintConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate eslint config `.eslintrc.yaml` done'),
  )

  generateCommitLintConfig()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('Generate commitlint config `commitlint.config.ts` done'),
  )

  configureLintStaged()
  consola.info(
    chalk.green('[janna:lint]'),
    chalk.bold('configure lint-stage done'),
  )

  const version = fse.readJsonSync(
    path.join(__dirname, '../..', 'package.json'),
  ).version
  consola.info('\n')
  consola.info(chalk.bold(`${name} v${version}`))
  consola.info('\n')
}
