import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllDiscountDetails,
  setAllDiscountTypeDetails,
  setAllValueDiscountTypeDetails,
  setDiscount,
  setDiscountError,
  setDiscountMappingList,
  setDiscountProducts,
  setPaginationDetails,
} from "@/redux/slices/discount/discount-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "discountpromotions";

export const createDiscount = async (data: any) => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/create`, data);
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

export const updateDiscount = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(`${baseUrl}/update/${id}`, data);
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const UpdateDiscountStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updateDiscountData = get(response, "data.result", []);
    dispatch(setAllDiscountDetails({ data: updateDiscountData, update: true }));
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDiscountError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getDiscountAll = async () => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}?sortColumn=uId&sortOrder=desc`
    );
    const discountDetails = get(response, "data.Discount", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllDiscountDetails(discountDetails));
    dispatch(setPaginationDetails(paginationInfo));
    return get(response, "(await response).data.Discount", []);
  } catch (error) {
    throw new Error();
  }
};

export const getDiscountById = async (data: any) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${data}`);
    const discountDetails = get(response, "data.result", []);
    dispatch(setDiscount(discountDetails));
    return get(response, "", []);
  } catch (error) {
    throw new Error();
  }
};

//Get All Discount for mapping
export const getDiscountViewAllMapping = async () => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/discountMappingViewAll`)
      .then((response) => {
        const discountViewAllMappingData = get(
          response,
          "data.result.discountList",
          []
        );
        dispatch(setDiscountMappingList(discountViewAllMappingData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// GET api/companyproduct/productDetails/{companyId}
export const getDiscountProduct = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}companyproduct/productDetails/company?CompanyId=${companyId}&IsChecked=true&IsActive=true`
    );
    dispatch(setDiscountProducts(response.data.result.items));
  } catch (error) {
    throw new Error();
  }
};

export const getAllDiscountTypes = async (
  sortOrder?: string,
  isActive?: boolean
) => {
  try {
    const params = new URLSearchParams();
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getDiscountTypeAll?${params.toString()}`
    );
    const discountTypeDetails = get(response, "data.DiscountTypes", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllDiscountTypeDetails(discountTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setDiscountError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllValueDiscountTypes = async (
  sortOrder?: string,
  isActive?: boolean
) => {
  try {
    const params = new URLSearchParams();
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getValueDiscountTypeAll?${params.toString()}`
    );
    const valueDiscountTypeData = get(response, "data.DiscountValueType", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllValueDiscountTypeDetails(valueDiscountTypeData));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setDiscountError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
