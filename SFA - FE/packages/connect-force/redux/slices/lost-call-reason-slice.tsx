import { LostCallReasonState } from "@/types/lost-call-reason-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: LostCallReasonState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  lostCallReasonDetails: [],
  isActive: true,
  lostCallReason: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const lostCallReasonSlice = createSlice({
  name: "LostCallReason",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllLostCallReasonDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.lostCallReasonDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.lostCallReasonDetails[index] = action.payload.data;
        }
      } else {
        state.lostCallReasonDetails = action.payload;
      }
    },
    setLostCallReason(state, action) {
      state.isLoading = false;
      state.lostCallReason = action.payload;
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
    setLostCallReasonError(state, action) {
      state.error = action.payload;
    },
    setLostCallReasonMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllLostCallReasonDetails,
  setLostCallReason,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setLostCallReasonError,
  setLostCallReasonMessage,
} = lostCallReasonSlice.actions;
export default lostCallReasonSlice.reducer;
