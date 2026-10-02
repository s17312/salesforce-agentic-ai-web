import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
 assignOutlet: [],
 assignedOutlet: [],
 routeOutlets:[],
 routeOutletMsg: null,
 routeOutletsIsTrue:[],
}

export const routeOutletsSlice = createSlice({
  name: "RouteOutletSlice",
  initialState,
  reducers: {
    setAssignOutlet(state, action) {
      state.assignOutlet = action.payload;
    },
    setAssignedOutlet(state, action) {
      state.assignedOutlet = action.payload;
    },
    setRouteOutlets(state, action) {
      state.routeOutlets = action.payload;
    },
    setRouteOutletsIsTrue(state, action) {
      state.routeOutletsIsTrue = action.payload;
    },
    setRouteOutletsMsg(state, action) {
      state.routeOutletMsg = action.payload;
    }
  },
});

export const {
    setAssignOutlet,
    setAssignedOutlet,
    setRouteOutlets,
    setRouteOutletsMsg,
    setRouteOutletsIsTrue,
} = routeOutletsSlice.actions;
export default routeOutletsSlice.reducer;
