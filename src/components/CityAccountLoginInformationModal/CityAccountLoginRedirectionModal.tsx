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
          <p>
            Ak už máte Bratislavské konto vytvorené, môžete sa prihlásiť pomocou svojich
            prihlasovacích údajov.
          </p>
          <p>
            Ak ste si minulý rok pri kúpe lístka na kúpalisko vytvárali svoj účet, kvôli ochrane
            osobných údajov tieto účty ani dáta nebolo možné do Bratislavského konta preniesť. Nová
            registrácia je rýchla a jednoduchá a zaberie vám iba pár sekúnd.
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
