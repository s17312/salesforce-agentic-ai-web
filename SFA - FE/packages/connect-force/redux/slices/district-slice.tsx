import { createSlice } from "@reduxjs/toolkit";

export type DistrictState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: any;
    districts: any[];
    district: any;
    newPage: number;
    newRowsPerPage: number;
};

const initialState: DistrictState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    districts: [],
    district: null,
    newPage: 0,
    newRowsPerPage: 100,
};

export const districtSlice = createSlice({
    name: "District",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllDistricts(state, action) {
            state.isLoading = false;
            state.districts = action.payload;
        },
        setDistrict(state, action) {
            state.isLoading = false;
            state.district = action.payload;
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
        setDistrictError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    startLoading,
    setAllDistricts,
    setDistrict,
    setPaginationDetails,
    setPage,
    setDistrictError,
    setRowsPerPage,
} = districtSlice.actions;
export default districtSlice.reducer;