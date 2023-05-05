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
  featureFlag: {
    preseasonHomepage: import.meta.env.VITE_FEATURE_FLAG_PRESEASON_HOMEPAGE === 'true',
  },
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID as string,
    identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID as string,
    region: import.meta.env.VITE_AWS_REGION as string,
  },
  cityAccountBackendUrl: import.meta.env.VITE_CITY_ACCOUNT_BACKEND_URL as string,
  cityAccountFrontendUrl: import.meta.env.VITE_CITY_ACCOUNT_FRONTEND_URL as string,
}
