import { setToast } from "../store/global";
import { useAppDispatch } from "./store";

export const useErrorToast = () => {
  const dispatch = useAppDispatch();

  return (message?: string) =>
    dispatch(
      setToast({
        type: "error",
        message: message ?? "Niečo sa pokazilo. Prosím skúste to neskôr.",
      })
    );
};
