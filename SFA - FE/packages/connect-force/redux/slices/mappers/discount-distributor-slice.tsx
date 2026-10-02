import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignDistributor: [],
  assignedDistributor: [],
  discountDistributors: [],
  discountDistributorsIsTrue: [],
  discountDistributorsMsg: null,
};

export const discountDistributorSlice = createSlice({
  name: "DiscountDistributorSlice",
  initialState,
  reducers: {
    setAssignDistributor(state, action) {
      state.assignDistributor = action.payload;
    },
    setAssignedDistributor(state, action) {
      state.assignedDistributor = action.payload;
    },
    setDiscountDistributors(state, action) {
      state.discountDistributors = action.payload;
    },
    setDiscountDistributorsIsTrue(state, action) {
      state.discountDistributorsIsTrue = action.payload;
    },
    setDiscountDistributorsMsg(state, action) {
      state.discountDistributorsMsg = action.payload;
    },
  },
});

export const {
  setAssignDistributor,
  setAssignedDistributor,
  setDiscountDistributors,
  setDiscountDistributorsIsTrue,
  setDiscountDistributorsMsg,
} = discountDistributorSlice.actions;
export default discountDistributorSlice.reducer;
