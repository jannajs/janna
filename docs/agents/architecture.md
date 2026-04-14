# Architecture

## Monorepo Layout

```
packages/
  git-guards/   → @jannajs/git-guards   CLI + library, merge branch validation
  lint/         → @jannajs/lint          ESLint config factory (wraps @antfu/eslint-config)
  tsconfig/     → @jannajs/tsconfig      Static tsconfig presets (base.json, node.json)
demos/
  with-nextjs/  → Next.js 14 + Tailwind demo consuming the shared configs
```

## Tech Stack

| Concern         | Choice                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| Module system   | ESM (`"type": "module"` everywhere)                                        |
| Build           | unbuild (mkdist) → `dist/`                                                 |
| Test            | Vitest 3, workspace mode (`packages/*`)                                    |
| Lint            | ESLint 9 flat config via `@jannajs/lint/eslint`                            |
| Typecheck       | `tsc --noEmit` via turbo (`pnpm typecheck`)                                |
| Versioning      | Changesets (`baseBranch: master`, `access: public`) + CI auto-release      |
| Package manager | pnpm 10 with catalog version pinning                                       |
| Registry        | npmmirror (`registry=https://registry.npmmirror.com`)                      |
| Task runner     | Turborepo 2.5 — `build` depends on `^build`, `test` depends on `^build`    |
| CI              | GitHub Actions — PR checks (lint + typecheck), Release (changesets/action) |

## Dependency Management

- Shared version pins live in `pnpm-workspace.yaml` under `catalog:`
- Internal deps use `workspace:*`
- `@jannajs/lint` peer-depends on its ecosystem — consumers must install peers
- `@jannajs/tsconfig` is a static package (JSON only, no build step)
