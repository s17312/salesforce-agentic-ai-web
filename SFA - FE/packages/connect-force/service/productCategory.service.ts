import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllProductCategories,
  setPaginationDetails,
  setProductCategory,
  setProductCategoryError,
  setProductcategoryMessage,
} from "@/redux/slices/product-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { ProductCategoryPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "productcategory";

export const createProductCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setProductcategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllProductCategory = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<ProductCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const productcategoryData = get(response, "data.productCategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProductCategories(productcategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setProductCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};
export const getAllActiveProductCategory = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<ProductCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const productcategoryData = get(response, "data.productCategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProductCategories(productcategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setProductCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};
export const getProductCategoryById = async (uid: number) => {
  try {
    await axiosInstance
      .get<ProductCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`
      )
      .then((response) => {
        const curruntProductCategoryData = get(response, "data.result", []);
        dispatch(setProductCategory(curruntProductCategoryData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setProductCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateProductCategory = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/Update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setProductcategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateProductCategoryStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updateProductCategory = get(response, "data.result", []);
    dispatch(
      setAllProductCategories({ data: updateProductCategory, update: true })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setProductCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
