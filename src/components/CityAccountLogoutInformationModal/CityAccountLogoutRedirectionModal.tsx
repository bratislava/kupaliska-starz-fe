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

export const CityAccountLogoutRedirectionModalContextProvider = ({
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

export const useCityAccountLogoutRedirectionModal = () => {
  return useContext(context)
}

const CityAccountLogoutRedirectionModal = () => {
  const { state, close } = useContext(context)

  return (
    <Dialog
      open={state.open}
      onClose={close}
      title={'Informácia pre právnicke osoby a podnikateľov'}
      className="max-w-[592px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <p>
            V prípade, ak sa prihlásite do Bratislavského konta ako právnická osoba alebo fyzická
            osoba - podnikateľ, nie je možné zakúpiť si vstupovú alebo sezónnu permanentku.
          </p>
        </div>
        <Button color="primary" onClick={state.onSuccessCallback} className="w-full">
          Späť na stránku
        </Button>
      </div>
    </Dialog>
  )
}

export default CityAccountLogoutRedirectionModal
