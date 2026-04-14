# Configuration

## @jannajs/git-guards

Config file: `git-guards.config.ts` (or `.js`, `.mjs`) at project root. Discovered by [c12](https://github.com/unjs/c12).

```ts
import { defineConfig } from '@jannajs/git-guards'

export default defineConfig({
  mergeGuards: {
    // Remote names to check (default: ['origin'])
    remotes: ['origin'],
    // Extra regex rules for parsing merge messages (group 1 = branch name)
    extraExtractRules: [],
    // Branches that are never allowed as merge source (default: ['test', 'origin/test'])
    blacklist: ['test', 'origin/test'],
    // Prevent creating merge commits from current branch (default: true)
    disabledFromCurrentBranch: true,
    // Branches exempt from all merge guards
    whitelist: [],
  },
})
```

All fields are optional — defaults apply when omitted.

## @jannajs/lint

### ESLint Config

```ts
// eslint.config.ts
import janna from '@jannajs/lint/eslint'

export default janna({
  next: { rootDir: ['apps/web'], cwd: __dirname },
  tailwind: { dirs: ['apps/web'] },
  react: true,
  ignores: ['dist', 'bin'],
})
```

### Scaffolding

```bash
npx @jannajs/lint init
```

Generates `.editorconfig`, `eslint.config.ts`, and `commitlint.config.ts`.

## @jannajs/tsconfig

```jsonc
// tsconfig.json
{ "extends": "@jannajs/tsconfig/node.json" }
```

Available presets: `base.json` (generic), `node.json` (Node.js).
