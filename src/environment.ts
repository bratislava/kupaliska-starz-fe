// in local development, these should be set using .env.development
// in CI build these env vars are not replaced by tokens, and the %{TOKEN}% is replaced on container startup based on env

export const environment = {
  host: process.env.REACT_APP_HOST || "http://localhost:8000",
  debug: false,
  maxTicketPuchaseLimit: 10,
  reCaptchaKey: process.env.REACT_APP_RECAPTCHA_KEY
};
