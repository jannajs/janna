import fse from 'fs-extra'
import consola from 'consola'

export default function prepare(msgPath: string, debug = false) {
  const originalMsg = fse.readFileSync(msgPath, 'utf-8')
  const msg = originalMsg.trim()

  if (debug) {
    consola.info('[prepare] get originalMsg:', originalMsg)
    consola.info('[prepare] get msg:', msg)
  }

  // 有信息且以注释标识符开头，不做任何处理
  if (msg && msg.startsWith('#')) {
    return
  }
  // 除特殊情况外，其他预生成的信息都加上 chore: 前缀以适配后续 commit-msg hook 的校验
  // 默认无需开发者额外处理
  if (msg) {
    fse.writeFileSync(msgPath, `chore: ${msg}`)
  }
}
