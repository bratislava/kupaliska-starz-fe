import { environment } from '../environment'
import React, {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { ErrorWithMessages, useErrorToast } from './useErrorToast'
import { fetchGeneral } from 'store/global/api'

const useGetContext = () => {
  const { dispatchErrorToastForHttpRequest } = useErrorToast()
  const { data, isLoading } = useQuery('generalData', fetchGeneral, {
    onError: (err) => {
      // dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })
}

const GeneralDataContext = createContext<ReturnType<typeof useGetContext> | undefined>(undefined)

export const GeneralDataProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const context = useGetContext()

  return <GeneralDataContext.Provider value={context}>{children}</GeneralDataContext.Provider>
}

/** Get general info from database */
export const useGeneralData = () => {
  const context = useContext(GeneralDataContext)
  // fallback to no-override behavior in case it would be used without context
  if (!context) {
    return environment.featureFlag.preseasonHomepage
  }

  return context
}
