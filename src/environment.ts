// in local development, these should be set using .env.development
// in CI build these env vars are not replaced by tokens, and the %{TOKEN}% is replaced on container startup based on env

export const environment = {
  host: import.meta.env.VITE_HOST || 'http://localhost:8000',
  debug: false,
  maxTicketPurchaseLimit: 10,
  msalClientId: import.meta.env.VITE_MSAL_CLIENT_ID as string,
  msalAuthority: import.meta.env.VITE_MSAL_AUTHORITY as string,
  msalKnownAuthorities: [import.meta.env.VITE_MSAL_KNOWN_AUTHORITY as string],
  sentryDsn: import.meta.env.VITE_SENTRY_DSN as string,
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
  cognitoCookieStorageDomain: import.meta.env.VITE_COGNITO_COOKIE_STORAGE_DOMAIN as string,
  cognitoClientId: import.meta.env.VITE_COGNITO_CLIENT_ID as string,
  cognitoUrl: import.meta.env.VITE_COGNITO_URL as string,
}
