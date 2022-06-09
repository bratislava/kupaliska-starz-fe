import { Configuration } from "@azure/msal-browser";
import { environment } from "./environment";

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.msalClientId,
    authority: environment.msalAuthority,
    knownAuthorities: environment.msalKnownAuthorities,
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
  // Uncomment for verbose logging
  /*
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
    */
};

export const msalLoginRequest = {
  scopes: [],
};
