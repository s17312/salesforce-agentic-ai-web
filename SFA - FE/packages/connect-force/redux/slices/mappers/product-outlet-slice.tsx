import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignOutlet: [],
  assignedOutlet: [],
  productOutlets: [],
  productOutletsIsTrue: [],
  productOutletsMsg: null,
};

export const productOutletSlice = createSlice({
  name: "ProductOutletSlice",
  initialState,
  reducers: {
    setAssignOutlet(state, action) {
      state.assignOutlet = action.payload;
    },
    setAssignedOutlet(state, action) {
      state.assignedOutlet = action.payload;
    },
    setProductOutlets(state, action) {
      state.productOutlets = action.payload;
    },
    setProductOutletsIsTrue(state, action) {
      state.productOutletsIsTrue = action.payload;
    },
    setProductOutletsMsg(state, action) {
      state.productOutletsMsg = action.payload;
    },
  },
});

export const {
  setAssignOutlet,
  setAssignedOutlet,
  setProductOutlets,
  setProductOutletsIsTrue,
  setProductOutletsMsg,
} = productOutletSlice.actions;
export default productOutletSlice.reducer;
