import { createSlice } from "@reduxjs/toolkit";

interface TourUnloadingState {
    TourUnloadingDetails: any;
    WarehouseList: any[];
    UnloadUnloadingReason: any[];
    PrimaryWarehousesList: any[];
    DamageWarehousesList: any[];
};

const initialState: TourUnloadingState = {
    TourUnloadingDetails: {},
    WarehouseList: [],
    UnloadUnloadingReason: [],
    PrimaryWarehousesList: [],
    DamageWarehousesList: [],
};

export const tourUnloadingSlice = createSlice({
    name: "tourUnloadingSlice",
    initialState,
    reducers: {
        setTourUnloadingDetails(state, action) {
            state.TourUnloadingDetails = action.payload;
        },
        setWarehouseList(state, action) {
            state.WarehouseList = action.payload;
        },
        setUnloadUnloadingReason(state, action) {
            state.UnloadUnloadingReason = action.payload;
        },
        setPrimaryWarehousesList(state, action) {
            state.PrimaryWarehousesList = action.payload;
        },
        setDamageWarehousesList(state, action) {
            state.DamageWarehousesList = action.payload;
        },
    },
});

export const {
    setTourUnloadingDetails,
    setWarehouseList,
    setUnloadUnloadingReason,
    setPrimaryWarehousesList,
    setDamageWarehousesList,
} = tourUnloadingSlice.actions;

export default tourUnloadingSlice.reducer;