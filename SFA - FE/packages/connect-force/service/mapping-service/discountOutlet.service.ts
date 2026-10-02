import { serverDownErrorMessage } from "@/data/common-errors";
import { setDiscountDistributorsIsTrue } from "@/redux/slices/mappers/discount-distributor-slice";
import { setDiscountOutletsIsTrue } from "@/redux/slices/mappers/discount-outlet-slice";
import {
  setAllOutlets,
  setOutletError,
  setOutletMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/outlet-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "discountoutlet";

// Discount -> Outlet assign Mapping
export const assignDiscountOutletMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setOutletMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Discount -> Outlet unassign Mapping
export const unassignDiscountOutletMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setOutletMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get all assined Outlets by Discount Id
export const getAllOutletsByDiscountIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true&IsChecked=true&DiscountId=${uid}`
      )
      .then((response) => {
        const outletListData = get(response, "data.Outlets", []);
        dispatch(setDiscountOutletsIsTrue(outletListData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get all Outlets with pagination, search, sort, and filter options
export const getAllOutletsView = async (
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
        `${NEXT_PUBLIC_API_URL}outlet/new?${params.toString()}`
      )
      .then((response) => {
        const outletData = get(response, "data.Outlet", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutlets(outletData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setOutletError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
