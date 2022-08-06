import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  // 由于目前 eslint 暂不支持 esm 配置文件，因此还需要 cjs 打包
  format: ['cjs', 'esm'],
  minify: false,
  clean: true,
  bundle: false,
  dts: true,
})
