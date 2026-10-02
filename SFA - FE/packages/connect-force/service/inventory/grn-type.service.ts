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
  page?: number,
  pageSize?: number,
  searchKeyword?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
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

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const grnTypeDetails = get(response, "data.GRNType", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllGRNTypeDetails(grnTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setGRNTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
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
