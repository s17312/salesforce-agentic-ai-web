import { CompanySliceState } from "@/types/company-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CompanySliceState = {
  isLoading: true,
  error: null,
  message: null,
  paginationDetails: null,
  companies: [],
  company: null,
  newPage: 0,
  newRowsPerPage: 100,
  companyMappingList: [],
};

export const companySlice = createSlice({
  name: "Company",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllCompanies(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.companies.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.companies[index] = action.payload.data;
        }
      } else {
        state.companies = action.payload;
      }
    },
    setCompany(state, action) {
      state.isLoading = false;
      state.company = action.payload;
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
    setCompanyError(state, action) {
      state.error = action.payload;
      state.message = null;
    },
    setCompanyMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
    setCompanyMappingList(state, action) {
      state.companyMappingList = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllCompanies,
  setCompany,
  setPaginationDetails,
  setPage,
  setCompanyError,
  setCompanyMessage,
  setRowsPerPage,
  setCompanyMappingList,
} = companySlice.actions;
export default companySlice.reducer;
