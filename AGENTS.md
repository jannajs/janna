# Janna Monorepo

Shared tooling for ESLint, TypeScript, Git guards, and commit conventions.

## Quick Reference

```bash
pnpm install              # install dependencies
pnpm build:packages       # build all publishable packages (turbo)
pnpm test                 # run all tests (vitest --run)
pnpm lint:fix             # lint and auto-fix (eslint)
pnpm typecheck            # type check all packages (turbo)
```

Build a single package: `pnpm --filter @jannajs/<name> build`
Test a single package: `npx vitest run packages/<name>`

Commit format: `type(scope?): description` — emoji is auto-prepended by hook, never write it manually.
Allowed types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore`

## Progressive Disclosure

Do not load all docs by default.

Agent workflow:

1. Read `AGENTS.md`.
2. Identify the task category.
3. Open only the matching file under `docs/agents/`.
4. Open a user doc under `docs/user/` only if the change affects user-visible behavior, setup, shortcuts, or workflow.
5. Read additional docs only when the current doc explicitly points to them or the task cannot be completed safely without them.

If the task is narrow, keep the loaded context narrow.

## Task → Doc Routing

### Agent docs (`docs/agents/`)

| Task                                                        | Doc                                            |
| ----------------------------------------------------------- | ---------------------------------------------- |
| Repo structure, build system, dependencies, adding packages | [architecture.md](docs/agents/architecture.md) |
| Code style, TypeScript patterns, commit rules               | [conventions.md](docs/agents/conventions.md)   |
| Working on `packages/git-guards/`                           | [git-guards.md](docs/agents/git-guards.md)     |
| Working on `packages/lint/`                                 | [lint.md](docs/agents/lint.md)                 |
| Versioning, publishing, changesets, pre-release             | [release.md](docs/agents/release.md)           |

> **Release via agent?** Read [release.md](docs/agents/release.md) § "Agent Release" — `pnpm changeset` is interactive and must not be used. Write `.changeset/*.md` files directly instead.

### User docs (`docs/user/`)

Open only when the change affects user-visible behavior.

| Topic                                              | Doc                                                |
| -------------------------------------------------- | -------------------------------------------------- |
| Config files for git-guards, lint, tsconfig        | [configuration.md](docs/user/configuration.md)     |
| Commit hooks, emoji mapping, merge guards behavior | [commit-workflow.md](docs/user/commit-workflow.md) |
