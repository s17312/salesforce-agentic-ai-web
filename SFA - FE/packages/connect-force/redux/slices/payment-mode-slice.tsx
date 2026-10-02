import { createSlice } from "@reduxjs/toolkit";

export type PaymentModeState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: any;
    paymentModes: any[];
    paymentMode: any;
    newPage: number;
    newRowsPerPage: number;
};

const initialState: PaymentModeState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    paymentModes: [],
    paymentMode: null,
    newPage: 0,
    newRowsPerPage: 100,
};

export const paymentModeSlice = createSlice({
    name: "PaymentMode",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllPaymentModes(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.paymentModes.findIndex(d => d.uId === action.payload.data.uId);
                if (index !== -1) {
                    state.paymentModes[index] = action.payload.data;
                }
            } else {
                state.paymentModes = action.payload;
            }
        },
        setPaymentMode(state, action) {
            state.isLoading = false;
            state.paymentMode = action.payload;
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
        setPaymentModeError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    startLoading,
    setAllPaymentModes,
    setPaymentMode,
    setPaginationDetails,
    setPage,
    setPaymentModeError,
    setRowsPerPage,
} = paymentModeSlice.actions;
export default paymentModeSlice.reducer;