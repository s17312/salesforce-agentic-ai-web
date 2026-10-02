import { AssetTypeState } from "@/types/assetType-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetTypeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  assetTypeDetails: [],
  isActive: true,
  assetType: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const assetTypeSlice = createSlice({
  name: "AssetType",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllAssetTypeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.assetTypeDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.assetTypeDetails[index] = action.payload.data;
        }
      } else {
        state.assetTypeDetails = action.payload;
      }
    },
    setAssetType(state, action) {
      state.isLoading = false;
      state.assetType = action.payload;
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
    setAssetTypeError(state, action) {
      state.error = action.payload;
    },
    setAssetTypeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllAssetTypeDetails,
  setAssetType,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setAssetTypeError,
  setAssetTypeMessage,
} = assetTypeSlice.actions;
export default assetTypeSlice.reducer;
