import { useMsal } from "@azure/msal-react";
import { useHistory } from "react-router-dom";
import to from "await-to-js";
import { useErrorToast } from "./useErrorToast";

export const useLogout = () => {
  const { instance } = useMsal();
  const dispatchErrorToast = useErrorToast();
  const history = useHistory();

  return async () => {
    history.push("/");

    const [logoutError] = await to(instance.logoutPopup());

    if (logoutError) {
      console.error(logoutError);
      dispatchErrorToast();
    }
  };
};
