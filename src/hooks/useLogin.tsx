import { redirectToLogin } from 'helpers/cityAccountApi'
import { useLocalStorage } from 'usehooks-ts'
import { environment } from '../environment'
import { useCityAccountLoginRedirectionModal } from '../components/CityAccountLoginInformationModal/CityAccountLoginRedirectionModal'

const redirectionModalConfirmedKey = 'redirectionModalConfirmed'

export const useLogin = () => {
  const [redirectionModalConfirmed, setRedirectionModalConfirmed] = useLocalStorage(
    redirectionModalConfirmedKey,
    false,
  )
  const { open } = useCityAccountLoginRedirectionModal()

  return (fromUrl?: string) => {
    if (
      environment.featureFlag.showCityAccountLoginInformationModalOnce &&
      redirectionModalConfirmed
    ) {
      redirectToLogin(fromUrl)
      return
    }

    open(() => {
      if (environment.featureFlag.showCityAccountLoginInformationModalOnce) {
        setRedirectionModalConfirmed(true)
      }
      redirectToLogin(fromUrl)
    })
  }
}
