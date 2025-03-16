// "prettier options": "https://prettier.io/docs/en/options.html"

/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  proseWrap: 'never',
  endOfLine: 'lf',
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  semi: false,
  useTabs: false,
  overrides: [
    // ref: https://github.com/prettier/prettier/issues/5322#issuecomment-1276302630
    {
      files: '*.svg',
      options: {
        parser: 'html',
      },
    },
  ],
}

export default config
