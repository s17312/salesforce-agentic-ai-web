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
  pageOrParams?: number | {
    page?: number;
    pageSize?: number;
    searchKeyword?: string;
    search?: string;
    sortColumn?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
  },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    let p: number | undefined;
    let ps: number | undefined;
    let kw: string | undefined;
    let col: string | undefined;
    let ord: string | undefined;
    let active: boolean | undefined;

    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      p = pageOrParams.page;
      ps = pageOrParams.pageSize;
      kw = pageOrParams.searchKeyword || pageOrParams.search;
      col = pageOrParams.sortColumn || pageOrParams.sortBy;
      ord = pageOrParams.sortOrder;
      active = pageOrParams.isActive;
    } else {
      p = pageOrParams;
      ps = pageSize;
      kw = search;
      col = sortBy;
      ord = sortOrder;
      active = isActive;
    }

    if (p) params.append("page", p.toString());
    if (ps) params.append("pageSize", ps.toString());
    if (kw) params.append("searchKeyword", kw);
    params.append("sortColumn", col || "uId");
    params.append("sortOrder", ord || "desc");
    if (active !== undefined) params.append("IsActive", active.toString());

    await axiosInstance
      .get<OutletPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.MainOutlet", []);
        const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
        dispatch(setAllMainOutlets(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setMainOutletError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
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
