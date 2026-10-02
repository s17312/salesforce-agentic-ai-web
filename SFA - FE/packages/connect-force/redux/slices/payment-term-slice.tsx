import { createSlice } from "@reduxjs/toolkit";

export type PaymentTermState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: any;
  paymentTerms: any[];
  paymentTerm: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: PaymentTermState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  paymentTerms: [],
  paymentTerm: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const paymentTermSlice = createSlice({
  name: "PaymentTerm",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllPaymentTerms(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.paymentTerms.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
          state.paymentTerms[index] = action.payload.data;
        }
      } else {
        state.paymentTerms = action.payload;
      }
    },
    setPaymentTerm(state, action) {
      state.isLoading = false;
      state.paymentTerm = action.payload;
    },
    setPaginationDetails(state, action) {
      state.paginationDetails = action.payload;
    },
    setPage(state, action) {
      state.newPage = action.payload;
    },
    setRowsPerPage(state, action) {
      state.newRowsPerPage = action.payload;
    },
    setPaymentTermError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setAllPaymentTerms,
  setPaymentTerm,
  setPaginationDetails,
  setPage,
  setPaymentTermError,
  setRowsPerPage,
} = paymentTermSlice.actions;
export default paymentTermSlice.reducer;
