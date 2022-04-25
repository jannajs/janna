# lint-staged 备忘录

## `npx mrm@2 lint-staged` 发生了什么？

会校验是否安装 eslint prettier 依赖，是否存在 .git 目录，再自行安装 husky 和 lint-staged。因此在 vite-react-ts **开发调试**时，需要通过 `git init` 初始化一个 .git 目录。此外解析 `@jannajs/lint` 依赖时，由于使用了 pnpm 的方式，会报错，开发环境可忽略。