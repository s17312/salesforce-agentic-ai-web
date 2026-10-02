import { VehicleState } from "@/types/vehicle-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: VehicleState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  vehicleDetails: [],
  isActive: true,
  vehicle: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
  distributorDetails: [],
  representativeDetails: [],
};

export const vehicleSlice = createSlice({
  name: "Vehicle",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllVehicleDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.vehicleDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.vehicleDetails[index] = action.payload.data;
        }
      } else {
        state.vehicleDetails = action.payload;
      }
    },
    setVehicle(state, action) {
      state.isLoading = false;
      state.vehicle = action.payload;
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
    setVehicleError(state, action) {
      state.error = action.payload;
    },
    setVehicleMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
    setDistributorDetails(state, action) {
      state.distributorDetails = action.payload;
    },
    setRepresentativeDetails(state, action) {
      state.representativeDetails = action.payload;
    },
  },
});

export const {
  startLoading,
  setAllVehicleDetails,
  setVehicle,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setVehicleError,
  setVehicleMessage,
  setDistributorDetails,
  setRepresentativeDetails,
} = vehicleSlice.actions;
export default vehicleSlice.reducer;
