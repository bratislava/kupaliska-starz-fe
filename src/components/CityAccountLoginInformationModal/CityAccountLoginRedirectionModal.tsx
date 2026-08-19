import { ROUTES } from 'helpers/constants'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import Dialog from '../Dialog/Dialog'
import { Button } from '../index'

interface State {
  open: boolean
  onSuccessCallback: () => void
}

interface Context {
  state: State
  open: (onSuccessCallback: () => void) => void
  close: () => void
}

const context = createContext<Context>({} as Context)

export const CityAccountLoginRedirectionModalContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [state, setState] = useState({ open: false, onSuccessCallback: () => {} })

  const open = (onSuccessCallback: () => void) => {
    setState({ open: true, onSuccessCallback })
  }
  const close = () => {
    setState({ open: false, onSuccessCallback: () => {} })
  }

  return <context.Provider value={{ state, open, close }}>{children}</context.Provider>
}

export const useCityAccountLoginRedirectionModal = () => {
  return useContext(context)
}

const CityAccountLoginRedirectionModal = () => {
  const { state, close } = useContext(context)
  const { t } = useTranslation()

  return (
    <Dialog
      open={state.open}
      onClose={close}
      title={t('city-account.redirect-title')}
      className="max-w-[592px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <p>{t('city-account.redirect-info')}</p>
        </div>
        <Button color="primary" onClick={state.onSuccessCallback} className="w-full">
          {t('city-account.continue')}
        </Button>
        <div className="flex flex-col gap-4 text-sm italic">
          <p>
            {t('city-account.data-controller-city-prefix')}
            <a
              href="https://bratislava.sk/konto/vyhlasenie-o-spracovani-osobnych-udajov"
              target="_blank"
              rel="noreferrer"
              className="link font-semibold"
            >
              {t('city-account.data-controller-city-link')}
            </a>
            .
          </p>
          <p>
            <Trans
              i18nKey="city-account.data-controller-starz"
              components={{
                Link: <Link className="link font-semibold" to={ROUTES.GDPR} target="_blank" />,
              }}
            />
          </p>
        </div>
      </div>
    </Dialog>
  )
}

export default CityAccountLoginRedirectionModal
