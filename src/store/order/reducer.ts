import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";

import { CartItem, CustomerInfoFormValues, DiscountCodeState } from "models";
import { checkDiscountCodeActions, orderActions } from "./thunks";

export interface OrderState {
  cart: CartItem | null;
  status: "idle" | "loading" | "failed";
  discountCode?: DiscountCodeState;
  customerInfo?: {
    form: CustomerInfoFormValues;
    photo?: string;
    childrenPhotos?: string[];
  };
}

const initialState: OrderState = {
  cart: null,
  status: "idle",
};

// reducers

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = action.payload;
      state.customerInfo = undefined;
      state.discountCode = undefined;
    },
    resetCart: (state) => {
      state.cart = null;
    },
    resetDiscountCode: (state) => {
      state.discountCode = initialState.discountCode;
    },
    changeCartItemAmount: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.amount = action.payload;
      }
    },
    setCartItemChildren: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.childrenNumber = action.payload;
      }
    },
    setCustomerInfo: (
      state,
      action: PayloadAction<{
        form: CustomerInfoFormValues;
        photo?: string;
        childrenPhotos?: string[];
      }>
    ) => {
      state.customerInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderActions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(orderActions.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(orderActions.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(checkDiscountCodeActions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkDiscountCodeActions.fulfilled, (state, action: PayloadAction<DiscountCodeState>) => {
        state.status = "idle";
        state.discountCode = action.payload
      })
      .addCase(checkDiscountCodeActions.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// actions
export const {
  setCart,
  resetCart,
  changeCartItemAmount,
  setCartItemChildren,
  setCustomerInfo,
  resetDiscountCode,
} = counterSlice.actions;

//selector
export const selectCart = (state: RootState) => state.order.cart;
export const selectOrderStateStatus = (state: RootState) => state.order.status;
export const selectCustomerInfoFormValues = (state: RootState) =>
  state.order.customerInfo?.form;
export const selectCustomerInfoPhotos = (state: RootState) => ({
  photo: state.order.customerInfo?.photo,
  childrenPhotos: state.order.customerInfo?.childrenPhotos,
});
export const selectOrderDiscountCode = (state: RootState) => state.order.discountCode;
export const selectOrderPrice = (state: RootState) => {
  let total = 0;
  if (state.order.cart) {
    total = state.order.cart.amount * state.order.cart.ticket.price;
    state.order.cart.ticket.childrenPrice && (total += state.order.cart.childrenNumber * state.order.cart.ticket.childrenPrice);
  }
  if (state.order.discountCode && state.order.discountCode.status === "OK" && state.order.discountCode.amount) {
    total = total * (100 - state.order.discountCode.amount) * 0.01;
  }

  return total;
}

export default counterSlice.reducer;
