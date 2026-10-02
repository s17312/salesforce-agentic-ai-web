import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllAssetModelDetails,
  setAssetModel,
  setAssetModelError,
  setAssetModelMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/asset-model-slice";
import { dispatch } from "@/redux/store";
import { FormValuesPropsAssetModel } from "@/types/asset-model-types";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "assetmodel";

export const getAllAssetModelDetails = async (
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
    const assetModelDetails = get(response, "data.AssetModel", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllAssetModelDetails(assetModelDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setAssetModelError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateAssetModelStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedAssetModelData = get(response, "data.result", []);
    dispatch(
      setAllAssetModelDetails({
        data: updatedAssetModelData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setAssetModelError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAssetModelById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentAssetModelData = get(response, "data.result", []);
        dispatch(setAssetModel(currentAssetModelData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetModelError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const createAssetModel = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setAssetModelMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetModelError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateAssetModel = async (
  uid: number | undefined,
  data: FormValuesPropsAssetModel
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setAssetModelMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetModelError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
