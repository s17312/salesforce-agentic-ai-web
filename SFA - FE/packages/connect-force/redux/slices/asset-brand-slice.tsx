import { AssetBrandState } from "@/types/assetBrand-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetBrandState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  assetBrandDetails: [],
  isActive: true,
  assetBrand: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const assetBrandSlice = createSlice({
  name: "AssetBrand",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllAssetBrandDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.assetBrandDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.assetBrandDetails[index] = action.payload.data;
        }
      } else {
        state.assetBrandDetails = action.payload;
      }
    },
    setAssetBrand(state, action) {
      state.isLoading = false;
      state.assetBrand = action.payload;
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
    setAssetBrandError(state, action) {
      state.error = action.payload;
    },
    setAssetBrandMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllAssetBrandDetails,
  setAssetBrand,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setAssetBrandError,
  setAssetBrandMessage,
} = assetBrandSlice.actions;
export default assetBrandSlice.reducer;
