import './i18n'
import './index.css'

import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './store'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Failed to find the root element')
}
const root = createRoot(container)

root.render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </StrictMode>,
)
