// in local development, these should be set using .env.development
// in CI build these env vars are not replaced by tokens, and the %{TOKEN}% is replaced on container startup based on env

export const environment = {
  host: process.env.NEXT_PUBLIC_HOST || 'http://localhost:8000',
  debug: false,
  maxTicketPurchaseLimit: 50,
  faroSecret: process.env.NEXT_PUBLIC_FARO_SECRET as string,
  featureFlag: {
    showCityAccountLoginInformationModalOnce:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_SHOW_CITY_ACCOUNT_LOGIN_INFORMATION_MODAL_ONCE ===
      'true',
  },
  isProd: process.env.NEXT_PUBLIC_IS_PROD === 'true',
  turnstileSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_TURNSTILE_SITE_KEY as string,
  cityAccountBackendUrl: process.env.NEXT_PUBLIC_CITY_ACCOUNT_BACKEND_URL as string,
  cityAccountFrontendUrl: process.env.NEXT_PUBLIC_CITY_ACCOUNT_FRONTEND_URL as string,
}
