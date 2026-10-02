import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  assignCompanies: [],
  assignedCompanies: [],
  assignDistributors: [],
  assignedDistributors: [],
  distributorCompanies: [],
  distributorCompaniesMsg: null,
  distributorCompaniesIsTrue: [],
  companyDistributorsIsTrue: [],
  companiesDistributor: [],
};

export const distributorCompanySlice = createSlice({
  name: "DistributorCompanySlice",
  initialState,
  reducers: {
    setAssignCompanies(state, action) {
      state.assignCompanies = action.payload;
    },
    setAssignedCompanies(state, action) {
      state.assignedCompanies = action.payload;
    },
    setAssignDistributors(state, action) {
      state.assignDistributors = action.payload;
    },
    setAssignedDistributors(state, action) {
      state.assignedDistributors = action.payload;
    },
    setDistributorCompanies(state, action) {
      state.distributorCompanies = action.payload;
    },
    setDistributorCompaniesIsTrue(state, action) {
      state.distributorCompaniesIsTrue = action.payload;
    },
    setCompanyDistributorsIsTrue(state, action) {
      state.companyDistributorsIsTrue = action.payload;
    },
    setDistributorCompaniesMsg(state, action) {
      state.distributorCompaniesMsg = action.payload;
    },
    setCompaniesDistributor(state, action) {
      state.companiesDistributor = action.payload;
    },
  },
});

export const {
  setAssignCompanies,
  setAssignedCompanies,
  setAssignDistributors,
  setAssignedDistributors,
  setDistributorCompanies,
  setDistributorCompaniesIsTrue,
  setCompanyDistributorsIsTrue,
  setDistributorCompaniesMsg,
  setCompaniesDistributor,
} = distributorCompanySlice.actions;

export default distributorCompanySlice.reducer;
