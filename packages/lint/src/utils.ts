import process from 'node:process'

import mrmCore from 'mrm-core'
import { fs, path } from 'zx'

export function getProjectRootFilePath(filePath: string) {
  return path.join(process.cwd(), filePath)
}

export function checkProjectRootFile(filePath: string) {
  return fs.existsSync(getProjectRootFilePath(filePath))
}

/** 根据项目所在目录的 package.json 中的 workspaces 字段或 pnpm-workspace.yaml 文件判断 */
export function detectIsMonorepo() {
  return mrmCore.packageJson().get('workspaces', []).length > 0 || checkProjectRootFile('pnpm-workspace.yaml')
}
