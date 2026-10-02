import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourValueSalesState {
    TourValueSales: any[];
    ValueUnloadingHeader: any;
    ValueUnloadingDetails: any[];
    PriceListsByDistributorId: any[];
    UnloadingProducts: any[];
    TempPayments: any[];
};

const initialState: TourValueSalesState = {
    TourValueSales: [],
    ValueUnloadingHeader: {},
    ValueUnloadingDetails: [],
    PriceListsByDistributorId: [],
    UnloadingProducts: [],
    TempPayments: [],
};

export const tourValueSalesSlice = createSlice({
    name: "tourValueSalesSlice",
    initialState,
    reducers: {
        setTourValueSales(state, action: PayloadAction<any[]>) {
            state.TourValueSales = action.payload;
        },
        setValueUnloadingHeader(state, action: PayloadAction<any>) {
            state.ValueUnloadingHeader = action.payload;
        },
        setValueUnloadingDetails(state, action: PayloadAction<any[]>) {
            state.ValueUnloadingDetails = action.payload;
        },
        setPriceListsByDistributorId(state, action: PayloadAction<any[]>) {
            state.PriceListsByDistributorId = action.payload;
        },
        setUnloadingProducts(state, action: PayloadAction<any[]>) {
            state.UnloadingProducts = action.payload;
        },
        setTempPayments(state, action: PayloadAction<any[]>) {
            state.TempPayments = action.payload;
        },
    }
})

export const {
    setTourValueSales,
    setValueUnloadingHeader,
    setValueUnloadingDetails,
    setPriceListsByDistributorId,
    setUnloadingProducts,
    setTempPayments,
} = tourValueSalesSlice.actions;

export default tourValueSalesSlice.reducer;