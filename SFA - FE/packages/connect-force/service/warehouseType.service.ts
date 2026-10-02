import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllWarehouseTypes,
  setPaginationDetails,
  setWarehouseType,
  setWarehouseTypeError,
} from "@/redux/slices/warehouse-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "warehousetype";

export const getAllWarehouseTypes = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  try {
    // Construct the query parameters
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());

    // Make the API call with the constructed query parameters
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );

    // Process the response
    const warehouseTypeData = get(response, "data.warehouse", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllWarehouseTypes(warehouseTypeData));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error) {
    dispatch(setWarehouseTypeError(serverDownErrorMessage));
    throw new Error();
  }
};

export const updateWarehouseTypeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedWarehouseTypeData = get(response, "data.result", []);
    dispatch(
      setAllWarehouseTypes({
        data: updatedWarehouseTypeData,
        update: true,
      })
    );
    const resData = response.data;
    return resData;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createWarehouseType = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseTypeError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updateWarehouseType = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getWarehouseTypeById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentWarehouseData = get(response, "data.result", []);
        dispatch(setWarehouseType(currentWarehouseData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
