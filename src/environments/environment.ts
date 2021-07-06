// in local development, these should be set using .env.development
// in CI build these env vars are not defined, and the %{TOKEN}% is replaced post build based on env

export const environment = {
  protocol: "http:",
  port: "8000",
  host: "localhost",
  debug: false,
  maxTicketPuchaseLimit: 10,
  reCaptchaKey: "6Leae90aAAAAAM7NZfVEVC0rEyhh-tx-MYUthzYU"
};
