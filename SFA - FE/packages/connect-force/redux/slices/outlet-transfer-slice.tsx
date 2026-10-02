import { createSlice } from "@reduxjs/toolkit";

export type OutletTransferState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  outletTransfers: any[];
  outletTransfer: any;
  newPage: number;
  newRowsPerPage: number;
  distributors: DistributorAssignments[];
};

export type DistributorAssignments = {
  uId: number;
  distributorID: string | null;
  distributorName: string | null;
};

const initialState: OutletTransferState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  outletTransfers: [],
  outletTransfer: null,
  newPage: 0,
  newRowsPerPage: 100,
  distributors: [],
};

export const outletTransferSlice = createSlice({
  name: "OutletTransfer",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllOutletTransfer(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.outletTransfers.findIndex(
          (d) => d.uId === action.payload.data.uId
        );
        if (index !== -1) {
          state.outletTransfers[index] = action.payload.data;
        }
      } else {
        state.outletTransfers = action.payload;
      }
    },
    setOutletTransfer(state, action) {
      state.isLoading = false;
      state.outletTransfer = action.payload;
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
    setOutletTransferError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setOutletTransferMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
    setDistributors(state, action) {
      state.isLoading = false;
      state.distributors = action.payload;
    },
  },
});

export const {
  startLoading,
  setAllOutletTransfer,
  setOutletTransfer,
  setPaginationDetails,
  setPage,
  setOutletTransferError,
  setOutletTransferMessage,
  setRowsPerPage,
  setDistributors,
} = outletTransferSlice.actions;
export default outletTransferSlice.reducer;
