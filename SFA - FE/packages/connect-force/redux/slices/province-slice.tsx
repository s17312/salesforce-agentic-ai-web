import { createSlice } from "@reduxjs/toolkit";

export type ProvinceState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: any;
    provinces: any[];
    province: any;
    newPage: number;
    newRowsPerPage: number;
};

const initialState: ProvinceState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    provinces: [],
    province: null,
    newPage: 0,
    newRowsPerPage: 100,
};

export const provinceSlice = createSlice({
    name: "Province",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllProvinces(state, action) {
            state.isLoading = false;
            state.provinces = action.payload;
        },
        setProvince(state, action) {
            state.isLoading = false;
            state.province = action.payload;
        },
        setPaginationDetails(state, action) {
            state.paginationDetails = action.payload;
        },
        setPage(state, action) {
            state.newPage = action.payload;
        },
        setRowsPerPage(state, action) {
            state.newRowsPerPage = action.payload;
        },
        setProvinceError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    startLoading,
    setAllProvinces,
    setProvince,
    setPaginationDetails,
    setPage,
    setProvinceError,
    setRowsPerPage,
} = provinceSlice.actions;
export default provinceSlice.reducer;