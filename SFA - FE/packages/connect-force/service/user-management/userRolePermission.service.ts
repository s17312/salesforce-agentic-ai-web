import { setUserRoleCategory, setUserRolePermissionModules, setUserRolePermissionModulesForAuth } from "@/redux/slices/user-management/user-role-permission-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "userRolePermission";

export const getAllUserRolePermissionDetailsByRole = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    const currentPermissions = get(response, "data", []);
    const categoryData = {
      categoryUId: currentPermissions.categoryUId,
      categoryName: currentPermissions.categoryName,
    };
    dispatch(setUserRolePermissionModules(currentPermissions.modules)); 
    dispatch(setUserRoleCategory(categoryData));
  } catch (error) {
    console.error("Error fetching user role permissions:", error);
    throw new Error("Failed to fetch user role permissions");
  }
};

export const getAllUserRolePermissionDetailsByRoleForAuth = async (
  id: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    const currentPermissions = get(response, "data", []);
    const categoryData = {
      categoryUId: currentPermissions.categoryUId,
      categoryName: currentPermissions.categoryName,
    };
    dispatch(setUserRolePermissionModulesForAuth(currentPermissions.modules));
  } catch (error) {
    console.error("Error fetching user role permissions:", error);
    throw new Error("Failed to fetch user role permissions");
  }
};

// /api/userRolePermission/create
export const createUserRolePermission = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user role permission:", error);
    throw new Error("Failed to create user role permission");
  }
};