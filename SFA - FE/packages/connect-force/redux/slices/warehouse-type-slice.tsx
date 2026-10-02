import { WarehouseTypeState } from "@/types/warehouse-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: WarehouseTypeState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  warehouseTypes: [],
  isActive: true,
  warehouseType: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const warehouseTypeSlice = createSlice({
  name: "Warehouse",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllWarehouseTypes(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.warehouseTypes.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
          state.warehouseTypes[index] = action.payload.data;
        }
      } else {
        state.warehouseTypes = action.payload;
      }
    },
    setWarehouseType(state, action) {
      state.isLoading = false;
      state.warehouseType = action.payload;
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
    setWarehouseTypeError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setWarehouseTypeMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllWarehouseTypes,
  setWarehouseType,
  setPaginationDetails,
  setPage,
  setWarehouseTypeError,
  setWarehouseTypeMessage,
  setRowsPerPage,
} = warehouseTypeSlice.actions;
export default warehouseTypeSlice.reducer;
