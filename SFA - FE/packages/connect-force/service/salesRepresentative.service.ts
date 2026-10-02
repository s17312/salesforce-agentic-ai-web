import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllSalesRepresentativeDetails,
  setPaginationDetails,
  setSalesRepresentative,
  setSalesRepresentativeError,
  setSalesRepresentativeMessage,
  startLoading,
} from "@/redux/slices/sales-representative-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsSalesRepresentative } from "@/types/sales-representative-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "representative";

export const getAllSalesRepresentativeDetails = async (
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
    const salesRepresentativeDetails = get(response, "data.Representative", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllSalesRepresentativeDetails(salesRepresentativeDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setSalesRepresentativeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateSalesRepresentativeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedSalesRepresentativeData = get(response, "data.result", []);
    dispatch(
      setAllSalesRepresentativeDetails({
        data: updatedSalesRepresentativeData,
        update: true,
      })
    );

    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setSalesRepresentativeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createSalesRepresentative = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setSalesRepresentativeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setSalesRepresentativeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateSalesRepresentative = async (
  uid: number | undefined,
  data: FormValuesPropsSalesRepresentative
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setSalesRepresentativeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setSalesRepresentativeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getSalesRepresentativeById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentSalesRepresentativeData = get(response, "data.result", []);
        dispatch(setSalesRepresentative(currentSalesRepresentativeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setSalesRepresentativeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
