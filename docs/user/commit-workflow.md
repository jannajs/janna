# Commit Workflow

## Hook Chain

Every `git commit` triggers three husky hooks in order:

```
pre-commit          → lint-staged (eslint --fix on staged files)
prepare-commit-msg  → @jannajs/git-guards merge -f "$1"
commit-msg          → commitlint --edit $1
                    → @jannajs/lint emojify $1
```

The commitlint parser supports both plain (`feat: msg`) and emoji-prefixed (`✨ feat: msg`) header patterns.

## Commit Format

```
type(scope?): description

[optional body]
```

The emoji prefix is **auto-added** by the `emojify` hook — never write it manually.

Length limits: header max 100 chars (enforced), body and footer unlimited.

### Type → Emoji Mapping

| Type     | Emoji | Description                  |
| -------- | ----- | ---------------------------- |
| feat     | ✨    | A new feature                |
| fix      | 🐛    | A bug fix                    |
| docs     | 📚    | Documentation only changes   |
| style    | 💎    | Formatting, no logic change  |
| refactor | 📦    | Neither fix nor feature      |
| perf     | 🚀    | Performance improvement      |
| test     | 🚨    | Adding or fixing tests       |
| build    | 🛠    | Build system or dependencies |
| ci       | ⚙️    | CI configuration             |
| chore    | ♻️    | Other non-src/test changes   |

## Merge Guards

The `prepare-commit-msg` hook runs `@jannajs/git-guards merge` on every commit. For non-merge commits it exits silently. For merge commits it checks:

1. **Whitelist** — if current branch matches, all guards are skipped
2. **Blacklist** — rejects merge from forbidden branches (default: `test`, `origin/test`)
3. **Current-branch rule** — rejects self-merge (merging current branch into itself)

If a merge is rejected, run `git merge --abort` and merge from the correct branch.
