import { Amplify, Auth } from 'aws-amplify'
import { environment } from './../environment'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import to from 'await-to-js'
import {
  CognitoUserSession,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoAccessToken,
} from 'amazon-cognito-identity-js'

console.log('gogin to config')

console.log({
  identityPoolId: environment.cognito.identityPoolId,

  // REQUIRED - Amazon Cognito Region
  region: environment.cognito.region,

  // OPTIONAL - Amazon Cognito Federated Identity Pool Region
  // Required only if it's different from Amazon Cognito Region
  // identityPoolRegion: 'XX-XXXX-X',

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: environment.cognito.userPoolId,

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: environment.cognito.userPoolWebClientId,
})

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: environment.cognito.identityPoolId,

    // REQUIRED - Amazon Cognito Region
    region: environment.cognito.region,

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: environment.cognito.userPoolId,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: environment.cognito.userPoolWebClientId,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
    // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
    signUpVerificationMethod: 'code', // 'code' | 'link'

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //   domain: '.yourdomain.com',
    //   // OPTIONAL - Cookie path
    //   path: '/',
    //   // OPTIONAL - Cookie expiration in days
    //   expires: 365,
    //   // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    //   sameSite: 'strict' | 'lax',
    //   // OPTIONAL - Cookie secure flag
    //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //   secure: true,
    // },

    // OPTIONAL - customized storage object
    // storage: MyStorage,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: {myCustomKey: 'myCustomValue'},

    // OPTIONAL - Hosted UI configuration
    // oauth: {
    //   domain: 'your_cognito_domain',
    //   scope: [
    //     'phone',
    //     'email',
    //     'profile',
    //     'openid',
    //     'aws.cognito.signin.user.admin',
    //   ],
    //   redirectSignIn: 'http://localhost:3000/',
    //   redirectSignOut: 'http://localhost:3000/',
    //   responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
    // },
  },
})

console.log('config done')
console.log(Amplify)

/**
 * Injects an access token, id token, and refresh token into AWS Amplify for idenity and access
 * management. Cognito will store these tokens in memory and they will persist upon requesting
 * additional pages from the same domain.
 *
 * Calling this method should have the same effect as signing in with Auth.signIn(). When an
 * id or access token expires, Cognito will automatically retrieve new ones using the refresh
 * token passed.
 *
 * Note: Token injection is not "officially" supported by Amplify. The only forms of sign-in
 * Amplify supports are username & password or federated sign-in.
 *
 * @param accessToken The access token to be injected. Access tokens grant access to resources.
 * @param idToken The id token to be injected. Id tokens contain claims about identity.
 * @param refreshToken The refresh token to be injected. Refresh tokens can obtain new access
 * and id tokens for a long period of time (usually up to a year).
 */
const injectTokensIntoAmplify = (accessToken: string, idToken: string, refreshToken: string) => {
  console.log('prep session')
  const session = new CognitoUserSession({
    IdToken: new CognitoIdToken({
      IdToken: idToken,
    }),
    RefreshToken: new CognitoRefreshToken({
      RefreshToken: refreshToken,
    }),
    AccessToken: new CognitoAccessToken({
      AccessToken: accessToken,
    }),
  })
  console.log('set credentials')
  Auth.Credentials.set(session, 'session')

  console.log('decode payload')
  const payload = session.getIdToken().decodePayload()['cognito:username']

  console.log('current user')
  // The function createCognitoUser is private in Amplify. So, we need to cast it
  // in order to call it.
  const currentUser = (Auth as any).createCognitoUser(payload)
  console.log('signin user session')
  // This calls cacheTokens() in Cognito SDK. Assigns the tokens to the local identity.
  currentUser.setSignInUserSession(session)
}

// window.addEventListener(
//   'message',
//   (event) => {
//     console.log('received')
//     console.log(event)
//     if (event.origin !== 'http://localhost:3003') return
//     console.log('received', event.data) // …
//     const urlWithToken = `https://localhost:4200/login#access_token=${event.data.accessToken}&id_token=${event.data.idToken}&refresh_token=${event.data.refreshToken}&token_type=Bearer&expires_in=3600`
//     console.log('URL!!!!!: ', urlWithToken)
//     // ;(Amplify.Auth as any)._handleAuthResponse(urlWithToken)
//     Auth.currentSession()
//       .then((session) => {
//         console.log('we have session')
//         console.log(session)
//       })
//       .catch((err) => {
//         injectTokensIntoAmplify(event.data.accessToken, event.data.idToken, event.data.refreshToken)
//       })
//   },
//   false,
// )

/**
 * returns the same token if it's well formed and not expired
 * otherwise returns null
 * could be sync but jwtDecode throws
 */
const checkTokenValid = async (token: string | null | undefined) => {
  if (!token) return null
  const [jwtDecodeError, decodedToken] = await to(Promise.resolve(jwtDecode<JwtPayload>(token)))
  if (jwtDecodeError) {
    // TODO add logger lib ?
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
  iframe.src = 'http://localhost:3003/get-jwt'
  iframe.style.display = 'none'
  // create a promise which resolves when postMessage is received from iframe, or times out after 5 seconds
  // keep eventListenerReference in scope so we can remove it later
  let eventListenerReference: undefined | ((event: any) => void)
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('TOKEN_REFRESH_TIMEOUT_ERROR_MESSAGE')), 5000)
    eventListenerReference = (event) => {
      // ignore if origin is not our iframe
      if (event.origin === 'http://localhost:3003') {
        // TOOD continue here add check for matching message type
        resolve(event.data)
      }
    }
    window.addEventListener('message', eventListenerReference)
  })
  // add iframe to the document
  document.body.appendChild(iframe)
  const [postMessageError, data] = await to(promise)
  // remove iframe from the document, remove event listener
  document.body.removeChild(iframe)
  if (eventListenerReference) {
    window.removeEventListener('message', eventListenerReference)
  } else {
    // TODO add logger lib ?
    console.warn('eventListenerReference is undefined')
  }
  // TODO nicer data validation
  const accessToken =
    typeof data === 'object' &&
    data &&
    'accessToken' in data &&
    typeof data.accessToken === 'string'
      ? data.accessToken
      : null
  token = await checkTokenValid(accessToken)
  // TODO nicer data validation, handle not logged in
  if (token) {
    // store in local storage for subsequent requests
    localStorage.setItem('cognitoAccessToken', token)
    return token
  }
  console.warn('None or invalid token received from iframe', postMessageError, data)
  return null
}
