import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllPaymentModes,
  setPaginationDetails,
  setPaymentModeError,
  setPaymentMode,
} from "@/redux/slices/payment-mode-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { PaymentModePagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "paymentmode";

export const createPaymentModes = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setPaymentModeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllPaymentModes = async (
  pageOrParams?:
    | number
    | {
        page?: number;
        pageSize?: number;
        searchKeyword?: string;
        sortColumn?: string;
        sortOrder?: string;
        isActive?: boolean | string;
      },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    const params = new URLSearchParams();
    let pageNum = 1;
    let sizeNum = 100;
    let searchVal = "";
    let sortCol = "uId";
    let sortOrd = "desc";

    if (typeof pageOrParams === "object" && pageOrParams !== null) {
      pageNum = pageOrParams.page ?? 1;
      sizeNum = pageOrParams.pageSize ?? 10;
      searchVal = pageOrParams.searchKeyword || "";
      sortCol = pageOrParams.sortColumn || "uId";
      sortOrd = pageOrParams.sortOrder || "desc";
      if (pageOrParams.isActive !== undefined && pageOrParams.isActive !== "") {
        params.append("IsActive", String(pageOrParams.isActive));
      }
    } else {
      if (pageOrParams) pageNum = pageOrParams;
      if (pageSize) sizeNum = pageSize;
      if (search) searchVal = search;
      if (sortBy) sortCol = sortBy;
      if (sortOrder) sortOrd = sortOrder;
    }

    if (pageNum) params.append("page", pageNum.toString());
    if (sizeNum) params.append("pageSize", sizeNum.toString());
    if (searchVal) params.append("searchKeyword", searchVal);
    if (sortCol) params.append("sortColumn", sortCol);
    if (sortOrd) params.append("sortOrder", sortOrd);

    const response = await axiosInstance.get<PaymentModePagedResult>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const paymentmodeData = get(response, "data.PaymentMode", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllPaymentModes(paymentmodeData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: paymentmodeData,
      total: (paginationInfo as any)?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error) {
    dispatch(setPaymentModeError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActivePaymentModes = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<PaymentModePagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const paymentmodeData = get(response, "data.PaymentMode", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllPaymentModes(paymentmodeData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setPaymentModeError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getPaymentModesById = async (uid: number) => {
  try {
    await axiosInstance
      .get<PaymentModePagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`
      )
      .then((response) => {
        const curruntPaymentModeData = get(response, "data.result", []);
        dispatch(setPaymentMode(curruntPaymentModeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setPaymentModeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePaymentMode = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setPaymentModeError(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setPaymentModeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePaymentModeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedPaymentModeData = get(response, "data.result", []);
    dispatch(setAllPaymentModes({data: updatedPaymentModeData, update: true}));
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setPaymentModeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
