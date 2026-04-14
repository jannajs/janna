# @jannajs/lint — Internals

## Entry Points

| Entry          | Path                                           |
| -------------- | ---------------------------------------------- |
| Config factory | `src/eslint/index.ts` → `janna(options)`       |
| CLI            | `src/bin/main.ts` → `init`, `emojify` commands |
| Commit emoji   | `src/commit-msg-path-emojify.ts`               |

## Config Factory Options

<!-- eslint-skip -->

```ts
janna({
  next:      { rootDir: string[], cwd: string }  // Next.js rules
  tailwind:  { dirs: string[] }                   // Tailwind plugin
  react:     boolean                              // React rules
  ignores:   string[]                             // glob patterns to ignore
})
```

## Source Map

| File                               | Responsibility                                                           |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `src/eslint/index.ts`              | Main config factory, composes rule sets                                  |
| `src/eslint/rules/next.ts`         | Next.js ESLint rules                                                     |
| `src/eslint/rules/tailwind.ts`     | Tailwind CSS ESLint rules                                                |
| `src/eslint/rules/prettier-src.ts` | Prettier-based formatting rules                                          |
| `src/core.ts`                      | `init` — scaffolds .editorconfig, eslint.config.ts, commitlint.config.ts |
| `src/commit-msg-path-emojify.ts`   | Reads commit msg file, prepends emoji by type                            |
| `src/bin/main.ts`                  | CLI entry: `init` and `emojify` subcommands                              |

## Peer Dependencies

Consumers must install: @antfu/eslint-config, eslint, typescript, @commitlint/cli, @commitlint/config-conventional, husky, lint-staged, and optional plugins (@eslint-react, @next/eslint-plugin-next, eslint-plugin-tailwindcss, etc.)
