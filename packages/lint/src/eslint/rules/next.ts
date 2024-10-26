import path from 'node:path'
import process from 'node:process'

import { GLOB_SRC, interopDefault } from '@antfu/eslint-config'
import { glob } from 'zx'

import type { Linter } from 'eslint'

/**
 * ref: https://github.com/vercel/next.js/blob/fe7322650b407a44a1900ef1ef09d19ca4c56e99/packages/eslint-plugin-next/src/utils/get-root-dirs.ts#L7
 */
function processRootDir(rootDir: string, cwd?: string): string[] {
  // 与引用中原实现等价的操作
  return glob.globbySync(rootDir, {
    cwd,
    onlyDirectories: true,
    expandDirectories: false,
  })
}

export interface GetNextFlatConfigsOptions {
  /**
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * 常规单仓库单项目直接设置为 true 即可，如果是 monorepo 可通过 rootDir 配置相关目录，例如：
   *
   * rootDir: ["demos/with-nextjs"]
   */
  next?: boolean | {
    /**
     * 同 https://nextjs.org/docs/pages/building-your-application/configuring/eslint#rootdir
     *
     * 目前看来疑似并没有校验 app 路由
     */
    rootDir: string | string[]
    /**
     * 已知在开发环境的 monorepo 环境会出现 cwd 路径不符合预期的情况，
     * 特支持自定义 cwd
     */
    cwd?: string
  }
}

export async function getNextFlatConfigs(
  options: GetNextFlatConfigsOptions = {},
) {
  const { next } = options

  const rules: Linter.Config[] = []

  if (!next) {
    return rules
  }

  if (typeof next === 'object') {
    const { rootDir, cwd } = next

    const mergedCwd = cwd || process.cwd()

    let rootDirs = [mergedCwd]

    if (typeof rootDir === 'string') {
      rootDirs = processRootDir(rootDir, cwd)
    } else if (Array.isArray(rootDir)) {
      rootDirs = rootDir
        .map((dir) => (typeof dir === 'string' ? processRootDir(dir, cwd) : []))
        .flat()
    }
    const nextRootDir = rootDirs.map((item) => {
      return path.join(mergedCwd, item)
    })

    const eslintPluginNext = await interopDefault(import('@next/eslint-plugin-next'))
    rules.push({
      ...eslintPluginNext.configs.recommended,
      plugins: {
        '@next/next': eslintPluginNext,
      },
      name: 'janna/next',
      settings: {
        next: {
          rootDir: nextRootDir,
        },
      },
      files: rootDirs.map((dirItem) => {
        if (dirItem === '.') {
          return GLOB_SRC
        }
        return `${dirItem}/${GLOB_SRC}`
      }),
    })
    return rules
  }

  return getNextFlatConfigs({
    next: {
      rootDir: '.',
    },
  })
}
