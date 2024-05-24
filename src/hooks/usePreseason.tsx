import { environment } from '../environment'
import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const useGetContext = () => {
  // allow override of the feature flag at runtime
  const [preseason, setPreseason] = useState(environment.featureFlag.preseasonHomepage)

  useEffect(() => {
    // manually override type to please ts
    ;(
      window as Window & { __DEV_OVERRIDE_LANDINGPAGE_PRESEASON?: typeof setPreseason }
    ).__DEV_OVERRIDE_LANDINGPAGE_PRESEASON = setPreseason
  }, [setPreseason])

  return preseason
}

const PreseasonContext = createContext<ReturnType<typeof useGetContext> | undefined>(undefined)

export const PreseasonProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const context = useGetContext()

  return <PreseasonContext.Provider value={context}>{children}</PreseasonContext.Provider>
}

/** Allows developers to easily override the VITE_FEATURE_FLAG_PRESEASON_HOMEPAGE setting on a running page. */
export const usePreseason = () => {
  const context = useContext(PreseasonContext)
  // fallback to no-override behavior in case it would be used without context
  if (!context) {
    return environment.featureFlag.preseasonHomepage
  }

  return context
}
