import fs from 'fs-extra'
import { chalk, glob } from 'zx'
import consola from 'consola'

function toDest(file: string) {
  return file.replace(/^src\//, 'dist/')
}

// 拷贝不会被编译输出的文件到编译目录中
glob.globbySync('src/**/(*.tpl|*.js|*.yaml)').forEach((file) => {
  fs.copySync(file, toDest(file), {
    overwrite: true,
  })
})

consola.log(chalk.green('*Assets'), chalk.bold('copy assets done.'))
