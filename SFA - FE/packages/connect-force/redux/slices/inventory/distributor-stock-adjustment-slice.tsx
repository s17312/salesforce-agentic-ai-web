import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StockAdjustmentHeader {
  stockAdjustmentHeaderId: number;
  stockAdjustmentNo: string;
  stockAdjustmentDate: string;
  companyUId: number;
  wareHouseUId: number;
  priceListTypeUId: number;
  distributorUId: number;
  batchID: string;
  refID: string;
  totalPlusQuantity: number;
  totalPlusVolume: number;
  totalPlusValue: number;
  totalMinusQuantity: number;
  totalMinusVolume: number;
  totalMinusValue: number;
  companyName: string;
  wareHouseName: string;
  distributorName: string;
  priceListTypeName: string;
  statusName: string;
  createdRemark: string;
  approvedRemark: string | null;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
}

interface StockAdjustmentDetail {
  stockAdjustmentDetailId: number;
  productID: number;
  productUID: number;
  productName: string;
  stockAvailable: number;
  mrp: number;
  rate: number;
  updateQuantity: number;
  volume: number;
  value: number;
  baseUnitId?: number;
  baseUnitName?: string;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
}

interface dSAdjustment {
  stockAdjustmentHeader: StockAdjustmentHeader;
  stockAdjustmentDetail: StockAdjustmentDetail[];
}

interface DistributorStockAdjustmentState {
  DS_AdjustmentId: string | null;
  DS_Companies: any[];
  DS_PriceLists: any[];
  DS_Distributors: any[];
  DS_Warehouses: any[];
  DS_Products: any[];
  DS_Adjustments: any[];
  DS_Adjustment: dSAdjustment;
  DS_AdjustmentBulk: any[];
}

const initialState: DistributorStockAdjustmentState = {
  DS_AdjustmentId: null,
  DS_Companies: [],
  DS_PriceLists: [],
  DS_Distributors: [],
  DS_Warehouses: [],
  DS_Products: [],
  DS_Adjustments: [],
  DS_Adjustment: {} as dSAdjustment,
  DS_AdjustmentBulk: [],
};

export const distributorStockAdjustmentSlice = createSlice({
  name: "distributorStockAdjustmentSlice",
  initialState,
  reducers: {
    setDS_AdjustmentId(state, action: PayloadAction<string | null>) {
      state.DS_AdjustmentId = action.payload;
    },
    setDS_Companies(state, action: PayloadAction<any[]>) {
      state.DS_Companies = action.payload;
    },
    setDS_PriceLists(state, action: PayloadAction<any[]>) {
      state.DS_PriceLists = action.payload;
    },
    setDS_Distributors(state, action: PayloadAction<any[]>) {
      state.DS_Distributors = action.payload;
    },
    setDS_Warehouses(state, action: PayloadAction<any[]>) {
      state.DS_Warehouses = action.payload;
    },
    setDS_Products(state, action: PayloadAction<any[]>) {
      state.DS_Products = action.payload;
    },
    setDS_Adjustments(state, action: PayloadAction<any[]>) {
      state.DS_Adjustments = action.payload;
    },
    setDS_Adjustment(state, action: PayloadAction<any>) {
      state.DS_Adjustment = action.payload;
    },
    resetDS_Adjustment(state) {
      state.DS_Adjustment = initialState.DS_Adjustment;
    },
    setDS_AdjustmentBulkUpload(state, action: PayloadAction<any[]>) {
      state.DS_AdjustmentBulk = action.payload;
    },
  },
});

export const {
  setDS_AdjustmentId,
  setDS_Companies,
  setDS_Distributors,
  setDS_PriceLists,
  setDS_Warehouses,
  setDS_Products,
  setDS_Adjustments,
  setDS_Adjustment,
  resetDS_Adjustment,
  setDS_AdjustmentBulkUpload,
} = distributorStockAdjustmentSlice.actions;

export default distributorStockAdjustmentSlice.reducer;
