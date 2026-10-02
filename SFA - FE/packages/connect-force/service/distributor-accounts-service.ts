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
    const distributorAccountDetails = get(response, "data.Account", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllDistributorAccountsDetails(distributorAccountDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setDistributorAccountsError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].Description);
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