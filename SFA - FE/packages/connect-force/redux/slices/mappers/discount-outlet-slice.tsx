import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignOutlet: [],
  assignedOutlet: [],
  discountOutlets: [],
  discountOutletsIsTrue: [],
  discountOutletsMsg: null,
};

export const discountOutletSlice = createSlice({
  name: "DiscountOutletSlice",
  initialState,
  reducers: {
    setAssignOutlet(state, action) {
      state.assignOutlet = action.payload;
    },
    setAssignedOutlet(state, action) {
      state.assignedOutlet = action.payload;
    },
    setDiscountOutlets(state, action) {
      state.discountOutlets = action.payload;
    },
    setDiscountOutletsIsTrue(state, action) {
      state.discountOutletsIsTrue = action.payload;
    },
    setDiscountOutletsMsg(state, action) {
      state.discountOutletsMsg = action.payload;
    },
  },
});

export const {
  setAssignOutlet,
  setAssignedOutlet,
  setDiscountOutlets,
  setDiscountOutletsIsTrue,
  setDiscountOutletsMsg,
} = discountOutletSlice.actions;
export default discountOutletSlice.reducer;
