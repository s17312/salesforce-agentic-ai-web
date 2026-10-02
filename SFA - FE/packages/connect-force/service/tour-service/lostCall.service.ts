import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setLostCallError,
  setLostCallMessage,
} from "@/redux/slices/tour/lost-call/lost-call-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsLostCall } from "@/types/lost-call-types";
import axiosInstance from "@/utils/axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "lostcall";

export const createLostCall = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setLostCallMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLostCallError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateLostCall = async (
  uid: number | undefined,
  data: FormValuesPropsLostCall
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setLostCallMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLostCallError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const createLostCallBulk = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/bulkLostCall`,
      data
    );
    const resData = response.data.result;
    dispatch(setLostCallMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLostCallError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};
