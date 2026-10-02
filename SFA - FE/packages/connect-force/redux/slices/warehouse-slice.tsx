import { WarehouseState } from "@/types/warehouse";
import { createSlice } from "@reduxjs/toolkit";

const initialState: WarehouseState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  warehouses: [],
  isActive: true,
  warehouse: null,
  warehouseAssignments: [],
  newPage: 0,
  newRowsPerPage: 100,
};

export const warehouseSlice = createSlice({
  name: "Warehouse",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllWarehouses(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.warehouses.findIndex(d => d.uId === action.payload.data.uId);

        if (index !== -1) {
          state.warehouses[index] = action.payload.data;
        }
      } else {
        state.warehouses = action.payload;
      }
    },
    setWarehouse(state, action) {
      state.isLoading = false;
      state.warehouse = action.payload;
    },
    setWarehouseAssignments(state, action) {
      state.isLoading = false;
      state.warehouseAssignments = action.payload;
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
    setWarehouseError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setWarehouseMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllWarehouses,
  setWarehouse,
  setWarehouseAssignments,
  setPaginationDetails,
  setPage,
  setWarehouseError,
  setWarehouseMessage,
  setRowsPerPage,
} = warehouseSlice.actions;
export default warehouseSlice.reducer;
