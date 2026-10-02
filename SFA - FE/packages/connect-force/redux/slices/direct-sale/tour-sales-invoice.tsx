import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourSalesInvoiceState {
    TourScheduleById_invoice: any;
    SalesInvoicePriceListType: any;
    SalesInvoiceProducts: any;
    SalesUnits: any;
    SalesInvoiceByID: any;
    DistributorWarehouses: any;
};

const initialState: TourSalesInvoiceState = {
    TourScheduleById_invoice: {},
    SalesInvoicePriceListType: {},
    SalesInvoiceProducts: {},
    SalesUnits: {},
    SalesInvoiceByID: {},
    DistributorWarehouses: {},
};

export const tourDirectSalesInvoiceSlice = createSlice({
    name: "tourDirectSalesInvoiceSlice",
    initialState,
    reducers: {
        setTourScheduleById_invoice(state, action: PayloadAction<any>) {
            state.TourScheduleById_invoice = action.payload;
        },
        setSalesInvoicePriceListType(state, action: PayloadAction<any[]>) {
            state.SalesInvoicePriceListType = action.payload;
        },
        setSalesInvoiceProducts(state, action: PayloadAction<any[]>) {
            state.SalesInvoiceProducts = action.payload;
        },
        setSalesUnits(state, action: PayloadAction<any[]>) {
            state.SalesUnits = action.payload;
        },
        setSalesInvoiceByID(state, action: PayloadAction<any>) {
            state.SalesInvoiceByID = action.payload;
        },
        resetTourSalesInvoiceSlice: () => initialState,
        setDistributorWarehouses(state, action: PayloadAction<any[]>) {
            state.DistributorWarehouses = action.payload;
        }
    }
});

export const {
    setTourScheduleById_invoice,
    setSalesInvoicePriceListType,
    setSalesInvoiceProducts,
    setSalesUnits,
    setSalesInvoiceByID,
    resetTourSalesInvoiceSlice,
    setDistributorWarehouses,
} = tourDirectSalesInvoiceSlice.actions;

export default tourDirectSalesInvoiceSlice.reducer;