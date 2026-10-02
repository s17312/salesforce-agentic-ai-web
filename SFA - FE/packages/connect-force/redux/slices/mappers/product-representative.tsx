import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignProduct: [],
  assignedProduct: [],
  representativeProducts: [],
  representativeProductsIsTrue: [],
  representativeProductMsg: null,
};

export const productRepresentativeSlice = createSlice({
  name: "ProductRepresentativeSlice",
  initialState,
  reducers: {
    setAssignProduct(state, action) {
      state.assignProduct = action.payload;
    },
    setAssignedProduct(state, action) {
      state.assignedProduct = action.payload;
    },
    setRepresentativeProducts(state, action) {
      state.representativeProducts = action.payload;
    },
    setRepresentativeProductsIsTrue(state, action) {
      state.representativeProductsIsTrue = action.payload;
    },
    setRepresentativeProductsMsg(state, action) {
      state.representativeProductMsg = action.payload;
      state.error = null;
    },
  },
});

export const {
  setAssignProduct,
  setAssignedProduct,
  setRepresentativeProducts,
  setRepresentativeProductsIsTrue,
  setRepresentativeProductsMsg,
} = productRepresentativeSlice.actions;
export default productRepresentativeSlice.reducer;
