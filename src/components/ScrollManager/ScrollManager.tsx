import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1))
      // limitation: if the target element is rendered asynchronously (e.g., after data loads),
      // scrollIntoView() may run before the element exists.
      // In that case you'll need to retry after the content is rendered,
      // or trigger the scroll from the page component once the data has loaded.
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
