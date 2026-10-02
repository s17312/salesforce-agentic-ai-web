
import { UnloadingReasonState } from "@/types/unloading-reason-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UnloadingReasonState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  unloadingReasonDetails: [],
  isActive: true,
  unloadingReason: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const unloadingReasonSlice = createSlice({
  name: "UnloadingReason",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllUnloadingReasonDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.unloadingReasonDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.unloadingReasonDetails[index] = action.payload.data;
        }
      } else {
        state.unloadingReasonDetails = action.payload;
      }
    },
    setUnloadingReason(state, action) {
      state.isLoading = false;
      state.unloadingReason = action.payload;
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
    setUnloadingReasonError(state, action) {
      state.error = action.payload;
    },
    setUnloadingReasonMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllUnloadingReasonDetails,
  setUnloadingReason,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setUnloadingReasonError,
  setUnloadingReasonMessage,
} = unloadingReasonSlice.actions;
export default unloadingReasonSlice.reducer;
