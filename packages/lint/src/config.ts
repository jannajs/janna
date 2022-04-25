import fs from 'fs'
import chalk from 'chalk'
import { packageJson } from 'mrm-core'
import * as husky from 'husky'

import { dependencies } from '../package.json'

function generateConfig(fileName: string) {
  fs.copyFileSync(`${__dirname}/../${fileName}`, `${process.cwd()}/${fileName}`)
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
  const configFileName = '.eslintrc.yaml'
  fs.copyFileSync(
    `${__dirname}/templates/${configFileName}`,
    `${process.cwd()}/${configFileName}`,
  )
}

type Execa = typeof import('execa')

export async function importExeca() {
  // https://github.com/microsoft/TypeScript/issues/43329#issuecomment-1008361973
  const importExeca = Function('return import("execa")')() as Promise<Execa>
  return new Promise<Execa>((resolve, reject) => {
    importExeca
      .then((execa) => {
        return resolve(execa)
      })
      .catch(reject)
  })
}

export async function installLintStage() {
  const execa = await importExeca()
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold(`install eslint@${dependencies.eslint}`),
  )
  execa.execaCommandSync(`ni -D eslint@${dependencies.eslint}`, {
    stdio: 'inherit',
  })
  console.log(
    chalk.green('[janna:lint]'),
    chalk.bold(`install prettier@${dependencies.prettier}`),
  )
  execa.execaCommandSync(`ni -D prettier@${dependencies.prettier}`, {
    stdio: 'inherit',
  })

  console.log(chalk.green('[janna:lint]'), chalk.bold('install lint-staged'))
  execa.execaCommandSync('npx mrm@2 lint-staged', {
    stdio: 'inherit',
  })
}

export function configureLintStaged() {
  packageJson()
    .setScript('lint-staged', 'lint-staged')
    .setScript('lint-staged:js', 'eslint --ext .js,.jsx,.ts,.tsx')
    .setScript(
      'lint:js',
      'eslint --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src',
    )
    .setScript(
      'lint:fix',
      'eslint --fix --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src',
    )
    .setScript('prettier', 'prettier --check --write "src/**/*"')
    .set('lint-staged', {
      '**/*.{js,jsx,ts,tsx}': 'npm run lint-staged:js',
      '**/*.{js,jsx,tsx,ts,css,less,scss,sass,md,json}': ['prettier --write'],
    })
    .save()

  husky.add(
    '.husky/commit-msg',
    '# https://github.com/umijs/fabric/blob/master/src/verifyCommit.ts\nexport HUSKY_GIT_PARAMS="$1"\nnpx fabric verify-commit',
  )
}
