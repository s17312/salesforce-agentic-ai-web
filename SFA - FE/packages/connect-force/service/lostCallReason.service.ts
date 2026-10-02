import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllLostCallReasonDetails,
  setPaginationDetails,
  setLostCallReason,
  setLostCallReasonError,
  setLostCallReasonMessage,
  startLoading,

} from "@/redux/slices/lost-call-reason-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsLostCallReason } from "@/types/lost-call-reason-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "lostCallReason";

export const getAllLostCallReasons = async (
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
    const lostCallReasonDetails = get(response, "data.LostCallReason", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllLostCallReasonDetails(lostCallReasonDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setLostCallReasonError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].Description);
  }
};

export const updateLostCallReasonStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedLostCallReasonData = get(response, "data.result", []);
    dispatch(
      setAllLostCallReasonDetails({
        data: updatedLostCallReasonData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setLostCallReasonError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].Description);
  }
};

export const createLostCallReasons = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}`,
      data
    );
    const resData = response.data;
    dispatch(setLostCallReasonMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLostCallReasonError(
        error.response.data?.details[0]?.Description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].Description);
  }
};

export const updateLostCallReasons = async (
  uid: number | undefined,
  data: FormValuesPropsLostCallReason
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setLostCallReasonMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLostCallReasonError(
        error.response.data?.details[0]?.Description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].Description);
  }
};

export const getLostReasonByID = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentLostCallReasonData = get(response, "data.result", []);
        dispatch(setLostCallReason(currentLostCallReasonData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setLostCallReasonError(
        error.response.data?.details[0]?.Description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].Description);
  }
};
