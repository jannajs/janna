import fse from 'fs-extra'
import consola from 'consola'

import { commitRE } from './verifyCommit'

const commitTemplateRE = /^.+:.*/

export default function prepare(msgPath: string, debug = false) {
  const originalMsg = fse.readFileSync(msgPath, 'utf-8')
  const msg = originalMsg.trim()

  if (debug) {
    consola.info('[prepare] get originalMsg:', originalMsg)
    consola.info('[prepare] get msg:', msg)
  }

  if (!msg) {
    return
  }

  // 有信息且以注释标识符开头，不做任何处理
  if (msg.startsWith('#')) {
    return
  }

  // 满足 commit msg 模板但不是已约定的 commit msg 时，不做任何处理
  if (commitTemplateRE.test(msg) && !commitRE.test(msg)) {
    return
  }

  // 除特殊情况外，其他预生成的信息（如本地和远程不一致自动生成的合并信息）都加上 chore:
  // 前缀以适配后续 commit-msg hook 的校验，默认无需开发者额外处理
  //
  // Warning: 目前已知通过 VS Code UI 操作和 git add & git commit 操作，触发的时机不同，
  // 如果不额外判断，通过命令行操作会为所有的提交都加上前缀……
  fse.writeFileSync(msgPath, `chore: ${msg}`)
}
