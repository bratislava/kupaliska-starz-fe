import jwtDecode, { JwtPayload } from 'jwt-decode'
import { environment } from '../environment'
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

/**
 * Makes a request to the cognito endpoint to get an access token
 * @param refreshToken token from cookie
 * @returns
 */
export const getAccessTokenFromRefreshToken = async (refreshToken: string) => {
  const res = await fetch(`${environment.cognitoUrl}`, {
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1',
    },
    mode: 'cors',
    cache: 'no-cache',
    method: 'POST',
    body: JSON.stringify({
      ClientId: environment.cognitoClientId,
      AuthFlow: 'REFRESH_TOKEN',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }),
  })

  const data = await res.json()

  if (!data?.AuthenticationResult?.AccessToken) {
    throw new Error('Unauthorized')
  }

  return data.AuthenticationResult.AccessToken
}
