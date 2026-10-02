import { ResetRequestPasswordState } from "@/types/user-management/reset-request-password-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ResetRequestPasswordState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  requestedListDetails: [],
  requestedDetail: null,
  isActive: true,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const resetRequestPasswordSlice = createSlice({
  name: "ResetRequestPassword",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllRequestedListDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.requestedListDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.requestedListDetails[index] = action.payload.data;
        }
      } else {
        state.requestedListDetails = action.payload;
      }
    },
    setPaginationDetails(state, action) {
      state.paginationDetails = action.payload;
    },
    setRequestedDetail(state, action) {
      state.isLoading = false;
      state.requestedDetail = action.payload;
    },
    setPage(state, action) {
      state.newPage = action.payload;
    },
    setRowsPerPage(state, action) {
      state.newRowsPerPage = action.payload;
    },
    setRequestedDetailError(state, action) {
      state.error = action.payload;
    },
    setRequestedDetailMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllRequestedListDetails,
  setPaginationDetails,
  setRequestedDetail,
  setPage,
  setRowsPerPage,
  setRequestedDetailError,
  setRequestedDetailMessage,
} = resetRequestPasswordSlice.actions;
export default resetRequestPasswordSlice.reducer;
