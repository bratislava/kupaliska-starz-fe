import { defineConfig } from 'i18next-cli'

import { KEY_SEPARATOR, LOCALES } from './src/i18n.shared'

export default defineConfig({
  locales: [...LOCALES],
  extract: {
    input: 'src/**/*.{js,jsx,ts,tsx}',
    output: 'public/locales/{{language}}/{{namespace}}.json',
    sort: true,
    keySeparator: KEY_SEPARATOR,
    // this is disable so that 'i18next-intervalplural-postprocessor' can work,
    // otherwise it will replace such translations with _one _few _many _other
    // which can't cover common.age-interval pattern
    disablePlurals: true,
  },
})
