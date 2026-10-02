import { OutletSliceState } from "@/types/outlet-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: OutletSliceState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  outlets: [],
  outlet: null,
  newPage: 0,
  newRowsPerPage: 100,
  message: null,
};

export const outletSlice = createSlice({
  name: "Outlet",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllOutlets(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.outlets.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.outlets[index] = action.payload.data;
        }
      } else {
        state.outlets = action.payload;
      }
    },
    setOutlet(state, action) {
      state.isLoading = false;
      state.outlet = action.payload;
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
    setOutletError(state, action) {
      state.error = action.payload;
    },
    setOutletMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllOutlets,
  setOutlet,
  setPaginationDetails,
  setPage,
  setOutletError,
  setRowsPerPage,
  setOutletMessage,
} = outletSlice.actions;
export default outletSlice.reducer;
