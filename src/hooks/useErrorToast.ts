import { setToast } from "../store/global";
import { useAppDispatch } from "./store";

export const useErrorToast = () => {
  const dispatch = useAppDispatch();

  return () =>
    dispatch(
      setToast({
        type: "error",
        message: "Niečo sa pokazilo. Prosím skúste to neskôr.",
      })
    );
};
