// in local development, these should be set using .env.development
// in CI build these env vars are not defined, and the %{TOKEN}% is replaced post build based on env

export const environment = {
  baseUrl: process.env.REACT_APP_HOST || "%{HOST}%",
  debug: false,
  maxTicketPuchaseLimit: 10,
  reCaptchaKey: process.env.REACT_APP_HOST || "%{RECAPTCHA_CLIENT_SECRET}%"
};
