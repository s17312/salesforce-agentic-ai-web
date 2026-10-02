import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignRoute: [],
  assignedRoute: [],
  distributorRoutes: [],
  distributorRouteMsg: null,
  distributorRoutesIsTrue: [],
};

export const distributorRouteSlice = createSlice({
  name: "DistributorRouteSlice",
  initialState,
  reducers: {
    setAssignRoute(state, action) {
      state.assignRoute = action.payload;
    },
    setAssignedRoute(state, action) {
      state.assignedRoute = action.payload;
    },
    setDistributorRoutes(state, action) {
      state.distributorRoutes = action.payload;
    },
    setDistributorRouteMsg(state, action) {
      state.distributorRouteMsg = action.payload;
    },
    setDistributorRoutesIsTrue(state, action) {
      state.distributorRoutesIsTrue = action.payload;
    },
  },
});

export const {
  setAssignRoute,
  setAssignedRoute,
  setDistributorRoutes,
  setDistributorRouteMsg,
  setDistributorRoutesIsTrue,
} = distributorRouteSlice.actions;
export default distributorRouteSlice.reducer;
