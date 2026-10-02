import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllBusinessCategories,
  setPaginationDetails,
  setBusinessCategoryError,
  setBusinessCategory,
  setBusinesscategoryMessage,
} from "@/redux/slices/business-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { BusinessCategoryPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "businesscategory";

export const createBusinessCategorys = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setBusinesscategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setBusinessCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllBusinessCategorys = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<BusinessCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const businesscategoryData = get(response, "data.businesscategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllBusinessCategories(businesscategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setBusinessCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveBusinessCategorys = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<BusinessCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const businesscategoryData = get(response, "data.businesscategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllBusinessCategories(businesscategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setBusinessCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getBusinessCategorysById = async (uid: number) => {
  try {
    await axiosInstance
      .get<BusinessCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`
      )
      .then((response) => {
        const curruntBusinesscategoryData = get(response, "data.result", []);
        dispatch(setBusinessCategory(curruntBusinesscategoryData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setBusinessCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateBusinessCategory = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setBusinesscategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setBusinessCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateBusinessCatergoryStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedBusinessData = get(response, "data.result", []);
    dispatch(
      setAllBusinessCategories({ data: updatedBusinessData, update: true })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setBusinessCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
