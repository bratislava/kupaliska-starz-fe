import { createAsyncThunk } from "@reduxjs/toolkit";
import { push } from "connected-react-router";
import { OrderRequest } from "models";
import { setToast } from "store/global";
import { checkDiscountCode, getFinalOrder, order } from "./api";

export const orderActions = createAsyncThunk(
  "order/order",
  async (data: OrderRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await order(data);
      if (
        response.data.messages[0] &&
        response.data.messages[0].type === "SUCCESS"
      ) {
        window.location.href = `${response.data.data.url}?${response.data.data.formurlencoded}`;
      } else {
        dispatch(setToast(
          {
            type: "error",
            message: "Niečo sa pokazilo. Prosím skúste to neskôr."
          }
        ))
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (err) {
      if (err.response.status === 400) {
        dispatch(
          setToast({
            type: "error",
            message:
              err.response.data.messages &&
                err.response.data.messages.length > 0
                ? err.response.data.messages[0].message
                : "Objednávku sa nepodarilo odoslať",
          })
        );
      }
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

export const getFinalOrderDataActions = createAsyncThunk(
  "order/getFinalOrderData",
  async (
    data: { orderId: string; accessToken: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await getFinalOrder(data.orderId, data.accessToken);
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

export const checkDiscountCodeActions = createAsyncThunk(
  "order/checkDiscountCode",
  async (
    data: { ticketTypeId: string; discountCode: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await checkDiscountCode(data.ticketTypeId, data.discountCode);
      return {
        status: "OK" as "OK",
        amount: response.data.discountCode.amount,
        code: response.data.discountCode.code,
      };
    } catch (err) {
      if (err.response.status === 404 || err.response.status === 400) {
        return {
          status: "NOK" as "NOK",
          amount: undefined,
          code: data.discountCode,
        }
      }
      dispatch(setToast(
        {
          type: "error",
          message: "Niečo sa pokazilo. Prosím skúste to neskôr."
        }
      ))
      return rejectWithValue(err.response.data);
    }
  }

)
