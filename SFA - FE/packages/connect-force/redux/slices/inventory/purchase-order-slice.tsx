import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PurchaseOrderState {
  isLoading: boolean;
  PO_Companies: any[];
  PO_Distributors: any[];
  PO_PriceLists: any[];
  PO_Approval_PriceLists: any[];
  PO_Products: any[];
  PO_Approval_Products: any[];
  PO_PaymentTerms: any[];
  PO_DeliveryMethods: any[];
  PO_PurchaseOrders: any[];
  PO_PurchaseOrder: any;
  PO_PurchaseOrderApprove: any[];
  PO_approve: any;
  GRNs: any[];
  GRN: any;
  PO_Warehouses: any[];
}

const initialState: PurchaseOrderState = {
  isLoading: true,
  PO_Companies: [],
  PO_Distributors: [],
  PO_PriceLists: [],
  PO_Approval_PriceLists: [],
  PO_Products: [],
  PO_Approval_Products: [],
  PO_PaymentTerms: [],
  PO_DeliveryMethods: [],
  PO_PurchaseOrders: [],
  PO_PurchaseOrder: {},
  PO_PurchaseOrderApprove: [],
  PO_approve: {},
  GRNs: [],
  GRN: {},
  PO_Warehouses: [],
};

export const purchaseOrderSlice = createSlice({
  name: "purchaseOrderSlice",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setPO_Companies(state, action: PayloadAction<any[]>) {
      state.PO_Companies = action.payload;
    },
    setPO_Distributors(state, action: PayloadAction<any[]>) {
      state.PO_Distributors = action.payload;
    },
    setPO_PriceLists(state, action: PayloadAction<any[]>) {
      state.PO_PriceLists = action.payload;
    },
    setPO_Approval_PriceLists(state, action: PayloadAction<any[]>) {
      state.PO_Approval_PriceLists = action.payload;
    },
    setPO_Products(state, action: PayloadAction<any[]>) {
      state.PO_Products = action.payload;
    },
    setPO_Approval_Products(state, action: PayloadAction<any[]>) {
      state.PO_Approval_Products = action.payload;
    },
    setPO_PaymentTerms(state, action: PayloadAction<any[]>) {
      state.PO_PaymentTerms = action.payload;
    },
    setPO_DeliveryMehods(state, action: PayloadAction<any[]>) {
      state.PO_DeliveryMethods = action.payload;
    },
    setPO_PurchaseOrders(state, action: PayloadAction<any[]>) {
      state.PO_PurchaseOrders = action.payload;
    },
    setPO_PurchaseOrder(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.PO_PurchaseOrder = action.payload;
    },
    setPO_PurchaseOrderApprove(state, action: PayloadAction<any[]>) {
      state.PO_PurchaseOrderApprove = action.payload;
    },
    setPO_Approve(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.PO_approve = action.payload;
    },
    setGRNs(state, action: PayloadAction<any[]>) {
      state.GRNs = action.payload;
    },
    setGRN(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.GRN = action.payload;
    },
    setPO_Warehouses(state, action: PayloadAction<any[]>) {
      state.PO_Warehouses = action.payload;
    },
    resetPO(state) {
      state.PO_PurchaseOrder = initialState.PO_PurchaseOrder;
    },
    resetPO_Approve(state) {
      state.PO_approve = initialState.PO_approve;
    },
    resetGRN(state) {
      state.GRN = initialState.GRN;
    },
  },
});

export const {
  startLoading,
  setPO_Companies,
  setPO_Distributors,
  setPO_PriceLists,
  setPO_Products,
  setPO_PaymentTerms,
  setPO_DeliveryMehods,
  setPO_PurchaseOrders,
  setPO_PurchaseOrder,
  setPO_PurchaseOrderApprove,
  setPO_Approve,
  setGRNs,
  setGRN,
  setPO_Approval_Products,
  setPO_Approval_PriceLists,
  setPO_Warehouses,
  resetPO,
  resetPO_Approve,
  resetGRN,
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
