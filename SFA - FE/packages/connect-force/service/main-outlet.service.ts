import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllMainOutlets,
  setAllParentOutlets,
  setMainOutlet,
  setMainOutletError,
  setMainOutletMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/main-outlet-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "mainOutlet";

export const createMainOutlet = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setMainOutletMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setMainOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllMainOutlets = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());
    await axiosInstance
      .get<OutletPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.MainOutlet", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllMainOutlets(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setMainOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getMainOutletById = async (uid: number) => {
  dispatch(startLoading());
  try {
    await axiosInstance
      .get<OutletPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentMainOutletData = get(response, "data.result", []);
        dispatch(setMainOutlet(currentMainOutletData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setMainOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateMainOutlet = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setMainOutletMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setMainOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

//patch for active inactive
export const updateMainOutletStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedOutletsData = get(response, "data.result", []);
    dispatch(setAllMainOutlets({ data: updatedOutletsData, update: true }));
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setMainOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllActiveMainOutlets = async () => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
    );
    const mainOutletData = get(response, "data.MainOutlet", []);
    dispatch(setAllParentOutlets(mainOutletData));
    return mainOutletData;
  } catch (error) {
    console.error("Error fetching distributors:", error);
    throw new Error();
  }
};
