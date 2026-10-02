import { createSlice } from "@reduxjs/toolkit";

export type BusinessCategoryState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  businessCategorys: any[];
  isActive: true;
  businessCategory: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: BusinessCategoryState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  businessCategorys: [],
  isActive: true,
  businessCategory: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const businessCategorySlice = createSlice({
  name: "BusinessCategory",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllBusinessCategories(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.businessCategorys.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
          state.businessCategorys[index] = action.payload.data;
        }
      } else {
        state.businessCategorys = action.payload;
      }
    },
    setBusinessCategory(state, action) {
      state.isLoading = false;
      state.businessCategory = action.payload;
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
    setBusinessCategoryError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setBusinesscategoryMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllBusinessCategories,
  setBusinessCategory,
  setPaginationDetails,
  setPage,
  setBusinessCategoryError,
  setBusinesscategoryMessage,
  setRowsPerPage,
} = businessCategorySlice.actions;
export default businessCategorySlice.reducer;
