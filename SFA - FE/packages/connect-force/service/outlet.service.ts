import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllOutlets,
  setOutlet,
  setOutletError,
  setOutletMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/outlet-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "Outlet";

export const createOutlet = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setOutletMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createBulkOutletList = async (file: File) => {
  const form = new FormData();
  form.append("uploadedFile", file);

  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/temp/create/bulk`,
      form,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const resData = response.data;

    return resData.data;
  } catch (error: any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllOutlets = async (
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
        const distributionData = get(response, "data.Outlet", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutlets(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getOutletById = async (uid: number) => {
  dispatch(startLoading());
  try {
    await axiosInstance
      .get<OutletPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntOutletData = get(response, "data.result", []);
        dispatch(setOutlet(curruntOutletData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateOutlet = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setOutletMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

//patch for active inactive
export const updateOutletStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedOutletsData = get(response, "data.result", []);
    dispatch(setAllOutlets({ data: updatedOutletsData, update: true }));
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

//Optimize the outlet get all API
export const getAllOutletsList = async (
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
        `${NEXT_PUBLIC_API_URL}${baseUrl}/new?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.Outlet", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutlets(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
