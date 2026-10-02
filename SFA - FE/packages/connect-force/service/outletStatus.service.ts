import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllOutletStatus,
  setOutletStatus,
  setOutletStatusError,
  setOutletStatusMessage,
  setPaginationDetails,
} from "@/redux/slices/outlet-status-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletStatusPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "outletstatus";

export const createOutletStatus = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setOutletStatusMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setOutletStatusError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllActiveOutletStatus = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<OutletStatusPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const outletStatusData = get(response, "data.outletStatus", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutletStatus(outletStatusData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setOutletStatusError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllOutletStatus = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<OutletStatusPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const outletStatusData = get(response, "data.outletStatus", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutletStatus(outletStatusData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setOutletStatusError(serverDownErrorMessage));
    throw new Error();
  }
};

export const updateOutletStatus = async (
  uId: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uId}`,
      data
    );
    const resData = response.data;
    dispatch(setOutletStatusMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setOutletStatusError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getOutletStatusById = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletStatusPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntOutletStatusData = get(response, "data.result", []);
        dispatch(setOutletStatus(curruntOutletStatusData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setOutletStatusError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateOutletStatusStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedOutletStatusData = get(response, "data.result", []);
    dispatch(
      setAllOutletStatus({ data: updatedOutletStatusData, update: true })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletStatusError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
