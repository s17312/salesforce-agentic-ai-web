
import { DistributorAccountsState } from "@/types/distributor-accounts-type";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DistributorAccountsState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  distributorAccountsDetails: [],
  distributorAssignedAccountsDetails: [],
  isActive: true,
  distributorAccount: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const distributorAccountsSlice = createSlice({
  name: "DistributorAccounts",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllDistributorAccountsDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.distributorAccountsDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.distributorAccountsDetails[index] = action.payload.data;
        }
      } else {
        state.distributorAccountsDetails = action.payload;
      }
    },
    setDistributorAccountsAssignedDetails(state, action) {
      state.isLoading = false;
      state.distributorAssignedAccountsDetails = action.payload;
    },
    setDistributorAccounts(state, action) {
      state.isLoading = false;
      state.distributorAccount = action.payload;
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
    setDistributorAccountsError(state, action) {
      state.error = action.payload;
    },
    setDistributorAccountsMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllDistributorAccountsDetails,
  setDistributorAccounts,
  setDistributorAccountsAssignedDetails,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setDistributorAccountsError,
  setDistributorAccountsMessage,
} = distributorAccountsSlice.actions;
export default distributorAccountsSlice.reducer;
