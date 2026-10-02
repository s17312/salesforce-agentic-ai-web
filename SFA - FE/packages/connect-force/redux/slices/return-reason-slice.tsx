import { ReturnReasonState } from "@/types/return-reason-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ReturnReasonState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    returnReasonDetails: [],
    isActive: true,
    returnReason: null,
    message: null,
    newPage: 0,
    newRowsPerPage: 100,
};

export const returnReasonSlice = createSlice({
    name: "ReturnReason",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllReturnReasonDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.returnReasonDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.returnReasonDetails[index] = action.payload.data;
                }
            } else {
                state.returnReasonDetails = action.payload;
            }
        },
        setReturnReason(state, action) {
            state.isLoading = false;
            state.returnReason = action.payload;
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
        setReturnReasonError(state, action) {
            state.error = action.payload;
        },
        setReturnReasonMessage(state, action) {
            state.message = action.payload;
            state.error = null;
        },
    },
});

export const {
    startLoading,
    setAllReturnReasonDetails,
    setReturnReason,
    setPaginationDetails,
    setPage,
    setRowsPerPage,
    setReturnReasonError,
    setReturnReasonMessage,
} = returnReasonSlice.actions;

export default returnReasonSlice.reducer;