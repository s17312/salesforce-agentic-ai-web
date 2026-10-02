import { serverDownErrorMessage } from "@/data/common-errors";
import { setDiscountRepresentativesIsTrue } from "@/redux/slices/mappers/discount-representative-slice";
import {
  setAllSalesRepresentativeDetails,
  setSalesRepresentativeMessage,
  setPaginationDetails,
  startLoading,
  setSalesRepresentativeError,
} from "@/redux/slices/sales-representative-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "discountrep";

// Discount -> Outlet assign Mapping
export const assignDiscountRepresentativeMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setSalesRepresentativeMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Discount -> Outlet unassign Mapping
export const unassignDiscountRepresentativeMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setSalesRepresentativeMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get all assined Outlets by Discount Id
export const getAllRepresentativeByDiscountIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?DiscountId=${uid}&IsChecked=true&IsActive=true`
      )
      .then((response) => {
        const representativeListData = get(response, "data.Reps", []);
        dispatch(setDiscountRepresentativesIsTrue(representativeListData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get all representatives with pagination, search, sort, and filter options
export const getAllRepresentativeView = async (
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
      .get<OutletPagedResult>(
        `${NEXT_PUBLIC_API_URL}representative/new?${params.toString()}`
      )
      .then((response) => {
        const representativeData = get(response, "data.Representative", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllSalesRepresentativeDetails(representativeData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setSalesRepresentativeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
