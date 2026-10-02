import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignOutlet: [],
  assignedOutlet: [],
  distributorOutlets: [],
  distributorOutletMsg: null,
  distributorOutletsIsTrue: [],
};

export const distributorOutletSlice = createSlice({
  name: "DistributorOutletSlice",
  initialState,
  reducers: {
    setAssignOutlet(state, action) {
      state.assignOutlet = action.payload;
    },
    setAssignedOutlet(state, action) {
      state.assignedOutlet = action.payload;
    },
    setDistributorOutlets(state, action) {
      state.distributorOutlets = action.payload;
    },
    setDistributorOutletsIsTrue(state, action) {
      state.distributorOutletsIsTrue = action.payload;
    },
    setDistributorOutletMsg(state, action) {
      state.distributorOutletMsg = action.payload;
    },
  },
});

export const {
  setAssignOutlet,
  setAssignedOutlet,
  setDistributorOutlets,
  setDistributorOutletMsg,
  setDistributorOutletsIsTrue,
} = distributorOutletSlice.actions;
export default distributorOutletSlice.reducer;
