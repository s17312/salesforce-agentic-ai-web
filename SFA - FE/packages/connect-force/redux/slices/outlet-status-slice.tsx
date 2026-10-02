import { createSlice } from "@reduxjs/toolkit";

export type OutletStatusState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  outletStatuss: any[];
  outletStatus: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: OutletStatusState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  outletStatuss: [],
  outletStatus: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const outletStatusSlice = createSlice({
  name: "OutletStatus",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllOutletStatus(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.outletStatuss.findIndex(d => d.uId === action.payload.data.uId);
        if (index !== -1) {
          state.outletStatuss[index] = action.payload.data;
        }
      } else {
        state.outletStatuss = action.payload;
      }
    },
    setOutletStatus(state, action) {
      state.isLoading = false;
      state.outletStatus = action.payload;
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
    setOutletStatusError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setOutletStatusMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllOutletStatus,
  setOutletStatus,
  setPaginationDetails,
  setPage,
  setOutletStatusError,
  setOutletStatusMessage,
  setRowsPerPage,
} = outletStatusSlice.actions;
export default outletStatusSlice.reducer;
