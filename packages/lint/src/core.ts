// 原子化工具函数集合，可供其他实现封装

import { fileURLToPath } from 'node:url'
import process from 'node:process'

import mrmCore from 'mrm-core'
import husky from 'husky'
import { $, fs, path } from 'zx'

import { getProjectRootFilePath, isMonorepo } from './utils'

import type packageJson from '../package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function copyPackageFile(fileName: string, renameTo = fileName) {
  fs.copyFileSync(
    path.join(__dirname, 'templates', fileName),
    `${process.cwd()}/${renameTo}`,
  )
}

export function generateEditorConfig() {
  const configFileName = '.editorconfig'
  copyPackageFile(configFileName)
}

export function generatePrettierConfig() {
  const configFileName = '.prettierrc.mjs'
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
  const { peerDependencies, devDependencies } = fs.readJsonSync(
    path.join(__dirname, '..', 'package.json'),
  ) as typeof packageJson

  const mergedPeerDependencies: Record<string, string> = {
    ...peerDependencies,
  }

  const deps = Object.keys(mergedPeerDependencies).map((peer) => {
    return `${peer}@${mergedPeerDependencies[peer as keyof typeof mergedPeerDependencies]}`
  })
  await installDevDependencies(deps)
}

export async function preparePackageJson() {
  const { name } = fs.readJsonSync(path.join(__dirname, '..', 'package.json'))

  await fs.ensureDir(getProjectRootFilePath('.husky'))

  husky()

  // ref: https://typicode.github.io/husky
  // Yarn 2+ doesn't support prepare lifecycle script
  const packageJson = mrmCore
    .packageJson()

  packageJson.setScript('prepare', 'husky install')
    .setScript('lint', `eslint --flag unstable_ts_config .`)
    .setScript('lint:fix', `eslint --flag unstable_ts_config --fix .`)

  packageJson.set('lint-staged', {
    [`*`]: 'eslint --fix',
  })

  packageJson.save()

  const preCommitFile = path.join(process.cwd(), '.husky/pre-commit')
  const commitMsgFile = path.join(process.cwd(), '.husky/commit-msg')

  await Promise.all([
    fs.writeFile(preCommitFile, 'npx --no -- lint-staged', 'utf-8'),
    fs.writeFile(commitMsgFile, ['npx --no -- commitlint --edit $1', `npx --no -- ${name} emojify $1`].join(
      '\n',
    ), 'utf-8'),
  ])
}
