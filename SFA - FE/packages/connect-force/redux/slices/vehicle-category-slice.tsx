import { VehicleCategoryState } from "@/types/vehicle-category-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: VehicleCategoryState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  vehicleCategoryDetails: [],
  isActive: true,
  vehicleCategory: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const vehicleCategorySlice = createSlice({
  name: "VehicleCategory",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllVehicleCategoryDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.vehicleCategoryDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.vehicleCategoryDetails[index] = action.payload.data;
        }
      } else {
        state.vehicleCategoryDetails = action.payload;
      }
    },
    setVehicleCategory(state, action) {
      state.isLoading = false;
      state.vehicleCategory = action.payload;
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
    setVehicleCategoryError(state, action) {
      state.error = action.payload;
    },
    setVehicleCategoryMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllVehicleCategoryDetails,
  setVehicleCategory,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setVehicleCategoryError,
  setVehicleCategoryMessage,
} = vehicleCategorySlice.actions;
export default vehicleCategorySlice.reducer;
