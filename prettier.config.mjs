import { prettierBase } from '@bratislava/eslint-config-react'

export default {
  ...prettierBase,
  plugins: ['prettier-plugin-tailwindcss'],
  // TODO add packages below, taken from https://github.com/bratislava/eslint-config/tree/master/packages/react#prettier
  // tailwindFunctions: ["clsx", "cn"],
  // project-specific:
}
