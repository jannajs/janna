import { chalk, fs, glob } from 'zx'
import consola from 'consola'

function toDest(file: string) {
  return file.replace(/^src\//, 'dist/')
}

glob.globbySync('src/templates/**/*', {
  dot: true,
}).forEach((file) => {
  fs.copySync(file, toDest(file), {
    overwrite: true,
  })
})

consola.log(chalk.green('*Assets'), chalk.bold('copy assets done.'))
