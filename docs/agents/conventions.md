# Code Conventions

## Code Style

- **ESLint 9 flat config** via `@jannajs/lint/eslint` (wraps @antfu/eslint-config)
- 2-space indent, LF line endings, UTF-8, final newline required
- **No manual formatting** — eslint handles it (eslint-plugin-format)
- Test files: `*.test.ts` co-located next to source, excluded from build output

## TypeScript Patterns

- Target: ES2019, Module: ESNext, Module resolution: Bundler
- Strict mode enabled across all packages
- **Zod schemas + explicit interfaces**: JSDoc lives on hand-written `interface`, schema uses `satisfies z.ZodType<>` to stay in sync — this preserves docs in `.d.ts` output
- Prefer `path.resolve()` over `path.join()` when file arguments may be absolute (e.g. git hook parameters in worktree environments)

## Commit Convention

Commits are enforced by husky hooks — **all three run on every commit**:

1. `pre-commit` — lint-staged (`eslint --fix` on all staged files)
2. `prepare-commit-msg` — @jannajs/git-guards merge guard
3. `commit-msg` — commitlint → emojify (three steps: git-guards merge check, then commitlint validation, then emoji auto-prefix)

Format: `type(scope?): description`

The emoji is **auto-prepended** by the `emojify` hook — never write it manually. The commitlint parser supports both `feat: msg` and `✨ feat: msg` patterns via a custom `headerPattern`.

Allowed types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore`

Length limits: header max 100 chars (enforced), body and footer unlimited.
