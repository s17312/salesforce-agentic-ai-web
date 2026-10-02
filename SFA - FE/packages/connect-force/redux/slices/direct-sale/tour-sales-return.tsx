import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourSalesReturn {
    ReturnReasons: any[];
    ReturnProducts: any[];
    ReturnByInvoiceId: any;
};

const initialState: TourSalesReturn = {
    ReturnReasons: [],
    ReturnProducts: [],
    ReturnByInvoiceId: {},
};

export const tourDirectSalesReturnSlice = createSlice({
    name: "tourDirectSalesReturnSlice",
    initialState,
    reducers: {
        setReturnReasons(state, action: PayloadAction<any[]>) {
            state.ReturnReasons = action.payload;
        },
        setReturnProducts(state, action: PayloadAction<any[]>) {
            state.ReturnProducts = action.payload;
        },
        setReturnByInvoiceId(state, action: PayloadAction<any>) {
            state.ReturnByInvoiceId = action.payload;
        },
    }
});

export const {
    setReturnReasons,
    setReturnProducts,
    setReturnByInvoiceId,
} = tourDirectSalesReturnSlice.actions;

export default tourDirectSalesReturnSlice.reducer;