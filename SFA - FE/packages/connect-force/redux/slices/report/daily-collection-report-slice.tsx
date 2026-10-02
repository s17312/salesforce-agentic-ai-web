import { createSlice } from "@reduxjs/toolkit"

const initialState: any = {
    distributorView: [],
    repByDistri: [],
    activeRoutes: [],
    activeOUtlets: [],
    dailyCollectionDetails: [],
}

export const dailyCollectionReportSlice = createSlice({
    name: "DailyCollectionReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setRepByDistri(state, action) {
            state.repByDistri = action.payload;
        },
        setActiveRoutes(state, action) {
            state.activeRoutes = action.payload;
        },
        setActiveOutlets(state, action) {
            state.activeOutlets = action.payload;
        },
        setDailyCollectionDetails(state, action) {
            state.dailyCollectionDetails = action.payload;
        }
    }
});

export const {
    setDistributorView,
    setRepByDistri,
    setActiveRoutes,
    setActiveOutlets,
    setDailyCollectionDetails
} = dailyCollectionReportSlice.actions;
export default dailyCollectionReportSlice.reducer;