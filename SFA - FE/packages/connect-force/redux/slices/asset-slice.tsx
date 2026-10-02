import { AssetState } from "@/types/asset-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  assetDetails: [],
  allocationAssetDetails: [], 
  isActive: true,
  asset: null,
  message: null,
  newPage: 1,
  newRowsPerPage: 100,
};

export const assetSlice = createSlice({
  name: "Asset",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllAssetDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.assetDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.assetDetails[index] = action.payload.data;
        }
      } else {
        state.assetDetails = action.payload;
      }
    },
    setAllAllocationAssetDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.allocationAssetDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.allocationAssetDetails[index] = action.payload.data;
        }
      } else {
        state.allocationAssetDetails = action.payload;
      }
    },
    setAsset(state, action) {
      state.isLoading = false;
      state.asset = action.payload;
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
    setAssetError(state, action) {
      state.error = action.payload;
    },
    setAssetMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
    removeAllocatedAssets(state, action) {
      const allocatedAssetIds = action.payload; 
      state.assetDetails = state.assetDetails.filter(
        (asset) => !allocatedAssetIds.includes(asset.uId.toString())
      );
    },
  },
});

export const {
  startLoading,
  setAllAssetDetails,
  setAllAllocationAssetDetails,
  setAsset,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setAssetError,
  setAssetMessage,
  removeAllocatedAssets,
} = assetSlice.actions;
export default assetSlice.reducer;
