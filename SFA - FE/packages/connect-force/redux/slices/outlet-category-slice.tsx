import { createSlice } from "@reduxjs/toolkit";

export type OutletCategoryState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: any;
  outletCategories: any[];
  outletCategory: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: OutletCategoryState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  outletCategories: [],
  outletCategory: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const outletCategorySlice = createSlice({
  name: "OutletCategory",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllOutletCategories(state, action) {
      state.isLoading = false;
        if (action.payload.update) {
            const index = state.outletCategories.findIndex(category => category.uId === action.payload.data.uId);
            
            if (index !== -1) {
                state.outletCategories[index] = action.payload.data;
            }
        } else {
            state.outletCategories = action.payload;
        }
    },
    setOutletCategory(state, action) {
      state.isLoading = false;
      state.outletCategory = action.payload;
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
    setOutletCategoryError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setAllOutletCategories,
  setOutletCategory,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setOutletCategoryError,
} = outletCategorySlice.actions;

export default outletCategorySlice.reducer;
