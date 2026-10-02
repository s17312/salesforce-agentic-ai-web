import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    priceListView: [],
    repBydistri: [],
    tourAssignedVehicles: [],
    loadingUnloadingSummaryDetails: [],
};

export const loadingUnloadingSummaryReportSlice = createSlice({
    name: "LoadingUnloadingSummaryReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setPriceListView(state, action) {
            state.priceListView = action.payload;
        },
        setRepBydistri(state, action) {
            state.repBydistri = action.payload;
        },
        setTourAssignedVehicles(state, action) {
            state.tourAssignedVehicles = action.payload;
        },
        setLoadingUnloadingSummaryDetails(state, action) {
            state.loadingUnloadingSummaryDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setPriceListView,
    setRepBydistri,
    setTourAssignedVehicles,
    setLoadingUnloadingSummaryDetails,
} = loadingUnloadingSummaryReportSlice.actions;
export default loadingUnloadingSummaryReportSlice.reducer;