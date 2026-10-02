import { UserRoleState } from "@/types/user-role-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserRoleState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  userRoleDetails: [],
  isActive: true,
  userRole: null,
  userRoleTypes: [],
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const userRoleSlice = createSlice({
  name: "UserRole",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllUserRoleDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.userRoleDetails.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.userRoleDetails[index] = action.payload.data;
        }
      } else {
        state.userRoleDetails = action.payload;
      }
    },
    setUserRole(state, action) {
      state.isLoading = false;
      state.userRole = action.payload;
    },
    setUserRoleType(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.userRoleTypes.findIndex(
          (d) => d.uId === action.payload.data.uId
        );

        if (index !== -1) {
          state.userRoleTypes[index] = action.payload.data;
        }
      } else {
        state.userRoleTypes = action.payload;
      }
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
    setUserRoleError(state, action) {
      state.error = action.payload;
    },
    setUserRoleMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllUserRoleDetails,
  setUserRole,
  setUserRoleType,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setUserRoleError,
  setUserRoleMessage,
} = userRoleSlice.actions;
export default userRoleSlice.reducer;
