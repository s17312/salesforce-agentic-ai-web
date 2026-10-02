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
  distributorName: string | null;
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

interface CSAdjustment {
  stockAdjustmentHeader: StockAdjustmentHeader;
  stockAdjustmentDetail: StockAdjustmentDetail[];
}

interface CompanyStockAdjustmentState {
  CS_AdjustmentId: string | null;
  CS_Companies: any[];
  CS_PriceLists: any[];
  CS_Warehouses: any[];
  CS_Products: any[];
  CS_Adjustments: any[];
  CS_Adjustment: CSAdjustment;
  CS_AdjustmentBulk: any[];
}

const initialState: CompanyStockAdjustmentState = {
  CS_AdjustmentId: null,
  CS_Companies: [],
  CS_PriceLists: [],
  CS_Warehouses: [],
  CS_Products: [],
  CS_Adjustments: [],
  CS_Adjustment: {} as CSAdjustment,
  CS_AdjustmentBulk: [],
};

export const companyStockAdjustmentSlice = createSlice({
  name: "companyStockAdjustmentSlice",
  initialState,
  reducers: {
    setCS_AdjustmentId(state, action: PayloadAction<string | null>) {
      state.CS_AdjustmentId = action.payload;
    },
    setCS_Companies(state, action: PayloadAction<any[]>) {
      state.CS_Companies = action.payload;
    },
    setCS_PriceLists(state, action: PayloadAction<any[]>) {
      state.CS_PriceLists = action.payload;
    },
    setCS_Warehouses(state, action: PayloadAction<any[]>) {
      state.CS_Warehouses = action.payload;
    },
    setCS_Products(state, action: PayloadAction<any[]>) {
      state.CS_Products = action.payload;
    },
    setCS_Adjustments(state, action: PayloadAction<any[]>) {
      state.CS_Adjustments = action.payload;
    },
    setCS_Adjustment(state, action: PayloadAction<any>) {
      state.CS_Adjustment = action.payload;
    },
    resetCS_Adjustment(state) {
      state.CS_Adjustment = initialState.CS_Adjustment; // Reset properly
    },
    setCS_AdjustmentBulkUpload(state, action: PayloadAction<any[]>) {
      state.CS_AdjustmentBulk = action.payload;
    },
  },
});

export const {
  setCS_AdjustmentId,
  setCS_Companies,
  setCS_PriceLists,
  setCS_Warehouses,
  setCS_Products,
  setCS_Adjustments,
  setCS_Adjustment,
  resetCS_Adjustment,
  setCS_AdjustmentBulkUpload,
} = companyStockAdjustmentSlice.actions;

export default companyStockAdjustmentSlice.reducer;
