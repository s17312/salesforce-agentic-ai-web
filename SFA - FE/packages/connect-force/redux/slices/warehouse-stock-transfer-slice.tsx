import {
  warehouseStockTransferDetails,
  warehouseStockTransferHeader,
  WarehouseStockTransferState,
} from "@/types/warehouse-stock-transfer-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: WarehouseStockTransferState = {
  isLoading: false,
  error: null,
  paginationDetails: null,
  WarehouseStockTransferHeader: [],
  warehouseStockTransferDetails: [],
  isActive: true,
  currentWarehouseStockTransfer: null,
  message: null,
  newPage: 1,
  newRowsPerPage: 100,
  WST_Distributors: [],
  WST_FromWarehouses: [],
  WST_RecivingWarehouses: [],
  CompanyStockFromWarehouses: [],
  CompanyStockReceivingWarehouses: [],
  WST_Products: [],
  Company_Warehouse_ST_Products: [],
  WST_PriceList: [],
  WST_Details: [],
  WST_Detail: {} as wst_detail,
  CompanyWST_Details: [],
  CompanyWST_Detail: {} as wst_detail,
};

interface wst_detail {
  WarehouseStockTransferHeader: warehouseStockTransferHeader;
  warehouseStockTransferDetails: warehouseStockTransferDetails[];
}

export const warehouseStockTransferSlice = createSlice({
  name: "warehouseStockTransfer",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setStockTransferHeaders(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.WarehouseStockTransferHeader.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.WarehouseStockTransferHeader[index] = action.payload.data;
        }
      } else {
        state.WarehouseStockTransferHeader = action.payload;
      }
    },
    setStockTransferDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.warehouseStockTransferDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.warehouseStockTransferDetails[index] = action.payload.data;
        }
      } else {
        state.warehouseStockTransferDetails = action.payload;
      }
    },
    setWST_Distributors(state, action) {
      state.isLoading = false;
      state.WST_Distributors = action.payload;
    },
    setWST_FromWarehouses(state, action) {
      state.isLoading = false;
      state.WST_FromWarehouses = action.payload;
    },
    setWST_RecivingWarehouses(state, action) {
      state.isLoading = false;
      state.WST_RecivingWarehouses = action.payload;
    },
    setCompanyStockFromWarehouses(state, action) {
      state.isLoading = false;
      state.CompanyStockFromWarehouses = action.payload;
    },
    setCompanyStockReceivingWarehouses(state, action) {
      state.isLoading = false;
      state.CompanyStockReceivingWarehouses = action.payload;
    },
    setWST_Products(state, action) {
      state.isLoading = false;
      state.WST_Products = action.payload;
    },
    setCompany_Warehouse_ST_Products(state, action) {
      state.isLoading = false;
      state.Company_Warehouse_ST_Products = action.payload;
    },
    setWST_PriceList(state, action) {
      state.isLoading = false;
      state.WST_PriceList = action.payload;
    },
    setWST_Details(state, action) {
      state.isLoading = false;
      state.WST_Details = action.payload;
    },
    setWST_Detail(state, action) {
      state.isLoading = false;
      state.WST_Detail = action.payload;
    },
    resetWSTDetail(state) {
      state.WST_Detail = {} as wst_detail;
    },
    setCurrentStockTransfer(state, action) {
      state.isLoading = false;
      state.currentWarehouseStockTransfer = action.payload;
    },
    setCompanyWST_Details(state, action) {
      state.isLoading = false;
      state.CompanyWST_Details = action.payload;
    },
    setCompanyWSTDetail(state, action) {
      state.isLoading = false;
      state.CompanyWST_Detail = action.payload;
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
    setWarehouseStockTransferError(state, action) {
      state.error = action.payload;
    },
    setWarehouseStockTransferMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setStockTransferHeaders,
  setStockTransferDetails,
  setCurrentStockTransfer,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setWarehouseStockTransferError,
  setWarehouseStockTransferMessage,
  setWST_Distributors,
  setWST_FromWarehouses,
  setWST_RecivingWarehouses,
  setWST_Products,
  setCompany_Warehouse_ST_Products,
  setWST_PriceList,
  setWST_Details,
  setWST_Detail,
  resetWSTDetail,
  setCompanyWSTDetail,
  setCompanyWST_Details,
  setCompanyStockFromWarehouses,
  setCompanyStockReceivingWarehouses,
} = warehouseStockTransferSlice.actions;
export default warehouseStockTransferSlice.reducer;
