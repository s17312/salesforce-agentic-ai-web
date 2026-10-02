import { UserRoleAssignmentState } from "@/types/user-management/user-role-assignment-types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserRoleAssignmentState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    userRoleAssignmentDetails: [],
    distributorView:[],
    repBydistri: [],
    isActive: true,
    userRoleAssignment: null,
    message: null,
    newPage: 0,
    newRowsPerPage: 100,
    };

export const userRoleAssignmentSlice = createSlice({
    name: "UserRoleAssignment",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllUserRoleAssignmentDetails(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.userRoleAssignmentDetails.findIndex(
                    (d) => d.uId === action.payload.data.uId
                );

                if (index !== -1) {
                    state.userRoleAssignmentDetails[index] = action.payload.data;
                }
            } else {
                state.userRoleAssignmentDetails = action.payload;
            }
        },
        setDistributorView(state, action) {
            state.isLoading = false;
            state.distributorView = action.payload;
        },
        setRepBydistri(state, action) {
            state.isLoading = false;
            state.repBydistri = action.payload;
        },
        setUserRoleAssignment(state, action) {
            state.isLoading = false;
            state.userRoleAssignment = action.payload;
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
        setUserRoleAssignmentError(state, action) {
            state.error = action.payload;
        },
        setUserRoleAssignmentMessage(state, action) {
            state.message = action.payload;
            state.error = null;
        },
    },
});

export const {
    startLoading,
    setAllUserRoleAssignmentDetails,
    setDistributorView,
    setRepBydistri,
    setUserRoleAssignment,
    setPaginationDetails,
    setPage,
    setRowsPerPage,
    setUserRoleAssignmentError,
    setUserRoleAssignmentMessage,
} = userRoleAssignmentSlice.actions;
export default userRoleAssignmentSlice.reducer;