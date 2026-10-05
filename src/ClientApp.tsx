import './i18n'

import { Suspense } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './store'

const ClientApp = () => {
  return (
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
  )
}

export default ClientApp
