import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllPriceLists,
  setPaginationDetails,
  setPriceList,
  setPriceListError,
  startLoading,
} from "@/redux/slices/price-list-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "pricelist";

export const createBulkPriceList = async (file: File) => {
  const form = new FormData();
  form.append("uploadedFile", file);

  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/temp/create/bulk`,
      form,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const resData = response.data;

    return resData.data;
  } catch (error: any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllPriceLists = async (
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
    const priceLists = get(response, "data.PriceList", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllPriceLists(priceLists));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setPriceListError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getPriceListById = async (id: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`)
      .then((response) => {
        const priceList = get(response, "data.result", []);
        dispatch(setPriceList(priceList));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceListError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePriceList = async (uid: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceListError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePriceListStatus = async (uid: number, data: any) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setPriceListError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getProductAllByCompanyId = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductAllByCompanyId?CompanyUId=${companyId}`
    );
    return response.data["Company Product"];
  } catch (error: ErrorType | any) {
    console.error(error);
    throw new Error(error.response.data.details[0].description);
  }
};
