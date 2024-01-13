# @jannajs/lint

> 代码规范初始化工具

## 功能特色

> [VS Code 支持](https://github.com/antfu/eslint-config#vs-code-support-auto-fix)

基于 [@antfu/eslint-config](https://github.com/antfu/eslint-config) 定制，默认禁用 vue，开启 react 支持。特别的，支持 Next.js 规则。

- .editorconfig
- commitlint.config.ts
- eslint.config.ts

### Next.js

要启用 Next.js 支持，你需要显式地启用：

```ts
// eslint.config.js
import janna from '@jannajs/lint/eslint'

export default janna({
  next: true
})
```

运行 `npx eslint` 会提示你安装所需的依赖项，当然，你可以手动安装它们：

```
npm i -D @next/eslint-plugin-next
```

### Tailwind CSS

要启用 Tailwind CSS 支持，你需要显式地启用：

```ts
// eslint.config.js
import janna from '@jannajs/lint/eslint'

export default janna({
  tailwind: true
})
```

运行 `npx eslint` 会提示你安装所需的依赖项，当然，你可以手动安装它们：

```
npm i -D eslint-plugin-tailwindcss
```

## 如何使用

```sh
$ npm i -D @jannajs/lint
# yarn add -D @jannajs/lint
# pnpm add -D @jannajs/lint

$ npx @jannajs/lint init

# 查看当前项目的 eslint 规则详情
$ npx eslint-flat-config-viewer
```

## 文档说明

- [ESLint flat config 在 monorepo 下如何使用？](https://github.com/eslint/eslint/discussions/16960)
- [测试 glob 模式匹配](https://globster.xyz/)

## 开发调试

### commitlint 调试

```shell
echo "foo" | npx commitlint

echo "feat\!: foo" | npx commitlint

echo "feat(module)\!: foo" | npx commitlint

echo "feat(模块)\!: foo" | npx commitlint
```

## 注意事项

### 报错形如 Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: `**/*/commitlint.config.ts`

`commitlint` 使用 `ts-node` 加载模块导致，`package.json` 没有配置 `"type": "module"`，如果确实不配置，那么可以尝试将 `commitlint.config.ts` 重命名为 `commitlint.config.cts`。
