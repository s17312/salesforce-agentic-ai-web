import { serverDownErrorMessage } from "@/data/common-errors";
import { setPaginationDetails } from "@/redux/slices/business-category-slice";
import {
  setAllOutletCategories,
  setOutletCategory,
  setOutletCategoryError,
} from "@/redux/slices/outlet-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletCategoryPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "outletcategory";

export const getAllOutletCategories = async () => {
  try {
    await axiosInstance
      .get<OutletCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const outletCategoryData = get(response, "data.OutletCategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutletCategories(outletCategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveOutletCategories = async () => {
  try {
    await axiosInstance
      .get<OutletCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const outletCategoryData = get(response, "data.OutletCategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutletCategories(outletCategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};

export const createOutletCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const getOutletCategoryById = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletCategoryPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntOutletCategoryData = get(response, "data.result", []);
        dispatch(setOutletCategory(curruntOutletCategoryData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updateOutletCategory = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updateOutletCategoryStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updateOutletCategoryStatusData = get(response, "data.result", []);

    dispatch(
      setAllOutletCategories({
        data: updateOutletCategoryStatusData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
