import { createSlice } from "@reduxjs/toolkit";

export type TownState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: any;
  towns: any[];
  town: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: TownState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  towns: [],
  town: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const townSlice = createSlice({
  name: "Town",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllTowns(state, action) {
      state.isLoading = false;
      state.towns = action.payload;
    },
    setTown(state, action) {
      state.isLoading = false;
      state.town = action.payload;
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
    setTownError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setAllTowns,
  setTown,
  setPaginationDetails,
  setPage,
  setTownError,
  setRowsPerPage,
} = townSlice.actions;
export default townSlice.reducer;
