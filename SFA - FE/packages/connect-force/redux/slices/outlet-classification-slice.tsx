import { createSlice } from "@reduxjs/toolkit";

export type OutletClassificationState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  outletClassifications: any[];
  outletClassification: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: OutletClassificationState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  outletClassifications: [],
  outletClassification: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const outletClassificationSlice = createSlice({
  name: "OutletClassification",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllOutletClassifications(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.outletClassifications.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
            state.outletClassifications[index] = action.payload.data;
        }
    } else {
        state.outletClassifications = action.payload;
    }
      
    },
    setOutletClassification(state, action) {
      state.isLoading = false;
      state.outletClassification = action.payload;
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
    setOutletClassificationError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setOutletClassificationMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllOutletClassifications,
  setOutletClassification,
  setPaginationDetails,
  setPage,
  setOutletClassificationError,
  setOutletClassificationMessage,
  setRowsPerPage,
} = outletClassificationSlice.actions;
export default outletClassificationSlice.reducer;
