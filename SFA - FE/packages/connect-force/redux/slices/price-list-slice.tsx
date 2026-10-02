import { PriceTypeState } from "@/types/price-type-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  priceLists: [],
  isActive: true,
  priceList: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const priceListSlice = createSlice({
  name: "Price List",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllPriceLists(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.priceLists.findIndex(
          (d:any) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.priceLists[index] = action.payload.data;
        }
      } else {
        state.priceLists = action.payload;
      }
    },
    setPriceList(state, action) {
      state.isLoading = false;
      state.priceList = action.payload;
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
    setPriceListError(state, action) {
      state.error = action.payload;
    },
    setPriceListMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllPriceLists,
  setPriceList,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setPriceListError,
  setPriceListMessage,
} = priceListSlice.actions;
export default priceListSlice.reducer;
