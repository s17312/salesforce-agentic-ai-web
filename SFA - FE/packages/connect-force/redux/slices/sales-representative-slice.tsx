import { SalesRepresentativeState } from "@/types/sales-representative-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SalesRepresentativeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  salesRepresentativeDetails: [],
  isActive: true,
  salesRepresentative: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const salesRepresentativeSlice = createSlice({
  name: "SalesRepresentative",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllSalesRepresentativeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.salesRepresentativeDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.salesRepresentativeDetails[index] = action.payload.data;
        }
      } else {
        state.salesRepresentativeDetails = action.payload;
      }
    },
    setSalesRepresentative(state, action) {
      state.isLoading = false;
      state.salesRepresentative = action.payload;
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
    setSalesRepresentativeError(state, action) {
      state.error = action.payload;
    },
    setSalesRepresentativeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllSalesRepresentativeDetails,
  setSalesRepresentative,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setSalesRepresentativeError,
  setSalesRepresentativeMessage,
} = salesRepresentativeSlice.actions;
export default salesRepresentativeSlice.reducer;
