# Kupaliska FE

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template. We are using [Vite](https://vitejs.dev) to allow tailwind-css

## Development Setup

### Dependencies

Before you start you need to have [backend](https://github.com/bratislava/kupaliska-starz-be) up and running.

Install dependencies:

```
npm install
```

### Environment

Set the `VITE_HOST` variable in `.env.development` file to **FULL URL** of the backend API. The default setup runs against local backend - if you don't have BE running on http://localhost:8000, or would like to develop against staging environment backend (you need to be connected to VPN), edit the `.env.development` file.

For additional informaion about VPN, please contact Martin Pinter.

#### Recaptcha

To make recaptcha work properly, you need to set `VITE_RECAPTCHA_TURNSTILE_SITE_KEY` variable from [cloudflare](https://dash.cloudflare.com/d22f6ea707b439784e5300382443257b/turnstile). From there use the `kupaliska.bratislava.sk` site key.
To get the credentials to login, please contact Martin Pinter.

### Start the app

To run locally:

```
npm run start
```

### Additional development information

#### Preseason

We control whether to display the offseason page by setting the `VITE_FEATURE_FLAG_PRESEASON_HOMEPAGE` env var.

See `usePreseason.ts` hook for more details on testing and overrides.

#### Ordering

For payment we use Global Payments gateway.

[Testing cards](https://developer.globalpay.com/resources/test-card-numbers)

Testing credit card: _4263970000005262_

To make emails work after order, you have to be set in authorized recipients [here](https://app.mailgun.com/app/sending/domains/sandboxa9861f03a870473b83e62ffee945e664.mailgun.org) and when you are making order, enter the exact email.

## Deployment

The app can be deployed by standard means through [bratiska-cli](https://github.com/bratislava/bratiska-cli).
