# @jannajs/git-guards — Internals

## Entry Points

| Entry          | Path                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| Library        | `src/index.ts` → exports `defineConfig`                                |
| CLI            | `src/cli/index.ts` → `merge -f <file>`                                 |
| Config loading | `src/config/load.ts` — uses c12, looks for `git-guards.config.{ts,js}` |

## Key Types

- `MergeGuardsInput` — user config interface, all fields optional (with JSDoc)
- `MergeGuardsOptions` — resolved config interface, all fields required (with JSDoc)
- Schema uses `satisfies z.ZodType<MergeGuardsOptions, any, MergeGuardsInput>` to bind

## Guard Chain

```
CLI validates -f option → reads file (path.resolve, with try-catch)
  → parse merge message (regex)
  → not a merge commit? skip
  → current branch in whitelist? skip
  → check blacklist (guardFromOtherBranches)
  → check current-branch rule (guardFromCurrentBranch)
```

## Source Map

| File                                 | Responsibility                           |
| ------------------------------------ | ---------------------------------------- |
| `src/cli/commands.ts`                | CLI command definition, file reading     |
| `src/config/load.ts`                 | c12 config loading, schema definition    |
| `src/config/define.ts`               | `defineConfig()` for user config files   |
| `src/merge-guards/index.ts`          | Schema, interfaces, main `mergeGuards()` |
| `src/merge-guards/other-branches.ts` | Blacklist guard                          |
| `src/merge-guards/current-branch.ts` | Current-branch guard                     |
| `src/merge-guards/helpers.ts`        | Whitelist check                          |
| `src/helpers/git.ts`                 | Merge message parsing, branch detection  |

## Dependencies

commander, c12, consola, zod, zx

## Known Patterns

- File paths from git hooks may be absolute (worktree) or relative — always use `path.resolve()`, never `path.join(cwd, file)`
- `z.instanceof(RegExp)` for Zod RegExp fields — see [zod#2735](https://github.com/colinhacks/zod/issues/2735#issuecomment-1729976740)
