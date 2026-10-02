import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllWarehouseCategoryDetails,
  setPaginationDetails,
  setWarehouseCategory,
  setWarehouseCategoryError,
  setWarehouseCategoryMessage,
  startLoading,
} from "@/redux/slices/warehouse-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsWarehouseCategory } from "@/types/warehousecaregory-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "warehousecategory";

export const getAllWarehouseCategoryDetails = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const warehouseCategoryDetails = get(
      response,
      "data.WarehouseCategory",
      []
    );
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllWarehouseCategoryDetails(warehouseCategoryDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateWarehouseCategoryStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedWarehouseCategoryData = get(response, "data.result", []);
    dispatch(
      setAllWarehouseCategoryDetails({
        data: updatedWarehouseCategoryData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createWarehouseCategories = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}`,
      data
    );
    const resData = response.data;
    dispatch(setWarehouseCategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setWarehouseCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateWarehouseCategories = async (
  uid: number | undefined,
  data: FormValuesPropsWarehouseCategory
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setWarehouseCategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setWarehouseCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getWarehouseCategoryById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentWarehouseCategoryData = get(response, "data.result", []);
        dispatch(setWarehouseCategory(currentWarehouseCategoryData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setWarehouseCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
