import { ProductSliceState } from "@/types/product-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProductSliceState = {
  isLoading: true,
  error: null,
  paginationDetails: {
    pageNo: 1,
    pageSize: 25,
    total: 100,
    results: 25,
  },
  products: [],
  product: null,
  newPage: 0,
  newRowsPerPage: 100,
  message: null,
};

export const productSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllProducts(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.products.findIndex(
          (d) => d.uId === action.payload.data.uId
        );
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      } else {
        state.products = action.payload;
      }
    },

    setProduct(state, action) {
      state.isLoading = false;
      state.product = action.payload;
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
    setProductError(state, action) {
      state.error = action.payload;
    },
    setProductMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllProducts,
  setProduct,
  setPaginationDetails,
  setPage,
  setProductError,
  setRowsPerPage,
  setProductMessage,
} = productSlice.actions;
export default productSlice.reducer;
