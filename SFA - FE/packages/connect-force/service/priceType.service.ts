import { serverDownErrorMessage } from "@/data/common-errors";
import { setAllPriceTypeDetails, setPaginationDetails, setPriceType, setPriceTypeError, setPriceTypeMessage, startLoading } from "@/redux/slices/price-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "pricetype";

export const getAllPriceTypeDetails = async (
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
    const priceTypeDetails = get(response, "data.PriceType", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllPriceTypeDetails(priceTypeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setPriceTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePriceTypeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uid}`,
      data
    );
    const updatedPriceTypeData = get(response, "data.result", []);
    dispatch(
      setAllPriceTypeDetails({
        data: updatedPriceTypeData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setPriceTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createPriceType = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setPriceTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePriceType = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setPriceTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getPriceTypeById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentPriceTypeData = get(response, "data.result", []);
        dispatch(setPriceType(currentPriceTypeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setPriceTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
