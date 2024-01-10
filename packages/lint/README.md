# @jannajs/lint

> 代码规范初始化工具

## Features

- `.editorconfig`
- eslint
- commitlint

> 默认生成的 eslint 配置为 yaml 格式，VS Code 用户建议安装 `redhat.vscode-yaml` 插件以支持 eslint 配置的 schema 提示。

## 如何使用

```sh
$ npm i -D @jannajs/lint
# yarn add -D @jannajs/lint
# pnpm add -D @jannajs/lint

$ npx @jannajs/lint init
```

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
