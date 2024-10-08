import { fileURLToPath } from 'node:url'

import { chalk, fs, path } from 'zx'

import {
  generateCommitLintConfig,
  generateEditorConfig,
  generateESLintConfig,
  installPeerDependencies,
  preparePackageJson,
} from '../core'
import { getLogger } from '../log'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function init() {
  const logger = getLogger()

  generateEditorConfig()
  logger.info(
    chalk.bold('Generate editor config [.editorconfig] done'),
  )

  await installPeerDependencies()
  logger.info(
    chalk.bold('Install peer dependencies done'),
  )
  generateESLintConfig()
  logger.info(
    chalk.bold('Generate eslint config [eslint.config.ts] done'),
  )

  generateCommitLintConfig()
  logger.info(
    chalk.bold('Generate commitlint config [commitlint.config.ts] done'),
  )

  await preparePackageJson()
  logger.info(
    chalk.bold('Prepare [package.json] done'),
  )

  const { name, version } = fs.readJsonSync(
    path.join(__dirname, '../..', 'package.json'),
  )
  logger.info('\n')
  logger.info(chalk.bold(`${name} v${version}`))
  logger.info('\n')
}
