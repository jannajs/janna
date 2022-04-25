import fs from 'fs-extra'
import { globbySync } from 'globby'
import chalk from 'chalk'

function toDest(file: string) {
  return file.replace(/^src\//, 'dist/')
}

// 拷贝不会被编译输出的文件到编译目录中
globbySync('src/**/(*.tpl|*.js|*.yaml)').forEach((file) => {
  fs.copySync(file, toDest(file), {
    overwrite: true,
  })
})

console.log(chalk.green('*Assets'), chalk.bold('copy assets done.'))
