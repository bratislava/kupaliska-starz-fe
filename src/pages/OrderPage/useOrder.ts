import to from "await-to-js";
import { order } from "../../store/order/api";
import { useErrorToast } from "../../hooks/useErrorToast";
import { AxiosError, AxiosResponse } from "axios";

/* Sends the order request and handles the necessary logic.

Inspired by https://dev.azure.com/bratislava-innovation/Inovacie/_git/kupaliska-starz-fe?path=%2Fsrc%2Fstore%2Forder%2Fthunks.ts */
export const useOrder = () => {
  const dispatchErrorToast = useErrorToast();

  return async (request: any) => {
    const [err, response] = await to<AxiosResponse<any>, AxiosError<any>>(
      order(request)
    );
    if (response) {
      if (
        response?.data?.messages[0] &&
        response?.data?.messages[0].type === "SUCCESS"
      ) {
        window.location.href = `${response.data.data.url}?${response.data.data.formurlencoded}`;
        return;
      } else {
        dispatchErrorToast();
        return;
      }
    }

    if (err?.response?.status === 400) {
      dispatchErrorToast(
        err.response.data.messages && err.response.data.messages.length > 0
          ? err.response.data.messages[0].message
          : "Objednávku sa nepodarilo odoslať"
      );
      return;
    }

    dispatchErrorToast();
  };
};
