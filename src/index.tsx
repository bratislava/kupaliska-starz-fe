import React, { Suspense } from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './store'
import App from './App'

import './i18n'

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
)
