import { fileURLToPath } from 'node:url'
import { chalk, fs, path } from 'zx'

import consola from 'consola'

import {
  configureLintStaged,
  generateCommitLintConfig,
  generateESLintConfig,
  generateEditorConfig,
  installPeerDependencies,
} from '../core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

  const { name, version } = fs.readJsonSync(
    path.join(__dirname, '../..', 'package.json'),
  )
  consola.info('\n')
  consola.info(chalk.bold(`${name} v${version}`))
  consola.info('\n')
}
