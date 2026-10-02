import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignRepresentative: [],
  assignedRepresentative: [],
  distributorRepresentatives: [],
  distributorRepresentativeMsg: null,
  distributorRepresentativesIsTrue: [],
};

export const distributorRepresentativeSlice = createSlice({
  name: "DistributorRepresentativeSlice",
  initialState,
  reducers: {
    setAssignRepresentative(state, action) {
      state.assignRepresentative = action.payload;
    },
    setAssignedRepresentative(state, action) {
      state.assignedRepresentative = action.payload;
    },
    setDistributorRepresentatives(state, action) {
      state.distributorRepresentatives = action.payload;
    },
    setDistributorRepresentativesIsTrue(state, action) {
      state.distributorRepresentativesIsTrue = action.payload;
    },
    setDistributorRepresentativeMsg(state, action) {
      state.distributorRepresentativeMsg = action.payload;
    },
  },
});

export const {
  setAssignRepresentative,
  setAssignedRepresentative,
  setDistributorRepresentatives,
  setDistributorRepresentativesIsTrue,
  setDistributorRepresentativeMsg,
} = distributorRepresentativeSlice.actions;
export default distributorRepresentativeSlice.reducer;
