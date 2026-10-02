import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    invoiceAgingDetails: [],
};

export const invoiceAgingReportSlice = createSlice({
    name: "InvoiceAgingReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setRepBydistri(state, action) {
            state.repBydistri = action.payload;
        },
        setActiveRoutes(state, action) {
            state.activeRoutes = action.payload;
        },
        setActiveOutlets(state, action) {
            state.activeOutlets = action.payload;
        },
        setInvoiceAgingDetails(state, action) {
            state.invoiceAgingDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setInvoiceAgingDetails,
} = invoiceAgingReportSlice.actions;
export default invoiceAgingReportSlice.reducer;