import fs from 'fs'

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
