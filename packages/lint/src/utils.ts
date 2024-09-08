import process from 'node:process'

import mrmCore from 'mrm-core'
import { fs, path } from 'zx'

export function getProjectRootFilePath(filePath: string) {
  return path.join(process.cwd(), filePath)
}

export function checkProjectRootFile(filePath: string) {
  return fs.existsSync(getProjectRootFilePath(filePath))
}

export const isTsProject = checkProjectRootFile('./tsconfig.json')

export const isNextProject
  = checkProjectRootFile('./next.config.js')
  || checkProjectRootFile('./next.config.mjs')

/** 根据项目所在目录的 package.json 中的 workspaces 字段判断 */
export const isMonorepo = mrmCore.packageJson().get('workspaces', []).length > 0

export function isInEditorEnv() {
  return !!((process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM || process.env.NVIM) && !process.env.CI)
}
