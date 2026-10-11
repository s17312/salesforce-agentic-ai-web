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
  pageOrParams?:
    | number
    | {
        page?: number;
        pageSize?: number;
        searchKeyword?: string;
        sortColumn?: string;
        sortOrder?: string;
        isActive?: boolean | string;
      },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();
    let pageNum = 1;
    let sizeNum = 100;
    let searchVal = "";
    let sortCol = "uId";
    let sortOrd = "desc";

    if (typeof pageOrParams === "object" && pageOrParams !== null) {
      pageNum = pageOrParams.page ?? 1;
      sizeNum = pageOrParams.pageSize ?? 10;
      searchVal = pageOrParams.searchKeyword || "";
      sortCol = pageOrParams.sortColumn || "uId";
      sortOrd = pageOrParams.sortOrder || "desc";
      if (pageOrParams.isActive !== undefined && pageOrParams.isActive !== "") {
        params.append("IsActive", String(pageOrParams.isActive));
      }
    } else {
      if (pageOrParams) pageNum = pageOrParams;
      if (pageSize) sizeNum = pageSize;
      if (search) searchVal = search;
      if (sortBy) sortCol = sortBy;
      if (sortOrder) sortOrd = sortOrder;
      if (isActive !== undefined) params.append("IsActive", isActive.toString());
    }

    if (pageNum) params.append("page", pageNum.toString());
    if (sizeNum) params.append("pageSize", sizeNum.toString());
    if (searchVal) params.append("searchKeyword", searchVal);
    if (sortCol) params.append("sortColumn", sortCol);
    if (sortOrd) params.append("sortOrder", sortOrd);

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const vehicleCategoryDetails = get(response, "data.VehicleCategory", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllVehicleCategoryDetails(vehicleCategoryDetails));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: vehicleCategoryDetails,
      total: paginationInfo?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error: ErrorType | any) {
    dispatch(setVehicleCategoryError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
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
