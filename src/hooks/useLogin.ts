import { useMsal } from "@azure/msal-react";
import { msalLoginRequest } from "../msalAuthConfig";
import { msalInstance } from "../msalInstance";
import to from "await-to-js";
import { AuthenticationResult } from "@azure/msal-browser";
import { AuthError } from "@azure/msal-common";
import { AxiosError, AxiosResponse } from "axios";
import { useLogout } from "./useLogout";
import { useHistory } from "react-router-dom";
import { registerUser, RegisterUserResponse } from "../store/global/api";
import { useErrorToast } from "./useErrorToast";

export const useLogin = () => {
  const { instance } = useMsal();
  const logout = useLogout();
  const dispatchErrorToast = useErrorToast();
  const history = useHistory();

  return async (
    afterLoginCallback: () => void = () => {
      // If the user is on the ticket page and, then he logs in, stay at the page, but the page must be reloaded to function properly
      // https://stackoverflow.com/a/66114844
      if (history.location.pathname === "/order") {
        history.push("/refresh");
      } else {
        history.push("tickets");
      }
    }
  ) => {
    const [authError] = await to<AuthenticationResult, AuthError>(
      instance.loginPopup({ ...msalLoginRequest })
    );
    if (authError) {
      // If user cancels, we don't want to display error.
      if (authError?.errorCode === "user_cancelled") {
        return;
      }
      console.error(authError);
      dispatchErrorToast();
      return;
    }

    // An account must be set after login.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);

    const [registrationError] = await to<
      AxiosResponse<RegisterUserResponse>,
      AxiosError
    >(registerUser());
    // 409 response means the user is already registered, it is an error, but we want to skip it
    const isConflictError = registrationError?.response?.status === 409;

    if (registrationError && !isConflictError) {
      console.error(registrationError);
      dispatchErrorToast();
      // If registration fails we want to log out the user from MSAL to make him to do the request again and not interact
      // with the app in semi-authorized state
      logout();
      return;
    }

    afterLoginCallback();
  };
};
