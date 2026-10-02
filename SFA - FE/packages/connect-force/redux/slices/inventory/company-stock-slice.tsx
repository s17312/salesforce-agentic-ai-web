import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    warehouseOptionsStockView: [],
    productCategoriesStockView: [],
    productGroupsStockView: [],
    productsStockView: [],
    companyOptionsStockView: [],
    csPriceList: [],
    companyStockMsg: null,
};

export const companyStockSlice = createSlice({
    name: "CompanyStockSlice",
    initialState,
    reducers: {
        setWarehouseOptionsStockView(state, action) {
            state.warehouseOptionsStockView = action.payload;
        },
        setProductCategoriesStockView(state, action) {
            state.productCategoriesStockView = action.payload;
        },
        setProductGroupsStockView(state, action) {
            state.productGroupsStockView = action.payload;
        },
        setProductsStockView(state,action){
            state.productsStockView = action.payload;
        },
        setCompanyOptionsStockView(state, action) {
            state.companyOptionsStockView = action.payload;
        },
        setCompanyStockMsg(state, action) {
            state.companyStockMsg = action.payload;
        },    
        setCSV_PriceLists(state, action) {
            state.csPriceList = action.payload;
        }    
    },
});

export const {
    setCompanyOptionsStockView,
    setCSV_PriceLists,
    setWarehouseOptionsStockView,
    setProductCategoriesStockView,
    setProductGroupsStockView,
    setProductsStockView,
    setCompanyStockMsg,
} = companyStockSlice.actions;
export default companyStockSlice.reducer;