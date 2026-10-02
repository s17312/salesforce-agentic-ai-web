import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  newDistributorGRNDetails: [],
  isActive: true,
  newDistributorGRN: {},
  message: null,
  newPage: 1,
  newRowsPerPage: 100,
};

export const newDistributorGrnSlice = createSlice({
  name: "NewDistributorGRN",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllNewDistributorGRNDetails(state, action) {
      state.isLoading = false;
      state.newDistributorGRNDetails = action.payload;
    },
    setNewDistributorGRN(state, action) {
      state.isLoading = false;
      state.newDistributorGRN = action.payload;
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
    newDistributorGRNTypeError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setAllNewDistributorGRNDetails,
  setNewDistributorGRN,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  newDistributorGRNTypeError,
} = newDistributorGrnSlice.actions;
export default newDistributorGrnSlice.reducer;
