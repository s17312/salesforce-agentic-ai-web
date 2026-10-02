import { GRNTypeState } from "@/types/inventory/grn-type-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: GRNTypeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  grnTypeDetails: [],
  isActive: true,
  grnType: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const grnTypeSlice = createSlice({
  name: "GRNType",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllGRNTypeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.grnTypeDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.grnTypeDetails[index] = action.payload.data;
        }
      } else {
        state.grnTypeDetails = action.payload;
      }
    },
    setGRNType(state, action) {
      state.isLoading = false;
      state.grnType = action.payload;
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
    setGRNTypeError(state, action) {
      state.error = action.payload;
    },
    setGRNTypeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllGRNTypeDetails,
  setGRNType,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setGRNTypeError,
  setGRNTypeMessage,
} = grnTypeSlice.actions;
export default grnTypeSlice.reducer;
