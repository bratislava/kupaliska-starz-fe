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

Sentry.init({
  dsn: environment.sentryDsn,
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
