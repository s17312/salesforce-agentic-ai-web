import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    warehouseOptionsStockView: [],
    productCategoriesStockView: [],
    productGroupsStockView: [],
    productsStockView: [],
    companyOptionsStockView: [],
    distributorOptionsStockView: [],
    distributorView:[],
    priceLists:[],
    warehouseCategories:[],
    distributorStockMsg: null,
};

export const distributorStockSlice = createSlice({
    name: "DistributorStockSlice",
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
        setDistributorOptionsStockView(state, action) {
            state.distributorOptionsStockView = action.payload;
        },
        setDistributorView(state, action) {
            state.distributorView = action.payload;
        },
        setCompanyStockMsg(state, action) {
            state.companyStockMsg = action.payload;
        },  
        setDSV_PriceLists(state, action) {
            state.priceLists = action.payload;
        },
        setWarehouseCategories(state, action) {
            state.warehouseCategories = action.payload;
        }        
    },
});

export const {
    setCompanyOptionsStockView,
    setDistributorOptionsStockView,
    setWarehouseOptionsStockView,
    setProductCategoriesStockView,
    setProductGroupsStockView,
    setProductsStockView,
    setCompanyStockMsg,
    setDistributorView,
    setDSV_PriceLists,
    setWarehouseCategories
} = distributorStockSlice.actions;
export default distributorStockSlice.reducer;