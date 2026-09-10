// Shared between the runtime i18next config (./i18n.ts) and the i18next-cli
// config (../i18next.config.ts) so locales/separators aren't defined twice.

export const LOCALES = ['sk'] as const

export const KEY_SEPARATOR = false as const
