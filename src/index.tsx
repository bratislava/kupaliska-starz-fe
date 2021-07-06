import React, { Suspense } from "react";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

import { store } from "./store";
import App from "./App";

import "./i18n";

import "./index.css";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { environment } from "environments/environment";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleReCaptchaProvider reCaptchaKey={environment.reCaptchaKey}>
      <Provider store={store}>
        <App />
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
