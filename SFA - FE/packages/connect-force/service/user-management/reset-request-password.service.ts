import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllRequestedListDetails,
  setPaginationDetails,
  setRequestedDetailError,
  startLoading,
} from "@/redux/slices/user-management/reset-requested-password-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "forgetpassword";

export const getAllRequestedResetPasswordList = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("searchKeyword", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const requestedResetPasswordDetails = get(
      response,
      "data.ForgetPassword",
      []
    );
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllRequestedListDetails(requestedResetPasswordDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setRequestedDetailError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
