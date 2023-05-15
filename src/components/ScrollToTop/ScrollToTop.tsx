import React, { PropsWithChildren, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

function ScrollToTop({ children }: PropsWithChildren<{}>) {
  const history = useHistory()
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [])

  return <>{children}</>
}

export default ScrollToTop
