import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllUserRoleDetails,
  setPaginationDetails,
  setUserRole,
  setUserRoleError,
  setUserRoleMessage,
  setUserRoleType,
  startLoading,
} from "@/redux/slices/user-role-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsUserRole } from "@/types/user-role-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "role";

export const getAllUserRolesDetails = async (
  page?: number,
  pageSize?: number,
  searchKeyword?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean,
  isArchive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (searchKeyword) params.append("searchKeyword", searchKeyword);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());
    if (isArchive !== undefined)
      params.append("IsArchive", isArchive.toString());

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const userRoleDetails = get(response, "data.Role", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllUserRoleDetails(userRoleDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setUserRoleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateUserRoleStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedUserRoleData = get(response, "data.result", []);
    dispatch(
      setAllUserRoleDetails({
        data: updatedUserRoleData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setUserRoleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createUserRole = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setUserRoleMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setUserRoleError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateUserRole = async (
  uid: number | undefined,
  data: FormValuesPropsUserRole
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setUserRoleMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setUserRoleError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getUserRoleById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentUserRoleData = get(response, "data.result", []);
        dispatch(setUserRole(currentUserRoleData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setUserRoleError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllUserRoleTypeDetails = async () => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/roletype`)
      .then((response) => {
        const userRoleTypeDetails = get(response, "data.RoleType", []);
        dispatch(setUserRoleType(userRoleTypeDetails));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
