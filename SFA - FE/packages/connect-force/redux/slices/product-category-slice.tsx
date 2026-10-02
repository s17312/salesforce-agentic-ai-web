import { createSlice } from "@reduxjs/toolkit";

export type ProductCategoryState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  productCategorys: any[];
  productCategory: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: ProductCategoryState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  productCategorys: [],
  productCategory: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const productCategorySlice = createSlice({
  name: "ProductCategory",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllProductCategories(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.productCategorys.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.productCategorys[index] = action.payload.data;
        }
      } else {
        state.productCategorys = action.payload;
      }
    },
    setProductCategory(state, action) {
      state.isLoading = false;
      state.productCategory = action.payload;
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
    setProductCategoryError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setProductcategoryMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllProductCategories,
  setProductCategory,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setProductCategoryError,
  setProductcategoryMessage,
} = productCategorySlice.actions;

export default productCategorySlice.reducer;
