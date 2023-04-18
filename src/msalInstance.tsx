import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './msalAuthConfig'

export const msalInstance = new PublicClientApplication(msalConfig)
