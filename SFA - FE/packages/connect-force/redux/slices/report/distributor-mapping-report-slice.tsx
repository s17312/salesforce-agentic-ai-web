import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorMappingReport: [],
    distributorMappingReportMsg: null,
    activeDistributors: [],
}

export const distributorMappingReportSlice = createSlice({
    name: "DistributorMappingReport",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
          },
        setDistributorMappingReport(state, action) {
            state.isLoading = false;
            state.distributorMappingReport = action.payload;
        },
        setDistributorMappingReportMsg(state, action) {
            state.isLoading = false;
            state.distributorMappingReportMsg = action.payload;
        },
        setActiveDistributors(state, action) {
            state.isLoading = false;
            state.activeDistributors = action.payload;
        }
    },
});

export const {
    setDistributorMappingReport,
    setDistributorMappingReportMsg,
    setActiveDistributors,
} = distributorMappingReportSlice.actions;
export default distributorMappingReportSlice.reducer;