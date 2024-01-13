import janna from '@jannajs/lint/eslint'

export default janna({
  next: {
    dirs: [
      'demos/with-nextjs',
    ],
  },
  tailwind: {
    dirs: [
      'demos/with-nextjs',
    ],
  },
})
