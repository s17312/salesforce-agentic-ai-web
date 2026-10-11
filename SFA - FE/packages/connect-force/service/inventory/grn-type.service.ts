import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllGRNTypeDetails,
  startLoading,
  setPaginationDetails,
  setGRNTypeError,
  setGRNTypeMessage,
  setGRNType,
} from "@/redux/slices/inventory/grn-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsGRNType } from "@/types/inventory/grn-type-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "grntype/";

export const getAllGRNTypeDetails = async (
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
  searchKeyword?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();
    let pageNum = 1;
    let sizeNum = 100;
    let searchVal = "";
    let sortCol = "";
    let sortOrd = "";

    if (typeof pageOrParams === "object" && pageOrParams !== null) {
      pageNum = pageOrParams.page ?? 1;
      sizeNum = pageOrParams.pageSize ?? 10;
      searchVal = pageOrParams.searchKeyword || "";
      sortCol = pageOrParams.sortColumn || "";
      sortOrd = pageOrParams.sortOrder || "";
      if (pageOrParams.isActive !== undefined && pageOrParams.isActive !== "") {
        params.append("IsActive", String(pageOrParams.isActive));
      }
    } else {
      if (pageOrParams) pageNum = pageOrParams;
      if (pageSize) sizeNum = pageSize;
      if (searchKeyword) searchVal = searchKeyword;
      if (sortBy) sortCol = sortBy;
      if (sortOrder) sortOrd = sortOrder;
      if (isActive !== undefined) params.append("IsActive", isActive.toString());
    }

    if (pageNum) params.append("page", pageNum.toString());
    if (sizeNum) params.append("pageSize", sizeNum.toString());
    if (searchVal) params.append("searchKeyword", searchVal);
    if (sortCol) params.append("sortColumn", sortCol);
    if (sortOrd) params.append("sortOrder", sortOrd);

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const grnTypeDetails = get(response, "data.GRNType", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllGRNTypeDetails(grnTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: grnTypeDetails,
      total: paginationInfo?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error: ErrorType | any) {
    dispatch(setGRNTypeError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
  }
};

export const getAllGrnTypes = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}`
    );
    const grnTypeDetails = get(response, "data.GRNType", []);
    dispatch(setAllGRNTypeDetails(grnTypeDetails));
  } catch {}
};

export const updateGRNTypeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uid}`,
      data
    );
    const updatedGRNTypeData = get(response, "data.result", []);
    dispatch(
      setAllGRNTypeDetails({
        data: updatedGRNTypeData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setGRNTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createGRNType = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}create`,
      data
    );
    const resData = response.data;
    dispatch(setGRNTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setGRNTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateGRNType = async (
  uid: number | undefined,
  data: FormValuesPropsGRNType
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setGRNTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setGRNTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getGRNTypeById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}${uid}`)
      .then((response) => {
        const currentGRNTypeData = get(response, "data.result", []);
        dispatch(setGRNType(currentGRNTypeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setGRNTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
