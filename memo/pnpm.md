# pnpm 备忘录

## 项目内依赖缺失时

比如碰到的使用 `@umijs/fabric` 的 eslint 配置时报错找不到 `@babel/plugin-proposal-decorators`，可通过如下配置解决：

```ini
# .npmrc
public-hoist-pattern[] = *@babel*
```

参考资料：

- [public-hoist-pattern](https://pnpm.io/zh/npmrc#public-hoist-pattern)
- [shamefully-hoist](https://pnpm.io/zh/npmrc#shamefully-hoist)
