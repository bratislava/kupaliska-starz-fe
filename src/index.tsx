import React, { Suspense } from "react";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { store } from "./store";
import App from "./App";

import "./i18n";

import "./index.css";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { environment } from "./environment";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";

// Copied from https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/1b38e9582ae23bde40fe4bef77f3d838e838e08b/samples/msal-react-samples/react-18-sample/src/index.js
// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: (process.env.REACT_APP_TRACES_SAMPLE_RATE || 1) as number,
});

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleReCaptchaProvider
        reCaptchaKey={environment.reCaptchaKey}
        useEnterprise={true}
      >
        <Provider store={store}>
          <MsalProvider instance={msalInstance}>
            <App />
          </MsalProvider>
        </Provider>
      </GoogleReCaptchaProvider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
