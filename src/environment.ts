// in local development, these should be set using .env.development
// in CI build these env vars are not replaced by tokens, and the %{TOKEN}% is replaced on container startup based on env

export const environment = {
  host: import.meta.env.REACT_APP_HOST || "http://localhost:8000",
  debug: false,
  maxTicketPurchaseLimit: 10,
  reCaptchaKey: import.meta.env.REACT_APP_RECAPTCHA_KEY,
  msalClientId: import.meta.env.REACT_APP_MSAL_CLIENT_ID as string,
  msalAuthority: import.meta.env.REACT_APP_MSAL_AUTHORITY as string,
  msalKnownAuthorities: [import.meta.env.REACT_APP_MSAL_KNOWN_AUTHORITY as string],
  sentryDsn: import.meta.env.REACT_APP_SENTRY_DSN as string,
};

