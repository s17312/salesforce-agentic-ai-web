import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourSalesState {
    TourSales: any[];
    TourLostCall: any;
    TourSalesCall: any;
    ScheduleData: any;
    Outlets: any;
    SalesBulk:any[];
    DistributorUId: number | null;
};

const initialState: TourSalesState = {
    TourSales: [],
    TourLostCall: {},
    TourSalesCall: {},
    ScheduleData: {},
    Outlets: {},
    SalesBulk:[],
    DistributorUId: null,
};

export const tourSalesSlice = createSlice({
    name: "tourSalesSlice",
    initialState,
    reducers: {
        setTourSales(state, action: PayloadAction<any[]>) {
            state.TourSales = action.payload;
        },
        setTourLostCall(state, action: PayloadAction<any[]>) {
            state.TourLostCall = action.payload;
        },
        setTourSalesCall(state, action: PayloadAction<any[]>) {
            state.TourSalesCall = action.payload;
        },
        setScheduleData(state, action: PayloadAction<any[]>) {
            state.ScheduleData = action.payload;
        },
        setOutlets(state, action: PayloadAction<any[]>) {
            state.Outlets = action.payload;
        },
        setSalesBulkUpload(state, action: PayloadAction<any[]>){
            state.SalesBulk = action.payload;
        }, 
        setDistributorUId(state, action: PayloadAction<number | null>) {
            state.DistributorUId = action.payload;
        },
        resetTourSalesSlice: () => initialState
    }
})

export const {
    setTourSales,
    setTourLostCall,
    setTourSalesCall,
    setScheduleData,
    setOutlets,
    setSalesBulkUpload,
    resetTourSalesSlice,
    setDistributorUId
} = tourSalesSlice.actions;

export default tourSalesSlice.reducer;