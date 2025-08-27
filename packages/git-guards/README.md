# @jannajs/git-guards

> 基于 Git Hooks 的 Git 守卫

## 功能特色

- 合并守卫
  - 黑名单/白名单，默认禁用 `['test', 'origin/test']` 分支
  - 默认禁止基于当前分支的合并提交

## 如何使用

### 安装

```sh
$ npm i -D @jannajs/git-guards
# yarn add -D @jannajs/git-guards
# pnpm add -D @jannajs/git-guards
```

### 使用

在 `commit-msg` 首行添加如下命令：

```sh
npx --no -- @jannajs/git-guards merge -f "$1"
```

### 配置

在项目根目录中创建 `git-guards.config.ts` 以配置守卫规则：

```ts
import { defineConfig } from '@jannajs/git-guards'

export default defineConfig({
  // ...
})
```
