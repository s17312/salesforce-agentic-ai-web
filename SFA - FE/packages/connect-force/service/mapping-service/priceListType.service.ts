import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllPriceListTypeDetails,
  setPaginationDetails,
  setPriceListType,
  setPriceListTypeError,
  setPriceListTypeMessage,
  startLoading,
} from "@/redux/slices/price-list-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "pricelisttype";

export const getAllPriceListTypeDetails = async (
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
    const priceListTypeDetails = get(response, "data.PriceListType", []);
    const paginationInfo = get(response, "data.paging", {});

    dispatch(setAllPriceListTypeDetails(priceListTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setPriceListTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePriceListTypeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedPriceListTypeData = get(response, "data.result", []);
    dispatch(
      setAllPriceListTypeDetails({
        data: updatedPriceListTypeData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setPriceListTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createPriceListType = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setPriceListTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceListTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePriceListType = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setPriceListTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceListTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getPriceListTypeById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentPriceListTypeData = get(response, "data.result", []);
        dispatch(setPriceListType(currentPriceListTypeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setPriceListTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getPriceListAllByPriceType = async (priceTypeUId: number) => {
  dispatch(startLoading());
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getPriceListAllByPriceType?PriceTypeUId=${priceTypeUId}&IsActive=true`
    );
    const priceListTypeDetails = get(response, "data.PriceLists", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllPriceListTypeDetails(priceListTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setPriceListTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
