import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    discountEligibilityReportDetails: [],
};

export const discountEligibilityReportSlice = createSlice({
    name: "DiscountEligibilityReportSlice",
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
        setDiscountEligibilityReportDetails(state, action) {
            state.discountEligibilityReportDetails = action.payload;
        }
    }
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setDiscountEligibilityReportDetails,
} = discountEligibilityReportSlice.actions;
export default discountEligibilityReportSlice.reducer;