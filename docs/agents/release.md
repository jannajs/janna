# Release Workflow

Uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

Config: `.changeset/config.json` — `access: public`, `baseBranch: master`, `updateInternalDependencies: patch`.

## CI Auto-release (preferred)

Pushing to `master` with pending changesets triggers the CI release flow (`.github/workflows/release.yml`):

1. CI runs `changesets/action` which creates a **Release PR** titled "chore(release): publish"
2. The PR bumps versions, updates CHANGELOGs, and stays open accumulating new changesets
3. Merging the Release PR triggers CI again, which runs `pnpm changeset:publish` to publish all bumped packages

**Agent workflow for CI release**: write changeset files, commit, push to `master` — CI handles the rest.

## Changeset Strategy

按变更的因果关系决定 changeset 文件的粒度：

- **同一个原因导致多个包改动** → 一个 changeset 文件，列出所有受影响的包。
- **各包的改动相互独立** → 各自一个 changeset 文件，bump type 和描述各不相同。

`pnpm changeset version` 会合并所有 changeset，计算每个包的最终版本号，并自动级联更新内部依赖（`workspace:*`）。

### Changeset file format

<!-- eslint-skip -->

```markdown
---
"@jannajs/git-guards": patch
"@jannajs/lint": minor
---

Description of the change.
```

Bump types: `patch` (bug fix), `minor` (new feature), `major` (breaking change).

## Manual Release

当需要绕过 CI 手动发布时（如 CI 不可用），所有待发包在一次流程中完成 version → commit → publish → push，不逐包执行。

```bash
# 1. Add changeset(s) — interactive
pnpm changeset

# 2. Version — one shot for all packages
pnpm changeset version

# 3. Build & test
pnpm build:packages && pnpm test

# 4. Commit (one release commit covering all bumped packages)
git add .
git commit -m "chore(release): @jannajs/git-guards@0.0.9 and @jannajs/lint@3.2.0"

# 5. Publish all bumped packages at once
pnpm changeset:publish

# 6. Push commit and all tags
git push --follow-tags
```

### Commit message

- 单包: `chore(release): @jannajs/git-guards@0.0.9`
- 多包: `chore(release): @jannajs/git-guards@0.0.9 and @jannajs/lint@3.2.0`

## Pre-release (next channel)

```bash
pnpm changeset pre enter next    # enter pre-release mode

# add changesets, version, publish as usual
pnpm changeset version
pnpm changeset:publish

pnpm changeset pre exit          # exit when stable
```

Pre-release creates `.changeset/pre.json` to track state. This file should be committed.

## Agent Release (non-interactive)

`pnpm changeset` is interactive and cannot be used by agents. Write changeset files directly instead.

### Via CI (preferred)

```bash
# 1. Identify changed packages and bump types
#    Read git log since last release tag to decide patch/minor/major per package

# 2. Write changeset file(s)
#    One cause, multiple packages → one file listing all
#    Independent changes → separate files, one per change
#    Filename: .changeset/<adjective>-<noun>-<verb>.md
```

Single-cause multi-package changeset:

<!-- eslint-skip -->

```markdown
---
"@jannajs/git-guards": patch
"@jannajs/lint": patch
---

fix: update shared dependency and align error handling
```

Independent changesets (two files):

<!-- eslint-skip -->

```markdown
---
"@jannajs/git-guards": patch
---

fix: resolve absolute file paths in worktree environment
```

<!-- eslint-skip -->

```markdown
---
"@jannajs/lint": minor
---

feat: add vue plugin support
```

Then:

```bash
# 3. Commit changeset files
git add .changeset/
git commit -m "chore: add changeset for <description>"

# 4. Push to master (confirm with user)
#    CI will create a Release PR automatically
git push
```

### Manual (without CI)

After writing changeset files (steps 1-2 above):

```bash
# 3. Version all packages at once
pnpm changeset version

# 4. Verify — check CHANGELOG.md diffs and new versions in package.json
#    For multi-package releases, check ALL affected packages

# 5. Build & test
pnpm build:packages && pnpm test && pnpm lint

# 6. Commit — one release commit for all bumped packages
#    Read new versions from each package.json to form the message
git add .
git commit -m "chore(release): @jannajs/git-guards@0.0.9 and @jannajs/lint@3.2.0"

# 7. Publish (confirm with user — irreversible)
pnpm changeset:publish

# 8. Push commit and tags (confirm with user — irreversible)
git push --follow-tags
```

### Key rules for agents

- **Never run `pnpm changeset` (no args)** — it launches an interactive TUI.
- **Prefer CI release** — write changesets, commit, push; let CI handle version + publish.
- **Always confirm with user** before `pnpm changeset:publish` and `git push`.
- **One changeset per logical change**, not per package. If one fix touches two packages, one file lists both.
- **Independent changes get separate changesets** with their own bump type and description.
- **Bump type** from commit type: `fix` → `patch`, `feat` → `minor`, breaking change → `major`.
- **Changeset filename**: `adjective-noun-verb` (all lowercase, hyphen-separated, three random English words).
- After `pnpm changeset version`, verify **all** affected CHANGELOG.md files and package.json versions.
- **One version, one commit, one publish** — never split the release across multiple commits or publish runs.

## Checklist

Before publishing (manual flow), verify:

- [ ] All changesets consumed (`pnpm changeset version`)
- [ ] CHANGELOG.md updated correctly for **each** bumped package
- [ ] package.json versions are correct for **each** bumped package
- [ ] Internal `workspace:*` dependencies cascaded if needed
- [ ] `pnpm build:packages` passes
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] Working tree is clean
