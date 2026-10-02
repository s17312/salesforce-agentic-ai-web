import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    invoiceDetails: [],
};

export const invoiceDetailReportSlice = createSlice({
    name: "InvoiceDetailReportSlice",
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
        setInvoiceDetails(state, action) {
            state.invoiceDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setInvoiceDetails,
    setActiveRoutes,
    setActiveOutlets,
} = invoiceDetailReportSlice.actions;
export default invoiceDetailReportSlice.reducer;
