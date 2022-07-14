import { setToast } from "../store/global";
import { useAppDispatch } from "./store";
import { AxiosError } from "axios";

export const useErrorToast = () => {
  const dispatch = useAppDispatch();

  const dispatchErrorToast = (message?: string) =>
    dispatch(
      setToast({
        type: "error",
        message: message ?? "Niečo sa pokazilo. Prosím skúste to neskôr.",
      })
    );

  const dispatchErrorToastForHttpRequest = <T extends ErrorWithMessages>(
    error: AxiosError<T>,
    defaultMessage?: string
  ) => {
    const message = (() => {
      const messages = error?.response?.data?.messages;
      if (!messages) {
        return defaultMessage;
      }
      return messages.map((m) => m.message).join("\n");
    })();

    dispatchErrorToast(message);
  };

  return { dispatchErrorToast, dispatchErrorToastForHttpRequest };
};

export type ErrorWithMessages = {
  messages: { type: string; message: string }[];
};
