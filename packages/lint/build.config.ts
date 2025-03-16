import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { builder: 'mkdist', input: './src' },
  ],
  failOnWarn: false,
  declaration: true,
})
