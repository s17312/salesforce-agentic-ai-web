import { createSlice } from "@reduxjs/toolkit"

const initialState: any = {
    distributorView: [],
    priceListView: [],
    poGRNSummaryDetails: [],
}

export const poGRNSummaryReportSlice = createSlice({
    name: "POGRNSummaryReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setPriceListView(state, action) {
            state.priceListView = action.payload;
        },
        setPOGRNSummaryDetails(state, action) {
            state.poGRNSummaryDetails = action.payload;
        }
    }
});

export const {
    setDistributorView,
    setPriceListView,
    setPOGRNSummaryDetails
} = poGRNSummaryReportSlice.actions;
export default poGRNSummaryReportSlice.reducer;