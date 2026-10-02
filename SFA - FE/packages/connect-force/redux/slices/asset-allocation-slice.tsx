import { AssetAllocationState } from "@/types/asset-allocation-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetAllocationState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    assetAllocationDetails: [],
    isActive: true,
    assetAllocation: null,
    message: null,
    newPage: 0,
    newRowsPerPage: 100,
}

export const assetAllocationSlice = createSlice({
    name: "AssetAllocation",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllAssetAllocationDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.assetAllocationDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.assetAllocationDetails[index] = action.payload.data;
                }
            } else {
                state.assetAllocationDetails = action.payload;
            }
        },
        setAssetAllocation(state, action) {
            state.isLoading = false;
            state.assetAllocation = action.payload;
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
        setAssetAllocationError(state, action) {
            state.error = action.payload;
        },
        setAssetAllocationMessage(state, action) {
            state.message = action.payload;
            state.error = null;
        },
    }
});

export const {
    startLoading,
    setAllAssetAllocationDetails,
    setAssetAllocation,
    setPaginationDetails,
    setPage,
    setRowsPerPage,
    setAssetAllocationError,
    setAssetAllocationMessage,
} = assetAllocationSlice.actions;
export default assetAllocationSlice.reducer;
