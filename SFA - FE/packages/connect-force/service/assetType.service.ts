import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllAssetTypeDetails,
  setAssetType,
  setAssetTypeError,
  setAssetTypeMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/asset-type-slice";
import { dispatch } from "@/redux/store";
import { FormValuesPropsAssetType } from "@/types/assetType-types";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "assettype";

export const getAllAssetTypeDetails = async (
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
    const assetTypeDetails = get(response, "data.AssetType", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllAssetTypeDetails(assetTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setAssetTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateAssetTypeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedAssetTypeData = get(response, "data.result", []);
    dispatch(
      setAllAssetTypeDetails({
        data: updatedAssetTypeData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setAssetTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAssetTypeById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentAssetTypeData = get(response, "data.result", []);
        dispatch(setAssetType(currentAssetTypeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const createAssetType = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setAssetTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateAssetType = async (
  uid: number | undefined,
  data: FormValuesPropsAssetType
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setAssetTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
