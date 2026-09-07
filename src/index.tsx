import './i18n'
import './index.css'
import 'react-loading-skeleton/dist/skeleton.css'

import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
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
    <Suspense
      fallback={
        <SkeletonTheme
          baseColor="#a8dbf2"
          highlightColor="#58bbe6"
          duration={1}
          width={40}
          height={28}
        >
          <div className="flex h-full items-center justify-center">
            <Skeleton />
          </div>
        </SkeletonTheme>
      }
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </StrictMode>,
)
