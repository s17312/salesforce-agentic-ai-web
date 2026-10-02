import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TourScheduleDirectState {
    TourSchedule_Distributors: any[];
    TourSchedule_Rep: any[];
    TourSchedule_Routes: any[];
    TourSchedule_Outlets: any[];
    TourSchedulesAll: any[];
    TourScheduleById: any;
    TourLoadings: any[];
    TourLoadingWarehouses: any[];
    TourLoadingProducts: any[];
    TourLoadingById: any;
};

const initialState: TourScheduleDirectState = {
    TourSchedule_Distributors: [],
    TourSchedule_Rep: [],
    TourSchedule_Routes: [],
    TourSchedule_Outlets: [],
    TourSchedulesAll: [],
    TourScheduleById: {},
    TourLoadings: [],
    TourLoadingWarehouses: [],
    TourLoadingProducts: [],
    TourLoadingById: {},
};

export const tourScheduleDirectSlice = createSlice({
    name: "tourScheduleDirectSlice",
    initialState,
    reducers: {
        setTourSchedule_Distributors(state, action: PayloadAction<any[]>) {
            state.TourSchedule_Distributors = action.payload;
        },
        setTourSchedule_Rep(state, action: PayloadAction<any[]>) {
            state.TourSchedule_Rep = action.payload;
        },
        setTourSchedule_Routes(state, action: PayloadAction<any[]>) {
            state.TourSchedule_Routes = action.payload;
        },
        setTourSchedule_Outlets(state, action: PayloadAction<any[]>) {
            state.TourSchedule_Outlets = action.payload;
        },
        setTourSchedulesAll(state, action: PayloadAction<any[]>) {
            state.TourSchedulesAll = action.payload;
        },
        setTourScheduleById(state, action: PayloadAction<any>) {
            state.TourScheduleById = action.payload;
        },
        setTourLoadings(state, action: PayloadAction<any[]>) {
            state.TourLoadings = action.payload;
        },
        setTourLoadingWarehouses(state, action: PayloadAction<any[]>) {
            state.TourLoadingWarehouses = action.payload;
        },
        setTourLoadingProducts(state, action: PayloadAction<any[]>) {
            state.TourLoadingProducts = action.payload;
        },
        setTourLoadingById(state, action: PayloadAction<any>) {
            state.TourLoadingById = action.payload;
        },
    }
})

export const {
    setTourSchedule_Distributors,
    setTourSchedule_Rep,
    setTourSchedule_Routes,
    setTourSchedule_Outlets,
    setTourSchedulesAll,
    setTourScheduleById,
    setTourLoadings,
    setTourLoadingWarehouses,
    setTourLoadingProducts,
    setTourLoadingById,
} = tourScheduleDirectSlice.actions;
export default tourScheduleDirectSlice.reducer;