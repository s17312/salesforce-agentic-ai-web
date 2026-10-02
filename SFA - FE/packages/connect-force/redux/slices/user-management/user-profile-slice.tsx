import { UserProfileState } from "@/types/user-management/user-profile-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserProfileState = {
  isLoading: true,
  error: null,
  paginationDetails: null,
  userProfileDetails: [],
  isActive: true,
  userProfile: null,
  message: null,
  newPage: 0,
  newRowsPerPage: 100,
};

export const userProfileSlice = createSlice({
  name: "UserProfile",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    setAllUserProfileDetails(state, action) {
      state.isLoading = false;
      if (action.payload.update) {
        const index = state.userProfileDetails.findIndex(
          (d) => d.userDetailsUId === action.payload.data.userDetailsUId
        );

        if (index !== -1) {
          state.userProfileDetails[index] = action.payload.data;
        }
      } else {
        state.userProfileDetails = action.payload;
      }
    },
    setUserProfile(state, action) {
      state.isLoading = false;
      state.userProfile = action.payload;
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
    setUserProfileError(state, action) {
      state.error = action.payload;
    },
    setUserProfileMessage(state, action) {
      state.message = action.payload;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setAllUserProfileDetails,
  setUserProfile,
  setPaginationDetails,
  setPage,
  setRowsPerPage,
  setUserProfileError,
  setUserProfileMessage,
} = userProfileSlice.actions;
export default userProfileSlice.reducer;
