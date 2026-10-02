import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllUserProfileDetails,
  setUserProfileError,
} from "@/redux/slices/user-management/user-profile-slice";
import {
  setAllUserRoleAssignmentDetails,
  setDistributorView,
  setPaginationDetails,
  setRepBydistri,
  setUserRoleAssignment,
  setUserRoleAssignmentError,
  setUserRoleAssignmentMessage,
  startLoading,
} from "@/redux/slices/user-management/user-role-assignment-slice";
import {
  setAllUserRoleDetails,
  setUserRoleError,
} from "@/redux/slices/user-role-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsUserRoleAssignment } from "@/types/user-management/user-role-assignment-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "userroleassignment";

export const getAllUserRoleAssignmentDetails = async (
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
    const userRoleAssignemntDetails = get(
      response,
      "data.UserRoleAssignment",
      []
    );
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllUserRoleAssignmentDetails(userRoleAssignemntDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setUserRoleAssignmentError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

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
      `${NEXT_PUBLIC_API_URL}role?${params.toString()}`
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

export const getAllUserProfileDetails = async (
  isActive?: boolean,
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();
    if (isActive !== undefined) params.append("IsActive", isActive.toString());
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}user?${params.toString()}`
    );
    const userProfileDetails = get(response, "data.User", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllUserProfileDetails(userProfileDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setUserProfileError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getDistributorsByCompanyUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}companydistributor/distributorDetails/company?CompanyId=${id}&IsChecked=true&IsActive=true`
    );
    const currentDistributors = get(response, "data.result.items", []);
    dispatch(setDistributorView(currentDistributors));
    return currentDistributors;
  } catch (error) {
    dispatch(setDistributorView([]));
    throw new Error();
  }
};

export const getAllActiveRepByDistriID = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}outlettransfer/getRepresentativeAllByDistributor?DistributorUId=${distributorId}&IsActive=true`
    );

    const repByDistri = get(response, "data.OutletTransfer", []);
    dispatch(setRepBydistri(repByDistri));
    return repByDistri;
  } catch (error) {
    dispatch(setRepBydistri([]));
    console.error("Error fetching representative:", error);
    throw new Error();
  }
};

export const createUserRoleAssignment = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setUserRoleAssignmentMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setUserRoleAssignmentError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getUserRoleAssignmentById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const userRoleAssignmentData = get(response, "data.result", []);
        dispatch(setUserRoleAssignment(userRoleAssignmentData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setUserRoleAssignmentError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateUserRoleAssignment = async (
  uid: number | undefined,
  data: FormValuesPropsUserRoleAssignment
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(
      setUserRoleAssignmentMessage("Role Assignment updated successfully")
    );
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setUserRoleAssignmentError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateUserRoleAssignmentActiveStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedUserRoleAssignmentData = get(response, "data.result", []);
    dispatch(
      setAllUserRoleAssignmentDetails({
        data: updatedUserRoleAssignmentData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setUserRoleAssignmentError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
