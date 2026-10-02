import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourSalesPaymentState {
  outletInvoices: any[];
  outletInvoicesDirectPayment: any[];
  selectedOutletInvoices: any;
  outStanding: any;
  Banks: any;
  BranchesByBankID: any;
}

const initialState: TourSalesPaymentState = {
  outletInvoices: [],
  outletInvoicesDirectPayment: [],
  selectedOutletInvoices: {},
  outStanding: {},
  Banks: [],
  BranchesByBankID: [],
};

export const tourSalesPaymentSlice = createSlice({
  name: "tourSalesPaymentSlice",
  initialState,
  reducers: {
    setOutletInvoices(state, action: PayloadAction<any>) {
      state.outletInvoices = action.payload;
    },
    setOutletInvoicesDirectPayment(state, action: PayloadAction<any>) {
      state.outletInvoicesDirectPayment = action.payload;
    },
    setSelectedOutletInvoices(state, action: PayloadAction<any>) {
      state.selectedOutletInvoices = action.payload;
    },
    setOutStanding(state, action: PayloadAction<any>) {
      state.outStanding = action.payload;
    },
    setBanks(state, action: PayloadAction<any>) {
      state.Banks = action.payload;
    },
    setBranchesByBankID(state, action: PayloadAction<any>) {
      state.BranchesByBankID = action.payload;
    },
  },
});

export const {
  setOutletInvoices,
  setOutletInvoicesDirectPayment,
  setSelectedOutletInvoices,
  setOutStanding,
  setBanks,
  setBranchesByBankID,
} = tourSalesPaymentSlice.actions;

export default tourSalesPaymentSlice.reducer;
