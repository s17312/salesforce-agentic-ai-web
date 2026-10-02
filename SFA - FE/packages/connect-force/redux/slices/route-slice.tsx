import { createSlice } from "@reduxjs/toolkit";

export type RouteState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  routes: any[];
  route: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: RouteState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  routes: [],
  route: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const routeSlice = createSlice({
  name: "Route",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllRoutes(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.routes.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
          state.routes[index] = action.payload.data;
        }
      } else {
        state.routes = action.payload;
      }
    },
    setRoute(state, action) {
      state.isLoading = false;
      state.route = action.payload;
    },
    setPaginationDetails(state, action) {
      state.paginationDetails = action.payload;
    },
    setPage(state, action) {
      state.newPage = action.payload;
    },
    setRowsPerPage(state, action) {
      state.newRowsPerPage = action.payload;
    },
    setRouteError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setRouteMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllRoutes,
  setRoute,
  setPaginationDetails,
  setPage,
  setRouteError,
  setRouteMessage,
  setRowsPerPage,
} = routeSlice.actions;
export default routeSlice.reducer;
