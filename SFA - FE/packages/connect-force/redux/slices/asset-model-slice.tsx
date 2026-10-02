import { AssetModelState } from "@/types/asset-model-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetModelState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  assetModelDetails: [],
  isActive: true,
  assetModel: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const assetModelSlice = createSlice({
  name: "AssetModel",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllAssetModelDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.assetModelDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.assetModelDetails[index] = action.payload.data;
        }
      } else {
        state.assetModelDetails = action.payload;
      }
    },
    setAssetModel(state, action) {
      state.isLoading = false;
      state.assetModel = action.payload;
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
    setAssetModelError(state, action) {
      state.error = action.payload;
    },
    setAssetModelMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllAssetModelDetails,
  setAssetModel,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setAssetModelError,
  setAssetModelMessage,
} = assetModelSlice.actions;
export default assetModelSlice.reducer;
