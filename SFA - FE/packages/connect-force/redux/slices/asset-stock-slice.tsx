import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    assetStock: [],
    assetStockMsg: null,
}

export const assetStockSlice = createSlice({
    name: "AssetStock",
    initialState,
    reducers: {
        setAssetStock(state, action) {
            state.assetStock = action.payload;
        },
        setAssetStockMsg(state, action) {
            state.assetStockMsg = action.payload;
        },
    },
});

export const {
    setAssetStock,
    setAssetStockMsg,
} = assetStockSlice.actions;
export default assetStockSlice.reducer;