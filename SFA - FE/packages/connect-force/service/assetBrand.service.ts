import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllAssetBrandDetails,
  setAssetBrand,
  setAssetBrandError,
  setAssetBrandMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/asset-brand-slice";
import { dispatch } from "@/redux/store";
import { FormValuesPropsAssetBrand } from "@/types/assetBrand-types";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "assetbrand";

export const getAllAssetBrandDetails = async (
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
    const assetBrandDetails = get(response, "data.AssetBrand", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllAssetBrandDetails(assetBrandDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setAssetBrandError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateAssetBrandStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedAssetBrandData = get(response, "data.result", []);
    dispatch(
      setAllAssetBrandDetails({
        data: updatedAssetBrandData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setAssetBrandError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAssetBrandById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentAssetBrandData = get(response, "data.result", []);
        dispatch(setAssetBrand(currentAssetBrandData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetBrandError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const createAssetBrand = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setAssetBrandMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetBrandError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateAssetBrand = async (
  uid: number | undefined,
  data: FormValuesPropsAssetBrand
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setAssetBrandMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setAssetBrandError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
