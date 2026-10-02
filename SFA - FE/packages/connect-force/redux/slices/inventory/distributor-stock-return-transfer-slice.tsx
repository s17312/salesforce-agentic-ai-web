import { DistributorStockReturnState } from "@/types/inventory/distributor-stock-return-transfer-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DistributorStockReturnState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  DS_ReturnTransfer: null,
  distributorWarehouseProducts: [],
  DS_ReturnTransfers: [],
  isActive: true,
  newPage: 0,
  newRowsPerPage: 100,
};

export const distributorStockReturnTransferSlice = createSlice({
  name: "DistributorStockReturnTransferSlice",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setDS_ReturnTransfer(state, action) {
      state.isLoading = false;
      state.DS_ReturnTransfer = action.payload;
    },

    setDS_ReturnTransfers(state, action) {
      state.DS_ReturnTransfers = action.payload;
    },

    setDistributorWarehouseProducts(state, action) {
      state.distributorWarehouseProducts = action.payload;
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

    clearDistributorStockReturnTransfer(state) {
      state.DS_ReturnTransfer = null;
    },
  },
});

export const {
  startLoading,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setDS_ReturnTransfer,
  setDS_ReturnTransfers,
  setDistributorWarehouseProducts,
  clearDistributorStockReturnTransfer,
} = distributorStockReturnTransferSlice.actions;
export default distributorStockReturnTransferSlice.reducer;
