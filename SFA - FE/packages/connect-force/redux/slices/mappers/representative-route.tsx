import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignRoute: [],
  assignRepresentative: [],
  assignedRoute: [],
  representativeRoutes: [],
  representativeRoutesIsTrue: [],
  representativeRoutesMsg: null,
};

export const routesRepresentativeSlice = createSlice({
  name: "RepresentativeRouteSlice",
  initialState,
  reducers: {
    setAssignRoute(state, action) {
      state.assignRoute = action.payload;
    },
    setAssignRepresentative(state, action) {
      state.assignRepresentative = action.payload;
    },
    setAssignedRoute(state, action) {
      state.assignedRoute = action.payload;
    },
    setRepresentativeRoutes(state, action) {
      state.representativeRoutes = action.payload;
    },
    setRepresentativeRoutesIsTrue(state, action) {
      state.representativeRoutesIsTrue = action.payload;
    },
    setRepresentativeRoutesMsg(state, action) {
      state.representativeRoutesMsg = action.payload;
    },
  },
});

export const {
  setAssignRoute,
  setAssignRepresentative,
  setAssignedRoute,
  setRepresentativeRoutes,
  setRepresentativeRoutesIsTrue,
  setRepresentativeRoutesMsg,
} = routesRepresentativeSlice.actions;
export default routesRepresentativeSlice.reducer;
