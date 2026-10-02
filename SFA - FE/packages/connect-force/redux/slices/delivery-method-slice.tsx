import { DeliveryMethodState } from "@/types/delivery-method-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DeliveryMethodState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  deliveryMethodDetails: [],
  isActive: true,
  deliveryMethod: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const deliveryMethodSlice = createSlice({
  name: "DeliveryMethod",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllDeliveryMethodDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.deliveryMethodDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.deliveryMethodDetails[index] = action.payload.data;
        }
      } else {
        state.deliveryMethodDetails = action.payload;
      }
    },
    setDeliveryMethod(state, action) {
      state.isLoading = false;
      state.deliveryMethod = action.payload;
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
    setDeliveryMethodError(state, action) {
      state.error = action.payload;
    },
    setDeliveryMethodMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllDeliveryMethodDetails,
  setDeliveryMethod,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setDeliveryMethodError,
  setDeliveryMethodMessage,
} = deliveryMethodSlice.actions;
export default deliveryMethodSlice.reducer;
