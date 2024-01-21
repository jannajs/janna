# @jannajs/lint

> 代码规范初始化工具

## 功能特色

基于 [@antfu/eslint-config](https://github.com/antfu/eslint-config) 定制，默认禁用 vue，开启 react 支持。特别的，支持 Next.js 规则，支持 prettier 格式化。

- .editorconfig
- .prettierrc.mjs
- eslint.config.ts
- commitlint.config.ts

## 如何使用

```sh
$ npm i -D @jannajs/lint
# yarn add -D @jannajs/lint
# pnpm add -D @jannajs/lint

$ npx --no -- @jannajs/lint init

# 查看当前项目的 eslint 规则详情
$ npx eslint-flat-config-viewer
```

### VS Code 支持

如果不使用 prettier 可直接参考[该配置](https://github.com/antfu/eslint-config#vs-code-support-auto-fix)。不过目前存在不能自动修复的格式化问题，暂不建议将格式相关的规则提示忽略。而且目前 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic) 还存在部分规则自动修复会导致代码异常的严重缺陷，比如目前碰到的如果在对象数组之间添加注释就会出现这样的问题，将对象数组中每个对象调整为独立的代码片段可解决。

因此，目前的建议是如果是个人项目，可以尝试无 prettier 的方式，如果需要多人协作，还是应该结合 prettier 格式化代码。可通过 `npx --no -- @jannajs/lint init --prettier` 来初始化代码规范，内部会自动禁用掉 [ESLint Stylistic](https://github.com/eslint-stylistic/eslint-stylistic) 的规则。此时推荐如下 VS Code 配置：

```json5
{
  // Enable the ESlint flat config support
  "eslint.experimental.useFlatConfig": true,

  // Prettier auto format
  "editor.formatOnSave": true,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  }
}
```

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

## 文档说明

- [ESLint flat config 在 monorepo 下如何使用？](https://github.com/eslint/eslint/discussions/16960)
- [Ignore Files - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/configure/ignore)
- [测试 glob 模式匹配](https://globster.xyz/)
- [Ignoring Code · Prettier](https://prettier.io/docs/en/ignore.html#ignoring-files-prettierignore)

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
