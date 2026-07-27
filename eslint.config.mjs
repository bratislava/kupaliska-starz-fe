import { createReactConfig } from '@bratislava/eslint-config-react'

export default [
  ...createReactConfig(),
  {
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': ['warn', { ignore: ['no-fill'] }],
    },
  },
]
