import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourSalesDiscountState {
    InvoiceDiscountList: any[];
    AppliedSalesDiscountList?: any[];
}

const initialState: TourSalesDiscountState = {
    InvoiceDiscountList: [],
    AppliedSalesDiscountList: [],
}

export const tourSalesDiscountSlice = createSlice({
    name: "tourSalesDiscountSlice",
    initialState,
    reducers: {
        setInvoiceDiscountList(state, action: PayloadAction<any[]>) {
            state.InvoiceDiscountList = action.payload;
        },
        setAppliedSalesDiscount(state, action: PayloadAction<any[]>) {
            state.AppliedSalesDiscountList = action.payload;
        }
    }
});

export const {
    setInvoiceDiscountList,
    setAppliedSalesDiscount,
} = tourSalesDiscountSlice.actions;

export default tourSalesDiscountSlice.reducer;