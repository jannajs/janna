import janna from '@jannajs/lint/eslint'

// eslint-disable-next-line no-console
console.log('💎 Lint start~~~')

export default janna({
  next: {
    rootDir: [
      'demos/with-nextjs',
    ],
    cwd: __dirname,
  },
  tailwind: {
    dirs: [
      'demos/with-nextjs',
    ],
  },
  ignores: [
    'bin',
    'dist',
  ],
})
