import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
 assignProduct: [],
 assignedProduct: [],
 companyProducts:[],
 companyProductMsg: null,
 companyProductsIsTrue:[],
 companyByProductsIsTrue: [],
}

export const companyProductsSlice = createSlice({
  name: "CompanyProductSlice",
  initialState,
  reducers: {
    setAssignProduct(state, action) {
      state.assignProduct = action.payload;
    },
    setAssignedProduct(state, action) {
      state.assignedProduct = action.payload;
    },
    setCompanyProducts(state, action) {
      state.companyProducts = action.payload;
    },
    setCompanyProductsIsTrue(state, action) {
      state.companyProductsIsTrue = action.payload;
    },
    setCompanyByProductsIsTrue(state, action) {
      state.companyByProductsIsTrue = action.payload;
    },
    setCompanyProductsMsg(state, action) {
      state.companyProductMsg = action.payload;
    }
  },
});

export const {
    setAssignProduct,
    setAssignedProduct,
    setCompanyProducts,
    setCompanyProductsIsTrue,
    setCompanyByProductsIsTrue,
    setCompanyProductsMsg,
} = companyProductsSlice.actions;
export default companyProductsSlice.reducer;
