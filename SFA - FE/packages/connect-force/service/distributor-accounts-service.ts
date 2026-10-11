import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllDistributorAccountsDetails,
  startLoading,
  setPaginationDetails,
  setDistributorAccountsError,
  setDistributorAccountsMessage,
  setDistributorAccounts,
  setDistributorAccountsAssignedDetails,
} from "@/redux/slices/distributor-accounts-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsDistributorAccounts } from "@/types/distributor-accounts-type";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "account";

export const getAllDistributorAccounts = async (
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
    let sortCol = "";
    let sortOrd = "";

    if (typeof pageOrParams === "object" && pageOrParams !== null) {
      pageNum = pageOrParams.page ?? 1;
      sizeNum = pageOrParams.pageSize ?? 10;
      searchVal = pageOrParams.searchKeyword || "";
      sortCol = pageOrParams.sortColumn || "";
      sortOrd = pageOrParams.sortOrder || "";
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
    const distributorAccountDetails = get(response, "data.Account", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllDistributorAccountsDetails(distributorAccountDetails));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: distributorAccountDetails,
      total: paginationInfo?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error: ErrorType | any) {
    dispatch(setDistributorAccountsError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.Description || serverDownErrorMessage);
  }
};

export const updateDistributorAccountsStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedDistributorAccountsData = get(response, "data.result", []);
    dispatch(
      setAllDistributorAccountsDetails({
        data: updatedDistributorAccountsData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setDistributorAccountsError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].Description);
  }
};

export const createDistributorAccount = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setDistributorAccountsMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorAccountsError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateDistributorAccount = async (
  uid: number | undefined,
  data: FormValuesPropsDistributorAccounts
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setDistributorAccountsMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorAccountsError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getDistributorAccountById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentDistributorAccountData = get(response, "data.result", []);
        dispatch(setDistributorAccounts(currentDistributorAccountData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorAccountsError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getDistributorAssignedAccounts = async (distributorId: number | null, paymentType: number) => {
  try {
    await axiosInstance.get(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor`,
        {
          params: {
            DistributorId: distributorId,
            PaymentType: paymentType,
          },
        }
      ).then((response) => {
        const currentDistributorAccountData = get(response, "data.Account", []);
        dispatch(setDistributorAccountsAssignedDetails(currentDistributorAccountData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorAccountsError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};