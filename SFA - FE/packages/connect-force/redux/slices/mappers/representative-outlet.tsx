import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignOutlet: [],
  assignedOutlet: [],
  representativeOutlets: [],
  representativeOutletsIsTrue: [],
  representativeOutletsMsg: null,
};

export const outletsRepresentativeSlice = createSlice({
  name: "RepresentativeOutletSlice",
  initialState,
  reducers: {
    setAssignOutlet(state, action) {
      state.assignOutlet = action.payload;
    },
    setAssignedOutlet(state, action) {
      state.assignedOutlet = action.payload;
    },
    setRepresentativeOutlets(state, action) {
      state.representativeOutlets = action.payload;
    },
    setRepresentativeOutletsIsTrue(state, action) {
      state.representativeOutletsIsTrue = action.payload;
    },
    setRepresentativeOutletsMsg(state, action) {
      state.representativeOutletsMsg = action.payload;
    },
  },
});

export const {
  setAssignOutlet,
  setAssignedOutlet,
  setRepresentativeOutlets,
  setRepresentativeOutletsIsTrue,
  setRepresentativeOutletsMsg,
} = outletsRepresentativeSlice.actions;
export default outletsRepresentativeSlice.reducer;
