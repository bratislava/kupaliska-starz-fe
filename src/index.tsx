import React, { Suspense } from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { store } from './store'
import App from './App'

import './i18n'

import '@bratislava/component-library/dist/assets/style.css'
import './index.css'

import { environment } from './environment'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './msalInstance'

Sentry.init({
  dsn: environment.sentryDsn,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: (import.meta.env.VITE_TRACES_SAMPLE_RATE || 1) as number,
})

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)
