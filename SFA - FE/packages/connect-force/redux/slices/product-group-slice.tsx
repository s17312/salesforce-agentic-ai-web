import { createSlice } from "@reduxjs/toolkit";

export type ProductGroupState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: any;
  productGroups: any[];
  productGroup: any;
  newPage: number;
  newRowsPerPage: number;
};

const initialState: ProductGroupState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  productGroups: [],
  productGroup: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const productGroupSlice = createSlice({
  name: "ProductGroup",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllProductGroups(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.productGroups.findIndex(
          (d) => d.uId === action.payload.data.uId
        );
        if (index !== -1) {
          state.productGroups[index] = action.payload.data;
        }
      } else {
        state.productGroups = action.payload;
      }
    },
    setProductGroup(state, action) {
      state.isLoading = false;
      state.productGroup = action.payload;
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
    setProductGroupError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setProductGroupMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllProductGroups,
  setProductGroup,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setProductGroupError,
  setProductGroupMessage,
} = productGroupSlice.actions;

export default productGroupSlice.reducer;
