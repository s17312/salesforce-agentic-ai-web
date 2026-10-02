import { DistributorSliceState } from "@/types/distributor-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DistributorSliceState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  distributors: [],
  distributor: null,
  distributorMapping: [],
  newPage: 0,
  newRowsPerPage: 100,
};

export const distributorSlice = createSlice({
  name: "Distributor",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllDistributors(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.distributors.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.distributors[index] = action.payload.data;
        }
      } else {
        state.distributors = action.payload;
      }
    },
    setDistributor(state, action) {
      state.isLoading = false;
      state.distributor = action.payload;
    },
    setDistributorMapping(state, action) {
      state.isLoading = false;
      state.distributorMapping = action.payload;
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
    setDistributorError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setDistributorMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllDistributors,
  setDistributor,
  setDistributorMapping,
  setPaginationDetails,
  setPage,
  setDistributorError,
  setDistributorMessage,
  setRowsPerPage,
  // setupdateToggle
} = distributorSlice.actions;
export default distributorSlice.reducer;
