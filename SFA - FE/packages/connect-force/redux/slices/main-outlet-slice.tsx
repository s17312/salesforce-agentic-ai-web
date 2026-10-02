import { MainOutletSliceState } from "@/types/main-outlet-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MainOutletSliceState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  mainOutlets: [],
  parentOutlets: [],
  mainOutlet: null,
  newPage: 0,
  newRowsPerPage: 100,
  message: null,
};

export const mainOutletSlice = createSlice({
  name: "MainOutlet",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllMainOutlets(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.mainOutlets.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.mainOutlets[index] = action.payload.data;
        }
      } else {
        state.mainOutlets = action.payload;
      }
    },
    setMainOutlet(state, action) {
      state.isLoading = false;
      state.mainOutlet = action.payload;
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
    setMainOutletError(state, action) {
      state.error = action.payload;
    },
    setMainOutletMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
    setAllParentOutlets(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.parentOutlets.findIndex(
          (d) => d.uId === action.payload.data.uId
        );
        if (index !== -1) {
          state.parentOutlets[index] = action.payload.data;
        }
      } else {
        state.parentOutlets = action.payload;
      }
    },
  },
});

export const {
  startLoading,
  setAllMainOutlets,
  setMainOutlet,
  setPaginationDetails,
  setPage,
  setMainOutletError,
  setRowsPerPage,
  setMainOutletMessage,
  setAllParentOutlets,
} = mainOutletSlice.actions;
export default mainOutletSlice.reducer;
