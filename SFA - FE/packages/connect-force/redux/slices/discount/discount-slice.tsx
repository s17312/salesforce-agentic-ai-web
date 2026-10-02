import { DiscountState } from "@/types/discount/discount-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DiscountState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  discountDetails: [],
  isActive: true,
  discount: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
  discountProducts: [],
  discountTypeDetails: [],
  valueDiscountTypeDetails: [],
  discountMappingList: [],
};

export const DiscountSlice = createSlice({
  name: "Discount",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllDiscountDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.discountDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.discountDetails[index] = action.payload.data;
        }
      } else {
        state.discountDetails = action.payload;
      }
    },
    setDiscount(state, action) {
      state.isLoading = false;
      state.discount = action.payload;
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
    setDiscountError(state, action) {
      state.error = action.payload;
    },
    setDiscountMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
    setDiscountMappingList(state, action) {
      state.discountMappingList = action.payload;
      state.error = null;
    },
    setDiscountProducts(state, action) {
      state.discountProducts = action.payload;
    },
    setAllDiscountTypeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.discountTypeDetails.findIndex(
          (d) => d.discountTypeID === action.payload.data.discountTypeID
        );

        if (index !== -1) {
          state.discountTypeDetails[index] = action.payload.data;
        }
      } else {
        state.discountTypeDetails = action.payload;
      }
    },
    setAllValueDiscountTypeDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.valueDiscountTypeDetails.findIndex(
          (d) => d.val_type_ID === action.payload.data.val_type_ID
        );

        if (index !== -1) {
          state.valueDiscountTypeDetails[index] = action.payload.data;
        }
      } else {
        state.valueDiscountTypeDetails = action.payload;
      }
    },
  },
});

export const {
  startLoading,
  setAllDiscountDetails,
  setAllDiscountTypeDetails,
  setAllValueDiscountTypeDetails,
  setDiscount,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setDiscountError,
  setDiscountMessage,
  setDiscountMappingList,
  setDiscountProducts,
} = DiscountSlice.actions;
export default DiscountSlice.reducer;
