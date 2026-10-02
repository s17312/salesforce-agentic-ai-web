import { AssetTransactioState } from "@/types/asset-transfer-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AssetTransactioState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    assetTransactionDetails: [],
    isActive: true,
    assetTransaction: null,
    message: null,
    newPage: 0,
    newRowsPerPage: 100,
}

export const assetTransactionSlice = createSlice({
    name: "AssetTransaction",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllAssetTransactionDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.assetTransactionDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.assetTransactionDetails[index] = action.payload.data;
                }
            } else {
                state.assetTransactionDetails = action.payload;
            }
        },
        setAssetTransaction(state, action) {
            state.isLoading = false;
            state.assetTransaction = action.payload;
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
        setAssetTransactionError(state, action) {
            state.error = action.payload;
        },
        setAssetTransactionMessage(state, action) {
            state.message = action.payload;
            state.error = null;
        }
    }
});

export const {
    startLoading,
    setAllAssetTransactionDetails,
    setAssetTransaction,
    setPaginationDetails,
    setPage,
    setRowsPerPage,
    setAssetTransactionError,
    setAssetTransactionMessage
} = assetTransactionSlice.actions;