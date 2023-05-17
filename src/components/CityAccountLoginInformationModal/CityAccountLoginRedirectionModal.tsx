import React, { PropsWithChildren, useContext } from 'react'
import Dialog from '../Dialog/Dialog'
import { Button } from '../index'

type State = {
  open: boolean
  onSuccessCallback: () => void
}

type Context = {
  state: State
  open: (onSuccessCallback: () => void) => void
  close: () => void
}

const context = React.createContext<Context>({} as Context)

export const CityAccountLoginRedirectionModalContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [state, setState] = React.useState({ open: false, onSuccessCallback: () => {} })

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
          <p>Nákup lístka na kúpalisko od tohto roka funguje cez Bratislavské konto.</p>
          <p>
            Ak ste si minulý rok pri kúpe lístka na kúpalisko vytvárali svoj účet, môžete si
            Bratislavské konto pre túto e-mailovú adresu aktivovať a{' '}
            <strong>nepotrebujete prejsť celou registráciou</strong>.
          </p>
          <p>
            Ak už máte vytvorené Bratislavské konto, môžete sa prihlásiť pomocou svojich
            prihlasovacích údajov.
          </p>
        </div>
        <Button color="primary" onClick={state.onSuccessCallback} className="w-full">
          Pokračovať na stránku
        </Button>
      </div>
    </Dialog>
  )
}

export default CityAccountLoginRedirectionModal
