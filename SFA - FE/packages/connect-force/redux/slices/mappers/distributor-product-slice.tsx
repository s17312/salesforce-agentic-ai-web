import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
 assignProduct: [],
 assignedProduct: [],
 distributorProducts:[],
 distributorProductMsg: null,
 distributorProductsIsTrue:[],
 distributorProductsByIsTrue: [],
}

export const distributorProductSlice = createSlice({
  name: "DistributorProductSlice",
  initialState,
  reducers: {
    setAssignProduct(state, action) {
      state.assignProduct = action.payload;
    },
    setAssignedProduct(state, action) {
      state.assignedProduct = action.payload;
    },
    setDistributorProducts(state, action) {
      state.distributorProducts = action.payload;
    },
    setDistributorProductsIsTrue(state, action) {
      state.distributorProductsIsTrue = action.payload;
    },
    setDistributorByProductsIsTrue(state, action) {
      state.distributorProductsByIsTrue = action.payload;
    },
    setDistributorProductMsg(state, action) {
      state.distributorProductMsg = action.payload;
    }
  },
});

export const {
    setAssignProduct,
    setAssignedProduct,
    setDistributorProducts,
    setDistributorProductMsg,
    setDistributorProductsIsTrue,
    setDistributorByProductsIsTrue,
} = distributorProductSlice.actions;
export default distributorProductSlice.reducer;
