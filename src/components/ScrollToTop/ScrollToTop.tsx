import { PropsWithChildren, useEffect } from 'react'
import { useLocation } from 'react-router'

function ScrollToTop({ children }: PropsWithChildren<{}>) {
  const location = useLocation();
  useEffect(() => {
    // this is not playing nice with react-router-hash-link, 
    // example: when you click on hashlink (kupaliska) on homepage it will not scroll to that section,
    // when commenting this line it will scroll but it will not scroll to top when changing route
    // TODO: fix this
    // window.scrollTo(0, 0)

  }, [location])

  return <>{children}</>
}

export default ScrollToTop
