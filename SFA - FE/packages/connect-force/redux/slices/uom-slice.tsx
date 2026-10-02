import { createSlice } from "@reduxjs/toolkit";

export type UOMState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  uoms: any[];
  uom: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: UOMState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  uoms: [],
  uom: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const uomSlice = createSlice({
  name: "UOM",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllUOMs(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.uoms.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
          state.uoms[index] = action.payload.data;
        }
      } else {
        state.uoms = action.payload;
      }
    },
    setUOM(state, action) {
      state.isLoading = false;
      state.uom = action.payload;
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
    setUOMError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setUOMMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllUOMs,
  setUOM,
  setPaginationDetails,
  setPage,
  setUOMError,
  setUOMMessage,
  setRowsPerPage,
} = uomSlice.actions;
export default uomSlice.reducer;
