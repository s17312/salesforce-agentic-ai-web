import { createSlice } from "@reduxjs/toolkit";

export type LegleEntityTypeState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  legleEntityTypeStates: any[];
  isActive: true;
  legleEntityTypeState: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: LegleEntityTypeState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  legleEntityTypeStates: [],
  isActive: true,
  legleEntityTypeState: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const legleEntityTypeStateSlice = createSlice({
  name: "LegleEntityType",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllLegleEntityTypes(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.legleEntityTypeStates.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.legleEntityTypeStates[index] = action.payload.data;
        }
      } else {
        state.legleEntityTypeStates = action.payload;
      }
    },
    setLegleEntityType(state, action) {
      state.isLoading = false;
      state.legleEntityTypeState = action.payload;
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
    setLegleEntityTypeError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setLegleEntityTypeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllLegleEntityTypes,
  setLegleEntityType,
  setPaginationDetails,
  setPage,
  setLegleEntityTypeError,
  setLegleEntityTypeMessage,
  setRowsPerPage,
} = legleEntityTypeStateSlice.actions;
export default legleEntityTypeStateSlice.reducer;
