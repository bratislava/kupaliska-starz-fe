// Inspired by https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/1b38e9582ae23bde40fe4bef77f3d838e838e08b/samples/msal-react-samples/react-18-sample/src/utils/MsGraphApiCall.js
import { msalInstance } from '../msalInstance'
import { msalLoginRequest } from '../msalAuthConfig'

/* TODO: fix refresh */
export async function getMsalIdToken() {
  const response = await msalInstance.acquireTokenSilent({
    ...msalLoginRequest,
    forceRefresh: false,
  })
  return response.idToken
}
