import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    distributorView:[],
    repBydistri: [],
    distributorSalesDetails: [],
};

export const distributorSalesReportSlice = createSlice({
    name: "DistributorSalesReportSlice",
    initialState,
    reducers: {
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setRepBydistri(state, action) {
            state.repBydistri = action.payload;
        },
        setDistributorSalesDetails(state, action) {
            state.distributorSalesDetails = action.payload;
        }
    }
});

export const {
    setDistributorView,
    setRepBydistri,
    setDistributorSalesDetails,
} = distributorSalesReportSlice.actions;
export default distributorSalesReportSlice.reducer;