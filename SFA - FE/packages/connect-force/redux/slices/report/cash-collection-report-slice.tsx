import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    cashCollectionDetails: [],
};

export const cashCollectionReportSlice = createSlice({
    name: "CashCollectionReportSlice",
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
        setCashCollectionDetails(state, action) {
            state.cashCollectionDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setCashCollectionDetails,
} = cashCollectionReportSlice.actions;
export default cashCollectionReportSlice.reducer;