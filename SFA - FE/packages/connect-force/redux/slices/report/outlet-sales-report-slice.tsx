import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    outletSalesDetails: [],
};

export const outletSalesReportSlice = createSlice({
    name: "OutletSalesReportSlice",
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
        setOutletSalesDetails(state, action) {
            state.outletSalesDetails = action.payload;
        }
    }
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setOutletSalesDetails,
} = outletSalesReportSlice.actions;
export default outletSalesReportSlice.reducer;