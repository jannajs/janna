import antfu from '@antfu/eslint-config'

const janna: typeof antfu = async (...args) => {
  const result = await antfu(...args)
  return result
}

export default janna
