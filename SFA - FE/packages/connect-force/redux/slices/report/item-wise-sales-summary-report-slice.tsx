import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView: [],
    repBydistri: [],
    itemWiseDetails: [],
};

export const itemWiseSalesSummaryReportSlice = createSlice({
    name: "ItemWiseSalesSummaryReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setRepBydistri(state, action) {
            state.repBydistri = action.payload;
        },
        setItemWiseDetails(state, action) {
            state.itemWiseDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setItemWiseDetails,
} = itemWiseSalesSummaryReportSlice.actions;
export default itemWiseSalesSummaryReportSlice.reducer;
