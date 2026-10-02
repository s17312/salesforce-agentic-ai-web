import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentSummary {
  paymentSummaryDetails: any[];
  message: any;
  error: any;
}

const initialState: PaymentSummary = {
  paymentSummaryDetails: [],
  message: null,
  error: null,
};

export const paymentSummarySlice = createSlice({
  name: "paymentSummarySlice",
  initialState,
  reducers: {
    setPaymentSummaryDetails(state, action: PayloadAction<any[]>) {
      state.paymentSummaryDetails = action.payload;
    },
    setPaymentSummaryError(state, action) {
      state.error = action.payload;
    },
    setPaymentSummaryMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  setPaymentSummaryDetails,
  setPaymentSummaryError,
  setPaymentSummaryMessage,
} = paymentSummarySlice.actions;

export default paymentSummarySlice.reducer;
