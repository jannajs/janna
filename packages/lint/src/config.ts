import fs from 'fs'

import { minVersion, satisfies } from 'semver'

import type semver from 'semver'

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
  generateConfig(configFileName)
}

function getProjectConfig(): Record<string, any> {
  return JSON.parse(
    fs.readFileSync(`${process.cwd()}/package.json`, { encoding: 'utf-8' }),
  )
}

function getProjectDevDeps(): Record<string, string> {
  return getProjectConfig().devDependencies
}

const eslintDeps: Record<string, string> = {
  eslint: '^7',
  '@umijs/fabric': '^2.5.6',
  'eslint-config-prettier': '^8.5.0',
  'eslint-plugin-import': '^2.25.4',
  'eslint-import-resolver-typescript': '^2.5.0',
}

export function checkSemVer(
  version: string,
  range: string,
  optionsOrLoose?: boolean | semver.Options,
) {
  const satisfy = satisfies(minVersion(version) || '', range, optionsOrLoose)
  if (!satisfy) {
    throw new RangeError(`version ${version} not satisfies ${range}`)
  }
}

export function checkESLintDeps() {
  const projectDevDeps = getProjectDevDeps()
  Object.keys(eslintDeps).forEach((dep) => {
    if (!projectDevDeps[dep]) {
      throw new Error(
        `Please install ${dep}@${eslintDeps[dep]}, and try again.`,
      )
    }
    try {
      checkSemVer(projectDevDeps[dep], eslintDeps[dep])
    } catch (err) {
      if (err instanceof RangeError) {
        throw new Error(`[${dep}] ${err.message}`)
      } else {
        throw err
      }
    }
  })
}
