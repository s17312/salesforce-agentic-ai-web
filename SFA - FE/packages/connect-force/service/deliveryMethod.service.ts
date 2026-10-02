import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllDeliveryMethodDetails,
  setDeliveryMethod,
  setDeliveryMethodError,
  setDeliveryMethodMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/delivery-method-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsDeliveryMethod } from "@/types/delivery-method-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "deliverymethod";

export const getAllDeliveryMethodDetails = async (
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
    const deliveryMethodDetails = get(response, "data.deliverymethod", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllDeliveryMethodDetails(deliveryMethodDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setDeliveryMethodError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateDeliveryMethodStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uid}`,
      data
    );
    const updatedDeliveryMethodData = get(response, "data.result", []);
    dispatch(
      setAllDeliveryMethodDetails({
        data: updatedDeliveryMethodData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setDeliveryMethodError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createDeliveryMethod = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setDeliveryMethodMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDeliveryMethodError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateDeliveryMethod = async (
  uid: number | undefined,
  data: FormValuesPropsDeliveryMethod
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setDeliveryMethodMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDeliveryMethodError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getDeliveryMethodById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentDeliveryMethodData = get(response, "data.result", []);
        dispatch(setDeliveryMethod(currentDeliveryMethodData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setDeliveryMethodError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
