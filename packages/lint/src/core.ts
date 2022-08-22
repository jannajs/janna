// 原子化工具函数集合，可供其他实现封装

import path from 'path'

import fse from 'fs-extra'
import { packageJson } from 'mrm-core'
import * as husky from 'husky'
import * as execa from 'execa'

import { name as packageName, peerDependencies } from '../package.json'

import { isMonorepo, isNextProject } from './utils'

function generateConfig(fileName: string) {
  fse.copyFileSync(
    path.join(__dirname, '..', fileName),
    `${process.cwd()}/${fileName}`,
  )
}

export function generateEditorConfig() {
  const configFileName = '.editorconfig'
  generateConfig(configFileName)
}

export function generatePrettierConfig() {
  const configFileName = '.prettierrc.yaml'
  generateConfig(configFileName)
}

export function generateESLintConfig() {
  let configFileName = '.eslintrc.yaml'

  if (isNextProject) {
    configFileName = '.eslintrc-next.yaml'
  }

  fse.copyFileSync(
    path.join(__dirname, 'templates', configFileName),
    `${process.cwd()}/.eslintrc.yaml`,
  )
}

export async function installDevDependency(dep: string) {
  let command = `ni -D ${dep}`
  if (isMonorepo) {
    command = `ni -Dw ${dep}`
  }

  execa.commandSync(command, {
    stdio: 'inherit',
  })
}

export async function installPrettier() {
  await installDevDependency(`prettier@${peerDependencies.prettier}`)
}

export async function installEslint() {
  await installDevDependency(`eslint@${peerDependencies.eslint}`)
}

export async function installHusky() {
  await installDevDependency(`husky`)
}

export async function installLintStaged() {
  await installDevDependency(`lint-staged`)
  await installHusky()
}

/**
 * 保证其他实现可基于该函数封装，因此需要支持传入 cliName
 *
 * @param cliName
 */
export function configureLintStaged(cliName = packageName) {
  // prettier-ignore
  const prettierExts = ['js', 'jsx', 'tsx', 'ts', 'css', 'less', 'scss', 'sass', 'md', 'yaml']
  const eslintExts = ['js', 'jsx', 'ts', 'tsx']

  husky.install()

  // ref: https://typicode.github.io/husky
  // Yarn 2+ doesn't support prepare lifecycle script
  packageJson()
    .setScript('prepare', 'husky install')
    .setScript('lint-staged', 'lint-staged')
    .setScript('lint-staged:lint', 'eslint')
    .setScript(
      'lint',
      `eslint --cache --ext ${eslintExts
        .map((item) => `.${item}`)
        .join(',')} .`,
    )
    .setScript(
      'lint:fix',
      `eslint --fix --ext ${eslintExts.map((item) => `.${item}`).join(',')} .`,
    )
    .setScript(
      'prettier',
      `prettier --check --write "**/*.(${prettierExts.join('|')})"`,
    )
    .set('lint-staged', {
      [`**/*.{${eslintExts.join(',')}}`]: 'npm run lint-staged:lint',
      [`**/*.{${prettierExts.join(',')}}`]: ['prettier --write'],
    })
    .save()

  husky.set('.husky/pre-commit', ['npx lint-staged'].join('\n'))

  husky.set(
    '.husky/prepare-commit-msg',
    [`npx ${cliName} prepare-commit-msg $1`].join('\n'),
  )

  husky.set('.husky/commit-msg', [`npx ${cliName} verify-commit $1`].join('\n'))
}
