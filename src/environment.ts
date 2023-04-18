// in local development, these should be set using .env.development
// in CI build these env vars are not replaced by tokens, and the %{TOKEN}% is replaced on container startup based on env

console.log(import.meta.env)

export const environment = {
  host: import.meta.env.VITE_HOST || 'http://localhost:8000',
  debug: false,
  maxTicketPurchaseLimit: 10,
  reCaptchaKey: import.meta.env.VITE_RECAPTCHA_KEY,
  msalClientId: import.meta.env.VITE_MSAL_CLIENT_ID as string,
  msalAuthority: import.meta.env.VITE_MSAL_AUTHORITY as string,
  msalKnownAuthorities: [import.meta.env.VITE_MSAL_KNOWN_AUTHORITY as string],
  sentryDsn: import.meta.env.VITE_SENTRY_DSN as string,
}
