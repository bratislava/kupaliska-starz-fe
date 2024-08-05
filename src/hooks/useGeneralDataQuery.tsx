import { useQuery } from 'react-query'
import { AxiosError } from 'axios'
import { ErrorWithMessages, useErrorToast } from './useErrorToast'
import { fetchGeneral } from 'store/global/api'
import { useTranslation } from 'react-i18next'
import { usePreseason } from './usePreseason'

export const useGeneralDataQuery = () => {
  const { t } = useTranslation()
  const preseason = usePreseason()

  const { dispatchErrorToastForHttpRequest } = useErrorToast()
  return useQuery('generalData', fetchGeneral, {
    placeholderData: {
      data: {
        id: '',
        alertText: t('landing.alert-text'),
        alertTextColor: 'white',
        alertColor: 'black',
        seasonTitle: t(`landing.title`),
        seasonSubtitle: t(`landing.subtitle`),
        isOffSeason: preseason, //change naming to offSeason
        offSeasonTitle: t('landing.title-offseason'),
        offSeasonSubtitle: t('landing.subtitle-offseason'),
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
      },
      config: {},
      status: 200,
      statusText: 'OK',
      headers: {},
    },
    onError: (err) => {
      dispatchErrorToastForHttpRequest(err as AxiosError<ErrorWithMessages>)
    },
  })
}
