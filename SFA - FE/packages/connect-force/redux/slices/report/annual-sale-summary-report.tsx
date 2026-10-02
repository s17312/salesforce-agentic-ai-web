import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    annualSaleSummaryDetails: [],
};

export const annualSaleSummaryReportSlice = createSlice({
    name: "AnnualSaleSummaryReportSlice",
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
        setAnnualSaleSummaryDetails(state, action) {
            state.annualSaleSummaryDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setAnnualSaleSummaryDetails,
} = annualSaleSummaryReportSlice.actions;
export default annualSaleSummaryReportSlice.reducer;