import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllUserProfileDetails,
  setPaginationDetails,
  setUserProfile,
  setUserProfileError,
  setUserProfileMessage,
  startLoading,
} from "@/redux/slices/user-management/user-profile-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { UserProfilePayload } from "@/types/user-management/user-profile-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrlCreate = "auth";
const baseUrl = "user";

export const getAllUserProfileDetails = async (
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
    const userProfileDetails = get(response, "data.User", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllUserProfileDetails(userProfileDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setUserProfileError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createUserProfile = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrlCreate}/create`,
      data
    );
    const resData = response.data;
    dispatch(setUserProfileMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setUserProfileError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getUserProfileById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const userProfileData = get(response, "data.result", []);
        dispatch(setUserProfile(userProfileData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setUserProfileError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateUserProfile = async (
  userDetailsUId: number | undefined,
  data: UserProfilePayload
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${userDetailsUId}`,
      data
    );
    const resData = response.data;
    dispatch(setUserProfileMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setUserProfileError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateUserProfileStatus = async (
  userDetailsUId: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${userDetailsUId}`,
      data
    );
    const updatedUserProfileData = get(response, "data.result", []);
    dispatch(
      setAllUserProfileDetails({
        data: updatedUserProfileData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setUserProfileError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
