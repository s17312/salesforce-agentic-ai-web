import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignRepresentative: [],
  assignedRepresentative: [],
  discountRepresentatives: [],
  discountRepresentativesIsTrue: [],
  discountRepresentativesMsg: null,
};

export const discountRepresentativeSlice = createSlice({
  name: "DiscountRepresentativeSlice",
  initialState,
  reducers: {
    setAssignRepresentative(state, action) {
      state.assignRepresentative = action.payload;
    },
    setAssignedRepresentative(state, action) {
      state.assignedRepresentative = action.payload;
    },
    setDiscountRepresentatives(state, action) {
      state.discountRepresentatives = action.payload;
    },
    setDiscountRepresentativesIsTrue(state, action) {
      state.discountRepresentativesIsTrue = action.payload;
    },
    setDiscountRepresentativesMsg(state, action) {
      state.discountRepresentativesMsg = action.payload;
    },
  },
});

export const {
  setAssignRepresentative,
  setAssignedRepresentative,
  setDiscountRepresentatives,
  setDiscountRepresentativesIsTrue,
  setDiscountRepresentativesMsg,
} = discountRepresentativeSlice.actions;
export default discountRepresentativeSlice.reducer;
