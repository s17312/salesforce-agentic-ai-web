import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllProductGroups,
  setPaginationDetails,
  setProductGroup,
  setProductGroupError,
  setProductGroupMessage,
} from "@/redux/slices/product-group-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { ProductGroupPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "productgroup";

export const getAllProductGroups = async () => {
  try {
    await axiosInstance
      .get<ProductGroupPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const productGroupData = get(response, "data.ProductGroup", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProductGroups(productGroupData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error();
  }
};
export const getAllActiveProductGroups = async () => {
  try {
    await axiosInstance
      .get<ProductGroupPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const productGroupData = get(response, "data.ProductGroup", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProductGroups(productGroupData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error();
  }
};
export const createProductGroup = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setProductGroupMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductGroupError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getProductGroupById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentProductGroup = get(response, "data.result", []);
        dispatch(setProductGroup(currentProductGroup));
      });
  } catch (error: TypeError | any) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateProductGroup = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setProductGroupMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductGroupError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new error(error.response.data.details[0].description);
  }
};

export const updateProductGroupStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedProductGroupData = get(response, "data.result", []);
    dispatch(
      setAllProductGroups({ data: updatedProductGroupData, update: true })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
