import { prettierBase } from '@bratislava/eslint-config-react'

export default {
  ...prettierBase,
  plugins: ['prettier-plugin-tailwindcss'],
  // TODO add packages below, taken from https://github.com/bratislava/eslint-config/tree/master/packages/react#prettier
  tailwindFunctions: ['cx', 'classnames', 'clsx', 'cn', 'twMerge', 'tw'],
  // project-specific:
  tailwindStylesheet: './src/index.css',
}
