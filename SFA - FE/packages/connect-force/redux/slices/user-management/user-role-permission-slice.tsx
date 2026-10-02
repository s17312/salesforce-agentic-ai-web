import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    userRoleCategory: {},
    userRolePermissionModules: [],
    userRolePermissionModulesForAuth: [],
    userRoleData: {},
};

export const userRolePermissionSlice = createSlice({
    name: "UserRolePermission",
    initialState,
    reducers: {
        setUserRoleCategory(state, action) {
            state.userRoleCategory = action.payload;
        },
        setUserRolePermissionModules(state, action) {
            state.userRolePermissionModules = action.payload;
        },
        setUserRolePermissionModulesForAuth(state, action) {
            state.userRolePermissionModulesForAuth = action.payload;
        },
        setUserRoleData(state, action) {
            state.userRoleData = action.payload;
        }
    },
});

export const {
    setUserRoleCategory,
    setUserRolePermissionModules,
    setUserRolePermissionModulesForAuth,
    setUserRoleData,
} = userRolePermissionSlice.actions;
export default userRolePermissionSlice.reducer;