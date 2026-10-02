import { LostCallState } from "@/types/lost-call-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: LostCallState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  lostCallDetails: [],
  isActive: true,
  lostCall: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const lostCallSlice = createSlice({
  name: "lostCall",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllLostCallDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.lostCallDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.lostCallDetails[index] = action.payload.data;
        }
      } else {
        state.lostCallDetails = action.payload;
      }
    },
    setLostCall(state, action) {
      state.isLoading = false;
      state.lostCall = action.payload;
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
    setLostCallError(state, action) {
      state.error = action.payload;
    },
    setLostCallMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllLostCallDetails,
  setLostCall,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setLostCallError,
  setLostCallMessage,
} = lostCallSlice.actions;
export default lostCallSlice.reducer;
