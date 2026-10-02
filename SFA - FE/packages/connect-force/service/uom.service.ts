import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllUOMs,
  setPaginationDetails,
  setUOM,
  setUOMError,
  setUOMMessage,
  startLoading,
} from "@/redux/slices/uom-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { UOMPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "uom";

export const getAllUOMs = async (
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
    await axiosInstance
      .get<UOMPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
      )
      .then((response) => {
        const uomData = get(response, "data.UOM", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllUOMs(uomData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setUOMError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveUOMs = async () => {
  try {
    await axiosInstance
      .get<UOMPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true&IsNotBaseUnit=true`)
      .then((response) => {
        const uomData = get(response, "data.UOM", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllUOMs(uomData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setUOMError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllBaseActiveUOMs = async () => {
  try {
    await axiosInstance
      .get<UOMPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true&IsNotBaseUnit=false`
      )
      .then((response) => {
        const uomData = get(response, "data.UOM", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllUOMs(uomData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setUOMError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getUOMById = async (uid: number) => {
  try {
    await axiosInstance
      .get<UOMPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntUOMData = get(response, "data.result", []);
        dispatch(setUOM(curruntUOMData));
      });
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setUOMError(newError));
    throw new Error(newError);
  }
};

export const createUOM = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setUOMMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setUOMError(newError));
    throw new Error(newError);
  }
};

export const updateUOM = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setUOMMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setUOMError(newError));
    throw new Error(newError);
  }
};

export const updateUOMStatus = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedBusinessData = get(response, "data.result", []);
    dispatch(setAllUOMs({ data: updatedBusinessData, update: true }));

    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setUOMError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
