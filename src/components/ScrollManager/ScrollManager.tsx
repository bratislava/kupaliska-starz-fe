import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1))

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
      })
    }
  }, [pathname, hash])

  return null
}

export default ScrollManager
