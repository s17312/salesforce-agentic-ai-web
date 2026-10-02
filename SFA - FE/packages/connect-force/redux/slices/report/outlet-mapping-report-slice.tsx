import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    outletMappingDetails: [],
};

export const outletMappingReportSlice = createSlice({
    name: "OutletMappingReportSlice",
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
        setOutletMappingDetails(state, action) {
            state.outletMappingDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setOutletMappingDetails,
} = outletMappingReportSlice.actions;
export default outletMappingReportSlice.reducer;