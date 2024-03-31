// 原子化工具函数集合，可供其他实现封装

import { fileURLToPath } from 'node:url'
import process from 'node:process'

import mrmCore from 'mrm-core'
import husky from 'husky'
import { $, fs, path } from 'zx'

import { isMonorepo } from './utils'

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

export interface GenerateESLintConfig extends InstallPeerDependenciesOptions {
  prettier?: boolean
}

export function generateESLintConfig(options: GenerateESLintConfig = {}) {
  const { prettier } = options
  const trueName = 'eslint.config.ts'
  const configFileName = prettier ? 'eslint.config.with-eslint.ts' : trueName
  copyPackageFile(configFileName, trueName)
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

export interface InstallPeerDependenciesOptions {
  prettier?: boolean
}

export async function installPeerDependencies(options: InstallPeerDependenciesOptions = {}) {
  const { prettier } = options

  const { peerDependencies, devDependencies } = fs.readJsonSync(
    path.join(__dirname, '..', 'package.json'),
  ) as typeof packageJson

  const mergedPeerDependencies: Record<string, string> = {
    ...peerDependencies,
    // 如果在 peerDependencies 设置 eslint: 'npm:eslint-ts-patch@^8.56.0-0'
    // 目前 pnpm 安装依赖会报警告：
    //
    // WARN Issues with peer dependencies found
    // .
    // └─┬ @jannajs/lint 3.0.0-next.0
    //   └── ✕ unmet peer eslint@npm:eslint-ts-patch@^8.56.0-0: found 8.56.0-0
    //
    // 因此将 patch 逻辑放到代码中
    eslint: devDependencies.eslint,
  }

  if (prettier) {
    mergedPeerDependencies.prettier = devDependencies.prettier
  }

  const deps = Object.keys(mergedPeerDependencies).map((peer) => {
    return `${peer}@${mergedPeerDependencies[peer as keyof typeof mergedPeerDependencies]}`
  })
  await installDevDependencies(deps)
}

export interface PreparePackageJsonOptions extends InstallPeerDependenciesOptions {
}

export async function preparePackageJson(options: PreparePackageJsonOptions = {}) {
  const { prettier } = options

  const { name } = fs.readJsonSync(path.join(__dirname, '..', 'package.json'))

  husky()

  // ref: https://typicode.github.io/husky
  // Yarn 2+ doesn't support prepare lifecycle script
  const packageJson = mrmCore
    .packageJson()

  packageJson.setScript('prepare', 'husky install')
    .setScript('lint', `eslint .`)
    .setScript('lint:fix', `eslint --fix .`)

  if (prettier) {
    packageJson.setScript(
      'prettier',
        `prettier . --check`,
    )
      .setScript(
        'prettier:fix',
        `prettier . --write`,
      )
  }

  if (prettier) {
    // ref: https://github.com/lint-staged/lint-staged/issues/934#issuecomment-1097793208
    packageJson.set('lint-staged', {
      [`*,__parallel-1__`]: 'prettier --write',
      [`*,__parallel-2__`]: 'eslint --fix',
    })
  }
  else {
    packageJson.set('lint-staged', {
      [`*`]: 'eslint --fix',
    })
  }

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
