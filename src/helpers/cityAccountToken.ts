import jwtDecode, { JwtPayload } from 'jwt-decode'
import to from 'await-to-js'
import { environment } from '../environment'
import { validCityAccountPostMessageTypes } from './cityAccountDto'
import { UNAUTHORIZED_MESSAGE, cityAccountFrontendSSOUrl } from './cityAccountApi'
import logger from './logger'

/**
 * returns the same token if it's well formed and not expired
 * otherwise returns null
 */
export const checkTokenValid = (token: string | null | undefined) => {
  if (!token) return null
  let decodedToken = null
  try {
    decodedToken = jwtDecode<JwtPayload>(token)
  } catch (error) {
    logger.error('Error decoding token when checking validity:', token, error)
    return null
  }
  if (decodedToken && (decodedToken.exp || 0) * 1000 > Date.now()) {
    return token
  }
  return null
}

export const getAccessTokenFromIFrame = async () => {
  // attempt to receive the token from city-account iframe
  const iframe = document.createElement('iframe')
  iframe.src = cityAccountFrontendSSOUrl
  iframe.style.display = 'none'
  // create a promise which resolves when postMessage is received from iframe, or times out after 8 seconds
  // keep eventListenerReference in scope so we can remove it later
  let eventListenerReference: undefined | ((event: any) => void)
  const promise = new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('TOKEN_REFRESH_TIMEOUT_ERROR_MESSAGE')), 8000)
    eventListenerReference = (event) => {
      // ignore if origin is not our iframe or we receive unexpected message format
      if (event.origin === `${environment.cityAccountFrontendUrl}`) {
        if (
          typeof event.data === 'object' &&
          event.data != null &&
          validCityAccountPostMessageTypes.includes(event.data.type)
        ) {
          if (event.data.type === 'UNAUTHORIZED') {
            clearTimeout(timeout)
            reject(new Error(UNAUTHORIZED_MESSAGE))
          } else if (
            event.data.type === 'ACCESS_TOKEN' &&
            typeof event.data.payload?.accessToken === 'string'
          ) {
            clearTimeout(timeout)
            resolve(event.data.payload.accessToken)
          } else {
            // do not accept or reject, wait until timeout for correctly looking message
            logger.warn('Unexpected postMessage received from iframe', event.data)
          }
        } else {
          logger.warn('Unexpected postMessage received from iframe', event.data)
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
    logger.warn(
      'eventListenerReference is undefined when attempting to remove it - this should not happen',
    )
  }
  const token = await checkTokenValid(accessToken)
  if (token) {
    return token
  }
  if (postMessageError && postMessageError.message === UNAUTHORIZED_MESSAGE) {
    // all as it should be, user is not logged in
    return null
  }
  logger.warn('None or invalid token received from iframe', postMessageError, accessToken)
  return null
}
