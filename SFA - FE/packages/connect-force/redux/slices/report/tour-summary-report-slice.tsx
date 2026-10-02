import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    tourSummaryDetails: [],
};

export const tourSummaryReportSlice = createSlice({
    name: "TourSummaryReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setRepBydistri(state, action) {
            state.repBydistri = action.payload;
        },
        setTourSummaryDetails(state, action) {
            state.tourSummaryDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setTourSummaryDetails,
} = tourSummaryReportSlice.actions;
export default tourSummaryReportSlice.reducer;