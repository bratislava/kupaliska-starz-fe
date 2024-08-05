import { AxiosResponse } from 'axios'
import React, { PropsWithChildren, ReactNode, createContext, useContext } from 'react'
import { UseQueryResult } from 'react-query'
import { useGeneralDataQuery } from './useGeneralDataQuery'
import { environment } from '../environment'

export type GeneralData = {
  id: string
  alertText: string
  alertTextColor: string
  alertColor: string
  seasonTitle: string
  seasonSubtitle: string
  isOffSeason: boolean
  offSeasonTitle: string
  offSeasonSubtitle: string
  mainImageAddress: string
  logoAddress: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

const GeneralDataContext = createContext<UseQueryResult<
  AxiosResponse<GeneralData, any>,
  unknown
> | null>(null)

export const GeneralDataProvider = ({ children }: PropsWithChildren<ReactNode>) => {
  const generalData = useGeneralDataQuery()

  return (
    <GeneralDataContext.Provider value={{ ...generalData }}>{children}</GeneralDataContext.Provider>
  )
}

/** Get general info from database */
export const useGeneralDataContext = () => {
  const context = useContext(GeneralDataContext)
  // fallback to no-override behavior in case it would be used without context
  if (!context) {
    return environment.featureFlag.preseasonHomepage
  }

  return context
}
