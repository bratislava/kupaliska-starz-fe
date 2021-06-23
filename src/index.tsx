import React from "react";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

import { store } from "./store";
import App from "./App";

import "./index.css";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { environment } from "environments/environment";

ReactDOM.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={environment.reCaptchaKey} useEnterprise={true}>
    <Provider store={store}>
      <App />
    </Provider>
    </GoogleReCaptchaProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
