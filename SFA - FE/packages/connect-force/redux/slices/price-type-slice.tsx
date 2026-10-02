import { PriceTypeState } from "@/types/price-type-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PriceTypeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  priceTypeDetails: [],
  isActive: true,
  priceType: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const priceTypeSlice = createSlice({
  name: "Price Type",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllPriceTypeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.priceTypeDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.priceTypeDetails[index] = action.payload.data;
        }
      } else {
        state.priceTypeDetails = action.payload;
      }
    },
    setPriceType(state, action) {
      state.isLoading = false;
      state.priceType = action.payload;
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
    setPriceTypeError(state, action) {
      state.error = action.payload;
    },
    setPriceTypeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllPriceTypeDetails,
  setPriceType,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setPriceTypeError,
  setPriceTypeMessage,
} = priceTypeSlice.actions;
export default priceTypeSlice.reducer;
