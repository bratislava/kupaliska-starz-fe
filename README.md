# Kupaliska FE

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template. We are using [Vite](https://vitejs.dev) to allow tailwind-css

## Product specification

[Product specification](https://magistratba.sharepoint.com/:w:/s/InnovationTeam/EbkNEpF0x5dNgH-nfmNf03UB8oJLmVhrDIkOe0aZ9JrEPA?e=ZXjH7z)

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

We control whether to display the offseason page by setting the `isSeasonActive` boolean in the general settings of the backend.

#### Ordering

For payment we use Global Payments gateway.

[Testing cards](https://developer.globalpay.com/resources/test-card-numbers)

Testing credit card: _4263970000005262_

To make emails work after order, you have to be set in authorized recipients [here](https://app.mailgun.com/app/sending/domains/sandboxa9861f03a870473b83e62ffee945e664.mailgun.org) and when you are making order, enter the exact email.

## Deployment

The app runs on three clusters - `development`, `staging` and `production` - and is deployed by GitHub pipelines. The overall pipeline and release rules are described in [Deployment & releases](https://magistratba.sharepoint.com/:fl:/r/contentstorage/CSP_e7fd7f53-9abe-456a-b0e1-7cc0c63e3f1a/Document%20Library/LoopAppData/Deployment%20%26%20releases.loop?d=we29942dcbfe34648a857e7d3bfb196cf&csf=1&web=1&e=MLf6C9&nav=cz0lMkZjb250ZW50c3RvcmFnZSUyRkNTUF9lN2ZkN2Y1My05YWJlLTQ1NmEtYjBlMS03Y2MwYzYzZTNmMWEmZD1iJTIxVTNfOTU3NmFha1d3NFh6QXhqNF9Hc3RnWmNMRlhXQkR2Z2F4bHUxdEdsNGZsSnk2d2ZCeFRvWi00aXZqZ0o4ayZmPTAxWVJNMktXRzRJS002Rlk1N0pCREtRVjdIMk83M0RGV1AmYz0lMkYmYT1Mb29wQXBwJnA9JTQwZmx1aWR4JTJGbG9vcC1wYWdlLWNvbnRhaW5lciZ4PSU3QiUyMnclMjIlM0ElMjJUMFJUVUh4dFlXZHBjM1J5WVhSaVlTNXphR0Z5WlhCdmFXNTBMbU52Ylh4aUlWVXpYemsxTnpaaFlXdFhkelJZZWtGNGFqUmZSM04wWjFwalRFWllWMEpFZG1kaGVHeDFNWFJIYkRSbWJFcDVObmRtUW5oVWIxb3ROR2wyYW1kS09HdDhNREZaVWsweVMxZERRMUUyTTB4Qk5VODBOMFpHVEVVMFIwNVFTbGRLUlVoYVVRJTNEJTNEJTIyJTJDJTIyaSUyMiUzQSUyMjU1NzQyNmM4LTBmYjMtNDVhYi1iYTg1LWQ0MzZkYzMyODU1MCUyMiU3RA%3D%3D); the `.env.deploy.*` format, Passbolt naming and secret sync are described in [Environment variables & Secrets](https://magistratba.sharepoint.com/:fl:/r/contentstorage/CSP_e7fd7f53-9abe-456a-b0e1-7cc0c63e3f1a/Document%20Library/LoopAppData/Environment%20variables%20%26%20Secrets.loop?d=w77387c85f8b94b50a848ccc19d3c0972&csf=1&web=1&e=C9nE81&nav=cz0lMkZjb250ZW50c3RvcmFnZSUyRkNTUF9lN2ZkN2Y1My05YWJlLTQ1NmEtYjBlMS03Y2MwYzYzZTNmMWEmZD1iJTIxVTNfOTU3NmFha1d3NFh6QXhqNF9Hc3RnWmNMRlhXQkR2Z2F4bHUxdEdsNGZsSnk2d2ZCeFRvWi00aXZqZ0o4ayZmPTAxWVJNMktXRUZQUTRIUE9QWUtCRjJRU0dNWUdPVFlDTFMmYz0lMkYmYT1Mb29wQXBwJnA9JTQwZmx1aWR4JTJGbG9vcC1wYWdlLWNvbnRhaW5lciZ4PSU3QiUyMnclMjIlM0ElMjJUMFJUVUh4dFlXZHBjM1J5WVhSaVlTNXphR0Z5WlhCdmFXNTBMbU52Ylh4aUlWVXpYemsxTnpaaFlXdFhkelJZZWtGNGFqUmZSM04wWjFwalRFWllWMEpFZG1kaGVHeDFNWFJIYkRSbWJFcDVObmRtUW5oVWIxb3ROR2wyYW1kS09HdDhNREZaVWsweVMxZERRMUUyTTB4Qk5VODBOMFpHVEVVMFIwNVFTbGRLUlVoYVVRJTNEJTNEJTIyJTJDJTIyaSUyMiUzQSUyMmEzYTI0MjIxLTBkMmUtNGUyYi1iZWEyLTQ4OTBjZGUwYTdkYiUyMiU3RA%3D%3D). This section covers what is specific to this repo.

### How deploys work

Deploys are triggered by pushing a git tag whose name starts with a cluster prefix, handled by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) via the shared `resolve-environment` action:

| Tag | Cluster |
|---|---|
| `dev*` (e.g. `dev1.0.0`) | `development` |
| `staging*` | `staging` |
| `prod*` | `production` |

Every push to `master` deploys to `staging` through [`.github/workflows/master.yml`](.github/workflows/master.yml). Pull requests only build the image without pushing it ([`.github/workflows/pr.yml`](.github/workflows/pr.yml)).

Build and deploy share [`.github/workflows/_build.yml`](.github/workflows/_build.yml). Vite bakes the `VITE_*` values into the bundle, so the image `harbor.bratislava.sk/standalone/kupaliska-starz-frontend` is built once per cluster and every tag carries a `-<cluster>` suffix (`<cluster>-<short-sha>-<cluster>`). The deploy job then dispatches [infrastructure-deployment-configuration](https://github.com/bratislava/infrastructure-deployment-configuration), which applies the Terragrunt unit `clusters/<cluster>/applications/kupaliska_starz/frontend` (namespace `starz`) and waits for the rollout. The shared actions come from [bratislava/github-actions](https://github.com/bratislava/github-actions).

The image runs `nginx-unprivileged` on port 8080. Crawler user agents are proxied to a rendertron sidecar running in the same pod.

### Environment variables and secrets

- **Build-time variables** (`VITE_HOST`, `VITE_IS_PROD`, `VITE_RECAPTCHA_TURNSTILE_SITE_KEY`, `VITE_CITY_ACCOUNT_*`, `VITE_FEATURE_FLAG_*`, `VITE_FARO_SECRET`) live in `.env.build.<cluster>` and are baked into the bundle by the Dockerfile. Changing them is a code change that takes effect with the next build.
- **Runtime env vars** live in `.env.deploy.<cluster>` at the root of this repo and become the `kupaliska-starz-frontend-env` config map. The only one today is `RENDERTRON_HOST`, which nginx substitutes into its config at container start.
- **Secrets**: this app has none.
