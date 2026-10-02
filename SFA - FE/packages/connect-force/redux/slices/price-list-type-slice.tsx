import { PriceListTypeState } from "@/types/price-list-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PriceListTypeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  priceListTypeDetails: [],
  isActive: true,
  priceListType: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const priceListTypeSlice = createSlice({
  name: "PriceListType",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllPriceListTypeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.priceListTypeDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.priceListTypeDetails[index] = action.payload.data;
        }
      } else {
        state.priceListTypeDetails = action.payload;
      }
    },
    setPriceListType(state, action) {
      state.isLoading = false;
      state.priceListType = action.payload;
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
    setPriceListTypeError(state, action) {
      state.error = action.payload;
    },
    setPriceListTypeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllPriceListTypeDetails,
  setPriceListType,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setPriceListTypeError,
  setPriceListTypeMessage,
} = priceListTypeSlice.actions;
export default priceListTypeSlice.reducer;
