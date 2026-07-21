import { ROUTES } from 'helpers/constants'
import { createContext,PropsWithChildren, useContext, useState } from 'react'
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

  return (
    <Dialog
      open={state.open}
      onClose={close}
      title={'Budete presmerovaní na Bratislavské konto'}
      className="max-w-[592px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <p>
            Ak už máte Bratislavské konto vytvorené, jednoducho sa prihlásite. Nová registrácia trvá
            len pár sekúnd.
          </p>
        </div>
        <Button color="primary" onClick={state.onSuccessCallback} className="
          w-full
        ">
          Pokračovať na stránku
        </Button>
        <div className="flex flex-col gap-4 text-sm italic">
          <p>
            Vaše údaje, týkajúce sa registrácie do Bratislavského konta spracúva ako prevádzkovateľ{' '}
            <a
              href="https://bratislava.sk/konto/vyhlasenie-o-spracovani-osobnych-udajov"
              target="_blank"
              rel="noreferrer"
              className="link font-semibold"
            >
              Hlavné mesto Bratislava
            </a>
            .
          </p>
          <p>
            Vaše údaje súvisiace s kúpou lístka spracúva ako prevádzkovateľ{' '}
            <Link className="link font-semibold" to={ROUTES.GDPR} target="_blank">
              STARZ
            </Link>
            .
          </p>
        </div>
      </div>
    </Dialog>
  )
}

export default CityAccountLoginRedirectionModal
