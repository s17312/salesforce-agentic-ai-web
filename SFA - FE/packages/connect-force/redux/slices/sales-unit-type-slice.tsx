import { SalesUnitTypeState } from "@/types/sales-unit-type-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SalesUnitTypeState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  salesUnitTypeDetails: [],
  baseUnitTypeDetails: [],
  isActive: true,
  salesUnitType: null,
  newPage: 0,
  newRowsPerPage: 100,
  message: null,
};

export const salesUnitTypeSlice = createSlice({
    name: "SalesUnitType",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllSalesUnitTypeDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.salesUnitTypeDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.salesUnitTypeDetails[index] = action.payload.data;
                }
            } else {
                state.salesUnitTypeDetails = action.payload;
            }
        },
        setAllBaseUnitTypeDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.baseUnitTypeDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.baseUnitTypeDetails[index] = action.payload.data;
                }
            } else {
                state.baseUnitTypeDetails = action.payload;
            }
        },
        setSalesUnitType(state, action) {
            state.isLoading = false;
            state.salesUnitType = action.payload;
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
        setSalesUnitTypeError(state, action) {
            state.error = action.payload;
            state.message = null;
        },
        setSalesUnitTypeMessage(state, action) {
            state.message = action.payload;
            state.error = null;
        },
    },
});

export const {
    startLoading,
    setAllSalesUnitTypeDetails,
    setAllBaseUnitTypeDetails,
    setSalesUnitType,
    setPaginationDetails,
    setPage,
    setRowsPerPage,
    setSalesUnitTypeError,
    setSalesUnitTypeMessage,
} = salesUnitTypeSlice.actions;
export default salesUnitTypeSlice.reducer;
