import janna from '@jannajs/lint/eslint'

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
})
