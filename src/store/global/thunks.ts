import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactFormValues } from "components/ContactForm/ContactForm";
import { fetchPool, fetchPools, fetchTickets, sendContactForm } from "./api";
import { setToast } from "./reducer";

export const fetchPoolActions = createAsyncThunk(
  "global/fetchPool",
  async (poolId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetchPool(poolId);
      return response.data;
    } catch (err) {
      dispatch(setToast(
        {
          type: "error",
          message: "Niečo sa pokazilo. Prosím skúste to neskôr."
        }
      ))
      return rejectWithValue(err.response);
    }
  }
);

export const initPageGlobalState = createAsyncThunk(
  "global/initState",
  async (_data, { rejectWithValue, dispatch }) => {
    try {
      const response = await Promise.all([fetchTickets(), fetchPools(1000000)]);
      return {
        ticketTypes: response[0].data.ticketTypes,
        swimmingPools: response[1].data.swimmingPools,
      };
    } catch (err) {
      dispatch(setToast(
        {
          type: "error",
          message: "Niečo sa pokazilo. Prosím skúste to neskôr."
        }
      ))
      return rejectWithValue(err.response);
    }
  }
);
export const sendContactFormActions = createAsyncThunk(
  "global/sendContactForm",
  async (
    values: { formData: ContactFormValues; recaptchaToken: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { status, data } = await sendContactForm({
        ...values.formData,
        recaptcha: values.recaptchaToken,
        agreement: true,
      });
      dispatch(
        setToast({
          type: "success",
          message: "Správa úspešne odoslaná",
        })
      );
      return {
        status,
        data,
      };
    } catch (err) {
      if (err.response.status === 400) {
        dispatch(
          setToast({
            type: "error",
            message:
              err.response.data.messages &&
                err.response.data.messages.length > 0
                ? err.response.data.messages[0].message
                : "Správu sa nepodarilo odoslať",
          })
        );
        return rejectWithValue(err.response);
      }
      dispatch(
        setToast({
          type: "error",
          message: "Správu sa nepodarilo odoslať",
        })
      );
      return rejectWithValue(err.response);
    }
  }
);
