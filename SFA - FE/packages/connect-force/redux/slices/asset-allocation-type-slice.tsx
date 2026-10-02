import { AssetAllocationTypeState } from "@/types/asset-allocation-type-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetAllocationTypeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  assetAllocationTypeDetails: [],
  isActive: true,
  assetAllocationType: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const assetAllocatioTypeSlice = createSlice({
    name: "AssetAllocationType",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllAssetAllocationTypeDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.assetAllocationTypeDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.assetAllocationTypeDetails[index] = action.payload.data;
                }
            } else {
                state.assetAllocationTypeDetails = action.payload;
            }
        },
        setAssetAllocationType(state, action) {
            state.isLoading = false;
            state.assetAllocationType = action.payload;
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
        setAssetAllocationTypeError(state, action) {
            state.error = action.payload;
        },
        setAssetAllocationTypeMessage(state, action) {
            state.message = action.payload;
            state.error = null;
        },
    }
});

export const {
    startLoading,
    setAllAssetAllocationTypeDetails,
    setAssetAllocationType,
    setPaginationDetails,
    setPage,
    setRowsPerPage,
    setAssetAllocationTypeMessage,
    setAssetAllocationTypeError,
  } = assetAllocatioTypeSlice.actions;
  export default assetAllocatioTypeSlice.reducer;
