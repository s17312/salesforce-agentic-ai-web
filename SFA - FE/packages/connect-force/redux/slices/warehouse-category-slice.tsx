import { WarehouseCategoryState } from "@/types/warehousecaregory-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: WarehouseCategoryState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  warehouseCategoryDetails: [],
  isActive: true,
  warehouseCategory: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const warehouseCategorySlice = createSlice({
  name: "WarehouseCategory",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllWarehouseCategoryDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.warehouseCategoryDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.warehouseCategoryDetails[index] = action.payload.data;
        }
      } else {
        state.warehouseCategoryDetails = action.payload;
      }
    },
    setWarehouseCategory(state, action) {
      state.isLoading = false;
      state.warehouseCategory = action.payload;
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
    setWarehouseCategoryError(state, action) {
      state.error = action.payload;
    },
    setWarehouseCategoryMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllWarehouseCategoryDetails,
  setWarehouseCategory,
  setPaginationDetails,
  setPage,
  setWarehouseCategoryError,
  setRowsPerPage,
  setWarehouseCategoryMessage,
} = warehouseCategorySlice.actions;
export default warehouseCategorySlice.reducer;
