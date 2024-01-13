// 原子化工具函数集合，可供其他实现封装

import { fileURLToPath } from 'node:url'
import process from 'node:process'
import fse from 'fs-extra'
import mrmCore from 'mrm-core'
import * as husky from 'husky'
import { $, path } from 'zx'

import { isMonorepo } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function copyPackageFile(fileName: string) {
  fse.copyFileSync(
    path.join(__dirname, 'templates', fileName),
    `${process.cwd()}/${fileName}`,
  )
}

export function generateEditorConfig() {
  const configFileName = '.editorconfig'
  copyPackageFile(configFileName)
}

export function generateESLintConfig() {
  const configFileName = 'eslint.config.ts'
  copyPackageFile(configFileName)
}

export function generateCommitLintConfig() {
  const configFileName = 'commitlint.config.ts'
  copyPackageFile(configFileName)
}

export async function installDevDependencies(deps: string[]) {
  if (isMonorepo) {
    await $`ni -Dw ${deps}`
  }
  else {
    await $`ni -D ${deps}`
  }
}

export async function installPeerDependencies() {
  const { peerDependencies } = fse.readJsonSync(
    path.join(__dirname, '..', 'package.json'),
  )
  const deps = Object.keys(peerDependencies).map((peer) => {
    return `${peer}@${peerDependencies[peer as keyof typeof peerDependencies]}`
  })
  await installDevDependencies(deps)
}

/**
 * 保证其他实现可基于该函数封装，因此需要支持传入 cliName
 */
export function configureLintStaged(cliName?: string) {
  const { name } = fse.readJsonSync(path.join(__dirname, '..', 'package.json'))

  const mergedName = cliName || name

  husky.install()

  // ref: https://typicode.github.io/husky
  // Yarn 2+ doesn't support prepare lifecycle script
  mrmCore
    .packageJson()
    .setScript('prepare', 'husky install')
    .setScript('lint-staged', 'lint-staged')
    .setScript('lint-staged:lint', 'eslint')
    .setScript('lint', `eslint .`)
    .setScript('lint:fix', `eslint --fix .`)
    .set('lint-staged', {
      [`*`]: 'npm run lint-staged:lint',
    })
    .save()

  husky.set('.husky/pre-commit', ['npx lint-staged'].join('\n'))

  husky.set(
    '.husky/commit-msg',
    ['npx --no -- commitlint --edit $1', `npx ${mergedName} emojify $1`].join(
      '\n',
    ),
  )
}
