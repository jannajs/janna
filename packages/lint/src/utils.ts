import process from 'node:process'

import { fs, path } from 'zx'
import mrmCore from 'mrm-core'

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
