import { serverDownErrorMessage } from "@/data/common-errors";
import {
  newDistributorGRNTypeError,
  setAllNewDistributorGRNDetails,
  setNewDistributorGRN,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/inventory/new-distributor-grn-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "grndirect";

// POST /api/grndirect/create
export const createDistrubutorGRN = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/grndirect
export const getAllGrnDistributorDirect = async (
  page?: number,
  pageSize?: number,
  searchKeyword?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (searchKeyword) params.append("searchKeyword", searchKeyword);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );

    const DistributorGRNDetails = get(response, "data.GRNDirect", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllNewDistributorGRNDetails(DistributorGRNDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(newDistributorGRNTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

// POST /api/grndirect/patch
export const deleteDistrubutorGRN = async (id: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${id}`,
      {
        isDelete: true,
      }
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/grndirect/create
export const getDistrubutorGRNById = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    dispatch(setNewDistributorGRN(response.data.result));
  } catch (error) {
    throw new Error();
  }
};

// POST /api/grndirect/create
export const updateDistrubutorGRN = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${id}`,
      data
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// POST /api/grndirect/submitdelete
export const deleteSubmittedNewGRN = async (id: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/delete/${id}`, {});
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// POST /api/grndirect/create
export const partialDeleteSubmittedNewGRN = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/partialdelete/${id}`,
      data
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};
