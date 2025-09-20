## Janna — quick guide for AI coding agents

This repository is a TypeScript monorepo (pnpm + turbo) that provides developer toolkits (`@jannajs/lint`, `@jannajs/git-guards`, etc.). Use these notes to be immediately productive when editing, testing, or extending packages.

- General Guidelines:

  - **Solution Approach First**: Unless directly instructed to generate code, always prioritize providing an intuitive and clear solution approach before implementing changes. This includes:
    - Breaking down the problem into logical steps
    - Explaining the reasoning behind the proposed solution
    - Considering alternative approaches when applicable
    - Highlighting potential impacts or considerations
  - **Code Generation**: Only proceed with code generation when explicitly requested or when the solution approach has been approved and detailed implementation is needed.
  - **Language Consistency**: Always respond in the same language as the user's question.

- Repo layout: packages/\* contains publishable packages. Examples:

  - `packages/lint` — ESLint / commitlint helpers and templates. Key files: `packages/lint/README.md`, `packages/lint/src/commit-msg-path-emojify.ts`, `packages/lint/templates/commitlint.config.ts`.
  - `packages/git-guards` — Git hook helpers. Key file: `packages/git-guards/README.md`.

- Tooling and assumptions:

  - Package manager: pnpm (see `package.json` root `packageManager`).
  - Task runner: turbo. Common scripts in root `package.json`: `pnpm build` (runs turbo build), `pnpm dev`, `pnpm test` (vitest).
  - Packages are ES modules (many package.json files set `type: "module"`). Prefer ESM imports and .mjs/.ts entry points.

- Build / test workflows you can use in PRs and CI:

  - Build all packages: `pnpm build` (runs `turbo run build --filter=@jannajs/lint --filter=@jannajs/git-guards`).
  - Run tests: `pnpm test` (vitest). Prefer running single-package tests locally by changing to package folder.
  - Clean: `pnpm run clean` at repo root to remove caches and node_modules.

- Commit and hook conventions (important):

  - Husky is used: see `.husky/commit-msg` which runs `npx --no -- commitlint --edit $1`.
  - The lint package provides a commit-msg emojifier: `packages/lint/src/commit-msg-path-emojify.ts`. It reads the commit message, matches conventional commit types, and inserts an emoji (e.g., `feat` -> ✨). When editing commit hook logic, reference this file and the template written by `packages/lint/src/core.ts`.
  - Templates for generated `commitlint.config.ts` live at `packages/lint/templates/commitlint.config.ts` and extend `@commitlint/config-conventional`.

- Project-specific code patterns and conventions:

  - Small, focused packages that export both ESM and types: check package.json `exports` and `types` fields (e.g., `packages/lint/package.json`).
  - CLI helpers are built with `commander` and `zx` in several packages. Look for `bin/cli.mjs` and `src/cli` for examples.
  - Tests use Vitest; mocks often use `vi.mocked` and `vi.mock` (see `packages/lint/src/commit-msg-path-emojify.test.ts`).
  - Use `zx`'s `fs` wrapper (`import { fs } from 'zx'`) in scripts where filesystem helpers are used.

- Integration and external deps to watch for:

  - commitlint family: `@commitlint/cli`, `@commitlint/config-conventional`, `@commitlint/is-ignored` are required for commit hooks. Some commitlint TypeScript ESM quirks are documented in `packages/lint/README.md` (see discussion about `commitlint.config.ts` vs `.cts`).
  - ESLint presets: `@antfu/eslint-config` is a peer dependency of `@jannajs/lint` and shapes the project's ESLint conventions.

- Examples you can follow when implementing changes:

  - To modify commit hook behavior: edit `.husky/commit-msg` and `packages/lint/src/commit-msg-path-emojify.ts` (follow existing regex + emoji map patterns).
  - To add a new package: follow the structure in `packages/*` (package.json with `type: "module"`, `exports`, build scripts using tsc + unbuild).

- Safety and quick checks before committing changes:

  - Run `pnpm -w -s -F <package-name> build` to build a single package in monorepo.
  - Run `pnpm test` or `pnpm -w -F <package-name> test` for focused tests.
  - Lint: `pnpm -w lint` (root `eslint` command covers the repo).

- When in doubt, refer to these files first (ordered by usefulness):
  1. `package.json` (root) — scripts and workspace setup
  2. `packages/lint/README.md` — ESLint/commitlint patterns, VSCode config snippets
  3. `packages/lint/src/commit-msg-path-emojify.ts` — concrete example of commit-msg hook logic
  4. `.husky/commit-msg` — what runs during commit
  5. `packages/lint/templates/commitlint.config.ts` — commitlint template

If anything here is unclear or you'd like more examples (e.g., how to run a local package in dev mode, or how CI is configured), tell me which area to expand and I'll update this file.
