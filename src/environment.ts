// in local development, these should be set using .env.development
// in CI build these env vars are not replaced by tokens, and the %{TOKEN}% is replaced on container startup based on env

export const environment = {
  host: import.meta.env.VITE_HOST || 'http://localhost:8000',
  debug: false,
  maxTicketPurchaseLimit: 10,
  faroSecret: import.meta.env.VITE_FARO_SECRET as string,
  featureFlag: {
    preseasonHomepage: import.meta.env.VITE_FEATURE_FLAG_PRESEASON_HOMEPAGE === 'true',
    showCityAccountLoginInformationModalOnce:
      import.meta.env.VITE_FEATURE_FLAG_SHOW_CITY_ACCOUNT_LOGIN_INFORMATION_MODAL_ONCE === 'true',
  },
  isProd: import.meta.env.VITE_IS_PROD === 'true',
  turnstileSiteKey: import.meta.env.VITE_RECAPTCHA_TURNSTILE_SITE_KEY as string,
  cityAccountBackendUrl: import.meta.env.VITE_CITY_ACCOUNT_BACKEND_URL as string,
  cityAccountFrontendUrl: import.meta.env.VITE_CITY_ACCOUNT_FRONTEND_URL as string,
}
