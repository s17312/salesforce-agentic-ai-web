import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllVehicleCategoryDetails,
  setPaginationDetails,
  setVehicleCategory,
  setVehicleCategoryError,
  setVehicleCategoryMessage,
  startLoading,
} from "@/redux/slices/vehicle-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsVehicleCategory } from "@/types/vehicle-category-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "vehiclecategory";

export const getAllVehicleCategoryDetails = async (
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
    const vehicleCategoryDetails = get(response, "data.VehicleCategory", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllVehicleCategoryDetails(vehicleCategoryDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setVehicleCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateVehicleCategoryStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedVehicleCategoryData = get(response, "data.result", []);
    dispatch(
      setAllVehicleCategoryDetails({
        data: updatedVehicleCategoryData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setVehicleCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createVehicleCategories = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}`,
      data
    );
    const resData = response.data;
    dispatch(setVehicleCategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setVehicleCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateVehicleCategories = async (
  uid: number | undefined,
  data: FormValuesPropsVehicleCategory
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setVehicleCategoryMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setVehicleCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getVehicleCategoryById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentVehicleCategoryData = get(response, "data.result", []);
        dispatch(setVehicleCategory(currentVehicleCategoryData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setVehicleCategoryError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
