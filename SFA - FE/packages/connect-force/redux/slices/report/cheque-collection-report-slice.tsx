import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    activeRoutes: [],
    activeOutlets: [],
    chequeCollectionDetails: [],
};

export const chequeCollectionReportSlice = createSlice({
    name: "ChequeCollectionReportSlice",
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
        setChequeCollectionDetails(state, action) {
            state.chequeCollectionDetails = action.payload;
        }
    },
});

export const {
    setDistributorView,
    setRepBydistri,
    setActiveRoutes,
    setActiveOutlets,
    setChequeCollectionDetails,
} = chequeCollectionReportSlice.actions;
export default chequeCollectionReportSlice.reducer;