import jwtDecode, { JwtPayload } from 'jwt-decode'
import to from 'await-to-js'
import { environment } from '../environment'
import { validCityAccountPostMessageTypes } from './cityAccountDto'
import { UNAUTHORIZED_MESSAGE, cityAccountFrontendSSOUrl } from './cityAccountApi'

/**
 * returns the same token if it's well formed and not expired
 * otherwise returns null
 * could be sync but jwtDecode throws
 */
const checkTokenValid = async (token: string | null | undefined) => {
  if (!token) return null
  const [jwtDecodeError, decodedToken] = await to(Promise.resolve(jwtDecode<JwtPayload>(token)))
  if (jwtDecodeError) {
    // TODO send to faro
    console.warn(jwtDecodeError)
    return null
  }
  if (decodedToken && (decodedToken.exp || 0) * 1000 > Date.now()) {
    return token
  }
  return null
}

export const getAccessToken = async () => {
  let token: string | null = null
  // look for accessToken in query params - this is the case when we are redirected from city-account
  const urlParams = new URLSearchParams(window.location.search)
  token = await checkTokenValid(urlParams.get('accessToken'))
  if (token) {
    // store in local storage for subsequent requests
    localStorage.setItem('cognitoAccessToken', token)
    // remove accessToken from query params
    urlParams.delete('accessToken')
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`)
    return token
  }

  // look for unexpired token in local storage
  token = await checkTokenValid(localStorage.getItem('cognitoAccessToken'))
  if (token) return token

  // attempt to receive the token from city-account iframe
  const iframe = document.createElement('iframe')
  iframe.src = cityAccountFrontendSSOUrl
  iframe.style.display = 'none'
  // create a promise which resolves when postMessage is received from iframe, or times out after 5 seconds
  // keep eventListenerReference in scope so we can remove it later
  let eventListenerReference: undefined | ((event: any) => void)
  const promise = new Promise<string>((resolve, reject) => {
    setTimeout(() => reject(new Error('TOKEN_REFRESH_TIMEOUT_ERROR_MESSAGE')), 5000)
    eventListenerReference = (event) => {
      // ignore if origin is not our iframe or we receive unexpected message format
      if (event.origin === `${environment.cityAccountFrontendUrl}`) {
        if (
          typeof event.data === 'object' &&
          event.data != null &&
          validCityAccountPostMessageTypes.includes(event.data.type)
        ) {
          if (event.data.type === 'UNAUTHORIZED') {
            reject(new Error(UNAUTHORIZED_MESSAGE))
          } else if (
            event.data.type === 'ACCESS_TOKEN' &&
            typeof event.data.payload?.accessToken === 'string'
          ) {
            resolve(event.data.payload.accessToken)
          } else {
            // do not accept or reject, wait until timeout for correctly looking message
            // TODO log to faro
            console.warn('Unexpected postMessage received from iframe', event.data)
          }
        } else {
          // TODO log to faro
          console.warn('Unexpected postMessage received from iframe', event.data)
        }
      }
    }
    window.addEventListener('message', eventListenerReference)
  })
  document.body.appendChild(iframe)
  const [postMessageError, accessToken] = await to<string>(promise)
  document.body.removeChild(iframe)
  if (eventListenerReference) {
    window.removeEventListener('message', eventListenerReference)
  } else {
    // TODO send to faro
    console.warn(
      'eventListenerReference is undefined when attempting to remove it - this should not happen',
    )
  }
  token = await checkTokenValid(accessToken)
  if (token) {
    // store in local storage for subsequent requests
    localStorage.setItem('cognitoAccessToken', token)
    return token
  }
  console.warn('None or invalid token received from iframe', postMessageError, accessToken)
  return null
}
