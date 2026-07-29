import { createReactConfig } from '@bratislava/eslint-config-react'

export default [
  ...createReactConfig(),
  {
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': ['warn', { ignore: ['no-fill'] }],
    },
    settings: {
      'better-tailwindcss': {
        // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
        entryPoint: 'src/index.css',
      },
    },
  },
]
